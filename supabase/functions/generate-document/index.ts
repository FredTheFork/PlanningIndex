import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'npm:pdf-lib@1.17.1';
import { Document as DocxDocument, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle, TabStopPosition, TabStopType, Header, Footer, PageNumber, NumberFormat } from 'npm:docx@9.1.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

// ── Document Type Configuration ──

interface DocumentConfig {
  apiKey: string;
  model: string;
  systemPrompt: string;
}

const DOCUMENT_CONFIGS: Record<string, DocumentConfig> = {
  terms_and_conditions: {
    apiKey: 'AIzaSyB1Q7FtBCOQjD5ZSH-4dAmHR74WJDIYsB0',
    model: 'gemini-2.5-flash',
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
- Use the CURRENT date and year (not a past date) for any version or date references
- Do NOT include any [REVIEW] markers or placeholder text — produce a final, complete document

Output the document as clean, well-structured text with clear section headings marked with === delimiters.`,
  },

  bespoke_client_contract: {
    apiKey: 'AIzaSyBt3APMr8-rRbexFnmgm-7nl7LkOQHquTY',
    model: 'gemini-2.5-flash',
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
- Use the CURRENT date and year for any date references
- Do NOT include any [REVIEW] markers or placeholder text — produce a final, complete document

Output the document as clean, well-structured text with clear section headings marked with === delimiters.`,
  },

  gdpr_privacy_policy: {
    apiKey: 'AIzaSyAIcCl8IzLaLIOXGZusfES_vU12EHg0qAo',
    model: 'gemini-2.5-flash',
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
- Use the CURRENT date and year for any date references
- Do NOT include any [REVIEW] markers or placeholder text — produce a final, complete document

Output the document as clean, well-structured text with clear section headings marked with === delimiters.`,
  },

  professional_bio: {
    apiKey: 'AIzaSyCiKbp7qJhnXaAxi3MFkdQhh4bK-opcwEQ',
    model: 'gemini-2.5-flash',
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
- Use the CURRENT date and year for any date references
- Do NOT include any [REVIEW] markers or placeholder text — produce a final, complete document

Output the document as clean, well-structured text with clear section headings marked with === delimiters.`,
  },

  linkedin_script: {
    apiKey: 'AIzaSyCh_PHT3_4GKJAaDbHt2XGZdVdxBB7Jgok',
    model: 'gemini-2.5-flash',
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
- Use the CURRENT date and year for any date references
- Do NOT include any [REVIEW] markers or placeholder text — produce a final, complete document

Output the document as clean, well-structured text with clear section headings marked with === delimiters.`,
  },

  elevator_pitch: {
    apiKey: 'AIzaSyD7DTWfXH0p1Z3krq07XbrcWITv_9vHR6c',
    model: 'gemini-2.5-flash',
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
- Use the CURRENT date and year for any date references
- Do NOT include any [REVIEW] markers or placeholder text — produce a final, complete document

Output the document as clean, well-structured text with clear section headings marked with === delimiters.`,
  },

  professional_invoice_template: {
    apiKey: 'AIzaSyCmmp_14EZUTNYxAvUbdv3sJZVyc0z3tlw',
    model: 'gemini-2.5-flash',
    systemPrompt: `PLACEHOLDER: Insert your Professional Invoice Template generation prompt here.

You are a professional document drafting assistant for Foundationary, a UK sole trader document service.
Using the client brief provided, generate a Professional Invoice Template.

The document must:
- Be written in formal UK English
- Include the client's business details, bank details, and payment terms from the brief
- Include VAT number if applicable
- Include all invoice fields the client has specified
- Be formatted as a reusable template with placeholder fields for client name, invoice number, date, line items
- Include payment instructions and due date terms
- Reference the client's specific pricing model and deposit requirements
- Use the CURRENT date and year for any date references
- Do NOT include any [REVIEW] markers or placeholder text — produce a final, complete document

Output the document as clean, well-structured text with clear section headings marked with === delimiters.`,
  },

  welcome_email: {
    apiKey: 'AIzaSyAV_L0-QKvaZ4y6z8-3ZFT5r5Wa1pExBXA',
    model: 'gemini-2.5-flash',
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
- Use the CURRENT date and year for any date references
- Do NOT include any [REVIEW] markers or placeholder text — produce a final, complete document

Output the document as clean, well-structured text with clear section headings marked with === delimiters.`,
  },

  late_payment_letters: {
    apiKey: 'AIzaSyC3QNfx7IW2uVE6Lwic0OEx9DuJFJsr8tc',
    model: 'gemini-2.5-flash',
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
- Use the CURRENT date and year for any date references
- Do NOT include any [REVIEW] markers or placeholder text — produce a final, complete document

Output the document as clean, well-structured text with clear section headings marked with === delimiters.`,
  },
};

// ── PDF Generation using pdf-lib ──

async function generatePdf(text: string, documentLabel: string, businessName: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pageWidth = PageSizes.A4[0];
  const pageHeight = PageSizes.A4[1];
  const margin = 72; // 1 inch
  const contentWidth = pageWidth - (margin * 2);
  const lineHeight = 14;
  const fontSize = 10;
  const smallFontSize = 8;

  // Colors
  const navy = rgb(0.1, 0.1, 0.18);
  const darkText = rgb(0.15, 0.15, 0.2);
  const secondaryText = rgb(0.45, 0.45, 0.5);
  const accentLine = rgb(0.1, 0.1, 0.18);

  // Parse text into structured blocks
  const blocks = parseTextToBlocks(text);

  // Build pages
  let page = pdfDoc.addPage(PageSizes.A4);
  let y = pageHeight - margin;

  // Draw header on first page
  y = pageHeight - margin - 10;

  // Title
  const titleWidth = boldFont.widthOfTextAtSize(documentLabel, 18);
  page.drawText(documentLabel, {
    x: (pageWidth - titleWidth) / 2,
    y: y,
    size: 18,
    font: boldFont,
    color: navy,
  });
  y -= 22;

  // Subtitle
  const subtitle = `Prepared for ${businessName}`;
  const subtitleWidth = font.widthOfTextAtSize(subtitle, 10);
  page.drawText(subtitle, {
    x: (pageWidth - subtitleWidth) / 2,
    y: y,
    size: 10,
    font: italicFont,
    color: secondaryText,
  });
  y -= 16;

  // Foundationary branding
  const branding = 'Foundationary';
  const brandingWidth = font.widthOfTextAtSize(branding, 9);
  page.drawText(branding, {
    x: (pageWidth - brandingWidth) / 2,
    y: y,
    size: 9,
    font: font,
    color: secondaryText,
  });
  y -= 12;

  // Header line
  page.drawLine({
    start: { x: margin, y: y },
    end: { x: pageWidth - margin, y: y },
    thickness: 2,
    color: accentLine,
  });
  y -= 24;

  // Render blocks
  for (const block of blocks) {
    if (block.type === 'heading') {
      // Check if we need a new page (need at least 60px for heading + some content)
      if (y < margin + 60) {
        page = pdfDoc.addPage(PageSizes.A4);
        y = pageHeight - margin;
      }

      // Draw heading underline
      const headingText = block.text;
      const headingWidth = boldFont.widthOfTextAtSize(headingText, 13);
      page.drawText(headingText, {
        x: margin,
        y: y,
        size: 13,
        font: boldFont,
        color: navy,
      });
      y -= 4;
      page.drawLine({
        start: { x: margin, y: y },
        end: { x: margin + Math.min(headingWidth, contentWidth), y: y },
        thickness: 1,
        color: accentLine,
      });
      y -= 16;
    } else if (block.type === 'clause') {
      // Numbered clause like "1.1. Something"
      const lines = wrapText(block.text, font, fontSize, contentWidth - 24);
      for (let i = 0; i < lines.length; i++) {
        if (y < margin + 20) {
          page = pdfDoc.addPage(PageSizes.A4);
          y = pageHeight - margin;
        }
        const x = i === 0 ? margin + 24 : margin + 24;
        page.drawText(lines[i], {
          x: x,
          y: y,
          size: fontSize,
          font: font,
          color: darkText,
        });
        y -= lineHeight;
      }
      y -= 4; // Extra space after clause
    } else if (block.type === 'bullet') {
      const lines = wrapText(block.text, font, fontSize, contentWidth - 36);
      for (let i = 0; i < lines.length; i++) {
        if (y < margin + 20) {
          page = pdfDoc.addPage(PageSizes.A4);
          y = pageHeight - margin;
        }
        if (i === 0) {
          page.drawText('\u2022', {
            x: margin + 12,
            y: y,
            size: fontSize,
            font: font,
            color: darkText,
          });
        }
        page.drawText(lines[i], {
          x: margin + 36,
          y: y,
          size: fontSize,
          font: font,
          color: darkText,
        });
        y -= lineHeight;
      }
      y -= 2;
    } else {
      // Regular paragraph
      const lines = wrapText(block.text, font, fontSize, contentWidth);
      for (const line of lines) {
        if (y < margin + 20) {
          page = pdfDoc.addPage(PageSizes.A4);
          y = pageHeight - margin;
        }
        page.drawText(line, {
          x: margin,
          y: y,
          size: fontSize,
          font: font,
          color: darkText,
        });
        y -= lineHeight;
      }
      y -= 6;
    }
  }

  // Footer on each page
  const pages = pdfDoc.getPages();
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const footerY = 40;

    p.drawLine({
      start: { x: margin, y: footerY + 12 },
      end: { x: pageWidth - margin, y: footerY + 12 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });

    p.drawText('Generated by Foundationary', {
      x: margin,
      y: footerY,
      size: smallFontSize,
      font: italicFont,
      color: secondaryText,
    });

    const pageStr = `Page ${i + 1} of ${pages.length}`;
    const pageStrWidth = font.widthOfTextAtSize(pageStr, smallFontSize);
    p.drawText(pageStr, {
      x: pageWidth - margin - pageStrWidth,
      y: footerY,
      size: smallFontSize,
      font: font,
      color: secondaryText,
    });

    const dateWidth = font.widthOfTextAtSize(dateStr, smallFontSize);
    p.drawText(dateStr, {
      x: (pageWidth - dateWidth) / 2,
      y: footerY,
      size: smallFontSize,
      font: font,
      color: secondaryText,
    });
  }

  return pdfDoc.save();
}

// ── DOCX Generation using docx package ──

async function generateDocx(text: string, documentLabel: string, businessName: string): Promise<Uint8Array> {
  const blocks = parseTextToBlocks(text);
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const children: Paragraph[] = [];

  // Title
  children.push(new Paragraph({
    children: [new TextRun({ text: documentLabel, bold: true, size: 36, font: 'Calibri', color: '1A1A2E' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }));

  // Subtitle
  children.push(new Paragraph({
    children: [new TextRun({ text: `Prepared for ${businessName}`, italics: true, size: 20, font: 'Calibri', color: '737373' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 50 },
  }));

  children.push(new Paragraph({
    children: [new TextRun({ text: 'Foundationary', size: 18, font: 'Calibri', color: '737373' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }));

  // Horizontal rule
  children.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1A1A2E' } },
    spacing: { after: 400 },
  }));

  // Content blocks
  for (const block of blocks) {
    if (block.type === 'heading') {
      children.push(new Paragraph({
        children: [new TextRun({ text: block.text, bold: true, size: 26, font: 'Calibri', color: '1A1A2E' })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 360, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1A1A2E' } },
      }));
    } else if (block.type === 'clause') {
      children.push(new Paragraph({
        children: [new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' })],
        spacing: { after: 80 },
        indent: { left: 480 },
      }));
    } else if (block.type === 'bullet') {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: '\u2022  ', size: 20, font: 'Calibri', color: '262626' }),
          new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' }),
        ],
        spacing: { after: 40 },
        indent: { left: 720 },
      }));
    } else {
      children.push(new Paragraph({
        children: [new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' })],
        spacing: { after: 120 },
      }));
    }
  }

  // Footer section
  children.push(new Paragraph({
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' } },
    spacing: { before: 600 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `Generated by Foundationary | ${dateStr}`, italics: true, size: 16, font: 'Calibri', color: '888888' })],
    alignment: AlignmentType.CENTER,
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: 'This document was AI-generated and should be reviewed by a qualified professional before use.', italics: true, size: 16, font: 'Calibri', color: '888888' })],
    alignment: AlignmentType.CENTER,
  }));

  const doc = new DocxDocument({
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}

// ── Text Parsing ──

interface TextBlock {
  type: 'heading' | 'paragraph' | 'clause' | 'bullet';
  text: string;
}

function parseTextToBlocks(text: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  const lines = text.split('\n');
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    const joined = currentParagraph.join(' ').trim();
    if (joined) {
      // Check if it's a numbered clause
      const clauseMatch = joined.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
      if (clauseMatch) {
        blocks.push({ type: 'clause', text: joined });
      } else {
        blocks.push({ type: 'paragraph', text: joined });
      }
    }
    currentParagraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // Section heading with === delimiters
    if (/^===\s*.+\s*===$/.test(trimmed)) {
      flushParagraph();
      const headingText = trimmed.replace(/^===\s*/, '').replace(/\s*===$/, '').trim();
      blocks.push({ type: 'heading', text: headingText });
      continue;
    }

    // Bullet point
    if (/^[-•]\s+/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'bullet', text: trimmed.replace(/^[-•]\s+/, '') });
      continue;
    }

    // Numbered clause at start of line
    if (/^\d+(?:\.\d+)*\.\s+/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'clause', text: trimmed });
      continue;
    }

    // Continuation of previous paragraph
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  return blocks;
}

// ── Text Wrapping ──

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

// ── Main Handler ──

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { user_id, document_type, generate_files } = body;

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

    // ── Mode 1: Generate text via Gemini (initial generation) ──
    if (!generate_files) {
      // Set status to 'generating'
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

      // Fetch the client brief
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

      // Fetch business name
      const { data: intakeData } = await supabase
        .from('intake_responses')
        .select('responses')
        .eq('user_id', user_id)
        .maybeSingle();

      const businessName = intakeData?.responses?.q2_business_name || 'Unknown Business';

      // Call Gemini API
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
              maxOutputTokens: 16000,
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

      // Convert to HTML
      const contentHtml = textToHtml(contentText, getDocumentLabel(document_type), businessName);

      // Save text and HTML to database
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
    }

    // ── Mode 2: Generate PDF and DOCX from existing text (after admin review) ──
    const { data: docData, error: docError } = await supabase
      .from('generated_documents')
      .select('id, content_text, document_label')
      .eq('client_id', user_id)
      .eq('document_type', document_type)
      .maybeSingle();

    if (docError || !docData?.content_text) {
      return new Response(
        JSON.stringify({ error: 'No text content found. Generate the document text first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: intakeData } = await supabase
      .from('intake_responses')
      .select('responses')
      .eq('user_id', user_id)
      .maybeSingle();

    const businessName = intakeData?.responses?.q2_business_name || 'Unknown Business';
    const label = docData.document_label || getDocumentLabel(document_type);

    // Generate PDF
    const pdfBytes = await generatePdf(docData.content_text, label, businessName);
    const pdfPath = `${user_id}/${document_type}.pdf`;
    const { error: pdfUploadError } = await supabase.storage
      .from('generated-documents')
      .upload(pdfPath, pdfBytes, { contentType: 'application/pdf', upsert: true });

    if (pdfUploadError) {
      console.error('PDF upload error:', pdfUploadError);
      return new Response(
        JSON.stringify({ error: `PDF upload failed: ${pdfUploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate DOCX
    const docxBytes = await generateDocx(docData.content_text, label, businessName);
    const docxPath = `${user_id}/${document_type}.docx`;
    const { error: docxUploadError } = await supabase.storage
      .from('generated-documents')
      .upload(docxPath, docxBytes, { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', upsert: true });

    if (docxUploadError) {
      console.error('DOCX upload error:', docxUploadError);
      return new Response(
        JSON.stringify({ error: `DOCX upload failed: ${docxUploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update database with file paths
    const { error: updateError } = await supabase
      .from('generated_documents')
      .update({
        pdf_path: pdfPath,
        docx_path: docxPath,
        files_generated_at: new Date().toISOString(),
      })
      .eq('id', docData.id);

    if (updateError) {
      console.error('Failed to update file paths:', updateError);
    }

    return new Response(
      JSON.stringify({ success: true, status: 'files_generated', document_type, pdf_path: pdfPath, docx_path: docxPath }),
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

function textToHtml(text: string, documentLabel: string, businessName: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const formatted = escaped
    .replace(/===\s*(.+?)\s*===/g, '<h2 style="font-size:18px;font-weight:700;margin:24px 0 12px;color:#1a1a2e;border-bottom:2px solid #1a1a2e;padding-bottom:6px;">$1</h2>')
    .replace(/^(\d+(?:\.\d+)*)\.\s+(.+)$/gm, '<p style="margin:8px 0;padding-left:24px;text-indent:-24px;"><strong>$1.</strong> $2</p>')
    .replace(/^[-•]\s+(.+)$/gm, '<p style="margin:4px 0 4px 24px;">&bull; $1</p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin:8px 0;">')
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
