// ─────────────────────────────────────────────────────────────────────────────
// PDF RENDERER — Professional-grade JSON-driven PDF generation using jsPDF
// ─────────────────────────────────────────────────────────────────────────────

import { jsPDF } from 'npm:jspdf@2.5.2';
import {
  AnyDocument, StructuredDocument, InvoiceDocument, LatePaymentDocument,
  WelcomeEmailDocument, DocumentSection, ContentItem, detectDocumentKind,
  ClauseContent, ParagraphContent, BulletContent, HeadingContent,
  SignatureBlockContent, TableContent,
} from './document-types.ts';
import { ClientDesign, parseBrandColours, hexToRgb } from './rendering.ts';

// ── Layout Constants ──

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M_LEFT = 56;
const M_RIGHT = 56;
const M_TOP = 72;
const M_BOTTOM = 72;
const CONTENT_W = PAGE_W - M_LEFT - M_RIGHT;

// ── Colour Helpers ──

function hexToJsPdf(hex: string): [number, number, number] {
  const rgb = hexToRgb(hex);
  return [Math.round(rgb.r * 255), Math.round(rgb.g * 255), Math.round(rgb.b * 255)];
}

function lightenHex(hex: string, amount: number): [number, number, number] {
  const rgb = hexToRgb(hex);
  const f = amount / 100;
  return [
    Math.min(255, Math.round(rgb.r * 255 + (255 - rgb.r * 255) * f)),
    Math.min(255, Math.round(rgb.g * 255 + (255 - rgb.g * 255) * f)),
    Math.min(255, Math.round(rgb.b * 255 + (255 - rgb.b * 255) * f)),
  ];
}

// ── PDF State Tracker ──

interface PdfState {
  doc: jsPDF;
  y: number;
  page: number;
  colours: { primary: string; secondary: string; accent: string };
  primaryRgb: [number, number, number];
  secondaryRgb: [number, number, number];
  accentRgb: [number, number, number];
  primaryLight: [number, number, number];
  design: ClientDesign;
}

function createState(doc: jsPDF, design: ClientDesign): PdfState {
  const colours = parseBrandColours(design.brandColours);
  return {
    doc,
    y: M_TOP,
    page: 1,
    colours,
    primaryRgb: hexToJsPdf(colours.primary),
    secondaryRgb: hexToJsPdf(colours.secondary),
    accentRgb: hexToJsPdf(colours.accent),
    primaryLight: lightenHex(colours.primary, 92),
    design,
  };
}

function needsNewPage(s: PdfState, needed: number): boolean {
  return s.y + needed > PAGE_H - M_BOTTOM;
}

function addPage(s: PdfState): void {
  s.doc.addPage();
  s.page++;
  s.y = M_TOP;
  drawPageHeader(s);
  drawPageFooter(s);
  s.y = M_TOP + 18;
}

function ensureSpace(s: PdfState, needed: number): void {
  if (needsNewPage(s, needed)) addPage(s);
}

// ── Page Decorations ──

function drawPageHeader(s: PdfState): void {
  const d = s.doc;
  d.setDrawColor(...s.primaryRgb);
  d.setLineWidth(0.6);
  d.line(M_LEFT, M_TOP - 12, PAGE_W - M_RIGHT, M_TOP - 12);
  d.setFontSize(7);
  d.setTextColor(...s.primaryRgb);
  d.setFont('helvetica', 'normal');
  d.text(s.design.businessName, M_LEFT, M_TOP - 16);
}

function drawPageFooter(s: PdfState): void {
  const d = s.doc;
  const footerY = PAGE_H - M_BOTTOM + 16;
  d.setDrawColor(...s.primaryRgb);
  d.setLineWidth(0.4);
  d.line(M_LEFT, footerY - 6, PAGE_W - M_RIGHT, footerY - 6);
  d.setFontSize(7);
  d.setTextColor(140, 146, 168);
  d.setFont('helvetica', 'italic');
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  d.text(`${s.design.businessName}  |  ${dateStr}  |  Page ${s.page}`, M_LEFT, footerY);
}

// ── Cover Page ──

function drawCoverPage(s: PdfState, docLabel: string): void {
  const d = s.doc;

  // Top gradient bar
  d.setFillColor(...s.primaryRgb);
  d.rect(0, 0, PAGE_W, 8, 'F');
  d.setFillColor(...s.accentRgb);
  d.rect(PAGE_W * 0.6, 0, PAGE_W * 0.4, 8, 'F');

  // Bottom accent
  d.setFillColor(...s.primaryRgb);
  d.setGState(new d.GState({ opacity: 0.15 }));
  d.rect(0, PAGE_H - 4, PAGE_W, 4, 'F');
  d.setGState(new d.GState({ opacity: 1.0 }));

  // Left accent bar
  d.setFillColor(...s.accentRgb);
  d.rect(M_LEFT - 16, PAGE_H * 0.25, 4, PAGE_H * 0.35, 'F');

  // Logo
  if (s.design.logoBase64) {
    try {
      const dataUrl = s.design.logoBase64;
      const mimeMatch = dataUrl.match(/^data:(image\/\w+);base64,/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      const fmt = mime.includes('png') ? 'PNG' : 'JPEG';
      d.addImage(dataUrl, fmt, M_LEFT, PAGE_H * 0.28, 120, 50);
    } catch { /* skip if image fails */ }
  }

  // Title
  const titleY = PAGE_H * 0.42;
  d.setFontSize(30);
  d.setTextColor(...s.primaryRgb);
  d.setFont('helvetica', 'bold');
  const lines = d.splitTextToSize(docLabel, CONTENT_W);
  d.text(lines, M_LEFT, titleY);

  // Subtitle
  let nextY = titleY + lines.length * 14 + 12;
  const displayName = s.design.brandIdentity === 'My personal name is the brand — I want documents to feel personal'
    ? (s.design.firstName || s.design.businessName) : s.design.businessName;
  d.setFontSize(13);
  d.setTextColor(100, 108, 130);
  d.setFont('helvetica', 'italic');
  d.text(`Prepared for ${displayName}`, M_LEFT, nextY);

  // Business name
  nextY += 16;
  d.setFontSize(10);
  d.setTextColor(140, 146, 168);
  d.setFont('helvetica', 'normal');
  d.text(s.design.businessName, M_LEFT, nextY);

  // Date
  nextY += 14;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  d.text(dateStr, M_LEFT, nextY);

  // Separator line below info
  nextY += 20;
  d.setDrawColor(...s.primaryRgb);
  d.setLineWidth(1.2);
  d.line(M_LEFT, nextY, PAGE_W - M_RIGHT, nextY);

  // Add page footer on cover
  s.page = 1;
  drawPageFooter(s);

  // New page for content
  d.addPage();
  s.page = 2;
  s.y = M_TOP + 18;
  drawPageHeader(s);
  drawPageFooter(s);
}

// ── Section Rendering ──

function drawSection(s: PdfState, section: DocumentSection): void {
  const d = s.doc;

  if (section.title) {
    ensureSpace(s, 36);
    // Section header bar
    d.setFillColor(...s.primaryLight);
    d.rect(M_LEFT, s.y - 4, CONTENT_W, 24, 'F');
    d.setDrawColor(...s.primaryRgb);
    d.setLineWidth(0.8);
    d.line(M_LEFT, s.y + 20, PAGE_W - M_RIGHT, s.y + 20);

    // Accent bar
    d.setFillColor(...s.accentRgb);
    d.rect(M_LEFT, s.y - 4, 3, 24, 'F');

    // Title text
    d.setFontSize(14);
    d.setTextColor(...s.primaryRgb);
    d.setFont('helvetica', 'bold');
    d.text(section.title, M_LEFT + 10, s.y + 10);
    s.y += 30;
  }

  for (const item of section.content) {
    drawContentItem(s, item);
  }

  s.y += 8;
}

function drawContentItem(s: PdfState, item: ContentItem): void {
  const d = s.doc;

  switch (item.type) {
    case 'clause': {
      const clause = item as ClauseContent;
      const numText = clause.clauseNumber + '.';
      const bodyText = clause.text;
      const numW = d.getStringUnitWidth(numText) * 10 / d.internal.scaleFactor;
      const indent = Math.max(numW + 4, 36);
      const bodyW = CONTENT_W - indent;

      d.setFontSize(10);
      d.setFont('helvetica', 'bold');
      d.setTextColor(...s.primaryRgb);

      const bodyLines = d.splitTextToSize(bodyText, bodyW);
      const totalH = bodyLines.length * 5 + 4;
      ensureSpace(s, totalH);

      d.text(numText, M_LEFT, s.y);

      d.setFont('helvetica', 'normal');
      d.setTextColor(30, 30, 46);
      d.text(bodyLines, M_LEFT + indent, s.y);
      s.y += totalH;
      break;
    }
    case 'paragraph': {
      const para = item as ParagraphContent;
      d.setFontSize(10);
      d.setFont('helvetica', 'normal');
      d.setTextColor(30, 30, 46);
      const lines = d.splitTextToSize(para.text, CONTENT_W);
      const h = lines.length * 5 + 4;
      ensureSpace(s, h);
      d.text(lines, M_LEFT, s.y);
      s.y += h;
      break;
    }
    case 'bullet': {
      const bullet = item as BulletContent;
      d.setFontSize(10);
      d.setFont('helvetica', 'bold');
      d.setTextColor(...s.accentRgb);
      ensureSpace(s, 10);
      d.text('\u2022', M_LEFT + 8, s.y);
      d.setFont('helvetica', 'normal');
      d.setTextColor(30, 30, 46);
      const lines = d.splitTextToSize(bullet.text, CONTENT_W - 18);
      d.text(lines, M_LEFT + 18, s.y);
      s.y += lines.length * 5 + 3;
      break;
    }
    case 'heading': {
      const heading = item as HeadingContent;
      d.setFontSize(11);
      d.setFont('helvetica', 'bolditalic');
      d.setTextColor(...s.secondaryRgb);
      const lines = d.splitTextToSize(heading.text, CONTENT_W);
      ensureSpace(s, lines.length * 5 + 8);
      d.text(lines, M_LEFT, s.y);
      s.y += lines.length * 5 + 8;
      break;
    }
    case 'signature_block': {
      const sig = item as SignatureBlockContent;
      ensureSpace(s, 70);
      // Box
      d.setFillColor(248, 249, 251);
      d.setDrawColor(226, 230, 237);
      d.setLineWidth(0.3);
      d.roundedRect(M_LEFT, s.y, CONTENT_W, 60, 3, 3, 'FD');

      // Party
      d.setFontSize(10);
      d.setFont('helvetica', 'bold');
      d.setTextColor(...s.primaryRgb);
      d.text(sig.party, M_LEFT + 10, s.y + 12);

      // Sign line
      d.setDrawColor(200, 204, 212);
      d.setLineWidth(0.2);
      d.line(M_LEFT + 10, s.y + 28, M_LEFT + 200, s.y + 28);
      d.line(M_LEFT + 10, s.y + 42, M_LEFT + 200, s.y + 42);

      // Labels
      d.setFontSize(8);
      d.setTextColor(140, 146, 168);
      d.setFont('helvetica', 'normal');
      d.text(sig.signLine || 'Signed:', M_LEFT + 10, s.y + 32);
      d.text(sig.dateLine || 'Date:', M_LEFT + 10, s.y + 46);

      // Name
      d.setFontSize(9);
      d.setTextColor(30, 30, 46);
      d.setFont('helvetica', 'normal');
      d.text(`${sig.nameLabel}: ${sig.nameValue}`, M_LEFT + 10, s.y + 54);

      if (sig.extraFields) {
        let ey = s.y + 54;
        for (const f of sig.extraFields) {
          ey += 8;
          d.text(`${f.label}: ${f.value}`, M_LEFT + 10, ey);
        }
      }

      s.y += 70;
      break;
    }
    case 'table': {
      const tbl = item as TableContent;
      drawTable(s, tbl.headers, tbl.rows);
      break;
    }
  }
}

function drawTable(s: PdfState, headers: string[], rows: string[][]): void {
  const d = s.doc;
  const colCount = headers.length;
  const colW = CONTENT_W / colCount;
  const rowH = 14;
  const totalH = (rows.length + 1) * rowH + 8;
  ensureSpace(s, Math.min(totalH, 100));

  // Header row
  d.setFillColor(...s.primaryRgb);
  d.rect(M_LEFT, s.y, CONTENT_W, rowH, 'F');
  d.setFontSize(9);
  d.setFont('helvetica', 'bold');
  d.setTextColor(255, 255, 255);
  headers.forEach((h, i) => {
    d.text(h, M_LEFT + i * colW + 6, s.y + 10, { maxWidth: colW - 12 });
  });
  s.y += rowH;

  // Data rows
  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];
    if (needsNewPage(s, rowH)) {
      addPage(s);
      // Re-draw header
      d.setFillColor(...s.primaryRgb);
      d.rect(M_LEFT, s.y, CONTENT_W, rowH, 'F');
      d.setTextColor(255, 255, 255);
      d.setFont('helvetica', 'bold');
      d.setFontSize(9);
      headers.forEach((h, i) => {
        d.text(h, M_LEFT + i * colW + 6, s.y + 10, { maxWidth: colW - 12 });
      });
      s.y += rowH;
    }

    if (ri % 2 === 1) {
      d.setFillColor(...s.primaryLight);
      d.rect(M_LEFT, s.y, CONTENT_W, rowH, 'F');
    }

    d.setFontSize(9);
    d.setFont('helvetica', 'normal');
    d.setTextColor(30, 30, 46);
    row.forEach((cell, i) => {
      d.text(cell, M_LEFT + i * colW + 6, s.y + 10, { maxWidth: colW - 12 });
    });

    d.setDrawColor(226, 230, 237);
    d.setLineWidth(0.15);
    d.line(M_LEFT, s.y + rowH, PAGE_W - M_RIGHT, s.y + rowH);
    s.y += rowH;
  }
  s.y += 6;
}

// ── Invoice PDF ──

function drawInvoicePdf(s: PdfState, doc: InvoiceDocument): void {
  const d = s.doc;

  // Top bar
  d.setFillColor(...s.primaryRgb);
  d.rect(0, 0, PAGE_W, 6, 'F');

  // Logo
  let infoStartY = M_TOP;
  if (s.design.logoBase64) {
    try {
      const dataUrl = s.design.logoBase64;
      const mimeMatch = dataUrl.match(/^data:(image\/\w+);base64,/);
      const fmt = mimeMatch && mimeMatch[1].includes('png') ? 'PNG' : 'JPEG';
      d.addImage(dataUrl, fmt, M_LEFT, M_TOP, 80, 36);
      infoStartY = M_TOP + 42;
    } catch { /* skip */ }
  }

  // Business info (left column)
  d.setFontSize(16);
  d.setTextColor(...s.primaryRgb);
  d.setFont('helvetica', 'bold');
  d.text(doc.businessInfo.tradingName, M_LEFT, infoStartY);

  d.setFontSize(8);
  d.setTextColor(60, 60, 80);
  d.setFont('helvetica', 'normal');
  let iy = infoStartY + 10;
  for (const line of [doc.businessInfo.address, doc.businessInfo.phone, doc.businessInfo.email]) {
    if (line) { d.text(line, M_LEFT, iy); iy += 8; }
  }
  if (doc.metadata.vatRegistered && doc.metadata.vatNumber) {
    d.text(`VAT No: ${doc.metadata.vatNumber}`, M_LEFT, iy);
  }

  // Invoice details (right column)
  const rightX = PAGE_W - M_RIGHT - 140;
  d.setFillColor(...s.primaryLight);
  d.roundedRect(rightX, M_TOP, 140, 60, 3, 3, 'F');

  d.setFontSize(9);
  d.setTextColor(...s.primaryRgb);
  d.setFont('helvetica', 'bold');
  d.text('Invoice Details', rightX + 10, M_TOP + 14);

  d.setFontSize(8);
  d.setTextColor(60, 60, 80);
  d.setFont('helvetica', 'normal');
  const details = [
    `Invoice: ${doc.invoiceFields.invoiceNumberFormat}`,
    `Date: ${doc.invoiceFields.dateFormat}`,
    `Due: ${doc.invoiceFields.dueDateFormat}`,
  ];
  if (doc.invoiceFields.showPoNumber) details.push(`PO: ${doc.invoiceFields.poNumberFormat}`);
  details.forEach((line, i) => d.text(line, rightX + 10, M_TOP + 24 + i * 8));

  s.y = M_TOP + 70;

  // Bill To
  d.setFillColor(248, 249, 251);
  d.roundedRect(M_LEFT, s.y, CONTENT_W, 44, 3, 3, 'F');
  d.setFontSize(10);
  d.setTextColor(...s.primaryRgb);
  d.setFont('helvetica', 'bold');
  d.text('BILL TO', M_LEFT + 10, s.y + 12);
  d.setFontSize(9);
  d.setTextColor(30, 30, 46);
  d.setFont('helvetica', 'normal');
  const billLines = [doc.billToPlaceholders.clientName, doc.billToPlaceholders.company, doc.billToPlaceholders.addressLine1, doc.billToPlaceholders.addressLine2].filter(Boolean);
  billLines.forEach((l, i) => d.text(l, M_LEFT + 10, s.y + 22 + i * 7));
  s.y += 54;

  // Services table
  d.setFontSize(10);
  d.setTextColor(...s.primaryRgb);
  d.setFont('helvetica', 'bold');
  d.text('SERVICES RENDERED', M_LEFT, s.y);
  s.y += 4;
  drawTable(s, ['Description', 'Qty', 'Unit Price', 'Amount'],
    doc.lineItems.map(i => [i.description, i.quantity, i.unitPrice, i.amount]));

  // Totals
  ensureSpace(s, 50);
  const totalsX = PAGE_W - M_RIGHT - 160;
  d.setFontSize(9);
  d.setTextColor(30, 30, 46);
  d.setFont('helvetica', 'normal');
  d.text('Subtotal', totalsX, s.y);
  d.text(doc.totals.subtotal, PAGE_W - M_RIGHT, s.y, { align: 'right' });
  s.y += 10;
  if (doc.totals.showVatLine) {
    d.text(`VAT (${doc.totals.vatPercentage}%)`, totalsX, s.y);
    d.text(doc.totals.vatAmount, PAGE_W - M_RIGHT, s.y, { align: 'right' });
    s.y += 10;
  }

  // Total Due bar
  d.setFillColor(...s.primaryRgb);
  d.rect(totalsX - 4, s.y - 4, PAGE_W - M_RIGHT - totalsX + 8, 14, 'F');
  d.setTextColor(255, 255, 255);
  d.setFont('helvetica', 'bold');
  d.setFontSize(10);
  d.text('TOTAL DUE', totalsX + 4, s.y + 5);
  d.text(doc.totals.totalDue, PAGE_W - M_RIGHT - 4, s.y + 5, { align: 'right' });
  s.y += 24;

  // Payment terms
  ensureSpace(s, 60);
  d.setTextColor(...s.primaryRgb);
  d.setFontSize(10);
  d.setFont('helvetica', 'bold');
  d.text('PAYMENT TERMS & METHODS', M_LEFT, s.y);
  d.setDrawColor(...s.accentRgb);
  d.setLineWidth(0.4);
  d.line(M_LEFT, s.y + 2, PAGE_W - M_RIGHT, s.y + 2);
  s.y += 12;

  d.setFontSize(9);
  d.setTextColor(30, 30, 46);
  d.setFont('helvetica', 'normal');
  d.text(doc.paymentTerms.paymentDeadline, M_LEFT, s.y);
  s.y += 10;

  doc.paymentTerms.paymentMethods.forEach(m => {
    ensureSpace(s, 10);
    d.setTextColor(...s.accentRgb);
    d.setFont('helvetica', 'bold');
    d.text('\u2022', M_LEFT + 8, s.y);
    d.setTextColor(30, 30, 46);
    d.setFont('helvetica', 'normal');
    d.text(m, M_LEFT + 16, s.y);
    s.y += 8;
  });

  if (doc.paymentTerms.bankTransferDetails.show) {
    s.y += 4;
    d.setFont('helvetica', 'bold');
    d.text('Bank Details:', M_LEFT, s.y);
    s.y += 8;
    d.setFont('helvetica', 'normal');
    d.text(`Account: ${doc.paymentTerms.bankTransferDetails.accountName}`, M_LEFT + 16, s.y); s.y += 7;
    d.text(`Sort Code: ${doc.paymentTerms.bankTransferDetails.sortCode}`, M_LEFT + 16, s.y); s.y += 7;
    d.text(`Account No: ${doc.paymentTerms.bankTransferDetails.accountNumber}`, M_LEFT + 16, s.y); s.y += 7;
  }

  d.text(`Reference: ${doc.paymentTerms.paymentReference}`, M_LEFT, s.y);
  s.y += 16;

  // Late payment
  ensureSpace(s, 30);
  d.setTextColor(...s.primaryRgb);
  d.setFontSize(10);
  d.setFont('helvetica', 'bold');
  d.text('LATE PAYMENT NOTICE', M_LEFT, s.y);
  d.line(M_LEFT, s.y + 2, PAGE_W - M_RIGHT, s.y + 2);
  s.y += 12;
  d.setFontSize(8);
  d.setTextColor(30, 30, 46);
  d.setFont('helvetica', 'normal');
  const lpLines = d.splitTextToSize(doc.latePaymentClause, CONTENT_W);
  d.text(lpLines, M_LEFT, s.y);
  s.y += lpLines.length * 4 + 8;

  // Notes
  if (doc.optionalFields.showNotesSection) {
    ensureSpace(s, 20);
    d.setTextColor(...s.primaryRgb);
    d.setFontSize(10);
    d.setFont('helvetica', 'bold');
    d.text('NOTES', M_LEFT, s.y);
    s.y += 10;
    d.setFontSize(8);
    d.setTextColor(30, 30, 46);
    d.setFont('helvetica', 'normal');
    const noteLines = d.splitTextToSize(doc.optionalFields.notesPlaceholder, CONTENT_W);
    d.text(noteLines, M_LEFT, s.y);
    s.y += noteLines.length * 4 + 8;
  }

  // Footer
  s.y += 20;
  d.setDrawColor(...s.primaryRgb);
  d.setLineWidth(0.6);
  d.line(M_LEFT, s.y, PAGE_W - M_RIGHT, s.y);
  s.y += 10;
  d.setFontSize(8);
  d.setTextColor(100, 108, 130);
  d.setFont('helvetica', 'italic');
  d.text('Thank you for your business.', PAGE_W / 2, s.y, { align: 'center' });
  s.y += 8;
  d.text(`${doc.businessInfo.legalName}  |  ${doc.businessInfo.email}  |  ${doc.businessInfo.phone}`, PAGE_W / 2, s.y, { align: 'center' });
}

// ── Late Payment Letters PDF ──

function drawLatePaymentPdf(s: PdfState, doc: LatePaymentDocument): void {
  const d = s.doc;

  // Top bar
  d.setFillColor(...s.primaryRgb);
  d.rect(0, 0, PAGE_W, 6, 'F');

  for (let li = 0; li < doc.letters.length; li++) {
    if (li > 0) { d.addPage(); s.page++; s.y = M_TOP + 18; drawPageHeader(s); drawPageFooter(s); }

    const letter = doc.letters[li];

    // Letterhead
    d.setFontSize(12);
    d.setTextColor(...s.primaryRgb);
    d.setFont('helvetica', 'bold');
    const lhLines = d.splitTextToSize(letter.letterhead, CONTENT_W);
    d.text(lhLines, M_LEFT, s.y);
    s.y += lhLines.length * 6 + 4;
    d.setDrawColor(...s.primaryRgb);
    d.setLineWidth(0.8);
    d.line(M_LEFT, s.y, PAGE_W - M_RIGHT, s.y);
    s.y += 10;

    // Heading (Letter 3)
    if (letter.heading) {
      ensureSpace(s, 30);
      d.setFillColor(...s.primaryLight);
      d.rect(M_LEFT, s.y - 4, CONTENT_W, 20, 'F');
      d.setDrawColor(...s.primaryRgb);
      d.setLineWidth(0.8);
      d.rect(M_LEFT, s.y - 4, CONTENT_W, 20, 'S');
      d.setFontSize(10);
      d.setTextColor(...s.primaryRgb);
      d.setFont('helvetica', 'bold');
      const hLines = d.splitTextToSize(letter.heading, CONTENT_W - 20);
      d.text(hLines, PAGE_W / 2, s.y + 6, { align: 'center' });
      s.y += 24;
    }

    // Addressee
    d.setFontSize(9);
    d.setTextColor(80, 86, 104);
    d.setFont('helvetica', 'normal');
    const addrLines = d.splitTextToSize(letter.addresseeBlock, CONTENT_W);
    d.text(addrLines, M_LEFT, s.y);
    s.y += addrLines.length * 5 + 6;

    // Date
    d.text(letter.date, M_LEFT, s.y);
    s.y += 10;

    // Salutation
    d.setTextColor(30, 30, 46);
    d.text(letter.salutation, M_LEFT, s.y);
    s.y += 10;

    // Body
    if (letter.body) {
      d.setFontSize(9);
      d.setFont('helvetica', 'normal');
      d.setTextColor(30, 30, 46);
      const bodyLines = d.splitTextToSize(letter.body, CONTENT_W);
      for (const line of bodyLines) {
        ensureSpace(s, 6);
        d.text(line, M_LEFT, s.y);
        s.y += 5;
      }
      s.y += 6;
    }

    // Structured paragraphs
    if (letter.paragraphs) {
      for (const [key, val] of Object.entries(letter.paragraphs)) {
        ensureSpace(s, 30);
        d.setFontSize(7);
        d.setTextColor(...s.primaryRgb);
        d.setFont('helvetica', 'bold');
        d.text(key.replace(/_/g, ' ').toUpperCase(), M_LEFT, s.y);
        s.y += 7;

        d.setFontSize(9);
        d.setTextColor(30, 30, 46);
        d.setFont('helvetica', 'normal');
        const pLines = d.splitTextToSize(val, CONTENT_W);
        for (const line of pLines) {
          ensureSpace(s, 6);
          d.text(line, M_LEFT, s.y);
          s.y += 5;
        }
        s.y += 6;
      }
    }

    // Close statement
    if (letter.closeStatement) {
      ensureSpace(s, 12);
      d.setFontSize(9);
      d.setFont('helvetica', 'bold');
      d.setTextColor(30, 30, 46);
      const csLines = d.splitTextToSize(letter.closeStatement, CONTENT_W);
      d.text(csLines, M_LEFT, s.y);
      s.y += csLines.length * 5 + 8;
    }

    // Close
    ensureSpace(s, 30);
    d.setFontSize(9);
    d.setTextColor(30, 30, 46);
    d.setFont('helvetica', 'normal');
    const closeLines = letter.close.split('\n');
    for (const cl of closeLines) {
      d.text(cl, M_LEFT, s.y);
      s.y += 5;
    }
  }

  // Usage notes on a new page
  d.addPage();
  s.page++;
  s.y = M_TOP + 18;
  drawPageHeader(s);
  drawPageFooter(s);

  d.setFontSize(12);
  d.setTextColor(...s.primaryRgb);
  d.setFont('helvetica', 'bold');
  d.text('Usage Notes', M_LEFT, s.y);
  s.y += 14;

  const notes = [
    doc.usageNotes.calculatingInterest,
    doc.usageNotes.recoveryChargeNote,
    doc.usageNotes.recordKeeping,
    doc.usageNotes.legalAdvice,
  ];
  for (const note of notes) {
    ensureSpace(s, 20);
    d.setTextColor(...s.accentRgb);
    d.setFont('helvetica', 'bold');
    d.setFontSize(9);
    d.text('\u2022', M_LEFT + 8, s.y);
    d.setTextColor(30, 30, 46);
    d.setFont('helvetica', 'normal');
    const nLines = d.splitTextToSize(note, CONTENT_W - 18);
    d.text(nLines, M_LEFT + 18, s.y);
    s.y += nLines.length * 5 + 6;
  }
}

// ── Welcome Email PDF ──

function drawWelcomeEmailPdf(s: PdfState, doc: WelcomeEmailDocument): void {
  const d = s.doc;

  d.setFillColor(...s.primaryRgb);
  d.rect(0, 0, PAGE_W, 6, 'F');

  for (let ei = 0; ei < doc.emails.length; ei++) {
    if (ei > 0) { d.addPage(); s.page++; s.y = M_TOP + 18; drawPageHeader(s); drawPageFooter(s); }

    const email = doc.emails[ei];

    // Header card
    d.setFillColor(...s.primaryLight);
    d.rect(M_LEFT, s.y, CONTENT_W, 28, 'F');
    d.setFillColor(...s.primaryRgb);
    d.rect(M_LEFT, s.y, 4, 28, 'F');

    d.setFontSize(8);
    d.setTextColor(...s.primaryRgb);
    d.setFont('helvetica', 'bold');
    d.text(email.emailType.replace(/_/g, ' ').toUpperCase(), M_LEFT + 14, s.y + 10);

    d.setFontSize(7);
    d.setTextColor(140, 146, 168);
    d.setFont('helvetica', 'normal');
    d.text(`Send: ${email.sendTiming}`, M_LEFT + 14, s.y + 18);
    s.y += 36;

    // Subject
    d.setFontSize(10);
    d.setTextColor(...s.primaryRgb);
    d.setFont('helvetica', 'bold');
    d.text(`Subject: ${email.subject}`, M_LEFT, s.y);
    s.y += 12;

    // Greeting
    d.setFontSize(10);
    d.setTextColor(30, 30, 46);
    d.setFont('helvetica', 'normal');
    d.text(email.greeting, M_LEFT, s.y);
    s.y += 10;

    // Body
    const bodyLines = d.splitTextToSize(email.body, CONTENT_W);
    for (const line of bodyLines) {
      ensureSpace(s, 6);
      d.text(line, M_LEFT, s.y);
      s.y += 5;
    }
    s.y += 8;

    // Sign-off
    d.setFontSize(8);
    d.setTextColor(80, 86, 104);
    const signLines = email.signOff.split('\n');
    for (const sl of signLines) {
      ensureSpace(s, 6);
      d.text(sl, M_LEFT, s.y);
      s.y += 5;
    }
  }
}

// ── Public API ──

export function generatePdf(jsonDoc: AnyDocument, design: ClientDesign, docLabel: string): Uint8Array {
  const d = new jsPDF({ unit: 'pt', format: 'a4', hotfixes: ['px_scaling'] });
  const s = createState(d, design);
  const kind = detectDocumentKind(jsonDoc);

  switch (kind) {
    case 'invoice':
      drawInvoicePdf(s, jsonDoc as InvoiceDocument);
      break;
    case 'late_payment':
      drawLatePaymentPdf(s, jsonDoc as LatePaymentDocument);
      break;
    case 'welcome_email':
      drawWelcomeEmailPdf(s, jsonDoc as WelcomeEmailDocument);
      break;
    default: {
      drawCoverPage(s, docLabel);
      const structured = jsonDoc as StructuredDocument;
      for (const section of structured.sections) {
        drawSection(s, section);
      }
      break;
    }
  }

  return new Uint8Array(d.output('arraybuffer'));
}
