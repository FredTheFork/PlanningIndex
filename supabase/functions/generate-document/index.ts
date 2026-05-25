import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { DOCUMENT_CONFIGS, DocumentConfig, getDocumentLabel } from './document-configs.ts';
import { generateDocx, generateDocxFromJson, ClientDesign } from './rendering.ts';
import { renderDocumentHtml } from './html-templates.ts';
import { generatePdf } from './pdf-renderer.ts';
import { detectDocumentKind, AnyDocument } from './document-types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

async function fetchLogoAsBase64(supabase: any, fileUploads: any): Promise<string | null> {
  const logoFiles = fileUploads['q66_logo_upload'] || [];
  if (logoFiles.length === 0) return null;
  const logoFile = logoFiles[0];
  const storagePath = logoFile.path;
  if (!storagePath) return null;
  try {
    const { data, error } = await supabase.storage
      .from('user-uploads')
      .download(storagePath);
    if (error || !data) return null;
    const arrayBuffer = await data.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    const base64 = btoa(binary);
    const mimeType = logoFile.type || 'image/png';
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
}

function parseJsonFromText(text: string): any {
  let jsonText = text.trim();
  if (jsonText.startsWith('```json')) { jsonText = jsonText.slice(7); }
  else if (jsonText.startsWith('```')) { jsonText = jsonText.slice(3); }
  if (jsonText.endsWith('```')) { jsonText = jsonText.slice(0, -3); }
  jsonText = jsonText.trim();
  return JSON.parse(jsonText);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') { return new Response(null, { status: 200, headers: corsHeaders }); }

  try {
    const body = await req.json();
    const { user_id, document_type, generate_files } = body;

    if (!user_id || !document_type) {
      return new Response(JSON.stringify({ error: 'Missing user_id or document_type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const config: DocumentConfig | undefined = DOCUMENT_CONFIGS[document_type];
    if (!config) {
      return new Response(JSON.stringify({ error: `Unknown document type: ${document_type}. Valid types: ${Object.keys(DOCUMENT_CONFIGS).join(', ')}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { data: intakeData } = await supabase.from('intake_responses').select('responses, file_uploads').eq('user_id', user_id).maybeSingle();
    const r = intakeData?.responses || {};
    const fileUploads = intakeData?.file_uploads || {};

    let fileUploadInfo = '';
    const hasLogo = r.q65_has_logo === 'Yes';
    const logoFiles = fileUploads['q66_logo_upload'] || [];
    const existingDocs = fileUploads['q76_existing_docs_upload'] || [];
    const writingSamples = fileUploads['q77_writing_samples_upload'] || [];

    if (hasLogo && logoFiles.length > 0) {
      fileUploadInfo += '\n\n=== CLIENT LOGO ===\nThe client has uploaded their logo. File details:\n';
      logoFiles.forEach((f: any) => {
        fileUploadInfo += `- ${f.name} (${f.type}, ${Math.round(f.size / 1024)}KB)\n`;
        fileUploadInfo += `  Storage path: ${f.path}\n`;
      });
      fileUploadInfo += 'NOTE: The logo should be included on the invoice template, letterheads, and other branded documents.\n';
    }

    if (existingDocs.length > 0) {
      fileUploadInfo += '\n=== EXISTING DOCUMENTS PROVIDED ===\nThe client has uploaded existing documents for reference:\n';
      existingDocs.forEach((f: any) => {
        fileUploadInfo += `- ${f.name} (${f.type})\n`;
        fileUploadInfo += `  Storage path: ${f.path}\n`;
      });
      fileUploadInfo += 'Use these as reference for style, terminology, and existing terms where relevant.\n';
    }

    if (writingSamples.length > 0) {
      fileUploadInfo += '\n=== WRITING SAMPLES PROVIDED ===\nThe client has uploaded writing samples to match their voice:\n';
      writingSamples.forEach((f: any) => {
        fileUploadInfo += `- ${f.name} (${f.type})\n`;
        fileUploadInfo += `  Storage path: ${f.path}\n`;
      });
      fileUploadInfo += 'Use these to match the clients natural writing style and tone.\n';
    }

    const logoBase64 = await fetchLogoAsBase64(supabase, fileUploads);

    const design: ClientDesign = {
      businessName: r.q2_business_name || 'Unknown Business',
      legalName: r.q1_legal_name || '',
      firstName: r.q55_first_name || '',
      brandColours: r.q67_brand_colours || '',
      visualStyle: r.q68_visual_style || 'Simple — I just want it to work',
      toneOfVoice: r.q62_tone_of_voice || [],
      brandIdentity: r.q64_brand_identity || '',
      jurisdiction: r.q5_jurisdiction || 'England & Wales',
      documentEmail: r.q7_document_email || '',
      businessPhone: r.q8_business_phone || '',
      businessAddress: r.q6_business_address || '',
      websiteUrl: r.q10_website_url || '',
      logoBase64,
    };

    const docLabel = getDocumentLabel(document_type);

    // ── Generation path: AI generates content ──
    if (!generate_files) {
      const { data: existingDoc } = await supabase.from('generated_documents').select('id').eq('client_id', user_id).eq('document_type', document_type).maybeSingle();
      if (existingDoc) { await supabase.from('generated_documents').update({ status: 'generating', error_message: null, content_text: null, content_html: null }).eq('id', existingDoc.id); }
      else { await supabase.from('generated_documents').insert({ client_id: user_id, document_type, document_label: docLabel, status: 'generating' }); }

      const { data: briefData, error: briefError } = await supabase.from('client_briefs').select('brief_content').eq('client_id', user_id).maybeSingle();
      if (briefError || !briefData?.brief_content) {
        const errMsg = briefError?.message || 'No client brief found. Generate the Master Brief first before generating documents.';
        await supabase.from('generated_documents').update({ status: 'failed', error_message: errMsg }).eq('client_id', user_id).eq('document_type', document_type);
        return new Response(JSON.stringify({ error: errMsg }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;
      const userMessage = `Here is the client's Master Brief:\n\n${briefData.brief_content}\n\n${fileUploadInfo}\n\nBased on this brief, please generate the document as instructed in your system prompt. Populate every field with actual data from the brief. Do not leave placeholder text except in signature fields and editable client-facing fields. Apply the Consistency Contract rigorously — the business name, payment terms, and jurisdiction must match the brief exactly.`;

      try {
        const geminiResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: config.systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 16000 },
          }),
        });

        if (!geminiResponse.ok) {
          const errText = await geminiResponse.text();
          throw new Error(`Gemini API returned ${geminiResponse.status}: ${errText.substring(0, 300)}`);
        }

        const geminiData = await geminiResponse.json();
        if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error('No text content in Gemini response');
        }
        const contentText = geminiData.candidates[0].content.parts[0].text;

        // Try to parse as JSON (all document types now output JSON)
        let jsonDoc: AnyDocument | null = null;
        let isJson = false;
        try {
          jsonDoc = parseJsonFromText(contentText);
          isJson = true;
        } catch { /* not JSON — use legacy text rendering */ }

        let contentHtml: string | null = null;
        let docxPath: string | null = null;
        let pdfPath: string | null = null;
        let docxGeneratedAt: string | null = null;

        // Generate HTML preview from JSON or raw text
        if (isJson && jsonDoc) {
          try {
            contentHtml = renderDocumentHtml(jsonDoc, design, docLabel);
          } catch (htmlErr: any) {
            console.error('HTML rendering error:', htmlErr.message);
          }
        }

        // Generate DOCX from JSON or raw text
        try {
          let docxBytes: Uint8Array;
          if (isJson && jsonDoc) {
            docxBytes = await generateDocxFromJson(jsonDoc, design, docLabel);
          } else {
            docxBytes = await generateDocx(contentText, docLabel, design.businessName, design);
          }
          docxPath = `${user_id}/${document_type}.docx`;
          const { error: docxUploadError } = await supabase.storage.from('generated-documents').upload(docxPath, docxBytes, { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', upsert: true });
          if (docxUploadError) { docxPath = null; } else { docxGeneratedAt = new Date().toISOString(); }
        } catch (docxErr: any) { console.error('DOCX generation error:', docxErr.message); }

        // Generate PDF from JSON
        if (isJson && jsonDoc) {
          try {
            const pdfBytes = generatePdf(jsonDoc, design, docLabel);
            pdfPath = `${user_id}/${document_type}.pdf`;
            const { error: pdfUploadError } = await supabase.storage.from('generated-documents').upload(pdfPath, pdfBytes, { contentType: 'application/pdf', upsert: true });
            if (pdfUploadError) { pdfPath = null; }
          } catch (pdfErr: any) { console.error('PDF generation error:', pdfErr.message); }
        }

        const updatePayload: Record<string, any> = {
          status: 'completed',
          content_text: isJson ? JSON.stringify(jsonDoc, null, 2) : contentText,
          content_html: contentHtml,
          api_key_used: config.apiKey.substring(0, 10) + '...',
          model_used: config.model,
          generated_at: new Date().toISOString(),
        };
        if (docxPath) { updatePayload.docx_path = docxPath; updatePayload.files_generated_at = docxGeneratedAt; }
        if (pdfPath) { updatePayload.pdf_path = pdfPath; }

        const { error: updateError } = await supabase.from('generated_documents').update(updatePayload).eq('client_id', user_id).eq('document_type', document_type);
        if (updateError) {
          await supabase.from('generated_documents').update({ status: 'failed', error_message: updateError.message }).eq('client_id', user_id).eq('document_type', document_type);
          return new Response(JSON.stringify({ error: updateError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ success: true, status: 'completed', document_type, docx_path: docxPath, pdf_path: pdfPath }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (apiErr: any) {
        await supabase.from('generated_documents').update({ status: 'failed', error_message: apiErr.message }).eq('client_id', user_id).eq('document_type', document_type);
        return new Response(JSON.stringify({ error: apiErr.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ── generate_files path: regenerate files from stored content ──
    const { data: docData, error: docError } = await supabase.from('generated_documents').select('id, content_text, docx_path, pdf_path, document_label').eq('client_id', user_id).eq('document_type', document_type).maybeSingle();
    if (docError || !docData) {
      return new Response(JSON.stringify({ error: 'Document not found. Generate the document text first.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const label = docData.document_label || docLabel;
    if (docData.docx_path && docData.pdf_path) {
      return new Response(JSON.stringify({ success: true, status: 'already_generated', document_type, docx_path: docData.docx_path, pdf_path: docData.pdf_path }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!docData.content_text) {
      return new Response(JSON.stringify({ error: 'No text content found.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Parse stored content as JSON or raw text
    let jsonDoc: AnyDocument | null = null;
    let isJson = false;
    try {
      jsonDoc = parseJsonFromText(docData.content_text);
      isJson = true;
    } catch { /* not JSON */ }

    // Generate DOCX
    let docxPath: string | null = docData.docx_path;
    if (!docxPath) {
      try {
        let docxBytes: Uint8Array;
        if (isJson && jsonDoc) {
          docxBytes = await generateDocxFromJson(jsonDoc, design, label);
        } else {
          docxBytes = await generateDocx(docData.content_text, label, design.businessName, design);
        }
        docxPath = `${user_id}/${document_type}.docx`;
        const { error: docxUploadError } = await supabase.storage.from('generated-documents').upload(docxPath, docxBytes, { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', upsert: true });
        if (docxUploadError) { docxPath = null; }
      } catch (docxErr: any) {
        return new Response(JSON.stringify({ error: `DOCX generation failed: ${docxErr.message}` }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Generate PDF
    let pdfPath: string | null = docData.pdf_path;
    if (!pdfPath && isJson && jsonDoc) {
      try {
        const pdfBytes = generatePdf(jsonDoc, design, label);
        pdfPath = `${user_id}/${document_type}.pdf`;
        const { error: pdfUploadError } = await supabase.storage.from('generated-documents').upload(pdfPath, pdfBytes, { contentType: 'application/pdf', upsert: true });
        if (pdfUploadError) { pdfPath = null; }
      } catch (pdfErr: any) {
        console.error('PDF generation error:', pdfErr.message);
      }
    }

    // Generate HTML if missing
    let contentHtml: string | null = null;
    if (isJson && jsonDoc) {
      try {
        contentHtml = renderDocumentHtml(jsonDoc, design, label);
      } catch { /* skip */ }
    }

    const updatePayload: Record<string, any> = { files_generated_at: new Date().toISOString() };
    if (docxPath) updatePayload.docx_path = docxPath;
    if (pdfPath) updatePayload.pdf_path = pdfPath;
    if (contentHtml) updatePayload.content_html = contentHtml;

    await supabase.from('generated_documents').update(updatePayload).eq('id', docData.id);
    return new Response(JSON.stringify({ success: true, status: 'files_generated', document_type, docx_path: docxPath, pdf_path: pdfPath }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
