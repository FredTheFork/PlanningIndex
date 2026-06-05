'use client';

import { useClientProfile } from '@/hooks/useClientProfile';
import { CheckCircle2, Clock } from 'lucide-react';

export default function PersonalStatus() {
  const { profile, loading } = useClientProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!profile) return null;

  const steps = [
    {
      label: 'Intake form submitted',
      complete: profile.has_submitted_intake,
      detail: profile.intake_submitted_at
        ? new Date(profile.intake_submitted_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : 'Not yet submitted',
    },
    {
      label: 'Documents being prepared',
      complete: profile.delivery_status === 'in_progress' || profile.delivery_status === 'delivered',
      detail: profile.delivery_status === 'not_started'
        ? 'Waiting for intake form'
        : 'In progress',
    },
    {
      label: 'Documents delivered',
      complete: profile.delivery_status === 'delivered',
      detail: profile.delivery_status === 'delivered'
        ? 'Available in Documents'
        : 'Pending',
    },
    ...(profile.purchased_upsells?.includes('quarterly_refresh') ? [{
      label: 'Quarterly Refresh Active',
      complete: true,
      detail: 'Your documents can be refreshed each quarter — contact us when you need updates.',
    }] : []),
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Status
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          Track the progress of your business foundations pack.
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex gap-4">
              {/* Indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    step.complete
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {step.complete ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <span className="font-inter font-semibold text-xs">{i + 1}</span>
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      step.complete ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-8">
                <p className={`font-inter font-semibold text-sm ${
                  step.complete ? 'text-[#1B3F7A]' : 'text-gray-600'
                }`}>
                  {step.label}
                </p>
                <p className="font-inter text-gray-600 text-xs mt-0.5">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-inter font-semibold text-blue-900 text-sm mb-1">
              24-Hour Delivery Promise
            </p>
            <p className="font-inter text-blue-700 text-xs">
              Once you submit your intake form, we begin preparing your bespoke documents immediately.
              You'll receive an email notification when they're ready for download.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
