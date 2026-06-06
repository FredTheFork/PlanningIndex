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
  website_homepage: "website_copy_pack",
  website_about: "website_copy_pack",
  website_services: "website_copy_pack",
  website_contact: "website_copy_pack",
  social_media_posts: "social_media_pack",
};

interface DocumentRequest {
  user_id: string;
  document_type: string;
  service_id?: string;
  /** For quarterly refresh: update instructions describing what changed. */
  update_instructions?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { user_id, document_type, service_id, update_instructions }: DocumentRequest = await req.json();

    if (!user_id || !document_type) {
      return new Response(
        JSON.stringify({ error: "user_id and document_type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resolve service_id: explicit > inferred from mapping
    const resolvedServiceId = service_id || DOCUMENT_TYPE_TO_SERVICE_ID[document_type];

    const isRefresh = !!update_instructions?.trim();

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
      await markFailed(existing, user_id, document_type, "No client brief found. Generate a brief first.");
      return new Response(
        JSON.stringify({ error: "No client brief found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the system prompt for this document type
    const systemPrompt = getSystemPrompt(document_type);
    if (!systemPrompt) {
      await markFailed(existing, user_id, document_type, `No system prompt found for document type: ${document_type}`);
      return new Response(
        JSON.stringify({ error: `No system prompt for document type: ${document_type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For refresh: fetch existing document content to reference
    let existingContent: string | null = null;
    if (isRefresh) {
      const existingDocUrl = `${SUPABASE_URL}/rest/v1/generated_documents?client_id=eq.${user_id}&document_type=eq.${document_type}&select=content_text`;
      const existingDocRes = await fetch(existingDocUrl, {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
      });
      const existingDocData = await existingDocRes.json();
      existingContent = existingDocData?.[0]?.content_text || null;
    }

    // Build the full prompt
    let fullPrompt: string;
    if (isRefresh && existingContent) {
      fullPrompt = `${systemPrompt}\n\n=== EXISTING DOCUMENT ===\n${existingContent}\n=== END EXISTING DOCUMENT ===\n\n=== CLIENT BRIEF ===\n${briefContent}\n=== END BRIEF ===\n\n=== UPDATE INSTRUCTIONS ===\n${update_instructions}\n=== END UPDATE INSTRUCTIONS ===\n\nYou are updating an EXISTING document based on the update instructions above. Apply the changes described in the update instructions to the existing document. Keep all unchanged sections intact. Produce the COMPLETE updated document — not just the changed sections. The output must be a full, publication-ready document with all changes incorporated.`;
    } else if (isRefresh) {
      // Refresh requested but no existing content — treat as initial generation
      fullPrompt = `${systemPrompt}\n\n=== CLIENT BRIEF ===\n${briefContent}\n=== END BRIEF ===\n\n=== UPDATE INSTRUCTIONS ===\n${update_instructions}\n=== END UPDATE INSTRUCTIONS ===\n\nNo existing document was found. Generate a complete document incorporating the update instructions above as part of the initial creation. Produce a full, publication-ready document.`;
    } else {
      fullPrompt = `${systemPrompt}\n\n=== CLIENT BRIEF ===\n${briefContent}\n=== END BRIEF ===\n\nNow generate the complete document as described above.`;
    }

    // Generate the document using Claude API
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    let generatedContent: string;
    let modelUsed: string;

    const claudeSystemPrompt = isRefresh
      ? "You are a professional document generator for UK sole traders. You are updating an existing document based on update instructions. Produce the complete updated document with all changes incorporated. Keep unchanged sections exactly as they were. UK English throughout."
      : "You are a professional document generator for UK sole traders. Produce complete, publication-ready documents using real data from the client brief. No placeholders except signature fields. UK English throughout.";

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
          system: claudeSystemPrompt,
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
      JSON.stringify({ success: true, model: modelUsed, document_type, refreshed: isRefresh }),
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

// ─── Helpers ────────────────────────────────────────────────────────────────────

async function markFailed(
  existing: any[] | null,
  userId: string,
  docType: string,
  errorMessage: string,
) {
  const failPayload = {
    status: "failed",
    error_message: errorMessage,
  };
  const failUrl = existing?.length > 0
    ? `${SUPABASE_URL}/rest/v1/generated_documents?id=eq.${existing[0].id}`
    : `${SUPABASE_URL}/rest/v1/generated_documents?client_id=eq.${userId}&document_type=eq.${docType}`;
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
}

// ─── Document Labels (mirrors document-configs.ts) ─────────────────────────────

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
    website_homepage: "Homepage Copy",
    website_about: "About Page Copy",
    website_services: "Services Page Copy",
    website_contact: "Contact Page Copy",
    social_media_posts: "Social Media Posts (30)",
  };
  return labels[docType] || docType;
}

// ─── System Prompts (mirrors document-configs.ts) ──────────────────────────────

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

    website_homepage: `You are a professional website copywriter and conversion specialist for UK sole traders. Write compelling homepage copy designed to convert visitors into enquiries.

STRUCTURE AND DESIGN TEMPLATE:

=== HERO SECTION ===
- Headline: maximum 10 words, benefit-led, speaks to the ideal client's primary pain point
- Subheadline: 1–2 sentences expanding on the headline with specificity
- Primary CTA button text: action-oriented (e.g. "Book Your Free Discovery Call")
- Supporting line below CTA: risk-reducer (e.g. "No obligation — 15-minute chat")

=== BENEFITS SECTION ===
- Section heading: benefit-focused, not "Our Benefits"
- 3–5 benefit blocks, each with:
  - Benefit headline (6 words max)
  - Benefit description (2–3 sentences explaining the transformation)
- Order: most compelling benefit first

=== SOCIAL PROOF / CREDIBILITY SECTION ===
- Trust indicators: years of experience, number of clients, relevant qualifications
- Optional testimonial placeholder: "[Client Testimonial]"
- Professional affiliations or certifications if mentioned in brief

=== FINAL CTA SECTION ===
- Restate the primary outcome
- CTA button (same as hero or slight variation)
- Urgency or scarcity element if applicable

RULES:
- UK English throughout
- Use the client's tone of voice from the brief
- No placeholders except [Client Testimonial] — use real data from brief
- No generic marketing language — every word specific to this business
- Headlines and CTAs must be ready to paste into a website builder
- No markdown formatting — use plain text with section markers as shown`,

    website_about: `You are a professional website copywriter and brand storyteller for UK sole traders. Write an About page that builds trust and connection without clichés.

STRUCTURE AND DESIGN TEMPLATE:

=== OPENING ===
- Start with a belief, observation, or surprising statement about their industry
- NOT "I am [name] and I help [target] with [service]"
- 2–3 sentences that immediately signal expertise and perspective

=== THE STORY ===
- Business origin: why they started, what they saw was missing
- Draw from background and experience in the brief
- 150–250 words
- Show, don't tell — specific moments, not vague claims

=== VALUES AND APPROACH ===
- 3–4 named principles with a sentence each
- Each principle should differentiate, not state the obvious
- Format: "Principle Name — One sentence explanation"

=== WHY WORK WITH [BUSINESS NAME] ===
- 2–3 specific, concrete reasons
- Each reason backed by something from the brief (experience, results, process)
- Not generic ("we care about quality") — specific ("we've helped 47 clients in [industry]")

=== CTA ===
- Specific next step, not "Get in Touch"
- Match the service they most want to sell
- One sentence

RULES:
- Target: 400–600 words total
- UK English throughout
- Client's tone of voice from the brief
- No "passionate about", "dedicated to", "combined experience of"
- No markdown — use === SECTION === markers
- Every claim must trace back to data in the brief`,

    website_services: `You are a professional website copywriter for UK sole traders. Write a Services page that clearly presents what the business offers, aligned with the service descriptions from the brief.

STRUCTURE AND DESIGN TEMPLATE:

=== PAGE INTRO ===
- 2–3 sentences setting up what follows
- Benefit-led, not feature-led
- Speaks to the ideal client's situation

=== SERVICE BLOCKS (one per service from the brief) ===
For each service:
- Service Name: clear, client-facing name
- Description: 2–3 sentences explaining what it is and who it's for
- What's Included: 3–6 bullet points (use actual inclusions from brief)
- What's Not Included: 2–4 bullet points (manage expectations)
- Expected Outcome: 1–2 sentences describing the result
- Investment: pricing from brief, or "Contact for pricing" if not specified

=== CTA SECTION ===
- Heading: action-oriented
- 1–2 sentences encouraging next step
- CTA button text

RULES:
- UK English throughout
- Client's tone of voice from the brief
- Only include services mentioned in the brief — no invented services
- No markdown formatting — use plain text with === markers
- Clear, confident, jargon-free language
- Each service block ready to paste into a website builder`,

    website_contact: `You are a professional website copywriter for UK sole traders. Write Contact page copy that makes reaching out feel easy and natural.

STRUCTURE AND DESIGN TEMPLATE:

=== HEADING ===
- Friendly and approachable, NOT "Contact Us"
- Reflect the business personality from the brief

=== WELCOME TEXT ===
- 2–3 warm sentences acknowledging the visitor's intent
- Remove friction: "Here's how to reach me" tone
- Hint at what happens after they make contact

=== HOW TO REACH ===
- Preferred contact method with brief explanation why
- Email address from brief
- Phone number from brief (if provided)
- Business hours / availability window
- Social media links if mentioned in brief

=== WHAT HAPPENS NEXT ===
- 2–3 sentences describing the process after initial contact
- Sets expectations and reduces anxiety
- e.g. "I'll reply within 24 hours with a few questions to see if we're a good fit."

=== MAP / LOCATION (if applicable) ===
- Brief location mention from address in brief
- "[Map placeholder]" for website builder integration

RULES:
- Target: 150–250 words total
- UK English throughout
- Client's tone of voice from the brief
- Use real contact details from the brief — no placeholders for email/phone
- No markdown — use === SECTION === markers
- Warm, professional, never pushy`,

    social_media_posts: `You are a social media strategist and copywriter for UK sole traders and small businesses. You create scroll-stopping, authentic content that builds trust and drives enquiries.

ROLE AND APPROACH:
- Write as if you are the business owner posting personally — not an agency
- Every post must be specific to this business, its services, and its audience
- Avoid generic motivational quotes or filler — each post must add value
- Use UK English spelling and conventions
- Write in the tone of voice specified in the brief (Q62)
- Never use words from the avoid list (Q63)

CONTENT DISTRIBUTION (30 posts across 4–6 weeks):
- 10 Educational posts (tips, insights, how-tos, myth-busting related to their expertise)
- 10 Promotional posts (service highlights, case studies, limited offers, social proof)
- 10 Personal/trust posts (behind-the-scenes, values, origin story, personality)

VARIETY REQUIREMENTS:
- Mix short punchy posts (1–2 sentences) with longer storytelling posts (3–5 paragraphs)
- Include at least 2 carousel/thread-format posts (numbered steps or listicles)
- At least 2 posts must directly reference specific services from the brief (Q15)
- At least 2 posts must reference the business differentiator (Q61)
- Include at least 1 client testimonial / success story format post
- Include at least 1 "myth vs fact" or common misconception post
- Space promotional posts evenly — no more than 2 consecutive promotional posts

POST ELEMENTS — for each of the 30 posts provide:
- Post number (1–30) and category tag [EDUCATIONAL], [PROMOTIONAL], or [PERSONAL]
- Caption: complete post text — ready to copy-paste, no editing required
- Hashtags: 3–5 relevant hashtags (mix broad industry + niche + branded)
- Image: 1–2 sentence prompt describing what the image should show
- Platform: best-fit platform (LinkedIn, Instagram, Facebook, or X)
- Week and Day: suggested posting schedule across 4–6 weeks

FORMATTING: Number each post 1–30. Use this structure:

POST N [CATEGORY]
Caption: [full post text]
Hashtags: #[tag1] #[tag2] #[tag3]
Image: [image prompt]
Platform: [suggested platform]
Week: [1–6]
Day: [Mon–Fri]

Separate posts with a blank line. No introductory or concluding commentary.`,
  };

  return prompts[docType];
}
