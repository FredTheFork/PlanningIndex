import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Document-type → service-id mapping (mirrors document-service-map.ts)
const DOCUMENT_TYPE_TO_SERVICE_ID: Record<string, string> = {
  terms_and_conditions: "business_foundations_pack",
  service_agreement_contract: "business_foundations_pack",
  gdpr_privacy_policy: "business_foundations_pack",
  professional_invoice_template: "business_foundations_pack",
  late_payment_letters: "business_foundations_pack",
  welcome_email_sequence: "business_foundations_pack",
  professional_bio: "business_foundations_pack",
  elevator_pitch: "business_foundations_pack",
  linkedin_profile_script: "business_foundations_pack",
  service_description_sheets: "business_foundations_pack",
  homepage_copy: "website_copy_pack",
  about_page_copy: "website_copy_pack",
  services_page_copy: "website_copy_pack",
  contact_page_copy: "website_copy_pack",
  social_media_posts: "social_media_pack",
};

interface DocumentRequest {
  user_id: string;
  document_type: string;
  service_id?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { user_id, document_type, service_id }: DocumentRequest = await req.json();

    if (!user_id || !document_type) {
      return new Response(
        JSON.stringify({ error: "user_id and document_type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resolve service_id: explicit > inferred from mapping
    const resolvedServiceId = service_id || DOCUMENT_TYPE_TO_SERVICE_ID[document_type];

    // Get document label
    const documentLabel = getDocumentLabel(document_type);

    // Upsert a pending record in generated_documents
    const upsertPayload: Record<string, any> = {
      client_id: user_id,
      document_type,
      document_label: documentLabel,
      status: "generating",
    };

    // Try to update existing, or insert new
    const checkUrl = `${SUPABASE_URL}/rest/v1/generated_documents?client_id=eq.${user_id}&document_type=eq.${document_type}&select=id`;
    const checkRes = await fetch(checkUrl, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    const existing = await checkRes.json();

    if (existing?.length > 0) {
      const updateUrl = `${SUPABASE_URL}/rest/v1/generated_documents?id=eq.${existing[0].id}`;
      await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(upsertPayload),
      });
    } else {
      const insertUrl = `${SUPABASE_URL}/rest/v1/generated_documents`;
      await fetch(insertUrl, {
        method: "POST",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(upsertPayload),
      });
    }

    // Fetch the brief for this service
    const briefFilter = resolvedServiceId
      ? `&service_id=eq.${resolvedServiceId}`
      : "&service_id=is.null";
    const briefUrl = `${SUPABASE_URL}/rest/v1/client_briefs?client_id=eq.${user_id}&select=brief_content${briefFilter}`;
    const briefRes = await fetch(briefUrl, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    const briefData = await briefRes.json();

    // If no service-specific brief, fall back to any brief
    let briefContent = briefData?.[0]?.brief_content;
    if (!briefContent) {
      const fallbackBriefUrl = `${SUPABASE_URL}/rest/v1/client_briefs?client_id=eq.${user_id}&select=brief_content&order=created_at.desc&limit=1`;
      const fallbackRes = await fetch(fallbackBriefUrl, {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
      });
      const fallbackData = await fallbackRes.json();
      briefContent = fallbackData?.[0]?.brief_content;
    }

    if (!briefContent) {
      // Mark as failed — no brief
      const failPayload = {
        status: "failed",
        error_message: "No client brief found. Generate a brief first.",
      };
      const failUrl = existing?.length > 0
        ? `${SUPABASE_URL}/rest/v1/generated_documents?id=eq.${existing[0].id}`
        : `${SUPABASE_URL}/rest/v1/generated_documents?client_id=eq.${user_id}&document_type=eq.${document_type}`;
      await fetch(failUrl, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(failPayload),
      });

      return new Response(
        JSON.stringify({ error: "No client brief found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the system prompt for this document type
    const systemPrompt = getSystemPrompt(document_type);
    if (!systemPrompt) {
      const failPayload = {
        status: "failed",
        error_message: `No system prompt found for document type: ${document_type}`,
      };
      const failUrl = existing?.length > 0
        ? `${SUPABASE_URL}/rest/v1/generated_documents?id=eq.${existing[0].id}`
        : `${SUPABASE_URL}/rest/v1/generated_documents?client_id=eq.${user_id}&document_type=eq.${document_type}`;
      await fetch(failUrl, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(failPayload),
      });

      return new Response(
        JSON.stringify({ error: `No system prompt for document type: ${document_type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate the document using Claude API
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    let generatedContent: string;
    let modelUsed: string;

    const fullPrompt = `${systemPrompt}\n\n=== CLIENT BRIEF ===\n${briefContent}\n=== END BRIEF ===\n\nNow generate the complete document as described above.`;

    if (ANTHROPIC_API_KEY) {
      const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 16000,
          system: "You are a professional document generator for UK sole traders. Produce complete, publication-ready documents using real data from the client brief. No placeholders except signature fields. UK English throughout.",
          messages: [{ role: "user", content: fullPrompt }],
        }),
      });

      const claudeData = await claudeRes.json();
      if (claudeData.content?.[0]?.text) {
        generatedContent = claudeData.content[0].text;
        modelUsed = "claude-sonnet-4-20250514";
      } else {
        generatedContent = fullPrompt;
        modelUsed = "fallback";
      }
    } else {
      generatedContent = fullPrompt;
      modelUsed = "structured-prompt";
    }

    // Update the document record with generated content
    const completePayload = {
      content_text: generatedContent,
      status: "completed",
      model_used: modelUsed,
      generated_at: new Date().toISOString(),
      error_message: null,
    };

    const completeUrl = existing?.length > 0
      ? `${SUPABASE_URL}/rest/v1/generated_documents?id=eq.${existing[0].id}`
      : `${SUPABASE_URL}/rest/v1/generated_documents?client_id=eq.${user_id}&document_type=eq.${document_type}`;
    await fetch(completeUrl, {
      method: "PATCH",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(completePayload),
    });

    return new Response(
      JSON.stringify({ success: true, model: modelUsed, document_type }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Document generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ─── System Prompts (mirrors document-configs.ts) ────────────────────────────

function getDocumentLabel(docType: string): string {
  const labels: Record<string, string> = {
    terms_and_conditions: "Terms and Conditions",
    service_agreement_contract: "Service Agreement Contract",
    gdpr_privacy_policy: "GDPR Privacy Policy",
    professional_invoice_template: "Professional Invoice Template",
    late_payment_letters: "Late Payment Letters",
    welcome_email_sequence: "Welcome Email Sequence",
    professional_bio: "Professional Bio",
    elevator_pitch: "Elevator Pitch",
    linkedin_profile_script: "LinkedIn Profile Script",
    service_description_sheets: "Service Description Sheets",
    homepage_copy: "Homepage Copy",
    about_page_copy: "About Page Copy",
    services_page_copy: "Services Page Copy",
    contact_page_copy: "Contact Page Copy",
    social_media_posts: "Social Media Posts (30)",
  };
  return labels[docType] || docType;
}

function getSystemPrompt(docType: string): string | undefined {
  const prompts: Record<string, string> = {
    terms_and_conditions: `You are a senior UK commercial solicitor with 25 years of experience drafting small business contracts. Produce a complete, legally robust Terms and Conditions document for a UK sole trader or small business.

FORMATTING: No markdown. Section headings: === SECTION NAME ===. Numbered clauses: 1. 1.1. 1.1.1. Clean plain text.

DOCUMENT STRUCTURE:
1. PARTIES AND DEFINITIONS
2. FORMATION OF CONTRACT
3. DESCRIPTION OF SERVICES (one sub-section per service from the brief)
4. CLIENT OBLIGATIONS
5. FEES, INVOICING, AND PAYMENT (late payment at "8% per annum above the Bank of England base rate")
6. REFUND AND CANCELLATION POLICY
7. INTELLECTUAL PROPERTY (IP stays with provider BEFORE full payment; assign/licence AFTER)
8. CONFIDENTIALITY
9. DATA PROTECTION
10. WARRANTIES
11. LIMITATION OF LIABILITY (cap = 12 months fees)
12. FORCE MAJEURE
13. TERMINATION
14. DISPUTE RESOLUTION AND GOVERNING LAW
15. GENERAL (entire agreement, severability, waiver, notices, no partnership, assignment, third-party rights)
16. CONTACT DETAILS
17. LEGAL DISCLAIMER

Target length: 4,500–6,000 words. Populate EVERY field with real data from the brief.`,

    service_agreement_contract: `You are a senior UK commercial solicitor producing a Bespoke Client Contract. FORMATTING: No markdown. Section headings: === SECTION NAME ===. Numbered clauses.

DOCUMENT STRUCTURE:
1. PARTIES 2. RECITALS 3. INCORPORATION OF GENERAL T&Cs 4. SERVICES AND SCOPE 5. DELIVERABLES 6. TIMELINE 7. FEES AND PAYMENT 8. REFUND AND CANCELLATION 9. IP 10. CONFIDENTIALITY 11. DATA PROTECTION 12. WARRANTIES 13. LIMITATION OF LIABILITY 14. TERMINATION 15. ABANDONED PROJECT 16. GOVERNING LAW 17. SIGNATURES 18. LEGAL DISCLAIMER

Target: 3,800–5,500 words. All details from brief.`,

    gdpr_privacy_policy: `You are a UK data protection specialist producing a Privacy Notice. PHANTOM DATA PROHIBITION: Only include data EXPLICITLY stated in the brief. FORMATTING: No markdown. === SECTION NAME ===.

STRUCTURE: 1. WHO WE ARE 2. WHAT THIS NOTICE COVERS 3. WHAT DATA WE COLLECT 4. HOW WE COLLECT 5. PURPOSES AND LEGAL BASIS 6. WHO WE SHARE WITH 7. INTERNATIONAL TRANSFERS 8. RETENTION 9. SECURITY 10. YOUR RIGHTS 11. COOKIES 12. CHANGES 13. HOW TO COMPLAIN (ICO) 14. LEGAL DISCLAIMER

Use "UK GDPR" throughout. Target: 2,800–4,000 words.`,

    professional_invoice_template: `You are a UK business finance specialist producing a professional invoice template complying with UK invoicing requirements. Include all legal requirements: business name, address, invoice number, date, client details, service description, amounts, VAT if registered, payment terms, late payment clause.

Format as clean plain text. No markdown. Include [FIELD TO COMPLETE] placeholders for variable fields.`,

    late_payment_letters: `You are a UK debt recovery specialist producing a three-letter graduated late payment sequence per the Late Payment of Commercial Debts (Interest) Act 1998 and Pre-Action Protocol.

Letter 1: Professional, assumes oversight (180–230 words). Letter 2: Firm, cites statutory rights (270–350 words). Letter 3: Pre-Action Notice per Civil Procedure Rules. Include usage notes. All amounts as [CALCULATE BEFORE SENDING] placeholders.`,

    welcome_email_sequence: `You are an expert in client onboarding communications for UK service businesses. Produce THREE complete emails:
Email 1 — IMMEDIATE WELCOME (180–240 words)
Email 2 — ONBOARDING AND NEXT STEPS (200–270 words)
Email 3 — VALUE ADD (170–220 words)
Apply tone from brief. Each email ready to send with only [Client First Name] placeholder.`,

    professional_bio: `You are a UK personal branding copywriter. Produce THREE versions:
SHORT BIO (50 words) — email signature, LinkedIn tagline
MEDIUM BIO (150 words) — website sidebar, proposals
LONG BIO (350 words) — full About page, media kit
NEVER use: "passionate about", "driven", "results-oriented", "helping businesses thrive". Apply tone from brief.`,

    elevator_pitch: `You are a specialist pitch coach. Produce FOUR versions:
15-SECOND (40–55 words), 30-SECOND (75–100 words), 60-SECOND (140–170 words), WRITTEN (80–120 words)
Never open with business name or job title. Every pitch answers: Who you help, their problem, what you do, the result, why you.`,

    linkedin_profile_script: `You are a LinkedIn optimisation strategist. Produce:
KEYWORD STRATEGY (primary + secondary), HEADLINE OPTIONS (3, max 220 chars), ABOUT SECTION (max 2,600 chars), EXPERIENCE SECTION (6–8 bullets), SKILLS (18–22), FEATURED RECOMMENDATIONS (3), BANNER TAGLINE (2 options), GROWTH STRATEGY (200 words), SAMPLE POSTS (2)`,

    service_description_sheets: `You are a professional business copywriter producing service description sheets. One sheet per service from Q15. Each sheet: Service at a Glance, What's Included, What's Not Included, Who It's For, Process and Timeline, Results, Investment, Get Started, Scope Note. Apply tone from Q62. UK English.`,

    homepage_copy: `You are a professional website copywriter for UK sole traders. Write compelling homepage copy with:
=== HERO === (headline max 10 words, subheadline, CTA)
=== BENEFITS === (3–5 benefit blocks with headline + description)
=== SOCIAL PROOF === (credibility section)
=== FINAL CTA === (urgency + button)
UK English. Client's tone of voice. Ready to paste into website builder. No placeholders — use real data from brief.`,

    about_page_copy: `Write a professional About page for a UK sole trader website.
=== OPENING === (belief/observation, not "I am")
=== THE STORY === (business origin from brief, 150–250 words)
=== VALUES AND APPROACH === (3–4 principles)
=== WHY WORK WITH [BUSINESS] === (2–3 specific reasons)
=== CTA === (specific next step)
Target: 400–600 words. UK English. No clichés.`,

    services_page_copy: `Write a Services page for a UK sole trader website. For each service:
Description (2–3 sentences), What's included (3–6 bullets), What's not included (2–4 bullets), Expected outcome, Investment/price
Page intro (2–3 sentences). CTA at end. UK English. Clear, confident. Only services from the brief.`,

    contact_page_copy: `Write Contact page copy for a UK sole trader website.
=== HEADING === (friendly, not "Contact Us")
=== WELCOME TEXT === (2–3 sentences)
=== HOW TO REACH === (preferred method, email, phone, hours)
=== WHAT HAPPENS NEXT === (2–3 sentences)
Target: 150–250 words. UK English. Warm, professional.`,

    social_media_posts: `Create 30 social media posts for a UK sole trader.
Categories: 10 Educational, 10 Promotional, 10 Personal/trust.
Each post: Post number + category, Caption (ready to post), Hashtags (3–5), Image prompt (1–2 sentences), Platform suggestion.
UK English. Client's brand voice. No generic motivational quotes. Make every post specific to their business. Space across 4–6 weeks. Include carousel/thread format suggestions.`,
  };

  return prompts[docType];
}
