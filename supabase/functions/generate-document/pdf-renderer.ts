// ─────────────────────────────────────────────────────────────────────────────
// PDF RENDERER — Professional-grade JSON-driven PDF generation using jsPDF
// ─────────────────────────────────────────────────────────────────────────────

import { jsPDF } from 'npm:jspdf@2.5.2';
import {
  AnyDocument, DocumentModel, DocumentMetadata, DocumentSection, DocumentBlock,
  HeadingBlock, ParagraphBlock, ClauseBlock, BulletBlock, TableBlock,
  CalloutBlock, SignatureBlock, DividerBlock, BlockDensity,
  detectDocumentKind, InvoiceDocument, LatePaymentDocument, WelcomeEmailDocument,
  StructuredDocument,
} from './document-types.ts';
import { DesignSystem, resolveDesignSystem, hexToToken, tintColour } from './design-system.ts';
import { ClientDesign, parseBrandColours } from './rendering.ts';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M_LEFT = 57;
const M_RIGHT = 57;
const M_TOP = 64;
const M_BOTTOM = 64;
const HEADER_H = 30;
const FOOTER_H = 24;
const CONTENT_W = PAGE_W - M_LEFT - M_RIGHT;

// ─────────────────────────────────────────────────────────────────────────────
// PDF LAYOUT ENGINE CLASS
// ─────────────────────────────────────────────────────────────────────────────

class PdfLayoutEngine {
  public doc: jsPDF;
  private ds: DesignSystem;
  private metadata: DocumentMetadata | null = null;
  private logoBase64: string | null;
  private y: number;
  private pageNum = 1;

  // Pre-computed RGB arrays for colour tokens
  private readonly primRgb: [number, number, number];
  private readonly secRgb: [number, number, number];
  private readonly accentRgb: [number, number, number];
  private readonly surfaceRgb: [number, number, number];
  private readonly bodyRgb: [number, number, number];
  private readonly mutedRgb: [number, number, number];
  // jsPDF font family mapping (Georgia -> times, Calibri -> helvetica)
  private readonly fontFamily: string;

  constructor(design: ClientDesign) {
    this.doc = new jsPDF({ unit: 'pt', format: 'a4', hotfixes: ['px_scaling'] });
    this.ds = resolveDesignSystem(design);
    this.logoBase64 = design.logoBase64;
    this.y = M_TOP + HEADER_H + 12;

    // Pre-compute RGB values from DesignSystem colour tokens
    this.primRgb = [this.ds.primary.r, this.ds.primary.g, this.ds.primary.b];
    this.secRgb = [this.ds.secondary.r, this.ds.secondary.g, this.ds.secondary.b];
    this.accentRgb = [this.ds.accent.r, this.ds.accent.g, this.ds.accent.b];
    this.surfaceRgb = [this.ds.surface.r, this.ds.surface.g, this.ds.surface.b];
    this.bodyRgb = [this.ds.bodyTextColour.r, this.ds.bodyTextColour.g, this.ds.bodyTextColour.b];
    this.mutedRgb = [this.ds.mutedTextColour.r, this.ds.mutedTextColour.g, this.ds.mutedTextColour.b];
    // Map Georgia to times (serif), Calibri to helvetica (sans-serif)
    this.fontFamily = this.ds.font === 'Georgia' ? 'times' : 'helvetica';
  }

  setMetadata(metadata: DocumentMetadata): void {
    this.metadata = metadata;
  }

  // ── Layout Helpers ──

  private measureH(text: string | string[], fontSizePt: number, maxWidth: number, lineSpacing: number = 5): number {
    this.doc.setFontSize(fontSizePt);
    const lines = Array.isArray(text) ? text : this.doc.splitTextToSize(text, maxWidth);
    return lines.length * lineSpacing;
  }

  private ensureSpace(needed: number): void {
    const bottomBoundary = PAGE_H - M_BOTTOM - FOOTER_H - 10;
    if (this.y + needed > bottomBoundary) {
      this.addPage();
    }
  }

  private addPage(): void {
    this.doc.addPage();
    this.pageNum++;
    this.y = M_TOP + HEADER_H + 12;
    this.drawPageHeader();
    this.drawPageFooter();
  }

  // ── Primitive Drawing ──

  private drawText(text: string, x: number, y: number, options?: { fontSize?: number; colour?: 'primary' | 'secondary' | 'accent' | 'body' | 'muted' | 'white'; weight?: 'normal' | 'bold'; maxWidth?: number; align?: 'left' | 'center' | 'right' }): void {
    const fontSize = options?.fontSize ?? this.ds.type.bodyPt;
    const colour = options?.colour ?? 'body';
    const weight = options?.weight ?? 'normal';
    const align = options?.align ?? 'left';

    this.doc.setFontSize(fontSize);
    this.doc.setFont(this.fontFamily, weight);

    const rgbMap: Record<string, [number, number, number]> = {
      primary: this.primRgb,
      secondary: this.secRgb,
      accent: this.accentRgb,
      body: this.bodyRgb,
      muted: this.mutedRgb,
      white: [255, 255, 255],
    };
    this.doc.setTextColor(...rgbMap[colour]);

    if (options?.maxWidth) {
      const lines = this.doc.splitTextToSize(text, options.maxWidth);
      for (const line of lines) {
        this.doc.text(line, x, y, { align } as any);
        y += fontSize * 0.45;
      }
    } else {
      this.doc.text(text, x, y, { align } as any);
    }
  }

  private drawRule(x1: number, y: number, x2: number, colour: 'primary' | 'secondary' | 'accent' | 'muted' = 'primary', weight: number = 0.8): void {
    const rgbMap: Record<string, [number, number, number]> = {
      primary: this.primRgb,
      secondary: this.secRgb,
      accent: this.accentRgb,
      muted: this.mutedRgb,
    };
    this.doc.setDrawColor(...rgbMap[colour]);
    this.doc.setLineWidth(weight);
    this.doc.line(x1, y, x2, y);
  }

  private drawRect(x: number, y: number, w: number, h: number, colour: 'primary' | 'secondary' | 'accent' | 'surface', opacity: number = 1.0): void {
    const rgbMap: Record<string, [number, number, number]> = {
      primary: this.primRgb,
      secondary: this.secRgb,
      accent: this.accentRgb,
      surface: this.surfaceRgb,
    };
    const [r, g, b] = rgbMap[colour];
    this.doc.setFillColor(r, g, b);
    if (opacity < 1.0) {
      this.doc.setGState(new (this.doc as any).GState({ opacity }));
    }
    this.doc.rect(x, y, w, h, 'F');
    this.doc.setGState(new (this.doc as any).GState({ opacity: 1.0 }));
  }

  private drawImage(dataUrl: string, x: number, y: number, maxW: number, maxH: number): void {
    try {
      const format = dataUrl.includes('image/png') ? 'PNG' : 'JPEG';
      this.doc.addImage(dataUrl, format, x, y, maxW, maxH, undefined, 'FAST');
    } catch {
      // Logo rendering must always be wrapped in try/catch per hard constraints
    }
  }

  private addSpacing(pt: number): void {
    this.y += pt;
  }

  // ── Page Chrome ──

  private drawPageHeader(): void {
    const headerY = M_TOP - 6;

    // Top accent line
    if (this.ds.useTopAccentBar) {
      this.drawRect(0, 0, PAGE_W, 4, 'accent');
    }

    // Business name
    this.doc.setFontSize(8);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    const businessName = this.metadata?.businessName || 'Foundationary';
    this.doc.text(businessName, M_LEFT, headerY);

    // Page number on right
    this.doc.setTextColor(...this.mutedRgb);
    this.doc.setFont(this.fontFamily, 'normal');
    this.doc.text(`Page ${this.pageNum}`, PAGE_W - M_RIGHT, headerY, { align: 'right' });

    // Thin rule below header
    this.drawRule(M_LEFT, headerY + 6, PAGE_W - M_RIGHT, 'accent', 0.4);
  }

  private drawPageFooter(): void {
    const footerY = PAGE_H - M_BOTTOM + 6;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    this.drawRule(M_LEFT, footerY - 10, PAGE_W - M_RIGHT, 'accent', 0.4);

    this.doc.setFontSize(7);
    this.doc.setFont(this.fontFamily, 'italic');
    this.doc.setTextColor(...this.mutedRgb);
    this.doc.text(`Generated by Foundationary  |  ${dateStr}`, M_LEFT, footerY);
  }

  // ── Cover Page ──

  drawCoverPage(displayName: string, docLabel: string): void {
    // Top gradient bar
    this.drawRect(0, 0, PAGE_W * 0.6, 4, 'primary');
    this.drawRect(PAGE_W * 0.6, 0, PAGE_W * 0.4, 4, 'accent');

    // Bottom accent (subtle)
    this.drawRect(0, PAGE_H - 4, PAGE_W, 4, 'primary', 0.15);

    // Left accent bar (decorative)
    const accentBarX = M_LEFT - 12;
    const accentBarY = PAGE_H * 0.28;
    const accentBarH = PAGE_H * 0.40;
    this.drawRect(accentBarX, accentBarY, 4, accentBarH, 'accent');

    // Logo
    const logoY = PAGE_H * 0.28;
    if (this.logoBase64) {
      try {
        this.drawImage(this.logoBase64, M_LEFT, logoY, 120, 45);
      } catch {
        // Logo rendering must always be wrapped in try/catch
      }
    }

    // Title
    const titleY = PAGE_H * 0.42;
    this.doc.setFontSize(this.ds.type.displayPt);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    const titleLines = this.doc.splitTextToSize(docLabel, CONTENT_W);
    let lineY = titleY;
    for (const line of titleLines) {
      this.doc.text(line, M_LEFT, lineY);
      lineY += this.ds.type.displayPt * 0.5;
    }

    // Subtitle
    let nextY = lineY + 14;
    this.doc.setFontSize(this.ds.type.h2Pt);
    this.doc.setFont(this.fontFamily, 'italic');
    this.doc.setTextColor(...this.secRgb);
    this.doc.text(`Prepared for ${displayName}`, M_LEFT, nextY);

    // Business name
    nextY += 18;
    this.doc.setFontSize(this.ds.type.smallPt);
    this.doc.setTextColor(...this.mutedRgb);
    this.doc.setFont(this.fontFamily, 'normal');
    const bizName = this.metadata?.businessName || '';
    if (bizName) {
      this.doc.text(bizName, M_LEFT, nextY);
    }

    // Date
    nextY += 14;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    this.doc.text(dateStr, M_LEFT, nextY);

    // Heavy separator rule
    nextY += 24;
    this.drawRule(M_LEFT, nextY, PAGE_W - M_RIGHT, 'primary', 1.6);
    nextY += 8;
    this.drawRule(M_LEFT, nextY, PAGE_W - M_RIGHT, 'accent', 0.4);

    // Footer on cover page
    this.drawPageFooter();

    // New page for content
    this.doc.addPage();
    this.pageNum = 2;
    this.y = M_TOP + HEADER_H + 12;
    this.drawPageHeader();
    this.drawPageFooter();
  }

  // ── Section Heading ──

  drawSectionHeading(text: string): void {
    this.ensureSpace(36);
    const headingY = this.y;

    // Section heading box
    this.drawRect(M_LEFT, headingY - 4, CONTENT_W, 22, 'surface');

    // Left accent bar
    this.drawRect(M_LEFT, headingY - 4, 3, 22, 'accent');

    // Title text
    this.doc.setFontSize(this.ds.type.h1Pt);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    this.doc.text(text, M_LEFT + 12, headingY + 10);

    // Rule below
    this.drawRule(M_LEFT, headingY + 20, PAGE_W - M_RIGHT, 'accent', 0.6);

    this.y = headingY + 32;
  }

  // ── Block Renderers ──

  drawBlock(block: DocumentBlock, sectionDensity?: BlockDensity): void {
    switch (block.type) {
      case 'heading':
        this.drawHeadingBlock(block as HeadingBlock);
        break;
      case 'paragraph':
        this.drawParagraphBlock(block as ParagraphBlock, sectionDensity);
        break;
      case 'clause':
        this.drawClauseBlock(block as ClauseBlock, sectionDensity);
        break;
      case 'bullet':
        this.drawBulletBlock(block as BulletBlock);
        break;
      case 'table':
        this.drawTableBlock(block as TableBlock);
        break;
      case 'callout':
        this.drawCalloutBlock(block as CalloutBlock);
        break;
      case 'signature':
        this.drawSignatureBlock(block as SignatureBlock);
        break;
      case 'divider':
        this.drawDividerBlock(block as DividerBlock);
        break;
    }
  }

  drawHeadingBlock(block: HeadingBlock): void {
    const fontSize = block.variant === 'section' ? this.ds.type.h1Pt
      : block.variant === 'subsection' ? this.ds.type.h2Pt
      : this.ds.type.h3Pt;

    this.ensureSpace(fontSize + 16);

    this.doc.setFontSize(fontSize);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...(block.variant === 'section' ? this.primRgb : this.secRgb));
    this.doc.text(block.text, M_LEFT, this.y);

    this.y += fontSize + 10;
  }

  drawParagraphBlock(block: ParagraphBlock, density?: BlockDensity): void {
    const spacing = (density ?? block.density ?? 'normal') === 'compact' ? 6 : (density ?? block.density) === 'airy' ? 14 : 10;

    this.doc.setFontSize(this.ds.type.bodyPt);
    this.doc.setFont(this.fontFamily, 'normal');
    this.doc.setTextColor(...this.bodyRgb);

    const lines = this.doc.splitTextToSize(block.text, CONTENT_W);
    const totalH = lines.length * spacing;
    this.ensureSpace(totalH);

    for (const line of lines) {
      this.doc.text(line, M_LEFT, this.y);
      this.y += spacing;
    }
    this.y += 4;
  }

  drawClauseBlock(block: ClauseBlock, density?: BlockDensity): void {
    const spacing = (density ?? block.density ?? 'normal') === 'compact' ? 5 : 6;

    // Measure number width
    this.doc.setFontSize(this.ds.type.bodyPt);
    this.doc.setFont(this.fontFamily, 'bold');
    const numW = this.doc.getTextWidth(block.number + '. ') + 4;
    const indent = Math.max(numW, 36);

    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    this.doc.text(block.number + '.', M_LEFT, this.y);

    this.doc.setFont(this.fontFamily, 'normal');
    this.doc.setTextColor(...this.bodyRgb);

    const bodyLines = this.doc.splitTextToSize(block.text, CONTENT_W - indent);
    const totalH = bodyLines.length * spacing;
    this.ensureSpace(totalH);

    for (let i = 0; i < bodyLines.length; i++) {
      this.doc.text(bodyLines[i], M_LEFT + indent, this.y);
      this.y += spacing;
    }
    this.y += 3;
  }

  drawBulletBlock(block: BulletBlock): void {
    this.ensureSpace(8);

    this.doc.setFontSize(this.ds.type.bodyPt);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.accentRgb);
    this.doc.text('\u2022', M_LEFT + 8, this.y);

    this.doc.setFont(this.fontFamily, 'normal');
    this.doc.setTextColor(...this.bodyRgb);

    const lines = this.doc.splitTextToSize(block.text, CONTENT_W - 20);
    for (const line of lines) {
      this.doc.text(line, M_LEFT + 18, this.y);
      this.y += 5;
    }
    this.y += 3;
  }

  drawTableBlock(block: TableBlock): void {
    if (!block.headers || block.headers.length === 0 || !block.rows || block.rows.length === 0) {
      return;
    }

    const colCount = block.headers.length;
    const colW = CONTENT_W / colCount;
    const rowH = 14;

    this.ensureSpace((block.rows.length + 1) * rowH + 18);

    // Header row
    this.drawRect(M_LEFT, this.y, CONTENT_W, rowH, 'primary');

    this.doc.setFontSize(this.ds.type.smallPt + 1);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(255, 255, 255);

    let colX = M_LEFT;
    for (const h of block.headers) {
      this.doc.text(h, colX + 6, this.y + 10, { maxWidth: colW - 12, align: 'left' } as any);
      colX += colW;
    }
    this.y += rowH;

    // Data rows
    for (let ri = 0; ri < block.rows.length; ri++) {
      const row = block.rows[ri];

      if (this.y + rowH > PAGE_H - M_BOTTOM - FOOTER_H - 10) {
        this.addPage();
        // Re-draw header on new page
        this.drawRect(M_LEFT, this.y, CONTENT_W, rowH, 'primary');
        this.doc.setFontSize(this.ds.type.smallPt + 1);
        this.doc.setFont(this.fontFamily, 'bold');
        this.doc.setTextColor(255, 255, 255);
        colX = M_LEFT;
        for (const h of block.headers) {
          this.doc.text(h, colX + 6, this.y + 10, { maxWidth: colW - 12, align: 'left' } as any);
          colX += colW;
        }
        this.y += rowH;
      }

      const isEvenRow = ri % 2 === 0;
      if (isEvenRow) {
        this.drawRect(M_LEFT, this.y, CONTENT_W, rowH, 'surface');
      }

      this.doc.setFontSize(this.ds.type.bodyPt);
      this.doc.setFont(this.fontFamily, 'normal');
      this.doc.setTextColor(...this.bodyRgb);

      colX = M_LEFT;
      for (const cell of row) {
        this.doc.text(cell, colX + 6, this.y + 10, { maxWidth: colW - 12, align: 'left' } as any);
        colX += colW;
      }

      // Rule below row
      this.doc.setDrawColor(...this.mutedRgb);
      this.doc.setLineWidth(0.2);
      this.doc.line(M_LEFT, this.y + rowH, PAGE_W - M_RIGHT, this.y + rowH);

      this.y += rowH;
    }

    this.y += 8;
  }

  drawCalloutBlock(block: CalloutBlock): void {
    this.ensureSpace(40);

    // Box with left border
    this.doc.setFillColor(...this.surfaceRgb);
    this.doc.rect(M_LEFT, this.y, CONTENT_W, 36, 'F');

    this.doc.setDrawColor(...this.accentRgb);
    this.doc.setLineWidth(3);
    this.doc.line(M_LEFT, this.y, M_LEFT, this.y + 36);

    // Label
    if (block.label) {
      this.doc.setFontSize(this.ds.type.smallPt + 1);
      this.doc.setFont(this.fontFamily, 'bold');
      this.doc.setTextColor(...this.primRgb);
      this.doc.text(block.label.toUpperCase(), M_LEFT + 10, this.y + 12);
    }

    // Text
    this.doc.setFontSize(this.ds.type.bodyPt);
    this.doc.setFont(this.fontFamily, 'italic');
    this.doc.setTextColor(...this.bodyRgb);

    const textLines = this.doc.splitTextToSize(block.text, CONTENT_W - 20);
    let textY = this.y + (block.label ? 18 : 12);
    for (const line of textLines) {
      this.doc.text(line, M_LEFT + 10, textY);
      textY += 5;
    }

    this.y += Math.max(36, (textLines.length * 5) + 12);
  }

  drawSignatureBlock(block: SignatureBlock): void {
    this.ensureSpace(90);

    // Box
    this.doc.setFillColor(...this.surfaceRgb);
    this.doc.setDrawColor(226, 230, 237);
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(M_LEFT, this.y, CONTENT_W, 75, 3, 3, 'FD');

    for (const party of block.parties) {
      // Party label
      this.doc.setFontSize(this.ds.type.bodyPt);
      this.doc.setFont(this.fontFamily, 'bold');
      this.doc.setTextColor(...this.primRgb);
      this.doc.text(party.label, M_LEFT + 10, this.y + 12);

      // Sign line
      this.doc.setDrawColor(...this.mutedRgb);
      this.doc.setLineWidth(0.2);
      this.doc.line(M_LEFT + 10, this.y + 28, M_LEFT + 200, this.y + 28);
      this.doc.line(M_LEFT + 10, this.y + 42, M_LEFT + 200, this.y + 42);

      // Labels
      this.doc.setFontSize(this.ds.type.smallPt);
      this.doc.setTextColor(...this.mutedRgb);
      this.doc.text('Signed:', M_LEFT + 10, this.y + 32);
      this.doc.text('Date:', M_LEFT + 10, this.y + 46);

      // Name
      this.doc.setFontSize(this.ds.type.smallPt + 1);
      this.doc.setTextColor(...this.bodyRgb);
      this.doc.text(`${party.nameField}: ${party.dateField}`, M_LEFT + 10, this.y + 60);

      this.y += 80;
    }
  }

  drawDividerBlock(block: DividerBlock): void {
    const weight = block.weight === 'heavy' ? 1.0 : 0.3;
    const colour = block.weight === 'heavy' ? 'primary' : 'muted';

    this.drawRule(M_LEFT, this.y + 4, PAGE_W - M_RIGHT, colour, weight);
    this.y += 12;
  }

  // ── Section Rendering ──

  drawSection(section: DocumentSection): void {
    if (section.heading) {
      this.drawSectionHeading(section.heading);
    }

    for (const block of section.blocks) {
      this.drawBlock(block, section.density);
    }

    this.y += 10;
  }

  // ── Invoice Rendering ──

  drawInvoice(doc: InvoiceDocument): void {
    // Top bar
    this.drawRect(0, 0, PAGE_W, 4, 'primary');

    let startY = M_TOP + 10;

    // Logo
    if (this.logoBase64) {
      try {
        this.drawImage(this.logoBase64, M_LEFT, startY, 80, 36);
        startY += 42;
      } catch {
        // Logo rendering must always be wrapped in try/catch
      }
    }

    // Business info
    this.doc.setFontSize(14);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    this.doc.text(doc.businessInfo.tradingName, M_LEFT, startY);
    startY += 10;

    this.doc.setFontSize(8);
    this.doc.setFont(this.fontFamily, 'normal');
    this.doc.setTextColor(...this.bodyRgb);
    for (const line of [doc.businessInfo.address, doc.businessInfo.phone, doc.businessInfo.email]) {
      if (line) {
        this.doc.text(line, M_LEFT, startY);
        startY += 8;
      }
    }

    if (doc.metadata.vatRegistered && doc.metadata.vatNumber) {
      this.doc.text(`VAT No: ${doc.metadata.vatNumber}`, M_LEFT, startY);
      startY += 8;
    }

    // Invoice details box (right side)
    const rightX = PAGE_W - M_RIGHT - 140;
    this.drawRect(rightX, M_TOP + 10, 140, 56, 'surface');

    this.doc.setFontSize(9);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    this.doc.text('Invoice Details', rightX + 10, M_TOP + 24);

    this.doc.setFontSize(8);
    this.doc.setFont(this.fontFamily, 'normal');
    this.doc.setTextColor(...this.bodyRgb);

    let detailY = M_TOP + 34;
    this.doc.text(`Invoice: ${doc.invoiceFields.invoiceNumberFormat}`, rightX + 10, detailY); detailY += 8;
    this.doc.text(`Date: ${doc.invoiceFields.dateFormat}`, rightX + 10, detailY); detailY += 8;
    this.doc.text(`Due: ${doc.invoiceFields.dueDateFormat}`, rightX + 10, detailY);
    if (doc.invoiceFields.showPoNumber) {
      detailY += 8;
      this.doc.text(`PO: ${doc.invoiceFields.poNumberFormat}`, rightX + 10, detailY);
    }

    this.y = M_TOP + 75;

    // Bill To
    this.drawRect(M_LEFT, this.y, CONTENT_W, 40, 'surface');
    this.doc.setFontSize(10);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    this.doc.text('BILL TO', M_LEFT + 10, this.y + 12);

    this.doc.setFontSize(9);
    this.doc.setFont(this.fontFamily, 'normal');
    this.doc.setTextColor(...this.bodyRgb);

    let billY = this.y + 22;
    for (const line of [doc.billToPlaceholders.clientName, doc.billToPlaceholders.company, doc.billToPlaceholders.addressLine1, doc.billToPlaceholders.addressLine2]) {
      if (line) {
        this.doc.text(line, M_LEFT + 10, billY);
        billY += 7;
      }
    }
    this.y += 50;

    // Services label
    this.doc.setFontSize(10);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    this.doc.text('SERVICES RENDERED', M_LEFT, this.y);
    this.y += 4;

    // Table
    const tableBlock: TableBlock = {
      type: 'table',
      id: 'services-table',
      styleHint: 'financial',
      headers: ['Description', 'Qty', 'Unit Price', 'Amount'],
      rows: doc.lineItems.map(i => [i.description, i.quantity, i.unitPrice, i.amount]),
    };
    this.drawTableBlock(tableBlock);

    this.y += 6;

    // Totals
    const totalsX = PAGE_W - M_RIGHT - 160;
    this.doc.setFontSize(9);
    this.doc.setTextColor(...this.bodyRgb);

    this.doc.text('Subtotal', totalsX, this.y);
    this.doc.text(doc.totals.subtotal, PAGE_W - M_RIGHT, this.y, { align: 'right' } as any);
    this.y += 10;

    if (doc.totals.showVatLine) {
      this.doc.text(`VAT (${doc.totals.vatPercentage}%)`, totalsX, this.y);
      this.doc.text(doc.totals.vatAmount, PAGE_W - M_RIGHT, this.y, { align: 'right' } as any);
      this.y += 10;
    }

    // Total bar
    this.drawRect(totalsX - 4, this.y - 4, PAGE_W - M_RIGHT - totalsX + 8, 14, 'primary');
    this.doc.setFontSize(10);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('TOTAL DUE', totalsX + 4, this.y + 5);
    this.doc.text(doc.totals.totalDue, PAGE_W - M_RIGHT - 4, this.y + 5, { align: 'right' } as any);
    this.y += 22;

    // Payment Terms
    this.ensureSpace(60);
    this.doc.setFontSize(10);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    this.doc.text('PAYMENT TERMS & METHODS', M_LEFT, this.y);
    this.drawRule(M_LEFT, this.y + 2, PAGE_W - M_RIGHT, 'accent', 0.4);
    this.y += 12;

    this.doc.setFontSize(9);
    this.doc.setFont(this.fontFamily, 'normal');
    this.doc.setTextColor(...this.bodyRgb);
    this.doc.text(doc.paymentTerms.paymentDeadline, M_LEFT, this.y);
    this.y += 10;

    for (const m of doc.paymentTerms.paymentMethods) {
      this.ensureSpace(10);
      this.doc.setFont(this.fontFamily, 'bold');
      this.doc.setTextColor(...this.accentRgb);
      this.doc.text('\u2022', M_LEFT + 8, this.y);
      this.doc.setFont(this.fontFamily, 'normal');
      this.doc.setTextColor(...this.bodyRgb);
      this.doc.text(m, M_LEFT + 16, this.y);
      this.y += 8;
    }

    if (doc.paymentTerms.bankTransferDetails.show) {
      this.y += 4;
      this.doc.setFont(this.fontFamily, 'bold');
      this.doc.text('Bank Details:', M_LEFT, this.y);
      this.y += 8;
      this.doc.setFont(this.fontFamily, 'normal');
      this.doc.text(`Account: ${doc.paymentTerms.bankTransferDetails.accountName}`, M_LEFT + 16, this.y); this.y += 7;
      this.doc.text(`Sort Code: ${doc.paymentTerms.bankTransferDetails.sortCode}`, M_LEFT + 16, this.y); this.y += 7;
      this.doc.text(`Account No: ${doc.paymentTerms.bankTransferDetails.accountNumber}`, M_LEFT + 16, this.y); this.y += 7;
    }

    this.doc.text(`Reference: ${doc.paymentTerms.paymentReference}`, M_LEFT, this.y);
    this.y += 16;

    // Late payment notice
    this.ensureSpace(30);
    this.doc.setFontSize(10);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    this.doc.text('LATE PAYMENT NOTICE', M_LEFT, this.y);
    this.drawRule(M_LEFT, this.y + 2, PAGE_W - M_RIGHT, 'accent', 0.4);
    this.y += 12;

    this.doc.setFontSize(8);
    this.doc.setFont(this.fontFamily, 'normal');
    this.doc.setTextColor(...this.bodyRgb);
    const lpLines = this.doc.splitTextToSize(doc.latePaymentClause, CONTENT_W);
    for (const line of lpLines) {
      this.doc.text(line, M_LEFT, this.y);
      this.y += 4;
    }
    this.y += 8;

    // Notes
    if (doc.optionalFields.showNotesSection) {
      this.ensureSpace(20);
      this.doc.setFontSize(10);
      this.doc.setFont(this.fontFamily, 'bold');
      this.doc.setTextColor(...this.primRgb);
      this.doc.text('NOTES', M_LEFT, this.y);
      this.y += 10;
      this.doc.setFontSize(8);
      this.doc.setFont(this.fontFamily, 'normal');
      this.doc.setTextColor(...this.bodyRgb);
      const noteLines = this.doc.splitTextToSize(doc.optionalFields.notesPlaceholder, CONTENT_W);
      for (const line of noteLines) {
        this.doc.text(line, M_LEFT, this.y);
        this.y += 4;
      }
      this.y += 8;
    }

    // Footer
    this.y += 20;
    this.drawRule(M_LEFT, this.y, PAGE_W - M_RIGHT, 'primary', 0.6);
    this.y += 10;
    this.doc.setFontSize(8);
    this.doc.setFont(this.fontFamily, 'italic');
    this.doc.setTextColor(...this.mutedRgb);
    this.doc.text('Thank you for your business.', PAGE_W / 2, this.y, { align: 'center' } as any);
    this.y += 8;
    this.doc.text(`${doc.businessInfo.legalName}  |  ${doc.businessInfo.email}  |  ${doc.businessInfo.phone}`, PAGE_W / 2, this.y, { align: 'center' } as any);
  }

  // ── Late Payment Letters Rendering ──

  drawLatePayment(doc: LatePaymentDocument): void {
    // Top bar
    this.drawRect(0, 0, PAGE_W, 4, 'primary');

    for (let li = 0; li < doc.letters.length; li++) {
      if (li > 0) {
        this.doc.addPage();
        this.pageNum++;
        this.y = M_TOP + HEADER_H + 12;
        this.drawPageHeader();
        this.drawPageFooter();
      }

      const letter = doc.letters[li];

      // Letterhead
      this.doc.setFontSize(12);
      this.doc.setFont(this.fontFamily, 'bold');
      this.doc.setTextColor(...this.primRgb);
      const lhLines = this.doc.splitTextToSize(letter.letterhead, CONTENT_W);
      for (const line of lhLines) {
        this.doc.text(line, M_LEFT, this.y);
        this.y += 6;
      }
      this.y += 4;
      this.drawRule(M_LEFT, this.y, PAGE_W - M_RIGHT, 'primary', 0.8);
      this.y += 10;

      // Heading (Letter 3)
      if (letter.heading) {
        this.ensureSpace(30);
        this.drawRect(M_LEFT, this.y - 4, CONTENT_W, 20, 'surface');
        this.doc.setDrawColor(...this.primRgb);
        this.doc.setLineWidth(0.8);
        this.doc.rect(M_LEFT, this.y - 4, CONTENT_W, 20, 'S');

        this.doc.setFontSize(10);
        this.doc.setFont(this.fontFamily, 'bold');
        this.doc.setTextColor(...this.primRgb);
        const hLines = this.doc.splitTextToSize(letter.heading, CONTENT_W - 20);
        for (const line of hLines) {
          this.doc.text(line, PAGE_W / 2, this.y + 6, { align: 'center' } as any);
        }
        this.y += 24;
      }

      // Addressee
      this.doc.setFontSize(9);
      this.doc.setFont(this.fontFamily, 'normal');
      this.doc.setTextColor(...this.mutedRgb);
      const addrLines = this.doc.splitTextToSize(letter.addresseeBlock, CONTENT_W);
      for (const line of addrLines) {
        this.doc.text(line, M_LEFT, this.y);
        this.y += 5;
      }
      this.y += 6;

      // Date
      this.doc.text(letter.date, M_LEFT, this.y);
      this.y += 10;

      // Salutation
      this.doc.setTextColor(...this.bodyRgb);
      this.doc.text(letter.salutation, M_LEFT, this.y);
      this.y += 10;

      // Body
      if (letter.body) {
        this.doc.setFontSize(9);
        this.doc.setTextColor(...this.bodyRgb);
        const bodyLines = this.doc.splitTextToSize(letter.body, CONTENT_W);
        for (const line of bodyLines) {
          this.ensureSpace(6);
          this.doc.text(line, M_LEFT, this.y);
          this.y += 5;
        }
        this.y += 6;
      }

      // Structured paragraphs
      if (letter.paragraphs) {
        for (const [key, val] of Object.entries(letter.paragraphs)) {
          this.ensureSpace(30);
          this.doc.setFontSize(7);
          this.doc.setFont(this.fontFamily, 'bold');
          this.doc.setTextColor(...this.primRgb);
          this.doc.text(key.replace(/_/g, ' ').toUpperCase(), M_LEFT, this.y);
          this.y += 7;

          this.doc.setFontSize(9);
          this.doc.setFont(this.fontFamily, 'normal');
          this.doc.setTextColor(...this.bodyRgb);
          const pLines = this.doc.splitTextToSize(val, CONTENT_W);
          for (const line of pLines) {
            this.ensureSpace(6);
            this.doc.text(line, M_LEFT, this.y);
            this.y += 5;
          }
          this.y += 6;
        }
      }

      // Close statement
      if (letter.closeStatement) {
        this.ensureSpace(12);
        this.doc.setFontSize(9);
        this.doc.setFont(this.fontFamily, 'bold');
        this.doc.setTextColor(...this.bodyRgb);
        const csLines = this.doc.splitTextToSize(letter.closeStatement, CONTENT_W);
        for (const line of csLines) {
          this.doc.text(line, M_LEFT, this.y);
          this.y += 5;
        }
        this.y += 8;
      }

      // Close
      this.ensureSpace(30);
      this.doc.setFontSize(9);
      this.doc.setTextColor(...this.bodyRgb);
      const closeLines = letter.close.split('\n');
      for (const cl of closeLines) {
        this.doc.text(cl, M_LEFT, this.y);
        this.y += 5;
      }
    }

    // Usage notes
    this.doc.addPage();
    this.pageNum++;
    this.y = M_TOP + HEADER_H + 12;
    this.drawPageHeader();
    this.drawPageFooter();

    this.doc.setFontSize(12);
    this.doc.setFont(this.fontFamily, 'bold');
    this.doc.setTextColor(...this.primRgb);
    this.doc.text('Usage Notes', M_LEFT, this.y);
    this.y += 14;

    const notes = [
      doc.usageNotes.calculatingInterest,
      doc.usageNotes.recoveryChargeNote,
      doc.usageNotes.recordKeeping,
      doc.usageNotes.legalAdvice,
    ];

    for (const note of notes) {
      this.ensureSpace(20);
      this.doc.setFontSize(9);
      this.doc.setFont(this.fontFamily, 'bold');
      this.doc.setTextColor(...this.accentRgb);
      this.doc.text('\u2022', M_LEFT + 8, this.y);
      this.doc.setFont(this.fontFamily, 'normal');
      this.doc.setTextColor(...this.bodyRgb);
      const nLines = this.doc.splitTextToSize(note, CONTENT_W - 18);
      this.doc.text(nLines, M_LEFT + 18, this.y);
      this.y += nLines.length * 5 + 6;
    }
  }

  // ── Welcome Email Rendering ──

  drawWelcomeEmail(doc: WelcomeEmailDocument): void {
    this.drawRect(0, 0, PAGE_W, 4, 'primary');

    for (let ei = 0; ei < doc.emails.length; ei++) {
      if (ei > 0) {
        this.doc.addPage();
        this.pageNum++;
        this.y = M_TOP + HEADER_H + 12;
        this.drawPageHeader();
        this.drawPageFooter();
      }

      const email = doc.emails[ei];

      // Header card
      this.drawRect(M_LEFT, this.y, CONTENT_W, 28, 'surface');
      this.drawRect(M_LEFT, this.y, 4, 28, 'accent');

      this.doc.setFontSize(8);
      this.doc.setFont(this.fontFamily, 'bold');
      this.doc.setTextColor(...this.primRgb);
      this.doc.text(email.emailType.replace(/_/g, ' ').toUpperCase(), M_LEFT + 14, this.y + 10);

      this.doc.setFontSize(7);
      this.doc.setFont(this.fontFamily, 'normal');
      this.doc.setTextColor(...this.mutedRgb);
      this.doc.text(`Send: ${email.sendTiming}`, M_LEFT + 14, this.y + 18);
      this.y += 36;

      // Subject
      this.doc.setFontSize(10);
      this.doc.setFont(this.fontFamily, 'bold');
      this.doc.setTextColor(...this.primRgb);
      this.doc.text(`Subject: ${email.subject}`, M_LEFT, this.y);
      this.y += 12;

      // Greeting
      this.doc.setFontSize(10);
      this.doc.setFont(this.fontFamily, 'normal');
      this.doc.setTextColor(...this.bodyRgb);
      this.doc.text(email.greeting, M_LEFT, this.y);
      this.y += 10;

      // Body
      const bodyLines = this.doc.splitTextToSize(email.body, CONTENT_W);
      for (const line of bodyLines) {
        this.ensureSpace(6);
        this.doc.text(line, M_LEFT, this.y);
        this.y += 5;
      }
      this.y += 8;

      // Sign-off
      this.doc.setFontSize(8);
      this.doc.setTextColor(80, 86, 104);
      const signLines = email.signOff.split('\n');
      for (const sl of signLines) {
        this.ensureSpace(6);
        this.doc.text(sl, M_LEFT, this.y);
        this.y += 5;
      }
    }
  }

  // ── Finalisation ──

  finalise(): Uint8Array {
    return new Uint8Array(this.doc.output('arraybuffer'));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export function generatePdf(jsonDoc: AnyDocument, design: ClientDesign, docLabel: string): Uint8Array {
  try {
    const engine = new PdfLayoutEngine(design);
    const kind = detectDocumentKind(jsonDoc);

    const displayName = design.brandIdentity === 'My personal name is the brand — I want documents to feel personal'
      ? (design.firstName || design.businessName)
      : design.businessName;

    switch (kind) {
      case 'invoice': {
        const invoiceDoc = jsonDoc as InvoiceDocument;
        engine.setMetadata(invoiceDoc.metadata);
        engine.drawInvoice(invoiceDoc);
        break;
      }
      case 'late_payment': {
        const lateDoc = jsonDoc as LatePaymentDocument;
        engine.setMetadata(lateDoc.metadata);
        engine.drawLatePayment(lateDoc);
        break;
      }
      case 'welcome_email': {
        const welcomeDoc = jsonDoc as WelcomeEmailDocument;
        engine.setMetadata(welcomeDoc.metadata);
        engine.drawWelcomeEmail(welcomeDoc);
        break;
      }
      default: {
        const model = jsonDoc as DocumentModel;
        engine.setMetadata(model.metadata);
        engine.drawCoverPage(displayName, docLabel);

        const structured = jsonDoc as StructuredDocument;
        for (const section of structured.sections) {
          engine.drawSection(section);
        }
        break;
      }
    }

    return engine.finalise();
  } catch (error) {
    // generatePdf must never throw per hard constraints
    // Return a minimal error document
    const fallbackDoc = new jsPDF({ unit: 'pt', format: 'a4' });
    fallbackDoc.setFontSize(12);
    fallbackDoc.text('Error generating PDF. Please try again.', 50, 50);
    return new Uint8Array(fallbackDoc.output('arraybuffer'));
  }
}
