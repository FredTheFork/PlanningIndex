export type ApplicationStatus = 'Pending' | 'Approved' | 'Refused' | 'Withdrawn';

export type ApplicationType =
  | 'Householder'
  | 'Full Planning'
  | 'Outline'
  | 'Reserved Matters'
  | 'Listed Building'
  | 'Advertisement'
  | 'Discharge of Conditions'
  | 'Non-Material Amendment';

export interface SearchApplication {
  id: string;
  reference: string;
  title: string;
  description: string;
  address: string;
  postcode: string;
  council: string;
  ward: string;
  dateReceived: string;
  dateReceivedISO: string;
  status: ApplicationStatus;
  applicationType: ApplicationType;
  decision: string;
  distanceMiles: number;
  tradeTags: string[];
  estimatedValue: string;
}

export interface SearchFilters {
  keyword: string;
  location: string;
  radius: string;
  applicationType: string;
  status: string;
  dateRange: string;
  sort: string;
}

export interface SearchResultMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export const applicationTypeOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All applications' },
  { value: 'Householder', label: 'Householder' },
  { value: 'Full Planning', label: 'Full Planning' },
  { value: 'Outline', label: 'Outline' },
  { value: 'Reserved Matters', label: 'Reserved Matters' },
  { value: 'Listed Building', label: 'Listed Building' },
  { value: 'Advertisement', label: 'Advertisement' },
  { value: 'Discharge of Conditions', label: 'Discharge of Conditions' },
  { value: 'Non-Material Amendment', label: 'Non-Material Amendment' },
];

export const statusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Refused', label: 'Refused' },
  { value: 'Withdrawn', label: 'Withdrawn' },
];

export const dateRangeOptions: { value: string; label: string }[] = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: '365', label: 'Last year' },
  { value: 'all', label: 'All time' },
];

export const radiusOptions: { value: string; label: string }[] = [
  { value: '1', label: '1 mile' },
  { value: '5', label: '5 miles' },
  { value: '10', label: '10 miles' },
  { value: '25', label: '25 miles' },
  { value: '50', label: '50 miles' },
  { value: '100', label: '100 miles' },
];

export const sortOptions: { value: string; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'closest', label: 'Closest first' },
  { value: 'relevance', label: 'Relevance' },
];

export const defaultFilters: SearchFilters = {
  keyword: '',
  location: '',
  radius: '25',
  applicationType: 'all',
  status: 'all',
  dateRange: '30',
  sort: 'newest',
};

const baseDate = new Date('2026-09-01');

function daysAgo(days: number): { iso: string; display: string } {
  const d = new Date(baseDate);
  d.setDate(d.getDate() - days);
  return {
    iso: d.toISOString(),
    display: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
}

export const mockApplications: SearchApplication[] = [
  {
    id: '1',
    reference: '24/01234/FUL',
    title: 'Replacement of windows and doors',
    description: 'Replacement of existing timber sash windows with new double-glazed uPVC units. Installation of new composite front door and rear French doors. No external alterations to the building envelope.',
    address: '12 High Street, Amersham',
    postcode: 'HP6 5BA',
    council: 'Buckinghamshire Council',
    ward: 'Amersham North',
    dateReceived: daysAgo(4).display,
    dateReceivedISO: daysAgo(4).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 8,
    tradeTags: ['Windows', 'Doors'],
    estimatedValue: '£4,200',
  },
  {
    id: '2',
    reference: '24/01235/FUL',
    title: 'Rear extension and alterations',
    description: 'Single-storey rear extension measuring 6m x 4m. Internal alterations including removal of load-bearing wall between kitchen and dining room. Bi-fold doors to rear elevation.',
    address: '45 The Broadway, Rickmansworth',
    postcode: 'WD3 7AB',
    council: 'Three Rivers District Council',
    ward: 'Rickmansworth Town',
    dateReceived: daysAgo(5).display,
    dateReceivedISO: daysAgo(5).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 12,
    tradeTags: ['Extensions', 'Building'],
    estimatedValue: '£18,500',
  },
  {
    id: '3',
    reference: '24/01236/FUL',
    title: 'Construction of a new dwelling',
    description: 'Construction of a new two-storey detached dwelling with attached garage. Access via new driveway off School Lane. Four bedrooms with associated parking and landscaping.',
    address: '3 School Lane, Amersham',
    postcode: 'HP6 5AB',
    council: 'Buckinghamshire Council',
    ward: 'Amersham North',
    dateReceived: daysAgo(6).display,
    dateReceivedISO: daysAgo(6).iso,
    status: 'Approved',
    applicationType: 'Full Planning',
    decision: 'Approved with conditions',
    distanceMiles: 6,
    tradeTags: ['New Build', 'Building'],
    estimatedValue: '£32,000',
  },
  {
    id: '4',
    reference: '24/01237/FUL',
    title: 'Loft conversion with rear dormer',
    description: 'Loft conversion to create additional habitable space. Installation of rear dormer window with juliet balcony. Two roof lights to front elevation. Internal staircase access from first floor.',
    address: '78 High Street, Chesham',
    postcode: 'HP5 1AB',
    council: 'Buckinghamshire Council',
    ward: 'Chesham North',
    dateReceived: daysAgo(7).display,
    dateReceivedISO: daysAgo(7).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 10,
    tradeTags: ['Loft', 'Building'],
    estimatedValue: '£8,750',
  },
  {
    id: '5',
    reference: '24/01238/FUL',
    title: 'Replacement of existing roof covering',
    description: 'Removal of existing concrete tile roof covering and replacement with natural slate. Installation of two rear dormer windows with lead flashings. Replacement of all fascia and soffit boards.',
    address: '22 Station Road, Chesham',
    postcode: 'HP5 1AB',
    council: 'Buckinghamshire Council',
    ward: 'Chesham South',
    dateReceived: daysAgo(8).display,
    dateReceivedISO: daysAgo(8).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 14,
    tradeTags: ['Roofing', 'Dormers'],
    estimatedValue: '£6,400',
  },
  {
    id: '6',
    reference: '24/01239/FUL',
    title: 'Single-storey side extension',
    description: 'Single-storey side extension to create additional living space. Flat roof with roof lights. New bi-fold doors to side elevation. Matching brickwork to existing property.',
    address: '9 Park Avenue, Chorleywood',
    postcode: 'WD3 5AB',
    council: 'Three Rivers District Council',
    ward: 'Chorleywood',
    dateReceived: daysAgo(10).display,
    dateReceivedISO: daysAgo(10).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved with conditions',
    distanceMiles: 15,
    tradeTags: ['Extensions', 'Building'],
    estimatedValue: '£12,000',
  },
  {
    id: '7',
    reference: '24/01240/FUL',
    title: 'Two-storey rear extension',
    description: 'Two-storey rear extension providing additional bedroom and en-suite on first floor with extended kitchen and utility room on ground floor. Matching pitched roof to existing.',
    address: '31 Hill Road, Chalfont St Peter',
    postcode: 'SL9 9AB',
    council: 'Buckinghamshire Council',
    ward: 'Chalfont St Peter',
    dateReceived: daysAgo(12).display,
    dateReceivedISO: daysAgo(12).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 18,
    tradeTags: ['Extensions', 'Building'],
    estimatedValue: '£28,000',
  },
  {
    id: '8',
    reference: '24/01241/FUL',
    title: 'Garage conversion to habitable room',
    description: 'Conversion of existing attached single garage to habitable room. Installation of window to front elevation. Internal insulation and new floor finish. Removal of garage door and construction of matching wall.',
    address: '14 The Green, Penn',
    postcode: 'HP10 9AB',
    council: 'Buckinghamshire Council',
    ward: 'Penn',
    dateReceived: daysAgo(14).display,
    dateReceivedISO: daysAgo(14).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 20,
    tradeTags: ['Conversions', 'Building'],
    estimatedValue: '£5,500',
  },
  {
    id: '9',
    reference: '24/01242/FUL',
    title: 'Construction of boundary wall and brick pier entrance pillars',
    description: 'Construction of 1.8m high brick boundary wall using reclaimed London stock bricks with flint panels. Two brick pier entrance pillars with stone caps.',
    address: '8 Park Lane, Beaconsfield',
    postcode: 'HP9 1AB',
    council: 'Buckinghamshire Council',
    ward: 'Beaconsfield',
    dateReceived: daysAgo(15).display,
    dateReceivedISO: daysAgo(15).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 22,
    tradeTags: ['Brickwork', 'Masonry'],
    estimatedValue: '£3,800',
  },
  {
    id: '10',
    reference: '24/01243/FUL',
    title: 'Wraparound extension with bi-fold doors',
    description: 'Wraparound extension combining side return and rear extension. Installation of aluminium bi-fold doors to rear elevation. Roof lights to flat roof. New drainage connections.',
    address: '17 Victoria Road, Chorleywood',
    postcode: 'WD3 5AB',
    council: 'Three Rivers District Council',
    ward: 'Chorleywood',
    dateReceived: daysAgo(16).display,
    dateReceivedISO: daysAgo(16).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 15,
    tradeTags: ['Extensions', 'Wraparound'],
    estimatedValue: '£22,000',
  },
  {
    id: '11',
    reference: '24/01244/FUL',
    title: 'Garden room and landscaping works',
    description: 'Construction of timber-framed garden room (4m x 3m). Re-landscaping of rear garden including Indian sandstone patio, sleeper retaining wall, and new planting scheme.',
    address: '31 Hill Road, Chalfont St Peter',
    postcode: 'SL9 9AB',
    council: 'Buckinghamshire Council',
    ward: 'Chalfont St Peter',
    dateReceived: daysAgo(18).display,
    dateReceivedISO: daysAgo(18).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 18,
    tradeTags: ['Landscaping', 'Garden Room'],
    estimatedValue: '£7,200',
  },
  {
    id: '12',
    reference: '24/01245/FUL',
    title: 'Replacement of 12 timber sash windows',
    description: 'Replacement of 12 existing timber sash windows with new double-glazed units. Like-for-like replacement with no external alterations.',
    address: '42 Market Square, Aylesbury',
    postcode: 'HP20 1AB',
    council: 'Buckinghamshire Council',
    ward: 'Aylesbury Central',
    dateReceived: daysAgo(20).display,
    dateReceivedISO: daysAgo(20).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 25,
    tradeTags: ['Windows'],
    estimatedValue: '£4,800',
  },
  {
    id: '13',
    reference: '24/01246/FUL',
    title: 'Hip to gable loft conversion',
    description: 'Hip to gable loft conversion with rear dormer. Installation of velux windows to front elevation. New staircase access from first floor landing. En-suite shower room.',
    address: '5 Church Lane, Great Missenden',
    postcode: 'HP16 9AB',
    council: 'Buckinghamshire Council',
    ward: 'Great Missenden',
    dateReceived: daysAgo(22).display,
    dateReceivedISO: daysAgo(22).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 28,
    tradeTags: ['Loft', 'Dormers'],
    estimatedValue: '£14,500',
  },
  {
    id: '14',
    reference: '24/01247/FUL',
    title: 'Front porch and canopy',
    description: 'Construction of front porch with pitched tiled roof. New entrance door and canopy. Matching brickwork to existing property. New paving to front garden path.',
    address: '27 Orchard Way, Wendover',
    postcode: 'HP22 1AB',
    council: 'Buckinghamshire Council',
    ward: 'Wendover',
    dateReceived: daysAgo(25).display,
    dateReceivedISO: daysAgo(25).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 30,
    tradeTags: ['Building', 'Porch'],
    estimatedValue: '£3,200',
  },
  {
    id: '15',
    reference: '24/01248/FUL',
    title: 'Two-storey extension including new en-suite bathroom',
    description: 'Two-storey side extension. Ground floor: utility room with plumbing for washing machine and sink. First floor: new en-suite bathroom with shower and WC. Matching roof to existing.',
    address: '5 Church Lane, Great Missenden',
    postcode: 'HP16 9AB',
    council: 'Buckinghamshire Council',
    ward: 'Great Missenden',
    dateReceived: daysAgo(28).display,
    dateReceivedISO: daysAgo(28).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 28,
    tradeTags: ['Extensions', 'Plumbing', 'Building'],
    estimatedValue: '£35,000',
  },
  {
    id: '16',
    reference: '24/01249/FUL',
    title: 'Loft conversion to home office',
    description: 'Loft conversion to create home office. New electrical installation including lighting, power sockets, network points, and smoke alarms. Consumer unit upgrade.',
    address: '14 The Green, Penn',
    postcode: 'HP10 9AB',
    council: 'Buckinghamshire Council',
    ward: 'Penn',
    dateReceived: daysAgo(30).display,
    dateReceivedISO: daysAgo(30).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 20,
    tradeTags: ['Loft', 'Electrical'],
    estimatedValue: '£11,000',
  },
  {
    id: '17',
    reference: '24/01250/OUT',
    title: 'Outline application for residential development of 4 dwellings',
    description: 'Outline planning application for the demolition of existing structures and construction of 4 three-bedroom dwellings with associated access and parking. Access, appearance, landscaping, and scale reserved.',
    address: 'Land off Station Approach, Gerrards Cross',
    postcode: 'SL9 8AB',
    council: 'Buckinghamshire Council',
    ward: 'Gerrards Cross',
    dateReceived: daysAgo(35).display,
    dateReceivedISO: daysAgo(35).iso,
    status: 'Pending',
    applicationType: 'Outline',
    decision: 'Awaiting decision',
    distanceMiles: 32,
    tradeTags: ['New Build', 'Development'],
    estimatedValue: '£120,000',
  },
  {
    id: '18',
    reference: '24/01251/FUL',
    title: 'Replacement of flat roof with pitched roof',
    description: 'Replacement of existing flat roof to rear single-storey extension with pitched tiled roof. New guttering and downpipes. Matching tiles to main roof.',
    address: '18 Mill Lane, Chesham',
    postcode: 'HP5 1AB',
    council: 'Buckinghamshire Council',
    ward: 'Chesham South',
    dateReceived: daysAgo(38).display,
    dateReceivedISO: daysAgo(38).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 14,
    tradeTags: ['Roofing'],
    estimatedValue: '£4,500',
  },
  {
    id: '19',
    reference: '24/01252/FUL',
    title: 'Driveway and front garden hardstanding',
    description: 'Construction of new driveway and front garden hardstanding. Block paving to driveway area. New vehicular crossing of footway. Drainage to permeable area.',
    address: '33 Meadow View, Amersham',
    postcode: 'HP6 5AB',
    council: 'Buckinghamshire Council',
    ward: 'Amersham South',
    dateReceived: daysAgo(42).display,
    dateReceivedISO: daysAgo(42).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 7,
    tradeTags: ['Landscaping', 'Driveway'],
    estimatedValue: '£2,800',
  },
  {
    id: '20',
    reference: '24/01253/FUL',
    title: 'Bathroom and wet room installation',
    description: 'Internal alterations to create new wet room on ground floor. Removal of existing bathroom suite. Installation of level-access shower, drainage, and waterproof tanking. New sanitaryware.',
    address: '61 High Street, Rickmansworth',
    postcode: 'WD3 7AB',
    council: 'Three Rivers District Council',
    ward: 'Rickmansworth Town',
    dateReceived: daysAgo(45).display,
    dateReceivedISO: daysAgo(45).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 12,
    tradeTags: ['Plumbing', 'Bathroom'],
    estimatedValue: '£6,200',
  },
  {
    id: '21',
    reference: '24/01254/FUL',
    title: 'Kitchen extension with island and utility',
    description: 'Single-storey rear kitchen extension. Open plan layout with kitchen island. Separate utility room. Roof lights and bi-fold doors. New drainage and water connections.',
    address: '24 Oakwood Drive, Beaconsfield',
    postcode: 'HP9 1AB',
    council: 'Buckinghamshire Council',
    ward: 'Beaconsfield',
    dateReceived: daysAgo(50).display,
    dateReceivedISO: daysAgo(50).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 22,
    tradeTags: ['Extensions', 'Kitchen', 'Plumbing'],
    estimatedValue: '£26,000',
  },
  {
    id: '22',
    reference: '24/01255/FUL',
    title: 'EV charging point installation',
    description: 'Installation of electric vehicle charging point to front driveway. New electrical connection from property consumer unit. Surface-mounted cable protection.',
    address: '7 Birch Close, Amersham',
    postcode: 'HP6 5AB',
    council: 'Buckinghamshire Council',
    ward: 'Amersham South',
    dateReceived: daysAgo(55).display,
    dateReceivedISO: daysAgo(55).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 9,
    tradeTags: ['Electrical', 'EV'],
    estimatedValue: '£850',
  },
  {
    id: '23',
    reference: '24/01256/LBC',
    title: 'Listed building consent for window replacements',
    description: 'Listed building consent for replacement of 8 timber sash windows with new double-glazed timber units. Like-for-like design with slim profile glazing bars.',
    address: 'The Old Rectory, Church Road, Penn',
    postcode: 'HP10 9AB',
    council: 'Buckinghamshire Council',
    ward: 'Penn',
    dateReceived: daysAgo(60).display,
    dateReceivedISO: daysAgo(60).iso,
    status: 'Pending',
    applicationType: 'Listed Building',
    decision: 'Awaiting decision',
    distanceMiles: 20,
    tradeTags: ['Windows', 'Listed Building'],
    estimatedValue: '£6,800',
  },
  {
    id: '24',
    reference: '24/01257/FUL',
    title: 'Demolition of existing garage and construction of new outbuilding',
    description: 'Demolition of existing detached garage. Construction of new outbuilding to be used as home gym and storage. Timber frame construction with tiled roof.',
    address: '15 Forest Road, Chalfont St Giles',
    postcode: 'HP8 4AB',
    council: 'Buckinghamshire Council',
    ward: 'Chalfont St Giles',
    dateReceived: daysAgo(65).display,
    dateReceivedISO: daysAgo(65).iso,
    status: 'Refused',
    applicationType: 'Householder',
    decision: 'Refused - impact on green belt',
    distanceMiles: 24,
    tradeTags: ['Outbuilding', 'Demolition'],
    estimatedValue: '£9,500',
  },
  {
    id: '25',
    reference: '24/01258/FUL',
    title: 'Central heating system and underfloor heating',
    description: 'Installation of new central heating system. Underfloor heating to ground floor. New combi boiler in utility room. Radiators to first floor. All new pipework.',
    address: '29 The Crescent, Rickmansworth',
    postcode: 'WD3 7AB',
    council: 'Three Rivers District Council',
    ward: 'Rickmansworth Town',
    dateReceived: daysAgo(70).display,
    dateReceivedISO: daysAgo(70).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 13,
    tradeTags: ['Plumbing', 'Heating'],
    estimatedValue: '£7,400',
  },
  {
    id: '26',
    reference: '24/01259/FUL',
    title: 'Full house rewiring and consumer unit upgrade',
    description: 'Full electrical rewiring of three-bedroom semi-detached property. New consumer unit with RCBO protection. New sockets, switches, and lighting throughout. Network points to all rooms.',
    address: '43 Kings Road, Chesham',
    postcode: 'HP5 1AB',
    council: 'Buckinghamshire Council',
    ward: 'Chesham North',
    dateReceived: daysAgo(75).display,
    dateReceivedISO: daysAgo(75).iso,
    status: 'Pending',
    applicationType: 'Householder',
    decision: 'Awaiting decision',
    distanceMiles: 11,
    tradeTags: ['Electrical', 'Rewiring'],
    estimatedValue: '£4,200',
  },
  {
    id: '27',
    reference: '24/01260/FUL',
    title: 'Conservatory construction with glass roof',
    description: 'Construction of conservatory to rear elevation. Glass roof with aluminium frame. Dwarf wall in matching brickwork. French doors to garden. Underfloor heating.',
    address: '11 Rose Avenue, Gerrards Cross',
    postcode: 'SL9 8AB',
    council: 'Buckinghamshire Council',
    ward: 'Gerrards Cross',
    dateReceived: daysAgo(80).display,
    dateReceivedISO: daysAgo(80).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved with conditions',
    distanceMiles: 32,
    tradeTags: ['Conservatory', 'Building', 'Glazing'],
    estimatedValue: '£15,000',
  },
  {
    id: '28',
    reference: '24/01261/FUL',
    title: 'Bathroom extension and new en-suite',
    description: 'Single-storey extension to create new family bathroom. First floor en-suite to master bedroom. New drainage connections. Tiling and sanitaryware installation.',
    address: '37 Station Road, Amersham',
    postcode: 'HP6 5AB',
    council: 'Buckinghamshire Council',
    ward: 'Amersham North',
    dateReceived: daysAgo(85).display,
    dateReceivedISO: daysAgo(85).iso,
    status: 'Withdrawn',
    applicationType: 'Householder',
    decision: 'Withdrawn by applicant',
    distanceMiles: 8,
    tradeTags: ['Extensions', 'Bathroom', 'Plumbing'],
    estimatedValue: '£13,500',
  },
  {
    id: '29',
    reference: '24/01262/FUL',
    title: 'Retaining wall and garden terracing',
    description: 'Construction of 1.5m high retaining wall to rear garden. Timber sleeper construction with drainage. Terracing of sloping garden to create level lawn area.',
    address: '19 Hillside Close, Chalfont St Peter',
    postcode: 'SL9 9AB',
    council: 'Buckinghamshire Council',
    ward: 'Chalfont St Peter',
    dateReceived: daysAgo(90).display,
    dateReceivedISO: daysAgo(90).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 18,
    tradeTags: ['Landscaping', 'Retaining Wall'],
    estimatedValue: '£4,600',
  },
  {
    id: '30',
    reference: '24/01263/FUL',
    title: 'Solar panel installation and battery storage',
    description: 'Installation of 12 solar photovoltaic panels to south-facing roof. Battery storage unit in garage. Inverter installation. Electrical connection to consumer unit.',
    address: '52 Valley View, Wendover',
    postcode: 'HP22 1AB',
    council: 'Buckinghamshire Council',
    ward: 'Wendover',
    dateReceived: daysAgo(95).display,
    dateReceivedISO: daysAgo(95).iso,
    status: 'Approved',
    applicationType: 'Householder',
    decision: 'Approved',
    distanceMiles: 30,
    tradeTags: ['Electrical', 'Solar', 'Renewables'],
    estimatedValue: '£8,200',
  },
];

export function filterApplications(
  applications: SearchApplication[],
  filters: SearchFilters
): SearchApplication[] {
  let results = [...applications];

  if (filters.keyword.trim()) {
    const kw = filters.keyword.trim().toLowerCase();
    results = results.filter(
      (app) =>
        app.title.toLowerCase().includes(kw) ||
        app.description.toLowerCase().includes(kw) ||
        app.reference.toLowerCase().includes(kw) ||
        app.tradeTags.some((tag) => tag.toLowerCase().includes(kw))
    );
  }

  if (filters.applicationType !== 'all') {
    results = results.filter((app) => app.applicationType === filters.applicationType);
  }

  if (filters.status !== 'all') {
    results = results.filter((app) => app.status === filters.status);
  }

  if (filters.dateRange !== 'all') {
    const maxDays = parseInt(filters.dateRange, 10);
    const cutoff = new Date(baseDate);
    cutoff.setDate(cutoff.getDate() - maxDays);
    results = results.filter((app) => new Date(app.dateReceivedISO) >= cutoff);
  }

  if (filters.radius !== 'all') {
    const maxMiles = parseInt(filters.radius, 10);
    results = results.filter((app) => app.distanceMiles <= maxMiles);
  }

  switch (filters.sort) {
    case 'newest':
      results.sort((a, b) => new Date(b.dateReceivedISO).getTime() - new Date(a.dateReceivedISO).getTime());
      break;
    case 'oldest':
      results.sort((a, b) => new Date(a.dateReceivedISO).getTime() - new Date(b.dateReceivedISO).getTime());
      break;
    case 'closest':
      results.sort((a, b) => a.distanceMiles - b.distanceMiles);
      break;
    case 'relevance':
      if (filters.keyword.trim()) {
        const kw = filters.keyword.trim().toLowerCase();
        results.sort((a, b) => {
          const aTitle = a.title.toLowerCase().includes(kw) ? 1 : 0;
          const bTitle = b.title.toLowerCase().includes(kw) ? 1 : 0;
          const aTag = a.tradeTags.some((t) => t.toLowerCase().includes(kw)) ? 1 : 0;
          const bTag = b.tradeTags.some((t) => t.toLowerCase().includes(kw)) ? 1 : 0;
          return bTitle + bTag - (aTitle + aTag);
        });
      } else {
        results.sort((a, b) => a.distanceMiles - b.distanceMiles);
      }
      break;
  }

  return results;
}
