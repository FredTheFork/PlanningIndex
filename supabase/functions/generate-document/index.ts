import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { DOCUMENT_CONFIGS, DocumentConfig, getDocumentLabel } from './document-configs.ts';
import { generateDocx, generateDocxFromJson, ClientDesign } from './rendering.ts';
import { renderDocumentHtml } from './html-templates.ts';
import { generatePdf } from './pdf-renderer.ts';
import { validateDocumentModel, detectDocumentKind, AnyDocument } from './document-types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

async function fetchLogoAsBase64(supabase: any, fileUploads: Record<string, any[]>): Promise<string | null> {
  const logoFiles = fileUploads['q66_logo_upload'] || [];
  if (!logoFiles.length) { console.log('Logo: no file found'); return null; }
  const logoFile = logoFiles[0];
  const storagePath = logoFile?.path;
  if (!storagePath) { console.log('Logo: no storage path'); return null; }
  try {
    console.log(`Logo: fetching from ${storagePath}`);
    const { data, error } = await supabase.storage.from('user-uploads').download(storagePath);
    if (error || !data) { console.error('Logo: storage error:', error?.message); return null; }
    const bytes = new Uint8Array(await data.arrayBuffer());
    const chunkSize = 8192;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunkSize)
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    const mimeType = logoFile.type || 'image/png';
    console.log(`Logo: success — ${bytes.length} bytes, ${mimeType}`);
    return `data:${mimeType};base64,${btoa(binary)}`;
  } catch (err: unknown) {
    console.error('Logo: error:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

function parseJsonFromText(text: string): AnyDocument {
  let cleaned = text.trim();
  // Strip markdown fences
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  // Attempt 1: direct parse
  try { return JSON.parse(cleaned); }
  catch (e1) { console.warn('JSON parse attempt 1 failed:', String(e1).substring(0, 100)); }

  // Attempt 2: extract { ... } from surrounding text
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first !== -1 && last > first) {
    try { return JSON.parse(cleaned.substring(first, last + 1)); }
    catch (e2) { console.warn('JSON parse attempt 2 failed:', String(e2).substring(0, 100)); }
  }

  // Attempt 3: repair trailing commas and single quotes
  try {
    let r = cleaned.replace(/,(\s*[}\]])/g, '$1').replace(/'/g, '"');
    return JSON.parse(r);
  } catch (e3) {
    console.error('All JSON parse attempts failed. First 500 chars:', cleaned.substring(0, 500));
    throw new Error(`JSON parse failure: ${String(e3).substring(0, 200)}`);
  }
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
            generationConfig: { temperature: 0.2, maxOutputTokens: 16000, responseMimeType: 'application/json' },
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

        let jsonDoc: AnyDocument | null = null;
        let parseError: string | null = null;
        try {
          jsonDoc = parseJsonFromText(contentText);
          console.log('JSON parse: success, kind:', detectDocumentKind(jsonDoc));
        } catch (err: unknown) {
          parseError = err instanceof Error ? err.message : String(err);
          console.error('JSON parse: failure:', parseError);
        }

        if (jsonDoc) {
          const kind = detectDocumentKind(jsonDoc);
          if (kind === 'model') {
            const v = validateDocumentModel(jsonDoc);
            if (!v.valid) console.error('DocumentModel validation failed:', v.errors.join('; '));
            else if (v.errors.length) console.warn('DocumentModel minor issues:', v.errors.join('; '));
          }
        }

        let docxPath: string | null = null;
        let pdfPath: string | null = null;
        let contentHtml: string | null = null;

        // DOCX — JSON path first, legacy text fallback
        if (jsonDoc) {
          try {
            const docxBytes = await generateDocxFromJson(jsonDoc, design, docLabel);
            const up = `${user_id}/${document_type}.docx`;
            const { error: e } = await supabase.storage.from('generated-documents')
              .upload(up, docxBytes, { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', upsert: true });
            if (e) console.error('DOCX upload error:', e.message);
            else { docxPath = up; console.log('DOCX: uploaded'); }
          } catch (e: unknown) { console.error('DOCX render failure:', e instanceof Error ? e.message : String(e)); }
        } else {
          try {
            console.log('DOCX: using legacy text renderer');
            const docxBytes = await generateDocx(contentText, docLabel, design.businessName, design);
            const up = `${user_id}/${document_type}.docx`;
            const { error: e } = await supabase.storage.from('generated-documents')
              .upload(up, docxBytes, { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', upsert: true });
            if (!e) { docxPath = up; console.log('DOCX: legacy uploaded'); }
          } catch (e: unknown) { console.error('DOCX legacy failure:', e instanceof Error ? e.message : String(e)); }
        }

        // PDF
        if (jsonDoc) {
          try {
            const pdfBytes = generatePdf(jsonDoc, design, docLabel);
            const up = `${user_id}/${document_type}.pdf`;
            const { error: e } = await supabase.storage.from('generated-documents')
              .upload(up, pdfBytes, { contentType: 'application/pdf', upsert: true });
            if (e) console.error('PDF upload error:', e.message);
            else { pdfPath = up; console.log('PDF: uploaded'); }
          } catch (e: unknown) { console.error('PDF render failure:', e instanceof Error ? e.message : String(e)); }
        }

        // HTML
        if (jsonDoc) {
          try {
            contentHtml = renderDocumentHtml(jsonDoc, design, docLabel);
            console.log('HTML: generated, length:', contentHtml.length);
          } catch (e: unknown) { console.error('HTML render failure:', e instanceof Error ? e.message : String(e)); }
        }

        const hasOutput = docxPath !== null || pdfPath !== null;
        const status = hasOutput ? 'completed' : 'failed';
        const errorMessage = !hasOutput ? (parseError ?? 'All render attempts failed') : null;

        const updatePayload: Record<string, unknown> = {
          status, content_text: jsonDoc ? JSON.stringify(jsonDoc, null, 2) : contentText,
          content_html: contentHtml, api_key_used: config.apiKey.substring(0, 10) + '...',
          model_used: config.model, generated_at: new Date().toISOString(), error_message: errorMessage,
        };
        if (docxPath) { updatePayload.docx_path = docxPath; updatePayload.files_generated_at = new Date().toISOString(); }
        if (pdfPath) updatePayload.pdf_path = pdfPath;

        const { error: updateError } = await supabase.from('generated_documents')
          .update(updatePayload).eq('client_id', user_id).eq('document_type', document_type);
        if (updateError) {
          console.error('DB update error:', updateError.message);
          return new Response(JSON.stringify({ error: updateError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        return new Response(
          JSON.stringify({ success: true, status, document_type, docx_path: docxPath, pdf_path: pdfPath, parse_error: parseError }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (apiErr: any) {
        await supabase.from('generated_documents').update({ status: 'failed', error_message: apiErr.message }).eq('client_id', user_id).eq('document_type', document_type);
        return new Response(JSON.stringify({ error: apiErr.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // ── generate_files path: regenerate files from stored content ──
    const { data: docData, error: docError } = await supabase.from('generated_documents').select('id, content_text, docx_path, pdf_path, content_html, document_label').eq('client_id', user_id).eq('document_type', document_type).maybeSingle();
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
    try {
      jsonDoc = parseJsonFromText(docData.content_text);
    } catch { /* not JSON */ }

    // Generate DOCX
    let docxPath: string | null = docData.docx_path;
    if (!docxPath) {
      try {
        let docxBytes: Uint8Array;
        if (jsonDoc) {
          docxBytes = await generateDocxFromJson(jsonDoc, design, label);
        } else {
          console.log('DOCX: using legacy text renderer');
          docxBytes = await generateDocx(docData.content_text, label, design.businessName, design);
        }
        docxPath = `${user_id}/${document_type}.docx`;
        const { error: docxUploadError } = await supabase.storage.from('generated-documents').upload(docxPath, docxBytes, { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', upsert: true });
        if (docxUploadError) { docxPath = null; console.error('DOCX upload error:', docxUploadError.message); }
        else { console.log('DOCX: uploaded'); }
      } catch (docxErr: unknown) {
        console.error('DOCX generation error:', docxErr instanceof Error ? docxErr.message : String(docxErr));
      }
    }

    // Generate PDF
    let pdfPath: string | null = docData.pdf_path;
    if (!pdfPath && jsonDoc) {
      try {
        const pdfBytes = generatePdf(jsonDoc, design, label);
        pdfPath = `${user_id}/${document_type}.pdf`;
        const { error: pdfUploadError } = await supabase.storage.from('generated-documents').upload(pdfPath, pdfBytes, { contentType: 'application/pdf', upsert: true });
        if (pdfUploadError) { pdfPath = null; console.error('PDF upload error:', pdfUploadError.message); }
        else { console.log('PDF: uploaded'); }
      } catch (pdfErr: unknown) {
        console.error('PDF generation error:', pdfErr instanceof Error ? pdfErr.message : String(pdfErr));
      }
    }

    // Generate HTML if missing
    let contentHtml: string | null = docData.content_html;
    if (jsonDoc && !contentHtml) {
      try {
        contentHtml = renderDocumentHtml(jsonDoc, design, label);
        console.log('HTML: generated, length:', contentHtml.length);
      } catch (htmlErr: unknown) {
        console.error('HTML render error:', htmlErr instanceof Error ? htmlErr.message : String(htmlErr));
      }
    }

    const updatePayload: Record<string, unknown> = { files_generated_at: new Date().toISOString() };
    if (docxPath) updatePayload.docx_path = docxPath;
    if (pdfPath) updatePayload.pdf_path = pdfPath;
    if (contentHtml) updatePayload.content_html = contentHtml;

    await supabase.from('generated_documents').update(updatePayload).eq('id', docData.id);
    return new Response(JSON.stringify({ success: true, status: 'files_generated', document_type, docx_path: docxPath, pdf_path: pdfPath }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
