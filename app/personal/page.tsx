'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { getServiceById } from '@/lib/services/service-catalog';
import { getServiceDeliveryStatuses, getUnifiedNextStep } from '@/lib/services/service-status';
import { isServiceDocumentService } from '@/lib/services/document-service-map';
import { FileText, ArrowRight, CheckCircle2, Clock, Package, RefreshCw, Sparkles, FolderOpen } from 'lucide-react';

interface DocRow {
  document_type: string;
  delivered_to_client: boolean;
  status: string;
}

export default function PersonalOverview() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, purchasedServiceIds } = useClientProfile();
  const { isAdmin } = useIsAdmin();
  const [documents, setDocuments] = useState<DocRow[]>([]);

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      router.replace('/personal/admin');
    }
  }, [isAdmin, router]);

  // Fetch documents for status computation
  useEffect(() => {
    if (!user) return;
    const fetchDocs = async () => {
      const { data } = await supabase
        .from('generated_documents')
        .select('document_type, delivered_to_client, status')
        .eq('client_id', user.id);
      setDocuments(data || []);
    };
    fetchDocs();
  }, [user]);

  if (isAdmin || !profile) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  // Compute per-service statuses
  const serviceStatuses = getServiceDeliveryStatuses({
    purchasedServiceIds,
    intakeCompleteForServices: profile.intake_complete_for_services || [],
    documents,
    overallDeliveryStatus: profile.delivery_status,
  });

  // Get unified next step
  const unifiedStep = getUnifiedNextStep(serviceStatuses);

  // Document-producing services for the "Your Services" card
  const docServiceStatuses = serviceStatuses.filter((s) =>
    s.serviceId === 'quarterly_refresh' || isServiceDocumentService(s.serviceId),
  );

  const serviceCount = purchasedServiceIds.length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Welcome to your personal area
        </h1>
        <p className="font-inter text-gray-600">
          {user?.email}
          {serviceCount > 0 && (
            <span className="ml-2 text-gray-400">
              &middot; {serviceCount} {serviceCount === 1 ? 'service' : 'services'} active
            </span>
          )}
        </p>
      </div>

      {/* Unified Next Step Card */}
      {unifiedStep && (
        <UnifiedNextStepCard step={unifiedStep} hasSubmittedIntake={profile.has_submitted_intake} />
      )}

      {/* Your Services card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">Your Services</h2>
        <div className="space-y-3">
          {docServiceStatuses.map((s) => {
            const service = getServiceById(s.serviceId);
            const isRefresh = s.serviceId === 'quarterly_refresh';

            return (
              <div key={s.serviceId} className="flex items-center gap-3">
                <div className={`rounded-lg p-2 shrink-0 ${isRefresh ? 'bg-teal-50' : 'bg-[#FAFBFC]'}`}>
                  {isRefresh ? (
                    <RefreshCw size={16} className="text-teal-600" />
                  ) : (
                    <Package size={16} className="text-[#1B3F7A]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-inter font-semibold text-[#1B3F7A] text-sm">
                      {service?.name ?? s.serviceId}
                    </span>
                    <ServiceStatusBadge
                      intakeComplete={s.intakeComplete}
                      deliveryStatus={s.deliveryStatus}
                      isRefresh={isRefresh}
                    />
                  </div>
                  {s.documentsTotal > 0 && (
                    <p className="font-inter text-gray-500 text-xs mt-0.5">
                      {s.documentsReady}/{s.documentsTotal} documents delivered
                    </p>
                  )}
                  {isRefresh && (
                    <p className="font-inter text-gray-500 text-xs mt-0.5">
                      Your documents can be refreshed each quarter as your business evolves.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UnifiedNextStepCard({
  step,
  hasSubmittedIntake,
}: {
  step: { type: 'intake' | 'preparing' | 'ready'; servicesNeedingIntake: string[]; allDelivered: boolean };
  hasSubmittedIntake: boolean;
}) {
  if (step.type === 'intake') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#FAFBFC] rounded-lg p-3 shrink-0">
            <FileText size={24} className="text-[#1B3F7A]" />
          </div>
          <div className="flex-1">
            <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
              {hasSubmittedIntake ? 'Complete Your Intake Form' : 'Tell Us About Your Business'}
            </h2>
            <p className="font-inter text-gray-600 text-sm mb-3">
              {hasSubmittedIntake
                ? 'You have new sections to complete for your additional services.'
                : 'Complete your intake form so we can prepare your bespoke deliverables.'}
            </p>
            {step.servicesNeedingIntake.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {step.servicesNeedingIntake.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-inter font-medium bg-[#F0F4FF] text-[#1B3F7A]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
            <p className="font-inter text-gray-500 text-xs mb-4">
              Estimated time: 20-30 minutes. Your answers shape every document we create.
            </p>
            <Link
              href="/personal/intake"
              className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors duration-200"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              Complete Intake Form
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step.type === 'preparing') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-50 rounded-lg p-3 shrink-0">
            <Sparkles size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
              We&apos;re Preparing Your Deliverables
            </h2>
            <p className="font-inter text-gray-600 text-sm mb-4">
              Your intake is complete. We&apos;re now crafting your bespoke documents and content. This typically takes up to 24 hours.
            </p>
            <Link
              href="/personal/status"
              className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors duration-200"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              View Progress
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step.type === 'ready') {
    return (
      <div className="bg-white rounded-lg border border-green-200 p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-green-50 rounded-lg p-3 shrink-0">
            <CheckCircle2 size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
              Your Deliverables Are Ready
            </h2>
            <p className="font-inter text-gray-600 text-sm mb-4">
              All your documents and content have been prepared and are ready for download.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/personal/documents"
                className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <FolderOpen size={16} />
                View Documents
              </Link>
              <Link
                href="/personal/status"
                className="inline-flex items-center gap-2 font-inter font-semibold text-[#1B3F7A] bg-white border border-[#1B3F7A] rounded-md hover:bg-gray-50 transition-colors duration-200"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                View Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function ServiceStatusBadge({
  intakeComplete,
  deliveryStatus,
  isRefresh,
}: {
  intakeComplete: boolean;
  deliveryStatus: string;
  isRefresh: boolean;
}) {
  if (isRefresh) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs font-inter font-medium">
        <CheckCircle2 size={10} />
        Active
      </span>
    );
  }

  if (!intakeComplete) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-inter font-medium">
        <Clock size={10} />
        Intake needed
      </span>
    );
  }

  if (deliveryStatus === 'delivered') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-inter font-medium">
        <CheckCircle2 size={10} />
        Delivered
      </span>
    );
  }

  if (deliveryStatus === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-inter font-medium">
        <Clock size={10} />
        In progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-inter font-medium">
      <Clock size={10} />
      Pending
    </span>
  );
}
