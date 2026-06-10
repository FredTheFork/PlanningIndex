'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  FileText, ChevronDown, ChevronUp, Download, AlertCircle,
  CheckCircle2, Calendar, Mail, Phone, Globe, MapPin, Briefcase,
  Users, CreditCard, Shield, Award, MessageSquare, Palette,
  Share2, PenLine
} from 'lucide-react';
import { buildIntakeForm } from '@/lib/forms/build-intake-form';
import { FormSection, FormField, FieldType } from '@/lib/forms/intake-definition';

interface IntakeTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

// Icon lookup map keyed by section ID — replaces the old embedded icon in FORM_SECTIONS
const SECTION_ICONS: Record<string, any> = {
  intro: FileText,
  business_identity: Briefcase,
  services: FileText,
  clients: Users,
  pricing: CreditCard,
  gdpr: Shield,
  legal: AlertCircle,
  brand: MessageSquare,
  invoice: CreditCard,
  linkedin: Globe,
  final: CheckCircle2,
  website_copy: PenLine,
  social_media: Share2,
};

// Fields with "Other" free-text that the admin should display alongside multi_select values.
// These are stored in the JSONB as separate keys by the form submission logic.
const OTHER_TEXT_FIELDS = new Set([
  'q25_pricing_model_other',
  'q30_payment_methods_other',
  'q36_data_collected_other',
  'q37_data_collection_method_other',
  'q39_data_storage_other',
  'q48_tracking_tools_other',
  'q79_how_heard_other',
  'wc1_pages_needed_other',
  'sm1_platforms_other',
]);

// Optional fields that should still show in admin view even when empty (they're meaningful)
const ALWAYS_SHOW_OPTIONAL = new Set([
  'q4_companies_house', 'q10_website_url', 'q12_social_links',
  'q17_inform_subcontractors', 'q21_client_industries',
  'q27_payment_detail', 'q35_vat_number', 'q50_regulatory_detail',
  'q42_third_party_tools', 'q44_data_sharing_detail', 'q48_tracking_tools',
  'q52_certifications', 'q53_specific_clauses', 'q54_exclusions',
  'q58_achievements', 'q59_client_compliments', 'q63_avoid_words',
  'q66_logo_upload', 'q67_brand_colours', 'q71_invoice_fields',
  'q76_existing_docs_upload', 'q77_writing_samples_upload',
  'q78_anything_else', 'q75_linkedin_keywords',
  // Website copy optional fields that are meaningful context even when empty
  'wc_headline_idea', 'wc_colour_preferences', 'wc_colour_palette_style',
  'wc_competitor_urls', 'wc3_inspiration_urls', 'wc_disliked_urls',
  'wc_logo_placement', 'wc_brand_guidelines_upload', 'wc_logo_upload',
  'wc_existing_copy_upload', 'wc_existing_images_upload',
  'wc_forms_needed', 'wc_testimonials',
  'wc_pricing_text', 'wc_payment_methods_display', 'wc_bank_details_for_website',
  'wc_data_collected_website', 'wc_analytics_tools',
  'wc_business_hours', 'wc_email_display',
  'wc_social_links_to_show', 'wc_linkedin_url', 'wc_instagram_url', 'wc_facebook_url',
  'wc_credentials_to_show', 'wc_awards_or_press',
  'wc_booking_url', 'wc_newsletter_platform',
  // Page-specific optional fields
  'wc_homepage_sections', 'wc_homepage_cta_style',
  'wc_about_focus', 'wc_about_tone',
  'wc_services_format', 'wc_services_show_pricing', 'wc_services_cta',
  'wc_contact_method', 'wc_contact_form_fields',
  'wc_faq_topics', 'wc_faq_count',
  'wc_blog_style', 'wc_blog_categories',
  'wc_portfolio_format', 'wc_portfolio_projects',
  'wc_pricing_display', 'wc_pricing_highlights',
  'wc_testimonials_format', 'wc_testimonials_featured',
  // Social media optional fields that are meaningful context even when empty
  'sm3_avoid_topics', 'sm8_competitor_accounts', 'sm10_call_to_action',
  'sm11_existing_accounts', 'sm13_upcoming_launches',
]);

/**
 * Map a FormField type to the display type used by formatValue().
 * This replaces the old hardcoded type field in FORM_SECTIONS.
 */
function mapFieldTypeToDisplay(field: FormField, fieldId: string): string {
  // Handle "other" companion fields for multi_select with hasOtherOption
  if (OTHER_TEXT_FIELDS.has(fieldId)) return 'text';

  switch (field.type) {
    case 'short_text':
    case 'single_choice':
    case 'checkbox':
      return 'text';
    case 'long_text':
      return 'longtext';
    case 'email':
      return 'email';
    case 'phone':
      return 'phone';
    case 'url':
      return 'url';
    case 'multi_select':
      return 'array';
    case 'file_upload':
      return 'files';
    case 'repeating_section':
      return 'services';
    default:
      return 'text';
  }
}

/**
 * Derive the display fields for a section from the canonical FormSection definition.
 * Includes the main fields plus any "other" companion keys that may exist in the response data.
 */
function getDisplayFieldsForSection(
  section: FormSection,
  responses: Record<string, any>,
): { id: string; label: string; type: string }[] {
  const displayFields: { id: string; label: string; type: string }[] = [];

  for (const field of section.fields) {
    displayFields.push({
      id: field.id,
      label: field.label,
      type: mapFieldTypeToDisplay(field, field.id),
    });

    // If a multi_select field has hasOtherOption, add a companion "other" field
    // that shows the free-text entry (stored as a separate key in responses)
    if (field.hasOtherOption) {
      const otherId = `${field.id}_other`;
      if (responses[otherId] !== undefined) {
        displayFields.push({
          id: otherId,
          label: `${field.label} (Other)`,
          type: 'text',
        });
      }
    }
  }

  return displayFields;
}

export default function IntakeTab({ userId, data, refreshData }: IntakeTabProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Determine purchased service IDs from intake metadata, profile, or purchased services list
  const purchasedServiceIds: string[] = useMemo(() => {
    const metadataIds = data?.intakeMetadata?.purchased_service_ids;
    if (metadataIds && metadataIds.length > 0) return metadataIds;

    // Fall back to services_purchased list
    const serviceIds = data?.purchasedServices?.map((ps: any) => ps.service_id);
    if (serviceIds && serviceIds.length > 0) return serviceIds;

    // Fall back to profile
    const profileIds = data?.profile?.purchased_upsells;
    if (profileIds && profileIds.length > 0) {
      return ['business_foundations_pack', ...profileIds];
    }

    // Legacy: assume business_foundations_pack if profile exists
    if (data?.profile?.has_submitted_intake) {
      return ['business_foundations_pack'];
    }
    return [];
  }, [data]);

  // Build the form sections for this user's purchased services
  const formSections: FormSection[] = useMemo(
    () => buildIntakeForm(purchasedServiceIds),
    [purchasedServiceIds],
  );

  useEffect(() => {
    // Expand the first data section by default
    if (formSections.length > 0) {
      const firstDataSection = formSections.find((s) => s.id !== 'intro');
      if (firstDataSection) {
        setExpandedSections({ [firstDataSection.id]: true });
      }
    }
  }, [formSections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data: fileData, error } = await supabase.storage
        .from('user-uploads')
        .createSignedUrl(filePath, 3600);

      if (error || !fileData) {
        console.error('Download error:', error);
        return;
      }

      const a = document.createElement('a');
      a.href = fileData.signedUrl;
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

        {/* Purchased services badges */}
        {purchasedServiceIds.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="font-inter text-gray-600 text-xs mb-2">Purchased Services</p>
            <div className="flex flex-wrap gap-2">
              {purchasedServiceIds.map((serviceId) => (
                <span
                  key={serviceId}
                  className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-[#1B3F7A]"
                >
                  {serviceId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sections — derived from buildIntakeForm() */}
      <div className="space-y-3">
        {formSections
          .filter((section) => section.id !== 'intro') // skip intro in admin view
          .map((section) => {
            const Icon = SECTION_ICONS[section.id] || FileText;
            const isExpanded = expandedSections[section.id];
            const displayFields = getDisplayFieldsForSection(section, data.intakeResponses);

            const hasData = displayFields.some((field) => {
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
                        {displayFields.length} questions • {hasData ? 'Has data' : 'Empty'}
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
                      {displayFields.map((field) => {
                        const value = data.intakeResponses[field.id];

                        // Skip truly empty optional fields (unless they're in the always-show list)
                        if (value === null || value === undefined || value === '' ||
                            (Array.isArray(value) && value.length === 0)) {
                          if (!ALWAYS_SHOW_OPTIONAL.has(field.id) && !OTHER_TEXT_FIELDS.has(field.id)) {
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
