// Shared planning-application enrichment — pure functions, no I/O.
// Used server-side (API routes mapping Supabase rows to the UI shape) and
// by lib/mock/applications.ts so mock and real data derive trade tags,
// potential work and potential trades from a single source of truth.

import type {
  SearchApplication,
  ApplicationStatus,
  ApplicationType,
  PotentialWorkItem,
} from '@/lib/mock/applications';

// ---------------------------------------------------------------------------
// Input row shape (a Supabase planning_applications record).
// ---------------------------------------------------------------------------

export interface PlanningAppRecord {
  id: string;
  council_reference: string;
  authority_name: string | null;
  address: string | null;
  description: string | null;
  status: string | null;
  decision: string | null;
  date_received: string | null;
  date_validated: string | null;
  info_url: string | null;
  documents_url: string | null;
}

// ---------------------------------------------------------------------------
// Status / type mapping for raw council statuses and decisions.
// ---------------------------------------------------------------------------

export function mapApplicationStatus(status: string | null, decision: string | null): ApplicationStatus {
  const d = (decision ?? '').toLowerCase();
  const s = (status ?? '').toLowerCase();

  if (d.includes('withdrawn') || s.includes('withdrawn')) return 'Withdrawn';
  if (d.includes('refus')) return 'Refused';
  if (d.includes('approv') || d.includes('permission granted') || d.includes('granted')) {
    return 'Approved';
  }
  if (d.includes('appeal dismiss')) return 'Refused';
  if (s.includes('approv') || s.includes('granted')) return 'Approved';
  return 'Pending';
}

export function deriveApplicationType(description: string): ApplicationType {
  const d = description.toLowerCase();
  if (d.includes('householder')) return 'Householder';
  if (d.includes('reserved matters')) return 'Reserved Matters';
  if (d.includes('listed building')) return 'Listed Building';
  if (d.includes('advertisement')) return 'Advertisement';
  if (d.includes('discharge') && d.includes('condition')) return 'Discharge of Conditions';
  if (d.includes('non-material')) return 'Non-Material Amendment';
  if (d.includes('outline')) return 'Outline';
  return 'Full Planning';
}

// ---------------------------------------------------------------------------
// Trade tag / potential work / potential trade derivation.
// ---------------------------------------------------------------------------

const TRADE_TAG_KEYWORDS: { tag: string; patterns: string[] }[] = [
  { tag: 'Windows', patterns: ['window'] },
  { tag: 'Doors', patterns: ['door'] },
  { tag: 'Roofing', patterns: ['roof'] },
  { tag: 'Extensions', patterns: ['extension'] },
  { tag: 'Wraparound', patterns: ['wraparound'] },
  { tag: 'Loft', patterns: ['loft'] },
  { tag: 'Dormers', patterns: ['dormer'] },
  { tag: 'Conversions', patterns: ['conversion'] },
  { tag: 'New Build', patterns: ['new dwelling', 'new dwellings', 'new build'] },
  { tag: 'Brickwork', patterns: ['brick'] },
  { tag: 'Landscaping', patterns: ['landscaping', 'garden'] },
  { tag: 'Garden Room', patterns: ['garden room'] },
  { tag: 'Plumbing', patterns: ['plumbing', 'drainage'] },
  { tag: 'Electrical', patterns: ['electrical', 'rewiring'] },
  { tag: 'Kitchen', patterns: ['kitchen'] },
  { tag: 'Bathroom', patterns: ['bathroom', 'wet room'] },
  { tag: 'Porch', patterns: ['porch'] },
  { tag: 'Driveway', patterns: ['driveway', 'parking'] },
  { tag: 'EV', patterns: ['charging point', 'electric vehicle charging'] },
  { tag: 'Heating', patterns: ['heating'] },
  { tag: 'Rewiring', patterns: ['rewiring'] },
  { tag: 'Conservatory', patterns: ['conservatory'] },
  { tag: 'Glazing', patterns: ['glazing'] },
  { tag: 'Demolition', patterns: ['demolition'] },
  { tag: 'Listed Building', patterns: ['listed building'] },
  { tag: 'Solar', patterns: ['solar'] },
  { tag: 'Renewables', patterns: ['renewable', 'battery storage', 'air source'] },
  { tag: 'Retaining Wall', patterns: ['retaining wall'] },
  { tag: 'Development', patterns: ['development'] },
  { tag: 'Outbuilding', patterns: ['outbuilding', 'garden room'] },
  { tag: 'Masonry', patterns: ['masonry', 'flint'] },
  { tag: 'Building', patterns: ['construction', 'building work'] },
];

export function deriveTradeTags(description: string): string[] {
  const d = description.toLowerCase();
  return TRADE_TAG_KEYWORDS.filter(({ patterns }) => patterns.some((p) => d.includes(p))).map(
    ({ tag }) => tag
  );
}

export function generatePotentialWork(
  tags: string[],
  title: string,
  description: string
): PotentialWorkItem[] {
  const items: PotentialWorkItem[] = [];
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  void lowerTitle;

  if (tags.includes('Windows') || lowerDesc.includes('window')) {
    const match = lowerDesc.match(/(\d+)\s+timber sash windows/);
    const count = match ? parseInt(match[1], 10) : lowerDesc.includes('12') ? 12 : 6;
    items.push({ trade: 'Windows', count });
  }
  if (tags.includes('Doors') || lowerDesc.includes('door')) {
    items.push({
      trade: 'Doors',
      count: lowerDesc.includes('bi-fold') || lowerDesc.includes('french') ? 3 : 2,
    });
  }
  if (tags.includes('Roofing') || lowerDesc.includes('roof')) {
    items.push({
      trade: 'Roofing',
      detail: lowerDesc.includes('slate') ? 'Natural slate roof' : 'Roof replacement',
    });
  }
  if (tags.includes('Extensions') || lowerDesc.includes('extension')) {
    const isWrap = tags.includes('Wraparound');
    items.push({
      trade: 'Extension',
      detail: isWrap
        ? 'Wraparound extension'
        : lowerDesc.includes('two-storey')
          ? 'Two-storey extension'
          : 'Single-storey extension',
    });
  }
  if (tags.includes('Loft') || lowerDesc.includes('loft')) {
    items.push({
      trade: 'Loft',
      detail: lowerDesc.includes('hip to gable') ? 'Hip to gable loft conversion' : 'Loft conversion',
    });
  }
  if (tags.includes('Dormers') || lowerDesc.includes('dormer')) {
    items.push({ trade: 'Dormers', count: lowerDesc.includes('two') ? 2 : 1 });
  }
  if (tags.includes('Conversions') || lowerDesc.includes('conversion')) {
    if (!lowerDesc.includes('loft')) {
      items.push({ trade: 'Conversion', detail: 'Garage to habitable room' });
    }
  }
  if (tags.includes('New Build') || lowerDesc.includes('new dwelling') || lowerDesc.includes('new dwellings')) {
    const match = lowerDesc.match(/(\d+)\s+dwellings?/);
    items.push({ trade: 'New Build', count: match ? parseInt(match[1], 10) : 1 });
  }
  if (tags.includes('Brickwork') || lowerDesc.includes('brick')) {
    items.push({ trade: 'Brickwork', detail: 'Boundary wall and piers' });
  }
  if (tags.includes('Landscaping') || lowerDesc.includes('landscaping') || lowerDesc.includes('garden')) {
    items.push({
      trade: 'Landscaping',
      detail: lowerDesc.includes('patio') ? 'Patio and garden works' : 'Garden landscaping',
    });
  }
  if (tags.includes('Plumbing') || lowerDesc.includes('plumbing') || lowerDesc.includes('drainage')) {
    items.push({
      trade: 'Plumbing',
      detail: lowerDesc.includes('underfloor') ? 'Underfloor heating and pipework' : 'Drainage and water connections',
    });
  }
  if (tags.includes('Electrical') || lowerDesc.includes('electrical') || lowerDesc.includes('rewiring')) {
    items.push({
      trade: 'Electrical',
      detail: lowerDesc.includes('rewiring') ? 'Full house rewiring' : 'Electrical installation',
    });
  }
  if (tags.includes('Demolition') || lowerDesc.includes('demolition')) {
    items.push({ trade: 'Demolition', detail: 'Garage demolition' });
  }
  if (tags.includes('Porch') || lowerDesc.includes('porch')) {
    items.push({ trade: 'Porch', detail: 'Front porch with pitched roof' });
  }
  if (tags.includes('Driveway') || lowerDesc.includes('driveway')) {
    items.push({ trade: 'Driveway', detail: 'Block paving driveway' });
  }
  if (tags.includes('EV') || lowerDesc.includes('charging point')) {
    items.push({ trade: 'EV', detail: 'EV charging point' });
  }
  if (tags.includes('Heating') || lowerDesc.includes('heating')) {
    items.push({ trade: 'Heating', detail: 'Central heating and underfloor heating' });
  }
  if (tags.includes('Conservatory') || lowerDesc.includes('conservatory')) {
    items.push({ trade: 'Conservatory', detail: 'Glass roof conservatory' });
  }
  if (tags.includes('Glazing') || lowerDesc.includes('glazing')) {
    items.push({ trade: 'Glazing', detail: 'Aluminium framed glazing' });
  }
  if (tags.includes('Listed Building')) {
    items.push({ trade: 'Listed Building', detail: 'Heritage window replacement' });
  }
  if (tags.includes('Solar') || lowerDesc.includes('solar')) {
    items.push({ trade: 'Solar', count: lowerDesc.includes('12') ? 12 : 8 });
  }
  if (tags.includes('Retaining Wall') || lowerDesc.includes('retaining wall')) {
    items.push({ trade: 'Retaining Wall', detail: 'Timber sleeper retaining wall' });
  }
  if (tags.includes('Development')) {
    items.push({ trade: 'Development', detail: 'Residential development' });
  }

  return items.length > 0 ? items : [{ trade: 'General Building', detail: 'General construction works' }];
}

export function generatePotentialTrade(tags: string[]): string {
  if (tags.includes('Windows') && tags.includes('Doors')) return 'Window / Door Contractor';
  if (tags.includes('Windows')) return 'Window Contractor';
  if (tags.includes('Loft') || tags.includes('Dormers')) return 'Loft Conversion Specialist';
  if (tags.includes('Extensions') || tags.includes('Wraparound')) return 'Extension Builder';
  if (tags.includes('Roofing')) return 'Roofing Contractor';
  if (tags.includes('New Build') || tags.includes('Development')) return 'House Builder';
  if (tags.includes('Electrical') || tags.includes('Rewiring')) return 'Electrical Contractor';
  if (tags.includes('Plumbing') || tags.includes('Heating')) return 'Plumber / Heating Engineer';
  if (tags.includes('Kitchen')) return 'Kitchen Fitter';
  if (tags.includes('Bathroom')) return 'Bathroom Fitter';
  if (tags.includes('Landscaping') || tags.includes('Driveway')) return 'Landscaping Contractor';
  if (tags.includes('Brickwork') || tags.includes('Masonry')) return 'Bricklayer / Mason';
  if (tags.includes('Conservatory') || tags.includes('Glazing')) return 'Conservatory / Glazing Specialist';
  if (tags.includes('Solar') || tags.includes('Renewables')) return 'Renewables Installer';
  if (tags.includes('Demolition')) return 'Demolition Contractor';
  if (tags.includes('Building')) return 'General Builder';
  return 'General Contractor';
}

// ---------------------------------------------------------------------------
// Row → SearchApplication mapping (single place real data becomes UI-shaped).
// ---------------------------------------------------------------------------

const POSTCODE_RE =
  /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}|[A-Z]{1,2}\d[A-Z\d]?|[A-Z]{1,2}\d{2})\b/i;

export function extractPostcode(address: string): string {
  const matches = address.match(POSTCODE_RE);
  return matches ? matches[1].toUpperCase() : '';
}

export function summarizeTitle(description: string): string {
  const firstSentence = description.split(/[.!?\n]/)[0].trim();
  const source = firstSentence || description;
  if (source.length <= 90) return source.charAt(0).toUpperCase() + source.slice(1);
  const words = source.split(/\s+/);
  const truncated = words.slice(0, 12).join(' ').replace(/[,;:]$/, '');
  return truncated.charAt(0).toUpperCase() + truncated.slice(1);
}

function formatDisplayDate(iso: string | null): string {
  if (!iso) return 'Unknown date';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function toSearchApplication(record: PlanningAppRecord): SearchApplication {
  const description = record.description ?? '';
  const title = summarizeTitle(description);
  const tradeTags = deriveTradeTags(description);
  const address = record.address ?? '';

  return {
    id: record.id,
    reference: record.council_reference,
    title,
    description,
    address,
    postcode: extractPostcode(address),
    council: record.authority_name ?? '',
    ward: '',
    dateReceived: formatDisplayDate(record.date_received),
    dateReceivedISO: record.date_received ?? '',
    status: mapApplicationStatus(record.status, record.decision),
    applicationType: deriveApplicationType(description),
    decision: record.decision ?? 'Awaiting decision',
    distanceMiles: 0,
    tradeTags,
    estimatedValue: '',
    lat: 0,
    lng: 0,
    potentialWork: generatePotentialWork(tradeTags, title, description),
    potentialTrade: generatePotentialTrade(tradeTags),
    documents: [],
  };
}
