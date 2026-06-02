'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  FileText, Download, Eye, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronUp, Send, Copy, Check, Upload, X,
  FileUp, Clipboard, Info, RefreshCw
} from 'lucide-react';

interface DocumentsTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

// ─── Document type definitions ────────────────────────────────────────────────

const DOCUMENT_TYPES = [
  { id: 'terms_and_conditions',        label: 'Terms and Conditions',         description: 'General business terms' },
  { id: 'service_agreement_contract',  label: 'Service Agreement Contract',   description: 'Client engagement contract' },
  { id: 'gdpr_privacy_policy',         label: 'GDPR Privacy Policy',          description: 'Data protection policy' },
  { id: 'professional_invoice_template', label: 'Professional Invoice Template', description: 'Invoice template with branding' },
  { id: 'late_payment_letters',        label: 'Late Payment Letters',         description: 'Payment chase sequence' },
  { id: 'welcome_email_sequence',      label: 'Welcome Email Sequence',       description: 'Client onboarding emails' },
  { id: 'professional_bio',            label: 'Professional Bio',             description: 'Business biography' },
  { id: 'elevator_pitch',              label: 'Elevator Pitch',               description: '30-second pitch script' },
  { id: 'linkedin_profile_script',     label: 'LinkedIn Profile Script',      description: 'Profile optimisation' },
  { id: 'service_description_sheets',  label: 'Service Description Sheets',   description: 'Service breakdown documents' },
];

// ─── FILE GENERATION APPENDIX ─────────────────────────────────────────────────
// This is appended to EVERY document prompt. It instructs Claude to produce
// a self-contained HTML artifact with DOCX download + print-to-PDF capability.
// The user pastes the full copied text into Claude.ai and receives two
// download buttons with zero extra work required.

const FILE_GENERATION_APPENDIX = `

═══════════════════════════════════════════════════════════════
MANDATORY FILE OUTPUT INSTRUCTIONS — READ BEFORE GENERATING
═══════════════════════════════════════════════════════════════

After you have fully written the document content above, you must produce a SINGLE self-contained HTML artifact. This artifact must:

1. RENDER the complete document beautifully on screen (clean, professional, printable layout).
2. PROVIDE a "Download as Word (.docx)" button that uses the docx.js library (loaded from CDN) to programmatically build and download a properly structured DOCX file.
3. PROVIDE a "Download as PDF" button that triggers window.print() with print-optimised CSS so the user can save directly to PDF from their browser.

─── EXACT TECHNICAL SPECIFICATION FOR THE ARTIFACT ───────────

The artifact must be a single HTML file. Use the following skeleton exactly:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[DOCUMENT TITLE]</title>
  <script src="https://unpkg.com/docx@8.5.0/build/index.js"></script>
  <style>
    /* ── Screen styles ── */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Georgia', serif; background: #f0f0f0; color: #1a1a1a; }

    .toolbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      background: #1b2534; padding: 12px 24px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .toolbar-title { color: #fff; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; }
    .toolbar-btns { display: flex; gap: 10px; }
    .btn {
      padding: 8px 18px; border: none; border-radius: 5px; cursor: pointer;
      font-family: Arial, sans-serif; font-size: 13px; font-weight: 600;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-docx { background: #2563eb; color: #fff; }
    .btn-pdf  { background: #e85d04; color: #fff; }

    .page-wrapper { max-width: 860px; margin: 80px auto 60px; padding: 0 20px; }

    .document {
      background: #fff;
      padding: 72px 80px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.12);
      min-height: 1100px;
    }

    .doc-header { border-bottom: 3px solid #1b2534; padding-bottom: 24px; margin-bottom: 36px; }
    .doc-business-name { font-family: Arial, sans-serif; font-size: 22px; font-weight: 700; color: #1b2534; }
    .doc-title { font-family: Arial, sans-serif; font-size: 16px; color: #444; margin-top: 4px; }
    .doc-meta { font-family: Arial, sans-serif; font-size: 12px; color: #888; margin-top: 8px; }

    h2 {
      font-family: Arial, sans-serif; font-size: 13px; font-weight: 700;
      color: #1b2534; text-transform: uppercase; letter-spacing: 0.08em;
      margin: 36px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #ddd;
    }
    h3 {
      font-family: Arial, sans-serif; font-size: 12px; font-weight: 700;
      color: #333; margin: 20px 0 8px;
    }
    p, li { font-size: 13px; line-height: 1.75; color: #222; margin-bottom: 10px; }
    ul, ol { margin: 0 0 12px 22px; }
    li { margin-bottom: 5px; }

    .clause { margin-bottom: 14px; }
    .clause-num { font-weight: 700; color: #1b2534; }

    .legal-disclaimer {
      margin-top: 48px; padding: 20px; background: #f8f8f8;
      border-left: 4px solid #e85d04; font-size: 11.5px;
      color: #555; line-height: 1.6;
    }

    .signature-block {
      margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
    }
    .sig-box { border-top: 1px solid #999; padding-top: 10px; }
    .sig-label { font-family: Arial, sans-serif; font-size: 11px; color: #888; }

    /* ── Print / PDF styles ── */
    @media print {
      body { background: #fff; }
      .toolbar { display: none !important; }
      .page-wrapper { margin: 0; padding: 0; max-width: 100%; }
      .document { box-shadow: none; padding: 40px 50px; }
      @page { margin: 20mm; size: A4; }
    }
  </style>
</head>
<body>

  <!-- TOOLBAR -->
  <div class="toolbar">
    <span class="toolbar-title">[DOCUMENT TITLE] — [BUSINESS TRADING NAME]</span>
    <div class="toolbar-btns">
      <button class="btn btn-docx" onclick="downloadDocx()">⬇ Download Word (.docx)</button>
      <button class="btn btn-pdf"  onclick="window.print()">⬇ Download PDF</button>
    </div>
  </div>

  <!-- DOCUMENT PREVIEW -->
  <div class="page-wrapper">
    <div class="document" id="doc-content">

      <div class="doc-header">
        <div class="doc-business-name">[BUSINESS TRADING NAME]</div>
        <div class="doc-title">[DOCUMENT TITLE]</div>
        <div class="doc-meta">Version 1.0 &nbsp;|&nbsp; Effective Date: [DATE] &nbsp;|&nbsp; Jurisdiction: England &amp; Wales</div>
      </div>

      <!-- ═══════════════════════════════════════════════════
           INSERT ALL DOCUMENT SECTIONS HERE.
           Use <h2> for === SECTION NAME === headings.
           Use <h3> for sub-headings.
           Use <p class="clause"><span class="clause-num">1.1</span> Clause text here.</p>
           for numbered clauses.
           Use <div class="legal-disclaimer"> for the final disclaimer.
           Use <div class="signature-block"> for signature blocks.
      ═══════════════════════════════════════════════════ -->

    </div>
  </div>

  <script>
  // ── DOCX GENERATION ──────────────────────────────────────────────────────
  // Build a proper .docx file programmatically from the document data below.
  // Uses docx.js v8 (loaded from CDN above).
  // Populate the documentSections array with the full document content.

  async function downloadDocx() {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
            BorderStyle, ShadingType, UnderlineType, PageBreak } = docx;

    // ── Document metadata ─────────────────────────────────────────
    const BUSINESS_NAME = "[BUSINESS TRADING NAME]";
    const DOC_TITLE     = "[DOCUMENT TITLE]";
    const DOC_DATE      = "[DATE]";

    // ── Helper: plain paragraph ───────────────────────────────────
    const para = (text, opts = {}) => new Paragraph({
      children: [new TextRun({ text, size: 22, font: "Georgia", ...opts })],
      spacing: { after: 160 },
    });

    // ── Helper: numbered clause ───────────────────────────────────
    const clause = (num, text) => new Paragraph({
      children: [
        new TextRun({ text: num + "  ", bold: true, size: 22, font: "Georgia" }),
        new TextRun({ text, size: 22, font: "Georgia" }),
      ],
      spacing: { after: 140 },
      indent: { left: 360 },
    });

    // ── Helper: section heading ───────────────────────────────────
    const section = (title) => new Paragraph({
      children: [new TextRun({
        text: "═══  " + title.toUpperCase() + "  ═══",
        bold: true, size: 24, font: "Arial", color: "1b2534",
      })],
      spacing: { before: 480, after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "1b2534" } },
    });

    // ── Helper: sub-heading ───────────────────────────────────────
    const subhead = (title) => new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 22, font: "Arial", color: "333333" })],
      spacing: { before: 300, after: 120 },
    });

    // ═══════════════════════════════════════════════════════════════
    // DOCUMENT CONTENT — populate this array with the full document.
    // Follow the pattern: section(), clause(), para(), subhead()
    // This must contain ALL content from the document rendered above.
    // ═══════════════════════════════════════════════════════════════
    const children = [

      // ── Header block ──────────────────────────────────────────
      new Paragraph({
        children: [new TextRun({ text: BUSINESS_NAME, bold: true, size: 36, font: "Arial", color: "1b2534" })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: DOC_TITLE, size: 26, font: "Arial", color: "444444" })],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Version 1.0  |  Effective Date: " + DOC_DATE + "  |  England & Wales", size: 18, font: "Arial", color: "888888" })],
        spacing: { after: 400 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "1b2534" } },
      }),

      // INSERT ALL DOCUMENT SECTIONS HERE using section(), clause(), para(), subhead()

    ];

    const doc = new Document({
      creator: BUSINESS_NAME,
      title: DOC_TITLE,
      description: DOC_TITLE + " — " + BUSINESS_NAME,
      sections: [{
        properties: {
          page: {
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = BUSINESS_NAME.replace(/[^a-z0-9]/gi, "_") + "_" + DOC_TITLE.replace(/[^a-z0-9]/gi, "_") + ".docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  </script>

</body>
</html>

─── CRITICAL CONTENT RULES ────────────────────────────────────

1. Every === SECTION NAME === heading from the document must appear as an <h2> tag in the HTML preview AND as a section() call in the DOCX children array. They must match exactly.

2. Every numbered clause (1.1, 1.2, etc.) must appear as a <p class="clause"> in HTML AND as a clause() call in DOCX.

3. The DOCX children array must contain the COMPLETE document — not a summary, not selected highlights. Every clause. Every paragraph. Every section.

4. Do NOT use placeholder text in the body of the document. Only signature date lines may use [DATE] placeholders. All business data from the brief must be fully inserted.

5. The HTML preview must be genuinely beautiful: clean white page, proper typography, orange accent on the disclaimer block, dark navy header. Use the brand colour #1b2534 throughout.

6. Test mentally: if someone downloaded the DOCX right now and sent it to a client, would it be complete and professional? If yes, proceed. If no, fix it first.

7. The PDF download works via window.print() — the print CSS is already specified above. Do not add any additional print logic.

8. File naming convention: [BusinessName]_[DocumentTitle].docx — spaces replaced with underscores.

Generate the complete artifact now. The document content must appear in BOTH the HTML preview section AND the DOCX children array.
`;

// ─── System prompts for each document type ────────────────────────────────────

const DOCUMENT_PROMPTS: Record<string, string> = {
  terms_and_conditions: `You are a senior UK commercial solicitor with 25 years of experience drafting small business contracts. You have been instructed to produce a complete, legally robust Terms and Conditions document for a UK sole trader or small business.

CONTENT FORMATTING RULES (for the document text itself):
- No markdown in the document body. Section headings use: === SECTION NAME ===
- Numbered clauses: 1. / 1.1 / 1.1.1
- Clean plain text. No asterisks, no backticks.

UK STATUTE REFERENCES — CITE ONLY:
- Supply of Goods and Services Act 1982 (s.13)
- Consumer Rights Act 2015 (B2C only)
- Consumer Contracts Regulations 2013 (B2C distance selling)
- Late Payment of Commercial Debts (Interest) Act 1998 (interest at 8% per annum ABOVE Bank of England base rate; Schedule 1: £40/£70/£100)
- Unfair Contract Terms Act 1977
- Contracts (Rights of Third Parties) Act 1999
- Limitation Act 1980
- Data Protection Act 2018 / UK GDPR
- Privacy and Electronic Communications Regulations 2003
- Taxes Management Act 1970

DOCUMENT STRUCTURE — Produce ALL sections:
1. PARTIES AND DEFINITIONS
2. FORMATION OF CONTRACT
3. DESCRIPTION OF SERVICES (one sub-section per service from the brief)
4. CLIENT OBLIGATIONS
5. FEES, INVOICING, AND PAYMENT (exact figures from brief; late payment at "8% per annum above the Bank of England base rate")
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
17. LEGAL DISCLAIMER (mandatory callout at end)

Risk-to-clause mapping — apply for every risk flagged in the brief:
- Client refused to pay: payment acceleration + withhold deliverables
- Scope creep: formal Change Request procedure
- Chargeback: £25 admin charge + civil proceedings right
- IP ownership dispute: IP stays with provider until paid in full
- GDPR complaint: data controller clause
- Harassment: immediate termination right

Target length: 4,500–6,000 words. Populate EVERY field with real data from the brief. No placeholder text except signature fields.`,

  service_agreement_contract: `You are a senior UK commercial solicitor producing a Bespoke Client Contract — a bilaterally signed, project-specific engagement agreement governing a defined piece of work between named parties.

UK STATUTES (same permitted list as T&Cs). Late payment interest ALWAYS: "8% per annum above the Bank of England base rate".

DOCUMENT STRUCTURE:
1. PARTIES (full legal details; client fields as completion placeholders)
2. RECITALS
3. INCORPORATION OF GENERAL TERMS AND CONDITIONS
4. SERVICES AND SCOPE OF WORK (one sub-section per service; includes AND excludes stated)
5. DELIVERABLES (formats, revision rounds, acceptance period, release on full payment)
6. TIMELINE AND MILESTONES
7. FEES AND PAYMENT (deposit, balance, invoicing, late payment, chargeback)
8. REFUND AND CANCELLATION
9. INTELLECTUAL PROPERTY (BEFORE payment: provider owns; AFTER full payment: assign or licence)
10. CONFIDENTIALITY
11. DATA PROTECTION
12. WARRANTIES (reasonable care and skill; results disclaimers per industry)
13. LIMITATION OF LIABILITY
14. TERMINATION (immediate triggers: non-payment, material breach, insolvency, harassment)
15. ABANDONED PROJECT (client silent for 10 Business Days = abandonment; fees due)
16. GOVERNING LAW AND DISPUTE RESOLUTION
17. SIGNATURES (both parties; client fields as placeholders)
18. LEGAL DISCLAIMER

Target: 3,800–5,500 words. All business details from brief. No invented data.`,

  gdpr_privacy_policy: `You are a UK data protection specialist producing a Privacy Notice for a real business. This document may be scrutinised by the ICO.

PHANTOM DATA PROHIBITION: Only include data categories, tools, collection methods, and processing purposes EXPLICITLY stated in the brief. Do not invent standard practices.

LAWFUL BASIS ASSIGNMENT:
- Performance of contract (Article 6(1)(b)): delivering service, invoicing, client comms
- Legal obligation (Article 6(1)(c)): HMRC records (6 years, Taxes Management Act 1970)
- Legitimate interests (Article 6(1)(f)): business admin, fraud prevention
- Consent (Article 6(1)(a)): email marketing ONLY if confirmed in brief

DOCUMENT STRUCTURE:
1. WHO WE ARE AND HOW TO CONTACT US
2. WHAT THIS NOTICE COVERS
3. WHAT PERSONAL DATA WE COLLECT (only confirmed categories)
4. HOW WE COLLECT YOUR DATA (only confirmed methods)
5. WHY WE USE YOUR DATA — PURPOSES AND LEGAL BASIS (table: Purpose | Data | Lawful Basis | Retention)
6. WHO WE SHARE YOUR DATA WITH (only confirmed third-party tools)
7. INTERNATIONAL DATA TRANSFERS
8. HOW LONG WE KEEP YOUR DATA (exact retention from brief; HMRC = 6 years minimum)
9. HOW WE PROTECT YOUR DATA (only confirmed storage/security measures)
10. YOUR RIGHTS UNDER UK GDPR (Articles 15-22)
11. COOKIES AND WEBSITE TRACKING (exact situation from brief)
12. CHANGES TO THIS NOTICE
13. HOW TO COMPLAIN (ICO details: www.ico.org.uk | 0303 123 1113 | Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF)
14. LEGAL DISCLAIMER

Use "UK GDPR" throughout. Not "GDPR" as EU regulation. No US privacy law references.
Target: 2,800–4,000 words.`,

  professional_invoice_template: `You are a UK business finance specialist producing a professional invoice template. This template will be used in real commercial transactions and must comply with UK invoicing requirements.

UK INVOICE LEGAL REQUIREMENTS — ALL MUST PRESENT:
- Business name and full address
- Invoice number (unique sequential reference)
- Invoice date and tax point date
- Client name and address
- Clear description of goods or services
- Quantity and unit price per line item
- Total amount (net; VAT separately if registered)
- Payment due date
- If VAT registered: VAT number, rate, amount; if NOT registered: NO VAT fields at all
- Bank/payment details
- Late payment notice: "8% per annum above the Bank of England base rate" per Late Payment of Commercial Debts (Interest) Act 1998

LINE ITEM LABELS by pricing model:
- Subscription/retainer: "Monthly Retainer — [Service Name]"
- Project: "[Project Name] — [Deliverable]"
- Hourly: "Professional Services — [X] hours at £[rate]/hour"
- Milestone: "Milestone [n]: [Description]"

Produce a complete, filled invoice template showing all sections with placeholder fields clearly marked as [FIELD TO COMPLETE]. Include: business info block, invoice details block, bill-to block, services table, totals, payment terms, accepted payment methods, bank details, late payment clause, optional notes section.`,

  late_payment_letters: `You are a UK debt recovery specialist producing a three-letter graduated late payment sequence.

LEGAL FRAMEWORK:
- Late Payment of Commercial Debts (Interest) Act 1998: interest at "8% per annum above the Bank of England base rate" (NEVER as a fixed rate); Schedule 1 costs: £40 (under £1,000) / £70 (£1,000–£9,999) / £100 (£10,000+)
- Pre-Action Protocol for Debt Claims (Civil Procedure Rules): Letter 3 must state amount, basis, 14-day response period, invite dispute/payment plan
- England & Wales = County Court

ABSOLUTE PROHIBITIONS:
- Never threaten criminal proceedings (debt is civil)
- Never threaten to contact employer/family
- Never use defamatory language

TONE ESCALATION:
- Letter 1: Professional and courteous. Assumes oversight. No legal language.
- Letter 2: Firm and formal. Cites payment terms and statutory rights. States consequences.
- Letter 3: Formal Pre-Action Notice. Specific amounts with interest. Exact compliance with Pre-Action Protocol. Final deadline.

Produce all three letters in full. Letter 1: 180–230 words. Letter 2: 270–350 words. Letter 3: structured per Pre-Action Protocol. Include usage notes at the end: how to calculate interest, statutory charge amounts, record-keeping advice.

For the document output: produce the three letters as three clearly separated sections within the single HTML artifact and DOCX file. Each letter has its own heading: LETTER 1 — FRIENDLY REMINDER / LETTER 2 — FORMAL NOTICE / LETTER 3 — PRE-ACTION NOTICE.`,

  welcome_email_sequence: `You are an expert in client onboarding communications for UK service businesses. Your emails create the first impression of a professional, organised business.

Produce THREE complete emails:

EMAIL 1 — IMMEDIATE WELCOME (send on purchase/signing):
- Subject line: specific and warm, references the service (max 60 chars)
- Body (180–240 words): warm acknowledgement specific to this service; confirmation of what they've signed up for; clear next steps; contact details
- Tone: reads like a real person wrote it.

EMAIL 2 — ONBOARDING AND NEXT STEPS (send 24 hours after Email 1):
- Subject: action-oriented (max 60 chars)
- Body (200–270 words): specific onboarding steps client must complete; timeline of what happens next; how to communicate during project
- Practical and specific. Not a generic checklist.

EMAIL 3 — VALUE ADD (send 5–7 days after Email 1):
- Subject: offers genuine value (max 60 chars)
- Body (170–220 words): delivers something useful — specific insight, tip, or observation relevant to this service; ends with open easy-to-respond-to question

Apply tone from brief. No corporate language. No clichés. Each email complete and ready to send with only [Client First Name] as a placeholder.

For the document output: produce the three emails as three clearly separated sections within the single HTML artifact and DOCX file.`,

  professional_bio: `You are one of the UK's foremost personal branding copywriters. You write bios that sound like real people — not press releases, not LinkedIn clichés.

UNIVERSAL PROHIBITIONS — NEVER USE:
"passionate about", "driven", "results-oriented", "on a journey", "helping businesses thrive", "game-changer", "leverage" (as verb), "synergy", "holistic approach", "bespoke solutions", "dynamic", "proactive", "dedicated", "committed to excellence"

Never open any version with the person's name.

Produce THREE versions:

SHORT BIO (50 words): Email signature, LinkedIn tagline, directory listing. Name appears once.

MEDIUM BIO (150 words): Website About sidebar, PDF proposal. Three paragraphs: hook → what/for whom/outcome → background as evidence → differentiator + soft CTA.

LONG BIO (350 words): Full About page, media kit, LinkedIn About. Opening declaration → what they do → the problem they solve → background and credibility → differentiator → specific proof → invitation to connect.

State word count for each version.`,

  elevator_pitch: `You are a specialist pitch coach producing elevator pitches for a UK service business.

EVERY PITCH answers these questions in order:
1. Who specifically do you help?
2. What specific problem/frustration do they have?
3. What do you do about it?
4. What does their life/business look like after?
5. What makes you the right choice?

Produce FOUR versions:

15-SECOND SPOKEN PITCH (40–55 words): First exchange at networking. State word count + reading time.
30-SECOND SPOKEN PITCH (75–100 words): Problem / what you do / result / differentiator / CTA. State word count + reading time.
60-SECOND SPOKEN PITCH (140–170 words): Open with relatable scenario. ONE specific proof point. Natural CTA. State word count + reading time.
WRITTEN PITCH (80–120 words): For email/proposal/website. Five lines: problem / what + who / differentiator / result / specific CTA. State word count.`,

  linkedin_profile_script: `You are a LinkedIn optimisation strategist for UK service providers.

Produce:

KEYWORD STRATEGY: Primary keywords (5–8) + secondary keywords (8–12). Placement strategy.

HEADLINE OPTIONS (220 chars max each — 3 options): Does not begin with job title. Contains primary service and target client type. States result or value. Character count for each.

ABOUT SECTION (2,600 chars max): Lines 1–3 hook ideal client's problem (NOT the person's name). Paras: what/for whom/how → background → differentiator → proof → CTA. State character count.

EXPERIENCE SECTION: Current role title options (2–3). 6–8 bullet points with strong action verbs.

SKILLS SECTION: 18–22 skills in priority order, exact LinkedIn taxonomy names.

FEATURED SECTION: 3 items with content type and rationale.

BANNER TAGLINE: 2 options, max 12 words each.

GROWTH STRATEGY (200 words): Who to connect with; commenting strategy; posting frequency; one content pillar.

SAMPLE POSTS: 2 posts, 150 words each (educational/authority format; result/story format).`,

  service_description_sheets: `You are a professional business copywriter producing service description sheets for a UK business. These sheets clarify scope (protecting against scope creep) and sell the service.

Produce ONE complete sheet per service listed in the brief.

Each sheet structure:
SERVICE AT A GLANCE (70–100 words): What it is, who it's for, primary outcome.
WHAT IS INCLUDED: One bullet per included deliverable. Specific and concrete.
WHAT IS NOT INCLUDED: At least 4–6 meaningful exclusions. Be direct.
WHO THIS SERVICE IS DESIGNED FOR (3–4 sentences): Specific industry and problem.
WHAT TO EXPECT — PROCESS AND TIMELINE: Numbered steps including onboarding, stages, communication, delivery.
RESULTS YOU CAN EXPECT (4–6 bullets): Concrete, believable, specific.
INVESTMENT: Starting price or "Contact us for a personalised quote."
TO GET STARTED: Specific action + what happens next.
A NOTE ON SCOPE: Standard closing clause about scope clarity.

Apply tone from brief. UK English.`,
};

// ─── Prompt assembly ─────────────────────────────────────────────────────────
// Combines: document label + generation instructions + brief + file output appendix

function assemblePrompt(docTypeId: string, brief: string): string {
  const docLabel = DOCUMENT_TYPES.find(d => d.id === docTypeId)?.label || docTypeId;
  const corePrompt = DOCUMENT_PROMPTS[docTypeId] || '';

  return `DOCUMENT TO GENERATE: ${docLabel}

═══════════════════════════════════════════════════════════════
GENERATION INSTRUCTIONS — READ THIS SECTION FULLY FIRST
═══════════════════════════════════════════════════════════════

${corePrompt}

═══════════════════════════════════════════════════════════════
CLIENT BRIEF — USE THIS DATA TO POPULATE THE DOCUMENT
═══════════════════════════════════════════════════════════════

${brief}

═══════════════════════════════════════════════════════════════
END OF BRIEF
═══════════════════════════════════════════════════════════════

BEFORE YOU GENERATE — CONFIRM THE FOLLOWING:
✓ You have read the full generation instructions above
✓ You have read the full client brief above
✓ You will populate every field with real data from the brief
✓ You will not leave placeholder text in the document body
✓ You will follow the file output instructions below exactly

${FILE_GENERATION_APPENDIX}`;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DocumentsTab({ userId, data, refreshData }: DocumentsTabProps) {
  const [documents, setDocuments]     = useState<Record<string, any>>({});
  const [loading, setLoading]         = useState(true);
  const [brief, setBrief]             = useState<string>('');
  const [message, setMessage]         = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

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
    docs?.forEach(doc => { docsMap[doc.document_type] = doc; });
    setDocuments(docsMap);
    setLoading(false);
  };

  const fetchBrief = async () => {
    const { data: briefData } = await supabase
      .from('client_briefs')
      .select('brief_content')
      .eq('client_id', userId)
      .maybeSingle();
    if (briefData?.brief_content) setBrief(briefData.brief_content);
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

    const fullPrompt = assemblePrompt(docTypeId, brief);
    const docLabel   = DOCUMENT_TYPES.find(d => d.id === docTypeId)?.label || docTypeId;

    const writeToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(fullPrompt);
        return true;
      } catch {
        // Fallback for environments that restrict clipboard API
        const ta = document.createElement('textarea');
        ta.value = fullPrompt;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      }
    };

    const ok = await writeToClipboard();
    if (!ok) {
      showMessage('Clipboard write failed — please copy manually.', 'error');
      return;
    }

    setCopiedDocId(docTypeId);
    showMessage(
      `✓ Prompt for "${docLabel}" copied (${Math.round(fullPrompt.length / 4).toLocaleString()} tokens approx). Paste into Claude.ai to generate your DOCX + PDF.`,
      'success'
    );

    // Ensure a pending record exists so the Manage panel is available
    if (!documents[docTypeId]) {
      await supabase.from('generated_documents').insert({
        client_id:      userId,
        document_type:  docTypeId,
        document_label: docLabel,
        status:         'pending',
      });
      await fetchDocuments();
    }

    setTimeout(() => setCopiedDocId(null), 4000);
  };

  const handleFileUpload = async (docTypeId: string, file: File, fileKind: 'pdf' | 'docx') => {
    const docLabel = DOCUMENT_TYPES.find(d => d.id === docTypeId)?.label || docTypeId;
    setUploadingDoc(`${docTypeId}-${fileKind}`);

    try {
      const ext        = fileKind === 'pdf' ? 'pdf' : 'docx';
      const storagePath = `${userId}/${docTypeId}.${ext}`;
      const mimeType   = fileKind === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      const { error: uploadError } = await supabase.storage
        .from('generated-documents')
        .upload(storagePath, file, { contentType: mimeType, upsert: true });

      if (uploadError) {
        showMessage(`Upload failed: ${uploadError.message}`, 'error');
        return;
      }

      const existing      = documents[docTypeId];
      const updatePayload: Record<string, any> = {
        client_id:           userId,
        document_type:       docTypeId,
        document_label:      docLabel,
        status:              'completed',
        generated_at:        new Date().toISOString(),
        files_generated_at:  new Date().toISOString(),
        error_message:       null,
      };
      if (fileKind === 'pdf')  updatePayload.pdf_path  = storagePath;
      if (fileKind === 'docx') updatePayload.docx_path = storagePath;

      if (existing?.id) {
        await supabase.from('generated_documents').update(updatePayload).eq('id', existing.id);
      } else {
        await supabase.from('generated_documents').insert(updatePayload);
      }

      showMessage(`${fileKind.toUpperCase()} uploaded successfully for "${docLabel}"`, 'success');
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

    const a    = document.createElement('a');
    a.href     = data.signedUrl;
    a.download = fileName;
    a.target   = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleMarkDelivered = async (docId: string) => {
    await supabase
      .from('generated_documents')
      .update({ delivered_to_client: true, delivered_at: new Date().toISOString() })
      .eq('id', docId);
    showMessage('Document marked as delivered', 'success');
    await fetchDocuments();
  };

  const handleRemoveFile = async (docTypeId: string, fileKind: 'pdf' | 'docx') => {
    const existing = documents[docTypeId];
    if (!existing?.id) return;

    const fieldKey    = fileKind === 'pdf' ? 'pdf_path' : 'docx_path';
    const storagePath = existing[fieldKey];
    if (storagePath) await supabase.storage.from('generated-documents').remove([storagePath]);

    const otherKey      = fileKind === 'pdf' ? 'docx_path' : 'pdf_path';
    const updatePayload: Record<string, any> = { [fieldKey]: null };
    if (!existing[otherKey]) updatePayload.status = 'pending';

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
        <div className={`rounded-lg p-4 border ${
          messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800'
          : messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
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
              Copy the prompt for any document, paste it directly into Claude.ai, and receive a complete DOCX and PDF — ready to download and send to the client.
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

        {!briefAvailable && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="font-inter text-amber-800 text-sm">
              No client brief found. Generate the Master Brief first — prompts won&apos;t include client data without it.
            </p>
          </div>
        )}

        <div className="mt-4 bg-[#FAFBFC] rounded-lg border border-gray-200 p-4">
          <div className="flex items-start gap-2 mb-2">
            <Info size={15} className="text-[#1B3F7A] shrink-0 mt-0.5" />
            <p className="font-inter font-semibold text-[#1B3F7A] text-sm">How this works</p>
          </div>
          <ol className="space-y-1.5 ml-5">
            {[
              'Click "Copy Prompt" on any document below',
              'Open Claude.ai in a new tab and paste the prompt',
              'Claude will generate the document and produce a self-contained HTML artifact',
              'The artifact has two buttons: "Download Word (.docx)" and "Download PDF"',
              'Download both files, then upload them here using the Upload buttons to store and track delivery',
            ].map((step, i) => (
              <li key={i} className="font-inter text-gray-600 text-xs flex gap-2">
                <span className="font-bold text-[#1B3F7A] shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Document cards */}
      <div className="space-y-3">
        {DOCUMENT_TYPES.map(docType => {
          const doc            = documents[docType.id];
          const isCopied       = copiedDocId === docType.id;
          const isExpanded     = expandedDoc === docType.id;
          const isUploadingPdf  = uploadingDoc === `${docType.id}-pdf`;
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
  docType, doc, isCopied, isExpanded, isUploadingPdf, isUploadingDocx,
  briefAvailable, onCopyPrompt, onToggleExpand, onUploadFile,
  onDownload, onMarkDelivered, onRemoveFile,
}: {
  docType:          { id: string; label: string; description: string };
  doc:              any;
  isCopied:         boolean;
  isExpanded:       boolean;
  isUploadingPdf:   boolean;
  isUploadingDocx:  boolean;
  briefAvailable:   boolean;
  onCopyPrompt:     () => void;
  onToggleExpand:   () => void;
  onUploadFile:     (file: File, kind: 'pdf' | 'docx') => void;
  onDownload:       (path: string, name: string) => void;
  onMarkDelivered:  () => void;
  onRemoveFile:     (kind: 'pdf' | 'docx') => void;
}) {
  const pdfInputRef  = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  const status      = doc?.status || 'pending';
  const hasPdf      = !!doc?.pdf_path;
  const hasDocx     = !!doc?.docx_path;
  const isCompleted = status === 'completed';

  const statusConfig: Record<string, { colour: string; bg: string; label: string; icon: React.ReactNode }> = {
    pending:    { colour: 'text-gray-500',  bg: 'bg-gray-100',  label: 'Pending',     icon: <Clock size={11} /> },
    generating: { colour: 'text-blue-600',  bg: 'bg-blue-50',   label: 'In Progress', icon: <RefreshCw size={11} className="animate-spin" /> },
    completed:  { colour: 'text-green-600', bg: 'bg-green-50',  label: 'Complete',    icon: <CheckCircle2 size={11} /> },
    failed:     { colour: 'text-red-600',   bg: 'bg-red-50',    label: 'Failed',      icon: <AlertCircle size={11} /> },
  };
  const s = statusConfig[status] || statusConfig.pending;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                  {s.icon}{s.label}
                </span>
                {doc?.delivered_to_client && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                    <Send size={10} /> Delivered
                  </span>
                )}
                {hasPdf  && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">PDF</span>}
                {hasDocx && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-600">DOCX</span>}
              </div>
              <p className="font-inter text-gray-500 text-xs">{docType.description}</p>
              {doc?.generated_at && (
                <p className="font-inter text-gray-400 text-xs mt-0.5">
                  Updated: {new Date(doc.generated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onCopyPrompt}
              disabled={!briefAvailable}
              title={briefAvailable ? 'Copy full prompt to clipboard — paste into Claude.ai' : 'Generate Master Brief first'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-inter font-medium transition-colors
                ${isCopied
                  ? 'bg-green-600 text-white'
                  : briefAvailable
                    ? 'bg-[#1B3F7A] hover:bg-[#2C68C4] text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isCopied ? <Check size={13} /> : <Clipboard size={13} />}
              {isCopied ? 'Copied!' : 'Copy Prompt'}
            </button>

            {doc && (
              <button
                onClick={onToggleExpand}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
              >
                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {isExpanded ? 'Close' : 'Manage'}
              </button>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-[#FAFBFC] space-y-4">
          <div>
            <p className="font-inter font-semibold text-gray-700 text-xs mb-2 uppercase tracking-wide">Upload Files</p>
            <p className="font-inter text-gray-500 text-xs mb-3">
              After downloading from Claude, upload both files here to store and track delivery.
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

          {isCompleted && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
              {!doc.delivered_to_client ? (
                <button
                  onClick={onMarkDelivered}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-inter font-medium transition-colors"
                >
                  <Send size={13} /> Mark as Delivered to Client
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

          {doc && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-200">
              <MetaItem label="Status"    value={s.label} />
              <MetaItem label="Generated" value={doc.generated_at ? new Date(doc.generated_at).toLocaleDateString('en-GB') : '—'} />
              <MetaItem label="Files"     value={hasPdf && hasDocx ? 'PDF & DOCX' : hasPdf ? 'PDF only' : hasDocx ? 'DOCX only' : 'No files'} />
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
  label, existingPath, existingName, isUploading, accept,
  inputRef, onFileSelect, onDownload, onRemove,
}: {
  label:        string;
  existingPath: string | null;
  existingName: string;
  isUploading:  boolean;
  accept:       string;
  inputRef:     React.RefObject<HTMLInputElement>;
  onFileSelect: (file: File) => void;
  onDownload?:  () => void;
  onRemove?:    () => void;
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
            <button onClick={onDownload} title="Download"
              className="p-1.5 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-100 rounded transition-colors">
              <Download size={13} />
            </button>
          )}
          <button onClick={() => inputRef.current?.click()} title="Replace file"
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <RefreshCw size={13} />
          </button>
          {onRemove && (
            <button onClick={onRemove} title="Remove file"
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
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
