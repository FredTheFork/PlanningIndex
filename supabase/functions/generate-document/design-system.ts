// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — Resolves ClientDesign into a complete, render-agnostic
// token system consumed by every renderer (DOCX, PDF, HTML)
// ─────────────────────────────────────────────────────────────────────────────

import { ClientDesign } from './rendering.ts';

// ── Colour Token ──

export interface ColourToken {
  hex: string;
  docxHex: string;
  r: number;
  g: number;
  b: number;
  pdfR: number;
  pdfG: number;
  pdfB: number;
}

// ── Type Scale ──

export interface TypeScale {
  displayHp: number;
  h1Hp: number;
  h2Hp: number;
  h3Hp: number;
  bodyHp: number;
  smallHp: number;
  clauseNumberHp: number;
  displayPt: number;
  h1Pt: number;
  h2Pt: number;
  h3Pt: number;
  bodyPt: number;
  smallPt: number;
}

// ── Spacing System ──

export interface SpacingSystem {
  marginTopDxa: number;
  marginBottomDxa: number;
  marginLeftDxa: number;
  marginRightDxa: number;
  contentWidthDxa: number;
  sectionBeforeDxa: number;
  sectionAfterDxa: number;
  headingBeforeDxa: number;
  headingAfterDxa: number;
  paragraphAfterDxa: number;
  clauseAfterDxa: number;
  bulletAfterDxa: number;
  clauseIndentDxa: number;
  bulletIndentDxa: number;
  bulletHangingDxa: number;
  tableCellTopDxa: number;
  tableCellBottomDxa: number;
  tableCellLeftDxa: number;
  tableCellRightDxa: number;
  bodyLineSpacingTwips: number;
}

// ── Treatments ──

export type HeadingTreatment = 'capsule' | 'left-rule' | 'full-rule' | 'underline-accent' | 'plain';
export type TableTreatment = 'ruled' | 'open' | 'minimalist' | 'financial';

// ── Complete Design System ──

export interface DesignSystem {
  primary: ColourToken;
  secondary: ColourToken;
  accent: ColourToken;
  surface: ColourToken;
  white: ColourToken;
  bodyTextColour: ColourToken;
  mutedTextColour: ColourToken;
  font: string;
  type: TypeScale;
  spacing: SpacingSystem;
  headingTreatment: HeadingTreatment;
  tableTreatment: TableTreatment;
  useTopAccentBar: boolean;
  useBottomAccentBar: boolean;
  useCoverPage: boolean;
}

// ── Hex → ColourToken ──

export function hexToToken(hex: string): ColourToken {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    : clean;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return {
    hex: '#' + full,
    docxHex: full,
    r, g, b,
    pdfR: r / 255,
    pdfG: g / 255,
    pdfB: b / 255,
  };
}

// ── Tint Colour ──

export function tintColour(hex: string, factor: number): string {
  const t = Math.max(0, Math.min(1, factor));
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
    : clean;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  const nr = Math.round(r + (255 - r) * t);
  const ng = Math.round(g + (255 - g) * t);
  const nb = Math.round(b + (255 - b) * t);
  return '#' + nr.toString(16).padStart(2, '0') + ng.toString(16).padStart(2, '0') + nb.toString(16).padStart(2, '0');
}

// ── Parse Brand Colours ──

export function parseBrandColours(input: string): { primary: string; secondary: string; accent: string } {
  const defaults = { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' };
  if (!input || input.trim() === '') return defaults;
  const lowered = input.trim().toLowerCase();

  const hexPattern = /#([0-9a-f]{3}|[0-9a-f]{6})\b/gi;
  const hexMatches = input.match(hexPattern);
  if (hexMatches && hexMatches.length >= 2) {
    return {
      primary: hexMatches[0],
      secondary: hexMatches[1],
      accent: hexMatches.length >= 3 ? hexMatches[2] : hexMatches[1],
    };
  }
  if (hexMatches && hexMatches.length === 1) {
    return { primary: hexMatches[0], secondary: defaults.secondary, accent: defaults.accent };
  }

  const colourMap: Record<string, { primary: string; secondary: string; accent: string }> = {
    'navy': { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' },
    'blue': { primary: '#1E40AF', secondary: '#3B82F6', accent: '#60A5FA' },
    'dark blue': { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' },
    'green': { primary: '#065F46', secondary: '#059669', accent: '#34D399' },
    'sage': { primary: '#4A6741', secondary: '#6B8F5B', accent: '#8FB87A' },
    'gold': { primary: '#92400E', secondary: '#B45309', accent: '#D97706' },
    'red': { primary: '#991B1B', secondary: '#DC2626', accent: '#EF4444' },
    'black': { primary: '#1A1A2E', secondary: '#374151', accent: '#6B7280' },
    'purple': { primary: '#5B21B6', secondary: '#7C3AED', accent: '#A78BFA' },
    'teal': { primary: '#0F766E', secondary: '#14B8A6', accent: '#2DD4BF' },
    'coral': { primary: '#9A3412', secondary: '#C2410C', accent: '#EA580C' },
    'warm': { primary: '#78350F', secondary: '#A16207', accent: '#CA8A04' },
    'luxury': { primary: '#1C1917', secondary: '#44403C', accent: '#78716C' },
    'slate': { primary: '#334155', secondary: '#475569', accent: '#94A3B8' },
    'charcoal': { primary: '#1C1917', secondary: '#292524', accent: '#78716C' },
  };
  for (const [key, value] of Object.entries(colourMap)) {
    if (lowered.includes(key)) return value;
  }
  return defaults;
}

// ── pt → DOCX half-points ──

function hp(pt: number): number { return Math.round(pt * 2); }

// ── Resolve Design System ──

export function resolveDesignSystem(design: ClientDesign): DesignSystem {
  const colours = parseBrandColours(design.brandColours);
  const style = design.visualStyle || '';

  const primary = hexToToken(colours.primary);
  const secondary = hexToToken(colours.secondary);
  const accent = hexToToken(colours.accent);
  const surface = hexToToken(tintColour(colours.primary, 0.92));
  const white = hexToToken('#FFFFFF');
  const bodyTextColour = hexToToken('#1A1A2E');
  const mutedTextColour = hexToToken('#8B92A8');

  // Page geometry — fixed for all styles
  const marginLeftDxa = 1134;
  const marginRightDxa = 1134;
  const marginTopDxa = 1270;
  const marginBottomDxa = 1270;
  const contentWidthDxa = 11906 - marginLeftDxa - marginRightDxa; // 9638

  // Table cell margins — fixed for all styles
  const tableCellTopDxa = 80;
  const tableCellBottomDxa = 80;
  const tableCellLeftDxa = 160;
  const tableCellRightDxa = 160;

  let font: string;
  let type: TypeScale;
  let spacing: SpacingSystem;
  let headingTreatment: HeadingTreatment;
  let tableTreatment: TableTreatment;
  let useTopAccentBar: boolean;
  let useBottomAccentBar: boolean;
  let useCoverPage: boolean;

  if (style.includes('Clean and modern') || style.includes('minimal')) {
    font = 'Calibri';
    type = {
      displayHp: hp(24), h1Hp: hp(14), h2Hp: hp(12), h3Hp: hp(11),
      bodyHp: hp(10), smallHp: hp(8), clauseNumberHp: hp(10),
      displayPt: 24, h1Pt: 14, h2Pt: 12, h3Pt: 11,
      bodyPt: 10, smallPt: 8,
    };
    spacing = {
      marginTopDxa, marginBottomDxa, marginLeftDxa, marginRightDxa, contentWidthDxa,
      sectionBeforeDxa: 480, sectionAfterDxa: 120,
      headingBeforeDxa: 360, headingAfterDxa: 120,
      paragraphAfterDxa: 120, clauseAfterDxa: 60, bulletAfterDxa: 40,
      clauseIndentDxa: 720, bulletIndentDxa: 360, bulletHangingDxa: 360,
      tableCellTopDxa, tableCellBottomDxa, tableCellLeftDxa, tableCellRightDxa,
      bodyLineSpacingTwips: 276,
    };
    headingTreatment = 'underline-accent';
    tableTreatment = 'open';
    useTopAccentBar = false;
    useBottomAccentBar = false;
    useCoverPage = true;
  } else if (style.includes('Corporate') || style.includes('formal')) {
    font = 'Calibri';
    type = {
      displayHp: hp(22), h1Hp: hp(13), h2Hp: hp(11), h3Hp: hp(10.5),
      bodyHp: hp(10), smallHp: hp(8), clauseNumberHp: hp(10),
      displayPt: 22, h1Pt: 13, h2Pt: 11, h3Pt: 10.5,
      bodyPt: 10, smallPt: 8,
    };
    spacing = {
      marginTopDxa, marginBottomDxa, marginLeftDxa, marginRightDxa, contentWidthDxa,
      sectionBeforeDxa: 400, sectionAfterDxa: 100,
      headingBeforeDxa: 300, headingAfterDxa: 100,
      paragraphAfterDxa: 100, clauseAfterDxa: 50, bulletAfterDxa: 40,
      clauseIndentDxa: 720, bulletIndentDxa: 360, bulletHangingDxa: 360,
      tableCellTopDxa, tableCellBottomDxa, tableCellLeftDxa, tableCellRightDxa,
      bodyLineSpacingTwips: 264,
    };
    headingTreatment = 'left-rule';
    tableTreatment = 'ruled';
    useTopAccentBar = true;
    useBottomAccentBar = false;
    useCoverPage = true;
  } else if (style.includes('Warm') || style.includes('friendly')) {
    font = 'Calibri';
    type = {
      displayHp: hp(22), h1Hp: hp(14), h2Hp: hp(12), h3Hp: hp(11),
      bodyHp: hp(10.5), smallHp: hp(8), clauseNumberHp: hp(10),
      displayPt: 22, h1Pt: 14, h2Pt: 12, h3Pt: 11,
      bodyPt: 10.5, smallPt: 8,
    };
    spacing = {
      marginTopDxa, marginBottomDxa, marginLeftDxa, marginRightDxa, contentWidthDxa,
      sectionBeforeDxa: 360, sectionAfterDxa: 120,
      headingBeforeDxa: 280, headingAfterDxa: 120,
      paragraphAfterDxa: 140, clauseAfterDxa: 60, bulletAfterDxa: 50,
      clauseIndentDxa: 720, bulletIndentDxa: 360, bulletHangingDxa: 360,
      tableCellTopDxa, tableCellBottomDxa, tableCellLeftDxa, tableCellRightDxa,
      bodyLineSpacingTwips: 288,
    };
    headingTreatment = 'full-rule';
    tableTreatment = 'ruled';
    useTopAccentBar = false;
    useBottomAccentBar = false;
    useCoverPage = true;
  } else if (style.includes('Premium') || style.includes('luxury')) {
    font = 'Georgia';
    type = {
      displayHp: hp(26), h1Hp: hp(15), h2Hp: hp(12), h3Hp: hp(11),
      bodyHp: hp(10), smallHp: hp(8), clauseNumberHp: hp(10),
      displayPt: 26, h1Pt: 15, h2Pt: 12, h3Pt: 11,
      bodyPt: 10, smallPt: 8,
    };
    spacing = {
      marginTopDxa, marginBottomDxa, marginLeftDxa, marginRightDxa, contentWidthDxa,
      sectionBeforeDxa: 560, sectionAfterDxa: 160,
      headingBeforeDxa: 440, headingAfterDxa: 160,
      paragraphAfterDxa: 160, clauseAfterDxa: 70, bulletAfterDxa: 60,
      clauseIndentDxa: 720, bulletIndentDxa: 360, bulletHangingDxa: 360,
      tableCellTopDxa, tableCellBottomDxa, tableCellLeftDxa, tableCellRightDxa,
      bodyLineSpacingTwips: 300,
    };
    headingTreatment = 'capsule';
    tableTreatment = 'minimalist';
    useTopAccentBar = true;
    useBottomAccentBar = true;
    useCoverPage = true;
  } else {
    // 'Simple — I just want it to work' and any unknown style
    font = 'Calibri';
    type = {
      displayHp: hp(20), h1Hp: hp(13), h2Hp: hp(11), h3Hp: hp(10.5),
      bodyHp: hp(10), smallHp: hp(8), clauseNumberHp: hp(10),
      displayPt: 20, h1Pt: 13, h2Pt: 11, h3Pt: 10.5,
      bodyPt: 10, smallPt: 8,
    };
    spacing = {
      marginTopDxa, marginBottomDxa, marginLeftDxa, marginRightDxa, contentWidthDxa,
      sectionBeforeDxa: 360, sectionAfterDxa: 100,
      headingBeforeDxa: 280, headingAfterDxa: 100,
      paragraphAfterDxa: 100, clauseAfterDxa: 50, bulletAfterDxa: 40,
      clauseIndentDxa: 720, bulletIndentDxa: 360, bulletHangingDxa: 360,
      tableCellTopDxa, tableCellBottomDxa, tableCellLeftDxa, tableCellRightDxa,
      bodyLineSpacingTwips: 264,
    };
    headingTreatment = 'plain';
    tableTreatment = 'ruled';
    useTopAccentBar = false;
    useBottomAccentBar = false;
    useCoverPage = false;
  }

  return {
    primary, secondary, accent, surface, white, bodyTextColour, mutedTextColour,
    font, type, spacing,
    headingTreatment, tableTreatment,
    useTopAccentBar, useBottomAccentBar, useCoverPage,
  };
}
