'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { FileText, ArrowRight, Clock, CheckCircle2, FolderOpen, RefreshCw } from 'lucide-react';

export default function PersonalOverview() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, intakeFullyComplete, purchasedServiceIds: profilePurchasedIds } = useClientProfile();
  const { isAdmin } = useIsAdmin();

  // Derive purchased services from the hook (canonical source: services_purchased table)
  const purchasedServiceIds = profilePurchasedIds;

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      router.replace('/personal/admin');
    }
  }, [isAdmin, router]);

  if (isAdmin || !profile) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  const getNextStep = () => {
    if (!profile.has_submitted_intake) {
      return {
        title: 'Complete your intake form',
        description: 'Tell us about your business so we can create your bespoke documents.',
        action: 'Start Intake Form',
        link: '/personal/intake',
        icon: FileText,
      };
    }

    if (!intakeFullyComplete) {
      return {
        title: 'Complete new intake sections',
        description: 'You have new sections to complete for your additional services.',
        action: 'Complete Intake',
        link: '/personal/intake',
        icon: FileText,
      };
    }

    if (profile.delivery_status === 'not_started' || profile.delivery_status === 'in_progress') {
      return {
        title: 'Your documents are being prepared',
        description: "We're working on your business foundations pack. The 24-hour delivery window started when you submitted your intake form.",
        action: 'View Status',
        link: '/personal/status',
        icon: Clock,
      };
    }

    return {
      title: 'Your documents are ready',
      description: 'Your business foundations pack has been delivered. Download your documents from the documents page.',
      action: 'View Documents',
      link: '/personal/documents',
      icon: FolderOpen,
    };
  };

  const nextStep = getNextStep();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Welcome to your personal area
        </h1>
        <p className="font-inter text-gray-600">
          {user?.email}
        </p>
      </div>

      {/* Next step card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#FAFBFC] rounded-lg p-3 shrink-0">
            <nextStep.icon size={24} className="text-[#1B3F7A]" />
          </div>
          <div className="flex-1">
            <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
              {nextStep.title}
            </h2>
            <p className="font-inter text-gray-600 text-sm mb-4">
              {nextStep.description}
            </p>
            <Link
              href={nextStep.link}
              className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors duration-200"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              {nextStep.action}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Status overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatusCard
          label="Intake Form"
          complete={intakeFullyComplete}
          detail={!profile.has_submitted_intake
            ? 'Not yet submitted'
            : !intakeFullyComplete
            ? 'New sections needed'
            : `Complete ${profile.intake_submitted_at ? new Date(profile.intake_submitted_at).toLocaleDateString() : ''}`}
        />
        <StatusCard
          label="Document Preparation"
          complete={profile.delivery_status === 'in_progress' || profile.delivery_status === 'delivered'}
          detail={profile.delivery_status === 'not_started'
            ? 'Waiting for intake form'
            : profile.delivery_status === 'in_progress'
            ? 'Currently being prepared'
            : 'Complete'}
        />
        <StatusCard
          label="Documents"
          complete={profile.delivery_status === 'delivered'}
          detail={profile.delivery_status === 'delivered'
            ? 'Ready for download'
            : 'Pending delivery'}
        />
      </div>

      {/* Quarterly refresh subscription card */}
      {purchasedServiceIds.includes('quarterly_refresh') && (
        <div className="mt-4 bg-white rounded-lg border border-teal-200 p-5">
          <div className="flex items-start gap-3">
            <div className="bg-teal-50 rounded-lg p-2 shrink-0">
              <RefreshCw size={18} className="text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-inter font-semibold text-[#1B3F7A] text-sm">
                  Quarterly Document Refresh
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs font-inter font-medium">
                  <CheckCircle2 size={10} />
                  Active
                </span>
              </div>
              <p className="font-inter text-gray-600 text-sm">
                Your documents can be refreshed each quarter as your business evolves — pricing changes, new services, updated GDPR policies, and more. Contact us when you need updates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusCard({ label, complete, detail }: { label: string; complete: boolean; detail: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-2">
        {complete ? (
          <CheckCircle2 size={18} className="text-green-600" />
        ) : (
          <Clock size={18} className="text-gray-400" />
        )}
        <span className="font-inter font-semibold text-[#1B3F7A] text-sm">{label}</span>
      </div>
      <p className="font-inter text-gray-600 text-sm">{detail}</p>
    </div>
  );
}
