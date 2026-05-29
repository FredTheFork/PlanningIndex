'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  FileText, ChevronDown, ChevronUp, Download, AlertCircle,
  CheckCircle2, Calendar, Mail, Phone, Globe, MapPin, Briefcase,
  Users, CreditCard, Shield, Award, MessageSquare
} from 'lucide-react';

interface IntakeTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

const FORM_SECTIONS = [
  {
    id: 'business_identity',
    title: 'Business Identity',
    icon: Briefcase,
    fields: [
      { id: 'q1_legal_name', label: 'Legal Name', type: 'text' },
      { id: 'q2_business_name', label: 'Business/Trading Name', type: 'text' },
      { id: 'q3_business_registered', label: 'Business Registration', type: 'text' },
      { id: 'q4_companies_house', label: 'Companies House No.', type: 'text' },
      { id: 'q5_jurisdiction', label: 'Jurisdiction', type: 'text' },
      { id: 'q6_business_address', label: 'Business Address', type: 'longtext' },
      { id: 'q7_document_email', label: 'Document Email', type: 'email' },
      { id: 'q8_business_phone', label: 'Business Phone', type: 'phone' },
      { id: 'q9_has_website', label: 'Has Website?', type: 'text' },
      { id: 'q10_website_url', label: 'Website URL', type: 'url' },
      { id: 'q11_social_platforms', label: 'Social Platforms', type: 'array' },
      { id: 'q12_social_links', label: 'Social Links', type: 'longtext' },
    ],
  },
  {
    id: 'services',
    title: 'Your Services',
    icon: FileText,
    fields: [
      { id: 'q13_what_you_do', label: 'What You Do', type: 'longtext' },
      { id: 'q14_flagship_service', label: 'Flagship Service', type: 'text' },
      { id: 'q15_services', label: 'Services Details', type: 'services' },
      { id: 'q16_uses_subcontractors', label: 'Uses Subcontractors?', type: 'text' },
      { id: 'q17_inform_subcontractors', label: 'Inform about Subcontractors?', type: 'text' },
      { id: 'q18_sends_proposal', label: 'Sends Proposal?', type: 'text' },
    ],
  },
  {
    id: 'clients',
    title: 'Your Clients & How You Work',
    icon: Users,
    fields: [
      { id: 'q19_client_type', label: 'Client Type', type: 'text' },
      { id: 'q20_ideal_client', label: 'Ideal Client', type: 'longtext' },
      { id: 'q21_client_industries', label: 'Client Industries', type: 'longtext' },
      { id: 'q22_client_issues', label: 'Past Client Issues', type: 'array' },
      { id: 'q23_dispute_details', label: 'Dispute Details', type: 'longtext' },
      { id: 'q24_client_concerns', label: 'Client Concerns', type: 'longtext' },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing, Payment & Protection',
    icon: CreditCard,
    fields: [
      { id: 'q25_pricing_model', label: 'Pricing Model', type: 'array' },
      { id: 'q25_pricing_model_other', label: 'Pricing Model (Other)', type: 'text' },
      { id: 'q26_payment_terms', label: 'Payment Terms', type: 'text' },
      { id: 'q27_payment_detail', label: 'Payment Detail', type: 'longtext' },
      { id: 'q28_requires_deposit', label: 'Requires Deposit?', type: 'text' },
      { id: 'q29_deposit_detail', label: 'Deposit Detail', type: 'text' },
      { id: 'q30_payment_methods', label: 'Payment Methods', type: 'array' },
      { id: 'q30_payment_methods_other', label: 'Payment Methods (Other)', type: 'text' },
      { id: 'q31_refund_policy', label: 'Refund Policy', type: 'text' },
      { id: 'q32_refund_detail', label: 'Refund Detail', type: 'longtext' },
      { id: 'q33_late_payment_interest', label: 'Late Payment Interest?', type: 'text' },
      { id: 'q34_vat_registered', label: 'VAT Registered?', type: 'text' },
      { id: 'q35_vat_number', label: 'VAT Number', type: 'text' },
    ],
  },
  {
    id: 'gdpr',
    title: 'GDPR & Data Protection',
    icon: Shield,
    fields: [
      { id: 'q36_data_collected', label: 'Data Collected', type: 'array' },
      { id: 'q36_data_collected_other', label: 'Data Collected (Other)', type: 'text' },
      { id: 'q37_data_collection_method', label: 'Data Collection Method', type: 'array' },
      { id: 'q37_data_collection_method_other', label: 'Collection Method (Other)', type: 'text' },
      { id: 'q38_data_purpose', label: 'Data Purpose', type: 'longtext' },
      { id: 'q39_data_storage', label: 'Data Storage', type: 'array' },
      { id: 'q39_data_storage_other', label: 'Data Storage (Other)', type: 'text' },
      { id: 'q40_data_retention', label: 'Data Retention', type: 'text' },
      { id: 'q41_uses_third_party_tools', label: 'Uses Third Party Tools?', type: 'text' },
      { id: 'q42_third_party_tools', label: 'Third Party Tools', type: 'longtext' },
      { id: 'q43_shares_data', label: 'Shares Data?', type: 'text' },
      { id: 'q44_data_sharing_detail', label: 'Data Sharing Detail', type: 'longtext' },
      { id: 'q45_sends_marketing', label: 'Sends Marketing?', type: 'text' },
      { id: 'q46_marketing_platform', label: 'Marketing Platform', type: 'text' },
      { id: 'q47_uses_cookies', label: 'Uses Cookies?', type: 'text' },
      { id: 'q48_tracking_tools', label: 'Tracking Tools', type: 'array' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Risk',
    icon: AlertCircle,
    fields: [
      { id: 'q49_regulated_services', label: 'Regulated Services?', type: 'text' },
      { id: 'q50_regulatory_detail', label: 'Regulatory Detail', type: 'longtext' },
      { id: 'q51_indemnity_insurance', label: 'Indemnity Insurance?', type: 'text' },
      { id: 'q52_certifications', label: 'Certifications', type: 'longtext' },
      { id: 'q53_specific_clauses', label: 'Specific Clauses Requested', type: 'longtext' },
      { id: 'q54_exclusions', label: 'Exclusions Requested', type: 'longtext' },
    ],
  },
  {
    id: 'brand',
    title: 'Your Voice, Story & Brand',
    icon: MessageSquare,
    fields: [
      { id: 'q55_first_name', label: 'First Name', type: 'text' },
      { id: 'q56_business_story', label: 'Business Story', type: 'longtext' },
      { id: 'q57_experience', label: 'Experience', type: 'longtext' },
      { id: 'q58_achievements', label: 'Achievements', type: 'longtext' },
      { id: 'q59_client_compliments', label: 'Client Compliments', type: 'longtext' },
      { id: 'q60_12_month_goal', label: '12-Month Goal', type: 'longtext' },
      { id: 'q61_differentiator', label: 'Differentiator', type: 'longtext' },
      { id: 'q62_tone_of_voice', label: 'Tone of Voice', type: 'array' },
      { id: 'q63_avoid_words', label: 'Words to Avoid', type: 'longtext' },
      { id: 'q64_brand_identity', label: 'Brand Identity', type: 'text' },
      { id: 'q65_has_logo', label: 'Has Logo?', type: 'text' },
      { id: 'q66_logo_upload', label: 'Logo Upload', type: 'files' },
      { id: 'q67_brand_colours', label: 'Brand Colours', type: 'text' },
      { id: 'q68_visual_style', label: 'Visual Style', type: 'text' },
    ],
  },
  {
    id: 'invoice',
    title: 'Invoice Preferences',
    icon: CreditCard,
    fields: [
      { id: 'q69_bank_details', label: 'Bank Details', type: 'longtext' },
      { id: 'q70_invoice_due_date', label: 'Invoice Due Date', type: 'text' },
      { id: 'q71_invoice_fields', label: 'Invoice Fields', type: 'array' },
    ],
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Profile',
    icon: Globe,
    fields: [
      { id: 'q72_linkedin_usage', label: 'LinkedIn Usage', type: 'text' },
      { id: 'q73_linkedin_url', label: 'LinkedIn URL', type: 'url' },
      { id: 'q74_linkedin_target', label: 'LinkedIn Target', type: 'longtext' },
      { id: 'q75_linkedin_keywords', label: 'LinkedIn Keywords', type: 'longtext' },
    ],
  },
  {
    id: 'final',
    title: 'Final Confirmation',
    icon: CheckCircle2,
    fields: [
      { id: 'q76_existing_docs_upload', label: 'Existing Documents Upload', type: 'files' },
      { id: 'q77_writing_samples_upload', label: 'Writing Samples Upload', type: 'files' },
      { id: 'q78_anything_else', label: 'Anything Else?', type: 'longtext' },
      { id: 'q79_how_heard', label: 'How Heard About Us', type: 'text' },
      { id: 'q79_how_heard_other', label: 'How Heard (Other)', type: 'text' },
      { id: 'q80_confidence_level', label: 'Confidence Level', type: 'text' },
      { id: 'q81_consent_marketing', label: 'Consent (Marketing)', type: 'text' },
      { id: 'q82_consent_not_legal', label: 'Consent (Not Legal Advice)', type: 'text' },
      { id: 'q83_consent_accuracy', label: 'Consent (Accuracy)', type: 'text' },
    ],
  },
];

export default function IntakeTab({ userId, data, refreshData }: IntakeTabProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [downloads, setDownloads] = useState<Record<string, string>>({});

  useEffect(() => {
    // Expand business identity section by default
    setExpandedSections({ business_identity: true });
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-uploads')
        .createSignedUrl(filePath, 3600);

      if (error || !data) {
        console.error('Download error:', error);
        return;
      }

      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined || value === '') {
      return <span className="font-inter text-gray-400 text-smItalic">Not provided</span>;
    }

    switch (type) {
      case 'array':
        if (Array.isArray(value)) {
          return (
            <div className="space-y-1">
              {value.map((item, i) => (
                <div key={i} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs font-inter text-gray-700 mr-2 mb-1">
                  {item}
                </div>
              ))}
            </div>
          );
        }
        return String(value);

      case 'services':
        if (Array.isArray(value)) {
          return (
            <div className="space-y-4">
              {value.map((service, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h5 className="font-inter font-semibold text-[#1B3F7A] text-sm mb-3">
                    Service {i + 1}: {service.service_name || 'Unnamed Service'}
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-inter text-gray-600 text-xs mb-1">Includes</p>
                      <p className="font-inter text-gray-900">{service.service_includes || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="font-inter text-gray-600 text-xs mb-1">Excludes</p>
                      <p className="font-inter text-gray-900">{service.service_excludes || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="font-inter text-gray-600 text-xs mb-1">Timeline</p>
                      <p className="font-inter text-gray-900">{service.service_timeline || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="font-inter text-gray-600 text-xs mb-1">Starting Price</p>
                      <p className="font-inter text-gray-900">{service.service_starting_price || 'Not provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-inter text-gray-600 text-xs mb-1">Outcome</p>
                      <p className="font-inter text-gray-900">{service.service_outcome || 'Not provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-inter text-gray-600 text-xs mb-1">Client Provides</p>
                      <p className="font-inter text-gray-900">{service.service_client_provides || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return String(value);

      case 'files':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="space-y-2">
              {value.map((file: any, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#1B3F7A]" />
                    <div>
                      <p className="font-inter text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="font-inter text-xs text-gray-600">{file.type} • {Math.round(file.size / 1024)}KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(file.path, file.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          );
        }
        return <span className="font-inter text-gray-400 text-smItalic">No files uploaded</span>;

      case 'email':
        return <a href={`mailto:${value}`} className="font-inter text-[#2C68C4] hover:underline">{value}</a>;

      case 'url':
        return <a href={value} target="_blank" rel="noopener noreferrer" className="font-inter text-[#2C68C4] hover:underline">{value}</a>;

      case 'phone':
        return <a href={`tel:${value}`} className="font-inter text-[#2C68C4] hover:underline">{value}</a>;

      case 'longtext':
        return <p className="font-inter text-gray-800 text-sm whitespace-pre-wrap">{value}</p>;

      default:
        return <span className="font-inter text-gray-800 text-sm">{String(value)}</span>;
    }
  };

  if (!data.intakeResponses) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <FileText size={48} className="text-gray-400 mx-auto mb-4" />
        <h4 className="font-inter font-semibold text-gray-900 text-lg mb-2">
          No Intake Form Submitted
        </h4>
        <p className="font-inter text-gray-600 text-sm">
          The client has not submitted their intake form yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Intake Form Submission
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetadataItem
            icon={Calendar}
            label="Submitted"
            value={data.intakeMetadata?.submitted_at
              ? new Date(data.intakeMetadata.submitted_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Not submitted'}
          />
          <MetadataItem
            icon={FileText}
            label="Form Version"
            value={data.intakeMetadata?.form_version || 'N/A'}
          />
          <MetadataItem
            icon={Mail}
            label="Client Email"
            value={data.intakeResponses.q7_document_email || 'N/A'}
          />
          <MetadataItem
            icon={Users}
            label="Client Name"
            value={data.intakeResponses.q55_first_name || data.intakeResponses.q1_legal_name || 'N/A'}
          />
        </div>
      </div>

      {/* Additional Notes */}
      {data.intakeMetadata?.additional_notes && Object.keys(data.intakeMetadata.additional_notes).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-inter font-semibold text-amber-900 text-sm mb-3">
            Additional Notes from Client
          </h4>
          <div className="space-y-2">
            {Object.entries(data.intakeMetadata.additional_notes).map(([key, value]: [string, any]) => (
              value && value.trim() && (
                <div key={key} className="border-b border-amber-200 pb-2 last:border-b-0">
                  <p className="font-inter font-medium text-amber-900 text-xs mb-1">Question {key}</p>
                  <p className="font-inter text-amber-800 text-sm">{value}</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-3">
        {FORM_SECTIONS.map(section => {
          const Icon = section.icon;
          const isExpanded = expandedSections[section.id];
          const sectionData = section.fields.reduce((acc, field) => {
            acc[field.id] = data.intakeResponses[field.id];
            return acc;
          }, {} as Record<string, any>);

          const hasData = section.fields.some(field => {
            const value = data.intakeResponses[field.id];
            return value !== null && value !== undefined && value !== '';
          });

          return (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#FAFBFC] rounded-lg p-2">
                    <Icon size={18} className="text-[#1B3F7A]" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-inter font-semibold text-gray-900 text-sm">
                      {section.title}
                    </h4>
                    <p className="font-inter text-gray-600 text-xs">
                      {section.fields.length} questions • {hasData ? 'Has data' : 'Empty'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasData && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-600">
                      <CheckCircle2 size={12} className="mr-1" />
                      Complete
                    </span>
                  )}
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-[#FAFBFC]">
                  <div className="space-y-4">
                    {section.fields.map(field => {
                      const value = data.intakeResponses[field.id];

                      // Skip if no value and not required fields
                      if (value === null || value === undefined || value === '' ||
                          (Array.isArray(value) && value.length === 0)) {
                        // Show only if it's a meaningful field
                        if (!['q4_companies_house', 'q10_website_url', 'q12_social_links', 'q17_inform_subcontractors',
                              'q21_client_industries', 'q27_payment_detail', 'q35_vat_number', 'q36_data_collected_other',
                              'q37_data_collection_method_other', 'q39_data_storage_other', 'q42_third_party_tools',
                              'q44_data_sharing_detail', 'q48_tracking_tools', 'q50_regulatory_detail',
                              'q52_certifications', 'q53_specific_clauses', 'q54_exclusions', 'q58_achievements',
                              'q59_client_compliments', 'q63_avoid_words', 'q66_logo_upload', 'q67_brand_colours',
                              'q71_invoice_fields', 'q76_existing_docs_upload', 'q77_writing_samples_upload',
                              'q78_anything_else', 'q79_how_heard_other', 'q75_linkedin_keywords'].includes(field.id)) {
                          return null;
                        }
                      }

                      return (
                        <div key={field.id}>
                          <p className="font-inter font-medium text-gray-700 text-xs mb-2">
                            {field.label}
                          </p>
                          <div className="font-inter text-gray-900">
                            {formatValue(value, field.type)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetadataItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-gray-400" />
        <p className="font-inter text-gray-600 text-xs">{label}</p>
      </div>
      <p className="font-inter font-medium text-gray-900 text-sm">{value}</p>
    </div>
  );
}
