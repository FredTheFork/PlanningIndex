import type { LucideIcon } from 'lucide-react';
import {
  Search,
  Users,
  FileText,
  Calendar,
  FolderOpen,
  TrendingUp,
} from 'lucide-react';

export interface GuideSection {
  heading?: string;
  paragraphs: string[];
  type?: 'text' | 'callout' | 'steps' | 'list';
  steps?: string[];
  items?: string[];
  calloutType?: 'tip' | 'warning' | 'info';
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced';
  date: string;
  displayDate: string;
  readTime: string;
  icon: LucideIcon;
  content: GuideSection[];
}

export const guides: Guide[] = [
  {
    slug: 'getting-started-with-planningindex',
    title: 'Getting Started with PlanningIndex',
    excerpt: 'Everything you need to know to set up your account and find your first planning application in under 10 minutes.',
    category: 'Beginner',
    date: '2026-08-01',
    displayDate: 'Aug 2026',
    readTime: '5 min read',
    icon: Search,
    content: [
      {
        heading: 'Welcome to PlanningIndex',
        paragraphs: [
          'PlanningIndex gives you access to every planning application across the UK, updated daily. This guide walks you through setting up your account and finding your first application in under 10 minutes.',
        ],
      },
      {
        heading: 'Step 1: Set up your company profile',
        paragraphs: [
          'After creating your account, go to Settings > Company and enter your company name, address, phone, email, and website. This information automatically appears in every proposal you create, so you only need to enter it once.',
        ],
      },
      {
        heading: 'Step 2: Set your default search preferences',
        paragraphs: [
          'Go to Settings > Preferences to set your default search radius and trade tags. These are pre-selected every time you open Planning Search, saving you from configuring the same filters repeatedly.',
        ],
      },
      {
        heading: 'Step 3: Run your first search',
        paragraphs: [
          'Click Planning Applications in the sidebar. Enter a keyword related to your trade — for example, "windows" or "extension" — and set a location and radius. Click Search to see matching applications.',
        ],
        type: 'steps',
        steps: [
          'Open Planning Search from the sidebar.',
          'Enter a keyword like "windows" or "extension".',
          'Set your location (town or postcode).',
          'Choose a radius — 25 miles is a good starting point.',
          'Click Search to see results.',
        ],
      },
      {
        heading: 'Step 4: Review an application',
        paragraphs: [
          'Click any result to open the full application detail page. You will see the description, status, council, documents, location map, and application intelligence — a breakdown of the potential work identified from the application.',
        ],
      },
      {
        heading: 'Step 5: Add your first lead',
        paragraphs: [
          'When you find a relevant application, click "Add to Leads" to save it to your CRM pipeline. Enter the contact name and any notes. The lead appears in your Leads page and Pipeline board.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Set up your preferences before your first search. Default trade tags and radius will save you time on every search you run.',
        ],
      },
      {
        heading: 'You are ready to go',
        paragraphs: [
          'That is it. You now have a working account, a configured search, and your first lead. From here, the workflow is simple: search, identify, add to leads, create a proposal, and send it by post.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-use-map-view-effectively',
    title: 'How to Use Map View Effectively',
    excerpt: 'Master the interactive map — find clusters of activity, and target the postcodes you want to work in.',
    category: 'Beginner',
    date: '2026-08-05',
    displayDate: 'Aug 2026',
    readTime: '4 min read',
    icon: Search,
    content: [
      {
        heading: 'Why the map matters',
        paragraphs: [
          'Construction work is local. The map view lets you see where planning applications are geographically, helping you identify clusters of activity and target the areas you want to work in.',
        ],
      },
      {
        heading: 'Switching to map view',
        paragraphs: [
          'On the Planning Search page, the map appears on the right side of the screen alongside the results list. On mobile, use the List/Map toggle at the top to switch between views.',
        ],
      },
      {
        heading: 'Reading the markers',
        paragraphs: [
          'Each marker represents a planning application, colour-coded by status: green for approved, amber for pending, red for refused, grey for withdrawn. Click any marker to see a summary popup with the title, reference, and address.',
        ],
      },
      {
        heading: 'Using radius search with the map',
        paragraphs: [
          'Set a location and radius in the search filters. The map will show all applications within that radius. A smaller radius gives you a focused view of your immediate area; a larger radius shows more opportunities but covers more ground.',
        ],
        type: 'list',
        items: [
          '1 mile: very focused — useful in dense urban areas.',
          '5-10 miles: good for local trades who do not want to travel far.',
          '25 miles: a balanced default for most businesses.',
          '50-100 miles: for trades willing to travel or covering rural areas.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Look for clusters of markers. A group of applications in one area may indicate a neighbourhood undergoing renovation — a concentration of opportunity worth targeting.',
        ],
      },
      {
        heading: 'Hover and click sync',
        paragraphs: [
          'When you hover over a result card in the list, the corresponding marker on the map grows larger. When you click a marker, the matching result card is highlighted and scrolls into view. This two-way sync makes it easy to move between the map and the list.',
        ],
      },
    ],
  },
  {
    slug: 'setting-up-smart-filters-for-your-trade',
    title: 'Setting Up Smart Filters for Your Trade',
    excerpt: 'Create saved searches that automatically find the exact types of jobs you want — loft conversions, new roofs, extensions, and more.',
    category: 'Beginner',
    date: '2026-07-15',
    displayDate: 'Jul 2026',
    readTime: '4 min read',
    icon: Search,
    content: [
      {
        heading: 'Filters save you time',
        paragraphs: [
          'Instead of manually searching every day, configure your filters once and PlanningIndex keeps them updated. The right combination of keyword, location, radius, and trade tags will surface the most relevant applications automatically.',
        ],
      },
      {
        heading: 'Choosing the right keywords',
        paragraphs: [
          'Think about the specific terms that appear in planning applications for your trade. A window company should search for "replacement windows" and "double glazing." A roofer should search for "roof replacement" and "re-roof." Use multiple keywords separated by commas to broaden your search.',
        ],
      },
      {
        heading: 'Using trade tags',
        paragraphs: [
          'Trade tags are PlanningIndex categories assigned to each application based on its content. Filter by trade tag to quickly narrow results to applications relevant to your specialism — Windows, Doors, Roofing, Extensions, Loft, Dormers, and more.',
        ],
        type: 'list',
        items: [
          'Windows: replacement windows, double glazing, timber sash.',
          'Roofing: roof replacement, re-roof, tile replacement, flat roof.',
          'Extensions: rear extension, side extension, wraparound.',
          'Loft: loft conversion, loft alteration, dormer.',
          'New Build: new dwelling, residential development.',
        ],
      },
      {
        heading: 'Combining filters',
        paragraphs: [
          'The most effective searches combine multiple filters. For example, a window company might set keyword "replacement windows", trade tag "Windows", radius "15 miles", and date "Last 30 days." This combination will surface only recent window replacement applications within a manageable distance.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Set your default trade tags in Settings > Preferences. These are pre-selected every time you open Planning Search, so you do not need to reconfigure them each time.',
        ],
      },
      {
        heading: 'Filtering by status and date',
        paragraphs: [
          'Filter by status to focus on applications that are more likely to proceed — "Pending" applications are still in the early stages, while "Approved" applications have permission and are closer to construction. Use the date filter to focus on recent applications that have not yet been picked up by competitors.',
        ],
      },
    ],
  },
  {
    slug: 'managing-your-lead-pipeline',
    title: 'Managing Your Lead Pipeline',
    excerpt: 'Learn how to turn planning applications into leads, move them through your pipeline, and track your win rate.',
    category: 'Intermediate',
    date: '2026-07-10',
    displayDate: 'Jul 2026',
    readTime: '5 min read',
    icon: Users,
    content: [
      {
        heading: 'From application to lead',
        paragraphs: [
          'Every lead in your pipeline starts as a planning application. When you find a relevant application, click "Add to Leads" to create a lead with the property address, planning reference, and application title pre-filled. You then add contact details, notes, and a follow-up date.',
        ],
      },
      {
        heading: 'The pipeline stages',
        paragraphs: [
          'Your pipeline has five stages: New, Contacted, Proposal Sent, Follow Up, and Won. There is also a Lost stage for leads that did not convert. Each stage represents a step in the relationship with the property owner.',
        ],
        type: 'list',
        items: [
          'New: lead added, no contact made yet.',
          'Contacted: you have reached out by phone, email, or post.',
          'Proposal Sent: a proposal has been created and sent.',
          'Follow Up: you are following up after sending a proposal.',
          'Won: the lead accepted your proposal and you have the job.',
          'Lost: the lead went to a competitor or did not proceed.',
        ],
      },
      {
        heading: 'Using the Kanban board',
        paragraphs: [
          'The Pipeline page shows a Kanban board with columns for each stage. Drag lead cards between columns to move them through the pipeline. The board also shows a summary bar with your total pipeline value, win rate, and active lead count.',
        ],
      },
      {
        heading: 'Using the list view',
        paragraphs: [
          'Toggle to List view on the Pipeline page to see all leads in a sortable table. This is useful when you want to sort by value or follow-up date. Click any row to open the lead detail drawer.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Move leads to the correct stage as soon as the status changes. An accurate pipeline helps you track your win rate and identify where leads are stalling.',
        ],
      },
      {
        heading: 'Lead detail and activity history',
        paragraphs: [
          'Click any lead to open the detail drawer. Here you can edit contact information, change status, set follow-up dates, add notes, and see a full activity timeline. Every action — lead added, status changed, proposal created, proposal sent — is logged automatically.',
        ],
      },
      {
        heading: 'Tracking your win rate',
        paragraphs: [
          'The pipeline summary shows your win rate: the percentage of decided leads (Won or Lost) that you won. A healthy win rate depends on your trade and market, but tracking it over time helps you understand whether your proposal and follow-up process is working.',
        ],
      },
    ],
  },
  {
    slug: 'creating-and-sending-proposals',
    title: 'Creating and Sending Proposals',
    excerpt: 'Generate professional proposals in minutes, send them by post, and track delivery.',
    category: 'Intermediate',
    date: '2026-06-20',
    displayDate: 'Jun 2026',
    readTime: '5 min read',
    icon: FileText,
    content: [
      {
        heading: 'The proposal workflow',
        paragraphs: [
          'Proposals are the bridge between finding a lead and winning the work. PlanningIndex lets you create a professional proposal from a lead, edit it, preview it, and send it by physical post — all from one place.',
        ],
      },
      {
        heading: 'Creating a proposal from a lead',
        paragraphs: [
          'Open a lead in the detail drawer and click "Create Proposal." Choose a template — Window Replacement, General Building, Roofing, Extension, or Custom. The proposal is pre-filled with the recipient name, property address, planning reference, and project title from the lead.',
        ],
        type: 'steps',
        steps: [
          'Open a lead from the Leads page or Pipeline board.',
          'Click "Create Proposal" in the Proposals section.',
          'Select a template that matches the project type.',
          'The proposal opens in the editor with all details pre-filled.',
        ],
      },
      {
        heading: 'Editing the proposal',
        paragraphs: [
          'The proposal editor has collapsible sections: Proposal Details, Introduction, Scope of Works, Products & Services, Pricing, Terms, and Company Details. Edit any section, add or remove line items in the pricing section, and adjust quantities and unit prices. The live preview on the right shows exactly how the printed document will look.',
        ],
      },
      {
        heading: 'Sending by post',
        paragraphs: [
          'When the proposal is ready, click "Send by Post." A five-step wizard guides you through the process: finalise the checklist, preview the document, confirm the recipient address, review the send summary, and send. PlanningIndex handles printing, enveloping, and posting. Delivery is tracked and the proposal status updates automatically.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'info',
        paragraphs: [
          'A printed proposal arriving at the property door stands out far more than an email. It demonstrates professionalism and shows the homeowner you are serious about their project.',
        ],
      },
      {
        heading: 'Tracking delivery',
        paragraphs: [
          'After sending, the proposal status moves through Sent, Processing, Mailed, and Delivered. You can see the full delivery timeline on the proposal detail page, including the tracking number and estimated delivery date. If there is a delivery issue, you can retry the send.',
        ],
      },
      {
        heading: 'Company details auto-populate',
        paragraphs: [
          'Your company name, address, phone, email, and VAT number from Settings > Company automatically appear in every proposal. Update your company details once and every future proposal will use the correct information.',
        ],
      },
    ],
  },
  {
    slug: 'using-calendar-and-follow-ups',
    title: 'Using the Calendar and Follow-Up System',
    excerpt: 'Keep track of site visits, deadlines, and follow-ups with the integrated follow-up system.',
    category: 'Intermediate',
    date: '2026-06-10',
    displayDate: 'Jun 2026',
    readTime: '4 min read',
    icon: Calendar,
    content: [
      {
        heading: 'Why follow-ups matter',
        paragraphs: [
          'Most leads do not convert on the first contact. A homeowner who was not ready to hire a contractor when the planning application was submitted may be ready three months later when permission is granted. Consistent follow-up is what separates businesses that win from those that lose.',
        ],
      },
      {
        heading: 'Setting a follow-up date',
        paragraphs: [
          'In the lead detail drawer, set a follow-up date and type (Call, Email, Visit, or Proposal). The follow-up appears on the dashboard under "Upcoming follow-ups" and in the lead detail activity timeline.',
        ],
      },
      {
        heading: 'Today\'s priorities',
        paragraphs: [
          'The dashboard shows a "Today\'s Priorities" section at the top. This includes follow-ups due today, proposals that need sending, and leads that need attention. Check this section first when you log in — it tells you exactly what to do today.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Set the follow-up type as well as the date. Knowing whether to call, email, or visit helps you prepare and ensures the right action is taken at the right time.',
        ],
      },
      {
        heading: 'Following up after a proposal',
        paragraphs: [
          'After sending a proposal, set a follow-up for 3-5 days later. This gives the postal delivery time to arrive and the homeowner time to read it. A well-timed follow-up call after a proposal arrives can significantly increase your conversion rate.',
        ],
      },
      {
        heading: 'Activity history',
        paragraphs: [
          'Every follow-up — scheduled, completed, or missed — is logged in the lead activity timeline. This gives you a complete history of every interaction with the property owner, so you always know where you left off.',
        ],
      },
    ],
  },
  {
    slug: 'organising-files-and-documents',
    title: 'Organising Files and Documents',
    excerpt: 'Upload photos, receipts, drawings, and contracts against each job. Keep everything in one searchable vault.',
    category: 'Advanced',
    date: '2026-05-15',
    displayDate: 'May 2026',
    readTime: '4 min read',
    icon: FolderOpen,
    content: [
      {
        heading: 'Planning documents',
        paragraphs: [
          'Every planning application in PlanningIndex includes links to its supporting documents — planning forms, site plans, floor plans, elevations, and supporting statements. Review these documents before visiting a property to understand the project scope.',
        ],
      },
      {
        heading: 'Downloading documents',
        paragraphs: [
          'On the application detail page, scroll to the Documents section. Documents are grouped by type: Planning documents, Drawings, and Supporting information. Click the download icon next to any document to save it.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Review the site plan and floor plans before visiting a property. You will arrive already understanding the project, which saves time on site and demonstrates professionalism.',
        ],
      },
      {
        heading: 'Using documents in proposals',
        paragraphs: [
          'The information in planning documents helps you build accurate proposals. Use the site plan to understand the property footprint, the floor plans to understand the internal layout, and the elevations to understand external finishes. This detail makes your proposals more accurate and more professional.',
        ],
      },
      {
        heading: 'Keeping notes with leads',
        paragraphs: [
          'Use the notes field in the lead detail drawer to record information from documents — dimensions, materials, quantities. These notes persist with the lead and are available when you create a proposal, so you do not need to re-read the documents.',
        ],
      },
    ],
  },
  {
    slug: 'tracking-costs-and-profit-margins',
    title: 'Tracking Costs and Profit Margins',
    excerpt: 'Use the pricing and line item system to see your margin in real time and never underprice a job again.',
    category: 'Advanced',
    date: '2026-05-05',
    displayDate: 'May 2026',
    readTime: '4 min read',
    icon: TrendingUp,
    content: [
      {
        heading: 'Accurate pricing from application data',
        paragraphs: [
          'Planning application descriptions and documents give you information that helps you price accurately before you visit the site. A description like "replacement of 12 timber sash windows" tells you the quantity. A site plan shows you the property size. Use this information to estimate materials and labour.',
        ],
      },
      {
        heading: 'Building a detailed proposal',
        paragraphs: [
          'In the proposal editor, the Products & Services and Pricing sections let you add line items with descriptions, quantities, unit prices, and totals. The more detailed your line items, the more confidence the homeowner will have in your pricing.',
        ],
        type: 'steps',
        steps: [
          'Open the proposal editor from a lead.',
          'In the Products & Services section, add a line item for each element of work.',
          'Enter the quantity and unit price for each item.',
          'The total is calculated automatically.',
          'Review the live preview to see the final document.',
        ],
      },
      {
        heading: 'VAT handling',
        paragraphs: [
          'If you are VAT registered, enter your VAT number in Settings > Company. The proposal will automatically add VAT at 20% to the subtotal and show the grand total. If you are not VAT registered, leave the field blank and no VAT will be added.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'warning',
        paragraphs: [
          'Do not underprice to win the job. A proposal that is too low wins the contract but loses money. Use the application data to price accurately — it is better to lose a job on price than to win it and lose money.',
        ],
      },
      {
        heading: 'Tracking pipeline value',
        paragraphs: [
          'The pipeline summary shows your total pipeline value — the sum of all active lead estimated values. This helps you understand your potential revenue and whether you have enough opportunities in the pipeline to meet your targets.',
        ],
      },
      {
        heading: 'Pricing for the relationship',
        paragraphs: [
          'When you find a job through a planning application, you are often the first contractor to contact the homeowner. Consider pricing your first proposal competitively to win the work and establish trust — then look for follow-on work on the same property.',
        ],
      },
    ],
  },
  {
    slug: 'scaling-your-business-with-enterprise-plans',
    title: 'Scaling Your Business with Enterprise Plans',
    excerpt: 'Grow from one council to nationwide coverage as your pipeline grows.',
    category: 'Advanced',
    date: '2026-04-20',
    displayDate: 'Apr 2026',
    readTime: '4 min read',
    icon: Users,
    content: [
      {
        heading: 'When to upgrade',
        paragraphs: [
          'As your business grows, you will need more council coverage and more proposals per month. PlanningIndex plans scale with you: Local for solo tradespeople, Regional for growing businesses, National for established companies, and Enterprise for large organisations.',
        ],
      },
      {
        heading: 'Growing your coverage',
        paragraphs: [
          'Start with the councils where you actually work, then expand as your pipeline fills. The Regional plan covers up to 10 councils — ideal for a business serving a county or city region. National covers every council in the UK, so you can follow opportunities wherever they appear.',
        ],
      },
      {
        heading: 'Keeping the pipeline moving',
        paragraphs: [
          'As volume grows, the pipeline becomes more important than the search. Review your Pipeline page every morning: move leads through stages, schedule follow-ups, and archive anything that has gone cold so the board stays focused on live opportunities.',
        ],
      },
      {
        heading: 'Activity feed',
        paragraphs: [
          'The Activity page shows a timeline of every action across your workspace — leads added, status changes, proposals created and sent, follow-ups scheduled. It is the quickest way to see what has happened since you last logged in.',
        ],
      },
      {
        heading: 'Upgrading your plan',
        paragraphs: [
          'Go to Settings > Billing to upgrade your plan. Changes take effect at the start of your next billing period. You can upgrade from Local to Regional, Regional to National, or contact sales for an Enterprise plan tailored to your needs.',
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}

export function getGuidesByCategory(category: Guide['category']): Guide[] {
  return guides.filter((g) => g.category === category);
}
