// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT RENDERING — DOCX generation with branded headers and styling
// ─────────────────────────────────────────────────────────────────────────────

import { Document as DocxDocument, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle, ShadingType, Table, TableRow, TableCell, WidthType, VerticalAlign } from 'npm:docx@9.1.1';

// ── Shared Types ──

export interface ClientDesign {
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
  logoBase64: string | null;
}

export interface TextBlock {
  type: 'heading' | 'paragraph' | 'clause' | 'bullet' | 'subheading';
  text: string;
  level: number;
}

export interface TableBlock { type: 'table'; headers: string[]; rows: string[][]; level: number; }

// ── Brand & Style Helpers ──

export function parseBrandColours(colourInput: string): { primary: string; secondary: string; accent: string } {
  const defaults = { primary: '#1B3F7A', secondary: '#2C68C4', accent: '#4A90E2' };
  if (!colourInput || colourInput.trim() === '') return defaults;
  const input = colourInput.trim().toLowerCase();
  const hexPattern = /#([0-9a-f]{3}|[0-9a-f]{6})\b/gi;
  const hexMatches = colourInput.match(hexPattern);
  if (hexMatches && hexMatches.length >= 2) {
    return { primary: hexMatches[0], secondary: hexMatches[1], accent: hexMatches.length >= 3 ? hexMatches[2] : hexMatches[1] };
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
  };
  for (const [key, value] of Object.entries(colourMap)) {
    if (input.includes(key)) return value;
  }
  return defaults;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2] : clean;
  return { r: parseInt(full.substring(0, 2), 16) / 255, g: parseInt(full.substring(2, 4), 16) / 255, b: parseInt(full.substring(4, 6), 16) / 255 };
}

interface StyleConfig {
  headerFont: string; bodyFont: string; headerSize: number; bodySize: number;
  lineSpacing: number; sectionGap: number; decorativeElements: boolean;
  borderStyle: 'solid' | 'double' | 'accent' | 'none'; cornerAccent: boolean;
}

export function getVisualStyleConfig(style: string): StyleConfig {
  switch (style) {
    case 'Clean and modern / minimal': return { headerFont: 'Helvetica', bodyFont: 'Helvetica', headerSize: 14, bodySize: 10, lineSpacing: 14, sectionGap: 20, decorativeElements: false, borderStyle: 'none', cornerAccent: false };
    case 'Corporate and formal': return { headerFont: 'Helvetica', bodyFont: 'Helvetica', headerSize: 13, bodySize: 10, lineSpacing: 14, sectionGap: 18, decorativeElements: true, borderStyle: 'double', cornerAccent: false };
    case 'Warm and friendly': return { headerFont: 'Helvetica', bodyFont: 'Helvetica', headerSize: 14, bodySize: 10.5, lineSpacing: 15, sectionGap: 16, decorativeElements: true, borderStyle: 'accent', cornerAccent: false };
    case 'Premium and luxury': return { headerFont: 'Helvetica', bodyFont: 'Helvetica', headerSize: 13, bodySize: 10, lineSpacing: 14, sectionGap: 22, decorativeElements: true, borderStyle: 'solid', cornerAccent: true };
    default: return { headerFont: 'Helvetica', bodyFont: 'Helvetica', headerSize: 13, bodySize: 10, lineSpacing: 14, sectionGap: 16, decorativeElements: false, borderStyle: 'none', cornerAccent: false };
  }
}

// ── Text Parsing ──

function convertMarkdownTableToColumns(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inTable = false;
  let headerRow: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
      if (cells.some(cell => /^-+$/.test(cell))) { inTable = true; continue; }
      if (inTable && headerRow.length === 0) { headerRow = cells; result.push(cells.join(' | ')); result.push(''); }
      else if (inTable && cells.length > 0) { result.push(cells.join(' | ')); }
    } else {
      if (inTable && headerRow.length > 0) { inTable = false; headerRow = []; result.push(''); }
      result.push(line);
    }
  }
  return result.join('\n');
}

function stripMarkdown(text: string): string {
  let cleaned = convertMarkdownTableToColumns(text);
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/__(.+?)__/g, '$1');
  cleaned = cleaned.replace(/(?<!\w)\*(.+?)\*(?!\w)/g, '$1');
  cleaned = cleaned.replace(/(?<!\w)_(.+?)_(?!\w)/g, '$1');
  cleaned = cleaned.replace(/~~(.+?)~~/g, '$1');
  cleaned = cleaned.replace(/`(.+?)`/g, '$1');
  cleaned = cleaned.replace(/\[(.+?)\]\(.+?\)/g, '$1');
  cleaned = cleaned.replace(/!\[.*?\]\(.+?\)/g, '');
  cleaned = cleaned.replace(/^-{3,}$/gm, '');
  cleaned = cleaned.replace(/^\*{3,}$/gm, '');
  cleaned = cleaned.replace(/^_{3,}$/gm, '');
  cleaned = cleaned.replace(/^>\s*/gm, '');
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
  return cleaned;
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.includes('|') && (trimmed.startsWith('|') || trimmed.includes('|'));
}

function parseTableBlock(lines: string[], startIndex: number): { table: TableBlock; endIndex: number } | null {
  const rows: string[][] = []; let i = startIndex; let headers: string[] = []; let isFirstRow = true;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!isTableRow(line)) break;
    const cells = line.split('|').slice(1, -1).map(cell => cell.trim()).filter(cell => !(/^[-]+$/.test(cell)));
    if (cells.length === 0) { i++; continue; }
    if (isFirstRow) { headers = cells; isFirstRow = false; } else { rows.push(cells); }
    i++;
  }
  if (headers.length > 0 && rows.length > 0) { return { table: { type: 'table', headers, rows, level: 0 }, endIndex: i }; }
  return null;
}

export function parseTextToBlocks(text: string): (TextBlock | TableBlock)[] {
  const blocks: (TextBlock | TableBlock)[] = [];
  const lines = text.split('\n');
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    const joined = currentParagraph.join(' ').trim();
    if (joined) {
      const cleaned = stripMarkdown(joined);
      if (cleaned) {
        const clauseMatch = cleaned.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
        if (clauseMatch) { blocks.push({ type: 'clause', text: cleaned, level: 0 }); }
        else { blocks.push({ type: 'paragraph', text: cleaned, level: 0 }); }
      }
    }
    currentParagraph = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i]; const trimmed = line.trim();
    if (!trimmed) { flushParagraph(); i++; continue; }
    if (isTableRow(trimmed)) { flushParagraph(); const tableResult = parseTableBlock(lines, i); if (tableResult) { blocks.push(tableResult.table); i = tableResult.endIndex; continue; } }
    if (/^===\s*.+\s*===$/.test(trimmed)) { flushParagraph(); const headingText = stripMarkdown(trimmed.replace(/^===\s*/, '').replace(/\s*===$/, '').trim()); blocks.push({ type: 'heading', text: headingText, level: 1 }); i++; continue; }
    const mdHeadingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (mdHeadingMatch) { flushParagraph(); const level = Math.min(mdHeadingMatch[1].length, 3); const headingText = stripMarkdown(mdHeadingMatch[2].trim()); if (level === 1) { blocks.push({ type: 'heading', text: headingText, level: 1 }); } else if (level === 2) { blocks.push({ type: 'heading', text: headingText, level: 2 }); } else { blocks.push({ type: 'subheading', text: headingText, level: 3 }); } i++; continue; }
    if (/^[-*]\s+/.test(trimmed) || /^\u2022\s+/.test(trimmed)) { flushParagraph(); const bulletText = stripMarkdown(trimmed.replace(/^[-*\u2022]\s+/, '')); blocks.push({ type: 'bullet', text: bulletText, level: 0 }); i++; continue; }
    if (/^\d+(?:\.\d+)*\.\s+/.test(trimmed)) { flushParagraph(); blocks.push({ type: 'clause', text: stripMarkdown(trimmed), level: 0 }); i++; continue; }
    currentParagraph.push(trimmed); i++;
  }
  flushParagraph();
  return blocks;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCX GENERATION
// ─────────────────────────────────────────────────────────────────────────────

export async function generateDocx(text: string, documentLabel: string, businessName: string, design: ClientDesign): Promise<Uint8Array> {
  const colours = parseBrandColours(design.brandColours);
  const primaryHex = colours.primary.replace('#', '');
  const accentHex = colours.accent.replace('#', '');
  const secondaryHex = colours.secondary.replace('#', '');
  const blocks = parseTextToBlocks(text);
  const children: Paragraph[] = [];

  // Document title
  children.push(new Paragraph({
    children: [new TextRun({ text: documentLabel, bold: true, size: 44, font: 'Calibri', color: primaryHex })],
    alignment: AlignmentType.CENTER, spacing: { after: 80 },
  }));
  const displayName = design.brandIdentity === 'My personal name is the brand — I want documents to feel personal' ? (design.firstName || businessName) : businessName;
  children.push(new Paragraph({
    children: [new TextRun({ text: `Prepared for ${displayName}`, italics: true, size: 20, font: 'Calibri', color: '999999' })],
    alignment: AlignmentType.CENTER, spacing: { after: 40 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: design.businessName, size: 18, font: 'Calibri', color: 'AAAAAA' })],
    alignment: AlignmentType.CENTER, spacing: { after: 60 },
  }));
  // Separator
  children.push(new Paragraph({
    children: [], spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: primaryHex } },
  }));

  for (const block of blocks) {
    if (block.type === 'heading') {
      if (block.level === 1) {
        children.push(new Paragraph({
          children: [new TextRun({ text: block.text, bold: true, size: 28, font: 'Calibri', color: primaryHex })],
          heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accentHex } },
          shading: { type: ShadingType.CLEAR, fill: primaryHex + '10' },
          indent: { left: 120 },
        }));
      } else {
        children.push(new Paragraph({
          children: [new TextRun({ text: block.text, bold: true, size: 24, font: 'Calibri', color: secondaryHex })],
          heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 100 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentHex + '44' } },
        }));
      }
    } else if (block.type === 'subheading') {
      children.push(new Paragraph({
        children: [new TextRun({ text: block.text, bold: true, italics: true, size: 22, font: 'Calibri', color: secondaryHex })],
        spacing: { before: 200, after: 80 },
      }));
    } else if (block.type === 'clause') {
      const clauseMatch = block.text.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
      if (clauseMatch) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: clauseMatch[1] + '.', bold: true, size: 20, font: 'Calibri', color: primaryHex }),
            new TextRun({ text: ' ' + clauseMatch[2], size: 20, font: 'Calibri', color: '262626' }),
          ],
          indent: { left: 480, hanging: 480 }, spacing: { after: 60 },
        }));
      } else {
        children.push(new Paragraph({
          children: [new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' })],
          indent: { left: 240 }, spacing: { after: 60 },
        }));
      }
    } else if (block.type === 'bullet') {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: '\u2022 ', bold: true, size: 20, font: 'Calibri', color: accentHex }),
          new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' }),
        ],
        bullet: { level: 0 }, spacing: { after: 40 },
      }));
    } else if (block.type === 'table') {
      // Render table in DOCX
      const tbl = block as TableBlock;
      const headerRow = new TableRow({
        children: tbl.headers.map(h => new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, font: 'Calibri', color: 'FFFFFF' })] })],
          shading: { type: ShadingType.CLEAR, fill: primaryHex },
          verticalAlign: VerticalAlign.CENTER,
        })),
      });
      const dataRows = tbl.rows.map((row, idx) => new TableRow({
        children: row.map(cell => new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, font: 'Calibri', color: '262626' })] })],
          shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? 'FFFFFF' : primaryHex + '08' },
        })),
      }));
      children.push(new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }));
      children.push(new Paragraph({ spacing: { after: 100 } }));
    } else {
      children.push(new Paragraph({
        children: [new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' })],
        spacing: { after: 100 },
      }));
    }
  }

  // Footer separator
  children.push(new Paragraph({
    children: [], spacing: { before: 400 },
    border: { top: { style: BorderStyle.SINGLE, size: 12, color: primaryHex } },
  }));
  children.push(new Paragraph({
    children: [
      new TextRun({ text: design.businessName, italics: true, size: 18, font: 'Calibri', color: '999999' }),
      new TextRun({ text: '  |  ', size: 18, font: 'Calibri', color: 'CCCCCC' }),
      new TextRun({ text: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), italics: true, size: 18, font: 'Calibri', color: '999999' }),
    ],
    alignment: AlignmentType.CENTER, spacing: { before: 80 },
  }));

  const doc = new DocxDocument({
    sections: [{ properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children }],
  });
  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}

// ─────────────────────────────────────────────────────────────────────────────
// INVOICE DOCX
// ─────────────────────────────────────────────────────────────────────────────

export interface InvoiceData {
  businessInfo: { name: string; address: string; phone: string; email: string; website: string };
  invoiceFields: { invoiceNumberFormat: string; dateFormat: string; dueDateFormat: string; poNumberFormat: string };
  billToPlaceholders: { clientName: string; company: string; addressLine1: string; addressLine2: string; email: string; phone: string };
  lineItems: Array<{ description: string; quantity: string; unitPrice: string; amount: string }>;
  totals: { subtotal: string; vatPercentage: number; vatAmount: string; totalDue: string };
  paymentTerms: { paymentDeadline: string; paymentMethods: string[]; bankDetails: { accountName: string; sortCode: string; accountNumber: string }; paymentReference: string };
  latePaymentClause: string;
  notes: string[];
}

export async function generateInvoiceDocx(invoiceData: InvoiceData, design: ClientDesign): Promise<Uint8Array> {
  const colours = parseBrandColours(design.brandColours);
  const primaryHex = colours.primary.replace('#', '');
  const accentHex = colours.accent.replace('#', '');
  const children: Paragraph[] = [];

  const headerTable = new Table({
    rows: [new TableRow({ children: [
      new TableCell({ children: [
        new Paragraph({ children: [new TextRun({ text: invoiceData.businessInfo.name, bold: true, size: 28, font: 'Calibri', color: primaryHex })] }),
        new Paragraph({ children: [new TextRun({ text: invoiceData.businessInfo.address, size: 18, font: 'Calibri', color: '262626' })], spacing: { before: 40 } }),
        new Paragraph({ children: [new TextRun({ text: invoiceData.businessInfo.phone, size: 18, font: 'Calibri', color: '262626' })] }),
        new Paragraph({ children: [new TextRun({ text: invoiceData.businessInfo.email, size: 18, font: 'Calibri', color: '262626' })] }),
      ], verticalAlign: VerticalAlign.TOP, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }),
      new TableCell({ children: [
        new Paragraph({ children: [new TextRun({ text: 'Invoice Details', bold: true, size: 20, font: 'Calibri', color: primaryHex })] }),
        new Paragraph({ children: [new TextRun({ text: `Invoice: ${invoiceData.invoiceFields.invoiceNumberFormat}`, size: 18, font: 'Calibri', color: '262626' })], spacing: { before: 80 } }),
        new Paragraph({ children: [new TextRun({ text: `Date: ${invoiceData.invoiceFields.dateFormat}`, size: 18, font: 'Calibri', color: '262626' })] }),
        new Paragraph({ children: [new TextRun({ text: `Due: ${invoiceData.invoiceFields.dueDateFormat}`, size: 18, font: 'Calibri', color: '262626' })] }),
        new Paragraph({ children: [new TextRun({ text: `PO: ${invoiceData.invoiceFields.poNumberFormat}`, size: 18, font: 'Calibri', color: '262626' })] }),
      ], verticalAlign: VerticalAlign.TOP, shading: { type: ShadingType.CLEAR, fill: primaryHex + '08' } }),
    ] })],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
  });
  children.push(headerTable); children.push(new Paragraph({ spacing: { after: 200 } }));

  children.push(new Paragraph({ children: [new TextRun({ text: 'BILL TO', bold: true, size: 22, font: 'Calibri', color: primaryHex })], spacing: { after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentHex } } }));
  const billToTable = new Table({ rows: [new TableRow({ children: [new TableCell({ children: [
    new Paragraph({ children: [new TextRun({ text: invoiceData.billToPlaceholders.clientName, bold: true, size: 20, font: 'Calibri', color: '262626' })] }),
    new Paragraph({ children: [new TextRun({ text: invoiceData.billToPlaceholders.company, size: 20, font: 'Calibri', color: '262626' })], spacing: { before: 40 } }),
    new Paragraph({ children: [new TextRun({ text: invoiceData.billToPlaceholders.addressLine1, size: 20, font: 'Calibri', color: '262626' })] }),
    new Paragraph({ children: [new TextRun({ text: invoiceData.billToPlaceholders.addressLine2, size: 20, font: 'Calibri', color: '262626' })] }),
    new Paragraph({ children: [new TextRun({ text: invoiceData.billToPlaceholders.email, size: 20, font: 'Calibri', color: '262626' })], spacing: { before: 40 } }),
    new Paragraph({ children: [new TextRun({ text: invoiceData.billToPlaceholders.phone, size: 20, font: 'Calibri', color: '262626' })] }),
  ], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] })], width: { size: 100, type: WidthType.PERCENTAGE } });
  children.push(billToTable); children.push(new Paragraph({ spacing: { after: 300 } }));

  children.push(new Paragraph({ children: [new TextRun({ text: 'SERVICES RENDERED', bold: true, size: 22, font: 'Calibri', color: primaryHex })], spacing: { after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentHex } } }));
  const lineItemsRows: TableRow[] = [new TableRow({ children: [
    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true, size: 20, font: 'Calibri', color: 'FFFFFF' })], alignment: AlignmentType.LEFT })], shading: { type: ShadingType.CLEAR, fill: primaryHex }, verticalAlign: VerticalAlign.CENTER }),
    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Quantity', bold: true, size: 20, font: 'Calibri', color: 'FFFFFF' })], alignment: AlignmentType.CENTER })], shading: { type: ShadingType.CLEAR, fill: primaryHex }, verticalAlign: VerticalAlign.CENTER }),
    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Unit Price', bold: true, size: 20, font: 'Calibri', color: 'FFFFFF' })], alignment: AlignmentType.RIGHT })], shading: { type: ShadingType.CLEAR, fill: primaryHex }, verticalAlign: VerticalAlign.CENTER }),
    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Amount', bold: true, size: 20, font: 'Calibri', color: 'FFFFFF' })], alignment: AlignmentType.RIGHT })], shading: { type: ShadingType.CLEAR, fill: primaryHex }, verticalAlign: VerticalAlign.CENTER }),
  ], height: { value: 400, rule: 'auto' } })];
  invoiceData.lineItems.forEach((item, idx) => {
    lineItemsRows.push(new TableRow({ children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.description, size: 20, font: 'Calibri', color: '262626' })], alignment: AlignmentType.LEFT })], shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? 'FFFFFF' : primaryHex + '08' } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.quantity, size: 20, font: 'Calibri', color: '262626' })], alignment: AlignmentType.CENTER })], shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? 'FFFFFF' : primaryHex + '08' } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.unitPrice, size: 20, font: 'Calibri', color: '262626' })], alignment: AlignmentType.RIGHT })], shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? 'FFFFFF' : primaryHex + '08' } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.amount, size: 20, font: 'Calibri', color: '262626' })], alignment: AlignmentType.RIGHT })], shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? 'FFFFFF' : primaryHex + '08' } }),
    ], height: { value: 300, rule: 'auto' } }));
  });
  const lineItemsTable = new Table({ rows: lineItemsRows, width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, left: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, right: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }, insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } } });
  children.push(lineItemsTable); children.push(new Paragraph({ spacing: { after: 200 } }));

  const totalsRows = [
    new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '', size: 20, font: 'Calibri' })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Subtotal', size: 20, font: 'Calibri', color: '262626' })], alignment: AlignmentType.RIGHT })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: invoiceData.totals.subtotal, size: 20, font: 'Calibri', bold: true, color: '262626' })], alignment: AlignmentType.RIGHT })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
    new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '', size: 20, font: 'Calibri' })] })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `VAT (${invoiceData.totals.vatPercentage}%)`, size: 20, font: 'Calibri', color: '262626' })], alignment: AlignmentType.RIGHT })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: invoiceData.totals.vatAmount, size: 20, font: 'Calibri', bold: true, color: '262626' })], alignment: AlignmentType.RIGHT })], borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
    new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '', size: 20, font: 'Calibri' })] })], borders: { top: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TOTAL DUE', size: 22, font: 'Calibri', bold: true, color: 'FFFFFF' })], alignment: AlignmentType.RIGHT })], shading: { type: ShadingType.CLEAR, fill: primaryHex }, borders: { top: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: invoiceData.totals.totalDue, size: 22, font: 'Calibri', bold: true, color: 'FFFFFF' })], alignment: AlignmentType.RIGHT })], shading: { type: ShadingType.CLEAR, fill: primaryHex }, borders: { top: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryHex }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } })] }),
  ];
  children.push(new Table({ rows: totalsRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  children.push(new Paragraph({ spacing: { after: 300 } }));

  children.push(new Paragraph({ children: [new TextRun({ text: 'PAYMENT TERMS & METHODS', bold: true, size: 22, font: 'Calibri', color: primaryHex })], spacing: { after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentHex } } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Payment Deadline: ${invoiceData.paymentTerms.paymentDeadline}`, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 80 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: 'Accepted Payment Methods:', bold: true, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 40 } }));
  invoiceData.paymentTerms.paymentMethods.forEach(method => { children.push(new Paragraph({ children: [new TextRun({ text: method, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 20 }, indent: { left: 720 } })); });
  children.push(new Paragraph({ spacing: { after: 100 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: 'Bank Details:', bold: true, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 40 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Account: ${invoiceData.paymentTerms.bankDetails.accountName}`, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 20 }, indent: { left: 720 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Sort Code: ${invoiceData.paymentTerms.bankDetails.sortCode}`, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 20 }, indent: { left: 720 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Account Number: ${invoiceData.paymentTerms.bankDetails.accountNumber}`, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 100 }, indent: { left: 720 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Reference: ${invoiceData.paymentTerms.paymentReference}`, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 200 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: 'LATE PAYMENT NOTICE', bold: true, size: 22, font: 'Calibri', color: primaryHex })], spacing: { after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentHex } } }));
  children.push(new Paragraph({ children: [new TextRun({ text: invoiceData.latePaymentClause, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 200 } }));
  if (invoiceData.notes && invoiceData.notes.length > 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: 'NOTES', bold: true, size: 22, font: 'Calibri', color: primaryHex })], spacing: { after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentHex } } }));
    invoiceData.notes.forEach(note => { children.push(new Paragraph({ children: [new TextRun({ text: note, size: 20, font: 'Calibri', color: '262626' })], spacing: { after: 40 }, indent: { left: 720 } })); });
    children.push(new Paragraph({ spacing: { after: 200 } }));
  }
  children.push(new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 4, color: primaryHex } }, spacing: { before: 400 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: 'Thank you for your business.', italics: true, size: 20, font: 'Calibri', color: '262626' })], alignment: AlignmentType.CENTER, spacing: { after: 40 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `${invoiceData.businessInfo.name} | ${invoiceData.businessInfo.email} | ${invoiceData.businessInfo.phone} | ${invoiceData.businessInfo.website}`, italics: true, size: 18, font: 'Calibri', color: '262626' })], alignment: AlignmentType.CENTER }));

  const doc = new DocxDocument({ sections: [{ properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children }] });
  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}
