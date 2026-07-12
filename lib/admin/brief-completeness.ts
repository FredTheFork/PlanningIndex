export interface SectionScore {
  score: number;
  missingFields: string[];
}

export interface CompletenessReport {
  overallScore: number;
  sectionScores: Record<string, SectionScore>;
  criticalMissing: string[];
  warningMissing: string[];
  totalSections: number;
  sectionsFound: number;
}

const BRIEF_SECTION_HEADERS = [
  'BUSINESS IDENTITY',
  'SERVICES & OFFERINGS',
  'CLIENT PROFILE & RISK HISTORY',
  'PRICING & COMMERCIAL TERMS',
  'GDPR & DATA PROCESSING',
  'LEGAL & COMPLIANCE STATUS',
  'BRAND & VOICE',
  'INVOICE & FINANCIAL ADMIN',
  'LINKEDIN & SOCIAL PRESENCE',
  'RISK FLAGS & ALERTS',
  'AI ENRICHMENTS & RECOMMENDATIONS',
];

const OPTIONAL_SECTION_HEADERS = [
  'OPERATIONS PACK SPECIFICS',
  'COPYRIGHT & IP SPECIFICS',
  'GDPR DEEP PACK SPECIFICS',
  'INDUSTRY-SPECIFIC DETAILS',
  'WEBSITE COPY SPECIFICS',
  'SOCIAL MEDIA SPECIFICS',
];

const REQUIRED_FIELDS: Record<string, string[]> = {
  'BUSINESS IDENTITY': ['Legal Name:', 'Business Name:', 'Jurisdiction:', 'Document Email:'],
  'SERVICES & OFFERINGS': ['Services:', 'Offerings:'],
  'CLIENT PROFILE & RISK HISTORY': ['Client Profile:'],
  'PRICING & COMMERCIAL TERMS': ['Payment Terms:', 'VAT Registered:'],
  'GDPR & DATA PROCESSING': ['Data Collected:', 'Data Purpose:'],
  'LEGAL & COMPLIANCE STATUS': ['Legal Status:'],
  'BRAND & VOICE': ['Brand:'],
  'INVOICE & FINANCIAL ADMIN': ['Invoice:'],
  'LINKEDIN & SOCIAL PRESENCE': ['LinkedIn:'],
  'RISK FLAGS & ALERTS': ['Risk:'],
  'AI ENRICHMENTS & RECOMMENDATIONS': ['Recommendation:'],
};

const CRITICAL_SECTIONS = new Set([
  'BUSINESS IDENTITY',
  'PRICING & COMMERCIAL TERMS',
  'GDPR & DATA PROCESSING',
]);

/**
 * Parse a brief's content into a map of section name → content text.
 * Sections are delimited by `=== SECTION NAME ===` markers.
 */
export function parseBriefSections(briefContent: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = briefContent.split('\n');
  let currentHeader: string | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    const match = line.match(/^===\s*(.+?)\s*===\s*$/);
    if (match) {
      if (currentHeader) {
        sections[currentHeader] = currentContent.join('\n').trim();
      }
      currentHeader = match[1].trim();
      currentContent = [];
    } else if (currentHeader) {
      currentContent.push(line);
    }
  }

  if (currentHeader) {
    sections[currentHeader] = currentContent.join('\n').trim();
  }

  return sections;
}

function scoreSection(sectionContent: string, requiredFields: string[]): SectionScore {
  if (!sectionContent || sectionContent.length === 0) {
    return { score: 0, missingFields: [...requiredFields] };
  }

  const missing: string[] = [];
  for (const field of requiredFields) {
    if (!sectionContent.includes(field)) {
      missing.push(field);
    }
  }

  const foundCount = requiredFields.length - missing.length;
  const score = Math.round((foundCount / requiredFields.length) * 100);

  return { score, missingFields: missing };
}

/**
 * Calculate a completeness report for a brief, scoring each expected section
 * for presence of required field labels.
 */
export function calculateBriefCompleteness(briefContent: string): CompletenessReport {
  if (!briefContent || briefContent.trim().length === 0) {
    return {
      overallScore: 0,
      sectionScores: {},
      criticalMissing: [],
      warningMissing: [],
      totalSections: BRIEF_SECTION_HEADERS.length,
      sectionsFound: 0,
    };
  }

  const sections = parseBriefSections(briefContent);
  const sectionScores: Record<string, SectionScore> = {};
  const criticalMissing: string[] = [];
  const warningMissing: string[] = [];
  let totalScore = 0;
  let sectionsFound = 0;

  for (const header of BRIEF_SECTION_HEADERS) {
    const content = sections[header] || '';
    const required = REQUIRED_FIELDS[header] || [];
    const result = scoreSection(content, required);
    sectionScores[header] = result;
    totalScore += result.score;

    if (content) sectionsFound++;

    if (result.missingFields.length > 0) {
      if (CRITICAL_SECTIONS.has(header)) {
        criticalMissing.push(...result.missingFields.map((f) => `${header}: ${f}`));
      } else {
        warningMissing.push(...result.missingFields.map((f) => `${header}: ${f}`));
      }
    }
  }

  // Also check optional sections if present
  for (const header of OPTIONAL_SECTION_HEADERS) {
    if (sections[header]) {
      sectionsFound++;
    }
  }

  const overallScore = Math.round(totalScore / BRIEF_SECTION_HEADERS.length);

  return {
    overallScore,
    sectionScores,
    criticalMissing,
    warningMissing,
    totalSections: BRIEF_SECTION_HEADERS.length,
    sectionsFound,
  };
}

export function getCompletenessColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getCompletenessTextColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}
