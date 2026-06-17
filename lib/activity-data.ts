// Realistic UK activity data for the live ticker
// Names are a mix of first names only, first + last initial, and full names

export const ukFirstNames = [
  'James', 'Emma', 'Oliver', 'Sophie', 'William', 'Emily', 'Harry', 'Olivia',
  'George', 'Charlotte', 'Jack', 'Amelia', 'Thomas', 'Grace', 'Jacob', 'Evie',
  'Charlie', 'Poppy', 'Daniel', 'Ruby', 'Matthew', 'Alice', 'Joshua', 'Ella',
  'William', 'Maisie', 'Henry', 'Holly', 'Joseph', 'Rosie', 'Samuel', 'Freya',
  'Benjamin', 'Scarlett', 'Alexander', 'Imogen', 'Edward', 'Florence', 'Ryan',
  'Sofia', 'Luke', 'Mia', 'Nathan', 'Sienna', 'Callum', 'Lily', 'Dylan',
  'Isla', 'Connor', 'Phoebe', 'Cameron', 'Chloe', 'Kyle', 'Ellie', 'Bradley',
  'Amber', 'Max', 'Erin', 'Riley', 'Eva', 'Lewis', 'Zara', 'Kyle', 'Lottie',
  'Gavin', 'Nina', 'Marcus', 'Tara', 'Philip', 'Claire', 'Simon', 'Hannah',
  'David', 'Nicole', 'Mark', 'Rachel', 'Paul', 'Lauren', 'Andrew', 'Katie',
  'Michael', 'Jessica', 'Stephen', 'Rebecca', 'Christopher', 'Megan', 'Peter',
  'Bethany', 'Jonathan', 'Abigail', 'Patrick', 'Victoria', 'Nicholas', 'Eleanor',
  'Robert', 'Catherine', 'Timothy', 'Sarah', 'Benjamin', 'Jennifer', 'Adam',
  'Hazel', 'Oscar', 'Violet', 'Leo', 'Ivy', 'Archie', 'Daisy', 'Freddie', 'Willow',
  'Theo', 'Eliza', 'Arthur', 'Maya', 'Alfie', 'Harper', 'Finley', 'Aria',
  'Ethan', 'Penelope', 'Sebastian', 'Beatrice', 'Harrison', 'Clara', 'Isaac',
  'Esme', 'Theodore', 'Ada', 'Louie', 'Iris', 'Tommy', 'Elodie', 'Roman', 'Ayla',
];

export const ukLastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Taylor', 'Davies', 'Wilson', 'Evans',
  'Thomas', 'Roberts', 'Walker', 'Wright', 'Robinson', 'Thompson', 'White',
  'Hughes', 'Edwards', 'Green', 'Hall', 'Clark', 'Lewis', 'Young', 'Harris',
  'Martin', 'Jackson', 'Wood', 'Turner', 'Cooper', 'Hill', 'Morris', 'Moore',
  'Clarkson', 'Campbell', 'Miller', 'Murray', 'Reid', 'Taylor', 'Ross', 'Stewart',
  'Anderson', 'Scott', 'Morrison', 'Macdonald', 'Graham', 'Hamilton', 'Davidson',
  'Paterson', 'Morrison', 'Burns', 'Kerr', 'Ferguson', 'Simpson', 'Wallace',
  'Mitchell', 'Watson', 'Kennedy', 'Brennan', 'Ryan', 'Quinn', 'Murphy', 'Sullivan',
  'Walsh', 'O\'Brien', 'Burke', 'Kelly', 'Gallagher', 'Connor', 'Brady', 'Lynch',
  'Casey', 'Doherty', 'Reilly', 'Nolan', 'Fitzpatrick', 'Carroll', 'Byrne',
  'Gibson', 'Martin', 'Medley', 'Parker', 'Pearson', 'Harrison', 'Bennett',
  'Brooks', 'Chapman', 'Collins', 'Cook', 'Cox', 'Dean', 'Grant', 'Griffin',
  'Hart', 'Harvey', 'Holmes', 'Hudson', 'Hunt', 'Hunter', 'James', 'King',
  'Knight', 'Lane', 'Lawrence', 'Mason', 'Matthews', 'Mills', 'Morgan', 'Newman',
  'Nelson', 'North', 'Palmer', 'Perry', 'Phillips', 'Porter', 'Powell', 'Price',
  'Reed', 'Reynolds', 'Richards', 'Richardson', 'Rogers', 'Russell', 'Sanders',
  'Scott', 'Sharp', 'Shaw', 'Simpson', 'Spencer', 'Stone', 'Sutton', 'West',
];

export const ukCities = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool',
  'Newcastle', 'Bristol', 'Sheffield', 'Edinburgh', 'Leicester', 'Coventry',
  'Nottingham', 'Cardiff', 'Belfast', 'Brighton', 'Oxford', 'Cambridge',
  'Southampton', 'Portsmouth', 'Plymouth', 'York', 'Bath', 'Norwich',
  'Exeter', 'Gloucester', 'Worcester', 'Derby', 'Stoke-on-Trent', 'Preston',
  'Reading', 'Luton', 'Milton Keynes', 'Swindon', 'Bournemouth', 'Guildford',
  'Cambridge', 'Oxford', 'Aberdeen', 'Dundee', 'Inverness', 'Stirling',
  'Swansea', 'Newport', 'Wrexham', 'Bangor', 'Londonderry', 'Derry',
  'Chester', 'Lincoln', 'Canterbury', 'Winchester', 'Salisbury', 'Cheltenham',
  'Harrogate', 'York', 'Stratford-upon-Avon', 'Windermere', 'St Ives', 'Falmouth',
];

export const activityTypes = [
  {
    type: 'purchase',
    templates: [
      '{name} in {city} purchased {pack}',
      '{name} from {city} ordered {pack}',
      'New order from {city} - {name} selected {pack}',
      '{name} ({city}) bought {pack}',
    ],
    packs: [
      'Business Foundations Pack',
      'Foundation Pack',
      'Website Copy Pack',
      'Social Media Pack',
      'Client Onboarding Pack',
      'Payment Protection Pack',
      'GDPR Deep Pack',
      'Copyright & Licensing Pack',
      'Coach Pack',
      'Photographer Pack',
      'Consultant Pack',
      'Contractor Pack',
      'the Foundation Bundle',
      'the Full Operations Bundle',
      'the Complete Infrastructure Bundle',
    ],
    weight: 35, // percentage chance
  },
  {
    type: 'intake',
    templates: [
      '{name} in {city} submitted intake form',
      '{name} ({city}) completed intake questionnaire',
      'Intake form received from {name} in {city}',
      '{name} from {city} sent intake responses',
    ],
    packs: [],
    weight: 25,
  },
  {
    type: 'delivery',
    templates: [
      '{name} in {city} received document pack',
      'Documents delivered to {name} ({city})',
      '{name} from {city} got their completed pack',
      'Pack delivered to {name} in {city}',
    ],
    packs: [],
    weight: 20,
  },
  {
    type: 'review',
    templates: [
      '5-star review from {name} in {city}',
      '{name} ({city}) left excellent feedback',
      '{name} from {city} rated us 5 stars',
      'Great review from {name} in {city}',
    ],
    packs: [],
    weight: 15,
  },
  {
    type: 'subscribe',
    templates: [
      '{name} in {city} subscribed to Monthly Care Plan',
      '{name} ({city}) joined the care plan',
      'Monthly Care Plan subscription from {city} - {name}',
    ],
    packs: [],
    weight: 5,
  },
];

// Generate a random name with varied formats
export function generateRandomName(): string {
  const firstName = ukFirstNames[Math.floor(Math.random() * ukFirstNames.length)];
  const format = Math.random();

  if (format < 0.4) {
    // First name + last initial (most common for privacy)
    const lastInitial = ukLastNames[Math.floor(Math.random() * ukLastNames.length)][0];
    return `${firstName} ${lastInitial}.`;
  } else if (format < 0.65) {
    // First name only
    return firstName;
  } else if (format < 0.85) {
    // First name + full last name
    const lastName = ukLastNames[Math.floor(Math.random() * ukLastNames.length)];
    return `${firstName} ${lastName}`;
  } else {
    // First initial + last name
    const lastName = ukLastNames[Math.floor(Math.random() * ukLastNames.length)];
    return `${firstName[0]}. ${lastName}`;
  }
}

// Generate a random city
export function generateRandomCity(): string {
  return ukCities[Math.floor(Math.random() * ukCities.length)];
}

// Generate a random activity
export interface Activity {
  id: string;
  type: 'purchase' | 'intake' | 'delivery' | 'review' | 'subscribe';
  message: string;
  createdAt: Date;
  displayTime: string;
  name: string;
  city: string;
}

export function generateActivity(randomizeTime: boolean = false): Activity {
  // Select activity type based on weights
  const rand = Math.random() * 100;
  let cumulative = 0;
  let selectedType = activityTypes[0];

  for (const type of activityTypes) {
    cumulative += type.weight;
    if (rand <= cumulative) {
      selectedType = type;
      break;
    }
  }

  const name = generateRandomName();
  const city = generateRandomCity();

  // Select random template
  const template = selectedType.templates[Math.floor(Math.random() * selectedType.templates.length)];

  // Build message
  let message = template.replace('{name}', name).replace('{city}', city);

  // Add pack if applicable
  if (selectedType.packs.length > 0) {
    const pack = selectedType.packs[Math.floor(Math.random() * selectedType.packs.length)];
    message = message.replace('{pack}', pack);
  }

  const createdAt = new Date();
  // Randomize initial time for initial population
  const initialMinutesAgo = randomizeTime ? Math.floor(Math.random() * 18) + 1 : Math.floor(Math.random() * 4) + 1;
  createdAt.setMinutes(createdAt.getMinutes() - initialMinutesAgo);

  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: selectedType.type as Activity['type'],
    message,
    createdAt,
    displayTime: formatTimeAgo(initialMinutesAgo),
    name,
    city,
  };
}

// Format time ago
export function formatTimeAgo(minutesAgo: number): string {
  if (minutesAgo < 1) return 'just now';
  if (minutesAgo === 1) return '1 min ago';
  return `${minutesAgo} min ago`;
}

// Calculate minutes since creation
export function getMinutesSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / 60000);
}
