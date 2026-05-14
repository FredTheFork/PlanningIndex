import { useClientProfile } from '../../hooks/useClientProfile';
import { CheckCircle2, Clock, FileText } from 'lucide-react';

export default function PersonalStatus() {
  const { profile, loading } = useClientProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
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
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-navy text-2xl mb-1">
          Status
        </h1>
        <p className="font-inter text-secondary-text text-sm">
          Track the progress of your business foundations pack.
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-border p-8">
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex gap-4">
              {/* Indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    step.complete
                      ? 'bg-success text-white'
                      : 'bg-gray-100 text-secondary-text'
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
                      step.complete ? 'bg-success' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-8">
                <p className={`font-inter font-semibold text-sm ${
                  step.complete ? 'text-navy' : 'text-secondary-text'
                }`}>
                  {step.label}
                </p>
                <p className="font-inter text-secondary-text text-xs mt-0.5">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="bg-white rounded-lg border border-border p-6 mt-6">
        <div className="flex items-start gap-3">
          <Clock size={20} className="text-medium-blue mt-0.5 shrink-0" />
          <div>
            <p className="font-inter font-semibold text-navy text-sm mb-1">
              24-hour delivery window
            </p>
            <p className="font-inter text-secondary-text text-sm">
              The 24-hour delivery window starts once your intake form is submitted.
              {profile.intake_submitted_at && (
                <>
                  {' '}Your window started on{' '}
                  {new Date(profile.intake_submitted_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {!profile.has_submitted_intake && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-6">
          <div className="flex items-start gap-3">
            <FileText size={20} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-inter font-semibold text-amber-800 text-sm mb-1">
                Action needed
              </p>
              <p className="font-inter text-amber-700 text-sm">
                Please complete your intake form so we can begin preparing your documents.
              </p>
              <a
                href="/personal/intake"
                className="inline-block mt-3 font-inter font-semibold text-navy bg-white border border-navy rounded-md hover:bg-off-white transition-colors"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Go to Intake Form
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
