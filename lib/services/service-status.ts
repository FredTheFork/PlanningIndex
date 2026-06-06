// Per-service status derivation — computes intake, delivery, and next-step
// information for each purchased service without requiring a DB migration.

import { getServiceById } from './service-catalog';
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
    // Services with no intake sections (quarterly_refresh) are always complete
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
      // Non-document service (e.g. quarterly_refresh)
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

  // Quarterly refresh — always active, no intake/delivery cycle
  if (status.serviceId === 'quarterly_refresh') {
    return {
      title: 'Quarterly Document Refresh is active',
      description:
        'Your documents can be refreshed each quarter as your business evolves. Contact us when you need updates.',
      action: 'View Status',
      link: '/personal/status',
      icon: RefreshCw,
      urgency: 40,
    };
  }

  if (!status.intakeComplete) {
    return {
      title: `Complete intake for ${name}`,
      description: `Tell us about your business so we can prepare your ${name} deliverables.`,
      action: 'Complete Intake',
      link: '/personal/intake',
      icon: FileText,
      urgency: 10,
    };
  }

  if (status.deliveryStatus === 'not_started') {
    return {
      title: `Your ${name} is being prepared`,
      description: `We'll begin preparing your ${name} deliverables now that your intake is complete.`,
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
