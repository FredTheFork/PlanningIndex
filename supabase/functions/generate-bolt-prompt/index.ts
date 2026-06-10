import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

// Admin query helper
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

// Admin upsert helper
async function adminUpsert(table: string, data: Record<string, unknown>, onConflict: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
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

// Track Gemini API usage
async function trackGeminiUsage(model: string) {
  const today = new Date().toISOString().split('T')[0];
  try {
    // Try to increment existing record
    const existing = await adminQuery("gemini_api_usage", "id,request_count", { request_date: today, model });
    if (existing && Array.isArray(existing) && existing.length > 0) {
      const id = existing[0].id;
      const count = (existing[0].request_count || 0) + 1;
      await fetch(`${SUPABASE_URL}/rest/v1/gemini_api_usage?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request_count: count, last_used_at: new Date().toISOString() }),
      });
    } else {
      await adminUpsert("gemini_api_usage", {
        model,
        request_date: today,
        request_count: 1,
        last_used_at: new Date().toISOString(),
      }, "model,request_date");
    }
  } catch (err) {
    console.error("Failed to track Gemini usage:", err);
  }
}

// Build the prompt for Gemini to generate a Bolt.new prompt
function buildGeminiPrompt(intakeData: Record<string, any>, briefContent: string | null, websitePages: string[]): string {
  const responses = intakeData.responses || {};
  const pages = websitePages.length > 0 ? websitePages : ['Homepage', 'About', 'Services', 'Contact'];

  return `You are an expert at creating comprehensive prompts for Bolt.new (an AI-powered full-stack website builder). Generate a complete, detailed prompt that will create a professional website for a UK small business.

## WEBSITE PAGES ORDERED AT CHECKOUT

The client has ordered the following pages: ${Array.isArray(pages) ? pages.join(', ') : pages}

## CLIENT INFORMATION

**Business Name:** ${responses.q2_business_name || 'Not provided'}
**Business Type:** ${responses.q3_business_registered || 'Sole trader'}
**Owner Name:** ${responses.q1_legal_name || responses.q55_first_name || 'Not provided'}

**What They Do:**
${responses.q13_what_you_do || 'Not provided'}

**Flagship Service:** ${responses.q14_flagship_service || 'Not provided'}

**Services They Offer:**
${Array.isArray(responses.q15_services)
  ? responses.q15_services.map((s: any, i: number) =>
      `${i + 1}. ${s.service_name || 'Service'}: ${s.service_includes || 'Details not provided'}`
    ).join('\n')
  : 'Not provided'}

**Ideal Client:** ${responses.q20_ideal_client || 'Not provided'}

**Differentiator:** ${responses.q61_differentiator || responses.wc_differentiator || 'Not provided'}

## WEBSITE REQUIREMENTS

**Pages to Build:** ${Array.isArray(pages) ? pages.join(', ') : pages}

**Navigation Structure:** ${responses.wc_nav_structure || 'Multi-page'}

**Service Pages Count:** ${responses.wc_service_page_count || '1'}

### Homepage Requirements
**Hero Message/Headline:** ${responses.wc_headline_idea || responses.wc_hero_message || 'Professional service provider'}
**Key Message:** ${responses.wc_hero_message || 'Not provided'}
**Problems Solved:** ${responses.wc_problems_solved || 'Not provided'}
**Desired Visitor Feeling:** ${Array.isArray(responses.wc_visitor_feeling) ? responses.wc_visitor_feeling.join(', ') : 'Confident, Informed'}
**Primary Call-to-Action:** ${responses.wc2_primary_action || 'Contact us'}

### Visual Design Preferences
**Color Scheme:** ${responses.wc_colour_preferences || responses.q67_brand_colours || 'Professional colors - suggest navy/blue tones'}
**Color Palette Style:** ${responses.wc_colour_palette_style || 'Clean and minimal'}
**Font Style:** ${responses.wc_font_style || 'Modern sans-serif'}
**Imagery Style:** ${responses.wc_imagery_style || 'Photography-led'}
**Logo Position:** ${responses.wc_logo_placement || 'Top left'}
**Tone of Voice:** ${Array.isArray(responses.q62_tone_of_voice) ? responses.q62_tone_of_voice.join(', ') : 'Professional and approachable'}
**Visual Style:** ${responses.q68_visual_style || 'Clean and modern / minimal'}

### Business Details to Display
**Email:** ${responses.wc_email_display || responses.q7_document_email || 'Not shown'}
**Display Phone:** ${responses.wc_phone_on_website || 'No'}
**Phone Number:** ${responses.q8_business_phone || 'Not provided'}
**Display Address:** ${responses.wc_address_on_website || 'No address shown'}
**Address:** ${responses.q6_business_address || 'Not provided'}
**Business Hours:** ${responses.wc_business_hours || 'Not shown'}

### Pricing Information
**Show Pricing:** ${responses.wc_show_pricing_on_website || 'Not sure yet'}
**Pricing Text:** ${responses.wc_pricing_text || 'Not provided'}
**Payment Methods:** ${Array.isArray(responses.wc_payment_methods_display) ? responses.wc_payment_methods_display.join(', ') : 'Not shown'}

### Features Needed
**Forms Needed:** ${Array.isArray(responses.wc_forms_needed) ? responses.wc_forms_needed.join(', ') : 'Contact form'}
**Legal Pages:** ${Array.isArray(responses.wc_legal_pages) ? responses.wc_legal_pages.join(', ') : 'Privacy Policy, Terms'}

### Social Media Links
**LinkedIn:** ${responses.wc_linkedin_url || responses.q73_linkedin_url || 'Not provided'}
**Instagram:** ${responses.wc_instagram_url || 'Not provided'}
**Facebook:** ${responses.wc_facebook_url || 'Not provided'}
**Show Social Links:** ${responses.wc_show_social_links || 'Footer only'}

### Testimonials & Credentials
**Testimonials:** ${responses.wc_testimonials || 'Not provided'}
**Credentials:** ${responses.wc_credentials_to_show || responses.q52_certifications || 'Not provided'}
**Awards/Press:** ${responses.wc_awards_or_press || 'Not provided'}

### Additional Features
**Booking Tool:** ${responses.wc_booking_tool || 'Not using one'}
**Booking URL:** ${responses.wc_booking_url || 'Not provided'}
**Newsletter Signup:** ${responses.wc_newsletter_signup || 'Not needed'}
**Newsletter Platform:** ${responses.wc_newsletter_platform || 'Not provided'}
**Analytics:** ${Array.isArray(responses.wc_analytics_tools) ? responses.wc_analytics_tools.join(', ') : 'None'}

### Data Collection & GDPR
**Collects Data:** ${responses.wc_website_collects_data || 'Yes - via contact forms'}
**Data Collected:** ${Array.isArray(responses.wc_data_collected_website) ? responses.wc_data_collected_website.join(', ') : 'Names, emails'}
**Cookie Consent:** ${responses.wc_needs_cookie_consent || 'Yes'}

### Inspiration & Competitors
**Websites They Like:** ${responses.wc3_inspiration_urls || 'Not provided'}
**Competitors:** ${responses.wc_competitor_urls || 'Not provided'}
**Websites Disliked:** ${responses.wc_disliked_urls || 'Not provided'}

${briefContent ? `## ADDITIONAL CONTEXT FROM CLIENT BRIEF

${briefContent.substring(0, 2000)}` : ''}

---

## YOUR TASK

Generate a COMPREHENSIVE Bolt.new prompt that will create a complete, professional website. The prompt MUST:

1. **Specify exact tech stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS, Supabase (for any backend needs), and appropriate component libraries.

2. **Define complete page structure** with all sections clearly specified for each page mentioned in requirements.

3. **Include exact content** from the client information above - do not use placeholder text.

4. **Specify design system** with exact colors (hex codes if provided or professional equivalents), fonts, spacing, and visual treatments.

5. **Include all business details** exactly as provided above - phone, email, address, hours, etc.

6. **Implement all features** specified: forms, booking integration, newsletter signup, cookie consent, analytics setup if requested.

7. **Add appropriate legal pages** as needed (Privacy Policy, Terms, Cookie Policy).

8. **Use testimonials and credentials** exactly as provided.

9. **Make it mobile-first responsive** with proper breakpoints.

10. **Include SEO best practices** - meta tags, Open Graph, structured data appropriate for a UK service business.

Write the prompt as if you are speaking directly to Bolt.new. Start with "Build a professional website for..." and be extremely specific about every detail. Use the actual business name, actual services, actual content - no placeholders. The website should be ready to deploy immediately after Bolt.new generates it.`;
}

// Call Gemini API
async function callGemini(prompt: string): Promise<{ text: string; model: string }> {
  const model = "gemini-2.0-flash";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini API error: ${response.status} ${errorText}`);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    throw new Error("No text generated from Gemini");
  }

  await trackGeminiUsage(model);

  return { text: generatedText, model };
}

// Update website_deliveries with generated prompt
async function updateWebsiteDelivery(userId: string, prompt: string, model: string) {
  const now = new Date().toISOString();

  await fetch(`${SUPABASE_URL}/rest/v1/website_deliveries?user_id=eq.${userId}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      bolt_prompt: prompt,
      updated_at: now,
    }),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing auth token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify admin status
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = await userRes.json();
    const adminEmail = user.email;

    // Check admin status
    const adminCheck = await adminQuery("admin_users", "id,role", { user_id: user.id });
    if (!adminCheck || !Array.isArray(adminCheck) || adminCheck.length === 0) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch client's intake responses
    const intakeData = await adminQuery("intake_responses", "responses,purchased_service_ids", { user_id });
    if (!intakeData || !Array.isArray(intakeData) || intakeData.length === 0) {
      return new Response(JSON.stringify({ error: "No intake data found for this client" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch client brief if available
    const briefData = await adminQuery("client_briefs", "brief_content", { client_id: user_id });
    const briefContent = briefData && Array.isArray(briefData) && briefData.length > 0
      ? briefData[0].brief_content
      : null;

    // Fetch any uploaded files info
    const uploadsData = await adminQuery("intake_uploads", "question_id,file_name,file_path", { user_id });

    // Fetch website pages selected at checkout
    const servicesData = await adminQuery("services_purchased", "website_pages_selected", { user_id, service_id: "website_copy_pack", status: "active" });
    const websitePages = servicesData && Array.isArray(servicesData) && servicesData.length > 0
      ? (servicesData[0].website_pages_selected || [])
      : [];

    // Build the Gemini prompt
    const geminiPrompt = buildGeminiPrompt(intakeData[0], briefContent, websitePages);

    // Call Gemini to generate the Bolt prompt
    const { text: boltPrompt, model: usedModel } = await callGemini(geminiPrompt);

    // Save to website_deliveries
    await updateWebsiteDelivery(user_id, boltPrompt, usedModel);

    return new Response(JSON.stringify({
      success: true,
      prompt: boltPrompt,
      model: usedModel,
      generated_at: new Date().toISOString(),
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("generate-bolt-prompt error:", err);
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: err instanceof Error ? err.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
