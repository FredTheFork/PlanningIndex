/**
 * Foundationary Document Generation Pipeline — v2.0
 *
 * ARCHITECTURAL PHILOSOPHY
 * ─────────────────────────
 * This pipeline separates concerns into four explicit layers:
 *
 *   1. CONTENT LAYER  — AI produces a structured DocumentModel (JSON), not raw text.
 *      The model encodes semantic intent: block types, emphasis signals, layout hints,
 *      table structures, spacing density. The renderer knows what each block *is*.
 *
 *   2. DESIGN LAYER   — ClientDesign drives a resolved DesignSystem: type scale,
 *      colour tokens, spacing rhythm, heading treatment variant, table style variant.
 *      Design is not hardcoded; it is computed from the brief at render time.
 *
 *   3. RENDER LAYER   — DOCX is the primary, first-class output. The renderer
 *      translates DocumentModel + DesignSystem → docx.js primitives with full
 *      control over typography, spacing, borders, and table aesthetics.
 *      PDF is generated from the DOCX via LibreOffice (if available) or from
 *      pdf-lib as a faithful layout-faithful fallback.
 *
 *   4. OUTPUT LAYER   — Files are uploaded to Supabase Storage; paths and metadata
 *      are persisted to the database.
 *
 * WHY DOCX-FIRST
 * ──────────────
 * DOCX is the enterprise-standard editable format. Clients modify it, add logos,
 * adjust clauses. Generating DOCX first and deriving PDF from it ensures both
 * formats share the same layout source of truth. pdf-lib cannot match the
 * typographic fidelity of a DOCX-to-PDF conversion; it is used only as a fallback
 * when LibreOffice is unavailable in the edge runtime.
 *
 * WHY STRUCTURED AI OUTPUT
 * ─────────────────────────
 * Raw text → regex parsing is brittle and design-blind. By prompting the AI to
 * return a DocumentModel JSON object, we get:
 *   - Semantic block types (heading, clause, bullet, table, callout, signature)
 *   - Layout signals (density: compact | normal | airy; emphasis: high | normal)
 *   - Table data with typed headers and rows
 *   - Section-level spacing overrides
 * The renderer can then make design decisions per-block, enabling visual entropy
 * that produces genuinely distinct documents rather than template repetition.
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import {
  Document as DocxDocument,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  LevelFormat,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  ShadingType,
  TabStopType,
  TabStopPosition,
  PageBreak,
} from 'npm:docx@9.1.1';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'npm:pdf-lib@1.17.1';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: CORE TYPE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DocumentModel — the intermediate representation between AI output and renderers.
 * It is serialisable, render-agnostic, and expressive enough to drive diverse
 * visual treatments without being layout-specific.
 */

type BlockDensity = 'compact' | 'normal' | 'airy';
type EmphasisLevel = 'high' | 'normal' | 'subdued';
type HeadingVariant = 'section' | 'subsection' | 'minor';
type TableStyleHint = 'data' | 'comparative' | 'definition' | 'financial';

interface BlockBase {
  id: string;
  density?: BlockDensity;
  emphasis?: EmphasisLevel;
}

interface HeadingBlock extends BlockBase {
  type: 'heading';
  variant: HeadingVariant;
  text: string;
}

interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  text: string;
}

interface ClauseBlock extends BlockBase {
  type: 'clause';
  number: string; // e.g. "1.1" or "12"
  text: string;
}

interface BulletBlock extends BlockBase {
  type: 'bullet';
  text: string;
  level?: number; // 0 = top, 1 = nested
}

interface TableBlock extends BlockBase {
  type: 'table';
  styleHint: TableStyleHint;
  caption?: string;
  headers: string[];
  rows: string[][];
}

interface CalloutBlock extends BlockBase {
  type: 'callout';
  label?: string; // e.g. "Important", "Note"
  text: string;
}

interface SignatureBlock extends BlockBase {
  type: 'signature';
  parties: Array<{ label: string; nameField: string; dateField: string }>;
}

interface DividerBlock extends BlockBase {
  type: 'divider';
  weight: 'light' | 'heavy';
}

type DocumentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ClauseBlock
  | BulletBlock
  | TableBlock
  | CalloutBlock
  | SignatureBlock
  | DividerBlock;

interface DocumentMetadata {
  title: string;
  subtitle?: string;
  documentType: string;
  businessName: string;
  jurisdiction?: string;
  version?: string;
  date: string;
}

interface DocumentModel {
  metadata: DocumentMetadata;
  sections: DocumentSection[];
}

interface DocumentSection {
  id: string;
  heading?: string;
  headingVariant?: HeadingVariant;
  density?: BlockDensity;
  blocks: DocumentBlock[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: DESIGN SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DesignSystem — resolved from ClientDesign at render time.
 * All spacing, colour, and typographic decisions flow from this object.
 * Nothing in the renderer hardcodes a pixel value; it always reads from here.
 */

interface ColourToken {
  hex: string;      // full hex e.g. "#1B3F7A"
  r: number;        // 0–1 for pdf-lib
  g: number;
  b: number;
  docxHex: string;  // no # for docx
}

interface TypeScale {
  displayPt: number;    // document title
  h1Pt: number;         // section heading
  h2Pt: number;         // subsection
  h3Pt: number;         // minor heading
  bodyPt: number;       // body copy
  smallPt: number;      // captions, footers
  // docx uses half-points (pt * 2)
  displayHp: number;
  h1Hp: number;
  h2Hp: number;
  h3Hp: number;
  bodyHp: number;
  smallHp: number;
}

interface SpacingSystem {
  // All values in DXA (1/20th of a point; 1440 DXA = 1 inch)
  // and twips for DOCX spacing (same unit)
  sectionBefore: number;
  sectionAfter: number;
  headingBefore: number;
  headingAfter: number;
  paragraphAfter: number;
  clauseAfter: number;
  bulletAfter: number;
  // Indent values (DXA)
  clauseIndent: number;
  bulletIndent: number;
  bulletHanging: number;
  nestedBulletIndent: number;
}

type HeadingTreatment =
  | 'underline-accent'   // colour underline beneath heading text
  | 'left-rule'          // vertical bar on left edge
  | 'full-rule'          // full-width rule below
  | 'capsule'            // coloured background band
  | 'plain';             // weight + colour only

type TableTreatment =
  | 'ruled'          // header band + alternating row shading + ruled borders
  | 'open'           // header band, no cell borders, hairline row dividers
  | 'minimalist'     // no shading, thin ruled borders
  | 'financial';     // monospaced numbers, right-aligned amounts, ruled totals row

interface DesignSystem {
  primary: ColourToken;
  secondary: ColourToken;
  accent: ColourToken;
  surface: ColourToken;    // light tint for table rows, callout backgrounds
  bodyText: ColourToken;
  mutedText: ColourToken;
  type: TypeScale;
  spacing: SpacingSystem;
  headingTreatment: HeadingTreatment;
  tableTreatment: TableTreatment;
  font: string;             // docx font name; pdf-lib uses Helvetica
  usePageBorderBar: boolean; // top/bottom coloured bar on pages
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: CLIENT DESIGN INPUT
// ─────────────────────────────────────────────────────────────────────────────

interface ClientDesign {
  businessName: string;
  legalName: string;
  firstName: string;
  brandColours: string;
  visualStyle: string;
  toneOfVoice: string[];
  brandIdentity: string;
  jurisdiction: string;
  documentEmail: string;
  businessPhone: string;
  businessAddress: string;
  websiteUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: COLOUR RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

function hexToToken(hex: string): ColourToken {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    : clean;
  const r = parseInt(full.substring(0, 2), 16) / 255;
  const g = parseInt(full.substring(2, 4), 16) / 255;
  const b = parseInt(full.substring(4, 6), 16) / 255;
  return { hex: `#${full}`, r, g, b, docxHex: full.toUpperCase() };
}

/** Produce a lightened tint of a colour for surface use (table row backgrounds, callouts). */
function tintHex(hex: string, factor: number): string {
  const clean = hex.replace('#', '');
  const r = Math.round(parseInt(clean.substring(0, 2), 16) * (1 - factor) + 255 * factor);
  const g = Math.round(parseInt(clean.substring(2, 4), 16) * (1 - factor) + 255 * factor);
  const b = Math.round(parseInt(clean.substring(4, 6), 16) * (1 - factor) + 255 * factor);
  return [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Parse brand colours from a free-text intake response.
 * Returns a deterministic primary/secondary/accent triple.
 */
function parseBrandColours(input: string): { primary: string; secondary: string; accent: string } {
  const defaults = { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' };
  if (!input?.trim()) return defaults;

  const hexPattern = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
  const matches = Array.from(input.matchAll(hexPattern)).map(m => m[0]);
  if (matches.length >= 3) return { primary: matches[0], secondary: matches[1], accent: matches[2] };
  if (matches.length === 2) return { primary: matches[0], secondary: matches[1], accent: matches[1] };
  if (matches.length === 1) return { primary: matches[0], secondary: defaults.secondary, accent: defaults.accent };

  const lc = input.toLowerCase();
  const colourMap: Record<string, { primary: string; secondary: string; accent: string }> = {
    navy:        { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' },
    'dark blue': { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' },
    blue:        { primary: '#1E40AF', secondary: '#3B82F6', accent: '#60A5FA' },
    green:       { primary: '#065F46', secondary: '#059669', accent: '#34D399' },
    sage:        { primary: '#4A6741', secondary: '#6B8F5B', accent: '#8FB87A' },
    gold:        { primary: '#92400E', secondary: '#B45309', accent: '#D97706' },
    red:         { primary: '#991B1B', secondary: '#DC2626', accent: '#EF4444' },
    black:       { primary: '#1A1A2E', secondary: '#374151', accent: '#6B7280' },
    purple:      { primary: '#5B21B6', secondary: '#7C3AED', accent: '#A78BFA' },
    teal:        { primary: '#0F766E', secondary: '#14B8A6', accent: '#2DD4BF' },
    coral:       { primary: '#9A3412', secondary: '#C2410C', accent: '#EA580C' },
    warm:        { primary: '#78350F', secondary: '#A16207', accent: '#CA8A04' },
    luxury:      { primary: '#1C1917', secondary: '#44403C', accent: '#78716C' },
    slate:       { primary: '#1E293B', secondary: '#334155', accent: '#64748B' },
    charcoal:    { primary: '#1F2937', secondary: '#374151', accent: '#6B7280' },
  };

  for (const [key, val] of Object.entries(colourMap)) {
    if (lc.includes(key)) return val;
  }
  return defaults;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: DESIGN SYSTEM RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve a complete DesignSystem from a ClientDesign.
 * Visual style drives heading treatment, table treatment, spacing density, and
 * typographic weight. This is where design variation is introduced systematically
 * rather than arbitrarily.
 */
function resolveDesignSystem(design: ClientDesign): DesignSystem {
  const colours = parseBrandColours(design.brandColours);
  const primary   = hexToToken(colours.primary);
  const secondary = hexToToken(colours.secondary);
  const accent    = hexToToken(colours.accent);
  const surfaceHex = tintHex(colours.primary, 0.92);
  const surface   = hexToToken(`#${surfaceHex}`);
  const bodyText  = hexToToken('#1A1A2E');
  const mutedText = hexToToken('#5A5A6E');

  const style = design.visualStyle || 'Simple — I just want it to work';

  // Type scale — varies by visual style
  const typeScales: Record<string, Partial<TypeScale>> = {
    'Clean and modern / minimal':   { displayPt: 22, h1Pt: 14, h2Pt: 12, h3Pt: 11, bodyPt: 10 },
    'Corporate and formal':         { displayPt: 20, h1Pt: 13, h2Pt: 11, h3Pt: 10.5, bodyPt: 10 },
    'Warm and friendly':            { displayPt: 22, h1Pt: 14, h2Pt: 12, h3Pt: 11, bodyPt: 10.5 },
    'Premium and luxury':           { displayPt: 24, h1Pt: 15, h2Pt: 12, h3Pt: 11, bodyPt: 10 },
    'Simple — I just want it to work': { displayPt: 20, h1Pt: 13, h2Pt: 11, h3Pt: 10.5, bodyPt: 10 },
  };

  const baseType = typeScales[style] ?? typeScales['Simple — I just want it to work'];
  const smallPt = 8;

  const type: TypeScale = {
    displayPt: baseType.displayPt!,
    h1Pt:      baseType.h1Pt!,
    h2Pt:      baseType.h2Pt!,
    h3Pt:      baseType.h3Pt!,
    bodyPt:    baseType.bodyPt!,
    smallPt,
    displayHp: baseType.displayPt! * 2,
    h1Hp:      baseType.h1Pt! * 2,
    h2Hp:      baseType.h2Pt! * 2,
    h3Hp:      baseType.h3Pt! * 2,
    bodyHp:    baseType.bodyPt! * 2,
    smallHp:   smallPt * 2,
  };

  // Spacing system — varies by visual style for intentional rhythm
  const spacingSystems: Record<string, Partial<SpacingSystem>> = {
    'Clean and modern / minimal':   { sectionBefore: 480, sectionAfter: 120, headingBefore: 360, headingAfter: 120, paragraphAfter: 120 },
    'Corporate and formal':         { sectionBefore: 400, sectionAfter: 100, headingBefore: 300, headingAfter: 100, paragraphAfter: 100 },
    'Warm and friendly':            { sectionBefore: 360, sectionAfter: 120, headingBefore: 280, headingAfter: 120, paragraphAfter: 120 },
    'Premium and luxury':           { sectionBefore: 560, sectionAfter: 160, headingBefore: 400, headingAfter: 160, paragraphAfter: 140 },
    'Simple — I just want it to work': { sectionBefore: 360, sectionAfter: 100, headingBefore: 280, headingAfter: 100, paragraphAfter: 100 },
  };

  const baseSpacing = spacingSystems[style] ?? spacingSystems['Simple — I just want it to work'];

  const spacing: SpacingSystem = {
    sectionBefore:    baseSpacing.sectionBefore!,
    sectionAfter:     baseSpacing.sectionAfter!,
    headingBefore:    baseSpacing.headingBefore!,
    headingAfter:     baseSpacing.headingAfter!,
    paragraphAfter:   baseSpacing.paragraphAfter!,
    clauseAfter:      80,
    bulletAfter:      60,
    clauseIndent:     480,
    bulletIndent:     720,
    bulletHanging:    360,
    nestedBulletIndent: 1080,
  };

  // Heading treatment — visual signature per style
  const headingTreatments: Record<string, HeadingTreatment> = {
    'Clean and modern / minimal':   'underline-accent',
    'Corporate and formal':         'left-rule',
    'Warm and friendly':            'full-rule',
    'Premium and luxury':           'capsule',
    'Simple — I just want it to work': 'plain',
  };

  // Table treatment — matched to document intent
  const tableTreatments: Record<string, TableTreatment> = {
    'Clean and modern / minimal':   'open',
    'Corporate and formal':         'ruled',
    'Warm and friendly':            'ruled',
    'Premium and luxury':           'minimalist',
    'Simple — I just want it to work': 'ruled',
  };

  // Font — Calibri is the DOCX enterprise standard; fallback to Arial
  const fonts: Record<string, string> = {
    'Clean and modern / minimal':   'Calibri',
    'Corporate and formal':         'Calibri',
    'Warm and friendly':            'Calibri',
    'Premium and luxury':           'Georgia',
    'Simple — I just want it to work': 'Calibri',
  };

  return {
    primary,
    secondary,
    accent,
    surface,
    bodyText,
    mutedText,
    type,
    spacing,
    headingTreatment: headingTreatments[style] ?? 'plain',
    tableTreatment:   tableTreatments[style] ?? 'ruled',
    font:             fonts[style] ?? 'Calibri',
    usePageBorderBar: style === 'Premium and luxury' || style === 'Corporate and formal',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: AI PROMPT ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────

const NO_MARKDOWN_INSTRUCTION = `

═══════════════════════════════════════════════════════
CRITICAL OUTPUT FORMAT — READ BEFORE GENERATING
═══════════════════════════════════════════════════════

Your response MUST be a single valid JSON object matching this DocumentModel schema.
Do NOT include any text before or after the JSON.
Do NOT wrap in markdown code fences.
Do NOT use \`\`\`json or \`\`\`.

SCHEMA:
{
  "metadata": {
    "title": "Document title",
    "subtitle": "Optional subtitle",
    "documentType": "terms_and_conditions",
    "businessName": "...",
    "jurisdiction": "England & Wales",
    "version": "May 2026",
    "date": "May 2026"
  },
  "sections": [
    {
      "id": "s1",
      "heading": "Section heading text or null",
      "headingVariant": "section | subsection | minor",
      "density": "compact | normal | airy",
      "blocks": [
        { "id": "b1", "type": "heading", "variant": "section | subsection | minor", "text": "...", "emphasis": "high | normal | subdued" },
        { "id": "b2", "type": "paragraph", "text": "...", "density": "compact | normal | airy" },
        { "id": "b3", "type": "clause", "number": "1.1", "text": "Full clause text including the number prefix." },
        { "id": "b4", "type": "bullet", "text": "Bullet item text", "level": 0 },
        { "id": "b5", "type": "table", "styleHint": "data | comparative | definition | financial", "caption": "Optional", "headers": ["Col A", "Col B"], "rows": [["val", "val"]] },
        { "id": "b6", "type": "callout", "label": "Important", "text": "Highlighted notice text." },
        { "id": "b7", "type": "signature", "parties": [{ "label": "Service Provider", "nameField": "[Name]", "dateField": "[Date]" }] },
        { "id": "b8", "type": "divider", "weight": "light | heavy" }
      ]
    }
  ]
}

RULES:
- Every block must have a unique string id (e.g. "b1", "b2", etc.)
- Use "callout" blocks for legal notices, disclaimers, and important warnings
- Use "signature" blocks for execution blocks requiring signatures
- Use "table" with styleHint "financial" for fee tables and payment schedules
- Use "table" with styleHint "definition" for GDPR processing tables
- Use "table" with styleHint "comparative" for comparison tables
- Use density "airy" for premium or luxury documents, "compact" for dense legal text
- Sections with only clauses should have density "compact"
- The introduction and definitions section should have density "normal"
- Vary section density intentionally to create visual rhythm
- Do NOT produce plain text. Every element must be in a typed block.
- Tables must have complete headers and rows — no empty cells unless intentionally blank
- All clause numbers must be correct and sequential
- No markdown syntax anywhere in text values
`;

// Document configuration
interface DocumentConfig {
  apiKey: string;
  model: string;
  systemPrompt: string;
  maxOutputTokens: number;
}

const DOCUMENT_CONFIGS: Record<string, DocumentConfig> = {
  terms_and_conditions: {
    apiKey: 'AIzaSyB1Q7FtBCOQjD5ZSH-4dAmHR74WJDIYsB0',
    model: 'gemini-2.5-flash',
    maxOutputTokens: 20000,
    systemPrompt: `You are a senior UK commercial solicitor with 20 years of experience drafting small business contracts. You have been instructed to produce a complete, legally robust, professionally formatted Terms and Conditions document for a UK-based business.

STEP 1 — READ THE BRIEF IN FULL BEFORE WRITING A SINGLE WORD.
The Master Brief is your only source of truth. Extract the following before proceeding:
- Business legal name, trading name, and registered jurisdiction (England & Wales / Scotland / Northern Ireland)
- Full address and contact details
- Exact services offered — read every service in SERVICES OFFERED WITH SCOPE BOUNDARIES
- Client type: B2B (business clients), B2C (individual consumers), or mixed
- Pricing model: hourly / project / retainer / subscription
- Exact payment terms and deposit structure
- Exact refund policy
- Accepted payment methods
- VAT registration status
- Data collected and how
- Past client issues listed in PAST CLIENT ISSUES — these trigger mandatory protective clauses
- Risk flags from RISK ASSESSMENT — address each one with a specific clause
- Tone of voice from BRAND VOICE section
- Words/phrases to avoid from that same section

STEP 2 — INDUSTRY ADAPTATION.
Identify the industry from the brief and adapt all clauses accordingly. Examples:
- Construction / trades: add site access, materials ownership, statutory compliance, Planning Act references, right to suspend works, contractor chain clauses
- Digital marketing / social media: add platform T&C dependency clause, ad spend disclaimers, no guarantee of results (impressions, leads, revenue), content approval workflow
- Coaching / consulting: add programme structure, results disclaimers, session cancellation policy, digital delivery clause
- Bookkeeping / accounting: add data accuracy obligations, client-supplied information warranty, Making Tax Digital reference, professional indemnity note
- Freelance design / creative: add revision limits, font/stock licensing, file format obligations, kill fee
- Technology / SaaS / platforms: add uptime disclaimer, data backup obligations, acceptable use policy, API usage, account termination
- Virtual assistance / admin: add confidentiality reinforcement, data access clause, working hours, out-of-scope request procedure
- E-commerce / product sales: add delivery timelines, returns policy, Consumer Rights Act 2015 rights, distance selling regulations
If the brief covers multiple service types, include all relevant industry clauses.

STEP 3 — RISK FLAG RESPONSE.
Read every issue in PAST CLIENT ISSUES AND RISK ASSESSMENT. For each:
- Non-payment / client refusing to pay → robust suspension clause, payment acceleration on breach, debt recovery costs
- Chargebacks (PayPal / card disputes) → explicit chargeback reversal fee clause (£25 administration charge), right to pursue balance via courts
- Client disappearance / abandonment → deemed acceptance clause, abandoned project fee retention rule
- Scope creep → formal written variation order procedure, additional fee schedule
- Client-caused delays → force majeure extension, extended timeline = no refund
- GDPR complaint → reinforce data processor/controller clause, ICO complaint procedure
- Client credential / security issues → explicit prohibition on sharing passwords with service provider, client sole responsibility for account security
- Missed deadlines caused by client → client dependency clause with stated consequence (timeline extends, fee unchanged)

STEP 4 — UK LEGAL FRAMEWORK.
Reference and correctly apply only the following (no US law, no fictional statutes):
- Supply of Goods and Services Act 1982, s.13 — implied term of reasonable care and skill
- Consumer Rights Act 2015 — apply only where client type includes consumers (B2C)
- Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 — 14-day cooling-off for B2C distance contracts; include waiver clause if services commence within 14 days
- Late Payment of Commercial Debts (Interest) Act 1998 — interest rate is 8% per annum ABOVE the Bank of England base rate, accruing daily; statutory debt recovery costs (£40 for debts under £1,000 / £70 for £1,000–£9,999 / £100 for £10,000+)
- Unfair Contract Terms Act 1977 — all limitation clauses must be reasonable
- Contracts (Rights of Third Parties) Act 1999 — expressly exclude third-party rights
- Limitation Act 1980 — six-year limitation period for contractual claims
- Data Protection Act 2018 / UK GDPR — reference to separate Privacy Policy; each party to comply with applicable data protection law
- Misrepresentation Act 1967 — no misrepresentation warranty from each party

STEP 5 — DOCUMENT STRUCTURE.
Produce EVERY section below as a DocumentModel JSON object. Each section becomes a JSON section object. Each numbered clause, bullet, table, heading, callout, and signature block must be its correct typed block. Do NOT omit, abbreviate, or merge sections.

Required sections (produce all):
1. INTRODUCTION AND DEFINITIONS — clause blocks
2. ACCEPTANCE AND FORMATION OF CONTRACT — clause blocks
3. DESCRIPTION OF SERVICES — clause blocks + any relevant tables
4. CLIENT OBLIGATIONS AND RESPONSIBILITIES — clause blocks
5. FEES, INVOICING, AND PAYMENT — clause + financial table for fee schedule
6. REFUND AND CANCELLATION POLICY — clause blocks
7. INTELLECTUAL PROPERTY RIGHTS — clause blocks
8. CONFIDENTIALITY — clause blocks
9. DATA PROTECTION — clause blocks + definition table for data categories if applicable
10. WARRANTIES AND DISCLAIMERS — clause blocks + callout for important disclaimers
11. LIMITATION OF LIABILITY — clause blocks + callout for liability cap
12. FORCE MAJEURE — clause blocks
13. TERMINATION — clause blocks
14. DISPUTE RESOLUTION AND GOVERNING LAW — clause blocks
15. GENERAL PROVISIONS — clause blocks
16. CONTACT DETAILS AND VERSION DATE — paragraph blocks
LEGAL DISCLAIMER — callout block

QUALITY GATE before outputting JSON:
- Business name is consistent throughout
- Payment terms match the brief exactly
- Late payment rate cited as "8% above Bank of England base rate" — NOT a fixed %
- No US terminology (no "attorney", "state law", "USA jurisdiction")
- No fictional statute references
- Every section is present and complete
- No placeholder text remains
- Jurisdiction clause present and matches brief
- All clause numbers are sequential and correct${NO_MARKDOWN_INSTRUCTION}`,
  },

  bespoke_client_contract: {
    apiKey: 'AIzaSyBt3APMr8-rRbexFnmgm-7nl7LkOQHquTY',
    model: 'gemini-2.5-flash',
    maxOutputTokens: 18000,
    systemPrompt: `You are a senior UK commercial solicitor instructed to draft a Bespoke Client Contract and Service Agreement for a specific client engagement. This is a project-specific, bilaterally signed agreement — distinct from the general Terms and Conditions.

STEP 1 — EXTRACT FROM THE BRIEF:
Read the entire Master Brief. Record:
- Exact legal name of the Service Provider and their trading name, structure, address, and jurisdiction
- Nature of the services: read SERVICES OFFERED WITH SCOPE BOUNDARIES in full
- Client type (B2B / B2C) — this changes which consumer protections apply
- Pricing model and exact payment terms
- Deposit percentage and timing
- Refund policy
- IP ownership election
- Whether subcontractors are used
- Past client issues from PAST CLIENT ISSUES — each triggers a bespoke protective clause
- Risk flags from RISK ASSESSMENT

STEP 2 — INDUSTRY ADAPTATION.
Identify the business's industry from SERVICES OFFERED section. Adapt the contract accordingly for the relevant sector. Include all protective clauses triggered by past client issues and risk flags.

STEP 3 — UK LEGAL FRAMEWORK (apply correctly, cite only real statutes):
- Supply of Goods and Services Act 1982, s.13
- Consumer Rights Act 2015 — apply only if Client is a consumer
- Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013
- Late Payment of Commercial Debts (Interest) Act 1998 — interest at 8% above Bank of England base rate
- Contracts (Rights of Third Parties) Act 1999 — excluded
- Limitation Act 1980 — six-year claim period
- Data Protection Act 2018 / UK GDPR

STEP 4 — DOCUMENT STRUCTURE as a DocumentModel JSON object.
Required sections:
- PARTIES — paragraph blocks with field placeholders in [BRACKETS]
- RECITALS — paragraph blocks
- INCORPORATION OF GENERAL TERMS — clause blocks
- SERVICES AND SCOPE OF WORK — clause blocks per service; table block for scope comparison if multiple services
- DELIVERABLES — clause blocks
- TIMELINE AND MILESTONES — clause blocks; table block for milestone schedule
- FEES AND PAYMENT — clause blocks; financial table block for fee schedule
- REFUND AND CANCELLATION — clause blocks
- INTELLECTUAL PROPERTY — clause blocks
- CONFIDENTIALITY — clause blocks
- DATA PROTECTION — clause blocks
- WARRANTIES — clause blocks
- LIMITATION OF LIABILITY — clause blocks; callout for cap notice
- TERMINATION — clause blocks
- DISPUTE RESOLUTION AND GOVERNING LAW — clause blocks
- SIGNATURE — signature block with two parties

Vary section density: use "airy" for parties/recitals, "compact" for detailed clause sections, "normal" for mid-length sections.

QUALITY GATE: verify all clause numbers are sequential, payment terms match brief, late payment cited correctly as "8% above Bank of England base rate", jurisdiction present, no US terminology.${NO_MARKDOWN_INSTRUCTION}`,
  },

  gdpr_privacy_policy: {
    apiKey: 'AIzaSyAIcCl8IzLaLIOXGZusfES_vU12EHg0qAo',
    model: 'gemini-2.5-flash',
    maxOutputTokens: 16000,
    systemPrompt: `You are a UK data protection lawyer and ICO-accredited practitioner. Draft a comprehensive, legally compliant Privacy Notice for a UK sole trader or small business.

CRITICAL: DO NOT INVENT DATA PRACTICES. Every data category, third-party tool, collection method, and storage location must come directly from the brief.

STEP 1 — EXTRACT ALL DATA FACTS FROM THE BRIEF:
- What personal data is collected (specific types)
- How data is collected (exact methods from brief)
- Why each data type is collected (specific purposes)
- Where data is stored (named platforms from brief)
- Retention period (exact from brief)
- Third-party tools named in brief only
- Whether email marketing is sent and which platform
- Whether a website exists with cookies or tracking tools

STEP 2 — LAWFUL BASIS ANALYSIS.
For each processing activity, assign the correct lawful basis under Article 6 UK GDPR. Use "definition" table blocks for the processing activity table.

STEP 3 — UK LEGAL FRAMEWORK.
UK General Data Protection Regulation (UK GDPR), Data Protection Act 2018, PECR 2003. ICO is the UK regulatory authority. Always say "UK GDPR" not just "GDPR".

STEP 4 — OUTPUT as a DocumentModel JSON object.
Required sections:
- ABOUT THIS NOTICE AND WHO WE ARE — paragraph blocks
- WHAT PERSONAL DATA WE COLLECT — bullet blocks per data category
- HOW WE COLLECT YOUR PERSONAL DATA — bullet blocks
- WHY WE USE YOUR PERSONAL DATA (PURPOSES AND LEGAL BASIS) — definition table block (Purpose | Data Used | Legal Basis | Retention) + paragraph on legitimate interests
- WHO WE SHARE YOUR PERSONAL DATA WITH — bullet blocks per third party from brief only
- INTERNATIONAL DATA TRANSFERS — paragraph blocks
- HOW LONG WE KEEP YOUR PERSONAL DATA — clause blocks
- YOUR RIGHTS UNDER UK GDPR — bullet blocks for each Article right (15–22)
- COOKIES AND TRACKING TECHNOLOGIES — paragraph based on brief's cookie answer
- EMAIL MARKETING — paragraph blocks (only if brief confirms)
- SECURITY OF YOUR PERSONAL DATA — bullet blocks
- CHILDREN'S DATA — paragraph
- THIRD-PARTY WEBSITES AND LINKS — paragraph
- CHANGES TO THIS PRIVACY NOTICE — paragraph
- HOW TO COMPLAIN — paragraph + callout with ICO contact details
- HOW TO CONTACT US — paragraph

Use "callout" blocks for ICO complaint rights and important data subject rights notices.

QUALITY GATE: only data categories from brief included; lawful basis correct; retention matches brief; ICO correctly identified; UK GDPR cited not EU GDPR; no invented compliance claims.${NO_MARKDOWN_INSTRUCTION}`,
  },

  professional_bio: {
    apiKey: 'AIzaSyC-NGcz8H_s4q9XiKsa_HSE-eBE-dwCMfo',
    model: 'gemini-2.5-flash',
    maxOutputTokens: 8000,
    systemPrompt: `You are an elite personal branding copywriter. Write three professional bios — short (50 words), medium (150 words), long (350 words) — based on the Master Brief.

Apply tone exactly as briefed. Do not use "passionate about", "journey", "delighted to", "helping businesses thrive". Never use words flagged in the brief.

OUTPUT as a DocumentModel JSON object with three sections:
- Section 1: heading "Short Bio — 50 Words", then a single paragraph block with the bio text
- Section 2: heading "Medium Bio — 150 Words", then paragraph blocks
- Section 3: heading "Long Bio — 350 Words", then paragraph blocks (broken into natural paragraphs, each as a separate paragraph block)

Each section has its own headingVariant "section". Use density "airy" for premium/luxury tone, "normal" for others.

QUALITY GATE: tone matches brief exactly; no forbidden words; each version works standalone; differentiator stated in all three.${NO_MARKDOWN_INSTRUCTION}`,
  },

  elevator_pitch: {
    apiKey: 'AIzaSyCZ9GYM4YS2fUoyETb3yclqfUpWYw79SoI',
    model: 'gemini-2.5-flash',
    maxOutputTokens: 8000,
    systemPrompt: `You are a specialist pitch coach and commercial copywriter. Produce four elevator pitches based on the Master Brief.

OUTPUT as a DocumentModel JSON object with four sections:
- Section 1: "15-Second Spoken Pitch (40–50 words)" — paragraph block
- Section 2: "30-Second Spoken Pitch (80–95 words)" — paragraph block
- Section 3: "60-Second Spoken Pitch (140–165 words)" — paragraph blocks
- Section 4: "Written Pitch — For Email, Proposal, or Website (80–120 words)" — paragraph block

Each section has headingVariant "section". Use a callout block at the start of each section with the context/purpose of that pitch version.

Never use: "passionate about", "leverage", "synergy", "game-changer". Honour all forbidden phrases from brief.${NO_MARKDOWN_INSTRUCTION}`,
  },

  linkedin_script: {
    apiKey: 'AIzaSyDYhe8vw5NC68ehoRNwa8G5MG7Fp0cVc_k',
    model: 'gemini-2.5-flash',
    maxOutputTokens: 10000,
    systemPrompt: `You are a LinkedIn optimisation strategist. Produce a complete LinkedIn profile optimisation script based on the Master Brief.

OUTPUT as a DocumentModel JSON object with these sections:
- KEYWORD STRATEGY — bullet blocks for 12–18 keywords, grouped by type
- LINKEDIN HEADLINE (220 chars max) — three paragraph blocks labelled Option A, B, C; use a callout for the character limit reminder
- ABOUT SECTION (2,600 chars max) — paragraph blocks; a callout at the end with the character count
- EXPERIENCE SECTION — bullet blocks (5–7 action-verb bullets for current role)
- SKILLS SECTION — bullet blocks grouped: Hard Skills, Soft Skills
- FEATURED SECTION RECOMMENDATIONS — three paragraph blocks, each explaining one recommendation
- BANNER TAGLINE TEXT — two paragraph blocks
- CONNECTION AND GROWTH STRATEGY — paragraph blocks with tactical advice

Use headingVariant "section" for main headings, "subsection" for sub-sections. Use density "compact" for keyword and skills sections, "normal" elsewhere.${NO_MARKDOWN_INSTRUCTION}`,
  },

  professional_invoice_template: {
    apiKey: 'AIzaSyB0oQ393qZc6hivOx-GPLIHRYxIWJwLWxk',
    model: 'gemini-2.5-flash',
    maxOutputTokens: 6000,
    systemPrompt: `You are a UK business finance specialist. Produce a professional invoice template as a DocumentModel JSON object.

The invoice must include:
- Business info section (from brief): name, address, phone, email, website, VAT number if registered
- Invoice header fields: invoice number, date, due date, PO number
- Bill To placeholders in [BRACKET] format
- Line items table with styleHint "financial": columns Description | Quantity | Unit Price | Amount
- Totals table with styleHint "financial": Subtotal, VAT (if applicable), Total Due
- Payment Instructions section with all methods from brief
- Bank transfer details if bank transfer is an accepted method
- Late payment clause as a callout block: "8% per annum above the Bank of England base rate"
- Notes section
- Footer paragraph

Use "financial" styleHint on all monetary tables. Use "callout" for the late payment clause.
All placeholder fields the user must complete use [PLACEHOLDER_NAME] format.

QUALITY GATE: late payment states "8% above Bank of England base rate" not a fixed %; VAT shown only if brief confirms registration; payment methods match brief exactly.${NO_MARKDOWN_INSTRUCTION}`,
  },

  welcome_email: {
    apiKey: 'AIzaSyBML6AdJ2ESfbza8Z4qkUZ7fDFCRj-Mlhw',
    model: 'gemini-2.5-flash',
    maxOutputTokens: 8000,
    systemPrompt: `You are an expert in client onboarding communications. Write three complete welcome emails based on the Master Brief.

OUTPUT as a DocumentModel JSON object with three sections:

Section 1: "Email 1 — Immediate Welcome and Confirmation"
- callout block with: Subject: [subject line]
- paragraph blocks for the full email body (each paragraph as a separate block)
- density: "airy"

Section 2: "Email 2 — Contract, Onboarding, and Next Steps"
- callout block with: Subject: [subject line]
- paragraph blocks for body
- bullet blocks for the onboarding checklist
- density: "normal"

Section 3: "Email 3 — Value-Add and Relationship Deepener"
- callout block with: Subject: [subject line]
- paragraph blocks for body
- density: "airy"

Tone must match brief exactly. No template gaps. No forbidden words.${NO_MARKDOWN_INSTRUCTION}`,
  },

  late_payment_letters: {
    apiKey: 'AIzaSyDgIVttAJtekRQe15o8cmQhfHNCAlphKDPo',
    model: 'gemini-2.5-flash',
    maxOutputTokens: 10000,
    systemPrompt: `You are a UK commercial debt recovery specialist. Draft a three-letter graduated late payment sequence for a UK sole trader or small business.

Apply the Late Payment of Commercial Debts (Interest) Act 1998 correctly:
- Interest at 8% per annum ABOVE the Bank of England base rate (never state as a fixed %)
- Statutory recovery costs: £40 (under £1,000), £70 (£1,000–£9,999), £100 (£10,000+)
- Letter 3 must comply with the Pre-Action Protocol for Debt Claims under the CPR

Tone escalation: Letter 1 = courteous. Letter 2 = firm and formal. Letter 3 = legal Pre-Action Notice.

OUTPUT as a DocumentModel JSON object with three sections:

Section 1: heading "Letter 1 — Friendly Payment Reminder"
- density: "airy"
- callout block with: Re: Invoice [Invoice Number] — Payment Reminder
- paragraph blocks for the full letter body
- paragraph for sign-off

Section 2: heading "Letter 2 — Formal Demand with Statutory Interest Notice"
- density: "normal"
- callout block with: Re: Invoice [Invoice Number] — OVERDUE — Formal Payment Request
- paragraph blocks for the full letter body including statutory interest notice
- paragraph for sign-off

Section 3: heading "Letter 3 — Letter Before Action (Pre-Action Protocol Notice)"
- density: "compact"
- callout with label "LETTER BEFORE ACTION" for the formal header
- paragraph blocks for all six required paragraphs (the debt, basis, total now due, compliance period, consequences, payment instructions)
- financial table block for the total calculation: Original Amount | Accrued Interest | Statutory Recovery Charge | TOTAL NOW DUE
- paragraph for sign-off

Use [BRACKETED FIELDS] for all amounts, dates, and names that vary by invoice.
No unlawful threats. No criminal action threats. County Court for E&W; Sheriff Court for Scotland.${NO_MARKDOWN_INSTRUCTION}`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: GEMINI API CLIENT
// ─────────────────────────────────────────────────────────────────────────────

async function callGemini(
  config: DocumentConfig,
  briefContent: string
): Promise<DocumentModel> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

  const userMessage = `Here is the client's Master Brief:\n\n${briefContent}\n\nBased on this brief, generate the document as a DocumentModel JSON object as instructed.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: config.systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: config.maxOutputTokens,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText.substring(0, 400)}`);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error('No text content in Gemini response');

  // Strip any accidental markdown fences
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const model = JSON.parse(cleaned) as DocumentModel;
    return model;
  } catch (parseErr: any) {
    // Attempt partial extraction if outer JSON is malformed
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        return JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1)) as DocumentModel;
      } catch {}
    }
    throw new Error(`Failed to parse DocumentModel JSON: ${parseErr.message}. Raw (first 500): ${cleaned.substring(0, 500)}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: DOCX RENDERER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The DOCX renderer is the primary, first-class renderer.
 * Every design decision is driven by the DesignSystem object.
 * No values are hardcoded in this function.
 *
 * A4 page: 11906 × 16838 DXA
 * Margins: 1270 DXA (≈0.88 inch) top/bottom, 1134 DXA (≈0.79 inch) left/right
 * Content width: 11906 − 2268 = 9638 DXA
 */
const PAGE_WIDTH_DXA  = 11906;
const MARGIN_TOP_DXA  = 1270;
const MARGIN_BTM_DXA  = 1270;
const MARGIN_H_DXA    = 1134;
const CONTENT_W_DXA   = PAGE_WIDTH_DXA - (MARGIN_H_DXA * 2); // 9638

function renderDocx(model: DocumentModel, ds: DesignSystem, displayName: string): Uint8Array {
  const sections: Paragraph[] = [];

  // ── Cover / title block ──
  sections.push(...renderCover(model.metadata, ds, displayName));

  // ── Section and block rendering ──
  for (const section of model.sections) {
    sections.push(...renderSection(section, ds));
  }

  // ── Numbering config for bullets (required by docx skill) ──
  const doc = new DocxDocument({
    creator: 'Foundationary',
    title: model.metadata.title,
    description: `${model.metadata.title} — ${model.metadata.businessName}`,

    // Global style overrides
    styles: {
      default: {
        document: {
          run: {
            font: ds.font,
            size: ds.type.bodyHp,
            color: ds.bodyText.docxHex,
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: ds.type.h1Hp, bold: true, font: ds.font, color: ds.primary.docxHex },
          paragraph: {
            spacing: { before: ds.spacing.sectionBefore, after: ds.spacing.headingAfter },
            outlineLevel: 0,
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: ds.type.h2Hp, bold: true, font: ds.font, color: ds.secondary.docxHex },
          paragraph: {
            spacing: { before: ds.spacing.headingBefore, after: ds.spacing.headingAfter },
            outlineLevel: 1,
          },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: ds.type.h3Hp, bold: true, font: ds.font, color: ds.secondary.docxHex },
          paragraph: {
            spacing: { before: 200, after: 80 },
            outlineLevel: 2,
          },
        },
      ],
    },

    numbering: {
      config: [
        {
          reference: 'bullets-l0',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: {
                run: { font: 'Symbol', size: ds.type.bodyHp },
                paragraph: {
                  indent: { left: ds.spacing.bulletIndent, hanging: ds.spacing.bulletHanging },
                  spacing: { after: ds.spacing.bulletAfter },
                },
              },
            },
          ],
        },
        {
          reference: 'bullets-l1',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u25E6',
              alignment: AlignmentType.LEFT,
              style: {
                run: { font: 'Courier New', size: ds.type.bodyHp - 2 },
                paragraph: {
                  indent: { left: ds.spacing.nestedBulletIndent, hanging: ds.spacing.bulletHanging },
                  spacing: { after: ds.spacing.bulletAfter },
                },
              },
            },
          ],
        },
      ],
    },

    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH_DXA, height: 16838 },
            margin: {
              top:    MARGIN_TOP_DXA,
              bottom: MARGIN_BTM_DXA,
              left:   MARGIN_H_DXA,
              right:  MARGIN_H_DXA,
            },
          },
        },
        headers: { default: buildHeader(model.metadata, ds) },
        footers: { default: buildFooter(ds) },
        children: sections,
      },
    ],
  });

  return Packer.toBuffer(doc) as unknown as Uint8Array;
}

// ── Cover block ──

function renderCover(meta: DocumentMetadata, ds: DesignSystem, displayName: string): Paragraph[] {
  const out: Paragraph[] = [];

  // Top accent bar — implemented as paragraph border (NOT a table, per docx skill rules)
  if (ds.usePageBorderBar) {
    out.push(new Paragraph({
      children: [],
      border: { top: { style: BorderStyle.SINGLE, size: 24, color: ds.primary.docxHex, space: 0 } },
      spacing: { before: 0, after: 240 },
    }));
  }

  // Document title
  out.push(new Paragraph({
    children: [new TextRun({
      text: meta.title,
      font: ds.font,
      size: ds.type.displayHp,
      bold: true,
      color: ds.primary.docxHex,
    })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
  }));

  // Subtitle
  if (meta.subtitle) {
    out.push(new Paragraph({
      children: [new TextRun({
        text: meta.subtitle,
        font: ds.font,
        size: ds.type.h2Hp,
        color: ds.secondary.docxHex,
        italics: true,
      })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
    }));
  }

  // "Prepared for" line
  out.push(new Paragraph({
    children: [new TextRun({
      text: `Prepared for ${displayName}`,
      font: ds.font,
      size: ds.type.bodyHp,
      color: ds.mutedText.docxHex,
      italics: true,
    })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
  }));

  // Foundationary + date
  out.push(new Paragraph({
    children: [new TextRun({
      text: `Foundationary  |  ${meta.date}`,
      font: ds.font,
      size: ds.type.smallHp,
      color: ds.mutedText.docxHex,
    })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
  }));

  // Cover rule — varies by heading treatment
  out.push(...renderHRule(ds, 'heavy'));

  return out;
}

// ── Section renderer ──

function renderSection(section: DocumentSection, ds: DesignSystem): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];

  if (section.heading) {
    out.push(...renderHeadingParagraph(
      section.heading,
      section.headingVariant ?? 'section',
      ds,
      section.emphasis ?? 'normal'
    ));
  }

  for (const block of section.blocks) {
    const rendered = renderBlock(block, ds, section.density);
    out.push(...rendered);
  }

  return out;
}

// ── Block dispatcher ──

function renderBlock(
  block: DocumentBlock,
  ds: DesignSystem,
  sectionDensity?: BlockDensity
): (Paragraph | Table)[] {
  const density = block.density ?? sectionDensity ?? 'normal';

  switch (block.type) {
    case 'heading':
      return renderHeadingParagraph(block.text, block.variant, ds, block.emphasis ?? 'normal');
    case 'paragraph':
      return [renderParagraphBlock(block, ds, density)];
    case 'clause':
      return [renderClauseBlock(block, ds, density)];
    case 'bullet':
      return [renderBulletBlock(block, ds)];
    case 'table':
      return [renderTableBlock(block, ds)];
    case 'callout':
      return renderCalloutBlock(block, ds);
    case 'signature':
      return renderSignatureBlock(block, ds);
    case 'divider':
      return renderHRule(ds, block.weight);
    default:
      return [];
  }
}

// ── Heading renderer — visual treatment per DesignSystem ──

function renderHeadingParagraph(
  text: string,
  variant: HeadingVariant,
  ds: DesignSystem,
  emphasis: EmphasisLevel
): Paragraph[] {
  const out: Paragraph[] = [];

  const levelMap: Record<HeadingVariant, { heading: HeadingLevel; sizeHp: number; colour: string }> = {
    section:    { heading: HeadingLevel.HEADING_1, sizeHp: ds.type.h1Hp, colour: ds.primary.docxHex },
    subsection: { heading: HeadingLevel.HEADING_2, sizeHp: ds.type.h2Hp, colour: ds.secondary.docxHex },
    minor:      { heading: HeadingLevel.HEADING_3, sizeHp: ds.type.h3Hp, colour: ds.secondary.docxHex },
  };

  const lv = levelMap[variant] ?? levelMap.section;

  // Spacing before varies by variant and emphasis
  const spacingBefore = variant === 'section'
    ? ds.spacing.sectionBefore
    : variant === 'subsection'
    ? ds.spacing.headingBefore
    : 200;

  const spacingAfter = variant === 'section'
    ? ds.spacing.headingAfter
    : 80;

  // Treatment-specific rendering
  switch (ds.headingTreatment) {
    case 'capsule':
      // Coloured background band — paragraph with shading
      out.push(new Paragraph({
        children: [new TextRun({ text, font: ds.font, size: lv.sizeHp, bold: true, color: 'FFFFFF' })],
        heading: lv.heading,
        shading: { type: ShadingType.CLEAR, fill: ds.primary.docxHex },
        spacing: { before: spacingBefore, after: spacingAfter },
        indent: { left: 120, right: 120 },
      }));
      break;

    case 'left-rule':
      // Paragraph with left border
      out.push(new Paragraph({
        children: [new TextRun({ text: `  ${text}`, font: ds.font, size: lv.sizeHp, bold: true, color: lv.colour })],
        heading: lv.heading,
        border: { left: { style: BorderStyle.SINGLE, size: variant === 'section' ? 24 : 12, color: ds.accent.docxHex, space: 4 } },
        spacing: { before: spacingBefore, after: spacingAfter },
      }));
      break;

    case 'full-rule':
      // Heading + bottom border
      out.push(new Paragraph({
        children: [new TextRun({ text, font: ds.font, size: lv.sizeHp, bold: true, color: lv.colour })],
        heading: lv.heading,
        border: { bottom: { style: BorderStyle.SINGLE, size: variant === 'section' ? 6 : 3, color: ds.accent.docxHex, space: 1 } },
        spacing: { before: spacingBefore, after: spacingAfter },
      }));
      break;

    case 'underline-accent':
      // Heading text + separate thin accent rule below
      out.push(new Paragraph({
        children: [new TextRun({ text, font: ds.font, size: lv.sizeHp, bold: true, color: lv.colour })],
        heading: lv.heading,
        spacing: { before: spacingBefore, after: 40 },
      }));
      if (variant === 'section') {
        // A thin rule with accent colour beneath
        out.push(new Paragraph({
          children: [],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ds.accent.docxHex, space: 1 } },
          spacing: { before: 0, after: spacingAfter },
        }));
      }
      break;

    case 'plain':
    default:
      out.push(new Paragraph({
        children: [new TextRun({ text, font: ds.font, size: lv.sizeHp, bold: true, color: lv.colour })],
        heading: lv.heading,
        spacing: { before: spacingBefore, after: spacingAfter },
      }));
  }

  return out;
}

// ── Paragraph block ──

function renderParagraphBlock(block: ParagraphBlock, ds: DesignSystem, density: BlockDensity): Paragraph {
  const afterMap: Record<BlockDensity, number> = { compact: 60, normal: 120, airy: 180 };
  return new Paragraph({
    children: [new TextRun({ text: block.text, font: ds.font, size: ds.type.bodyHp, color: ds.bodyText.docxHex })],
    spacing: { after: afterMap[density], line: density === 'airy' ? 360 : density === 'compact' ? 240 : 276, lineRule: 'auto' },
    alignment: AlignmentType.JUSTIFIED,
  });
}

// ── Clause block ──

function renderClauseBlock(block: ClauseBlock, ds: DesignSystem, density: BlockDensity): Paragraph {
  // The clause text may or may not include the number prefix; normalise it.
  const numberPrefix = block.number ? `${block.number}.  ` : '';
  const fullText = block.text.startsWith(block.number ?? '') ? block.text : `${numberPrefix}${block.text}`;

  const afterMap: Record<BlockDensity, number> = { compact: 40, normal: 80, airy: 120 };

  return new Paragraph({
    children: [new TextRun({ text: fullText, font: ds.font, size: ds.type.bodyHp, color: ds.bodyText.docxHex })],
    indent: { left: ds.spacing.clauseIndent, hanging: ds.spacing.clauseIndent },
    spacing: { after: afterMap[density], line: 276, lineRule: 'auto' },
    alignment: AlignmentType.JUSTIFIED,
  });
}

// ── Bullet block ──

function renderBulletBlock(block: BulletBlock, ds: DesignSystem): Paragraph {
  const ref = (block.level ?? 0) === 0 ? 'bullets-l0' : 'bullets-l1';
  return new Paragraph({
    children: [new TextRun({ text: block.text, font: ds.font, size: ds.type.bodyHp, color: ds.bodyText.docxHex })],
    numbering: { reference: ref, level: 0 },
    spacing: { after: ds.spacing.bulletAfter },
  });
}

// ── Table block — treatment varies by styleHint and DesignSystem.tableTreatment ──

function renderTableBlock(block: TableBlock, ds: DesignSystem): Table {
  if (!block.headers?.length || !block.rows?.length) {
    // Degenerate table — return a minimal single-cell table
    return new Table({
      width: { size: CONTENT_W_DXA, type: WidthType.DXA },
      columnWidths: [CONTENT_W_DXA],
      rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [] })] })] })],
    });
  }

  const colCount = block.headers.length;
  const colWidth = Math.floor(CONTENT_W_DXA / colCount);
  const columnWidths = Array(colCount).fill(colWidth);
  // Adjust last column for rounding
  columnWidths[colCount - 1] = CONTENT_W_DXA - colWidth * (colCount - 1);

  const isFinancial = block.styleHint === 'financial';
  const isDefinition = block.styleHint === 'definition';

  // Determine border style by treatment
  const borderDef = (colour: string, size = 4): object =>
    ({ style: BorderStyle.SINGLE, size, color: colour });

  const outerBorder = ds.tableTreatment === 'minimalist'
    ? borderDef(ds.mutedText.docxHex, 2)
    : ds.tableTreatment === 'open'
    ? { style: BorderStyle.NONE }
    : borderDef(ds.primary.docxHex, 6);

  const innerHBorder = ds.tableTreatment === 'ruled'
    ? borderDef('CCCCCC', 2)
    : ds.tableTreatment === 'open'
    ? borderDef('E0E0E0', 1)
    : borderDef('E5E5E5', 1);

  const innerVBorder = ds.tableTreatment === 'ruled' || ds.tableTreatment === 'financial'
    ? borderDef('DDDDDD', 2)
    : { style: BorderStyle.NONE };

  // Header row
  const headerCells = block.headers.map((h, i) => {
    const isRightCol = isFinancial && i > 0;
    return new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: h, font: ds.font, size: ds.type.bodyHp, bold: true, color: 'FFFFFF' })],
        alignment: isRightCol ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { after: 0 },
      })],
      width: { size: columnWidths[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: ds.primary.docxHex },
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      borders: {
        top:    outerBorder as any,
        bottom: outerBorder as any,
        left:   i === 0 ? outerBorder as any : innerVBorder as any,
        right:  i === colCount - 1 ? outerBorder as any : innerVBorder as any,
      },
    });
  });

  const tableRows: TableRow[] = [
    new TableRow({ children: headerCells, tableHeader: true }),
  ];

  // Data rows
  block.rows.forEach((row, rowIdx) => {
    const altShading = rowIdx % 2 === 0
      ? (ds.tableTreatment === 'minimalist' || ds.tableTreatment === 'open' ? 'FFFFFF' : ds.surface.docxHex)
      : 'FFFFFF';

    const isLastRow = rowIdx === block.rows.length - 1 && isFinancial;

    const cells = block.headers.map((_, i) => {
      const cellText = row[i] ?? '';
      const isRightCol = isFinancial && i > 0;
      const isTotalCell = isLastRow;

      return new TableCell({
        children: [new Paragraph({
          children: [new TextRun({
            text: cellText,
            font: isFinancial ? 'Courier New' : ds.font,
            size: ds.type.bodyHp,
            bold: isTotalCell,
            color: isTotalCell ? ds.primary.docxHex : ds.bodyText.docxHex,
          })],
          alignment: isRightCol ? AlignmentType.RIGHT : AlignmentType.LEFT,
          spacing: { after: 0 },
        })],
        width: { size: columnWidths[i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: isTotalCell ? ds.surface.docxHex : altShading },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        borders: {
          top:    rowIdx === 0 ? outerBorder as any : innerHBorder as any,
          bottom: rowIdx === block.rows.length - 1 ? outerBorder as any : innerHBorder as any,
          left:   i === 0 ? outerBorder as any : innerVBorder as any,
          right:  i === colCount - 1 ? outerBorder as any : innerVBorder as any,
        },
      });
    });

    tableRows.push(new TableRow({ children: cells }));
  });

  return new Table({
    width: { size: CONTENT_W_DXA, type: WidthType.DXA },
    columnWidths,
    rows: tableRows,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
  });
}

// ── Callout block — shaded notice box ──

function renderCalloutBlock(block: CalloutBlock, ds: DesignSystem): Paragraph[] {
  const out: Paragraph[] = [];

  if (block.label) {
    out.push(new Paragraph({
      children: [new TextRun({ text: block.label.toUpperCase(), font: ds.font, size: ds.type.smallHp + 2, bold: true, color: ds.primary.docxHex })],
      spacing: { before: 120, after: 40 },
      border: { left: { style: BorderStyle.SINGLE, size: 16, color: ds.accent.docxHex, space: 4 } },
      indent: { left: 200 },
      shading: { type: ShadingType.CLEAR, fill: ds.surface.docxHex },
    }));
  }

  out.push(new Paragraph({
    children: [new TextRun({ text: block.text, font: ds.font, size: ds.type.bodyHp, color: ds.bodyText.docxHex })],
    spacing: { before: block.label ? 0 : 120, after: 120 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 16, color: ds.accent.docxHex, space: 4 },
      ...(block.label ? {} : {}),
    },
    indent: { left: 200 },
    shading: { type: ShadingType.CLEAR, fill: ds.surface.docxHex },
  }));

  return out;
}

// ── Signature block ──

function renderSignatureBlock(block: SignatureBlock, ds: DesignSystem): Paragraph[] {
  const out: Paragraph[] = [];

  out.push(...renderHRule(ds, 'light'));

  for (const party of block.parties) {
    out.push(new Paragraph({
      children: [new TextRun({ text: party.label, font: ds.font, size: ds.type.bodyHp, bold: true, color: ds.primary.docxHex })],
      spacing: { before: 240, after: 80 },
    }));

    out.push(new Paragraph({
      children: [
        new TextRun({ text: 'Signed: ', font: ds.font, size: ds.type.bodyHp, bold: true, color: ds.bodyText.docxHex }),
        new TextRun({ text: '_______________________________', font: ds.font, size: ds.type.bodyHp, color: ds.mutedText.docxHex }),
      ],
      spacing: { before: 0, after: 60 },
    }));

    out.push(new Paragraph({
      children: [
        new TextRun({ text: 'Name: ', font: ds.font, size: ds.type.bodyHp, bold: true, color: ds.bodyText.docxHex }),
        new TextRun({ text: party.nameField, font: ds.font, size: ds.type.bodyHp, color: ds.mutedText.docxHex }),
      ],
      spacing: { before: 0, after: 60 },
    }));

    out.push(new Paragraph({
      children: [
        new TextRun({ text: 'Date: ', font: ds.font, size: ds.type.bodyHp, bold: true, color: ds.bodyText.docxHex }),
        new TextRun({ text: party.dateField, font: ds.font, size: ds.type.bodyHp, color: ds.mutedText.docxHex }),
      ],
      spacing: { before: 0, after: 200 },
    }));
  }

  return out;
}

// ── Horizontal rule ──

function renderHRule(ds: DesignSystem, weight: 'light' | 'heavy'): Paragraph[] {
  const size = weight === 'heavy' ? 12 : 3;
  const colour = weight === 'heavy' ? ds.primary.docxHex : ds.accent.docxHex;
  return [new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.SINGLE, size, color: colour, space: 1 } },
    spacing: { before: 160, after: 240 },
  })];
}

// ── Header / Footer construction ──

function buildHeader(meta: DocumentMetadata, ds: DesignSystem): Header {
  return new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: meta.businessName, font: ds.font, size: ds.type.smallHp * 2, bold: true, color: ds.primary.docxHex }),
          new TextRun({ text: '  |  ', font: ds.font, size: ds.type.smallHp * 2, color: ds.mutedText.docxHex }),
          new TextRun({ text: meta.title, font: ds.font, size: ds.type.smallHp * 2, italics: true, color: ds.mutedText.docxHex }),
        ],
        alignment: AlignmentType.LEFT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: ds.accent.docxHex, space: 1 } },
        spacing: { after: 0 },
      }),
    ],
  });
}

function buildFooter(ds: DesignSystem): Footer {
  // Tab stop at content right edge for right-aligned page number
  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: 'Generated by Foundationary  |  Confidential', font: ds.font, size: ds.type.smallHp * 2, color: ds.mutedText.docxHex }),
          new TextRun({ text: '\t', font: ds.font }),
          new TextRun({ text: 'Page ', font: ds.font, size: ds.type.smallHp * 2, color: ds.mutedText.docxHex }),
          new PageNumber() as unknown as TextRun,
        ],
        border: { top: { style: BorderStyle.SINGLE, size: 3, color: ds.accent.docxHex, space: 1 } },
        spacing: { before: 0 },
        tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_W_DXA }],
      }),
    ],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9: PDF FALLBACK RENDERER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PDF is generated from the DocumentModel using pdf-lib.
 * This is a fallback renderer — it produces a clean, readable PDF when
 * LibreOffice conversion is unavailable. It does not attempt to replicate
 * the full typographic fidelity of the DOCX; instead it renders a
 * professionally structured document faithful to the DesignSystem's colour
 * tokens and spacing rhythm.
 *
 * For production scenarios where maximum PDF quality is required, convert
 * the DOCX to PDF via LibreOffice headless in a separate process.
 */
async function renderPdf(model: DocumentModel, ds: DesignSystem, displayName: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font     = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItal = await doc.embedFont(StandardFonts.HelveticaOblique);

  const [pw, ph] = PageSizes.A4;
  const mTop = 72; const mBottom = 60; const mH = 72;
  const cw = pw - mH * 2;

  const primary  = rgb(ds.primary.r, ds.primary.g, ds.primary.b);
  const secondary = rgb(ds.secondary.r, ds.secondary.g, ds.secondary.b);
  const accent   = rgb(ds.accent.r, ds.accent.g, ds.accent.b);
  const body     = rgb(ds.bodyText.r, ds.bodyText.g, ds.bodyText.b);
  const muted    = rgb(ds.mutedText.r, ds.mutedText.g, ds.mutedText.b);
  const surface  = rgb(ds.surface.r, ds.surface.g, ds.surface.b);

  const lhNormal  = ds.type.bodyPt * 1.5;
  const lhCompact = ds.type.bodyPt * 1.3;
  const lhAiry    = ds.type.bodyPt * 1.7;

  let page = doc.addPage(PageSizes.A4);
  let y = ph - mTop;

  function newPage() {
    page = doc.addPage(PageSizes.A4);
    y = ph - mTop - 24; // account for header
  }

  function ensureSpace(needed: number) {
    if (y - needed < mBottom + 30) newPage();
  }

  function wrapText(text: string, f: any, fSize: number, maxW: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (f.widthOfTextAtSize(test, fSize) > maxW && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function drawLine(lines: string[], f: any, fSize: number, x: number, lineH: number, colour: any) {
    for (const l of lines) {
      ensureSpace(lineH * 2);
      page.drawText(l, { x, y, size: fSize, font: f, color: colour });
      y -= lineH;
    }
  }

  function hRule(colour: any, thickness = 0.75) {
    page.drawLine({ start: { x: mH, y }, end: { x: pw - mH, y }, thickness, color: colour });
    y -= 8;
  }

  // Cover
  if (ds.usePageBorderBar) {
    page.drawRectangle({ x: 0, y: ph - 5, width: pw, height: 5, color: primary });
  }

  y = ph - mTop - 10;
  const titleLines = wrapText(model.metadata.title, fontBold, ds.type.h1Pt, cw);
  for (const l of titleLines) {
    const tw = fontBold.widthOfTextAtSize(l, ds.type.h1Pt);
    page.drawText(l, { x: (pw - tw) / 2, y, size: ds.type.h1Pt, font: fontBold, color: primary });
    y -= ds.type.h1Pt * 1.4;
  }

  const prepStr = `Prepared for ${displayName}`;
  const prepW = fontItal.widthOfTextAtSize(prepStr, ds.type.bodyPt);
  page.drawText(prepStr, { x: (pw - prepW) / 2, y, size: ds.type.bodyPt, font: fontItal, color: muted });
  y -= ds.type.bodyPt * 1.6;

  const brandStr = `Foundationary  |  ${model.metadata.date}`;
  const brandW = font.widthOfTextAtSize(brandStr, ds.type.smallPt);
  page.drawText(brandStr, { x: (pw - brandW) / 2, y, size: ds.type.smallPt, font, color: muted });
  y -= 20;

  hRule(primary, 1.5);
  y -= 10;

  // Sections and blocks
  for (const section of model.sections) {
    if (section.heading) {
      ensureSpace(40);
      y -= 8;
      const hLines = wrapText(section.heading, fontBold, ds.type.h1Pt, cw);
      for (const l of hLines) {
        ensureSpace(ds.type.h1Pt * 1.8);
        page.drawText(l, { x: mH, y, size: ds.type.h1Pt, font: fontBold, color: primary });
        y -= ds.type.h1Pt * 1.4;
      }
      hRule(accent, 0.5);
      y -= 4;
    }

    for (const block of section.blocks) {
      const density = block.density ?? section.density ?? 'normal';
      const lh = density === 'compact' ? lhCompact : density === 'airy' ? lhAiry : lhNormal;

      switch (block.type) {
        case 'heading': {
          const hSize = block.variant === 'section' ? ds.type.h1Pt : block.variant === 'subsection' ? ds.type.h2Pt : ds.type.h3Pt;
          const hColour = block.variant === 'section' ? primary : secondary;
          ensureSpace(hSize * 2.5);
          y -= 8;
          drawLine(wrapText(block.text, fontBold, hSize, cw), fontBold, hSize, mH, hSize * 1.4, hColour);
          if (block.variant === 'section') hRule(accent, 0.5);
          y -= 4;
          break;
        }

        case 'paragraph': {
          const lines = wrapText(block.text, font, ds.type.bodyPt, cw);
          drawLine(lines, font, ds.type.bodyPt, mH, lh, body);
          y -= lh * 0.4;
          break;
        }

        case 'clause': {
          const indent = mH + 24;
          const lines = wrapText(block.text, font, ds.type.bodyPt, cw - 24);
          drawLine(lines, font, ds.type.bodyPt, indent, lhCompact, body);
          y -= 2;
          break;
        }

        case 'bullet': {
          const bx = mH + (block.level ?? 0) * 24;
          const lines = wrapText(block.text, font, ds.type.bodyPt, cw - 24 - (block.level ?? 0) * 24);
          for (let i = 0; i < lines.length; i++) {
            ensureSpace(lh * 2);
            if (i === 0) page.drawText('\u2022', { x: bx, y, size: ds.type.bodyPt, font, color: accent });
            page.drawText(lines[i], { x: bx + 14, y, size: ds.type.bodyPt, font, color: body });
            y -= lh;
          }
          y -= 2;
          break;
        }

        case 'callout': {
          ensureSpace(40);
          if (block.label) {
            page.drawText(block.label.toUpperCase(), { x: mH + 14, y, size: ds.type.smallPt + 1, font: fontBold, color: primary });
            y -= ds.type.smallPt * 1.6;
          }
          // Accent bar on left
          const calloutLines = wrapText(block.text, fontItal, ds.type.bodyPt, cw - 18);
          const calloutH = calloutLines.length * lh + 12;
          page.drawRectangle({ x: mH, y: y - calloutH + 8, width: cw, height: calloutH, color: surface, opacity: 1 });
          page.drawRectangle({ x: mH, y: y - calloutH + 8, width: 3, height: calloutH, color: accent });
          drawLine(calloutLines, fontItal, ds.type.bodyPt, mH + 14, lh, body);
          y -= 8;
          break;
        }

        case 'table': {
          if (!block.headers?.length || !block.rows?.length) break;
          const colW = cw / block.headers.length;
          const rowH = ds.type.bodyPt * 1.8;

          ensureSpace((block.rows.length + 1) * rowH + 12);

          // Header row
          page.drawRectangle({ x: mH, y: y - rowH + 6, width: cw, height: rowH, color: primary });
          block.headers.forEach((h, i) => {
            page.drawText(h, { x: mH + i * colW + 4, y: y - rowH + 10, size: ds.type.smallPt, font: fontBold, color: rgb(1,1,1) });
          });
          y -= rowH;

          // Data rows
          block.rows.forEach((row, ri) => {
            if (y - rowH < mBottom + 30) newPage();
            if (ri % 2 === 0) {
              page.drawRectangle({ x: mH, y: y - rowH + 6, width: cw, height: rowH, color: surface });
            }
            row.forEach((cell, ci) => {
              const lines = wrapText(cell, font, ds.type.smallPt, colW - 8);
              page.drawText(lines[0] ?? '', { x: mH + ci * colW + 4, y: y - rowH + 10, size: ds.type.smallPt, font, color: body });
            });
            y -= rowH;
          });
          y -= 8;
          break;
        }

        case 'signature': {
          hRule(muted, 0.5);
          for (const party of block.parties) {
            ensureSpace(80);
            page.drawText(party.label, { x: mH, y, size: ds.type.bodyPt, font: fontBold, color: primary });
            y -= ds.type.bodyPt * 1.5;
            page.drawText(`Signed: _______________________________   Date: ${party.dateField}`, { x: mH, y, size: ds.type.bodyPt, font, color: muted });
            y -= ds.type.bodyPt * 1.5;
            page.drawText(`Name: ${party.nameField}`, { x: mH, y, size: ds.type.bodyPt, font, color: muted });
            y -= ds.type.bodyPt * 2;
          }
          break;
        }

        case 'divider':
          hRule(block.weight === 'heavy' ? primary : accent, block.weight === 'heavy' ? 1 : 0.4);
          y -= 4;
          break;
      }
    }
  }

  // Footers on all pages
  const allPages = doc.getPages();
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  allPages.forEach((p, i) => {
    p.drawLine({ start: { x: mH, y: mBottom + 16 }, end: { x: pw - mH, y: mBottom + 16 }, thickness: 0.4, color: accent });
    p.drawText('Generated by Foundationary', { x: mH, y: mBottom + 4, size: ds.type.smallPt, font: fontItal, color: muted });
    const pgStr = `Page ${i + 1} of ${allPages.length}`;
    const pgW = font.widthOfTextAtSize(pgStr, ds.type.smallPt);
    p.drawText(pgStr, { x: pw - mH - pgW, y: mBottom + 4, size: ds.type.smallPt, font, color: muted });
    if (ds.usePageBorderBar && i === allPages.length - 1) {
      p.drawRectangle({ x: 0, y: 0, width: pw, height: 4, color: primary });
    }
  });

  return doc.save();
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10: HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function getDocumentLabel(type: string): string {
  const labels: Record<string, string> = {
    terms_and_conditions:         'Terms and Conditions',
    bespoke_client_contract:      'Bespoke Client Contract',
    gdpr_privacy_policy:          'GDPR Privacy Policy',
    professional_bio:             'Professional Bio',
    linkedin_script:              'LinkedIn Profile Script',
    elevator_pitch:               'Elevator Pitch — Three Versions',
    professional_invoice_template:'Professional Invoice Template',
    welcome_email:                'New Client Welcome Email Sequence',
    late_payment_letters:         'Late Payment Letter Sequence',
  };
  return labels[type] ?? type;
}

function extractClientDesign(r: Record<string, any>): ClientDesign {
  return {
    businessName:    r.q2_business_name   ?? 'Unknown Business',
    legalName:       r.q1_legal_name      ?? '',
    firstName:       r.q55_first_name     ?? '',
    brandColours:    r.q67_brand_colours  ?? '',
    visualStyle:     r.q68_visual_style   ?? 'Simple — I just want it to work',
    toneOfVoice:     r.q62_tone_of_voice  ?? [],
    brandIdentity:   r.q64_brand_identity ?? '',
    jurisdiction:    r.q5_jurisdiction    ?? 'England & Wales',
    documentEmail:   r.q7_document_email  ?? '',
    businessPhone:   r.q8_business_phone  ?? '',
    businessAddress: r.q6_business_address ?? '',
    websiteUrl:      r.q10_website_url    ?? '',
  };
}

function resolveDisplayName(design: ClientDesign): string {
  return design.brandIdentity.toLowerCase().includes('personal')
    ? design.firstName || design.businessName
    : design.businessName;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 11: HTTP HANDLER
// ─────────────────────────────────────────────────────────────────────────────

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const body = await req.json();
    const { user_id, document_type, generate_files } = body;

    if (!user_id || !document_type) {
      return errorResponse('Missing user_id or document_type', 400);
    }

    const config = DOCUMENT_CONFIGS[document_type];
    if (!config) {
      return errorResponse(
        `Unknown document type: ${document_type}. Valid: ${Object.keys(DOCUMENT_CONFIGS).join(', ')}`,
        400
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch intake responses for design system resolution
    const { data: intakeData } = await supabase
      .from('intake_responses')
      .select('responses')
      .eq('user_id', user_id)
      .maybeSingle();

    const design       = extractClientDesign(intakeData?.responses ?? {});
    const ds           = resolveDesignSystem(design);
    const displayName  = resolveDisplayName(design);
    const docLabel     = getDocumentLabel(document_type);

    // ── MODE 1: Generate content via Gemini ──────────────────────────────────
    if (!generate_files) {
      await upsertDocumentStatus(supabase, user_id, document_type, docLabel, 'generating');

      // Fetch brief
      const { data: briefData, error: briefError } = await supabase
        .from('client_briefs')
        .select('brief_content')
        .eq('client_id', user_id)
        .maybeSingle();

      if (briefError || !briefData?.brief_content) {
        const msg = briefError?.message ?? 'No client brief found. Generate the Master Brief first.';
        await failDocument(supabase, user_id, document_type, msg);
        return errorResponse(msg, 400);
      }

      let documentModel: DocumentModel;
      try {
        documentModel = await callGemini(config, briefData.brief_content);
      } catch (err: any) {
        await failDocument(supabase, user_id, document_type, err.message);
        return errorResponse(err.message, 500);
      }

      // Render DOCX (primary format)
      let docxPath: string | null = null;
      try {
        const docxBuffer = await renderDocx(documentModel, ds, displayName);
        docxPath = `${user_id}/${document_type}.docx`;
        const { error: upErr } = await supabase.storage
          .from('generated-documents')
          .upload(docxPath, docxBuffer, {
            contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            upsert: true,
          });
        if (upErr) {
          console.error('DOCX upload error:', upErr.message);
          docxPath = null;
        }
      } catch (renderErr: any) {
        console.error('DOCX render error:', renderErr.message);
      }

      // Serialise DocumentModel as content_text (JSON), HTML summary optional
      const modelJson = JSON.stringify(documentModel);

      const updatePayload: Record<string, any> = {
        status:          'completed',
        content_text:    modelJson,
        api_key_used:    config.apiKey.substring(0, 10) + '...',
        model_used:      config.model,
        generated_at:    new Date().toISOString(),
      };
      if (docxPath) {
        updatePayload.docx_path = docxPath;
        updatePayload.files_generated_at = new Date().toISOString();
      }

      const { error: updateErr } = await supabase
        .from('generated_documents')
        .update(updatePayload)
        .eq('client_id', user_id)
        .eq('document_type', document_type);

      if (updateErr) {
        await failDocument(supabase, user_id, document_type, updateErr.message);
        return errorResponse(updateErr.message, 500);
      }

      return jsonResponse({ success: true, status: 'completed', document_type, docx_path: docxPath });
    }

    // ── MODE 2: Generate/regenerate files from existing DocumentModel ────────
    const { data: docData, error: docError } = await supabase
      .from('generated_documents')
      .select('id, content_text, docx_path, document_label')
      .eq('client_id', user_id)
      .eq('document_type', document_type)
      .maybeSingle();

    if (docError || !docData?.content_text) {
      return errorResponse('Document not found or content missing. Generate document text first.', 400);
    }

    let documentModel: DocumentModel;
    try {
      documentModel = JSON.parse(docData.content_text);
    } catch {
      return errorResponse('Stored content is not a valid DocumentModel. Please regenerate the document.', 400);
    }

    // DOCX
    let docxPath = docData.docx_path ?? null;
    try {
      const docxBuffer = await renderDocx(documentModel, ds, displayName);
      docxPath = `${user_id}/${document_type}.docx`;
      await supabase.storage
        .from('generated-documents')
        .upload(docxPath, docxBuffer, {
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          upsert: true,
        });
    } catch (err: any) {
      console.error('DOCX re-render error:', err.message);
    }

    // PDF (fallback renderer)
    let pdfPath: string | null = null;
    try {
      const pdfBuffer = await renderPdf(documentModel, ds, displayName);
      pdfPath = `${user_id}/${document_type}.pdf`;
      const { error: pdfUpErr } = await supabase.storage
        .from('generated-documents')
        .upload(pdfPath, pdfBuffer, { contentType: 'application/pdf', upsert: true });
      if (pdfUpErr) {
        console.error('PDF upload error:', pdfUpErr.message);
        pdfPath = null;
      }
    } catch (err: any) {
      console.error('PDF render error:', err.message);
    }

    await supabase
      .from('generated_documents')
      .update({
        docx_path:          docxPath,
        pdf_path:           pdfPath,
        files_generated_at: new Date().toISOString(),
      })
      .eq('id', docData.id);

    return jsonResponse({ success: true, status: 'files_generated', document_type, docx_path: docxPath, pdf_path: pdfPath });

  } catch (err: any) {
    console.error('Unhandled error:', err.message);
    return errorResponse(err.message ?? 'Unknown error', 500);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 12: SUPABASE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function upsertDocumentStatus(
  supabase: any,
  userId: string,
  docType: string,
  docLabel: string,
  status: string
): Promise<void> {
  const { data: existing } = await supabase
    .from('generated_documents')
    .select('id')
    .eq('client_id', userId)
    .eq('document_type', docType)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('generated_documents')
      .update({ status, error_message: null, content_text: null })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('generated_documents')
      .insert({ client_id: userId, document_type: docType, document_label: docLabel, status });
  }
}

async function failDocument(supabase: any, userId: string, docType: string, message: string): Promise<void> {
  await supabase
    .from('generated_documents')
    .update({ status: 'failed', error_message: message })
    .eq('client_id', userId)
    .eq('document_type', docType);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 13: RESPONSE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}
