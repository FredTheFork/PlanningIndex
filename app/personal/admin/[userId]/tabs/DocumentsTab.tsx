'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  FileText, Download, Eye, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronUp, Send, Copy, Check, Upload, X,
  FileUp, Clipboard, Info, RefreshCw, Package
} from 'lucide-react';
import {
  getAllDocumentTypesList, getSystemPrompt, getDocumentLabel
} from '@/lib/services/document-configs';
import { getDocumentTypesForService } from '@/lib/services/document-service-map';
import { getServiceById } from '@/lib/services/service-catalog';

interface DocumentsTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

// ─── FILE OUTPUT SPECIFICATION ────────────────────────────────────────────────
// This is appended to every prompt to instruct Claude on how to produce
// both a DOCX (via docx-js) and a PDF (via LibreOffice) in one pass.

const FILE_OUTPUT_SPEC = `
════════════════════════════════════════════════════════════════════════════════
FILE OUTPUT SPECIFICATION — READ THIS BEFORE GENERATING ANYTHING
════════════════════════════════════════════════════════════════════════════════

You must produce TWO files in a single response, no back-and-forth:
  1. A DOCX file built programmatically using the docx npm library (docx-js)
  2. A PDF file converted from the DOCX using: soffice --headless --convert-to pdf

The user will run your code in a Node.js environment (Claude.ai artifacts or local).
Both files must be downloadable at the end of your response.

════════════════════════════════════════════════════════════════════════════════
STEP 1 — DOCX GENERATION (docx-js)
════════════════════════════════════════════════════════════════════════════════

Use this exact Node.js script structure. Do NOT use markdown formatting in the document content — the docx library handles all formatting programmatically.

BRAND COLOURS (extract from the brief — if none stated use these defaults):
  - Primary / headings:    #1B3F7A  (dark navy)
  - Accent / rule lines:   #E8732A  (orange)
  - Body text:             #1A1A1A
  - Light background:      #F8F9FA

TYPOGRAPHY:
  - All headings:          Calibri, bold
  - Body text:             Calibri, 11pt, 1.15 line spacing
  - Footer:                Calibri, 9pt, grey (#888888)

DOCUMENT STRUCTURE RULES (apply to EVERY document type):
  - Page margins: top 2.5cm, bottom 2.5cm, left 3cm, right 2.5cm
  - Header: Business trading name (left) + document title (right), separated by a thin border-bottom
  - Footer: "© [Year] [Business Name] | [Document Title] | Page X of Y"
  - Section headings: ALL CAPS, Calibri Bold 13pt, colour #1B3F7A, followed by a 2pt rule line in accent colour
  - Clause numbers: bold, same font, hanging indent at 1cm
  - Sub-clauses: indented 1cm further
  - Tables (where applicable): header row background #1B3F7A, white text; alternating row shading #F0F4FA / white
  - Signature blocks: two-column table, 1pt border, label + underline field
  - Page breaks: before each major numbered section (1. 2. 3. etc.)
  - No watermarks, no draft stamps

EXACT SCRIPT TEMPLATE:

\`\`\`javascript
// install: npm install docx fs-extra
// run: node generate.js
// then: soffice --headless --convert-to pdf [filename].docx

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
        BorderStyle, ShadingType, TableRow, TableCell, Table, WidthType,
        PageNumber, Header, Footer, ImageRun, UnderlineType, PageBreak } = require('docx');
const fs = require('fs');

// ── Brand colours (update from brief) ─────────────────────────────────────
const BRAND = {
  primary:  '1B3F7A',  // headings
  accent:   'E8732A',  // rule lines, borders
  body:     '1A1A1A',  // body text
  light:    'F0F4FA',  // table alt rows
  grey:     '888888',  // footer text
  white:    'FFFFFF',
};

// ── Helper: section heading with accent rule ───────────────────────────────
function sectionHeading(text) {
  return [
    new Paragraph({
      pageBreakBefore: true,
      spacing: { before: 400, after: 120 },
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          size: 26,       // 13pt
          color: BRAND.primary,
          font: 'Calibri',
        }),
      ],
      border: {
        bottom: { color: BRAND.accent, size: 16, style: BorderStyle.SINGLE, space: 6 },
      },
    }),
  ];
}

// ── Helper: numbered clause ────────────────────────────────────────────────
function clause(number, text, bold = false) {
  return new Paragraph({
    spacing: { before: 120, after: 80 },
    indent: { left: 360, hanging: 360 },
    children: [
      new TextRun({ text: number + '  ', bold: true, size: 22, font: 'Calibri', color: BRAND.body }),
      new TextRun({ text, bold, size: 22, font: 'Calibri', color: BRAND.body }),
    ],
  });
}

// ── Helper: sub-clause ─────────────────────────────────────────────────────
function subClause(number, text) {
  return new Paragraph({
    spacing: { before: 80, after: 60 },
    indent: { left: 720, hanging: 360 },
    children: [
      new TextRun({ text: number + '  ', bold: true, size: 22, font: 'Calibri', color: BRAND.body }),
      new TextRun({ text, size: 22, font: 'Calibri', color: BRAND.body }),
    ],
  });
}

// ── Helper: body paragraph ─────────────────────────────────────────────────
function body(text, options = {}) {
  return new Paragraph({
    spacing: { before: 100, after: 100, line: 276 }, // 1.15
    children: [
      new TextRun({ text, size: 22, font: 'Calibri', color: BRAND.body, ...options }),
    ],
  });
}

// ── Helper: two-column signature block ────────────────────────────────────
function signatureBlock(leftLabel, rightLabel) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [body(leftLabel, { bold: true })],  borders: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND.body } } }),
        new TableCell({ children: [body(rightLabel, { bold: true })], borders: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND.body } } }),
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [body('Signature: _______________________')] }),
        new TableCell({ children: [body('Signature: _______________________')] }),
      ]}),
      new TableRow({ children: [
        new TableCell({ children: [body('Date: ____________________________')] }),
        new TableCell({ children: [body('Date: ____________________________')] }),
      ]}),
    ],
  });
}

// ── Document content — REPLACE THE ARRAY BELOW WITH ACTUAL DOCUMENT ────────
// Use sectionHeading(), clause(), subClause(), body(), signatureBlock()
// Map every === SECTION NAME === from the plain-text document to sectionHeading()
// Map every numbered clause to clause() / subClause()
// Map every body paragraph to body()

const documentContent = [
  // ← GENERATED CONTENT GOES HERE
  // Example:
  // ...sectionHeading('1. PARTIES AND DEFINITIONS'),
  // clause('1.1', 'Provider means [Business Name], a sole trader registered in England and Wales...'),
  // subClause('1.1.1', 'Trading as [Trading Name]...'),
];

// ── Build document ─────────────────────────────────────────────────────────
const doc = new Document({
  creator: '[Business Name]',
  title: '[Document Title]',
  description: 'Generated by Foundationary',
  sections: [{
    properties: {
      page: {
        margin: { top: 1418, bottom: 1418, left: 1701, right: 1418 }, // cm in twips
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { color: BRAND.accent, size: 8, style: BorderStyle.SINGLE } },
            children: [
              new TextRun({ text: '[Business Name]', bold: true, size: 18, color: BRAND.primary, font: 'Calibri' }),
              new TextRun({ text: '    |    ', size: 18, color: BRAND.grey, font: 'Calibri' }),
              new TextRun({ text: '[Document Title]', size: 18, color: BRAND.grey, font: 'Calibri' }),
            ],
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: '© [Year] [Business Name]  |  [Document Title]  |  Page ', size: 18, color: BRAND.grey, font: 'Calibri' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: BRAND.grey, font: 'Calibri' }),
              new TextRun({ text: ' of ', size: 18, color: BRAND.grey, font: 'Calibri' }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: BRAND.grey, font: 'Calibri' }),
            ],
          }),
        ],
      }),
    },
    children: documentContent,
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('[filename].docx', buffer);
  console.log('[filename].docx written successfully');
});
\`\`\`

IMPORTANT — CONTENT GENERATION RULE:
Do NOT generate the plain text document first and then separately code the DOCX.
Generate the DOCX code directly — the documentContent array IS the document.
Every section, clause, sub-clause, and paragraph from the document specification above must appear as a docx-js node in the documentContent array. Use the actual populated content from the client brief — no placeholders except signature fields and [FIELD TO COMPLETE] invoice fields.

════════════════════════════════════════════════════════════════════════════════
STEP 2 — PDF CONVERSION
════════════════════════════════════════════════════════════════════════════════

After writing the DOCX, convert it to PDF using LibreOffice headless mode:

\`\`\`bash
soffice --headless --convert-to pdf [filename].docx
\`\`\`

This produces [filename].pdf in the same directory. No further configuration needed.
Do NOT use html-pdf, puppeteer, or wkhtmltopdf — LibreOffice conversion preserves all docx formatting faithfully.

If LibreOffice is not available in the environment, output the following alternative:

\`\`\`bash
# Alternative: Gotenberg (Docker)
curl -X POST http://localhost:3000/forms/libreoffice/convert \
  -F 'files=@[filename].docx' \
  -o [filename].pdf

# Alternative: Local install check
which libreoffice || which soffice || brew install --cask libreoffice
\`\`\`

════════════════════════════════════════════════════════════════════════════════
STEP 3 — RESPONSE FORMAT
════════════════════════════════════════════════════════════════════════════════

Your response must follow this exact structure:

1. Brief paragraph (3–5 sentences) flagging any notable decisions made while generating the document — contradictions in the brief resolved, ambiguous fields interpreted, any compliance points the client should verify. This is the quality commentary the client expects from a professional service.

2. The complete Node.js script (generate.js) with ALL document content populated in documentContent[]. This must be a single, runnable file. No TODOs, no placeholder comments inside the content array.

3. The bash conversion command.

4. The two resulting files presented for download (DOCX and PDF).

The client's name for the files should be: [BusinessTradingName]-[DocumentType] (kebab-case, no spaces).

DO NOT:
- Output the document as plain text before the code
- Ask clarifying questions
- Produce a partial script and say "continue below"
- Use any other file generation library
- Add any back-and-forth — the entire deliverable is one response

════════════════════════════════════════════════════════════════════════════════
END OF FILE OUTPUT SPECIFICATION
════════════════════════════════════════════════════════════════════════════════
`;

// ─── Build the full clipboard prompt ─────────────────────────────────────────

function buildFullPrompt(docTypeId: string, docLabel: string, brief: string): string {
  const generationPrompt = getSystemPrompt(docTypeId);
  if (!generationPrompt || !brief) return '';

  return `════════════════════════════════════════════════════════════════════════════════
FOUNDATIONARY — DOCUMENT GENERATION REQUEST
════════════════════════════════════════════════════════════════════════════════
Document:  ${docLabel}
════════════════════════════════════════════════════════════════════════════════

${FILE_OUTPUT_SPEC}

════════════════════════════════════════════════════════════════════════════════
DOCUMENT CONTENT SPECIFICATION
════════════════════════════════════════════════════════════════════════════════

${generationPrompt}

════════════════════════════════════════════════════════════════════════════════
CLIENT BRIEF — USE THIS DATA TO POPULATE THE ENTIRE DOCUMENT
════════════════════════════════════════════════════════════════════════════════

${brief}

════════════════════════════════════════════════════════════════════════════════
END OF BRIEF
════════════════════════════════════════════════════════════════════════════════

Now generate the complete "${docLabel}" as described above.
Produce the full Node.js script (every clause populated from the brief), the PDF conversion command, and both downloadable files. Start with your quality commentary paragraph.`;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DocumentsTab({ userId, data, refreshData }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [brief, setBrief] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  // Build document types list based on purchased services
  const purchasedServiceIds: string[] = data.purchasedServices?.map((ps: any) => ps.service_id) || [];
  const allDocTypes = purchasedServiceIds.length > 0
    ? purchasedServiceIds.flatMap((sid: string) => getDocumentTypesForService(sid))
        .filter((v, i, a) => a.indexOf(v) === i)
        .map(docTypeId => {
          const config = getAllDocumentTypesList().find(c => c.id === docTypeId);
          return config || { id: docTypeId, label: getDocumentLabel(docTypeId) ?? docTypeId, description: '', service_id: '' };
        })
    : getAllDocumentTypesList();

  useEffect(() => {
    fetchDocuments();
    fetchBrief();
  }, [userId]);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data: docs } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('client_id', userId);

    const docsMap: Record<string, any> = {};
    docs?.forEach(doc => {
      docsMap[doc.document_type] = doc;
    });
    setDocuments(docsMap);
    setLoading(false);
  };

  const fetchBrief = async () => {
    const { data: briefData } = await supabase
      .from('client_briefs')
      .select('brief_content')
      .eq('client_id', userId)
      .maybeSingle();
    if (briefData?.brief_content) {
      setBrief(briefData.brief_content);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleCopyPrompt = async (docTypeId: string) => {
    if (!brief) {
      showMessage('No client brief found. Generate the Master Brief first.', 'error');
      return;
    }

    const docLabel = allDocTypes.find(d => d.id === docTypeId)?.label || getDocumentLabel(docTypeId) || docTypeId;
    const fullPrompt = buildFullPrompt(docTypeId, docLabel, brief);

    if (!fullPrompt) {
      showMessage('No prompt found for this document type.', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(fullPrompt);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = fullPrompt;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopiedDocId(docTypeId);
    showMessage(
      `Full prompt for "${docLabel}" copied — paste directly into Claude.ai to generate both DOCX and PDF files.`,
      'success'
    );

    // Create a pending record if one doesn't exist yet
    const existing = documents[docTypeId];
    if (!existing) {
      await supabase.from('generated_documents').insert({
        client_id: userId,
        document_type: docTypeId,
        document_label: docLabel,
        status: 'pending',
      });
      await fetchDocuments();
    }

    setTimeout(() => setCopiedDocId(null), 3000);
  };

  const handleFileUpload = async (
    docTypeId: string,
    file: File,
    fileKind: 'pdf' | 'docx'
  ) => {
    const docLabel = allDocTypes.find(d => d.id === docTypeId)?.label || getDocumentLabel(docTypeId) || docTypeId;
    setUploadingDoc(`${docTypeId}-${fileKind}`);

    try {
      const ext = fileKind === 'pdf' ? 'pdf' : 'docx';
      const storagePath = `${userId}/${docTypeId}.${ext}`;
      const mimeType = fileKind === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      const { error: uploadError } = await supabase.storage
        .from('generated-documents')
        .upload(storagePath, file, { contentType: mimeType, upsert: true });

      if (uploadError) {
        showMessage(`Upload failed: ${uploadError.message}`, 'error');
        return;
      }

      const existing = documents[docTypeId];
      const updatePayload: Record<string, any> = {
        client_id: userId,
        document_type: docTypeId,
        document_label: docLabel,
        status: 'completed',
        generated_at: new Date().toISOString(),
        files_generated_at: new Date().toISOString(),
        error_message: null,
      };

      if (fileKind === 'pdf') updatePayload.pdf_path = storagePath;
      if (fileKind === 'docx') updatePayload.docx_path = storagePath;

      if (existing?.id) {
        await supabase
          .from('generated_documents')
          .update(updatePayload)
          .eq('id', existing.id);
      } else {
        await supabase.from('generated_documents').insert(updatePayload);
      }

      showMessage(`${fileKind.toUpperCase()} uploaded for "${docLabel}"`, 'success');
      await fetchDocuments();
      refreshData();
    } catch (err: any) {
      showMessage(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('generated-documents')
      .createSignedUrl(filePath, 3600);

    if (error || !data) {
      showMessage('Could not generate download link', 'error');
      return;
    }

    const a = document.createElement('a');
    a.href = data.signedUrl;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleMarkDelivered = async (docId: string) => {
    const now = new Date();
    const autoDeleteAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    await supabase
      .from('generated_documents')
      .update({
        delivered_to_client: true,
        delivered_at: now.toISOString(),
        auto_delete_at: autoDeleteAt.toISOString()
      })
      .eq('id', docId);

    showMessage('Document marked as delivered', 'success');
    await fetchDocuments();
  };

  const handleRemoveFile = async (docTypeId: string, fileKind: 'pdf' | 'docx') => {
    const existing = documents[docTypeId];
    if (!existing?.id) return;

    const fieldKey = fileKind === 'pdf' ? 'pdf_path' : 'docx_path';
    const storagePath = existing[fieldKey];

    if (storagePath) {
      await supabase.storage.from('generated-documents').remove([storagePath]);
    }

    const updatePayload: Record<string, any> = { [fieldKey]: null };
    const otherKey = fileKind === 'pdf' ? 'docx_path' : 'pdf_path';
    if (!existing[otherKey]) {
      updatePayload.status = 'pending';
    }

    await supabase.from('generated_documents').update(updatePayload).eq('id', existing.id);
    showMessage(`${fileKind.toUpperCase()} removed`, 'info');
    await fetchDocuments();
    refreshData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  const completedCount = Object.values(documents).filter((d: any) => d.status === 'completed').length;
  const deliveredCount = Object.values(documents).filter((d: any) => d.delivered_to_client).length;
  const briefAvailable = !!brief;

  return (
    <div className="space-y-6">
      {/* Message Banner */}
      {message && (
        <div className={`rounded-lg p-4 border flex items-start gap-3 ${
          messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800'
          : messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {messageType === 'success' && <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-600" />}
          {messageType === 'error' && <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />}
          {messageType === 'info' && <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />}
          <p className="font-inter text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-1">
              Document Generation Centre
            </h3>
            <p className="font-inter text-gray-500 text-sm">
              Copy the full prompt for each document and paste it into Claude.ai — you'll get back a DOCX and PDF in one pass.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm shrink-0">
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-[#1B3F7A]">{completedCount}</div>
              <div className="font-inter text-gray-500 text-xs">Complete</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-green-600">{deliveredCount}</div>
              <div className="font-inter text-gray-500 text-xs">Delivered</div>
            </div>
          </div>
        </div>

        {/* Brief availability notice */}
        {!briefAvailable && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="font-inter text-amber-800 text-sm">
              No client brief found. Generate the Master Brief first — prompts won't include client data without it.
            </p>
          </div>
        )}

        {/* Workflow instructions */}
        <div className="mt-4 bg-[#FAFBFC] rounded-lg border border-gray-200 p-4">
          <div className="flex items-start gap-2 mb-3">
            <Info size={15} className="text-[#1B3F7A] shrink-0 mt-0.5" />
            <p className="font-inter font-semibold text-[#1B3F7A] text-sm">One copy. One paste. Two files.</p>
          </div>
          <ol className="space-y-2 ml-5">
            {[
              { step: 'Click "Copy Prompt" on any document below', note: 'Copies the full generation prompt + client brief + file output specification' },
              { step: 'Paste everything into Claude.ai (claude.ai/new)', note: 'The prompt includes precise instructions for building the DOCX with docx-js and converting to PDF' },
              { step: 'Claude produces both files in one response', note: 'A DOCX built programmatically (correct heading hierarchy, numbered clauses, brand colours) and a PDF via LibreOffice conversion' },
              { step: 'Download both files from Claude\'s response', note: 'Then upload them back here using the Upload buttons below' },
              { step: 'Mark as delivered when sent to the client', note: 'Tracks delivery date for your records' },
            ].map(({ step, note }, i) => (
              <li key={i} className="font-inter text-gray-600 text-xs flex gap-2">
                <span className="font-bold text-[#1B3F7A] shrink-0 w-4">{i + 1}.</span>
                <span>
                  <span className="font-medium text-gray-800">{step}</span>
                  <span className="text-gray-400"> — {note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* What's in the prompt callout */}
        <div className="mt-3 bg-[#1B3F7A] bg-opacity-5 border border-[#1B3F7A] border-opacity-20 rounded-lg p-3 flex items-start gap-2">
          <Clipboard size={14} className="text-[#1B3F7A] shrink-0 mt-0.5" />
          <p className="font-inter text-[#1B3F7A] text-xs">
            <span className="font-semibold">Each copied prompt contains three sections:</span>{' '}
            (1) File output specification — tells Claude to produce DOCX + PDF with brand colours, correct structure, and running footer;{' '}
            (2) Document content specification — the legal/copy instructions for this document type;{' '}
            (3) Client brief — every answer from the intake form, populated into the document automatically.
          </p>
        </div>
      </div>

      {/* Document cards */}
      <div className="space-y-3">
        {allDocTypes.map(docType => {
          const doc = documents[docType.id];
          const isCopied = copiedDocId === docType.id;
          const isExpanded = expandedDoc === docType.id;
          const isUploadingPdf = uploadingDoc === `${docType.id}-pdf`;
          const isUploadingDocx = uploadingDoc === `${docType.id}-docx`;

          return (
            <DocumentCard
              key={docType.id}
              docType={docType}
              doc={doc}
              isCopied={isCopied}
              isExpanded={isExpanded}
              isUploadingPdf={isUploadingPdf}
              isUploadingDocx={isUploadingDocx}
              briefAvailable={briefAvailable}
              onCopyPrompt={() => handleCopyPrompt(docType.id)}
              onToggleExpand={() => setExpandedDoc(isExpanded ? null : docType.id)}
              onUploadFile={(file, kind) => handleFileUpload(docType.id, file, kind)}
              onDownload={handleDownloadFile}
              onMarkDelivered={() => handleMarkDelivered(doc?.id)}
              onRemoveFile={(kind) => handleRemoveFile(docType.id, kind)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocumentCard({
  docType,
  doc,
  isCopied,
  isExpanded,
  isUploadingPdf,
  isUploadingDocx,
  briefAvailable,
  onCopyPrompt,
  onToggleExpand,
  onUploadFile,
  onDownload,
  onMarkDelivered,
  onRemoveFile,
}: {
  docType: { id: string; label: string; description: string };
  doc: any;
  isCopied: boolean;
  isExpanded: boolean;
  isUploadingPdf: boolean;
  isUploadingDocx: boolean;
  briefAvailable: boolean;
  onCopyPrompt: () => void;
  onToggleExpand: () => void;
  onUploadFile: (file: File, kind: 'pdf' | 'docx') => void;
  onDownload: (path: string, name: string) => void;
  onMarkDelivered: () => void;
  onRemoveFile: (kind: 'pdf' | 'docx') => void;
}) {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  const status = doc?.status || 'pending';
  const hasPdf = !!doc?.pdf_path;
  const hasDocx = !!doc?.docx_path;
  const isCompleted = status === 'completed';

  const statusConfig: Record<string, { colour: string; bg: string; label: string; icon: React.ReactNode }> = {
    pending:    { colour: 'text-gray-500',  bg: 'bg-gray-100',  label: 'Pending',     icon: <Clock size={11} /> },
    generating: { colour: 'text-blue-600',  bg: 'bg-blue-50',   label: 'In Progress', icon: <RefreshCw size={11} className="animate-spin" /> },
    completed:  { colour: 'text-green-600', bg: 'bg-green-50',  label: 'Complete',    icon: <CheckCircle2 size={11} /> },
    failed:     { colour: 'text-red-600',   bg: 'bg-red-50',    label: 'Failed',      icon: <AlertCircle size={11} /> },
  };

  const s = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`bg-white rounded-lg border overflow-hidden transition-shadow ${isExpanded ? 'border-[#1B3F7A] border-opacity-40 shadow-sm' : 'border-gray-200'}`}>
      {/* Card header row */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="bg-[#FAFBFC] rounded-lg p-2.5 shrink-0 mt-0.5">
              <FileText size={18} className="text-[#1B3F7A]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                <h4 className="font-inter font-semibold text-gray-900 text-sm">{docType.label}</h4>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.colour}`}>
                  {s.icon}
                  {s.label}
                </span>
                {doc?.delivered_to_client && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                    <Send size={10} /> Delivered
                  </span>
                )}
                {hasPdf && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">
                    PDF ✓
                  </span>
                )}
                {hasDocx && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-600">
                    DOCX ✓
                  </span>
                )}
              </div>
              <p className="font-inter text-gray-500 text-xs">{docType.description}</p>
              {doc?.generated_at && (
                <p className="font-inter text-gray-400 text-xs mt-0.5">
                  Updated: {new Date(doc.generated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Copy Prompt */}
            <button
              onClick={onCopyPrompt}
              disabled={!briefAvailable}
              title={briefAvailable
                ? 'Copy full prompt (document spec + client brief + file output instructions) to clipboard'
                : 'Generate Master Brief first to include client data'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-inter font-medium transition-all
                ${isCopied
                  ? 'bg-green-600 text-white scale-95'
                  : briefAvailable
                    ? 'bg-[#1B3F7A] hover:bg-[#2C68C4] text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isCopied ? <Check size={13} /> : <Clipboard size={13} />}
              {isCopied ? 'Copied!' : 'Copy Prompt'}
            </button>

            {/* Expand/collapse if doc exists */}
            {doc && (
              <button
                onClick={onToggleExpand}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
              >
                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {isExpanded ? 'Close' : 'Manage'}
              </button>
            )}

            {/* Quick upload trigger if doc exists but no files yet */}
            {!doc && briefAvailable && (
              <span className="text-xs text-gray-400 font-inter italic hidden sm:block">
                Copy prompt → paste into Claude.ai → upload files
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-[#FAFBFC] space-y-4">

          {/* Upload section */}
          <div>
            <p className="font-inter font-semibold text-gray-700 text-xs mb-2 uppercase tracking-wide">
              Upload Generated Files
            </p>
            <p className="font-inter text-gray-500 text-xs mb-3">
              After running the prompt in Claude.ai, download both files and upload them here.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FileUploadZone
                label="PDF"
                existingPath={doc?.pdf_path}
                existingName={`${docType.label}.pdf`}
                isUploading={isUploadingPdf}
                accept=".pdf,application/pdf"
                inputRef={pdfInputRef}
                onFileSelect={(file) => onUploadFile(file, 'pdf')}
                onDownload={doc?.pdf_path ? () => onDownload(doc.pdf_path, `${docType.label}.pdf`) : undefined}
                onRemove={doc?.pdf_path ? () => onRemoveFile('pdf') : undefined}
              />
              <FileUploadZone
                label="Word (DOCX)"
                existingPath={doc?.docx_path}
                existingName={`${docType.label}.docx`}
                isUploading={isUploadingDocx}
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                inputRef={docxInputRef}
                onFileSelect={(file) => onUploadFile(file, 'docx')}
                onDownload={doc?.docx_path ? () => onDownload(doc.docx_path, `${docType.label}.docx`) : undefined}
                onRemove={doc?.docx_path ? () => onRemoveFile('docx') : undefined}
              />
            </div>
          </div>

          {/* Delivery section */}
          {isCompleted && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
              {!doc.delivered_to_client ? (
                <button
                  onClick={onMarkDelivered}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-inter font-medium transition-colors"
                >
                  <Send size={13} />
                  Mark as Delivered to Client
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-green-600 font-inter font-medium">
                  <CheckCircle2 size={13} />
                  Delivered to client
                  {doc.delivered_at && ` on ${new Date(doc.delivered_at).toLocaleDateString('en-GB')}`}
                </div>
              )}
            </div>
          )}

          {/* Meta info */}
          {doc && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-200">
              <MetaItem label="Status" value={s.label} />
              <MetaItem label="Updated" value={doc.generated_at ? new Date(doc.generated_at).toLocaleDateString('en-GB') : '—'} />
              <MetaItem label="Files" value={hasPdf && hasDocx ? 'PDF & DOCX' : hasPdf ? 'PDF only' : hasDocx ? 'DOCX only' : 'No files yet'} />
              <MetaItem label="Delivered" value={doc.delivered_to_client ? 'Yes' : 'No'} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── File Upload Zone ─────────────────────────────────────────────────────────

function FileUploadZone({
  label,
  existingPath,
  existingName,
  isUploading,
  accept,
  inputRef,
  onFileSelect,
  onDownload,
  onRemove,
}: {
  label: string;
  existingPath: string | null;
  existingName: string;
  isUploading: boolean;
  accept: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (file: File) => void;
  onDownload?: () => void;
  onRemove?: () => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  if (existingPath) {
    return (
      <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={14} className="text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="font-inter text-xs font-semibold text-gray-800 truncate">{label}</p>
            <p className="font-inter text-xs text-gray-400 truncate">{existingName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onDownload && (
            <button
              onClick={onDownload}
              title="Download"
              className="p-1.5 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-100 rounded transition-colors"
            >
              <Download size={13} />
            </button>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            title="Replace file"
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <RefreshCw size={13} />
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              title="Remove file"
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
      </div>
    );
  }

  return (
    <div
      onClick={() => !isUploading && inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-lg px-3 py-4 cursor-pointer transition-colors
        ${isUploading
          ? 'border-blue-300 bg-blue-50 cursor-wait'
          : 'border-gray-300 bg-white hover:border-[#1B3F7A] hover:bg-[#FAFBFC]'
        }`}
    >
      {isUploading ? (
        <>
          <RefreshCw size={16} className="text-blue-500 animate-spin" />
          <p className="font-inter text-xs text-blue-600 font-medium">Uploading…</p>
        </>
      ) : (
        <>
          <FileUp size={16} className="text-gray-400" />
          <p className="font-inter text-xs text-gray-600 font-medium">Upload {label}</p>
          <p className="font-inter text-xs text-gray-400">Click to select file</p>
        </>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
}

// ─── Meta item ────────────────────────────────────────────────────────────────

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-inter text-gray-400 text-xs">{label}</p>
      <p className="font-inter font-medium text-gray-700 text-xs">{value}</p>
    </div>
  );
}
