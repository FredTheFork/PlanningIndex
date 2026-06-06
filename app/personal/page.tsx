'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { getServiceById } from '@/lib/services/service-catalog';
import { getServiceDeliveryStatuses, getNextStepForService, sortNextSteps } from '@/lib/services/service-status';
import { isServiceDocumentService } from '@/lib/services/document-service-map';
import { FileText, ArrowRight, CheckCircle2, Clock, Package, RefreshCw } from 'lucide-react';

interface DocRow {
  document_type: string;
  delivered_to_client: boolean;
  status: string;
}

export default function PersonalOverview() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, intakeFullyComplete, purchasedServiceIds, intakeCompleteForServices } = useClientProfile();
  const { isAdmin } = useIsAdmin();
  const [documents, setDocuments] = useState<DocRow[]>([]);

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      router.replace('/personal/admin');
    }
  }, [isAdmin, router]);

  // Fetch documents for per-service status computation
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
    intakeCompleteForServices,
    documents,
    overallDeliveryStatus: profile.delivery_status,
  });

  // Compute next steps for each service
  const nextSteps = sortNextSteps(serviceStatuses.map(getNextStepForService));

  // Document-producing services for the "Your Services" card
  const docServiceStatuses = serviceStatuses.filter((s) =>
    s.serviceId === 'quarterly_refresh' || isServiceDocumentService(s.serviceId),
  );

  const serviceCount = purchasedServiceIds.length;

  return (
    <div>
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

      {/* Next steps card */}
      {nextSteps.length === 1 ? (
        <NextStepCard step={nextSteps[0]} />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">Your Next Steps</h2>
          <div className="space-y-4">
            {nextSteps.map((step, i) => (
              <div key={step.title}>
                {i > 0 && <div className="border-t border-gray-100 my-4" />}
                <NextStepRow step={step} />
              </div>
            ))}
          </div>
        </div>
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

function NextStepCard({ step }: { step: { title: string; description: string; action: string; link: string; icon: any } }) {
  const Icon = step.icon;
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
      <div className="flex items-start gap-4">
        <div className="bg-[#FAFBFC] rounded-lg p-3 shrink-0">
          <Icon size={24} className="text-[#1B3F7A]" />
        </div>
        <div className="flex-1">
          <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
            {step.title}
          </h2>
          <p className="font-inter text-gray-600 text-sm mb-4">
            {step.description}
          </p>
          <Link
            href={step.link}
            className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors duration-200"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            {step.action}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function NextStepRow({ step }: { step: { title: string; description: string; action: string; link: string; icon: any } }) {
  const Icon = step.icon;
  return (
    <div className="flex items-start gap-4">
      <div className="bg-[#FAFBFC] rounded-lg p-2.5 shrink-0">
        <Icon size={18} className="text-[#1B3F7A]" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-inter font-semibold text-[#1B3F7A] text-sm mb-1">
          {step.title}
        </h3>
        <p className="font-inter text-gray-600 text-xs mb-2">
          {step.description}
        </p>
        <Link
          href={step.link}
          className="inline-flex items-center gap-1.5 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors duration-200"
          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
        >
          {step.action}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
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
