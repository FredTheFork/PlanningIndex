// ─────────────────────────────────────────────────────────────────────────────
// HTML TEMPLATES — Professional in-app preview rendering
// ─────────────────────────────────────────────────────────────────────────────

import { resolveDesignSystem, DesignSystem } from './design-system.ts';
import {
  AnyDocument, DocumentModel, DocumentBlock, detectDocumentKind,
  HeadingBlock, ParagraphBlock, ClauseBlock, BulletBlock, TableBlock,
  CalloutBlock, SignatureBlock, DividerBlock,
  InvoiceDocument, LatePaymentDocument, WelcomeEmailDocument,
} from './document-types.ts';
import { ClientDesign, parseBrandColours } from './rendering.ts';

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export function renderDocumentHtml(jsonDoc: AnyDocument, design: ClientDesign, docLabel: string): string {
  try {
    const kind = detectDocumentKind(jsonDoc);
    const ds = resolveDesignSystem(design);

    switch (kind) {
      case 'invoice':
        return renderInvoiceHtml(jsonDoc as InvoiceDocument, design, ds);
      case 'late_payment':
        return renderLatePaymentHtml(jsonDoc as LatePaymentDocument, design, ds);
      case 'welcome_email':
        return renderWelcomeEmailHtml(jsonDoc as WelcomeEmailDocument, design, ds);
      default:
        return renderDocumentModelHtml(jsonDoc as DocumentModel, design, ds, docLabel);
    }
  } catch {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Error</title></head><body><p>Unable to render document preview.</p></body></html>`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS STYLES
// ─────────────────────────────────────────────────────────────────────────────

function buildCSS(ds: DesignSystem): string {
  return `
:root {
  --c-primary: ${ds.primary.hex};
  --c-secondary: ${ds.secondary.hex};
  --c-accent: ${ds.accent.hex};
  --c-surface: ${ds.surface.hex};
  --c-body: ${ds.bodyTextColour.hex};
  --c-muted: ${ds.mutedTextColour.hex};
  --c-white: #ffffff;
  --f-main: '${ds.font}', Calibri, 'Helvetica Neue', Arial, sans-serif;
  --sz-body: ${ds.type.bodyPt}pt;
  --sz-small: ${ds.type.smallPt}pt;
  --sz-h1: ${ds.type.h1Pt}pt;
  --sz-h2: ${ds.type.h2Pt}pt;
  --sz-h3: ${ds.type.h3Pt}pt;
  --sz-display: ${ds.type.displayPt}pt;
}

* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:var(--f-main); font-size:var(--sz-body); color:var(--c-body); background:#fff; -webkit-font-smoothing:antialiased; }
.document { max-width:800px; margin:0 auto; padding:40px; }

/* Cover page */
.cover { text-align:center; padding:80px 0 60px; border-bottom:3px solid var(--c-primary); margin-bottom:48px; }
.cover-logo { max-height:80px; max-width:240px; object-fit:contain; margin-bottom:32px; display:block; margin-left:auto; margin-right:auto; }
.cover-title { font-size:var(--sz-display); font-weight:700; color:var(--c-primary); line-height:1.2; margin-bottom:12px; }
.cover-subtitle { font-size:var(--sz-h2); color:var(--c-secondary); font-style:italic; margin-bottom:8px; }
.cover-prepared { font-size:var(--sz-body); color:var(--c-muted); font-style:italic; margin-bottom:4px; }
.cover-business { font-size:var(--sz-small); color:var(--c-muted); margin-bottom:4px; }
.cover-date { font-size:var(--sz-small); color:var(--c-muted); }

/* Section headings */
.section { margin-bottom:36px; }
.sh-capsule { background:var(--c-primary); color:var(--c-white); padding:9px 16px; font-size:var(--sz-h1); font-weight:700; margin-bottom:16px; }
.sh-left-rule { border-left:5px solid var(--c-accent); padding-left:14px; color:var(--c-primary); font-size:var(--sz-h1); font-weight:700; margin-bottom:14px; padding-top:2px; padding-bottom:2px; }
.sh-full-rule { color:var(--c-primary); font-size:var(--sz-h1); font-weight:700; border-bottom:2px solid var(--c-accent); padding-bottom:6px; margin-bottom:16px; }
.sh-underline-accent { color:var(--c-primary); font-size:var(--sz-h1); font-weight:700; margin-bottom:4px; }
.sh-underline-accent::after { content:''; display:block; width:60px; height:3px; background:var(--c-accent); margin-top:4px; margin-bottom:12px; }
.sh-plain { color:var(--c-primary); font-size:var(--sz-h1); font-weight:700; margin-bottom:12px; }

/* Block styles */
.b-heading-sub { color:var(--c-secondary); font-size:var(--sz-h2); font-weight:700; margin:20px 0 8px; }
.b-heading-minor { color:var(--c-secondary); font-size:var(--sz-h3); font-weight:600; font-style:italic; margin:14px 0 6px; }
.b-paragraph { margin-bottom:10px; line-height:1.6; text-align:justify; }
.b-clause { display:flex; gap:12px; margin-bottom:7px; padding-left:20px; line-height:1.5; }
.b-clause-num { font-weight:700; color:var(--c-primary); white-space:nowrap; flex-shrink:0; min-width:32px; }
.b-clause-text { flex:1; }
.b-bullet { display:flex; gap:10px; padding-left:20px; margin-bottom:5px; line-height:1.5; }
.b-bullet-l1 { padding-left:40px; }
.b-bullet-marker { color:var(--c-accent); font-size:1.1em; flex-shrink:0; margin-top:1px; }

/* Tables */
.b-table { width:100%; border-collapse:collapse; margin:12px 0 20px; font-size:calc(var(--sz-body) - 0.5pt); }
.b-table thead th { background:var(--c-primary); color:var(--c-white); padding:9px 12px; text-align:left; font-weight:600; }
.b-table tbody td { padding:8px 12px; border-bottom:1px solid #e8e8e8; }
.b-table tbody tr:nth-child(even) { background:var(--c-surface); }
.table-open tbody td { border-bottom:1px solid #e0e0e0; }
.table-minimalist { border:1px solid #ddd; }
.table-minimalist td, .table-minimalist th { border:1px solid #ddd; }
.table-minimalist tbody tr { background:none !important; }
.table-financial td:last-child, .table-financial th:last-child { text-align:right; font-family:'Courier New',monospace; }
.table-caption { font-size:var(--sz-small); color:var(--c-muted); font-style:italic; margin-top:4px; margin-bottom:14px; }

/* Callout */
.b-callout { border-left:4px solid var(--c-accent); background:var(--c-surface); padding:12px 16px; margin:14px 0; }
.b-callout-label { font-size:var(--sz-small); font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--c-primary); margin-bottom:5px; }
.b-callout-text { font-style:italic; line-height:1.6; }

/* Signature */
.b-signature { border:1px solid #ddd; border-radius:4px; background:var(--c-surface); padding:20px 24px; margin:20px 0; }
.b-sig-party { font-weight:700; color:var(--c-primary); margin-bottom:14px; font-size:calc(var(--sz-body) + 0.5pt); }
.b-sig-line { border-bottom:1px solid #bbb; margin-bottom:8px; padding-bottom:20px; color:var(--c-muted); font-size:var(--sz-small); }
.b-sig-field { font-size:var(--sz-body); color:var(--c-muted); margin-top:6px; }
.b-sig-value { color:var(--c-body); }

/* Dividers */
.b-divider-light { border:none; border-top:1px solid #ddd; margin:16px 0 20px; }
.b-divider-heavy { border:none; border-top:2px solid var(--c-primary); margin:20px 0 24px; }

/* Invoice specific */
.inv-header { display:flex; gap:24px; margin-bottom:28px; }
.inv-header-left { flex:1; }
.inv-header-right { flex:1; padding:16px; border-radius:6px; background:var(--c-surface); }
.inv-logo { max-height:56px; max-width:180px; object-fit:contain; margin-bottom:8px; }
.inv-business-name { font-size:calc(var(--sz-h1) + 2pt); font-weight:700; color:var(--c-primary); margin-bottom:4px; }
.inv-detail { font-size:var(--sz-small); color:var(--c-muted); margin-bottom:2px; }
.inv-section-label { font-weight:700; font-size:var(--sz-h3); color:var(--c-primary); margin:20px 0 8px; padding-bottom:4px; border-bottom:1px solid var(--c-accent); }
.inv-billto { margin-bottom:24px; padding:16px; background:var(--c-surface); border-radius:6px; }
.inv-billto-name { font-weight:700; color:var(--c-primary); margin-bottom:4px; }
.inv-totals { width:320px; margin-left:auto; margin-top:16px; }
.inv-totals-row td { padding:6px 12px; }
.inv-totals-label { text-align:right; font-size:var(--sz-small); }
.inv-totals-value { text-align:right; font-weight:600; font-size:var(--sz-small); }
.inv-totals-final { background:var(--c-primary); }
.inv-totals-final td { color:var(--c-white); }
.inv-bank { margin:8px 0 12px; padding-left:24px; font-size:var(--sz-small); color:var(--c-muted); }
.inv-ref { margin:12px 0; font-size:var(--sz-small); color:var(--c-muted); }

/* Letter specific */
.letter { margin-bottom:40px; }
.letter-letterhead { font-weight:700; font-size:calc(var(--sz-h1) + 2pt); color:var(--c-primary); border-bottom:2px solid var(--c-primary); padding-bottom:8px; margin-bottom:16px; line-height:1.5; }
.letter-heading { margin:16px 0 12px; padding:12px; background:var(--c-surface); border:2px solid var(--c-primary); text-align:center; color:var(--c-primary); font-weight:700; font-size:var(--sz-h3); text-transform:uppercase; letter-spacing:0.05em; }
.letter-addressee { margin:12px 0; font-size:var(--sz-small); line-height:1.6; color:var(--c-secondary); }
.letter-date { font-size:var(--sz-small); color:var(--c-muted); margin-bottom:12px; }
.letter-salutation { margin-bottom:12px; }
.letter-para-label { font-weight:600; font-size:var(--sz-small); text-transform:uppercase; letter-spacing:0.04em; color:var(--c-primary); margin-bottom:4px; }
.letter-close { margin-top:24px; line-height:1.7; white-space:pre-line; }

/* Email specific */
.email-card { margin-bottom:36px; background:var(--c-surface); border-radius:8px; overflow:hidden; }
.email-header { padding:14px 20px; background:var(--c-surface); border-left:4px solid var(--c-primary); }
.email-type { font-weight:700; text-transform:uppercase; letter-spacing:0.06em; font-size:var(--sz-small); color:var(--c-primary); }
.email-timing { color:var(--c-muted); font-size:var(--sz-small); }
.email-subject { padding:12px 20px; font-size:var(--sz-body); border-bottom:1px solid #ddd; }
.email-body { padding:20px; }
.email-greeting { margin-bottom:12px; }
.email-signoff { margin-top:20px; white-space:pre-line; color:var(--c-secondary); font-size:var(--sz-small); }

/* Usage notes */
.usage-notes { margin-top:40px; padding:24px; background:var(--c-surface); border-radius:8px; }
.page-break-before { page-break-before:always; }

/* Footer */
.doc-footer { margin-top:48px; text-align:center; }
.doc-footer-sep { border-top:2px solid var(--c-primary); margin-bottom:12px; opacity:0.4; }
.doc-footer-content { display:flex; justify-content:center; gap:12px; color:var(--c-muted); font-size:var(--sz-small); font-style:italic; flex-wrap:wrap; }

@media print {
  body { font-size:10pt; }
  .document { padding:0; max-width:none; }
  .cover { page-break-after:always; }
  .section { page-break-inside:avoid; }
  .b-clause { page-break-inside:avoid; }
  .b-signature { page-break-inside:avoid; }
  .b-callout { page-break-inside:avoid; }
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT MODEL RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderDocumentModelHtml(doc: DocumentModel, design: ClientDesign, ds: DesignSystem, docLabel: string): string {
  const displayName = design.brandIdentity.toLowerCase().includes('personal')
    ? (design.firstName || design.businessName)
    : design.businessName;

  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Cover page
  let coverHtml = '<div class="cover">';
  if (design.logoBase64) {
    coverHtml += `<img class="cover-logo" src="${design.logoBase64}" alt="Logo">`;
  }
  coverHtml += `<div class="cover-title">${escHtml(doc.metadata.title)}</div>`;
  if (doc.metadata.subtitle) {
    coverHtml += `<div class="cover-subtitle">${escHtml(doc.metadata.subtitle)}</div>`;
  }
  coverHtml += `<div class="cover-prepared">Prepared for ${escHtml(displayName)}</div>`;
  coverHtml += `<div class="cover-business">${escHtml(doc.metadata.businessName)}</div>`;
  coverHtml += `<div class="cover-date">${dateStr}</div>`;
  coverHtml += '</div>';

  // Sections
  const sectionsHtml = doc.sections.map(section => {
    let html = '<div class="section">';

    if (section.heading) {
      const headingClass = getHeadingClass(ds.headingTreatment);
      html += `<div class="${headingClass}">${escHtml(section.heading)}</div>`;
    }

    html += section.blocks.map(block => renderBlockHtml(block, ds)).join('\n');
    html += '</div>';
    return html;
  }).join('\n');

  return wrapDocument(buildCSS(ds), coverHtml, sectionsHtml);
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderBlockHtml(block: DocumentBlock, ds: DesignSystem): string {
  switch (block.type) {
    case 'heading': {
      const hb = block as HeadingBlock;
      if (hb.variant === 'section') {
        const cls = getHeadingClass(ds.headingTreatment);
        return `<div class="${cls}">${escHtml(hb.text)}</div>`;
      } else if (hb.variant === 'subsection') {
        return `<div class="b-heading-sub">${escHtml(hb.text)}</div>`;
      } else {
        return `<div class="b-heading-minor">${escHtml(hb.text)}</div>`;
      }
    }

    case 'paragraph': {
      const pb = block as ParagraphBlock;
      return `<p class="b-paragraph">${escHtml(pb.text)}</p>`;
    }

    case 'clause': {
      const cb = block as ClauseBlock;
      return `<div class="b-clause"><span class="b-clause-num">${escHtml(cb.number)}.</span><span class="b-clause-text">${escHtml(cb.text)}</span></div>`;
    }

    case 'bullet': {
      const bb = block as BulletBlock;
      const levelClass = bb.level && bb.level > 0 ? ' b-bullet-l1' : '';
      return `<div class="b-bullet${levelClass}"><span class="b-bullet-marker">&#8226;</span><span>${escHtml(bb.text)}</span></div>`;
    }

    case 'table': {
      const tb = block as TableBlock;
      let tableClass = 'b-table';
      if (tb.styleHint === 'financial') {
        tableClass += ' table-financial';
      } else if (tb.styleHint === 'minimalist' || ds.tableTreatment === 'minimalist') {
        tableClass += ' table-minimalist';
      } else if (ds.tableTreatment === 'open') {
        tableClass += ' table-open';
      }

      const headerRow = `<tr>${tb.headers.map(h => `<th>${escHtml(h)}</th>`).join('')}</tr>`;
      const dataRows = tb.rows.map((row, i) =>
        `<tr>${row.map((cell, ci) => `<td${tb.styleHint === 'financial' && ci === row.length - 1 ? ' style="text-align:right;font-family:\'Courier New\',monospace"' : ''}>${escHtml(cell)}</td>`).join('')}</tr>`
      ).join('\n');

      let html = `<table class="${tableClass}"><thead>${headerRow}</thead><tbody>${dataRows}</tbody></table>`;
      if (tb.caption) {
        html += `<div class="table-caption">${escHtml(tb.caption)}</div>`;
      }
      return html;
    }

    case 'callout': {
      const cab = block as CalloutBlock;
      let html = '<div class="b-callout">';
      if (cab.label) {
        html += `<div class="b-callout-label">${escHtml(cab.label)}</div>`;
      }
      html += `<div class="b-callout-text">${escHtml(cab.text)}</div>`;
      html += '</div>';
      return html;
    }

    case 'signature': {
      const sb = block as SignatureBlock;
      let html = '<div class="b-signature">';
      sb.parties.forEach(party => {
        html += `<div class="b-sig-party">${escHtml(party.label)}</div>`;
        html += `<div class="b-sig-line">Signature: _______________________</div>`;
        html += `<div class="b-sig-line">Date: _______________________</div>`;
        html += `<div class="b-sig-field">${escHtml(party.nameField)}</div>`;
        if (party.companyField) {
          html += `<div class="b-sig-field">${escHtml(party.companyField)}</div>`;
        }
      });
      html += '</div>';
      return html;
    }

    case 'divider': {
      const db = block as DividerBlock;
      return `<hr class="b-divider-${db.weight}">`;
    }

    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INVOICE RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderInvoiceHtml(doc: InvoiceDocument, design: ClientDesign, ds: DesignSystem): string {
  const logoHtml = design.logoBase64
    ? `<img class="inv-logo" src="${design.logoBase64}" alt="Logo">`
    : '';

  const vatRegHtml = doc.metadata.vatRegistered
    ? `<div class="inv-detail">VAT No: ${escHtml(doc.metadata.vatNumber)}</div>`
    : '';

  const bankHtml = doc.paymentTerms.bankTransferDetails.show ? `
    <div class="inv-section-label">Bank Details</div>
    <div class="inv-bank">
      <div>Account: ${escHtml(doc.paymentTerms.bankTransferDetails.accountName)}</div>
      <div>Sort Code: ${escHtml(doc.paymentTerms.bankTransferDetails.sortCode)}</div>
      <div>Account No: ${escHtml(doc.paymentTerms.bankTransferDetails.accountNumber)}</div>
    </div>` : '';

  const stripeHtml = doc.paymentTerms.stripeDetails.show
    ? `<div class="b-bullet"><span class="b-bullet-marker">&#8226;</span><span>Stripe Payment: ${escHtml(doc.paymentTerms.stripeDetails.paymentLink)}</span></div>` : '';

  const paypalHtml = doc.paymentTerms.paypalDetails.show
    ? `<div class="b-bullet"><span class="b-bullet-marker">&#8226;</span><span>PayPal: ${escHtml(doc.paymentTerms.paypalDetails.paypalEmail)}</span></div>` : '';

  const vatRowHtml = doc.totals.showVatLine
    ? `<tr class="inv-totals-row"><td></td><td class="inv-totals-label">VAT (${doc.totals.vatPercentage}%)</td><td class="inv-totals-value">${escHtml(doc.totals.vatAmount)}</td></tr>` : '';

  const notesHtml = doc.optionalFields.showNotesSection
    ? `<div class="inv-section-label">Notes</div><p class="b-paragraph">${escHtml(doc.optionalFields.notesPlaceholder)}</p>` : '';

  const termsHtml = doc.optionalFields.showTermsSummary
    ? `<p class="b-paragraph" style="font-size:var(--sz-small);color:var(--c-muted)">${escHtml(doc.optionalFields.termsSummary)}</p>` : '';

  const body = `
<div class="inv-header">
  <div class="inv-header-left">
    ${logoHtml}
    <div class="inv-business-name">${escHtml(doc.businessInfo.tradingName)}</div>
    <div class="inv-detail">${escHtml(doc.businessInfo.address)}</div>
    <div class="inv-detail">${escHtml(doc.businessInfo.phone)}</div>
    <div class="inv-detail">${escHtml(doc.businessInfo.email)}</div>
    ${vatRegHtml}
  </div>
  <div class="inv-header-right">
    <div class="inv-section-label">Invoice Details</div>
    <div class="inv-detail"><strong>Invoice:</strong> ${escHtml(doc.invoiceFields.invoiceNumberFormat)}</div>
    <div class="inv-detail"><strong>Date:</strong> ${escHtml(doc.invoiceFields.dateFormat)}</div>
    <div class="inv-detail"><strong>Due:</strong> ${escHtml(doc.invoiceFields.dueDateFormat)}</div>
    ${doc.invoiceFields.showPoNumber ? `<div class="inv-detail"><strong>PO:</strong> ${escHtml(doc.invoiceFields.poNumberFormat)}</div>` : ''}
  </div>
</div>

<div class="inv-billto">
  <div class="inv-section-label">Bill To</div>
  <div class="inv-billto-name">${escHtml(doc.billToPlaceholders.clientName)}</div>
  <div class="inv-detail">${escHtml(doc.billToPlaceholders.company)}</div>
  <div class="inv-detail">${escHtml(doc.billToPlaceholders.addressLine1)}</div>
  <div class="inv-detail">${escHtml(doc.billToPlaceholders.addressLine2)}</div>
  <div class="inv-detail">${escHtml(doc.billToPlaceholders.email)}</div>
</div>

<div class="inv-section-label">Services Rendered</div>
<table class="b-table table-financial">
  <thead><tr>
    <th>Description</th>
    <th style="text-align:center">Qty</th>
    <th style="text-align:right">Unit Price</th>
    <th style="text-align:right">Amount</th>
  </tr></thead>
  <tbody>
    ${doc.lineItems.map(item => `<tr>
      <td>${escHtml(item.description)}</td>
      <td style="text-align:center">${escHtml(item.quantity)}</td>
      <td style="text-align:right">${escHtml(item.unitPrice)}</td>
      <td style="text-align:right">${escHtml(item.amount)}</td>
    </tr>`).join('\n')}
  </tbody>
</table>

<table class="inv-totals">
  <tr class="inv-totals-row"><td></td><td class="inv-totals-label">Subtotal</td><td class="inv-totals-value">${escHtml(doc.totals.subtotal)}</td></tr>
  ${vatRowHtml}
  <tr class="inv-totals-row inv-totals-final"><td></td><td class="inv-totals-label">TOTAL DUE</td><td class="inv-totals-value">${escHtml(doc.totals.totalDue)}</td></tr>
</table>

<div class="inv-section-label">Payment Terms &amp; Methods</div>
<p class="b-paragraph">${escHtml(doc.paymentTerms.paymentDeadline)}</p>
${doc.paymentTerms.paymentMethods.map(m => `<div class="b-bullet"><span class="b-bullet-marker">&#8226;</span><span>${escHtml(m)}</span></div>`).join('\n')}
${bankHtml}${stripeHtml}${paypalHtml}
<div class="inv-ref">Reference: ${escHtml(doc.paymentTerms.paymentReference)}</div>

<div class="inv-section-label">Late Payment Notice</div>
<p class="b-paragraph" style="font-size:var(--sz-small)">${escHtml(doc.latePaymentClause)}</p>

${notesHtml}${termsHtml}

<div class="doc-footer">
  <div class="doc-footer-sep"></div>
  <div class="doc-footer-content">Thank you for your business.</div>
  <div class="doc-footer-content">
    <span>${escHtml(doc.businessInfo.legalName)}</span>
    <span>|</span>
    <span>${escHtml(doc.businessInfo.email)}</span>
    <span>|</span>
    <span>${escHtml(doc.businessInfo.phone)}</span>
  </div>
</div>`;

  return wrapDocument(buildCSS(ds), '', body);
}

// ─────────────────────────────────────────────────────────────────────────────
// LATE PAYMENT RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderLatePaymentHtml(doc: LatePaymentDocument, design: ClientDesign, ds: DesignSystem): string {
  const lettersHtml = doc.letters.map((letter, idx) => {
    const headingHtml = letter.heading
      ? `<div class="letter-heading">${escHtml(letter.heading)}</div>`
      : '';

    const bodyHtml = letter.body
      ? `<p class="b-paragraph">${escHtml(letter.body).replace(/\n/g, '<br>')}</p>`
      : '';

    const paragraphsHtml = letter.paragraphs
      ? Object.entries(letter.paragraphs).map(([key, val]) =>
          `<div class="letter-para-label">${escHtml(key.replace(/_/g, ' '))}</div>
           <p class="b-paragraph">${escHtml(val).replace(/\n/g, '<br>')}</p>`
        ).join('\n')
      : '';

    const closeStatementHtml = letter.closeStatement
      ? `<p class="b-paragraph" style="font-weight:600">${escHtml(letter.closeStatement)}</p>` : '';

    return `
<div class="letter${idx > 0 ? ' page-break-before' : ''}">
  <div class="letter-letterhead">${escHtml(letter.letterhead).replace(/\n/g, '<br>')}</div>
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
  <div class="sh-full-rule">Usage Notes</div>
  <div class="b-bullet"><span class="b-bullet-marker">&#8226;</span><span>${escHtml(doc.usageNotes.calculatingInterest)}</span></div>
  <div class="b-bullet"><span class="b-bullet-marker">&#8226;</span><span>${escHtml(doc.usageNotes.recoveryChargeNote)}</span></div>
  <div class="b-bullet"><span class="b-bullet-marker">&#8226;</span><span>${escHtml(doc.usageNotes.recordKeeping)}</span></div>
  <div class="b-bullet"><span class="b-bullet-marker">&#8226;</span><span>${escHtml(doc.usageNotes.legalAdvice)}</span></div>
</div>`;

  return wrapDocument(buildCSS(ds), '', lettersHtml + usageHtml);
}

// ─────────────────────────────────────────────────────────────────────────────
// WELCOME EMAIL RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderWelcomeEmailHtml(doc: WelcomeEmailDocument, design: ClientDesign, ds: DesignSystem): string {
  const emailsHtml = doc.emails.map((email, idx) => `
<div class="email-card${idx > 0 ? ' page-break-before' : ''}">
  <div class="email-header">
    <div class="email-type">${escHtml(email.emailType.replace(/_/g, ' '))}</div>
    <div class="email-timing">Send: ${escHtml(email.sendTiming)}</div>
  </div>
  <div class="email-subject"><strong>Subject:</strong> ${escHtml(email.subject)}</div>
  <div class="email-body">
    <div class="email-greeting">${escHtml(email.greeting)}</div>
    <p class="b-paragraph">${escHtml(email.body).replace(/\n/g, '<br>')}</p>
    <div class="email-signoff">${escHtml(email.signOff).replace(/\n/g, '<br>')}</div>
  </div>
</div>
`).join('\n');

  return wrapDocument(buildCSS(ds), '', emailsHtml);
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getHeadingClass(treatment: string): string {
  switch (treatment) {
    case 'capsule': return 'sh-capsule';
    case 'left-rule': return 'sh-left-rule';
    case 'full-rule': return 'sh-full-rule';
    case 'underline-accent': return 'sh-underline-accent';
    default: return 'sh-plain';
  }
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapDocument(css: string, cover: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Document Preview</title>
<style>
${css}
</style>
</head>
<body>
<div class="document">
${cover}
${body}
</div>
</body>
</html>`;
}
