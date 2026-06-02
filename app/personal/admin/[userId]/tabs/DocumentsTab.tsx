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
  { id: 'terms_and_conditions', label: 'Terms and Conditions', description: 'General business terms' },
  { id: 'service_agreement_contract', label: 'Service Agreement Contract', description: 'Client engagement contract' },
  { id: 'gdpr_privacy_policy', label: 'GDPR Privacy Policy', description: 'Data protection policy' },
  { id: 'professional_invoice_template', label: 'Professional Invoice Template', description: 'Invoice template with branding' },
  { id: 'late_payment_letters', label: 'Late Payment Letters', description: 'Payment chase sequence' },
  { id: 'welcome_email_sequence', label: 'Welcome Email Sequence', description: 'Client onboarding emails' },
  { id: 'professional_bio', label: 'Professional Bio', description: 'Business biography' },
  { id: 'elevator_pitch', label: 'Elevator Pitch', description: '30-second pitch script' },
  { id: 'linkedin_profile_script', label: 'LinkedIn Profile Script', description: 'Profile optimization' },
  { id: 'service_description_sheets', label: 'Service Description Sheets', description: 'Service breakdown documents' },
];

// ─── System prompts for each document type ────────────────────────────────────

const DOCUMENT_PROMPTS: Record<string, string> = {
  terms_and_conditions: `You are a senior UK commercial solicitor with 25 years of experience drafting small business contracts. You have been instructed to produce a complete, legally robust Terms and Conditions document for a UK sole trader or small business.

FORMATTING RULES:
- No markdown whatsoever. Section headings use: === SECTION NAME ===
- No markdown tables. Use plain columnar format.
- Numbered clauses: 1. 1.1. 1.1.1.
- Clean plain text only. No asterisks, no backticks.

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

Risk-to-clause mapping — apply for every risk in Q22/Q23/Q24:
- Client refused to pay: payment acceleration + withhold deliverables
- Scope creep: formal Change Request procedure
- Chargeback: £25 admin charge + civil proceedings right
- IP ownership dispute: IP stays with provider until paid in full
- GDPR complaint: data controller clause
- Harassment: immediate termination right

Target length: 4,500–6,000 words. Populate EVERY field with real data from the brief. No placeholder text except signature fields.`,

  service_agreement_contract: `You are a senior UK commercial solicitor producing a Bespoke Client Contract — a bilaterally signed, project-specific engagement agreement governing a defined piece of work between named parties.

FORMATTING RULES: No markdown. Section headings: === SECTION NAME ===. Numbered clauses. Clean plain text.

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

FORMATTING: No markdown. Section headings: === SECTION NAME ===. Plain text throughout.

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
5. WHY WE USE YOUR DATA — PURPOSES AND LEGAL BASIS (plain columnar table: Purpose | Data | Lawful Basis | Retention)
6. WHO WE SHARE YOUR DATA WITH (only confirmed third-party tools)
7. INTERNATIONAL DATA TRANSFERS
8. HOW LONG WE KEEP YOUR DATA (exact retention from brief; HMRC = 6 years minimum)
9. HOW WE PROTECT YOUR DATA (only confirmed storage/security measures)
10. YOUR RIGHTS UNDER UK GDPR (Articles 15-22: access, rectification, erasure, restriction, portability, object, automated decisions)
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

Produce a complete, filled invoice template showing all sections with placeholder fields clearly marked as [FIELD TO COMPLETE]. Include: business info block, invoice details block, bill-to block, services table, totals (subtotal, VAT if applicable, total due), payment terms, accepted payment methods, bank details (if bank transfer listed), late payment clause, optional notes section.

Format as clean plain text document — no markdown, no tables using pipes. Use spacing and alignment to create a professional invoice layout.`,

  late_payment_letters: `You are a UK debt recovery specialist producing a three-letter graduated late payment sequence.

LEGAL FRAMEWORK:
- Late Payment of Commercial Debts (Interest) Act 1998: interest at "8% per annum above the Bank of England base rate" (NEVER as a fixed rate); Schedule 1 costs: £40 (under £1,000) / £70 (£1,000–£9,999) / £100 (£10,000+)
- Pre-Action Protocol for Debt Claims (Civil Procedure Rules): Letter 3 must state amount, basis, 14-day response period, invite dispute/payment plan
- Correct court per jurisdiction: England & Wales = County Court; Scotland = Sheriff Court; Northern Ireland = County Court (NI)

ABSOLUTE PROHIBITIONS:
- Never threaten criminal proceedings (debt is civil)
- Never threaten to contact employer/family (harassment law)
- Never use defamatory language
- Never threaten action the sender would not take

TONE ESCALATION:
- Letter 1: Professional and courteous. Assumes oversight. No legal language.
- Letter 2: Firm and formal. Cites payment terms and statutory rights. States consequences.
- Letter 3: Formal Pre-Action Notice. Serious tone. Specific amounts with interest. Exact compliance with Pre-Action Protocol. Final deadline.

Produce all three letters in full with:
- Letterhead / date / addressee block / salutation
- Complete body text (Letter 1: 180–230 words; Letter 2: 270–350 words; Letter 3: structured paragraphs per Pre-Action Protocol)
- Professional close
- Usage notes at the end: how to calculate interest, statutory charge amounts, record-keeping advice, link to moneyclaims.service.gov.uk

All amounts shown as [CALCULATE BEFORE SENDING] placeholders. Business details from brief.`,

  welcome_email_sequence: `You are an expert in client onboarding communications for UK service businesses. Your emails create the first impression of a professional, organised business.

Produce a sequence of THREE complete emails:

EMAIL 1 — IMMEDIATE WELCOME (send on purchase/signing):
- Subject line: specific and warm, references the service (max 60 chars)
- Body (180–240 words): warm acknowledgement specific to this service; confirmation of what they've signed up for; clear next steps in next 24–48 hours; any immediate client action needed; contact details
- Sign-off with business name, email, phone, website
- Tone: matches brief exactly. Reads like a real person wrote it.

EMAIL 2 — ONBOARDING AND NEXT STEPS (send 24 hours after Email 1):
- Subject: action-oriented, signals "here is what we need" (max 60 chars)
- Body (200–270 words): reference back to Email 1; specific onboarding steps client must complete; timeline of what happens next; how client can communicate during project; reassurance of readiness
- Practical and specific. Not a generic checklist.

EMAIL 3 — VALUE ADD (send 5–7 days after Email 1):
- Subject: offers genuine value, intriguing (max 60 chars)
- Body (170–220 words): delivers something useful — specific insight, tip, or observation relevant to this service; NOT a check-in for its own sake; ends with open easy-to-respond-to question
- Most natural and human of the three.

Apply tone from brief throughout. No corporate language. No clichés. Each email is complete and ready to send with only [Client First Name] as a placeholder.`,

  professional_bio: `You are one of the UK's foremost personal branding copywriters. You write bios that sound like real people — not press releases, not LinkedIn clichés.

TONE APPLICATION (from Q62 in brief):
- Warm and friendly: conversational, contractions fine, first-person
- Professional and formal: third-person, full sentences, credential-forward
- Direct and no-nonsense: short punchy sentences, active verbs, no filler
- Bold and confident: strong declarations, no hedging language

UNIVERSAL PROHIBITIONS — NEVER USE:
"passionate about", "driven", "results-oriented", "on a journey", "helping businesses thrive", "game-changer", "leverage" (as verb), "synergy", "holistic approach", "bespoke solutions", "dynamic", "proactive", "dedicated", "committed to excellence"
Never open any version with the person's name.

Produce THREE versions:

SHORT BIO (50 words):
Context: email signature, LinkedIn tagline, directory listing
- Name appears once
- What they do: one plain sentence
- Who they help: specific
- One concrete differentiator
- Works completely standalone
Word count stated.

MEDIUM BIO (150 words):
Context: website About sidebar, PDF proposal
- Para 1 (hook, 2 sentences): begin with result/belief/observation. Never "I am" or "[Name] is"
- Para 2 (2–3 sentences): what, for whom, with what outcome (use Q15 results, Q20 ideal client)
- Para 3 (2 sentences): background as evidence of competence (Q57, Q58)
- Close (1 sentence): differentiator (Q61) + soft CTA
Word count stated.

LONG BIO (350 words):
Context: full About page, media kit, LinkedIn About
- Opening (2–3 sentences): declaration/belief/result — not the person's name
- Section 1: what they do, who for, flagship service, core outcome
- Section 2: the problem they solve (client's world before meeting them)
- Section 3: background and credibility as narrative (Q57, Q58)
- Section 4: differentiator + what working with them feels like (Q59, Q61)
- Section 5: specific proof — one concrete result (Q58)
- Close: momentum toward goal (Q60) + invitation to connect
Word count stated.`,

  elevator_pitch: `You are a specialist pitch coach producing elevator pitches for a UK service business.

EVERY PITCH answers these questions in order (shorter versions answer fewer):
1. Who specifically do you help?
2. What specific problem/frustration do they have?
3. What do you do about it?
4. What does their life/business look like after?
5. What makes you the right choice?

WHAT MAKES A PITCH FAIL: Opens with business name or job title; describes category not result; generic language; ends without a clear next step; sounds scripted.

Produce FOUR versions:

15-SECOND SPOKEN PITCH (40–55 words):
First exchange at networking event. Replaces "I'm a [job title]".
Do not open with business name. State result or end with open question.
State word count and approximate reading time.

30-SECOND SPOKEN PITCH (75–100 words):
Structure: (1) problem/person creates recognition; (2–3) what you do and how; (4) result; (5) differentiator; (6) CTA "If that sounds like you..."
State word count and approximate reading time.

60-SECOND SPOKEN PITCH (140–170 words):
Open with relatable scenario from ideal client. Introduce business by name. Describe ideal client specifically. Walk through process and outcome. State differentiator clearly. Include ONE specific proof point (result/achievement/client compliment). Close with natural human CTA.
State word count and approximate reading time.

WRITTEN PITCH (80–120 words) — for email/proposal/website:
Line 1: reader's problem (make them feel seen)
Line 2: what business does and who for
Line 3: differentiator
Line 4: result/outcome
Line 5: specific CTA (not "feel free to get in touch")
State word count.`,

  linkedin_profile_script: `You are a LinkedIn optimisation strategist for UK service providers.

Produce:

KEYWORD STRATEGY:
- Primary keywords (5–8, highest search volume): must appear in headline and first 3 lines of About
- Secondary keywords (8–12, niche-specific): throughout About and Experience
- Keyword placement strategy: brief note

HEADLINE OPTIONS (220 chars max each — 3 options):
Rules: does not begin with job title; contains primary service and target client type; states result or value; 2+ primary keywords; uses | separator; sounds professional not promotional.
Option A: result-forward
Option B: problem-solution
Option C: credential/specificity-forward
State character count for each.

ABOUT SECTION (2,600 chars max):
Lines 1–3 (hook before "see more"): ideal client's problem — NOT the person's name or "I help businesses"
Para 2: what business does, for whom, how — flagship service and outcome, primary keywords
Para 3: background and credibility as narrative (Q57, Q58)
Para 4: differentiator clearly stated (Q61); client experience (Q59)
Para 5: one specific proof point (Q58)
CTA: specific — DM, connect, email, or visit website
State character count.

EXPERIENCE SECTION:
Current role title: 2–3 keyword-optimised options
6–8 bullet points starting with strong action verbs, secondary keywords naturally included, specific not vague.

SKILLS SECTION:
18–22 skills in priority order, exact LinkedIn taxonomy names, brief rationale for each.

FEATURED SECTION RECOMMENDATIONS:
3 items with content type and commercial rationale.

BANNER TAGLINE:
2 options, max 12 words each, value statement not job title.

GROWTH AND VISIBILITY STRATEGY (200 words):
Who to connect with (specific job titles/industries/company sizes); strategic commenting for visibility; realistic posting frequency; one content pillar for this business.

SAMPLE POSTS (2 posts, 150 words each):
Post 1: Educational/authority format with hook, value, question/soft CTA
Post 2: Result/proof format — story-driven, non-bragging, actionable takeaway`,

  service_description_sheets: `You are a professional business copywriter producing service description sheets for a UK business. These sheets clarify scope (protecting against scope creep) and sell the service.

Produce ONE complete sheet per service listed in Q15 of the brief.

Each sheet structure:

SERVICE DESCRIPTION SHEET: [SERVICE NAME]
[Business Trading Name] | Prepared: [Month Year]

SERVICE AT A GLANCE (70–100 words):
What this service is, who it is designed for, primary outcome. Answer "is this for me?" within first two sentences. Specific, not vague.

WHAT IS INCLUDED:
One bullet per included deliverable/task/output. Read Q15(b) completely. Each bullet is one specific concrete item — not a category. Exhaustive.

WHAT IS NOT INCLUDED:
One bullet per exclusion. Read Q15(c). Be direct. Include common scope creep items explicitly. At least 4–6 meaningful exclusions.

WHO THIS SERVICE IS DESIGNED FOR (3–4 sentences):
Specific industry, business stage, problem that brings them here. Name a type of person, not "small business owners".

WHAT TO EXPECT — PROCESS AND TIMELINE:
Numbered steps. Include: onboarding, key stages, communication, delivery/sign-off, timeline. Draw from Q15(e).

RESULTS YOU CAN EXPECT (4–6 bullets):
Concrete specific outcomes from Q15(f). Believable and specific. Not aspirational marketing copy.

INVESTMENT:
Starting price from Q15(g) or "Contact us for a personalised quote."

TO GET STARTED (2 sentences):
Specific action + what happens next. Contact details from Q7/Q8.

A NOTE ON SCOPE:
Standard closing clause about scope clarity.

Apply tone from Q62. No words from Q63 avoid list. UK English.`,
};

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
  const generationPrompt = DOCUMENT_PROMPTS[docTypeId];
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

    const docLabel = DOCUMENT_TYPES.find(d => d.id === docTypeId)?.label || docTypeId;
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
    const docLabel = DOCUMENT_TYPES.find(d => d.id === docTypeId)?.label || docTypeId;
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
        {DOCUMENT_TYPES.map(docType => {
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
