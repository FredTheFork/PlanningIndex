// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — Render-agnostic colour, typography, and spacing tokens
// ─────────────────────────────────────────────────────────────────────────────

import type { ClientDesign } from './rendering.ts';

// ─────────────────────────────────────────────────────────────────────────────
// COLOUR TOKEN
// ─────────────────────────────────────────────────────────────────────────────

export interface ColourToken {
  /** Hex code with hash, e.g. "#1B3F7A" */
  hex: string;
  /** Hex code without hash, uppercase, e.g. "1B3F7A" (for DOCX) */
  docxHex: string;
  /** Red component 0-255 (for jsPDF) */
  r: number;
  /** Green component 0-255 (for jsPDF) */
  g: number;
  /** Blue component 0-255 (for jsPDF) */
  b: number;
  /** Red component 0-1 float (for pdf-lib) */
  pdfR: number;
  /** Green component 0-1 float (for pdf-lib) */
  pdfG: number;
  /** Blue component 0-1 float (for pdf-lib) */
  pdfB: number;
}

/**
 * Converts a hex colour string to a ColourToken with all format variants.
 * Normalises: adds # if missing, expands 3-char to 6-char.
 */
export function hexToToken(hex: string): ColourToken {
  // Normalise: add # if missing
  let normalized = hex.startsWith('#') ? hex : '#' + hex;

  // Expand 3-char hex to 6-char
  if (normalized.length === 4) {
    normalized = '#' + normalized[1] + normalized[1] + normalized[2] + normalized[2] + normalized[3] + normalized[3];
  }

  // Parse components
  const clean = normalized.slice(1);
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  return {
    hex: normalized,
    docxHex: clean.toUpperCase(),
    r,
    g,
    b,
    pdfR: r / 255,
    pdfG: g / 255,
    pdfB: b / 255,
  };
}

/**
 * Lightens a colour toward white by the given factor.
 * @param hex - The hex colour to tint
 * @param factor - 0 = original, 1 = white
 * @returns The tinted colour as '#RRGGBB'
 */
export function tintColour(hex: string, factor: number): string {
  const token = hexToToken(hex);
  const newR = Math.round(token.r + (255 - token.r) * factor);
  const newG = Math.round(token.g + (255 - token.g) * factor);
  const newB = Math.round(token.b + (255 - token.b) * factor);
  return '#' + newR.toString(16).padStart(2, '0') + newG.toString(16).padStart(2, '0') + newB.toString(16).padStart(2, '0');
}

/**
 * Extracts brand colours from input string.
 * Looks for hex codes first, then falls back to colour name keywords.
 */
export function parseBrandColours(input: string): { primary: string; secondary: string; accent: string } {
  // Default colours
  const defaults = { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' };

  if (!input || input.trim() === '') {
    return defaults;
  }

  // Extract hex codes using regex
  const hexPattern = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
  const hexMatches: string[] = [];
  let match;
  while ((match = hexPattern.exec(input)) !== null) {
    // Normalise to full 6-char hex with #
    let hex = match[0];
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    hexMatches.push(hex);
  }

  // 3+ found: primary=first, secondary=second, accent=third
  if (hexMatches.length >= 3) {
    return { primary: hexMatches[0], secondary: hexMatches[1], accent: hexMatches[2] };
  }
  // 2 found: primary, secondary, accent=secondary
  if (hexMatches.length === 2) {
    return { primary: hexMatches[0], secondary: hexMatches[1], accent: hexMatches[1] };
  }
  // 1 found: primary only, rest are defaults
  if (hexMatches.length === 1) {
    return { primary: hexMatches[0], secondary: defaults.secondary, accent: defaults.accent };
  }

  // 0 found: check input.toLowerCase() for colour name keywords
  const lowerInput = input.toLowerCase();

  const colourKeywords: Record<string, { primary: string; secondary: string; accent: string }> = {
    'navy': { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' },
    'dark blue': { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' },
    'blue': { primary: '#1E40AF', secondary: '#3B82F6', accent: '#60A5FA' },
    'green': { primary: '#065F46', secondary: '#059669', accent: '#34D399' },
    'sage': { primary: '#4A6741', secondary: '#6B8F5B', accent: '#8FB87A' },
    'gold': { primary: '#92400E', secondary: '#B45309', accent: '#D97706' },
    'red': { primary: '#991B1B', secondary: '#DC2626', accent: '#EF4444' },
    'black': { primary: '#1A1A2E', secondary: '#374151', accent: '#6B7280' },
    'charcoal': { primary: '#1A1A2E', secondary: '#374151', accent: '#6B7280' },
    'purple': { primary: '#5B21B6', secondary: '#7C3AED', accent: '#A78BFA' },
    'teal': { primary: '#0F766E', secondary: '#14B8A6', accent: '#2DD4BF' },
    'coral': { primary: '#9A3412', secondary: '#C2410C', accent: '#EA580C' },
    'warm': { primary: '#78350F', secondary: '#A16207', accent: '#CA8A04' },
    'luxury': { primary: '#1C1917', secondary: '#44403C', accent: '#78716C' },
    'slate': { primary: '#1E293B', secondary: '#334155', accent: '#64748B' },
  };

  for (const [keyword, colours] of Object.entries(colourKeywords)) {
    if (lowerInput.includes(keyword)) {
      return colours;
    }
  }

  // Default fallback
  return defaults;
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPE SCALE & SPACING INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface TypeScale {
  /** Display size in half-points (pt * 2) for DOCX */
  displayHp: number;
  /** H1 size in half-points for DOCX */
  h1Hp: number;
  /** H2 size in half-points for DOCX */
  h2Hp: number;
  /** H3 size in half-points for DOCX */
  h3Hp: number;
  /** Body size in half-points for DOCX */
  bodyHp: number;
  /** Small text size in half-points for DOCX */
  smallHp: number;
  /** Clause number size in half-points for DOCX */
  clauseNumberHp: number;
  /** Display size in points for PDF */
  displayPt: number;
  /** H1 size in points for PDF */
  h1Pt: number;
  /** H2 size in points for PDF */
  h2Pt: number;
  /** H3 size in points for PDF */
  h3Pt: number;
  /** Body size in points for PDF */
  bodyPt: number;
  /** Small text size in points for PDF */
  smallPt: number;
}

export interface SpacingSystem {
  /** Top margin in DXA (twentieths of a point) */
  marginTopDxa: number;
  /** Bottom margin in DXA */
  marginBottomDxa: number;
  /** Left margin in DXA */
  marginLeftDxa: number;
  /** Right margin in DXA */
  marginRightDxa: number;
  /** Content width in DXA (always 11906 - marginLeft - marginRight) */
  contentWidthDxa: number;
  /** Spacing before a section in DXA */
  sectionBeforeDxa: number;
  /** Spacing after a section in DXA */
  sectionAfterDxa: number;
  /** Spacing before a heading in DXA */
  headingBeforeDxa: number;
  /** Spacing after a heading in DXA */
  headingAfterDxa: number;
  /** Spacing after a paragraph in DXA */
  paragraphAfterDxa: number;
  /** Spacing after a clause in DXA */
  clauseAfterDxa: number;
  /** Spacing after a bullet point in DXA */
  bulletAfterDxa: number;
  /** Clause number indent in DXA */
  clauseIndentDxa: number;
  /** Bullet indent in DXA */
  bulletIndentDxa: number;
  /** Bullet hanging indent in DXA */
  bulletHangingDxa: number;
  /** Table cell top padding in DXA */
  tableCellTopDxa: number;
  /** Table cell bottom padding in DXA */
  tableCellBottomDxa: number;
  /** Table cell left padding in DXA */
  tableCellLeftDxa: number;
  /** Table cell right padding in DXA */
  tableCellRightDxa: number;
  /** Body line spacing in twips (240=single, 276=1.15x, 360=1.5x) */
  bodyLineSpacingTwips: number;
}

export type HeadingTreatment = 'capsule' | 'left-rule' | 'full-rule' | 'underline-accent' | 'plain';
export type TableTreatment = 'ruled' | 'open' | 'minimalist' | 'financial';

export interface DesignSystem {
  /** Primary brand colour */
  primary: ColourToken;
  /** Secondary brand colour */
  secondary: ColourToken;
  /** Accent brand colour */
  accent: ColourToken;
  /** Surface/background colour (lighter tint of primary) */
  surface: ColourToken;
  /** Pure white */
  white: ColourToken;
  /** Body text colour */
  bodyTextColour: ColourToken;
  /** Muted/subdued text colour */
  mutedTextColour: ColourToken;
  /** Font family name */
  font: string;
  /** Typography scale */
  type: TypeScale;
  /** Spacing system */
  spacing: SpacingSystem;
  /** Heading visual treatment style */
  headingTreatment: HeadingTreatment;
  /** Table visual treatment style */
  tableTreatment: TableTreatment;
  /** Whether to use a top accent bar */
  useTopAccentBar: boolean;
  /** Whether to use a bottom accent bar */
  useBottomAccentBar: boolean;
  /** Whether to use a cover page */
  useCoverPage: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves the complete design system from client design preferences.
 * Generates all colour tokens, typography scales, and spacing values
 * based on the visual style selection.
 */
export function resolveDesignSystem(design: ClientDesign): DesignSystem {
  // Parse brand colours
  const colours = parseBrandColours(design.brandColours);
  const primary = hexToToken(colours.primary);
  const secondary = hexToToken(colours.secondary);
  const accent = hexToToken(colours.accent);

  // Derive surface colour (92% toward white)
  const surfaceHex = tintColour(primary.hex, 0.92);
  const surface = hexToToken(surfaceHex);

  // Fixed colours
  const white = hexToToken('#FFFFFF');
  const bodyTextColour = hexToToken('#1A1A2E');
  const mutedTextColour = hexToToken('#5A5A6E');

  // Fixed margins (in DXA)
  const marginLeftDxa = 1134;
  const marginRightDxa = 1134;
  const marginTopDxa = 1270;
  const marginBottomDxa = 1270;
  const contentWidthDxa = 11906 - marginLeftDxa - marginRightDxa; // = 9638

  // Fixed table cell padding
  const tableCellTopDxa = 80;
  const tableCellBottomDxa = 80;
  const tableCellLeftDxa = 160;
  const tableCellRightDxa = 160;

  // Fixed indentation
  const clauseIndentDxa = 480;
  const bulletIndentDxa = 720;
  const bulletHangingDxa = 360;

  // Variables to be set by style switch
  let font = 'Calibri';
  let headingTreatment: HeadingTreatment = 'plain';
  let tableTreatment: TableTreatment = 'ruled';
  let useTopAccentBar = false;
  let useBottomAccentBar = false;

  let displayPt = 20;
  let h1Pt = 13;
  let h2Pt = 11;
  let h3Pt = 10.5;
  let bodyPt = 10;
  let smallPt = 8;

  let sectionBeforeDxa = 360;
  let sectionAfterDxa = 100;
  let headingBeforeDxa = 280;
  let headingAfterDxa = 100;
  let paragraphAfterDxa = 100;
  let clauseAfterDxa = 60;
  let bulletAfterDxa = 50;
  let bodyLineSpacingTwips = 276;

  // Switch on visual style (exact string matching)
  switch (design.visualStyle) {
    case 'Clean and modern / minimal':
      font = 'Calibri';
      headingTreatment = 'underline-accent';
      tableTreatment = 'open';
      displayPt = 24;
      h1Pt = 14;
      h2Pt = 12;
      h3Pt = 11;
      bodyPt = 10;
      smallPt = 8;
      sectionBeforeDxa = 480;
      sectionAfterDxa = 120;
      headingBeforeDxa = 360;
      headingAfterDxa = 120;
      paragraphAfterDxa = 120;
      clauseAfterDxa = 80;
      bulletAfterDxa = 60;
      bodyLineSpacingTwips = 276;
      useTopAccentBar = false;
      useBottomAccentBar = false;
      break;

    case 'Corporate and formal':
      font = 'Calibri';
      headingTreatment = 'left-rule';
      tableTreatment = 'ruled';
      displayPt = 22;
      h1Pt = 13;
      h2Pt = 11;
      h3Pt = 10.5;
      bodyPt = 10;
      smallPt = 8;
      sectionBeforeDxa = 400;
      sectionAfterDxa = 100;
      headingBeforeDxa = 300;
      headingAfterDxa = 100;
      paragraphAfterDxa = 100;
      clauseAfterDxa = 60;
      bulletAfterDxa = 50;
      bodyLineSpacingTwips = 276;
      useTopAccentBar = true;
      useBottomAccentBar = false;
      break;

    case 'Warm and friendly':
      font = 'Calibri';
      headingTreatment = 'full-rule';
      tableTreatment = 'ruled';
      displayPt = 22;
      h1Pt = 14;
      h2Pt = 12;
      h3Pt = 11;
      bodyPt = 10.5;
      smallPt = 8;
      sectionBeforeDxa = 360;
      sectionAfterDxa = 110;
      headingBeforeDxa = 280;
      headingAfterDxa = 110;
      paragraphAfterDxa = 140;
      clauseAfterDxa = 80;
      bulletAfterDxa = 60;
      bodyLineSpacingTwips = 276;
      useTopAccentBar = false;
      useBottomAccentBar = false;
      break;

    case 'Premium and luxury':
      font = 'Georgia';
      headingTreatment = 'capsule';
      tableTreatment = 'minimalist';
      displayPt = 26;
      h1Pt = 15;
      h2Pt = 12;
      h3Pt = 11;
      bodyPt = 10;
      smallPt = 8;
      sectionBeforeDxa = 560;
      sectionAfterDxa = 160;
      headingBeforeDxa = 400;
      headingAfterDxa = 160;
      paragraphAfterDxa = 160;
      clauseAfterDxa = 100;
      bulletAfterDxa = 80;
      bodyLineSpacingTwips = 360;
      useTopAccentBar = true;
      useBottomAccentBar = true;
      break;

    case 'Simple — I just want it to work':
    default:
      font = 'Calibri';
      headingTreatment = 'plain';
      tableTreatment = 'ruled';
      displayPt = 20;
      h1Pt = 13;
      h2Pt = 11;
      h3Pt = 10.5;
      bodyPt = 10;
      smallPt = 8;
      sectionBeforeDxa = 360;
      sectionAfterDxa = 100;
      headingBeforeDxa = 280;
      headingAfterDxa = 100;
      paragraphAfterDxa = 100;
      clauseAfterDxa = 60;
      bulletAfterDxa = 50;
      bodyLineSpacingTwips = 276;
      useTopAccentBar = false;
      useBottomAccentBar = false;
      break;
  }

  // Build type scale (Hp = half-points = pt * 2)
  const type: TypeScale = {
    displayHp: displayPt * 2,
    h1Hp: h1Pt * 2,
    h2Hp: h2Pt * 2,
    h3Hp: h3Pt * 2,
    bodyHp: bodyPt * 2,
    smallHp: smallPt * 2,
    clauseNumberHp: bodyPt * 2,
    displayPt,
    h1Pt,
    h2Pt,
    h3Pt,
    bodyPt,
    smallPt,
  };

  // Build spacing system
  const spacing: SpacingSystem = {
    marginTopDxa,
    marginBottomDxa,
    marginLeftDxa,
    marginRightDxa,
    contentWidthDxa,
    sectionBeforeDxa,
    sectionAfterDxa,
    headingBeforeDxa,
    headingAfterDxa,
    paragraphAfterDxa,
    clauseAfterDxa,
    bulletAfterDxa,
    clauseIndentDxa,
    bulletIndentDxa,
    bulletHangingDxa,
    tableCellTopDxa,
    tableCellBottomDxa,
    tableCellLeftDxa,
    tableCellRightDxa,
    bodyLineSpacingTwips,
  };

  return {
    primary,
    secondary,
    accent,
    surface,
    white,
    bodyTextColour,
    mutedTextColour,
    font,
    type,
    spacing,
    headingTreatment,
    tableTreatment,
    useTopAccentBar,
    useBottomAccentBar,
    useCoverPage: true, // Always true for all styles
  };
}
