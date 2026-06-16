// Per-service status derivation — computes intake, delivery, and next-step
// information for each purchased service without requiring a DB migration.

import { getServiceById, isSubscriptionService } from './service-catalog';
import { getDocumentTypesForService } from './document-service-map';
import type { LucideIcon } from 'lucide-react';
import { FileText, Clock, FolderOpen, RefreshCw } from 'lucide-react';

export interface ServiceDeliveryStatus {
  serviceId: string;
  serviceName: string;
  intakeComplete: boolean;
  deliveryStatus: 'not_started' | 'in_progress' | 'delivered';
  documentsReady: number;
  documentsTotal: number;
}

export interface ServiceNextStep {
  title: string;
  description: string;
  action: string;
  link: string;
  icon: LucideIcon;
  urgency: number; // lower = more urgent (intake < preparing < delivered)
}

export function getServiceDeliveryStatuses(params: {
  purchasedServiceIds: string[];
  intakeCompleteForServices: string[];
  documents: { document_type: string; delivered_to_client: boolean; status: string }[];
  overallDeliveryStatus: string;
}): ServiceDeliveryStatus[] {
  const {
    purchasedServiceIds,
    intakeCompleteForServices,
    documents,
    overallDeliveryStatus,
  } = params;

  const completedSet = new Set(intakeCompleteForServices);

  return purchasedServiceIds.map((serviceId) => {
    const service = getServiceById(serviceId);
    const serviceName = service?.name ?? serviceId;
    const expectedDocTypes = getDocumentTypesForService(serviceId);
    const documentsTotal = expectedDocTypes.length;

    // Intake completeness for this specific service
    // Services with no intake sections (subscriptions) are always complete
    const intakeComplete =
      !service?.requiresIntake || completedSet.has(serviceId);

    // Filter documents belonging to this service
    const serviceDocTypes = new Set(expectedDocTypes);
    const serviceDocs = documents.filter((d) => serviceDocTypes.has(d.document_type));
    const documentsReady = serviceDocs.filter((d) => d.delivered_to_client).length;

    // Derive per-service delivery status
    let deliveryStatus: ServiceDeliveryStatus['deliveryStatus'];

    if (!intakeComplete) {
      deliveryStatus = 'not_started';
    } else if (documentsTotal === 0) {
      // Non-document service (e.g. monthly_care_plan, quarterly_refresh)
      deliveryStatus = overallDeliveryStatus as ServiceDeliveryStatus['deliveryStatus'];
    } else if (documentsReady === documentsTotal && documentsTotal > 0) {
      deliveryStatus = 'delivered';
    } else if (serviceDocs.some((d) => d.status !== 'pending') || documentsReady > 0) {
      deliveryStatus = 'in_progress';
    } else {
      deliveryStatus = 'not_started';
    }

    return {
      serviceId,
      serviceName,
      intakeComplete,
      deliveryStatus,
      documentsReady,
      documentsTotal,
    };
  });
}

export function getNextStepForService(status: ServiceDeliveryStatus): ServiceNextStep {
  const name = status.serviceName;
  const service = getServiceById(status.serviceId);

  // Subscription services — always active, no intake/delivery cycle
  if (isSubscriptionService(status.serviceId)) {
    const isMonthly = status.serviceId === 'monthly_care_plan';
    return {
      title: isMonthly ? 'Monthly Care Plan is active' : 'Quarterly Document Refresh is active',
      description: isMonthly
        ? 'Your documents can be updated monthly as your business evolves. Contact us when you need updates.'
        : 'Your documents can be refreshed each quarter as your business evolves. Contact us when you need updates.',
      action: 'View Status',
      link: '/personal/status',
      icon: RefreshCw,
      urgency: 40,
    };
  }

  // Tier-aware label for deliverables
  const tierLabel = service?.tier === 'operations' ? 'operations documents'
    : service?.tier === 'industry' ? 'industry documents'
    : 'deliverables';

  if (!status.intakeComplete) {
    return {
      title: `Complete intake for ${name}`,
      description: `Tell us about your business so we can prepare your ${tierLabel}.`,
      action: 'Complete Intake',
      link: '/personal/intake',
      icon: FileText,
      urgency: 10,
    };
  }

  if (status.deliveryStatus === 'not_started') {
    return {
      title: `Your ${name} is being prepared`,
      description: `We'll begin preparing your ${tierLabel} now that your intake is complete.`,
      action: 'View Status',
      link: '/personal/status',
      icon: Clock,
      urgency: 20,
    };
  }

  if (status.deliveryStatus === 'in_progress') {
    return {
      title: `Your ${name} documents are being prepared`,
      description:
        status.documentsTotal > 0
          ? `${status.documentsReady} of ${status.documentsTotal} documents ready.`
          : 'We are working on your deliverables.',
      action: 'View Status',
      link: '/personal/status',
      icon: Clock,
      urgency: 25,
    };
  }

  // delivered
  return {
    title: `Your ${name} documents are ready`,
    description:
      status.documentsTotal > 0
        ? `All ${status.documentsTotal} documents have been delivered and are ready for download.`
        : 'Your deliverables are ready.',
    action: 'View Documents',
    link: '/personal/documents',
    icon: FolderOpen,
    urgency: 30,
  };
}

/** Sort next steps so the most urgent action appears first. */
export function sortNextSteps(steps: ServiceNextStep[]): ServiceNextStep[] {
  return [...steps].sort((a, b) => a.urgency - b.urgency);
}

/**
 * Get a unified next step for the Overview page.
 * Instead of showing per-service intake buttons, this consolidates them into one action.
 * Returns null if all services are delivered (no action needed).
 */
export function getUnifiedNextStep(
  serviceStatuses: ServiceDeliveryStatus[]
): { type: 'intake' | 'preparing' | 'ready'; servicesNeedingIntake: string[]; allDelivered: boolean } | null {
  // Filter out subscription services — they don't follow the normal intake/delivery flow
  const regularServices = serviceStatuses.filter((s) => !isSubscriptionService(s.serviceId));

  if (regularServices.length === 0) {
    return null;
  }

  // Check which services need intake
  const servicesNeedingIntake = regularServices
    .filter((s) => !s.intakeComplete)
    .map((s) => s.serviceName);

  // Check if any intake is incomplete
  if (servicesNeedingIntake.length > 0) {
    return {
      type: 'intake',
      servicesNeedingIntake,
      allDelivered: false,
    };
  }

  // Check delivery status across all services
  const anyInProgress = regularServices.some((s) => s.deliveryStatus === 'in_progress');
  const anyNotStarted = regularServices.some((s) => s.deliveryStatus === 'not_started');
  const allDelivered = regularServices.every((s) => s.deliveryStatus === 'delivered');

  if (anyInProgress || anyNotStarted) {
    return {
      type: 'preparing',
      servicesNeedingIntake: [],
      allDelivered: false,
    };
  }

  if (allDelivered) {
    return {
      type: 'ready',
      servicesNeedingIntake: [],
      allDelivered: true,
    };
  }

  return null;
}

/**
 * Check whether a user is eligible for document refreshes.
 * Returns false if the subscription is cancelled/expired.
 */
function isRefreshEligible(purchasedServices: { service_id: string; status: string }[]): boolean {
  const sub = purchasedServices.find(
    (s) => s.service_id === 'monthly_care_plan' || s.service_id === 'quarterly_refresh'
  );
  if (!sub) return false;
  return sub.status === 'active';
}
