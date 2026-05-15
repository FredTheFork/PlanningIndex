import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useClientProfile } from '../../hooks/useClientProfile';
import { supabase } from '../../lib/supabase';
import { Save, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

// ─── Form structure definition ───────────────────────────────────────────────

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  conditionalOn?: { field: string; value: string | string[] };
  helpText?: string;
}

interface FormSection {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

const formSections: FormSection[] = [
  {
    id: 'business_basics',
    title: 'Business Basics',
    description: 'Tell us about your business so we can tailor your documents.',
    fields: [
      { id: 'business_name', label: 'Business name', type: 'text', placeholder: 'e.g. Smith Consulting', required: true },
      { id: 'business_email', label: 'Business email', type: 'email', placeholder: 'e.g. hello@smithconsulting.co.uk', required: true },
      { id: 'business_phone', label: 'Business phone number', type: 'tel', placeholder: 'e.g. 07700 900123', required: false },
      { id: 'business_website', label: 'Website (if you have one)', type: 'text', placeholder: 'e.g. www.smithconsulting.co.uk', required: false },
      { id: 'business_type', label: 'What type of business are you?', type: 'select', required: true, options: [
        'Sole trader (freelancer)',
        'Sole trader (product/service business)',
        'Limited company',
        'Partnership',
        'Other',
      ]},
      { id: 'business_type_other', label: 'If other, please specify', type: 'text', conditionalOn: { field: 'business_type', value: 'Other' } },
      { id: 'industry', label: 'Industry or sector', type: 'text', placeholder: 'e.g. Marketing, IT, Coaching', required: true },
      { id: 'trading_since', label: 'How long have you been trading?', type: 'select', required: true, options: [
        'Not yet started',
        'Less than 6 months',
        '6-12 months',
        '1-3 years',
        '3+ years',
      ]},
      { id: 'registered_address', label: 'Registered business address', type: 'text', placeholder: 'Full address including postcode', required: true },
    ],
  },
  {
    id: 'services',
    title: 'Your Services',
    description: 'Help us understand what you offer so your contracts and descriptions are accurate.',
    fields: [
      { id: 'services_offered', label: 'What services do you offer?', type: 'textarea', placeholder: 'List your main services, one per line', required: true, helpText: 'Be as specific as possible — this feeds directly into your contracts and service descriptions.' },
      { id: 'typical_client', label: 'Who is your typical client?', type: 'textarea', placeholder: 'e.g. Small business owners, startups, individuals', required: true },
      { id: 'pricing_model', label: 'How do you charge?', type: 'select', required: true, options: [
        'Hourly rate',
        'Fixed project fee',
        'Retainer / monthly',
        'Mix of the above',
        'Other',
      ]},
      { id: 'pricing_model_other', label: 'If other, please specify', type: 'text', conditionalOn: { field: 'pricing_model', value: 'Other' } },
      { id: 'hourly_rate', label: 'What is your hourly rate? (if applicable)', type: 'text', placeholder: 'e.g. £75/hour', conditionalOn: { field: 'pricing_model', value: ['Hourly rate', 'Mix of the above'] } },
      { id: 'payment_terms', label: 'What are your standard payment terms?', type: 'select', required: true, options: [
        'Payment on completion',
        '50% upfront, 50% on completion',
        'Payment within 7 days of invoice',
        'Payment within 14 days of invoice',
        'Payment within 30 days of invoice',
        'Other',
      ]},
      { id: 'payment_terms_other', label: 'If other, please specify', type: 'text', conditionalOn: { field: 'payment_terms', value: 'Other' } },
    ],
  },
  {
    id: 'brand_voice',
    title: 'Brand & Voice',
    description: 'This helps us write your professional bio, elevator pitch, and LinkedIn profile in a way that sounds like you.',
    fields: [
      { id: 'brand_tone', label: 'How would you describe your brand tone?', type: 'select', required: true, options: [
        'Professional and formal',
        'Professional but approachable',
        'Warm and friendly',
        'Bold and confident',
        'Creative and quirky',
        'Calm and reassuring',
      ]},
      { id: 'three_words', label: 'Three words that describe your business', type: 'text', placeholder: 'e.g. Reliable, Creative, Approachable', required: true },
      { id: 'unique_selling_point', label: 'What makes you different from competitors?', type: 'textarea', placeholder: 'What do clients say they love about working with you?', required: true },
      { id: 'avoid_words', label: 'Words or phrases to avoid', type: 'textarea', placeholder: 'e.g. "disruptor", "hustle", "synergy"', required: false, helpText: 'These will be excluded from all your documents.' },
      { id: 'existing_bio', label: 'Do you have an existing bio or about page?', type: 'textarea', placeholder: 'Paste it here if you do — we\'ll use it as a reference', required: false },
    ],
  },
  {
    id: 'linkedin',
    title: 'LinkedIn & Online Presence',
    description: 'We\'ll write your LinkedIn profile script and professional online presence.',
    fields: [
      { id: 'linkedin_url', label: 'LinkedIn profile URL (if you have one)', type: 'text', placeholder: 'e.g. linkedin.com/in/yourname', required: false },
      { id: 'headline_preference', label: 'What kind of LinkedIn headline do you want?', type: 'select', required: true, options: [
        'Title-focused (e.g. "Marketing Consultant")',
        'Value-focused (e.g. "Helping small businesses grow")',
        'Personality-focused (e.g. "Your brand\'s secret weapon")',
        'Not sure — recommend one for me',
      ]},
      { id: 'key_achievements', label: 'Key achievements or credentials to highlight', type: 'textarea', placeholder: 'e.g. 10+ years experience, featured in X, certified Y', required: false },
    ],
  },
  {
    id: 'contracts',
    title: 'Contracts & Terms',
    description: 'This helps us draft your client contract and terms and conditions accurately.',
    fields: [
      { id: 'contract_scope', label: 'What does a typical project/engagement look like?', type: 'textarea', placeholder: 'e.g. 4-week website design, ongoing monthly coaching', required: true },
      { id: 'client_obligations', label: 'What do you need from clients during a project?', type: 'textarea', placeholder: 'e.g. Timely feedback, access to branding assets, content approval within 48 hours', required: true },
      { id: 'cancellation_policy', label: 'What is your cancellation/refund policy?', type: 'select', required: true, options: [
        'No refunds after work begins',
        'Partial refund based on work completed',
        'Full refund if cancelled before work starts',
        'Custom policy — I\'ll describe it below',
      ]},
      { id: 'cancellation_policy_custom', label: 'Describe your custom cancellation/refund policy', type: 'textarea', conditionalOn: { field: 'cancellation_policy', value: 'Custom policy — I\'ll describe it below' } },
      { id: 'liability_limit', label: 'Do you want to limit your liability?', type: 'select', required: true, options: [
        'Yes — to the value of the contract',
        'Yes — to a specific amount',
        'No — I want standard liability terms',
        'Not sure — recommend one',
      ]},
      { id: 'liability_limit_amount', label: 'If yes to a specific amount, what is it?', type: 'text', placeholder: 'e.g. £5,000', conditionalOn: { field: 'liability_limit', value: 'Yes — to a specific amount' } },
      { id: 'governing_law', label: 'Which law governs your contracts?', type: 'select', required: true, options: [
        'England and Wales',
        'Scotland',
        'Northern Ireland',
      ]},
    ],
  },
  {
    id: 'gdpr',
    title: 'GDPR & Privacy',
    description: 'We need to know what personal data you process to write your privacy policy correctly.',
    fields: [
      { id: 'data_collected', label: 'What personal data do you collect from clients?', type: 'textarea', placeholder: 'e.g. Name, email, phone, address, payment details', required: true },
      { id: 'data_purpose', label: 'Why do you collect this data?', type: 'textarea', placeholder: 'e.g. To provide services, send invoices, communicate about projects', required: true },
      { id: 'data_storage', label: 'How do you store client data?', type: 'select', required: true, options: [
        'Cloud software (e.g. Xero, Google Workspace)',
        'Local computer only',
        'Paper records',
        'Mix of the above',
        'Not sure',
      ]},
      { id: 'data_third_parties', label: 'Do you share data with any third parties?', type: 'textarea', placeholder: 'e.g. Accountant, payment processor (Stripe/PayPal), CRM', required: true },
      { id: 'data_retention', label: 'How long do you keep client data after the relationship ends?', type: 'select', required: true, options: [
        'Less than 1 year',
        '1-2 years',
        '3-5 years',
        '6+ years (for tax purposes)',
        'Not sure — recommend a period',
      ]},
      { id: 'marketing_consent', label: 'Do you send marketing communications?', type: 'select', required: true, options: [
        'Yes — email newsletter',
        'Yes — email and SMS',
        'No',
        'Not yet but plan to',
      ]},
    ],
  },
  {
    id: 'additional',
    title: 'Additional Information',
    description: 'Anything else that will help us create the best possible documents for you.',
    fields: [
      { id: 'anything_else', label: 'Is there anything else you\'d like us to know?', type: 'textarea', placeholder: 'Any specific requirements, preferences, or concerns', required: false },
      { id: 'how_heard', label: 'How did you hear about Foundationary?', type: 'select', required: false, options: [
        'Google search',
        'Social media',
        'Referral from a friend',
        'Saw an ad',
        'Other',
      ]},
      { id: 'referral_details', label: 'If referral or other, please specify', type: 'text', conditionalOn: { field: 'how_heard', value: ['Referral from a friend', 'Other'] } },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PersonalIntake() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useClientProfile();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing responses
  useEffect(() => {
    if (!user) return;

    const fetchResponses = async () => {
      const { data, error } = await supabase
        .from('intake_responses')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching intake responses:', error);
        return;
      }

      if (data) {
        setResponses(data.responses as Record<string, string> || {});
        setCurrentSection(data.current_section ?? 0);
        setLastSaved(new Date(data.last_saved_at));
      }
    };

    fetchResponses();
  }, [user]);

  // Check if already submitted
  useEffect(() => {
    if (profile?.has_submitted_intake) {
      setSubmitted(true);
    }
  }, [profile]);

  // Autosave on field blur or section change
  const saveResponses = useCallback(async (updatedResponses: Record<string, string>, section: number) => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('intake_responses')
        .update({
          responses: updatedResponses,
          current_section: section,
          last_saved_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Autosave error:', error);
      } else {
        setLastSaved(new Date());
      }
    } finally {
      setSaving(false);
    }
  }, [user]);

  const scheduleSave = useCallback((updatedResponses: Record<string, string>, section: number) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveResponses(updatedResponses, section);
    }, 800);
  }, [saveResponses]);

  const handleFieldChange = (fieldId: string, value: string) => {
    const updated = { ...responses, [fieldId]: value };
    setResponses(updated);
    scheduleSave(updated, currentSection);
  };

  const handleFieldBlur = () => {
    saveResponses(responses, currentSection);
  };

  const goToSection = (index: number) => {
    setCurrentSection(index);
    saveResponses(responses, index);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!user || !profile) return;

    setSubmitting(true);
    try {
      // Update intake_responses
      const { error: responsesError } = await supabase
        .from('intake_responses')
        .update({
          responses,
          current_section: currentSection,
          last_saved_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (responsesError) throw responsesError;

      // Update client_profile
      const { error: profileError } = await supabase
        .from('client_profiles')
        .update({
          has_submitted_intake: true,
          intake_submitted_at: new Date().toISOString(),
          delivery_status: 'in_progress',
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      setSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Something went wrong submitting your form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
        <h2 className="font-inter font-bold text-navy text-xl mb-2">
          Intake form submitted
        </h2>
        <p className="font-inter text-secondary-text text-sm mb-6">
          Thank you! We're now preparing your business foundations pack.
          The 24-hour delivery window has started.
        </p>
        <a
          href="/personal/status"
          className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors"
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          View Status
          <ArrowRight size={16} />
        </a>
      </div>
    );
  }

  const section = formSections[currentSection];
  const totalSections = formSections.length;
  const progress = ((currentSection + 1) / totalSections) * 100;

  // Check if a field should be visible based on conditional logic
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditionalOn) return true;
    const { field: depField, value: depValue } = field.conditionalOn;
    const response = responses[depField];
    if (Array.isArray(depValue)) {
      return depValue.includes(response || '');
    }
    return response === depValue;
  };

  const visibleFields = section.fields.filter(isFieldVisible);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-inter font-bold text-navy text-2xl mb-1">
          Client Intake Form
        </h1>
        <p className="font-inter text-secondary-text text-sm">
          Complete this form so we can create your bespoke business documents.
          Your progress is saved automatically.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-inter text-sm font-medium text-navy">
            Section {currentSection + 1} of {totalSections}
          </span>
          <span className="font-inter text-xs text-secondary-text flex items-center gap-1">
            {saving && <span className="text-amber-600">Saving...</span>}
            {!saving && lastSaved && (
              <span className="flex items-center gap-1">
                <Save size={12} />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-navy rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Section pills */}
        <div
          className="flex gap-1 mt-3 overflow-x-auto pb-1"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          {formSections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToSection(i)}
              className={`font-inter text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                i === currentSection
                  ? 'bg-navy text-white'
                  : i < currentSection
                  ? 'bg-medium-blue text-white'
                  : 'bg-gray-100 text-secondary-text hover:bg-gray-200'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Section content */}
      <div className="bg-white rounded-lg border border-border p-8">
        <h2 className="font-inter font-bold text-navy text-lg mb-1">
          {section.title}
        </h2>
        <p className="font-inter text-secondary-text text-sm mb-6">
          {section.description}
        </p>

        <div className="space-y-5">
          {visibleFields.map((field) => (
            <div key={field.id}>
              <label className="block font-inter font-medium text-dark-text text-sm mb-1.5">
                {field.label}
                {field.required && <span className="text-danger ml-0.5">*</span>}
              </label>
              {field.helpText && (
                <p className="font-inter text-secondary-text text-xs mb-1.5">{field.helpText}</p>
              )}
              {field.type === 'textarea' ? (
                <textarea
                  value={responses[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  onBlur={handleFieldBlur}
                  placeholder={field.placeholder}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
                />
              ) : field.type === 'select' ? (
                <select
                  value={responses[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  onBlur={handleFieldBlur}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-medium-blue focus:border-medium-blue font-inter text-sm bg-white"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={responses[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  onBlur={handleFieldBlur}
                  placeholder={field.placeholder}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medium-blue focus:border-medium-blue font-inter text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => goToSection(currentSection - 1)}
          disabled={currentSection === 0}
          className="font-inter font-medium text-secondary-text hover:text-navy transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => saveResponses(responses, currentSection)}
            className="font-inter text-medium-blue text-sm hover:underline"
          >
            Save &amp; exit
          </button>

          {currentSection < totalSections - 1 ? (
            <button
              onClick={() => goToSection(currentSection + 1)}
              className="font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors flex items-center gap-1"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="font-inter font-semibold text-white bg-success rounded-md hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                'Submit Intake Form'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
