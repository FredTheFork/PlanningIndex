import { useClientProfile } from '../../hooks/useClientProfile';
import { Lock, ExternalLink, Download, ShieldCheck } from 'lucide-react';

export default function PersonalDocuments() {
  const { profile, loading } = useClientProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  if (!profile) return null;

  const isDelivered = profile.delivery_status === 'delivered';

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter font-bold text-navy text-2xl mb-1">
          Documents
        </h1>
        <p className="font-inter text-secondary-text text-sm">
          Access your business foundations pack documents.
        </p>
      </div>

      {isDelivered && profile.delivery_link ? (
        <div className="bg-white rounded-lg border border-border p-8">
          <div className="flex items-start gap-4">
            <div className="bg-green-50 rounded-lg p-3 shrink-0">
              <ShieldCheck size={24} className="text-success" />
            </div>
            <div className="flex-1">
              <h2 className="font-inter font-bold text-navy text-lg mb-2">
                Your documents are ready
              </h2>
              <p className="font-inter text-secondary-text text-sm mb-6">
                Your complete business foundations pack has been delivered.
                Click the link below to access all your documents.
              </p>

              <a
                href={profile.delivery_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors"
                style={{ padding: '12px 24px', fontSize: '0.9rem' }}
              >
                <ExternalLink size={16} />
                Open Documents Folder
              </a>

              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-inter font-semibold text-navy text-sm mb-3">
                  Your pack includes:
                </h3>
                <ul className="space-y-2">
                  {[
                    'Bespoke Client Contract',
                    'Terms & Conditions',
                    'GDPR Privacy Policy',
                    'Professional Bio',
                    'Elevator Pitch (3 versions)',
                    'LinkedIn Profile Script',
                    'Professional Invoice Template',
                    'New Client Welcome Emails (x3)',
                    'Late Payment Letters (x3)',
                    'Service Description Sheets',
                  ].map((doc) => (
                    <li key={doc} className="flex items-center gap-2">
                      <Download size={14} className="text-medium-blue shrink-0" />
                      <span className="font-inter text-sm text-dark-text">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-4">
                <p className="font-inter text-amber-800 text-sm">
                  Please download and save copies of all documents to your own device.
                  We recommend keeping a backup in at least two separate locations.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border p-8">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 rounded-lg p-3 shrink-0">
              <Lock size={24} className="text-secondary-text" />
            </div>
            <div>
              <h2 className="font-inter font-bold text-navy text-lg mb-2">
                Documents not yet available
              </h2>
              <p className="font-inter text-secondary-text text-sm mb-4">
                {profile.delivery_status === 'not_started'
                  ? 'Your documents will be prepared once you submit your intake form. The 24-hour delivery window starts from submission.'
                  : 'Your documents are currently being prepared. They will be available within 24 hours of submitting your intake form.'}
              </p>

              {!profile.has_submitted_intake && (
                <a
                  href="/personal/intake"
                  className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Complete Intake Form
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
