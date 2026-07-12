import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CHATZ_API_KEY = Deno.env.get("CHATZ_API_KEY") || "261c2fe96fa44ac798c15f20d6ba161b.lRLsgcKSexHFZZDy";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

const CHATZ_MODEL = "gpt-4o";
const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_TOKENS = 16384;
const TEMPERATURE = 0.7;
const TIMEOUT_MS = 90000;
const MAX_TEST_CLIENTS = 50;
const MAX_COUNT_PER_REQUEST = 5;

// ── SERVICE CATALOG ──
const SERVICE_CATALOG: Record<string, string> = {
  business_foundations_pack: "Business Foundations Pack",
  website_copy_pack: "Website Copy Starter Pack",
  social_media_pack: "Social Media Starter Pack",
  client_onboarding_pack: "Client Onboarding & Scope Control Pack",
  payment_protection_pack: "Payment Protection Pack",
  copyright_licensing_pack: "Copyright & Licensing Pack",
  gdpr_deep_pack: "GDPR Deep Compliance Pack",
  coach_industry_pack: "Coach Industry Pack",
  photographer_industry_pack: "Photographer Industry Pack",
  consultant_industry_pack: "Consultant Industry Pack",
  contractor_industry_pack: "Contractor Industry Pack",
};

// ── INTAKE FIELD DEFINITIONS (mirrors lib/forms/intake-definition.ts) ──
// Each entry: { id, type, required, options?, conditionalOn? }
// This is a compact representation sent to the LLM.

interface FieldDef {
  id: string;
  type: string;
  required: boolean;
  options?: string[];
  conditionalOn?: { field: string; value: string | string[] };
  isRepeating?: boolean;
  subFields?: { id: string; type: string; required: boolean; options?: string[] }[];
  maxSelections?: number;
}

interface SectionDef {
  id: string;
  title: string;
  serviceTags: string[];
  fields: FieldDef[];
}

// Build the field definitions for a given set of purchased services.
// This mirrors the logic in build-intake-form.ts but returns a compact JSON representation.
function buildFieldDefinitions(purchasedServiceIds: string[]): SectionDef[] {
  // This is the full field list — defined inline to avoid importing TS modules in Deno.
  // It mirrors allFormSections from lib/forms/intake-definition.ts.
  const sections: SectionDef[] = ALL_SECTIONS.filter(s =>
    s.serviceTags.some(t => purchasedServiceIds.includes(t))
  );
  return sections;
}

// ── ALL SECTIONS (compact representation) ──
const ALL_SECTIONS: SectionDef[] = [
  {
    id: "business_identity",
    title: "Business Identity",
    serviceTags: ["business_foundations_pack"],
    fields: [
      { id: "q1_legal_name", type: "short_text", required: true },
      { id: "q2_trading_name", type: "short_text", required: true },
      { id: "q3_business_structure", type: "single_choice", required: true, options: ["Sole trader", "Partnership", "Limited company", "LLP", "Freelancer / contractor"] },
      { id: "q4_registration_date", type: "short_text", required: true },
      { id: "q5_jurisdiction", type: "single_choice", required: true, options: ["England & Wales", "Scotland", "Northern Ireland", "Republic of Ireland"] },
      { id: "q6_business_address", type: "long_text", required: true },
      { id: "q7_document_email", type: "email", required: true },
      { id: "q8_phone", type: "phone", required: true },
      { id: "q9_website", type: "url", required: false },
      { id: "q10_social_media", type: "long_text", required: false },
    ],
  },
  {
    id: "services_offered",
    title: "Services & Offerings",
    serviceTags: ["business_foundations_pack"],
    fields: [
      { id: "q11_target_market", type: "long_text", required: true },
      { id: "q12_ideal_client", type: "long_text", required: true },
      { id: "q13_what_you_do", type: "long_text", required: true },
      { id: "q14_service_delivery", type: "single_choice", required: true, options: ["In person", "Remote / online", "Hybrid (both in person and online)"] },
      { id: "q15_services_repeating", type: "repeating_section", required: true, isRepeating: true, subFields: [
        { id: "service_name", type: "short_text", required: true },
        { id: "service_includes", type: "long_text", required: true },
        { id: "service_excludes", type: "long_text", required: false },
        { id: "service_client_provides", type: "long_text", required: false },
        { id: "service_timeline", type: "short_text", required: true },
        { id: "service_outcome", type: "long_text", required: true },
        { id: "service_starting_price", type: "short_text", required: true },
      ]},
    ],
  },
  {
    id: "client_profile",
    title: "Client Profile & Risk History",
    serviceTags: ["business_foundations_pack"],
    fields: [
      { id: "q16_client_issues", type: "long_text", required: true },
      { id: "q17_payment_problems", type: "single_choice", required: true, options: ["Yes — frequently", "Yes — occasionally", "Rarely", "Never"] },
      { id: "q18_payment_detail", type: "long_text", required: false, conditionalOn: { field: "q17_payment_problems", value: ["Yes — frequently", "Yes — occasionally"] } },
      { id: "q19_disputes", type: "single_choice", required: true, options: ["Yes — more than once", "Yes — once", "No, never"] },
      { id: "q20_dispute_detail", type: "long_text", required: false, conditionalOn: { field: "q19_disputes", value: ["Yes — more than once", "Yes — once"] } },
      { id: "q21_client_red_flags", type: "long_text", required: false },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Commercial Terms",
    serviceTags: ["business_foundations_pack"],
    fields: [
      { id: "q22_pricing_model", type: "single_choice", required: true, options: ["Hourly rate", "Fixed fee per project", "Retainer / monthly fee", "Per-session / per-day", "Mixed — depends on the project"] },
      { id: "q23_price_range", type: "short_text", required: true },
      { id: "q24_deposit", type: "single_choice", required: true, options: ["100% upfront", "50% upfront", "33% upfront", "25% upfront", "No deposit — I invoice on completion", "It varies by project"] },
      { id: "q25_deposit_non_refundable", type: "single_choice", required: true, options: ["Yes — fully non-refundable", "Partially refundable depending on notice given", "Fully refundable if cancelled before work starts", "Not sure — I'd like guidance"] },
      { id: "q26_payment_methods", type: "multi_select", required: true, options: ["Bank transfer (BACS)", "PayPal", "Stripe / card payment", "Cash", "Cheque", "Direct Debit / standing order"] },
      { id: "q27_invoice_terms", type: "single_choice", required: true, options: ["Due on receipt", "7 days", "14 days", "30 days", "Custom — I'll explain below"] },
      { id: "q28_invoice_terms_custom", type: "long_text", required: false, conditionalOn: { field: "q27_invoice_terms", value: "Custom — I'll explain below" } },
      { id: "q29_late_payment_interest", type: "single_choice", required: true, options: ["Yes — include 8% above Bank of England base rate", "No — I prefer a flat daily charge", "No — I don't want to charge interest"] },
      { id: "q30_cancellation_policy", type: "long_text", required: true },
    ],
  },
  {
    id: "gdpr",
    title: "GDPR & Data Processing",
    serviceTags: ["business_foundations_pack"],
    fields: [
      { id: "q31_collects_personal_data", type: "single_choice", required: true, options: ["Yes — client names and contact details", "Yes — also payment/billing information", "Yes — also health, dietary, or other sensitive data", "No — I don't collect any personal data from clients"] },
      { id: "q32_data_storage", type: "long_text", required: true },
      { id: "q33_data_retention", type: "single_choice", required: true, options: ["Less than 1 year", "1-3 years", "3-6 years", "6+ years", "I'm not sure — I'd like guidance"] },
      { id: "q34_marketing_emails", type: "single_choice", required: true, options: ["Yes — I send marketing emails or newsletters", "No — I don't do email marketing", "I'm planning to start"] },
      { id: "q35_marketing_consent_method", type: "single_choice", required: true, options: ["Opt-in tick box on a form", "Double opt-in email confirmation", "Verbal consent noted in my CRM", "I don't have a formal consent process", "I don't do marketing emails"] },
    ],
  },
  {
    id: "legal",
    title: "Legal & Compliance Status",
    serviceTags: ["business_foundations_pack"],
    fields: [
      { id: "q36_existing_contracts", type: "single_choice", required: true, options: ["Yes — I have written contracts", "Yes — I have terms but they're informal", "No — I don't have any contracts or terms", "I use a template I found online"] },
      { id: "q37_existing_terms_detail", type: "long_text", required: false, conditionalOn: { field: "q36_existing_contracts", value: ["Yes — I have written contracts", "Yes — I have terms but they're informal"] } },
      { id: "q38_insurance", type: "multi_select", required: true, options: ["Public liability insurance", "Professional indemnity insurance", "Employer's liability insurance", "Product liability insurance", "None currently"] },
      { id: "q39_registrations", type: "multi_select", required: true, options: ["Registered with HMRC for Self Assessment", "VAT registered", "Registered with a professional body", "ICO registered (data protection)", "None of the above"] },
      { id: "q40_specific_legal_concerns", type: "long_text", required: false },
    ],
  },
  {
    id: "brand_voice",
    title: "Brand & Voice",
    serviceTags: ["business_foundations_pack"],
    fields: [
      { id: "q61_tone_of_voice", type: "single_choice", required: true, options: ["Professional and formal", "Warm and approachable", "Direct and practical", "Creative and expressive", "Bold and confident"] },
      { id: "q62_tone_examples", type: "long_text", required: false },
      { id: "q63_brand_values", type: "long_text", required: true },
      { id: "q64_has_logo", type: "single_choice", required: true, options: ["Yes", "No", "In progress"] },
      { id: "q65_logo_description", type: "long_text", required: false, conditionalOn: { field: "q64_has_logo", value: "Yes" } },
      { id: "q66_brand_fonts", type: "short_text", required: false },
      { id: "q67_brand_colours", type: "long_text", required: false },
      { id: "q68_brand_avoid", type: "long_text", required: false },
    ],
  },
  {
    id: "invoice",
    title: "Invoice Preferences",
    serviceTags: ["business_foundations_pack"],
    fields: [
      { id: "q69_bank_details", type: "long_text", required: true },
      { id: "q70_invoice_due_date", type: "short_text", required: true },
      { id: "q71_invoice_fields", type: "multi_select", required: false, options: ["Purchase order (PO) number field", "VAT breakdown section", "Notes / message to client section", "Payment terms summary at the bottom", "Signature field"] },
    ],
  },
  {
    id: "linkedin",
    title: "LinkedIn Profile",
    serviceTags: ["business_foundations_pack"],
    fields: [
      { id: "q72_linkedin_usage", type: "single_choice", required: true, options: ["Yes — I use it actively", "I have a profile but rarely use it", "No — I don't have a profile"] },
      { id: "q73_linkedin_url", type: "url", required: false, conditionalOn: { field: "q72_linkedin_usage", value: ["Yes — I use it actively", "I have a profile but rarely use it"] } },
      { id: "q74_linkedin_target", type: "long_text", required: true },
      { id: "q75_linkedin_keywords", type: "long_text", required: false },
    ],
  },
  {
    id: "final",
    title: "Final Confirmation",
    serviceTags: ["business_foundations_pack", "website_copy_pack", "social_media_pack", "client_onboarding_pack", "payment_protection_pack", "copyright_licensing_pack", "gdpr_deep_pack", "coach_industry_pack", "photographer_industry_pack", "consultant_industry_pack", "contractor_industry_pack"],
    fields: [
      { id: "q78_anything_else", type: "long_text", required: false },
      { id: "q79_how_heard", type: "single_choice", required: false, options: ["LinkedIn", "Instagram", "TikTok", "Facebook group", "Referral from someone I know", "Google search", "Accountant or bookkeeper recommendation", "Other"] },
      { id: "q80_confidence_level", type: "single_choice", required: true, options: ["Very confident — I just want things formalised properly", "Somewhat confident — I know there are gaps", "Not confident at all — I'm starting from scratch"] },
      { id: "q81_consent_marketing", type: "single_choice", required: true, options: ["Yes", "No"] },
      // q82 and q83 are hardcoded to true in the function, not sent to AI
    ],
  },
  {
    id: "website_copy",
    title: "Website Content",
    serviceTags: ["website_copy_pack"],
    fields: [
      { id: "wc2_primary_action", type: "long_text", required: true },
      { id: "wc3_inspiration_urls", type: "long_text", required: false },
      { id: "wc_service_page_count", type: "single_choice", required: true, options: ["1", "2-3", "4-5", "6+", "Depends — align with my service descriptions"] },
      { id: "wc_nav_structure", type: "single_choice", required: true, options: ["Single page / scroll", "Multi-page", "One-page with sections"] },
      { id: "wc_headline_idea", type: "short_text", required: false },
      { id: "wc_hero_message", type: "long_text", required: true },
      { id: "wc_differentiator", type: "long_text", required: false },
      { id: "wc_problems_solved", type: "long_text", required: true },
      { id: "wc_visitor_feeling", type: "multi_select", required: true, maxSelections: 3, options: ["Confident", "Inspired", "Reassured", "Curious", "Excited", "Informed", "Supported"] },
      { id: "wc_colour_preferences", type: "long_text", required: false },
      { id: "wc_colour_palette_style", type: "single_choice", required: false, options: ["Bold and vibrant", "Clean and minimal", "Warm and earthy", "Dark and premium", "Pastel / soft", "I have specific brand colours"] },
      { id: "wc_font_style", type: "single_choice", required: true, options: ["Modern sans-serif", "Classic serif", "Friendly rounded", "Minimal / tech", "No preference"] },
      { id: "wc_imagery_style", type: "single_choice", required: true, options: ["Photography-led", "Illustration-led", "Minimal / icons", "Mix of both", "No preference"] },
      { id: "wc_logo_placement", type: "single_choice", required: false, options: ["Top left", "Top centre", "No preference"] },
      { id: "wc_has_brand_guidelines", type: "single_choice", required: true, options: ["Yes", "No", "Partially"] },
      { id: "wc_competitor_urls", type: "long_text", required: false },
      { id: "wc_disliked_urls", type: "long_text", required: false },
      { id: "wc_forms_needed", type: "multi_select", required: false, options: ["Contact form", "Newsletter signup", "Booking / scheduling", "Quote request", "File upload", "No forms needed"] },
      { id: "wc_legal_pages", type: "multi_select", required: true, options: ["Privacy Policy", "Terms and Conditions", "Cookie Policy", "Disclaimer", "Accessibility Statement", "None needed"] },
      { id: "wc_show_pricing_on_website", type: "single_choice", required: true, options: ["Yes — show starting prices", "Yes — show full pricing details", "No — use \"Get a quote\" approach", "Not sure yet"] },
      { id: "wc_payment_methods_display", type: "multi_select", required: false, options: ["Bank transfer (BACS)", "Credit/Debit card", "PayPal", "Direct Debit", "Cash", "Payment plans available", "Not applicable"] },
      { id: "wc_website_collects_data", type: "single_choice", required: true, options: ["Yes — via contact forms", "Yes — via newsletter signup", "Yes — via both forms and newsletter", "No — just a brochure website"] },
      { id: "wc_needs_cookie_consent", type: "single_choice", required: true, options: ["Yes — required for GDPR compliance", "No — not needed for my website", "Not sure"] },
      { id: "wc_analytics_tools", type: "multi_select", required: false, options: ["Google Analytics", "Meta (Facebook) Pixel", "Google Tag Manager", "Hotjar / Heatmaps", "None needed"] },
      { id: "wc_show_business_hours", type: "single_choice", required: true, options: ["Yes — show my working hours", "No — just contact options", "I work flexible hours"] },
      { id: "wc_phone_on_website", type: "single_choice", required: true, options: ["Yes — show phone number", "No — email and forms only", "Contact via Calendly/booking only"] },
      { id: "wc_email_display", type: "email", required: false },
      { id: "wc_address_on_website", type: "single_choice", required: true, options: ["Yes — show full address", "Show city/region only", "No address shown"] },
      { id: "wc_show_social_links", type: "single_choice", required: true, options: ["Yes — in header and footer", "Yes — in footer only", "Yes — on Contact page only", "No — not needed"] },
      { id: "wc_social_links_to_show", type: "multi_select", required: false, options: ["LinkedIn", "Instagram", "Facebook", "X (Twitter)", "TikTok", "Pinterest", "YouTube"] },
      { id: "wc_testimonials", type: "long_text", required: false },
      { id: "wc_testimonials_count", type: "single_choice", required: true, options: ["3-5 testimonials", "6-8 testimonials", "More than 8", "Just feature one or two prominently"] },
      { id: "wc_credentials_to_show", type: "long_text", required: false },
      { id: "wc_awards_or_press", type: "long_text", required: false },
      { id: "wc_booking_tool", type: "single_choice", required: true, options: ["Yes — Calendly", "Yes — Cal.com", "Yes — another tool", "No — I don't use one", "I want one set up"] },
      { id: "wc_newsletter_signup", type: "single_choice", required: true, options: ["Yes — I have a mailing list", "No — not needed", "I want to set one up"] },
      { id: "wc_homepage_sections", type: "multi_select", required: false, options: ["Hero banner", "About preview", "Services overview", "Testimonials", "FAQ preview", "Latest blog posts", "Newsletter signup", "Contact CTA"] },
      { id: "wc_about_focus", type: "multi_select", required: false, options: ["Your story and journey", "Your qualifications and experience", "Your approach and methodology", "Your values and mission", "Personal side / hobbies", "Team members (if any)"] },
      { id: "wc_about_tone", type: "single_choice", required: false, options: ["Professional and formal", "Warm and personal", "Story-driven and engaging", "No preference"] },
      { id: "wc_services_format", type: "single_choice", required: false, options: ["Card/tile format with icons", "List format with descriptions", "Table format with pricing", "Mixed format", "No preference"] },
      { id: "wc_contact_method", type: "multi_select", required: false, options: ["Contact form", "Direct email link", "Phone number", "Calendar/booking link", "Social media links"] },
      { id: "wc_faq_topics", type: "long_text", required: false },
      { id: "wc_faq_count", type: "single_choice", required: false, options: ["5-6 questions", "8-10 questions", "12+ questions", "No preference — we'll decide"] },
      { id: "wc_blog_style", type: "single_choice", required: false, options: ["Card grid with images", "List format", "Magazine style", "Minimal text-only", "No preference"] },
      { id: "wc_blog_categories", type: "long_text", required: false },
      { id: "wc_portfolio_format", type: "single_choice", required: false, options: ["Grid of images with titles", "Cards with project summaries", "Before/after format", "Detailed case study pages", "No preference"] },
      { id: "wc_portfolio_projects", type: "long_text", required: false },
      { id: "wc_pricing_display", type: "single_choice", required: false, options: ["Tiered packages (e.g. Basic/Pro/Premium)", "Per-service list", "Starting from prices with \"Get quote\" CTA", "Custom quote only", "No preference"] },
      { id: "wc_pricing_highlights", type: "long_text", required: false },
      { id: "wc_testimonials_format", type: "single_choice", required: false, options: ["Quote cards with photos", "Carousel/slider", "Simple list", "Video testimonials", "Mixed formats", "No preference"] },
    ],
  },
  {
    id: "social_media",
    title: "Social Media Content Strategy",
    serviceTags: ["social_media_pack"],
    fields: [
      { id: "sm1_platforms", type: "multi_select", required: true, options: ["LinkedIn", "Instagram", "TikTok", "Facebook", "X (Twitter)", "Pinterest", "Other"] },
      { id: "sm2_content_types", type: "multi_select", required: true, options: ["Educational — teach your audience something useful", "Personal / behind-the-scenes — show the human behind the business", "Authority / expert — position you as the go-to in your niche", "Promotional — direct sells and offers", "Storytelling — client wins, your journey, case studies", "Inspirational / motivational", "Relatable / humorous"] },
      { id: "sm3_avoid_topics", type: "long_text", required: false },
      { id: "sm4_posting_frequency", type: "single_choice", required: true, options: ["3x/week", "5x/week", "Daily", "2x/day", "Not sure"] },
      { id: "sm5_content_pillars", type: "long_text", required: true },
      { id: "sm6_personal_boundaries", type: "long_text", required: true },
      { id: "sm7_hashtag_strategy", type: "single_choice", required: true, options: ["Broad reach — popular hashtags for maximum visibility", "Niche targeted — specific hashtags for your ideal audience", "Mixed — a combination of both", "No preference — let us decide"] },
      { id: "sm8_competitor_accounts", type: "long_text", required: false },
      { id: "sm9_content_tone", type: "single_choice", required: true, options: ["Same as overall brand tone", "More casual/personal", "More professional", "More promotional"] },
      { id: "sm10_call_to_action", type: "long_text", required: false },
      { id: "sm11_existing_accounts", type: "long_text", required: false },
      { id: "sm12_content_calendar", type: "single_choice", required: true, options: ["Weekly themed — each week has a focus topic", "Rotating pillars — cycle through your content pillars evenly", "Mix of types — vary educational, personal, and promotional posts", "No preference — let us decide"] },
      { id: "sm13_upcoming_launches", type: "long_text", required: false },
    ],
  },
  {
    id: "client_onboarding",
    title: "Client Onboarding & Scope Control",
    serviceTags: ["client_onboarding_pack"],
    fields: [
      { id: "co1_onboarding_style", type: "long_text", required: true },
      { id: "co2_onboarding_pain_points", type: "long_text", required: true },
      { id: "co3_scope_creep_experience", type: "single_choice", required: true, options: ["Yes — frequently", "Yes — occasionally", "Rarely", "Never"] },
      { id: "co4_scope_creep_detail", type: "long_text", required: false, conditionalOn: { field: "co3_scope_creep_experience", value: ["Yes — frequently", "Yes — occasionally"] } },
      { id: "co5_communication_channels", type: "multi_select", required: true, options: ["Email", "WhatsApp / SMS", "Phone calls", "Video calls (Zoom / Teams / Meet)", "Project management tool (e.g. Trello, Asana, ClickUp)", "Client portal", "Slack"] },
      { id: "co6_response_time_expectation", type: "single_choice", required: true, options: ["Same business day", "Within 24 hours", "Within 48 hours", "Within 3 business days", "By end of working week"] },
      { id: "co7_client_provides", type: "long_text", required: true },
      { id: "co8_kickoff_format", type: "single_choice", required: true, options: ["Yes — always", "Yes — for larger projects", "No — I start from the brief only"] },
      { id: "co9_revision_policy", type: "long_text", required: true },
      { id: "co10_closing_process", type: "long_text", required: false },
    ],
  },
  {
    id: "payment_protection",
    title: "Payment Protection",
    serviceTags: ["payment_protection_pack"],
    fields: [
      { id: "pp1_late_payment_experience", type: "single_choice", required: true, options: ["Yes — more than once", "Yes — once", "Not yet, but I'm worried about it", "No, never"] },
      { id: "pp2_late_payment_detail", type: "long_text", required: false, conditionalOn: { field: "pp1_late_payment_experience", value: ["Yes — more than once", "Yes — once"] } },
      { id: "pp3_deposit_percentage", type: "single_choice", required: true, options: ["100% upfront", "50% upfront", "33% upfront", "25% upfront", "No deposit — I invoice on completion", "It varies by project"] },
      { id: "pp4_deposit_non_refundable", type: "single_choice", required: true, options: ["Yes — fully non-refundable", "Partially refundable depending on notice given", "Fully refundable if cancelled before work starts", "Not sure — I'd like guidance"] },
      { id: "pp5_invoice_due_days", type: "single_choice", required: true, options: ["Due on receipt", "7 days", "14 days", "30 days", "Custom — I'll explain below"] },
      { id: "pp6_invoice_due_custom", type: "long_text", required: false, conditionalOn: { field: "pp5_invoice_due_days", value: "Custom — I'll explain below" } },
      { id: "pp7_late_payment_interest", type: "single_choice", required: true, options: ["Yes — include 8% above Bank of England base rate", "No — I prefer a flat daily charge", "No — I don't want to charge interest"] },
      { id: "pp8_chargeback_experience", type: "single_choice", required: true, options: ["Yes", "No"] },
      { id: "pp9_chargeback_detail", type: "long_text", required: false, conditionalOn: { field: "pp8_chargeback_experience", value: "Yes" } },
      { id: "pp10_work_stoppage_policy", type: "single_choice", required: true, options: ["Yes — I want clear rights to pause work", "Yes — and the right to terminate the contract", "No — I prefer to continue and chase separately"] },
    ],
  },
  {
    id: "copyright_licensing",
    title: "Copyright & Licensing",
    serviceTags: ["copyright_licensing_pack"],
    fields: [
      { id: "cl1_deliverable_types", type: "multi_select", required: true, options: ["Written content (copy, articles, reports)", "Graphic design or visual assets", "Photographs or video", "Software or code", "Presentations or slide decks", "Strategic frameworks or methodologies", "Training materials or courses", "Audio content or podcasts", "Social media content"] },
      { id: "cl2_ip_ownership_preference", type: "single_choice", required: true, options: ["I retain copyright — I licence the work to the client for agreed uses", "The client owns all rights on full payment", "I retain copyright until paid in full, then transfer", "It depends on the type of work — I'll explain below"] },
      { id: "cl3_ip_ownership_detail", type: "long_text", required: false, conditionalOn: { field: "cl2_ip_ownership_preference", value: "It depends on the type of work — I'll explain below" } },
      { id: "cl4_licence_scope", type: "multi_select", required: true, options: ["Use on client's own website", "Use in client's printed materials", "Use in client's social media", "Resale or sublicensing to third parties", "Use in advertising campaigns", "Use in publications or broadcast media", "Internal business use only"] },
      { id: "cl5_uses_third_party_content", type: "single_choice", required: true, options: ["Yes — regularly", "Yes — occasionally", "No"] },
      { id: "cl6_third_party_detail", type: "long_text", required: false, conditionalOn: { field: "cl5_uses_third_party_content", value: ["Yes — regularly", "Yes — occasionally"] } },
      { id: "cl7_nda_needed", type: "single_choice", required: true, options: ["Yes — regularly", "Yes — for sensitive projects", "Occasionally", "No"] },
      { id: "cl8_nda_type", type: "single_choice", required: false, conditionalOn: { field: "cl7_nda_needed", value: ["Yes — regularly", "Yes — for sensitive projects", "Occasionally"] } },
      { id: "cl9_portfolio_right", type: "single_choice", required: true, options: ["Yes — always", "Yes — with client approval first", "No — I prefer to keep client work confidential"] },
      { id: "cl10_ip_infringement_experience", type: "single_choice", required: true, options: ["Yes", "No"] },
      { id: "cl11_infringement_detail", type: "long_text", required: false, conditionalOn: { field: "cl10_ip_infringement_experience", value: "Yes" } },
    ],
  },
  {
    id: "gdpr_deep",
    title: "GDPR Deep Compliance",
    serviceTags: ["gdpr_deep_pack"],
    fields: [
      { id: "gd1_lawful_basis", type: "multi_select", required: true, options: ["Contractual necessity — processing is necessary to perform a contract", "Legitimate interests — you have a genuine business reason that doesn't override individual rights", "Consent — individuals have actively opted in", "Legal obligation — you must process data to comply with a law", "Vital interests — in rare emergency situations", "Public task — not usually applicable to sole traders"] },
      { id: "gd2_data_processor_relationships", type: "single_choice", required: true, options: ["Yes", "No"] },
      { id: "gd3_processor_list", type: "long_text", required: false, conditionalOn: { field: "gd2_data_processor_relationships", value: "Yes" } },
      { id: "gd4_international_transfers", type: "single_choice", required: true, options: ["Yes", "No", "Not sure"] },
      { id: "gd5_international_transfer_detail", type: "long_text", required: false, conditionalOn: { field: "gd4_international_transfers", value: ["Yes", "Not sure"] } },
      { id: "gd6_sar_procedure", type: "single_choice", required: true, options: ["Yes — a defined process", "Loosely — I'd figure it out when it happens", "No — I need one"] },
      { id: "gd7_breach_procedure", type: "single_choice", required: true, options: ["Yes — I know the 72-hour ICO notification rule", "Partially — I know I'd need to report it", "No — I need clear guidance"] },
      { id: "gd8_high_risk_processing", type: "multi_select", required: true, options: ["Systematic profiling of individuals", "Processing special category data (health, biometric, religion, etc.)", "Large-scale processing of personal data", "Processing children's data", "Monitoring individuals' behaviour", "None of the above"] },
      { id: "gd9_consent_management", type: "single_choice", required: true, options: ["Opt-in tick box on a form", "Double opt-in email confirmation", "Verbal consent noted in CRM", "I don't have a formal consent process", "I don't do marketing emails"] },
      { id: "gd10_retention_clarity", type: "single_choice", required: true, options: ["Yes — financial records kept longer than general correspondence", "No — I keep everything the same amount of time", "Not sure — I'd like guidance"] },
    ],
  },
  {
    id: "industry_coach",
    title: "Coaching Practice Details",
    serviceTags: ["coach_industry_pack"],
    fields: [
      { id: "ic1_coaching_modality", type: "multi_select", required: true, options: ["Life coaching", "Business coaching", "Executive / leadership coaching", "Career coaching", "Health / wellness coaching", "Mindset coaching", "Parenting / relationship coaching", "NLP practitioner", "Hypnotherapy"] },
      { id: "ic2_accreditation", type: "multi_select", required: true, options: ["ICF (International Coaching Federation)", "EMCC (European Mentoring & Coaching Council)", "AC (Association for Coaching)", "CIPD", "NCFE / Ofqual-accredited qualification", "None — self-taught / non-accredited", "Other"] },
      { id: "ic3_session_format", type: "multi_select", required: true, options: ["One-to-one via video call", "One-to-one in person", "Group coaching (online)", "Group coaching (in person)", "Hybrid", "Asynchronous (voice notes / messaging only)"] },
      { id: "ic4_session_length", type: "single_choice", required: true, options: ["30 minutes", "45 minutes", "60 minutes", "90 minutes", "120 minutes", "Varies by programme"] },
      { id: "ic5_programme_structure", type: "single_choice", required: true, options: ["Individual sessions only", "Fixed programme (e.g. 6-week, 3-month)", "Both individual and programme options", "Retainer — ongoing monthly sessions"] },
      { id: "ic6_programme_detail", type: "long_text", required: true },
      { id: "ic7_supervision_arrangement", type: "single_choice", required: true, options: ["Yes — monthly or more frequently", "Yes — quarterly", "Yes — annually", "No — I plan to arrange this", "No — not required in my modality"] },
      { id: "ic8_cancellation_policy", type: "single_choice", required: true, options: ["24 hours", "48 hours", "72 hours / 3 days", "5 business days", "7 days"] },
      { id: "ic9_late_cancellation_fee", type: "single_choice", required: true, options: ["Full session fee charged", "50% of session fee charged", "Session forfeited from programme", "No charge — I'm flexible", "Depends on the situation"] },
      { id: "ic10_confidentiality_exceptions", type: "long_text", required: true },
      { id: "ic11_cpd_hours", type: "short_text", required: false },
    ],
  },
  {
    id: "industry_photographer",
    title: "Photography Practice Details",
    serviceTags: ["photographer_industry_pack"],
    fields: [
      { id: "ip1_photography_specialism", type: "multi_select", required: true, options: ["Wedding photography", "Portrait photography", "Commercial / product photography", "Brand photography", "Event photography", "Family / newborn photography", "Architectural / property photography", "Fashion photography", "Headshots"] },
      { id: "ip2_client_type", type: "multi_select", required: true, options: ["Individuals / consumers", "Small businesses", "Agencies", "Corporate clients", "Charities / non-profits", "Wedding couples / families"] },
      { id: "ip3_licensing_intent", type: "single_choice", required: true, options: ["I retain copyright and licence images for agreed uses", "I transfer full copyright to the client on payment", "I retain copyright but grant unlimited personal use", "It depends on the project type"] },
      { id: "ip4_commercial_use", type: "single_choice", required: true, options: ["Yes — primarily commercial use (advertising, marketing, product sales)", "Mostly personal use with some commercial use", "No — personal use only (family, portraits, events)"] },
      { id: "ip5_model_releases_needed", type: "single_choice", required: true, options: ["Yes — models, actors, brand ambassadors", "Yes — clients' staff and team members", "Yes — members of the public at events", "No — my work primarily features products or environments"] },
      { id: "ip6_location_releases", type: "single_choice", required: true, options: ["Yes — regularly", "Occasionally", "No — I primarily shoot in my studio or public spaces"] },
      { id: "ip7_delivery_format", type: "multi_select", required: true, options: ["High-resolution JPEG", "High-resolution TIFF", "RAW files", "Web-optimised JPEG", "PNG", "PDF contact sheets", "Video files"] },
      { id: "ip8_delivery_timeline", type: "single_choice", required: true, options: ["Within 48 hours", "Within 1 week", "Within 2 weeks", "Within 3-4 weeks", "Within 6-8 weeks (e.g. weddings)", "Varies by project type"] },
      { id: "ip9_editing_rounds", type: "single_choice", required: true, options: ["1 round — final images delivered", "2 rounds — proofs then finals", "3 rounds included", "Unlimited revisions within agreed scope"] },
      { id: "ip10_event_cancellation", type: "long_text", required: true },
      { id: "ip11_portfolio_usage", type: "single_choice", required: true, options: ["Yes — always, without approval needed", "Yes — with client approval first", "No — my work is confidential"] },
    ],
  },
  {
    id: "industry_consultant",
    title: "Consulting Practice Details",
    serviceTags: ["consultant_industry_pack"],
    fields: [
      { id: "con1_consulting_specialism", type: "multi_select", required: true, options: ["Management consulting", "Strategy consulting", "Operations consulting", "IT / technology consulting", "HR / people consulting", "Finance / accounting consulting", "Marketing consulting", "Sales consulting", "Change management", "Compliance / regulatory consulting"] },
      { id: "con2_engagement_model", type: "single_choice", required: true, options: ["Fixed-scope project with defined deliverables", "Time and materials — billed hourly or daily", "Retained advisor — ongoing monthly fee", "Diagnostic phase then implementation phase", "Mixed — depends on the client"] },
      { id: "con3_deliverable_types", type: "multi_select", required: true, options: ["Written reports and recommendations", "Presentations and slide decks", "Process documentation", "Strategic frameworks or models", "Training and workshops", "Implementation support", "Templates and toolkits", "Systems and technology solutions"] },
      { id: "con4_methodology", type: "single_choice", required: true, options: ["Yes — I have a named methodology or framework", "Yes — I have an approach I've developed but it's not formally named", "No — I use standard consulting approaches"] },
      { id: "con5_methodology_detail", type: "long_text", required: false, conditionalOn: { field: "con4_methodology", value: ["Yes — I have a named methodology or framework", "Yes — I have an approach I've developed but it's not formally named"] } },
      { id: "con6_knowledge_transfer", type: "long_text", required: true },
      { id: "con7_conflicts_of_interest", type: "single_choice", required: true, options: ["Yes — I need a clear conflict policy", "Sometimes — I'd like guidance on how to handle this", "No — I only work with one client per sector at a time"] },
      { id: "con8_milestones", type: "single_choice", required: true, options: ["Yes — always", "Yes — for larger projects", "No — I invoice on a time basis"] },
      { id: "con9_reporting_frequency", type: "single_choice", required: true, options: ["Weekly status updates", "Fortnightly updates", "Monthly reports", "At milestone completion only", "Ad hoc as needed"] },
      { id: "con10_acceptance_criteria", type: "single_choice", required: true, options: ["Written sign-off via email", "Formal acceptance form", "Sign-off meeting then invoice", "Payment is treated as acceptance", "I don't currently have a formal process"] },
    ],
  },
  {
    id: "industry_contractor",
    title: "Contractor / Trade Business Details",
    serviceTags: ["contractor_industry_pack"],
    fields: [
      { id: "ct1_trade_type", type: "multi_select", required: true, options: ["General builder / construction", "Electrician", "Plumber / gas engineer", "Carpenter / joiner", "Painter / decorator", "Plasterer", "Roofer", "Landscaper / groundworker", "HVAC engineer", "Specialist installer (e.g. flooring, kitchens)"] },
      { id: "ct2_work_environment", type: "multi_select", required: true, options: ["Private residential properties", "Commercial properties", "Industrial sites", "Outdoor / open sites", "Refurbishment projects", "New build construction", "Rooftop / at height working", "Confined spaces", "Heritage / listed buildings"] },
      { id: "ct3_employees_subcontractors", type: "single_choice", required: true, options: ["Sole operator — I work alone", "I use subcontractors on larger jobs", "I have direct employees", "Mix of employees and subcontractors"] },
      { id: "ct4_cdm_exposure", type: "single_choice", required: true, options: ["Yes — I work on notifiable construction projects", "Sometimes — for projects over 30 working days or 500 person-days", "Rarely — most of my work is smaller domestic jobs", "I'm not sure — I'd like guidance"] },
      { id: "ct5_hazardous_substances", type: "multi_select", required: true, options: ["Cement / concrete (silica dust)", "Solvents and adhesives", "Wood dust (fine or coarse)", "Lead paint (in older properties)", "Asbestos (inspection / removal work)", "Chemical treatments (wood preservatives, pesticides)", "Welding fumes", "None of the above"] },
      { id: "ct6_height_working", type: "single_choice", required: true, options: ["Yes — regularly (roofing, scaffolding, ladders)", "Yes — occasionally", "No — my work is at ground level only"] },
      { id: "ct7_plant_equipment", type: "multi_select", required: true, options: ["Scaffolding", "Lifting equipment (LOLER-regulated)", "Power tools (PUWER-regulated)", "Mini digger or plant machinery", "Cherry picker / MEWP", "Pressure washing equipment", "None of the above"] },
      { id: "ct8_existing_hs_documentation", type: "single_choice", required: true, options: ["Yes — a written H&S policy", "Yes — some risk assessments", "Yes — method statements for specific jobs", "No — I don't have any formal documentation", "Partially — some documentation but gaps"] },
      { id: "ct9_insurance", type: "multi_select", required: true, options: ["Public liability insurance", "Employer's liability insurance", "Professional indemnity insurance", "Plant and equipment insurance", "Contract works insurance", "None currently"] },
      { id: "ct10_defect_liability_period", type: "single_choice", required: true, options: ["6 months", "12 months", "2 years", "As required by contract", "No defect liability period currently offered"] },
      { id: "ct11_specific_hazards", type: "long_text", required: false },
    ],
  },
];

// ── HELPER FUNCTIONS ──

function errorResponse(status: number, error: string, details?: Record<string, unknown>) {
  return new Response(JSON.stringify({ error, ...details }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function successResponse(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function adminQuery(table: string, select: string, filter: Record<string, string>) {
  const params = new URLSearchParams();
  params.set("select", select);
  for (const [key, value] of Object.entries(filter)) {
    params.set(key, `eq.${value}`);
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin query ${table} failed: ${res.status} ${text}`);
    return null;
  }
  return await res.json();
}

async function adminInsert(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin insert ${table} failed: ${res.status} ${text}`);
    return null;
  }
  return await res.json();
}

async function adminUpsert(table: string, data: Record<string, unknown>, onConflict: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: `return=representation,resolution=merge-duplicates`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin upsert ${table} failed: ${res.status} ${text}`);
    return null;
  }
  return await res.json();
}

async function adminUpdate(table: string, data: Record<string, unknown>, filter: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    params.set(key, `eq.${value}`);
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin update ${table} failed: ${res.status} ${text}`);
    return null;
  }
  return await res.json();
}

async function adminDelete(table: string, filter: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    params.set(key, `eq.${value}`);
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    method: "DELETE",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin delete ${table} failed: ${res.status} ${text}`);
    return null;
  }
  return true;
}

// ── AI CALL (chat.z.ai with Gemini fallback) ──

interface AIResult {
  text: string;
  model: string;
  provider: 'chatz' | 'fallback_gemini';
}

async function callChatzAI(prompt: string, systemPrompt: string): Promise<AIResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch('https://api.chat-z.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CHATZ_API_KEY}` },
      body: JSON.stringify({
        model: CHATZ_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Chatz API ${response.status}: ${err.substring(0, 400)}`);
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Chatz returned empty content');
    return { text, model: `chatz-${CHATZ_MODEL}`, provider: 'chatz' };
  } finally {
    clearTimeout(timeout);
  }
}

async function callGeminiAI(prompt: string, systemPrompt: string): Promise<AIResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: TEMPERATURE },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API ${response.status}: ${err.substring(0, 400)}`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned empty content');
    return { text, model: `gemini-${GEMINI_MODEL}`, provider: 'fallback_gemini' };
  } finally {
    clearTimeout(timeout);
  }
}

async function callAI(prompt: string, systemPrompt: string): Promise<AIResult> {
  if (CHATZ_API_KEY) {
    try {
      return await callChatzAI(prompt, systemPrompt);
    } catch (err) {
      console.error('Chatz AI failed, falling back to Gemini:', err);
    }
  }
  if (GEMINI_API_KEY) {
    return await callGeminiAI(prompt, systemPrompt);
  }
  throw new Error('No AI API keys configured. Set CHATZ_API_KEY or GEMINI_API_KEY.');
}

// ── JSON EXTRACTION ──

function extractJSON(text: string): any {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Try to find JSON in code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch {
        // continue
      }
    }
    // Try to find first { and last }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.substring(start, end + 1));
      } catch {
        // continue
      }
    }
    // Try first [ and last ]
    const arrStart = text.indexOf('[');
    const arrEnd = text.lastIndexOf(']');
    if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
      try {
        return JSON.parse(text.substring(arrStart, arrEnd + 1));
      } catch {
        // continue
      }
    }
    throw new Error('Could not extract valid JSON from AI response');
  }
}

// ── PHASE 1: INVENT A BUSINESS PERSONA ──

function buildPersonaPrompt(personaHint?: string): { prompt: string; systemPrompt: string } {
  const systemPrompt = `You are a creative business idea generator. You create realistic, detailed UK sole trader personas for testing purposes. You must return ONLY valid JSON, no other text. The JSON must follow this exact schema:
{
  "legal_name": "Full legal name of the person",
  "trading_name": "Business trading name",
  "first_name": "First name only",
  "industry": "The industry or trade",
  "jurisdiction": "One of: England & Wales, Scotland, Northern Ireland, Republic of Ireland",
  "email": "A realistic email for the business (use a realistic domain, NOT @example.com)",
  "phone": "A realistic UK phone number",
  "address": "A realistic UK address",
  "story": "2-3 sentence backstory of how they started the business",
  "experience": "1-2 sentences about their experience level",
  "differentiator": "1 sentence about what makes them different",
  "tone": "One of: Professional and formal, Warm and approachable, Direct and practical, Creative and expressive, Bold and confident"
}`;

  const prompt = personaHint
    ? `Create a realistic UK sole trader persona based on this hint: "${personaHint}". Make it detailed and believable. Return ONLY the JSON object.`
    : `Create a realistic UK sole trader persona. Pick any industry — be creative. Make it detailed and believable. Return ONLY the JSON object.`;

  return { prompt, systemPrompt };
}

// ── PHASE 2: FILL THE INTAKE FORM ──

function buildFormFillPrompt(sections: SectionDef[], persona: any): { prompt: string; systemPrompt: string } {
  const systemPrompt = `You are filling out a business intake form on behalf of a UK sole trader. You will receive a list of form fields and a persona. You must return ONLY a valid JSON object where every key is an exact field ID and every value is a valid answer.

Rules:
1. For "short_text" and "long_text" fields: return a string.
2. For "email" fields: return a valid email string.
3. For "phone" fields: return a realistic UK phone number string.
4. For "url" fields: return a realistic URL string (or empty string if not applicable).
5. For "single_choice" fields: return EXACTLY one of the provided options (as a string).
6. For "multi_select" fields: return an array of strings, each being one of the provided options. Select 1-3 options.
7. For "checkbox" fields: return true.
8. For "file_upload" fields: return an empty array [].
9. For "repeating_section" fields: return an array of objects, each object having keys matching the subField IDs. Include 2-3 items.
10. For conditional fields (conditionalOn): only include the field if the condition would be met based on your answers. If the condition would NOT be met, omit that field entirely.
11. All answers must be consistent with the persona and make business sense.
12. Return ONLY the JSON object, no other text, no markdown code blocks.`;

  const fieldsDescription = sections.map(section => {
    const fields = section.fields.map(field => {
      let desc = `${field.id} (${field.type}, required: ${field.required})`;
      if (field.options) {
        desc += ` [options: ${field.options.map(o => `"${o}"`).join(', ')}]`;
      }
      if (field.conditionalOn) {
        const valStr = Array.isArray(field.conditionalOn.value) ? field.conditionalOn.value.join(' or ') : field.conditionalOn.value;
        desc += ` [only include if ${field.conditionalOn.field} is ${valStr}]`;
      }
      if (field.isRepeating && field.subFields) {
        desc += ` [repeating section with sub-fields: ${field.subFields.map(sf => `${sf.id} (${sf.type})`).join(', ')}]`;
      }
      if (field.maxSelections) {
        desc += ` [max ${field.maxSelections} selections]`;
      }
      return `  - ${desc}`;
    }).join('\n');

    return `Section "${section.title}":\n${fields}`;
  }).join('\n\n');

  const prompt = `Persona:
${JSON.stringify(persona, null, 2)}

Form fields to fill:
${fieldsDescription}

Return ONLY a JSON object with field IDs as keys and valid answers as values. Do not include any markdown formatting or explanation.`;

  return { prompt, systemPrompt };
}

// ── VALIDATION ──

function validateResponses(sections: SectionDef[], responses: Record<string, any>): { valid: boolean; missing: string[]; errors: string[] } {
  const missing: string[] = [];
  const errors: string[] = [];

  for (const section of sections) {
    for (const field of section.fields) {
      if (!field.required) continue;

      // Skip conditional fields — they may or may not be present
      if (field.conditionalOn) {
        // Check if the condition is met
        const sourceValue = responses[field.conditionalOn.field];
        const conditionValue = field.conditionalOn.value;
        const isMet = Array.isArray(conditionValue)
          ? conditionValue.includes(sourceValue)
          : sourceValue === conditionValue;
        if (!isMet) continue; // Condition not met, skip
      }

      // Skip file_upload fields — always empty
      if (field.type === 'file_upload') continue;

      // Skip repeating sections — validated separately
      if (field.isRepeating) {
        const value = responses[field.id];
        if (!Array.isArray(value) || value.length === 0) {
          missing.push(field.id);
        }
        continue;
      }

      const value = responses[field.id];
      if (value === undefined || value === null || value === '') {
        missing.push(field.id);
        continue;
      }

      // Validate single_choice
      if (field.type === 'single_choice' && field.options) {
        if (!field.options.includes(value)) {
          errors.push(`${field.id}: "${value}" is not a valid option`);
        }
      }

      // Validate multi_select
      if (field.type === 'multi_select' && field.options) {
        if (!Array.isArray(value)) {
          errors.push(`${field.id}: expected array, got ${typeof value}`);
        } else {
          for (const v of value) {
            if (!field.options.includes(v)) {
              errors.push(`${field.id}: "${v}" is not a valid option`);
            }
          }
        }
      }
    }
  }

  return { valid: missing.length === 0 && errors.length === 0, missing, errors };
}

// ── CREATE AUTH USER ──

async function createAuthUser(email: string, password: string): Promise<string | null> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to create auth user: ${res.status} ${text}`);
    return null;
  }
  const data = await res.json();
  return data.id;
}

// ── GENERATE A SINGLE TEST CLIENT ──

async function generateTestClient(serviceIds: string[], personaHint?: string): Promise<{ success: boolean; userId?: string; email?: string; businessName?: string; error?: string }> {
  // Phase 1: Invent a business persona
  const { prompt: personaPrompt, systemPrompt: personaSystem } = buildPersonaPrompt(personaHint);
  const personaResult = await callAI(personaPrompt, personaSystem);
  const persona = extractJSON(personaResult.text);

  if (!persona.legal_name || !persona.trading_name) {
    return { success: false, error: 'AI generated invalid persona' };
  }

  // Phase 2: Fill the intake form
  const sections = buildFieldDefinitions(serviceIds);
  const { prompt: fillPrompt, systemPrompt: fillSystem } = buildFormFillPrompt(sections, persona);

  let responses: Record<string, any> | null = null;
  let lastError = '';

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const fillResult = await callAI(fillPrompt, fillSystem);
      responses = extractJSON(fillResult.text);

      // Hardcode consent checkboxes
      responses['q82_consent_not_legal'] = true;
      responses['q83_consent_accuracy'] = true;

      // Validate
      const validation = validateResponses(sections, responses);
      if (validation.valid) {
        break;
      }

      lastError = `Validation failed: missing [${validation.missing.slice(0, 5).join(', ')}${validation.missing.length > 5 ? '...' : ''}], errors [${validation.errors.slice(0, 3).join(', ')}]`;
      console.log(`Attempt ${attempt + 1} validation failed: ${lastError}`);

      // If not the last attempt, add the errors to the prompt for a retry
      if (attempt < 2) {
        const retryHint = `\n\nYour previous response had these issues: ${lastError}. Please fix and return the complete JSON object again.`;
        const retryPrompt = fillPrompt + retryHint;
        const retryResult = await callAI(retryPrompt, fillSystem);
        responses = extractJSON(retryResult.text);
        responses['q82_consent_not_legal'] = true;
        responses['q83_consent_accuracy'] = true;

        const retryValidation = validateResponses(sections, responses);
        if (retryValidation.valid) {
          break;
        }
        lastError = `Retry validation failed: missing [${retryValidation.missing.slice(0, 5).join(', ')}], errors [${retryValidation.errors.slice(0, 3).join(', ')}]`;
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Unknown error during form fill';
      console.error(`Form fill attempt ${attempt + 1} error:`, lastError);
    }
  }

  if (!responses) {
    return { success: false, error: `Failed to generate valid form responses: ${lastError}` };
  }

  // Final validation — accept even with minor issues (missing optional fields)
  const finalValidation = validateResponses(sections, responses);
  if (!finalValidation.valid && finalValidation.missing.length > 0) {
    console.log(`Accepting responses with ${finalValidation.missing.length} missing required fields (best effort)`);
  }

  // Create auth user
  const timestamp = Date.now();
  const slug = persona.trading_name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 30);
  const email = `test_${timestamp}_${slug}@foundationary-test.internal`;
  const password = `Test${timestamp}!`;

  const userId = await createAuthUser(email, password);
  if (!userId) {
    return { success: false, error: 'Failed to create auth user' };
  }

  const now = new Date().toISOString();

  // Insert client profile
  await adminInsert('client_profiles', {
    user_id: userId,
    email,
    business_name: persona.trading_name,
    full_name: persona.legal_name,
    phone: persona.phone,
    has_submitted_intake: true,
    intake_submitted_at: now,
    intake_complete_for_services: serviceIds,
    is_test_client: true,
    created_at: now,
    updated_at: now,
  });

  // Insert services purchased
  for (const serviceId of serviceIds) {
    await adminInsert('services_purchased', {
      user_id: userId,
      service_id: serviceId,
      status: 'active',
      created_at: now,
      updated_at: now,
    });
  }

  // Insert intake responses
  const sectionProgress: Record<string, boolean> = {};
  for (const section of sections) {
    sectionProgress[section.id] = true;
  }

  await adminUpsert('intake_responses', {
    user_id: userId,
    responses,
    current_section_id: 'final',
    section_progress: sectionProgress,
    purchased_service_ids: serviceIds,
    intake_complete_for_services: serviceIds,
    submitted_at: now,
    last_saved_at: now,
    form_version: 'v4',
    submission_count: 1,
  }, 'user_id');

  // Trigger brief generation (fire and forget)
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/generate-brief`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ user_id: userId }),
    });
  } catch (err) {
    console.error('Brief generation trigger failed (non-fatal):', err);
  }

  return {
    success: true,
    userId,
    email,
    businessName: persona.trading_name,
  };
}

// ── MAIN HANDLER ──

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return errorResponse(405, 'Method not allowed');
  }

  try {
    // Verify admin auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse(401, 'Missing auth token');
    }

    const token = authHeader.replace('Bearer ', '');

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) {
      return errorResponse(401, 'Invalid token');
    }

    const user = await userRes.json();

    // Check if user is admin (via email or app_metadata)
    const email = user.email || '';
    const appMetadata = user.app_metadata || {};
    const isAdmin = appMetadata?.is_admin === true ||
      email.endsWith('@foundationary.co.uk') ||
      email.endsWith('@foundationary.com') ||
      email === 'admin@foundationary.co.uk';

    if (!isAdmin) {
      return errorResponse(403, 'Admin access required');
    }

    const body = await req.json();
    const { service_ids, persona_hint, count } = body;

    if (!service_ids || !Array.isArray(service_ids) || service_ids.length === 0) {
      return errorResponse(400, 'service_ids array is required');
    }

    // Validate service IDs
    for (const id of service_ids) {
      if (!SERVICE_CATALOG[id]) {
        return errorResponse(400, `Unknown service ID: ${id}`);
      }
    }

    const clientCount = Math.min(Math.max(1, count || 1), MAX_COUNT_PER_REQUEST);

    // Check total test client count
    const existingTestClients = await adminQuery('client_profiles', 'user_id', { is_test_client: 'true' });
    const existingCount = Array.isArray(existingTestClients) ? existingTestClients.length : 0;
    if (existingCount + clientCount > MAX_TEST_CLIENTS) {
      return errorResponse(400, `Maximum test clients (${MAX_TEST_CLIENTS}) would be exceeded. Current: ${existingCount}, requested: ${clientCount}`);
    }

    // Generate clients
    const results: Array<{ success: boolean; email?: string; businessName?: string; error?: string }> = [];

    for (let i = 0; i < clientCount; i++) {
      try {
        const hint = persona_hint ? `${persona_hint} (variation ${i + 1})` : undefined;
        const result = await generateTestClient(service_ids, hint);
        results.push({
          success: result.success,
          email: result.email,
          businessName: result.businessName,
          error: result.error,
        });
      } catch (err) {
        results.push({
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return successResponse({
      success: successCount > 0,
      generated: successCount,
      failed: failCount,
      results,
      totalTestClients: existingCount + successCount,
    });
  } catch (err) {
    console.error('seed-test-client error:', err);
    return errorResponse(500, 'Internal server error', {
      detail: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});
