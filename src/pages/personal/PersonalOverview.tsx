import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useClientProfile } from '../../hooks/useClientProfile';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Clock, CheckCircle2, FolderOpen } from 'lucide-react';

export default function PersonalOverview() {
  const { user } = useAuth();
  const { profile } = useClientProfile();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/personal/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  if (isAdmin) return null;
  if (!profile) return null;

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

    if (profile.delivery_status === 'not_started' || profile.delivery_status === 'in_progress') {
      return {
        title: 'Your documents are being prepared',
        description: 'We\'re working on your business foundations pack. The 24-hour delivery window started when you submitted your intake form.',
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
        <h1 className="font-inter font-bold text-navy text-2xl mb-1">
          Welcome to your personal area
        </h1>
        <p className="font-inter text-secondary-text">
          {user?.email}
        </p>
      </div>

      {/* Next step card */}
      <div className="bg-white rounded-lg border border-border p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-off-white rounded-lg p-3 shrink-0">
            <nextStep.icon size={24} className="text-navy" />
          </div>
          <div className="flex-1">
            <h2 className="font-inter font-bold text-navy text-lg mb-2">
              {nextStep.title}
            </h2>
            <p className="font-inter text-secondary-text text-sm mb-4">
              {nextStep.description}
            </p>
            <Link
              to={nextStep.link}
              className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200"
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
          complete={profile.has_submitted_intake}
          detail={profile.has_submitted_intake
            ? `Submitted ${profile.intake_submitted_at ? new Date(profile.intake_submitted_at).toLocaleDateString() : ''}`
            : 'Not yet submitted'}
        />
        <StatusCard
          label="Document Preparation"
          complete={profile.delivery_status === 'in_progress' || profile.delivery_status === 'delivered'}
          detail={profile.delivery_status === 'not_started'
            ? 'Waiting for intake'
            : profile.delivery_status === 'in_progress'
            ? 'Currently being prepared'
            : 'Complete'}
        />
        <StatusCard
          label="Delivery"
          complete={profile.delivery_status === 'delivered'}
          detail={profile.delivery_status === 'delivered'
            ? 'Documents available'
            : 'Pending'}
        />
      </div>
    </div>
  );
}

function StatusCard({ label, complete, detail }: { label: string; complete: boolean; detail: string }) {
  return (
    <div className="bg-white rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-2">
        {complete ? (
          <CheckCircle2 size={18} className="text-success" />
        ) : (
          <div className="w-[18px] h-[18px] rounded-full border-2 border-border" />
        )}
        <span className="font-inter font-semibold text-navy text-sm">{label}</span>
      </div>
      <p className="font-inter text-secondary-text text-sm">{detail}</p>
    </div>
  );
}
