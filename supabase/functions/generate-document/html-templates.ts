// ─────────────────────────────────────────────────────────────────────────────
// HTML TEMPLATES — High-quality, print-optimised JSON-driven document rendering
// ─────────────────────────────────────────────────────────────────────────────

import {
  AnyDocument, StructuredDocument, InvoiceDocument, LatePaymentDocument,
  WelcomeEmailDocument, DocumentSection, ContentItem, detectDocumentKind,
  ClauseContent, ParagraphContent, BulletContent, HeadingContent,
  SignatureBlockContent, TableContent,
} from './document-types.ts';
import { ClientDesign, parseBrandColours } from './rendering.ts';

// ── Style Generation ──

function buildColourCSS(colours: { primary: string; secondary: string; accent: string }): string {
  return `
    --c-primary: ${colours.primary};
    --c-primary-light: ${colours.primary}18;
    --c-primary-medium: ${colours.primary}40;
    --c-secondary: ${colours.secondary};
    --c-accent: ${colours.accent};
    --c-accent-light: ${colours.accent}30;
    --c-bg: #ffffff;
    --c-surface: #f8f9fb;
    --c-surface-alt: #f1f3f7;
    --c-border: #e2e6ed;
    --c-border-light: #eef1f5;
    --c-text: #1a1a2e;
    --c-text-secondary: #4a5068;
    --c-text-muted: #8b92a8;
    --c-white: #ffffff;
  `;
}

function buildTypographyCSS(style: string): string {
  const isLuxury = style.includes('luxury') || style.includes('Premium');
  const isWarm = style.includes('Warm') || style.includes('friendly');
  const isModern = style.includes('modern') || style.includes('minimal') || style.includes('Clean');
  const isCorporate = style.includes('Corporate') || style.includes('formal');

  const headingFont = isLuxury ? "'Georgia', 'Times New Roman', serif"
    : isCorporate ? "'Georgia', serif"
    : "'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif";
  const bodyFont = isLuxury ? "'Georgia', 'Times New Roman', serif"
    : "'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif";
  const headingWeight = isLuxury ? '400' : isCorporate ? '600' : '700';
  const lineHeight = isWarm ? '1.75' : isLuxury ? '1.8' : '1.65';

  return `
    --f-heading: ${headingFont};
    --f-body: ${bodyFont};
    --f-heading-weight: ${headingWeight};
    --f-body-weight: 400;
    --line-height: ${lineHeight};
  `;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace('#', '');
  const full = c.length === 3 ? c[0]+c[0]+c[1]+c[1]+c[2]+c[2] : c;
  return { r: parseInt(full.substring(0,2),16), g: parseInt(full.substring(2,4),16), b: parseInt(full.substring(4,6),16) };
}

// ── Cover Page ──

function renderCoverPage(docLabel: string, design: ClientDesign, colours: { primary: string; secondary: string; accent: string }): string {
  const displayName = design.brandIdentity === 'My personal name is the brand — I want documents to feel personal'
    ? (design.firstName || design.businessName) : design.businessName;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const logoHtml = design.logoBase64
    ? `<img src="${design.logoBase64}" alt="Logo" style="max-height:72px;max-width:220px;object-fit:contain;margin-bottom:20px;" />`
    : '';

  return `
  <div class="cover-page">
    <div class="cover-accent-bar"></div>
    <div class="cover-content">
      ${logoHtml}
      <div class="cover-title">${escHtml(docLabel)}</div>
      <div class="cover-subtitle">Prepared for ${escHtml(displayName)}</div>
      <div class="cover-meta">${escHtml(design.businessName)}</div>
      <div class="cover-date">${dateStr}</div>
    </div>
    <div class="cover-bottom-bar"></div>
  </div>`;
}

// ── Section Rendering ──

function renderSectionHtml(section: DocumentSection, colours: { primary: string; secondary: string; accent: string }): string {
  const titleHtml = section.title
    ? `<div class="section-title"><span class="section-title-accent"></span>${escHtml(section.title)}</div>`
    : '';

  const contentHtml = section.content.map(item => renderContentItem(item, section.type, colours)).join('\n');

  const sectionClass = `section section-${section.type}`;
  return `<div class="${sectionClass}">${titleHtml}${contentHtml}</div>`;
}

function renderContentItem(item: ContentItem, sectionType: string, colours: { primary: string; secondary: string; accent: string }): string {
  switch (item.type) {
    case 'clause': {
      const clause = item as ClauseContent;
      return `<div class="clause">
        <span class="clause-number" style="color:var(--c-primary)">${escHtml(clause.clauseNumber)}</span>
        <span class="clause-text">${escHtml(clause.text)}</span>
      </div>`;
    }
    case 'paragraph':
      return `<p class="paragraph">${escHtml((item as ParagraphContent).text)}</p>`;
    case 'bullet':
      return `<div class="bullet"><span class="bullet-marker" style="color:var(--c-accent)">&#8226;</span><span class="bullet-text">${escHtml((item as BulletContent).text)}</span></div>`;
    case 'heading':
      return `<div class="sub-heading" style="color:var(--c-secondary)">${escHtml((item as HeadingContent).text)}</div>`;
    case 'signature_block': {
      const sig = item as SignatureBlockContent;
      const extras = (sig.extraFields || []).map((f: { label: string; value: string }) =>
        `<div class="sig-field"><span class="sig-label">${escHtml(f.label)}:</span> <span class="sig-value">${escHtml(f.value)}</span></div>`
      ).join('\n');
      return `<div class="signature-block">
        <div class="sig-party" style="color:var(--c-primary)">${escHtml(sig.party)}</div>
        <div class="sig-line">${escHtml(sig.signLine)}</div>
        <div class="sig-line">${escHtml(sig.dateLine)}</div>
        <div class="sig-field"><span class="sig-label">${escHtml(sig.nameLabel)}:</span> <span class="sig-value">${escHtml(sig.nameValue)}</span></div>
        ${extras}
      </div>`;
    }
    case 'table': {
      const tbl = item as TableContent;
      const headerRow = `<tr>${tbl.headers.map(h => `<th style="background:var(--c-primary);color:var(--c-white)">${escHtml(h)}</th>`).join('')}</tr>`;
      const dataRows = tbl.rows.map((row, i) =>
        `<tr class="${i % 2 === 0 ? 'row-even' : 'row-odd'}">${row.map(cell => `<td>${escHtml(cell)}</td>`).join('')}</tr>`
      ).join('\n');
      return `<table class="doc-table"><thead>${headerRow}</thead><tbody>${dataRows}</tbody></table>`;
    }
    default:
      return '';
  }
}

// ── Footer ──

function renderFooter(design: ClientDesign): string {
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return `<div class="document-footer">
    <div class="footer-separator"></div>
    <div class="footer-content">
      <span class="footer-name">${escHtml(design.businessName)}</span>
      <span class="footer-sep">|</span>
      <span class="footer-date">${dateStr}</span>
    </div>
  </div>`;
}

// ── Main Entry: Structured Document ──

function renderStructuredHtml(doc: StructuredDocument, design: ClientDesign, docLabel: string): string {
  const colours = parseBrandColours(design.brandColours);
  const colourCSS = buildColourCSS(colours);
  const typoCSS = buildTypographyCSS(design.visualStyle);
  const cover = renderCoverPage(docLabel, design, colours);
  const sections = doc.sections.map(s => renderSectionHtml(s, colours)).join('\n');
  const footer = renderFooter(design);

  return buildDocumentHtml(colourCSS, typoCSS, cover, sections, footer);
}

// ── Invoice HTML ──

function renderInvoiceHtml(doc: InvoiceDocument, design: ClientDesign): string {
  const colours = parseBrandColours(design.brandColours);
  const colourCSS = buildColourCSS(colours);
  const typoCSS = buildTypographyCSS(design.visualStyle);

  const logoHtml = design.logoBase64
    ? `<img src="${design.logoBase64}" alt="Logo" style="max-height:56px;max-width:180px;object-fit:contain;" />`
    : '';
  const vatRegHtml = doc.metadata.vatRegistered
    ? `<div class="invoice-vat-reg">VAT No: ${escHtml(doc.metadata.vatNumber)}</div>` : '';

  const bankHtml = doc.paymentTerms.bankTransferDetails.show ? `
    <div class="invoice-section-label" style="color:var(--c-primary)">Bank Details</div>
    <div class="invoice-bank">
      <div>Account: ${escHtml(doc.paymentTerms.bankTransferDetails.accountName)}</div>
      <div>Sort Code: ${escHtml(doc.paymentTerms.bankTransferDetails.sortCode)}</div>
      <div>Account No: ${escHtml(doc.paymentTerms.bankTransferDetails.accountNumber)}</div>
    </div>` : '';

  const stripeHtml = doc.paymentTerms.stripeDetails.show ? `
    <div>Stripe Payment: ${escHtml(doc.paymentTerms.stripeDetails.paymentLink)}</div>` : '';
  const paypalHtml = doc.paymentTerms.paypalDetails.show ? `
    <div>PayPal: ${escHtml(doc.paymentTerms.paypalDetails.paypalEmail)}</div>` : '';

  const vatRowHtml = doc.totals.showVatLine ? `
    <tr class="totals-row"><td></td><td class="totals-label">VAT (${doc.totals.vatPercentage}%)</td><td class="totals-value">${escHtml(doc.totals.vatAmount)}</td></tr>` : '';

  const notesHtml = doc.optionalFields.showNotesSection ? `
    <div class="invoice-section-label" style="color:var(--c-primary)">Notes</div>
    <p class="paragraph">${escHtml(doc.optionalFields.notesPlaceholder)}</p>` : '';

  const termsHtml = doc.optionalFields.showTermsSummary ? `
    <p class="paragraph" style="font-size:0.85em;color:var(--c-text-secondary)">${escHtml(doc.optionalFields.termsSummary)}</p>` : '';

  const body = `
  <div class="invoice">
    <div class="invoice-header">
      <div class="invoice-header-left">
        ${logoHtml}
        <div class="invoice-business-name" style="color:var(--c-primary)">${escHtml(doc.businessInfo.tradingName)}</div>
        <div class="invoice-detail">${escHtml(doc.businessInfo.address)}</div>
        <div class="invoice-detail">${escHtml(doc.businessInfo.phone)}</div>
        <div class="invoice-detail">${escHtml(doc.businessInfo.email)}</div>
        ${vatRegHtml}
      </div>
      <div class="invoice-header-right" style="background:var(--c-primary-light)">
        <div class="invoice-section-label" style="color:var(--c-primary)">Invoice Details</div>
        <div class="invoice-detail"><strong>Invoice:</strong> ${escHtml(doc.invoiceFields.invoiceNumberFormat)}</div>
        <div class="invoice-detail"><strong>Date:</strong> ${escHtml(doc.invoiceFields.dateFormat)}</div>
        <div class="invoice-detail"><strong>Due:</strong> ${escHtml(doc.invoiceFields.dueDateFormat)}</div>
        ${doc.invoiceFields.showPoNumber ? `<div class="invoice-detail"><strong>PO:</strong> ${escHtml(doc.invoiceFields.poNumberFormat)}</div>` : ''}
      </div>
    </div>

    <div class="invoice-billto">
      <div class="invoice-section-label" style="color:var(--c-primary)">Bill To</div>
      <div class="invoice-billto-name">${escHtml(doc.billToPlaceholders.clientName)}</div>
      <div class="invoice-detail">${escHtml(doc.billToPlaceholders.company)}</div>
      <div class="invoice-detail">${escHtml(doc.billToPlaceholders.addressLine1)}</div>
      <div class="invoice-detail">${escHtml(doc.billToPlaceholders.addressLine2)}</div>
      <div class="invoice-detail">${escHtml(doc.billToPlaceholders.email)}</div>
    </div>

    <div class="invoice-section-label" style="color:var(--c-primary)">Services Rendered</div>
    <table class="doc-table invoice-table">
      <thead><tr>
        <th style="background:var(--c-primary);color:var(--c-white);text-align:left">Description</th>
        <th style="background:var(--c-primary);color:var(--c-white);text-align:center">Qty</th>
        <th style="background:var(--c-primary);color:var(--c-white);text-align:right">Unit Price</th>
        <th style="background:var(--c-primary);color:var(--c-white);text-align:right">Amount</th>
      </tr></thead>
      <tbody>
        ${doc.lineItems.map((item, i) => `<tr class="${i%2===0?'row-even':'row-odd'}">
          <td>${escHtml(item.description)}</td>
          <td style="text-align:center">${escHtml(item.quantity)}</td>
          <td style="text-align:right">${escHtml(item.unitPrice)}</td>
          <td style="text-align:right">${escHtml(item.amount)}</td>
        </tr>`).join('\n')}
      </tbody>
    </table>

    <table class="invoice-totals">
      <tr class="totals-row"><td></td><td class="totals-label">Subtotal</td><td class="totals-value">${escHtml(doc.totals.subtotal)}</td></tr>
      ${vatRowHtml}
      <tr class="totals-row totals-final" style="background:var(--c-primary)">
        <td></td>
        <td class="totals-label" style="color:var(--c-white);font-weight:700">TOTAL DUE</td>
        <td class="totals-value" style="color:var(--c-white);font-weight:700">${escHtml(doc.totals.totalDue)}</td>
      </tr>
    </table>

    <div class="invoice-section-label" style="color:var(--c-primary)">Payment Terms & Methods</div>
    <p class="paragraph">${escHtml(doc.paymentTerms.paymentDeadline)}</p>
    <div class="invoice-methods">
      ${doc.paymentTerms.paymentMethods.map(m => `<div class="bullet"><span class="bullet-marker" style="color:var(--c-accent)">&#8226;</span><span>${escHtml(m)}</span></div>`).join('\n')}
    </div>
    ${bankHtml}${stripeHtml}${paypalHtml}
    <div class="invoice-reference">Reference: ${escHtml(doc.paymentTerms.paymentReference)}</div>

    <div class="invoice-section-label" style="color:var(--c-primary)">Late Payment Notice</div>
    <p class="paragraph" style="font-size:0.9em">${escHtml(doc.latePaymentClause)}</p>

    ${notesHtml}${termsHtml}

    <div class="document-footer">
      <div class="footer-separator"></div>
      <div class="footer-content" style="justify-content:center">
        Thank you for your business.
      </div>
      <div class="footer-content">
        <span>${escHtml(doc.businessInfo.legalName)}</span>
        <span class="footer-sep">|</span>
        <span>${escHtml(doc.businessInfo.email)}</span>
        <span class="footer-sep">|</span>
        <span>${escHtml(doc.businessInfo.phone)}</span>
      </div>
    </div>
  </div>`;

  return buildDocumentHtml(colourCSS, typoCSS, '', body, '');
}

// ── Late Payment Letters HTML ──

function renderLatePaymentHtml(doc: LatePaymentDocument, design: ClientDesign): string {
  const colours = parseBrandColours(design.brandColours);
  const colourCSS = buildColourCSS(colours);
  const typoCSS = buildTypographyCSS(design.visualStyle);

  const lettersHtml = doc.letters.map((letter, idx) => {
    const headingHtml = letter.heading
      ? `<div class="letter-heading" style="color:var(--c-primary);font-size:1.2em;font-weight:700;letter-spacing:0.05em">${escHtml(letter.heading)}</div>`
      : '';

    const bodyHtml = letter.body
      ? `<p class="paragraph">${escHtml(letter.body).replace(/\n/g, '<br>')}</p>`
      : '';

    const paragraphsHtml = letter.paragraphs
      ? Object.entries(letter.paragraphs).map(([key, val]) =>
          `<div class="letter-paragraph">
            <div class="letter-para-label" style="color:var(--c-primary);font-weight:600;font-size:0.85em;text-transform:uppercase;letter-spacing:0.04em">${escHtml(key.replace(/_/g, ' '))}</div>
            <p class="paragraph">${escHtml(val).replace(/\n/g, '<br>')}</p>
          </div>`
        ).join('\n')
      : '';

    const closeStatementHtml = letter.closeStatement
      ? `<p class="paragraph" style="font-weight:600">${escHtml(letter.closeStatement)}</p>` : '';

    return `
    <div class="letter ${idx > 0 ? 'page-break-before' : ''}">
      <div class="letter-letterhead" style="color:var(--c-primary);border-bottom:2px solid var(--c-primary);padding-bottom:8px;margin-bottom:16px">${escHtml(letter.letterhead).replace(/\n/g, '<br>')}</div>
      ${headingHtml}
      <div class="letter-addressee">${escHtml(letter.addresseeBlock).replace(/\n/g, '<br>')}</div>
      <div class="letter-date">${escHtml(letter.date)}</div>
      <div class="letter-salutation">${escHtml(letter.salutation)}</div>
      ${bodyHtml}${paragraphsHtml}${closeStatementHtml}
      <div class="letter-close">${escHtml(letter.close).replace(/\n/g, '<br>')}</div>
    </div>`;
  }).join('\n');

  const usageHtml = `
  <div class="usage-notes page-break-before">
    <div class="section-title" style="color:var(--c-primary)"><span class="section-title-accent"></span>Usage Notes</div>
    <div class="bullet"><span class="bullet-marker" style="color:var(--c-accent)">&#8226;</span><span>${escHtml(doc.usageNotes.calculatingInterest)}</span></div>
    <div class="bullet"><span class="bullet-marker" style="color:var(--c-accent)">&#8226;</span><span>${escHtml(doc.usageNotes.recoveryChargeNote)}</span></div>
    <div class="bullet"><span class="bullet-marker" style="color:var(--c-accent)">&#8226;</span><span>${escHtml(doc.usageNotes.recordKeeping)}</span></div>
    <div class="bullet"><span class="bullet-marker" style="color:var(--c-accent)">&#8226;</span><span>${escHtml(doc.usageNotes.legalAdvice)}</span></div>
  </div>`;

  return buildDocumentHtml(colourCSS, typoCSS, '', lettersHtml + usageHtml, '');
}

// ── Welcome Email HTML ──

function renderWelcomeEmailHtml(doc: WelcomeEmailDocument, design: ClientDesign): string {
  const colours = parseBrandColours(design.brandColours);
  const colourCSS = buildColourCSS(colours);
  const typoCSS = buildTypographyCSS(design.visualStyle);

  const emailsHtml = doc.emails.map((email, idx) => `
    <div class="email-card ${idx > 0 ? 'page-break-before' : ''}">
      <div class="email-header" style="background:var(--c-primary-light);border-left:4px solid var(--c-primary)">
        <div class="email-type" style="color:var(--c-primary);font-weight:700;text-transform:uppercase;letter-spacing:0.06em;font-size:0.8em">${escHtml(email.emailType.replace(/_/g, ' '))}</div>
        <div class="email-timing" style="color:var(--c-text-muted);font-size:0.85em">Send: ${escHtml(email.sendTiming)}</div>
      </div>
      <div class="email-subject" style="color:var(--c-primary)"><strong>Subject:</strong> ${escHtml(email.subject)}</div>
      <div class="email-body">
        <div class="email-greeting">${escHtml(email.greeting)}</div>
        <p class="paragraph">${escHtml(email.body).replace(/\n/g, '<br>')}</p>
        <div class="email-signoff">${escHtml(email.signOff).replace(/\n/g, '<br>')}</div>
      </div>
    </div>
  `).join('\n');

  return buildDocumentHtml(colourCSS, typoCSS, '', emailsHtml, '');
}

// ── Full Document Wrapper ──

function buildDocumentHtml(colourCSS: string, typoCSS: string, cover: string, body: string, footer: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Document</title>
<style>
  :root { ${colourCSS} ${typoCSS} }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: var(--f-body);
    font-weight: var(--f-body-weight);
    line-height: var(--line-height);
    color: var(--c-text);
    background: var(--c-bg);
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
  }
  .document { max-width: 780px; margin: 0 auto; padding: 48px 40px; }

  .cover-page {
    min-height: 100vh; display: flex; flex-direction: column;
    justify-content: center; align-items: center; text-align: center;
    position: relative; page-break-after: always; padding: 60px 40px;
  }
  .cover-accent-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 6px;
    background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
  }
  .cover-bottom-bar {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: var(--c-primary); opacity: 0.3;
  }
  .cover-content { padding: 40px 0; }
  .cover-title {
    font-family: var(--f-heading); font-weight: var(--f-heading-weight);
    font-size: 2.4em; color: var(--c-primary); margin-bottom: 12px;
    letter-spacing: -0.01em;
  }
  .cover-subtitle {
    font-size: 1.1em; color: var(--c-text-secondary); font-style: italic;
    margin-bottom: 8px;
  }
  .cover-meta { font-size: 0.95em; color: var(--c-text-muted); margin-bottom: 4px; }
  .cover-date { font-size: 0.9em; color: var(--c-text-muted); margin-top: 8px; }

  .section { margin-bottom: 36px; }
  .section-title {
    font-family: var(--f-heading); font-weight: var(--f-heading-weight);
    font-size: 1.35em; color: var(--c-primary); padding: 10px 14px;
    margin-bottom: 16px; border-bottom: 2px solid var(--c-primary);
    background: var(--c-primary-light); display: flex; align-items: center;
    gap: 10px; page-break-after: avoid;
  }
  .section-title-accent {
    display: inline-block; width: 4px; height: 20px;
    background: var(--c-accent); border-radius: 2px; flex-shrink: 0;
  }

  .clause {
    margin-bottom: 8px; padding-left: 48px; text-indent: -48px;
    line-height: var(--line-height);
  }
  .clause-number { font-weight: 700; margin-right: 6px; white-space: nowrap; }
  .paragraph { margin-bottom: 12px; line-height: var(--line-height); }
  .bullet {
    display: flex; align-items: flex-start; gap: 8px;
    margin-bottom: 6px; padding-left: 16px;
  }
  .bullet-marker { font-size: 1.1em; flex-shrink: 0; margin-top: 1px; }
  .bullet-text { line-height: var(--line-height); }
  .sub-heading {
    font-family: var(--f-heading); font-weight: 600; font-size: 1.05em;
    margin-top: 18px; margin-bottom: 8px; page-break-after: avoid;
  }

  .signature-block {
    margin-top: 28px; padding: 20px; background: var(--c-surface);
    border: 1px solid var(--c-border-light); border-radius: 6px;
  }
  .sig-party { font-weight: 700; font-size: 1em; margin-bottom: 12px; }
  .sig-line { border-bottom: 1px solid var(--c-border); padding: 8px 0 4px; min-width: 260px; color: var(--c-text-muted); font-size: 0.9em; }
  .sig-field { margin-top: 6px; font-size: 0.95em; }
  .sig-label { color: var(--c-text-muted); }
  .sig-value { font-weight: 500; }

  .doc-table {
    width: 100%; border-collapse: collapse; margin: 12px 0 20px;
    font-size: 0.95em;
  }
  .doc-table th {
    padding: 10px 14px; text-align: left; font-weight: 600;
    font-size: 0.9em; letter-spacing: 0.02em;
  }
  .doc-table td { padding: 9px 14px; border-bottom: 1px solid var(--c-border-light); }
  .row-odd td { background: var(--c-primary-light); }

  .invoice-header { display: flex; gap: 24px; margin-bottom: 28px; }
  .invoice-header-left { flex: 1; }
  .invoice-header-right { flex: 1; padding: 16px; border-radius: 6px; }
  .invoice-business-name { font-size: 1.4em; font-weight: 700; margin: 8px 0 4px; }
  .invoice-detail { font-size: 0.9em; color: var(--c-text-secondary); margin-bottom: 2px; }
  .invoice-vat-reg { font-size: 0.85em; color: var(--c-text-muted); margin-top: 4px; }
  .invoice-billto { margin-bottom: 24px; padding: 16px; background: var(--c-surface); border-radius: 6px; }
  .invoice-billto-name { font-weight: 700; font-size: 1.05em; margin-bottom: 4px; }
  .invoice-section-label { font-weight: 700; font-size: 1.1em; margin: 20px 0 8px; padding-bottom: 4px; border-bottom: 1px solid var(--c-accent); }
  .invoice-table td, .invoice-table th { padding: 10px 12px; }
  .invoice-totals { width: 320px; margin-left: auto; margin-top: 16px; border-collapse: collapse; }
  .totals-row td { padding: 6px 12px; }
  .totals-label { text-align: right; font-size: 0.95em; }
  .totals-value { text-align: right; font-weight: 600; font-size: 0.95em; }
  .totals-final td { border-radius: 0; }
  .invoice-methods { margin: 8px 0 12px; }
  .invoice-bank { margin: 8px 0 12px; padding-left: 24px; font-size: 0.9em; }
  .invoice-reference { margin: 12px 0; font-size: 0.9em; color: var(--c-text-secondary); }

  .letter { margin-bottom: 40px; }
  .letter-letterhead { font-weight: 700; font-size: 1.1em; line-height: 1.5; }
  .letter-heading { margin: 16px 0 12px; padding: 12px; background: var(--c-primary-light); border: 2px solid var(--c-primary); text-align: center; }
  .letter-addressee { margin: 12px 0; font-size: 0.95em; line-height: 1.6; color: var(--c-text-secondary); }
  .letter-date { font-size: 0.9em; color: var(--c-text-muted); margin-bottom: 12px; }
  .letter-salutation { margin-bottom: 12px; }
  .letter-paragraph { margin-bottom: 16px; }
  .letter-para-label { margin-bottom: 4px; }
  .letter-close { margin-top: 24px; line-height: 1.7; white-space: pre-line; }

  .email-card { margin-bottom: 36px; background: var(--c-surface); border-radius: 8px; overflow: hidden; }
  .email-header { padding: 14px 20px; }
  .email-subject { padding: 12px 20px; font-size: 1em; border-bottom: 1px solid var(--c-border-light); }
  .email-body { padding: 20px; }
  .email-greeting { margin-bottom: 12px; }
  .email-signoff { margin-top: 20px; white-space: pre-line; color: var(--c-text-secondary); font-size: 0.95em; }

  .usage-notes { margin-top: 40px; padding: 24px; background: var(--c-surface); border-radius: 8px; }

  .document-footer { margin-top: 48px; text-align: center; }
  .footer-separator { border-top: 2px solid var(--c-primary); margin-bottom: 12px; opacity: 0.4; }
  .footer-content { display: flex; justify-content: center; gap: 12px; color: var(--c-text-muted); font-size: 0.85em; font-style: italic; flex-wrap: wrap; }
  .footer-name { font-style: italic; }
  .footer-sep { opacity: 0.4; }

  .page-break-before { page-break-before: always; }

  @media print {
    body { font-size: 11pt; }
    .document { padding: 0; max-width: none; }
    .cover-page { min-height: auto; padding: 80px 0; }
    .section { break-inside: avoid; }
    .clause { break-inside: avoid; }
    .signature-block { break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="document">
${cover}
${body}
${footer}
</div>
</body>
</html>`;
}

// ── HTML Escape ──

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Public API ──

export function renderDocumentHtml(jsonDoc: AnyDocument, design: ClientDesign, docLabel: string): string {
  const kind = detectDocumentKind(jsonDoc);
  switch (kind) {
    case 'invoice':
      return renderInvoiceHtml(jsonDoc as InvoiceDocument, design);
    case 'late_payment':
      return renderLatePaymentHtml(jsonDoc as LatePaymentDocument, design);
    case 'welcome_email':
      return renderWelcomeEmailHtml(jsonDoc as WelcomeEmailDocument, design);
    default:
      return renderStructuredHtml(jsonDoc as StructuredDocument, design, docLabel);
  }
}
