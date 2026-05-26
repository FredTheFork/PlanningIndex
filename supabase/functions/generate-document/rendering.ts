// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT RENDERING — DOCX generation with branded headers and styling
// ─────────────────────────────────────────────────────────────────────────────

import {
  Document as DocxDocument,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  ImageRun,
  AlignmentType,
  BorderStyle,
  ShadingType,
  WidthType,
  VerticalAlign,
  HeadingLevel,
  LevelFormat,
  TabStopType,
  PageNumber,
  Packer,
} from 'npm:docx@9.1.1';

import type {
  AnyDocument,
  DocumentModel,
  DocumentMetadata,
  DocumentBlock,
  DocumentSection,
  HeadingVariant,
  BlockDensity,
} from './document-types.ts';
import { detectDocumentKind } from './document-types.ts';
import type { DesignSystem } from './design-system.ts';
import { resolveDesignSystem, parseBrandColours, hexToToken } from './design-system.ts';

// Re-exports for backward compatibility
export { parseBrandColours } from './design-system.ts';
export { resolveDesignSystem } from './design-system.ts';

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT DESIGN INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

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

export interface TableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
  level: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const token = hexToToken(hex);
  return { r: token.r / 255, g: token.g / 255, b: token.b / 255 };
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGO IMAGE DATA
// ─────────────────────────────────────────────────────────────────────────────

interface LogoImageData {
  bytes: Uint8Array;
  format: 'png' | 'jpg';
  widthPt: number;
  heightPt: number;
}

function extractLogoImageData(logoBase64: string | null): LogoImageData | null {
  if (!logoBase64) return null;

  try {
    // Parse data URL format: data:image/png;base64,<data>
    const match = logoBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    if (!match) return null;

    const mimeType = match[1].toLowerCase();
    const format: 'png' | 'jpg' = mimeType === 'png' ? 'png' : 'jpg';
    const base64Data = match[2];

    // Decode base64 to Uint8Array via atob()
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return {
      bytes,
      format,
      widthPt: 144,
      heightPt: 57,
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT STYLES
// ─────────────────────────────────────────────────────────────────────────────

function buildDocumentStyles(ds: DesignSystem): object {
  return {
    default: {
      document: {
        run: {
          font: ds.font,
          size: ds.type.bodyHp,
          color: ds.bodyTextColour.docxHex,
        },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          size: ds.type.h1Hp,
          bold: true,
          color: ds.primary.docxHex,
          font: ds.font,
        },
        paragraph: {
          spacing: {
            before: ds.spacing.sectionBeforeDxa,
            after: ds.spacing.sectionAfterDxa,
          },
          outlineLevel: 0,
        },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          size: ds.type.h2Hp,
          bold: true,
          color: ds.secondary.docxHex,
          font: ds.font,
        },
        paragraph: {
          spacing: {
            before: ds.spacing.headingBeforeDxa,
            after: ds.spacing.headingAfterDxa,
          },
          outlineLevel: 1,
        },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          size: ds.type.h3Hp,
          bold: true,
          color: ds.secondary.docxHex,
          font: ds.font,
        },
        paragraph: {
          spacing: {
            before: 200,
            after: 80,
          },
          outlineLevel: 2,
        },
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NUMBERING CONFIG
// ─────────────────────────────────────────────────────────────────────────────

function buildNumberingConfig(ds: DesignSystem): object {
  return {
    config: [
      {
        reference: 'bullet-l0',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u2022',
            font: 'Symbol',
            style: {
              paragraph: {
                indent: {
                  left: ds.spacing.bulletIndentDxa,
                  hanging: ds.spacing.bulletHangingDxa,
                },
                spacing: {
                  after: ds.spacing.bulletAfterDxa,
                },
              },
            },
            run: {
              color: ds.accent.docxHex,
            },
          },
        ],
      },
      {
        reference: 'bullet-l1',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '\u25E6',
            font: 'Courier New',
            style: {
              paragraph: {
                indent: {
                  left: ds.spacing.bulletIndentDxa + 360,
                  hanging: ds.spacing.bulletHangingDxa,
                },
                spacing: {
                  after: ds.spacing.bulletAfterDxa,
                },
              },
            },
            run: {
              color: ds.accent.docxHex,
              size: Math.max(ds.type.bodyHp - 2, 16),
            },
          },
        ],
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────────────────────

function buildHeader(metadata: DocumentMetadata, ds: DesignSystem, logo: LogoImageData | null): Header {
  const children: (ImageRun | TextRun)[] = [];

  // Logo if available
  if (logo) {
    children.push(
      new ImageRun({
        data: logo.bytes,
        transformation: { width: 90, height: 36 },
        type: logo.format,
      })
    );
    children.push(new TextRun({ text: '  ', size: ds.type.smallHp }));
  }

  // Business name
  children.push(
    new TextRun({
      text: metadata.businessName,
      bold: true,
      size: ds.type.smallHp,
      color: ds.primary.docxHex,
      font: ds.font,
    })
  );

  // Separator
  children.push(
    new TextRun({
      text: '  |  ',
      size: ds.type.smallHp,
      color: ds.mutedTextColour.docxHex,
      font: ds.font,
    })
  );

  // Document title
  children.push(
    new TextRun({
      text: metadata.title,
      italics: true,
      size: ds.type.smallHp,
      color: ds.mutedTextColour.docxHex,
      font: ds.font,
    })
  );

  // Tab
  children.push(new TextRun({ text: '\t' }));

  // Page number
  children.push(
    new TextRun({
      children: [PageNumber.CURRENT],
      size: ds.type.smallHp,
      color: ds.mutedTextColour.docxHex,
      font: ds.font,
    })
  );

  return new Header({
    children: [
      new Paragraph({
        children,
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: ds.spacing.contentWidthDxa,
          },
        ],
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 3,
            color: ds.accent.docxHex,
            space: 1,
          },
        },
      }),
    ],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function buildFooter(ds: DesignSystem): Footer {
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated by Foundationary  |  Confidential  |  ${dateStr}`,
            italics: true,
            size: ds.type.smallHp,
            color: ds.mutedTextColour.docxHex,
            font: ds.font,
          }),
          new TextRun({ text: '\t' }),
          new TextRun({
            text: 'Page ',
            size: ds.type.smallHp,
            color: ds.mutedTextColour.docxHex,
            font: ds.font,
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: ds.type.smallHp,
            color: ds.mutedTextColour.docxHex,
            font: ds.font,
          }),
        ],
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: ds.spacing.contentWidthDxa,
          },
        ],
        border: {
          top: {
            style: BorderStyle.SINGLE,
            size: 3,
            color: ds.accent.docxHex,
            space: 1,
          },
        },
      }),
    ],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// COVER PAGE
// ─────────────────────────────────────────────────────────────────────────────

function buildCoverPage(
  metadata: DocumentMetadata,
  ds: DesignSystem,
  logo: LogoImageData | null,
  displayName: string
): Paragraph[] {
  const paras: Paragraph[] = [];
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // 1. Top accent bar (if enabled)
  if (ds.useTopAccentBar) {
    paras.push(
      new Paragraph({
        border: {
          top: {
            style: BorderStyle.SINGLE,
            size: 24,
            color: ds.primary.docxHex,
          },
        },
        spacing: { after: 240 },
      })
    );
  }

  // 2. Logo or spacer
  if (logo) {
    paras.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: logo.bytes,
            transformation: { width: 144, height: 57 },
            type: logo.format,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 480 },
      })
    );
  } else {
    paras.push(new Paragraph({ spacing: { before: 960 } }));
  }

  // 3. Title
  paras.push(
    new Paragraph({
      children: [
        new TextRun({
          text: metadata.title,
          bold: true,
          size: ds.type.displayHp,
          color: ds.primary.docxHex,
          font: ds.font,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  );

  // 4. Subtitle (if present)
  if (metadata.subtitle) {
    paras.push(
      new Paragraph({
        children: [
          new TextRun({
            text: metadata.subtitle,
            italics: true,
            size: ds.type.h2Hp,
            color: ds.secondary.docxHex,
            font: ds.font,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      })
    );
  }

  // 5. Prepared for
  paras.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Prepared for ${displayName}`,
          italics: true,
          size: ds.type.bodyHp,
          color: ds.mutedTextColour.docxHex,
          font: ds.font,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  );

  // 6. Business name
  paras.push(
    new Paragraph({
      children: [
        new TextRun({
          text: metadata.businessName,
          size: ds.type.smallHp,
          color: ds.mutedTextColour.docxHex,
          font: ds.font,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    })
  );

  // 7. Date
  paras.push(
    new Paragraph({
      children: [
        new TextRun({
          text: dateStr,
          size: ds.type.smallHp,
          color: ds.mutedTextColour.docxHex,
          font: ds.font,
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  );

  // 8. Heavy rule
  paras.push(
    new Paragraph({
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 16,
          color: ds.primary.docxHex,
        },
      },
      spacing: { before: 480 },
    })
  );

  // 9. Thin accent rule
  paras.push(
    new Paragraph({
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 4,
          color: ds.accent.docxHex,
        },
      },
      spacing: { before: 80, after: 480 },
    })
  );

  // 10. Page break
  paras.push(
    new Paragraph({
      children: [new TextRun({ break: 1 })],
    })
  );

  return paras;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADING RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderSectionHeading(
  text: string,
  variant: HeadingVariant,
  ds: DesignSystem
): Paragraph[] {
  const isSection = variant === 'section';
  const headingLevel = isSection
    ? HeadingLevel.HEADING_1
    : variant === 'subsection'
    ? HeadingLevel.HEADING_2
    : HeadingLevel.HEADING_3;

  const colour = isSection ? ds.primary.docxHex : ds.secondary.docxHex;
  const spacingBefore = isSection ? ds.spacing.sectionBeforeDxa : ds.spacing.headingBeforeDxa;
  const spacingAfter = isSection ? ds.spacing.sectionAfterDxa : ds.spacing.headingAfterDxa;
  const size = isSection ? ds.type.h1Hp : variant === 'subsection' ? ds.type.h2Hp : ds.type.h3Hp;

  switch (ds.headingTreatment) {
    case 'capsule':
      return [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              size,
              color: 'FFFFFF',
              font: ds.font,
            }),
          ],
          heading: headingLevel,
          shading: { type: ShadingType.CLEAR, fill: ds.primary.docxHex },
          indent: { left: 120, right: 120 },
          spacing: { before: spacingBefore, after: spacingAfter },
        }),
      ];

    case 'left-rule':
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: '  ' + text,
              bold: true,
              size,
              color: colour,
              font: ds.font,
            }),
          ],
          heading: headingLevel,
          border: {
            left: {
              style: BorderStyle.SINGLE,
              size: isSection ? 24 : 12,
              color: ds.accent.docxHex,
              space: 4,
            },
          },
          spacing: { before: spacingBefore, after: spacingAfter },
        }),
      ];

    case 'full-rule':
      return [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              size,
              color: colour,
              font: ds.font,
            }),
          ],
          heading: headingLevel,
          border: {
            bottom: {
              style: BorderStyle.SINGLE,
              size: isSection ? 6 : 3,
              color: ds.accent.docxHex,
              space: 1,
            },
          },
          spacing: { before: spacingBefore, after: spacingAfter },
        }),
      ];

    case 'underline-accent':
      return [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              size,
              color: colour,
              font: ds.font,
            }),
          ],
          heading: headingLevel,
          spacing: { before: spacingBefore, after: 40 },
        }),
        new Paragraph({
          border: {
            bottom: {
              style: BorderStyle.SINGLE,
              size: 4,
              color: ds.accent.docxHex,
            },
          },
          spacing: { after: spacingAfter },
        }),
      ];

    case 'plain':
    default:
      return [
        new Paragraph({
          children: [
            new TextRun({
              text,
              bold: true,
              size,
              color: colour,
              font: ds.font,
            }),
          ],
          heading: headingLevel,
          spacing: { before: spacingBefore, after: spacingAfter },
        }),
      ];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK RENDERERS
// ─────────────────────────────────────────────────────────────────────────────

function renderParagraphBlock(
  block: Extract<DocumentBlock, { type: 'paragraph' }>,
  ds: DesignSystem,
  density: BlockDensity
): Paragraph {
  const afterMap: Record<BlockDensity, number> = { compact: 60, normal: 120, airy: 200 };
  const lineMap: Record<BlockDensity, number> = { compact: 240, normal: 276, airy: 360 };

  return new Paragraph({
    children: [
      new TextRun({
        text: block.text,
        size: ds.type.bodyHp,
        color: ds.bodyTextColour.docxHex,
        font: ds.font,
      }),
    ],
    spacing: { after: afterMap[density], line: lineMap[density], lineRule: 'auto' },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function renderClauseBlock(
  block: Extract<DocumentBlock, { type: 'clause' }>,
  ds: DesignSystem,
  density: BlockDensity
): Paragraph {
  const afterMap: Record<BlockDensity, number> = { compact: 40, normal: 80, airy: 120 };

  return new Paragraph({
    children: [
      new TextRun({
        text: block.number + '.',
        bold: true,
        size: ds.type.clauseNumberHp,
        color: ds.primary.docxHex,
        font: ds.font,
      }),
      new TextRun({
        text: '  ' + block.text,
        size: ds.type.bodyHp,
        color: ds.bodyTextColour.docxHex,
        font: ds.font,
      }),
    ],
    indent: { left: ds.spacing.clauseIndentDxa, hanging: ds.spacing.clauseIndentDxa },
    spacing: { after: afterMap[density], line: 276, lineRule: 'auto' },
    alignment: AlignmentType.JUSTIFIED,
  });
}

function renderBulletBlock(
  block: Extract<DocumentBlock, { type: 'bullet' }>,
  ds: DesignSystem
): Paragraph {
  const ref = (block.level ?? 0) === 0 ? 'bullet-l0' : 'bullet-l1';

  return new Paragraph({
    children: [
      new TextRun({
        text: block.text,
        size: ds.type.bodyHp,
        color: ds.bodyTextColour.docxHex,
        font: ds.font,
      }),
    ],
    numbering: { reference: ref, level: 0 },
    spacing: { after: ds.spacing.bulletAfterDxa },
  });
}

function renderTableBlock(
  block: Extract<DocumentBlock, { type: 'table' }>,
  ds: DesignSystem
): (Paragraph | Table)[] {
  if (!block.headers || block.headers.length === 0 || !block.rows || block.rows.length === 0) {
    return [];
  }

  const colCount = block.headers.length;
  const colWidthBase = Math.floor(ds.spacing.contentWidthDxa / colCount);
  const columnWidths = Array(colCount).fill(colWidthBase);
  columnWidths[colCount - 1] = ds.spacing.contentWidthDxa - colWidthBase * (colCount - 1);

  const isFinancial = block.styleHint === 'financial';

  const isMinimalist = ds.headingTreatment === 'plain' || ds.headingTreatment === 'underline-accent';
  const isOpenLayout = ds.headingTreatment === 'left-rule' || ds.headingTreatment === 'plain';

  const outerBorderSize = isMinimalist ? 2 : 6;
  const outerBorderColour = isMinimalist ? ds.mutedTextColour.docxHex : ds.primary.docxHex;

  const innerHBorderSize = isOpenLayout ? 1 : 2;
  const innerHBorderColour = isOpenLayout ? 'E0E0E0' : 'CCCCCC';
  const innerVBorderSize = 1;
  const innerVBorderColour = isOpenLayout ? 'NONE' : 'DDDDDD';

  const headerRow = new TableRow({
    children: block.headers.map((h, i) => {
      const cell = new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: h,
                bold: true,
                size: ds.type.smallHp + 2,
                color: 'FFFFFF',
                font: ds.font,
              }),
            ],
            alignment: isFinancial && i > 0 ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
        ],
        shading: { type: ShadingType.CLEAR, fill: ds.primary.docxHex },
        verticalAlign: VerticalAlign.CENTER,
        width: { size: columnWidths[i], type: WidthType.DXA },
        margins: {
          top: ds.spacing.tableCellTopDxa,
          bottom: ds.spacing.tableCellBottomDxa,
          left: ds.spacing.tableCellLeftDxa,
          right: ds.spacing.tableCellRightDxa,
        },
      });
      return cell;
    }),
    tableHeader: true,
  });

  const dataRows = block.rows.map((row, rowIdx) => {
    const isEvenRow = rowIdx % 2 === 0;
    const isLastRow = rowIdx === block.rows.length - 1;
    const isTotal = isLastRow && isFinancial;

    let rowFill: string;
    if (isTotal) {
      rowFill = ds.surface.docxHex;
    } else if (isEvenRow) {
      rowFill = isMinimalist || isOpenLayout ? 'FFFFFF' : ds.surface.docxHex;
    } else {
      rowFill = 'FFFFFF';
    }

    return new TableRow({
      children: row.map((cell, i) => {
        const textStyle = isTotal
          ? { bold: true, size: ds.type.bodyHp, color: ds.primary.docxHex }
          : {
              size: ds.type.bodyHp,
              color: ds.bodyTextColour.docxHex,
              font: isFinancial ? 'Courier New' : ds.font,
            };

        const cellFill = isTotal ? ds.surface.docxHex : rowFill;

        return new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: cell, font: ds.font, ...textStyle })],
              alignment: isFinancial && i > 0 ? AlignmentType.RIGHT : AlignmentType.LEFT,
            }),
          ],
          shading: { type: ShadingType.CLEAR, fill: cellFill },
          verticalAlign: VerticalAlign.CENTER,
          width: { size: columnWidths[i], type: WidthType.DXA },
          margins: {
            top: ds.spacing.tableCellTopDxa,
            bottom: ds.spacing.tableCellBottomDxa,
            left: ds.spacing.tableCellLeftDxa,
            right: ds.spacing.tableCellRightDxa,
          },
        });
      }),
    });
  });

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: ds.spacing.contentWidthDxa, type: WidthType.DXA },
    columnWidths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: outerBorderSize, color: outerBorderColour },
      bottom: { style: BorderStyle.SINGLE, size: outerBorderSize, color: outerBorderColour },
      left: { style: BorderStyle.SINGLE, size: outerBorderSize, color: outerBorderColour },
      right: { style: BorderStyle.SINGLE, size: outerBorderSize, color: outerBorderColour },
      insideHorizontal: {
        style: innerVBorderColour === 'NONE' ? BorderStyle.NONE : BorderStyle.SINGLE,
        size: innerHBorderSize,
        color: innerHBorderColour,
      },
      insideVertical: {
        style: innerVBorderColour === 'NONE' ? BorderStyle.NONE : BorderStyle.SINGLE,
        size: innerVBorderSize,
        color: innerVBorderColour,
      },
    },
  });

  const afterContent: Paragraph[] = [];

  if (block.caption) {
    afterContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: block.caption,
            italics: true,
            size: ds.type.smallHp,
            color: ds.mutedTextColour.docxHex,
            font: ds.font,
          }),
        ],
        spacing: { before: 60, after: 120 },
      })
    );
  } else {
    afterContent.push(new Paragraph({ spacing: { after: 120 } }));
  }

  return [table, ...afterContent];
}

function renderCalloutBlock(
  block: Extract<DocumentBlock, { type: 'callout' }>,
  ds: DesignSystem
): Paragraph[] {
  const leftBorder = {
    left: {
      style: BorderStyle.SINGLE,
      size: 16,
      color: ds.accent.docxHex,
      space: 4,
    },
  };
  const shading = { type: ShadingType.CLEAR, fill: ds.surface.docxHex };

  const paras: Paragraph[] = [];

  if (block.label) {
    paras.push(
      new Paragraph({
        children: [
          new TextRun({
            text: block.label.toUpperCase(),
            bold: true,
            size: ds.type.smallHp + 2,
            color: ds.primary.docxHex,
            font: ds.font,
          }),
        ],
        border: leftBorder,
        shading,
        indent: { left: 200 },
        spacing: { before: 120, after: 40 },
      })
    );
  }

  paras.push(
    new Paragraph({
      children: [
        new TextRun({
          text: block.text,
          italics: true,
          size: ds.type.bodyHp,
          color: ds.bodyTextColour.docxHex,
          font: ds.font,
        }),
      ],
      border: leftBorder,
      shading,
      indent: { left: 200 },
      spacing: { before: block.label ? 0 : 120, after: 120 },
    })
  );

  return paras;
}

function renderSignatureBlock(
  block: Extract<DocumentBlock, { type: 'signature' }>,
  ds: DesignSystem
): Paragraph[] {
  const paras: Paragraph[] = [];

  // Divider
  paras.push(
    new Paragraph({
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 3,
          color: ds.mutedTextColour.docxHex,
        },
      },
      spacing: { before: 160, after: 200 },
    })
  );

  for (const party of block.parties) {
    // Label
    paras.push(
      new Paragraph({
        children: [
          new TextRun({
            text: party.label,
            bold: true,
            size: ds.type.bodyHp,
            color: ds.primary.docxHex,
            font: ds.font,
          }),
        ],
        spacing: { before: 240, after: 80 },
      })
    );

    // Signed line
    paras.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Signed: ',
            size: ds.type.smallHp,
            color: ds.mutedTextColour.docxHex,
            font: ds.font,
          }),
          new TextRun({
            text: '_____________________________',
            size: ds.type.smallHp,
            color: ds.mutedTextColour.docxHex,
            font: ds.font,
          }),
        ],
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 2,
            color: ds.mutedTextColour.docxHex,
            space: 1,
          },
        },
        indent: { right: 5760 },
        spacing: { after: 80 },
      })
    );

    // Date line
    paras.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Date: ',
            size: ds.type.smallHp,
            color: ds.mutedTextColour.docxHex,
            font: ds.font,
          }),
          new TextRun({
            text: '_________________________',
            size: ds.type.smallHp,
            color: ds.mutedTextColour.docxHex,
            font: ds.font,
          }),
        ],
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 2,
            color: ds.mutedTextColour.docxHex,
            space: 1,
          },
        },
        indent: { right: 7200 },
        spacing: { after: 60 },
      })
    );

    // Name
    paras.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Name: ',
            size: ds.type.smallHp,
            color: ds.mutedTextColour.docxHex,
            font: ds.font,
          }),
          new TextRun({
            text: party.nameField,
            size: ds.type.bodyHp,
            color: ds.bodyTextColour.docxHex,
            font: ds.font,
          }),
        ],
        spacing: { after: 40 },
      })
    );

    // Company (if present)
    if (party.companyField) {
      paras.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Company: ',
              size: ds.type.smallHp,
              color: ds.mutedTextColour.docxHex,
              font: ds.font,
            }),
            new TextRun({
              text: party.companyField,
              size: ds.type.bodyHp,
              color: ds.bodyTextColour.docxHex,
              font: ds.font,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    } else {
      // Set spacing on the last paragraph if no company
      if (paras.length > 0) {
        const lastPara = paras[paras.length - 1];
        // Clone with updated spacing
        paras[paras.length - 1] = new Paragraph({
          ...lastPara,
          spacing: { ...(lastPara as any).spacing, after: 200 },
        });
      }
    }
  }

  return paras;
}

function renderDividerBlock(
  block: Extract<DocumentBlock, { type: 'divider' }>,
  ds: DesignSystem
): Paragraph[] {
  const size = block.weight === 'heavy' ? 8 : 3;
  const colour = block.weight === 'heavy' ? ds.primary.docxHex : ds.mutedTextColour.docxHex;

  return [
    new Paragraph({
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size,
          color: colour,
        },
      },
      spacing: { before: 160, after: 200 },
    }),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK DISPATCHER
// ─────────────────────────────────────────────────────────────────────────────

function renderBlock(
  block: DocumentBlock,
  ds: DesignSystem,
  sectionDensity?: BlockDensity
): (Paragraph | Table)[] {
  const density = block.density ?? sectionDensity ?? 'normal';

  switch (block.type) {
    case 'heading':
      return renderSectionHeading(block.text, block.variant, ds);

    case 'paragraph':
      return [renderParagraphBlock(block, ds, density)];

    case 'clause':
      return [renderClauseBlock(block, ds, density)];

    case 'bullet':
      return [renderBulletBlock(block, ds)];

    case 'table':
      return renderTableBlock(block, ds);

    case 'callout':
      return renderCalloutBlock(block, ds);

    case 'signature':
      return renderSignatureBlock(block, ds);

    case 'divider':
      return renderDividerBlock(block, ds);

    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderSection(section: DocumentSection, ds: DesignSystem): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  // Section heading (if present)
  if (section.heading) {
    const headingVariant = section.headingVariant ?? 'section';
    elements.push(...renderSectionHeading(section.heading, headingVariant, ds));
  }

  // Blocks
  for (const block of section.blocks) {
    elements.push(...renderBlock(block, ds, section.density));
  }

  return elements;
}

export async function generateDocxFromJson(
  jsonDoc: AnyDocument,
  design: ClientDesign,
  docLabel: string
): Promise<Uint8Array> {
  try {
    const kind = detectDocumentKind(jsonDoc);
    const ds = resolveDesignSystem(design);
    const logo = extractLogoImageData(design.logoBase64);

    // Determine display name
    const displayName =
      design.brandIdentity === 'My personal name is the brand — I want documents to feel personal'
        ? design.firstName || design.businessName
        : design.businessName;

    // Build metadata based on document type
    let metadata: DocumentMetadata;
    let allContent: (Paragraph | Table)[] = [];

    if (kind === 'model') {
      const doc = jsonDoc as DocumentModel;
      metadata = doc.metadata;

      // Build cover page
      const coverParas = buildCoverPage(metadata, ds, logo, displayName);
      allContent.push(...coverParas);

      // Render all sections
      for (const section of doc.sections) {
        allContent.push(...renderSection(section, ds));
      }
    } else {
      // Fallback for other document types without full model
      metadata = {
        title: docLabel,
        documentType: kind,
        businessName: design.businessName,
        date: new Date().toLocaleDateString('en-GB'),
      };

      const coverParas = buildCoverPage(metadata, ds, logo, displayName);
      allContent.push(...coverParas);
    }

    // Assemble the document
    const document = new DocxDocument({
      styles: buildDocumentStyles(ds),
      numbering: buildNumberingConfig(ds),
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 11906,
                height: 16838,
              },
              margin: {
                top: ds.spacing.marginTopDxa,
                bottom: ds.spacing.marginBottomDxa,
                left: ds.spacing.marginLeftDxa,
                right: ds.spacing.marginRightDxa,
                header: 720,
                footer: 720,
              },
            },
          },
          headers: {
            default: buildHeader(metadata, ds, logo),
          },
          footers: {
            default: buildFooter(ds),
          },
          children: allContent,
        },
      ],
    });

    const buffer = await Packer.toBuffer(document);
    return new Uint8Array(buffer);
  } catch (error) {
    // Return minimal error document
    const errorDoc = new DocxDocument({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Error generating document. Please try again.',
                  size: 20,
                }),
              ],
            }),
          ],
        },
      ],
    });
    const buffer = await Packer.toBuffer(errorDoc);
    return new Uint8Array(buffer);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY DOCX GENERATION (Keep unchanged)
// ─────────────────────────────────────────────────────────────────────────────

function convertMarkdownTableToColumns(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inTable = false;
  let headerRow: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
      if (cells.some(cell => /^-+$/.test(cell))) {
        inTable = true;
        continue;
      }
      if (inTable && headerRow.length === 0) {
        headerRow = cells;
        result.push(cells.join(' | '));
        result.push('');
      } else if (inTable && cells.length > 0) {
        result.push(cells.join(' | '));
      }
    } else {
      if (inTable && headerRow.length > 0) {
        inTable = false;
        headerRow = [];
        result.push('');
      }
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
  const rows: string[][] = [];
  let i = startIndex;
  let headers: string[] = [];
  let isFirstRow = true;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!isTableRow(line)) break;
    const cells = line.split('|').slice(1, -1).map(cell => cell.trim()).filter(cell => !/^[-]+$/.test(cell));
    if (cells.length === 0) {
      i++;
      continue;
    }
    if (isFirstRow) {
      headers = cells;
      isFirstRow = false;
    } else {
      rows.push(cells);
    }
    i++;
  }
  if (headers.length > 0 && rows.length > 0) {
    return { table: { type: 'table', headers, rows, level: 0 }, endIndex: i };
  }
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
        if (clauseMatch) {
          blocks.push({ type: 'clause', text: cleaned, level: 0 });
        } else {
          blocks.push({ type: 'paragraph', text: cleaned, level: 0 });
        }
      }
    }
    currentParagraph = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      i++;
      continue;
    }
    if (isTableRow(trimmed)) {
      flushParagraph();
      const tableResult = parseTableBlock(lines, i);
      if (tableResult) {
        blocks.push(tableResult.table);
        i = tableResult.endIndex;
        continue;
      }
    }
    if (/^===\s*.+\s*===$/.test(trimmed)) {
      flushParagraph();
      const headingText = stripMarkdown(trimmed.replace(/^===\s*/, '').replace(/\s*===$/, '').trim());
      blocks.push({ type: 'heading', text: headingText, level: 1 });
      i++;
      continue;
    }
    const mdHeadingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (mdHeadingMatch) {
      flushParagraph();
      const level = Math.min(mdHeadingMatch[1].length, 3);
      const headingText = stripMarkdown(mdHeadingMatch[2].trim());
      if (level === 1) {
        blocks.push({ type: 'heading', text: headingText, level: 1 });
      } else if (level === 2) {
        blocks.push({ type: 'heading', text: headingText, level: 2 });
      } else {
        blocks.push({ type: 'subheading', text: headingText, level: 3 });
      }
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(trimmed) || /^\u2022\s+/.test(trimmed)) {
      flushParagraph();
      const bulletText = stripMarkdown(trimmed.replace(/^[-*\u2022]\s+/, ''));
      blocks.push({ type: 'bullet', text: bulletText, level: 0 });
      i++;
      continue;
    }
    if (/^\d+(?:\.\d+)*\.\s+/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'clause', text: stripMarkdown(trimmed), level: 0 });
      i++;
      continue;
    }
    currentParagraph.push(trimmed);
    i++;
  }
  flushParagraph();
  return blocks;
}

export async function generateDocx(
  text: string,
  documentLabel: string,
  businessName: string,
  design: ClientDesign
): Promise<Uint8Array> {
  const colours = parseBrandColours(design.brandColours);
  const primaryHex = colours.primary.replace('#', '');
  const accentHex = colours.accent.replace('#', '');
  const secondaryHex = colours.secondary.replace('#', '');
  const blocks = parseTextToBlocks(text);
  const children: Paragraph[] = [];

  // Document title
  children.push(
    new Paragraph({
      children: [new TextRun({ text: documentLabel, bold: true, size: 44, font: 'Calibri', color: primaryHex })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    })
  );
  const displayName =
    design.brandIdentity === 'My personal name is the brand — I want documents to feel personal'
      ? design.firstName || businessName
      : businessName;
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Prepared for ${displayName}`,
          italics: true,
          size: 20,
          font: 'Calibri',
          color: '999999',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    })
  );
  children.push(
    new Paragraph({
      children: [new TextRun({ text: design.businessName, size: 18, font: 'Calibri', color: 'AAAAAA' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })
  );
  // Separator
  children.push(
    new Paragraph({
      children: [],
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: primaryHex } },
    })
  );

  for (const block of blocks) {
    if (block.type === 'heading') {
      if (block.level === 1) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: block.text, bold: true, size: 28, font: 'Calibri', color: primaryHex })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 360, after: 120 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accentHex } },
            shading: { type: ShadingType.CLEAR, fill: primaryHex + '10' },
            indent: { left: 120 },
          })
        );
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: block.text, bold: true, size: 24, font: 'Calibri', color: secondaryHex }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 100 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentHex + '44' } },
          })
        );
      }
    } else if (block.type === 'subheading') {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: block.text,
              bold: true,
              italics: true,
              size: 22,
              font: 'Calibri',
              color: secondaryHex,
            }),
          ],
          spacing: { before: 200, after: 80 },
        })
      );
    } else if (block.type === 'clause') {
      const clauseMatch = block.text.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
      if (clauseMatch) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: clauseMatch[1] + '.',
                bold: true,
                size: 20,
                font: 'Calibri',
                color: primaryHex,
              }),
              new TextRun({ text: ' ' + clauseMatch[2], size: 20, font: 'Calibri', color: '262626' }),
            ],
            indent: { left: 480, hanging: 480 },
            spacing: { after: 60 },
          })
        );
      } else {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' })],
            indent: { left: 240 },
            spacing: { after: 60 },
          })
        );
      }
    } else if (block.type === 'bullet') {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' }),
          ],
          numbering: { reference: 'legacy-bullets', level: 0 },
          spacing: { after: 40 },
        })
      );
    } else if (block.type === 'table') {
      const tbl = block as TableBlock;
      const contentWidthDxaLegacy = 11906 - 1134 - 1134; // 9638
      const numCols = tbl.headers.length;
      const colW = Math.floor(contentWidthDxaLegacy / numCols);
      const columnWidthsLegacy = Array(numCols).fill(colW);
      const headerRow = new TableRow({
        children: tbl.headers.map(h =>
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: h, bold: true, size: 20, font: 'Calibri', color: 'FFFFFF' })],
              }),
            ],
            shading: { type: ShadingType.CLEAR, fill: primaryHex },
            verticalAlign: VerticalAlign.CENTER,
            width: { size: colW, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 160, right: 160 },
          })
        ),
      });
      const dataRows = tbl.rows.map(
        (row, idx) =>
          new TableRow({
            children: row.map(cell =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: cell, size: 20, font: 'Calibri', color: '262626' })],
                  }),
                ],
                shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? 'FFFFFF' : primaryHex + '08' },
                width: { size: colW, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 160, right: 160 },
              })
            ),
          })
      );
      children.push(
        new Table({
          rows: [headerRow, ...dataRows],
          width: { size: contentWidthDxaLegacy, type: WidthType.DXA },
          columnWidths: columnWidthsLegacy,
        })
      );
      children.push(new Paragraph({ spacing: { after: 100 } }));
    } else {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: block.text, size: 20, font: 'Calibri', color: '262626' })],
          spacing: { after: 100 },
        })
      );
    }
  }

  // Footer separator
  children.push(
    new Paragraph({
      children: [],
      spacing: { before: 400 },
      border: { top: { style: BorderStyle.SINGLE, size: 12, color: primaryHex } },
    })
  );
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: design.businessName, italics: true, size: 18, font: 'Calibri', color: '999999' }),
        new TextRun({ text: '  |  ', size: 18, font: 'Calibri', color: 'CCCCCC' }),
        new TextRun({
          text: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          italics: true,
          size: 18,
          font: 'Calibri',
          color: '999999',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 80 },
    })
  );

  const doc = new DocxDocument({
    numbering: {
      config: [
        {
          reference: 'legacy-bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '\u2022',
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children,
      },
    ],
  });
  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}
