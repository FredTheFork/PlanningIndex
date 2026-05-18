import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

// ── Document Type Configuration ──
// Each document type has its own Gemini API key (from a separate Google Cloud project)
// and its own system prompt placeholder.

interface DocumentConfig {
  apiKey: string;
  model: string;
  systemPrompt: string;
}

const DOCUMENT_CONFIGS: Record<string, DocumentConfig> = {
  terms_and_conditions: {
    apiKey: 'AIzaSyB1Q7FtBCOQjD5ZSH-4dAmHR74WJDIYsB0',
    model: 'gemini-2.5-flash',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PLACEHOLDER: Paste your Terms and Conditions prompt below.         │
    // │ The client brief will be automatically appended to this prompt.     │
    // └─────────────────────────────────────────────────────────────────────┘
    systemPrompt: `PLACEHOLDER: Insert your Terms and Conditions generation prompt here.

You are a legal document drafting assistant for Foundationary, a UK sole trader document service.
Using the client brief provided, generate a comprehensive Terms and Conditions document.

The document must:
- Be written in formal UK English
- Cover all services identified in the brief
- Include payment terms, refund policy, and liability limitations
- Reference the client's specific business details from the brief
- Be formatted as a professional legal document with numbered clauses
- Include a governing law clause (England and Wales)

Output the document as clean, well-structured text with clear section headings.`,
  },

  bespoke_client_contract: {
    apiKey: 'AIzaSyBt3APMr8-rRbexFnmgm-7nl7LkOQHquTY',
    model: 'gemini-2.5-flash',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PLACEHOLDER: Paste your Bespoke Client Contract prompt below.      │
    // │ The client brief will be automatically appended to this prompt.     │
    // └─────────────────────────────────────────────────────────────────────┘
    systemPrompt: `PLACEHOLDER: Insert your Bespoke Client Contract generation prompt here.

You are a legal document drafting assistant for Foundationary, a UK sole trader document service.
Using the client brief provided, generate a comprehensive Bespoke Client Contract template.

The document must:
- Be written in formal UK English
- Include scope of services, deliverables, and timelines from the brief
- Cover payment terms, deposit requirements, and late payment provisions
- Include termination clauses and dispute resolution
- Reference the client's specific business details
- Be formatted as a professional contract with numbered clauses
- Include a governing law clause (England and Wales)

Output the document as clean, well-structured text with clear section headings.`,
  },

  gdpr_privacy_policy: {
    apiKey: 'AIzaSyAIcCl8IzLaLIOXGZusfES_vU12EHg0qAo',
    model: 'gemini-2.5-flash',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PLACEHOLDER: Paste your GDPR Privacy Policy prompt below.          │
    // │ The client brief will be automatically appended to this prompt.     │
    // └─────────────────────────────────────────────────────────────────────┘
    systemPrompt: `PLACEHOLDER: Insert your GDPR Privacy Policy generation prompt here.

You are a legal document drafting assistant for Foundationary, a UK sole trader document service.
Using the client brief provided, generate a comprehensive GDPR-compliant Privacy Policy.

The document must:
- Be written in formal UK English
- Cover all data collection, storage, and processing identified in the brief
- Include data subject rights (access, rectification, erasure, portability)
- Reference the client's specific data handling practices from the brief
- Include cookie policy if applicable
- Cover third-party data sharing and marketing consents
- Be formatted as a professional legal document with numbered clauses
- Comply with UK GDPR and Data Protection Act 2018

Output the document as clean, well-structured text with clear section headings.`,
  },

  professional_bio: {
    apiKey: 'AIzaSyCiKbp7qJhnXaAxi3MFkdQhh4bK-opcwEQ',
    model: 'gemini-2.5-flash',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PLACEHOLDER: Paste your Professional Bio prompt below.             │
    // │ The client brief will be automatically appended to this prompt.     │
    // └─────────────────────────────────────────────────────────────────────┘
    systemPrompt: `PLACEHOLDER: Insert your Professional Bio generation prompt here.

You are a professional copywriter for Foundationary, a UK sole trader document service.
Using the client brief provided, generate a compelling Professional Bio.

The document must:
- Be written in the client's brand voice and tone as described in the brief
- Include their business story, experience, and achievements
- Highlight their differentiator and flagship service
- Be suitable for website "About" pages, proposals, and marketing materials
- Include a short version (50 words) and a long version (250 words)
- Use the client's specific business details from the brief

Output the document as clean, well-structured text with clear section headings.`,
  },

  linkedin_script: {
    apiKey: 'AIzaSyCh_PHT3_4GKJAaDbHt2XGZdVdxBB7Jgok',
    model: 'gemini-2.5-flash',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PLACEHOLDER: Paste your LinkedIn Script prompt below.              │
    // │ The client brief will be automatically appended to this prompt.     │
    // └─────────────────────────────────────────────────────────────────────┘
    systemPrompt: `PLACEHOLDER: Insert your LinkedIn Script generation prompt here.

You are a professional copywriter for Foundationary, a UK sole trader document service.
Using the client brief provided, generate a comprehensive LinkedIn profile script.

The document must:
- Be written in the client's brand voice and tone as described in the brief
- Include headline options, about/summary section, and experience descriptions
- Include keyword optimisation based on the client's target audience
- Cover all services and specialisms from the brief
- Be suitable for direct copy-paste into LinkedIn profile fields
- Include a banner text suggestion

Output the document as clean, well-structured text with clear section headings.`,
  },

  elevator_pitch: {
    apiKey: 'AIzaSyD7DTWfXH0p1Z3krq07XbrcWITv_9vHR6c',
    model: 'gemini-2.5-flash',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PLACEHOLDER: Paste your Elevator Pitch prompt below.               │
    // │ The client brief will be automatically appended to this prompt.     │
    // └─────────────────────────────────────────────────────────────────────┘
    systemPrompt: `PLACEHOLDER: Insert your Elevator Pitch generation prompt here.

You are a professional copywriter for Foundationary, a UK sole trader document service.
Using the client brief provided, generate 3 versions of an Elevator Pitch.

The document must:
- Be written in the client's brand voice and tone as described in the brief
- Version 1: 15-second pitch (approx 40 words)
- Version 2: 30-second pitch (approx 80 words)
- Version 3: 60-second pitch (approx 150 words)
- Each version must clearly communicate what they do, who they help, and what makes them different
- Use the client's specific business details from the brief
- Avoid words the client has asked to avoid

Output the document as clean, well-structured text with clear section headings.`,
  },

  professional_invoice_template: {
    apiKey: 'AIzaSyCmmp_14EZUTNYxAvUbdv3sJZVyc0z3tlw',
    model: 'gemini-2.5-flash',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PLACEHOLDER: Paste your Professional Invoice Template prompt below. │
    // │ The client brief will be automatically appended to this prompt.     │
    // └─────────────────────────────────────────────────────────────────────┘
    systemPrompt: `PLACEHOLDER: Insert your Professional Invoice Template generation prompt here.

You are a professional document drafting assistant for Foundationary, a UK sole trader document service.
Using the client brief provided, generate a Professional Invoice Template.

The document must:
- Be written in formal UK English
- Include the client's business details, bank details, and payment terms from the brief
- Include VAT number if applicable
- Include all invoice fields the client has specified
- Be formatted as a reusable template with placeholder fields
- Include payment instructions and due date terms
- Reference the client's specific pricing model and deposit requirements

Output the document as clean, well-structured text with clear section headings.`,
  },

  welcome_email: {
    apiKey: 'AIzaSyAV_L0-QKvaZ4y6z8-3ZFT5r5Wa1pExBXA',
    model: 'gemini-2.5-flash',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PLACEHOLDER: Paste your Welcome Email prompt below.                │
    // │ The client brief will be automatically appended to this prompt.     │
    // └─────────────────────────────────────────────────────────────────────┘
    systemPrompt: `PLACEHOLDER: Insert your New Client Welcome Email generation prompt here.

You are a professional copywriter for Foundationary, a UK sole trader document service.
Using the client brief provided, generate 3 versions of a New Client Welcome Email.

The document must:
- Be written in the client's brand voice and tone as described in the brief
- Version 1: Formal and professional
- Version 2: Warm and friendly
- Version 3: Brief and action-oriented
- Each version must welcome the client, set expectations, and outline next steps
- Include the client's specific services, payment terms, and contact details from the brief
- Be ready to send with minimal customisation

Output the document as clean, well-structured text with clear section headings.`,
  },

  late_payment_letters: {
    apiKey: 'AIzaSyC3QNfx7IW2uVE6Lwic0OEx9DuJFJsr8tc',
    model: 'gemini-2.5-flash',
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │ PLACEHOLDER: Paste your Late Payment Letters prompt below.          │
    // │ The client brief will be automatically appended to this prompt.     │
    // └─────────────────────────────────────────────────────────────────────┘
    systemPrompt: `PLACEHOLDER: Insert your Late Payment Letters generation prompt here.

You are a legal document drafting assistant for Foundationary, a UK sole trader document service.
Using the client brief provided, generate 3 versions of Late Payment Letters.

The document must:
- Be written in formal UK English
- Letter 1: Friendly reminder (first follow-up, 7 days overdue)
- Letter 2: Firm reminder (second follow-up, 14 days overdue)
- Letter 3: Final notice before legal action (30 days overdue)
- Include the client's specific payment terms, late payment interest, and bank details from the brief
- Reference the Late Payment of Commercial Debts Regulations where applicable
- Be formatted as professional business letters with placeholders for client/debtor details
- Include a governing law clause (England and Wales)

Output the document as clean, well-structured text with clear section headings.`,
  },
};

// ── HTML Conversion ──
// Converts the plain-text Gemini output into styled HTML for display and PDF generation

function textToHtml(text: string, documentLabel: string, businessName: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const formatted = escaped
    // Section headers with === delimiters
    .replace(/===\s*(.+?)\s*===/g, '<h2 style="font-size:18px;font-weight:700;margin:24px 0 12px;color:#1a1a2e;border-bottom:2px solid #1a1a2e;padding-bottom:6px;">$1</h2>')
    // Numbered clauses (e.g. "1." or "1.1" at start of line)
    .replace(/^(\d+(?:\.\d+)*)\.\s+(.+)$/gm, '<p style="margin:8px 0;padding-left:24px;text-indent:-24px;"><strong>$1.</strong> $2</p>')
    // Bullet points
    .replace(/^[-•]\s+(.+)$/gm, '<p style="margin:4px 0 4px 24px;">&bull; $1</p>')
    // Bold text **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Line breaks (double newline = paragraph)
    .replace(/\n\n/g, '</p><p style="margin:8px 0;">')
    // Single newlines
    .replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page { margin: 2.5cm; size: A4; }
  body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #1a1a2e; max-width: 700px; margin: 0 auto; padding: 40px 0; }
  h1 { font-size: 22pt; font-weight: 700; margin: 0 0 8px; color: #1a1a2e; }
  h2 { font-size: 14pt; font-weight: 700; margin: 24px 0 12px; color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 6px; }
  p { margin: 8px 0; }
  .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1a1a2e; padding-bottom: 20px; }
  .header h1 { margin-bottom: 4px; }
  .header .subtitle { font-size: 10pt; color: #555; }
  .footer { margin-top: 60px; padding-top: 16px; border-top: 1px solid #ccc; font-size: 9pt; color: #888; text-align: center; }
</style>
</head>
<body>
<div class="header">
  <h1>${documentLabel}</h1>
  <div class="subtitle">Prepared for ${businessName} | Foundationary</div>
</div>
<div style="margin-top:20px;">
${formatted}
</div>
<div class="footer">
  Generated by Foundationary | ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
  This document was AI-generated and should be reviewed by a qualified professional before use.
</div>
</body>
</html>`;
}

// ── Main Handler ──

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { user_id, document_type } = await req.json();

    if (!user_id || !document_type) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id or document_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = DOCUMENT_CONFIGS[document_type];
    if (!config) {
      return new Response(
        JSON.stringify({ error: `Unknown document type: ${document_type}. Valid types: ${Object.keys(DOCUMENT_CONFIGS).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── Step 1: Set status to 'generating' ──
    const { data: existingDoc } = await supabase
      .from('generated_documents')
      .select('id')
      .eq('client_id', user_id)
      .eq('document_type', document_type)
      .maybeSingle();

    if (existingDoc) {
      await supabase
        .from('generated_documents')
        .update({ status: 'generating', error_message: null, content_text: null, content_html: null })
        .eq('id', existingDoc.id);
    } else {
      await supabase
        .from('generated_documents')
        .insert({
          client_id: user_id,
          document_type,
          document_label: getDocumentLabel(document_type),
          status: 'generating',
        });
    }

    // ── Step 2: Fetch the client brief ──
    const { data: briefData, error: briefError } = await supabase
      .from('client_briefs')
      .select('brief_content')
      .eq('client_id', user_id)
      .maybeSingle();

    if (briefError || !briefData?.brief_content) {
      const errMsg = briefError?.message || 'No client brief found. Generate the Master Brief first before generating documents.';
      await supabase
        .from('generated_documents')
        .update({ status: 'failed', error_message: errMsg })
        .eq('client_id', user_id)
        .eq('document_type', document_type);
      return new Response(
        JSON.stringify({ error: errMsg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Step 3: Fetch business name for HTML header ──
    const { data: intakeData } = await supabase
      .from('intake_responses')
      .select('responses')
      .eq('user_id', user_id)
      .maybeSingle();

    const businessName = intakeData?.responses?.q2_business_name || 'Unknown Business';

    // ── Step 4: Call Gemini API with document-specific key and prompt ──
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

    const userMessage = `Here is the client's Master Brief:\n\n${briefData.brief_content}\n\nBased on this brief, please generate the document as instructed in your system prompt.`;

    let contentText: string;

    try {
      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: config.systemPrompt }],
          },
          contents: [{
            role: 'user',
            parts: [{ text: userMessage }],
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
          },
        }),
      });

      if (!geminiResponse.ok) {
        const errText = await geminiResponse.text();
        console.error(`Gemini API error (${document_type}):`, geminiResponse.status, errText);
        throw new Error(`Gemini API returned ${geminiResponse.status}: ${errText.substring(0, 300)}`);
      }

      const geminiData = await geminiResponse.json();

      if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
        contentText = geminiData.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected Gemini response structure:', JSON.stringify(geminiData).substring(0, 500));
        throw new Error('No text content in Gemini response');
      }
    } catch (apiErr: any) {
      console.error(`Document generation failed for ${document_type}:`, apiErr.message);
      await supabase
        .from('generated_documents')
        .update({ status: 'failed', error_message: apiErr.message })
        .eq('client_id', user_id)
        .eq('document_type', document_type);
      return new Response(
        JSON.stringify({ error: apiErr.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Step 5: Convert to HTML ──
    const contentHtml = textToHtml(contentText, getDocumentLabel(document_type), businessName);

    // ── Step 6: Save to database ──
    const { error: updateError } = await supabase
      .from('generated_documents')
      .update({
        status: 'completed',
        content_text: contentText,
        content_html: contentHtml,
        api_key_used: config.apiKey.substring(0, 10) + '...',
        model_used: config.model,
        generated_at: new Date().toISOString(),
      })
      .eq('client_id', user_id)
      .eq('document_type', document_type);

    if (updateError) {
      console.error('Failed to save document:', updateError);
      await supabase
        .from('generated_documents')
        .update({ status: 'failed', error_message: updateError.message })
        .eq('client_id', user_id)
        .eq('document_type', document_type);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, status: 'completed', document_type }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Generate document error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ── Helpers ──

function getDocumentLabel(type: string): string {
  const labels: Record<string, string> = {
    terms_and_conditions: 'Terms and Conditions',
    bespoke_client_contract: 'Bespoke Client Contract',
    gdpr_privacy_policy: 'GDPR Privacy Policy',
    professional_bio: 'Professional Bio',
    linkedin_script: 'LinkedIn Script',
    elevator_pitch: 'Elevator Pitch - 3 Versions',
    professional_invoice_template: 'Professional Invoice Template',
    welcome_email: 'New Client Welcome Email - 3 Versions',
    late_payment_letters: 'Late Payment Letters - 3 Versions',
  };
  return labels[type] || type;
}
