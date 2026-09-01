import type { LucideIcon } from 'lucide-react';
import {
  Frame,
  Hammer,
  Home,
  Layers,
  Building2,
  PenTool,
  Trees,
  Wrench,
  Zap,
} from 'lucide-react';

export interface IndustryUseCase {
  title: string;
  description: string;
}

export interface IndustryExample {
  title: string;
  reference: string;
  address: string;
  council: string;
  date: string;
  status: string;
  statusColor: string;
  description: string;
  highlights: { label: string; value: string }[];
}

export interface Industry {
  slug: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  description: string;
  seoTitle: string;
  seoDescription: string;
  useCases: IndustryUseCase[];
  keywords: string[];
  example: IndustryExample;
}

export const industries: Industry[] = [
  {
    slug: 'windows-and-doors',
    name: 'Window & Door Companies',
    shortName: 'Windows & Doors',
    icon: Frame,
    description: 'Find replacement window and door jobs before your competitors even know they exist.',
    seoTitle: 'Planning Applications for Window & Door Companies',
    seoDescription: 'Find replacement window and door jobs from UK planning applications. Search for timber sash replacements, double glazing, and new door installations.',
    useCases: [
      { title: 'Replacement windows', description: 'Planning applications that mention replacement of timber sash, casement, or bay windows are a direct signal of upcoming window work.' },
      { title: 'New door installations', description: 'Applications involving composite doors, French doors, or bi-fold doors indicate opportunities for door installation companies.' },
      { title: 'Double glazing upgrades', description: 'Applications that reference double glazing or energy-efficient window upgrades signal properties likely investing in window improvements.' },
      { title: 'Listed building consent', description: 'Listed building consent applications for window and door changes require specialist contractors who understand period property work.' },
    ],
    keywords: ['replacement windows', 'timber sash', 'double glazing', 'French doors', 'composite door', 'bi-fold doors', 'window replacement', 'door installation'],
    example: {
      title: 'Replacement of 12 timber sash windows with double-glazed units',
      reference: '24/01234/FUL',
      address: '12 High Street, Amersham, HP6 5BA',
      council: 'Buckinghamshire Council',
      date: '28 August 2026',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
      description: 'Replacement of existing timber sash windows with new double-glazed uPVC units. Installation of new composite front door and rear French doors.',
      highlights: [
        { label: 'Windows', value: '12' },
        { label: 'Doors', value: '2' },
        { label: 'Potential trade', value: 'Window / Door Contractor' },
      ],
    },
  },
  {
    slug: 'builders',
    name: 'Builders',
    shortName: 'Builders',
    icon: Hammer,
    description: 'Discover extension, conversion, and new build projects in your area as soon as they are submitted.',
    seoTitle: 'Planning Applications for Builders',
    seoDescription: 'Find building work from UK planning applications. Search for extensions, conversions, new builds, and renovation projects in your area.',
    useCases: [
      { title: 'Rear extensions', description: 'Single-storey and two-storey rear extensions are one of the most common planning applications and a steady source of building work.' },
      { title: 'Side extensions', description: 'Side return extensions, particularly common in London and urban areas, signal significant building projects.' },
      { title: 'Loft conversions', description: 'Loft conversion applications indicate homeowners looking to expand upwards — a reliable source of building work.' },
      { title: 'New dwellings', description: 'New build applications, from single dwellings to small developments, represent larger-scale building opportunities.' },
    ],
    keywords: ['rear extension', 'side extension', 'loft conversion', 'new dwelling', 'two-storey', 'single-storey', 'garage conversion', 'renovation', 'alteration'],
    example: {
      title: 'Rear extension and internal alterations to existing dwelling',
      reference: '24/01235/FUL',
      address: '45 The Broadway, Rickmansworth, WD3 7AB',
      council: 'Three Rivers District Council',
      date: '27 August 2026',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
      description: 'Single-storey rear extension measuring 6m x 4m. Internal alterations including removal of load-bearing wall between kitchen and dining room.',
      highlights: [
        { label: 'Extension', value: 'Rear, 24m²' },
        { label: 'Internal', value: 'Wall removal' },
        { label: 'Potential trade', value: 'Builder' },
      ],
    },
  },
  {
    slug: 'roofers',
    name: 'Roofing Companies',
    shortName: 'Roofers',
    icon: Home,
    description: 'Identify roofing projects — from tile replacements to full re-roofs — the moment planning applications go public.',
    seoTitle: 'Planning Applications for Roofing Companies',
    seoDescription: 'Find roofing work from UK planning applications. Search for roof replacements, tile replacements, flat roofs, and re-roofing projects.',
    useCases: [
      { title: 'Roof replacements', description: 'Applications for full or partial roof replacement signal major roofing contracts, often involving multiple properties.' },
      { title: 'Tile and slate work', description: 'Applications mentioning replacement of concrete tiles, clay tiles, or natural slate indicate specific roofing material work.' },
      { title: 'Flat roof conversions', description: 'Applications involving flat roof installation or replacement, including rubber and felt systems, are common on extensions.' },
      { title: 'Dormer construction', description: 'Dormer window installations, often part of loft conversions, require roofing expertise for weatherproofing and finishing.' },
    ],
    keywords: ['roof replacement', 're-roof', 'tile replacement', 'slate roof', 'flat roof', 'dormer', 'roof covering', 'pitched roof', 'roof alteration'],
    example: {
      title: 'Replacement of existing roof covering and installation of two dormer windows',
      reference: '24/01238/FUL',
      address: '22 Station Road, Chesham, HP5 1AB',
      council: 'Buckinghamshire Council',
      date: '25 August 2026',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
      description: 'Removal of existing concrete tile roof covering and replacement with natural slate. Installation of two rear dormer windows with lead flashings.',
      highlights: [
        { label: 'Roof area', value: '120m²' },
        { label: 'Dormers', value: '2' },
        { label: 'Potential trade', value: 'Roofer' },
      ],
    },
  },
  {
    slug: 'bricklayers',
    name: 'Bricklayers',
    shortName: 'Bricklayers',
    icon: Layers,
    description: 'Find brickwork and masonry projects from planning applications across the UK.',
    seoTitle: 'Planning Applications for Bricklayers',
    seoDescription: 'Find bricklaying work from UK planning applications. Search for brick walls, extensions, new builds, and masonry projects.',
    useCases: [
      { title: 'Extension brickwork', description: 'Extensions require matching brickwork to existing properties, creating opportunities for skilled bricklayers.' },
      { title: 'Boundary walls', description: 'Applications for new boundary walls, garden walls, and retaining walls are a steady source of bricklaying work.' },
      { title: 'New build brickwork', description: 'New dwelling applications represent large-scale bricklaying contracts from foundation to completion.' },
      { title: 'Repointing and restoration', description: 'Listed building and conservation area applications often involve brick repointing and masonry restoration.' },
    ],
    keywords: ['brick wall', 'brickwork', 'repointing', 'masonry', 'brick extension', 'boundary wall', 'garden wall', 'flint', 'stonework'],
    example: {
      title: 'Construction of boundary wall and brick pier entrance pillars',
      reference: '24/01242/FUL',
      address: '8 Park Lane, Beaconsfield, HP9 1AB',
      council: 'Buckinghamshire Council',
      date: '24 August 2026',
      status: 'Approved',
      statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      description: 'Construction of 1.8m high brick boundary wall using reclaimed London stock bricks with flint panels. Two brick pier entrance pillars with stone caps.',
      highlights: [
        { label: 'Wall length', value: '22m' },
        { label: 'Pillars', value: '2' },
        { label: 'Potential trade', value: 'Bricklayer' },
      ],
    },
  },
  {
    slug: 'extensions',
    name: 'Extension Contractors',
    shortName: 'Extensions',
    icon: Building2,
    description: 'Specialise in extensions? Find every extension planning application in your area before the competition.',
    seoTitle: 'Planning Applications for Extension Contractors',
    seoDescription: 'Find extension work from UK planning applications. Search for rear extensions, side returns, two-storey extensions, and wraparound extensions.',
    useCases: [
      { title: 'Rear extensions', description: 'The most common extension type — single-storey rear extensions are a constant source of work for specialist contractors.' },
      { title: 'Side return extensions', description: 'Side return extensions, popular in Victorian and Edwardian terraces, require specialist knowledge of structural support.' },
      { title: 'Two-storey extensions', description: 'Two-storey extensions represent larger contracts and often involve both ground-floor and first-floor work.' },
      { title: 'Wraparound extensions', description: 'Wraparound extensions combining side and rear are complex projects that command premium pricing.' },
    ],
    keywords: ['rear extension', 'side return', 'two-storey extension', 'wraparound', 'single-storey', 'kitchen extension', 'side extension', 'wrap-around'],
    example: {
      title: 'Single-storey wraparound extension with bi-fold doors',
      reference: '24/01245/FUL',
      address: '17 Victoria Road, Chorleywood, WD3 5AB',
      council: 'Three Rivers District Council',
      date: '23 August 2026',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
      description: 'Wraparound extension combining side return and rear extension. Installation of aluminium bi-fold doors to rear elevation. Roof lights to flat roof.',
      highlights: [
        { label: 'Type', value: 'Wraparound' },
        { label: 'Area', value: '32m²' },
        { label: 'Potential trade', value: 'Extension Contractor' },
      ],
    },
  },
  {
    slug: 'architects-and-designers',
    name: 'Architects & Designers',
    shortName: 'Architects',
    icon: PenTool,
    description: 'Find clients before they start looking. Reach homeowners at the planning stage when they need design expertise most.',
    seoTitle: 'Planning Applications for Architects & Designers',
    seoDescription: 'Find architecture clients from UK planning applications. Identify homeowners at the planning stage who need design and drawing services.',
    useCases: [
      { title: 'Pre-application enquiries', description: 'Pre-application enquiries signal homeowners considering major works who may need professional design input before submitting.' },
      { title: 'Withdrawn applications', description: 'Withdrawn applications often indicate homeowners who need better design support to get their project approved.' },
      { title: 'Refused applications', description: 'Refused applications represent homeowners who may need an architect to redesign and resubmit an improved scheme.' },
      { title: 'Major alterations', description: 'Applications for significant alterations often require professional design services for planning drawings and building regulations.' },
    ],
    keywords: ['alteration', 'extension', 'new dwelling', 'conversion', 'pre-application', 'outline planning', 'reserved matters', 'listed building consent'],
    example: {
      title: 'Outline application for residential development of 4 dwellings',
      reference: '24/01250/OUT',
      address: 'Land off Station Approach, Gerrards Cross, SL9 8AB',
      council: 'Buckinghamshire Council',
      date: '22 August 2026',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
      description: 'Outline planning application for the demolition of existing structures and construction of 4 three-bedroom dwellings with associated access and parking.',
      highlights: [
        { label: 'Dwellings', value: '4' },
        { label: 'Type', value: 'Outline' },
        { label: 'Potential trade', value: 'Architect / Designer' },
      ],
    },
  },
  {
    slug: 'landscapers',
    name: 'Landscapers',
    shortName: 'Landscapers',
    icon: Trees,
    description: 'Discover landscaping and outdoor project opportunities from planning applications near you.',
    seoTitle: 'Planning Applications for Landscapers',
    seoDescription: 'Find landscaping work from UK planning applications. Search for garden projects, driveways, outdoor structures, and hard landscaping.',
    useCases: [
      { title: 'Garden alterations', description: 'Applications involving significant garden changes, including levelling, terracing, and new planting schemes.' },
      { title: 'Driveway and access works', description: 'Applications for new or widened driveways, access roads, and parking areas signal hard landscaping opportunities.' },
      { title: 'Outdoor structures', description: 'Applications for garden rooms, outbuildings, pergolas, and gazebos indicate homeowners investing in outdoor living.' },
      { title: 'Retaining walls', description: 'Applications involving retaining walls, especially on sloping sites, require specialist landscaping and masonry skills.' },
    ],
    keywords: ['garden', 'landscaping', 'driveway', 'outbuilding', 'garden room', 'pergola', 'retaining wall', 'patio', 'terrace', 'hard landscaping'],
    example: {
      title: 'Construction of garden room and landscaping works including new patio and retaining wall',
      reference: '24/01255/FUL',
      address: '31 Hill Road, Chalfont St Peter, SL9 9AB',
      council: 'Buckinghamshire Council',
      date: '21 August 2026',
      status: 'Approved',
      statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      description: 'Construction of timber-framed garden room (4m x 3m). Re-landscaping of rear garden including Indian sandstone patio, sleeper retaining wall, and new planting.',
      highlights: [
        { label: 'Garden room', value: '12m²' },
        { label: 'Patio', value: '28m²' },
        { label: 'Potential trade', value: 'Landscaper' },
      ],
    },
  },
  {
    slug: 'plumbers',
    name: 'Plumbing Contractors',
    shortName: 'Plumbers',
    icon: Wrench,
    description: 'Find plumbing and heating projects from planning applications — from bathroom installations to full system upgrades.',
    seoTitle: 'Planning Applications for Plumbing Contractors',
    seoDescription: 'Find plumbing work from UK planning applications. Search for bathroom installations, heating systems, and plumbing alterations.',
    useCases: [
      { title: 'Bathroom installations', description: 'Extensions and alterations that include new bathrooms or en-suites signal plumbing installation work.' },
      { title: 'Heating system upgrades', description: 'Applications mentioning central heating, underfloor heating, or boiler relocations indicate plumbing and heating work.' },
      { title: 'Kitchen alterations', description: 'Kitchen extensions and alterations require plumbing work for sinks, dishwashers, and water supply.' },
      { title: 'Wet room installations', description: 'Applications involving wet rooms or accessible bathroom conversions require specialist plumbing and waterproofing.' },
    ],
    keywords: ['bathroom', 'en-suite', 'central heating', 'underfloor heating', 'boiler', 'plumbing', 'wet room', 'shower room', 'sanitary'],
    example: {
      title: 'Two-storey extension including new en-suite bathroom and utility room',
      reference: '24/01260/FUL',
      address: '5 Church Lane, Great Missenden, HP16 9AB',
      council: 'Buckinghamshire Council',
      date: '20 August 2026',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
      description: 'Two-storey side extension. Ground floor: utility room with plumbing for washing machine and sink. First floor: new en-suite bathroom with shower and WC.',
      highlights: [
        { label: 'Bathrooms', value: '1 new' },
        { label: 'Utility', value: '1 new' },
        { label: 'Potential trade', value: 'Plumber' },
      ],
    },
  },
  {
    slug: 'electrical-contractors',
    name: 'Electrical Contractors',
    shortName: 'Electrical',
    icon: Zap,
    description: 'Identify electrical installation opportunities from planning applications across the UK.',
    seoTitle: 'Planning Applications for Electrical Contractors',
    seoDescription: 'Find electrical work from UK planning applications. Search for rewiring, electrical installations, and smart home projects.',
    useCases: [
      { title: 'Full rewires', description: 'Extensions, conversions, and renovation projects often require partial or full electrical rewiring throughout the property.' },
      { title: 'New circuit installations', description: 'Applications involving new kitchens, bathrooms, or extensions require additional electrical circuits and consumer unit upgrades.' },
      { title: 'Smart home wiring', description: 'Applications mentioning home automation, smart lighting, or integrated systems signal opportunities for specialist electrical contractors.' },
      { title: 'EV charging points', description: 'Applications involving electric vehicle charging point installations are a growing source of electrical work.' },
    ],
    keywords: ['electrical', 'rewiring', 'rewire', 'consumer unit', 'circuit', 'smart home', 'EV charging', 'electric vehicle', 'lighting', 'home automation'],
    example: {
      title: 'Loft conversion with new electrical installation and home office',
      reference: '24/01265/FUL',
      address: '14 The Green, Penn, HP10 9AB',
      council: 'Buckinghamshire Council',
      date: '19 August 2026',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
      description: 'Loft conversion to create home office. New electrical installation including lighting, power sockets, network points, and smoke alarms. Consumer unit upgrade.',
      highlights: [
        { label: 'Type', value: 'Loft conversion' },
        { label: 'Electrical', value: 'Full install' },
        { label: 'Potential trade', value: 'Electrical Contractor' },
      ],
    },
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
