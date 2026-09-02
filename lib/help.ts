export interface HelpSection {
  heading?: string;
  paragraphs: string[];
  type?: 'text' | 'steps' | 'list' | 'callout';
  steps?: string[];
  items?: string[];
  calloutType?: 'tip' | 'warning' | 'info';
}

export interface HelpArticle {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  excerpt: string;
  lastUpdated: string;
  content: HelpSection[];
}

export interface HelpCategory {
  slug: string;
  name: string;
  description: string;
  articles: HelpArticle[];
}

export const helpCategories: HelpCategory[] = [
  {
    slug: 'getting-started',
    name: 'Getting Started',
    description: 'Learn how to set up your account, run your first search, and find your first planning application.',
    articles: [
      {
        slug: 'creating-your-account',
        title: 'Creating Your PlanningIndex Account',
        category: 'Getting Started',
        categorySlug: 'getting-started',
        excerpt: 'How to sign up, choose your plan, and set up your company profile.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Signing up',
            paragraphs: [
              'To create your PlanningIndex account, click "Get Started" on the homepage or any marketing page. You will be taken to the registration page where you can enter your details and choose a plan.',
              'Every plan comes with a 14-day free trial. No credit card is required to start. You will have full access to all features during the trial period.',
            ],
          },
          {
            heading: 'Choosing your plan',
            paragraphs: [
              'PlanningIndex offers four plans: Local, Regional, National, and Enterprise. The main difference between plans is the number of councils you can search and the number of team members you can add.',
              'Start with the plan that matches your operating area. You can upgrade, downgrade, or cancel at any time from your billing settings.',
            ],
            type: 'list',
            items: [
              'Local: 1 council, 1 team member — for solo tradespeople covering a single area.',
              'Regional: Up to 10 councils, 3 team members — for growing businesses.',
              'National: All councils, 10 team members — for established companies.',
              'Enterprise: All councils, unlimited members — for large organisations.',
            ],
          },
          {
            heading: 'Setting up your company profile',
            paragraphs: [
              'After signing up, go to Settings > Company to set up your company profile. Enter your company name, address, phone number, email, and website.',
              'Your company profile information automatically appears in every proposal you create, so it is important to fill it in accurately. You can also upload your company logo, which will appear on your proposals.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'Complete your company profile before creating your first proposal. The information you enter will save you time on every proposal you send.',
            ],
          },
        ],
      },
      {
        slug: 'running-your-first-search',
        title: 'Running Your First Planning Search',
        category: 'Getting Started',
        categorySlug: 'getting-started',
        excerpt: 'How to search for planning applications using keywords, location, and filters.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Opening the search page',
            paragraphs: [
              'From your workspace dashboard, click "Planning Applications" in the sidebar. This opens the Planning Search page, where you can search across all planning applications in your subscribed councils.',
            ],
          },
          {
            heading: 'Entering your search criteria',
            paragraphs: [
              'The search form has several fields you can use to find relevant applications. You do not need to fill in every field — start with keyword and location, then refine with additional filters if needed.',
            ],
            type: 'steps',
            steps: [
              'Enter a keyword in the keyword field — for example, "windows", "extension", or "loft conversion".',
              'Enter a location — a town name, postcode, or place name.',
              'Set a radius — how far from your location you want to search.',
              'Optionally, set application type, status, date range, or council filters.',
              'Click "Search" to see your results.',
            ],
          },
          {
            heading: 'Understanding your results',
            paragraphs: [
              'Your search results will show the total number of applications found, along with a list of result cards. Each card shows the application title, reference number, address, council, date received, and status.',
              'Click any result to open the full application details page, where you can see the description, documents, location map, and CRM actions.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'Save your search after running it. Saved searches are automatically updated with new applications as they are submitted, so you never need to run the same search manually twice.',
            ],
          },
        ],
      },
      {
        slug: 'understanding-application-statuses',
        title: 'Understanding Application Statuses',
        category: 'Getting Started',
        categorySlug: 'getting-started',
        excerpt: 'What each planning application status means and which ones to focus on.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Why status matters',
            paragraphs: [
              'Planning applications go through several stages from submission to decision. Understanding these stages helps you focus on applications that are most likely to result in actual construction work.',
            ],
          },
          {
            heading: 'Common statuses explained',
            paragraphs: [
              'Here are the most common planning application statuses you will see in PlanningIndex:',
            ],
            type: 'list',
            items: [
              'Pending: The application has been submitted and is awaiting review by the planning officer.',
              'Validated: The council has confirmed the application is complete and valid. This is a good time to reach out.',
              'Approved: The application has been granted planning permission. The homeowner can now proceed. This is the best time to send a proposal.',
              'Refused: The application has been refused. The homeowner may appeal or resubmit.',
              'Withdrawn: The application has been withdrawn by the applicant. They may resubmit a modified version later.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'Focus on validated and approved applications. These are the most likely to result in construction work.',
            ],
          },
          {
            heading: 'Using status as a filter',
            paragraphs: [
              'In the Planning Search page, use the status filter to narrow your results. If you only want to see applications that have been approved, set the status filter to "Approved". If you want to catch opportunities early, set it to "Validated" or "Pending".',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'planning-search',
    name: 'Planning Search',
    description: 'Master the search tools — keywords, filters, saved searches, and map view.',
    articles: [
      {
        slug: 'using-keyword-search',
        title: 'Using Keyword Search Effectively',
        category: 'Planning Search',
        categorySlug: 'planning-search',
        excerpt: 'How to choose the right keywords to find applications relevant to your trade.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'How keyword search works',
            paragraphs: [
              'The keyword search in PlanningIndex searches across the description field of every planning application in your subscribed councils. When you enter a keyword, PlanningIndex returns all applications whose description contains that word or phrase.',
              'You can enter multiple keywords separated by commas. PlanningIndex will return applications that match any of the keywords — so more keywords means more results, not fewer.',
            ],
          },
          {
            heading: 'Choosing effective keywords',
            paragraphs: [
              'The best keywords are specific terms that appear in planning applications for your type of work. Generic terms like "building" or "house" will return too many irrelevant results. Specific terms like "timber sash windows" or "single-storey rear extension" will return fewer but more relevant results.',
            ],
            type: 'list',
            items: [
              'Be specific: "replacement windows" is better than "windows".',
              'Use trade terms: "hip to gable" will find loft conversions that a general search might miss.',
              'Use multiple keywords: "replacement windows, double glazing, timber sash" catches more variations.',
              'Check your results: if you are seeing irrelevant results, try more specific keywords.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'Start with one specific keyword and review your results. If you are missing relevant applications, add more keywords. If you are seeing too many irrelevant results, use more specific terms.',
            ],
          },
        ],
      },
      {
        slug: 'saving-and-managing-searches',
        title: 'Saving and Managing Searches',
        category: 'Planning Search',
        categorySlug: 'planning-search',
        excerpt: 'How to save your search configurations and let PlanningIndex monitor for new applications.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Why save searches',
            paragraphs: [
              'Saved searches are one of the most powerful features in PlanningIndex. When you save a search, PlanningIndex keeps it running in the background and automatically adds new matching applications to your results as they are submitted.',
              'This means you do not need to manually search every day. Set up your saved searches once, and PlanningIndex monitors for you.',
            ],
          },
          {
            heading: 'How to save a search',
            paragraphs: [
              'After running a search, click the "Save Search" button at the top of the results. Give your search a name — something that helps you remember what it is for, like "Loft conversions in Amersham" or "Window replacements within 15 miles."',
            ],
            type: 'steps',
            steps: [
              'Configure your search with keywords, location, radius, and filters.',
              'Run the search to see your results.',
              'Click "Save Search" at the top of the results.',
              'Give your search a descriptive name.',
              'Click "Save".',
            ],
          },
          {
            heading: 'Managing saved searches',
            paragraphs: [
              'To view, edit, or delete your saved searches, go to "Saved Searches" in the sidebar. You will see a list of all your saved searches, with the number of results for each one. Click any saved search to run it and see the latest results.',
              'To edit a saved search, open it and modify the search criteria, then save it again. To delete a saved search, click the delete icon next to it.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'Create separate saved searches for different trades or different areas. This gives you a clearer picture of each segment of your market.',
            ],
          },
        ],
      },
      {
        slug: 'using-map-view',
        title: 'Using Map View',
        category: 'Planning Search',
        categorySlug: 'planning-search',
        excerpt: 'How to use the interactive map to search geographically and find clusters of activity.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Switching to map view',
            paragraphs: [
              'After running a search, click the "Map" toggle at the top of the results to switch from list view to map view. The map shows all your search results as markers, plotted at their property locations.',
            ],
          },
          {
            heading: 'Interacting with the map',
            paragraphs: [
              'You can pan the map by clicking and dragging, and zoom using the controls in the top-right corner or your mouse wheel. Each marker represents a single planning application. Markers are colour-coded by application type or status.',
              'Click any marker to see a summary of the application. From the summary, you can open the full details or add the application to your leads.',
            ],
          },
          {
            heading: 'Radius search on the map',
            paragraphs: [
              'When you set a location and radius in the search form, the map will display a circle showing your search area. All applications within that circle are included in your results. Adjust the radius to expand or narrow your search area.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'Look for clusters of markers. A cluster of applications in one area may indicate a neighbourhood undergoing renovation — a concentration of opportunity worth targeting.',
            ],
          },
        ],
      },
      {
        slug: 'filtering-by-application-type',
        title: 'Filtering by Application Type and Status',
        category: 'Planning Search',
        categorySlug: 'planning-search',
        excerpt: 'How to use application type, status, date, and council filters to narrow your results.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Available filters',
            paragraphs: [
              'PlanningIndex offers several filters beyond keyword and location. These help you narrow your results to the most relevant applications.',
            ],
            type: 'list',
            items: [
              'Application type: Householder, Commercial, New Build, Outline, etc.',
              'Status: Pending, Validated, Approved, Refused, Withdrawn.',
              'Date received: Last 7 days, Last 30 days, Last 90 days, Custom range.',
              'Council: Filter by specific councils within your subscription.',
            ],
          },
          {
            heading: 'Combining filters',
            paragraphs: [
              'You can combine multiple filters to create very specific searches. For example, you could search for "extension" applications of type "Householder" with status "Approved" received in the "Last 30 days" within 15 miles of your location. This would give you recently approved extension applications — the most likely to result in immediate construction work.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'The more filters you apply, the fewer results you will get. If your search returns too few results, try removing one filter at a time to broaden your search.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'applications',
    name: 'Applications',
    description: 'Everything about viewing, understanding, and acting on individual planning applications.',
    articles: [
      {
        slug: 'viewing-application-details',
        title: 'Viewing Application Details',
        category: 'Applications',
        categorySlug: 'applications',
        excerpt: 'How to read and understand all the information on an application detail page.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Opening an application',
            paragraphs: [
              'Click any application in your search results to open the full application detail page. This page contains all the information PlanningIndex has about the application, including the description, property details, council information, documents, and location map.',
            ],
          },
          {
            heading: 'What you will find on the detail page',
            paragraphs: [
              'The application detail page is organised into several sections:',
            ],
            type: 'list',
            items: [
              'Header: Application title, reference number, and status badge.',
              'Details: Address, received date, council, application type, decision, and ward.',
              'Description: The full planning application description as submitted.',
              'Location: An interactive map showing the property location.',
              'Documents: Links to planning documents, drawings, and supporting information.',
              'CRM Actions: Buttons to add the application to your leads or create a proposal.',
            ],
          },
          {
            heading: 'Using the information',
            paragraphs: [
              'The detail page gives you everything you need to assess whether an application is worth pursuing. Read the description carefully — it tells you exactly what work is being proposed. Check the documents for site plans and drawings that give you more detail about the scope of work.',
              'If the application is relevant to your trade, use the CRM actions at the bottom to add it to your leads or create a proposal directly from the application data.',
            ],
          },
        ],
      },
      {
        slug: 'downloading-documents',
        title: 'Downloading Application Documents',
        category: 'Applications',
        categorySlug: 'applications',
        excerpt: 'How to access planning documents, drawings, and supporting information.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Where to find documents',
            paragraphs: [
              'On the application detail page, scroll to the Documents section. Here you will find links to all the documents that were submitted with the planning application. These typically include the application form, site location plan, existing and proposed floor plans, elevation drawings, and supporting statements.',
            ],
          },
          {
            heading: 'Types of documents',
            paragraphs: [
              'Different documents serve different purposes in assessing the opportunity:',
            ],
            type: 'list',
            items: [
              'Site location plan: Shows the property location and surrounding area.',
              'Block plan: Shows the property boundaries and proposed works in context.',
              'Floor plans: Show the internal layout before and after the proposed work.',
              'Elevation drawings: Show the external appearance of the proposed work.',
              'Design statement: Explains the rationale for the proposed work.',
              'Supporting documents: May include structural calculations or heritage statements.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'Review the documents before visiting the property or creating a proposal. The plans and drawings will give you a much clearer picture of the scope of work than the description alone.',
            ],
          },
        ],
      },
      {
        slug: 'application-intelligence',
        title: 'Understanding Application Intelligence',
        category: 'Applications',
        categorySlug: 'applications',
        excerpt: 'How PlanningIndex identifies and highlights relevant work within applications.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'What is application intelligence',
            paragraphs: [
              'Application intelligence is a PlanningIndex feature that analyses the description and documents of a planning application to identify specific types of work being proposed. It highlights quantities, materials, and trade-relevant information so you can quickly assess whether an application is worth pursuing.',
            ],
          },
          {
            heading: 'How it works',
            paragraphs: [
              'When you open an application detail page, PlanningIndex displays an intelligence panel if relevant work has been identified. This panel shows items like the number of windows being replaced, the area of roof being re-covered, or the dimensions of an extension. It also suggests the trade that the work is most relevant to.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'Application intelligence helps you quickly decide whether an application is relevant to your trade, without needing to read every word of the description or download every document.',
            ],
          },
          {
            heading: 'Using intelligence to prioritise',
            paragraphs: [
              'When you have a large number of search results, use the intelligence panel to quickly prioritise. An application that identifies "12 timber sash windows" is a more substantial window contract than one that identifies "2 replacement windows." Focus your time on the applications with the most relevant and substantial work.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'crm',
    name: 'Leads & CRM',
    description: 'Everything about managing leads, your pipeline, contacts, notes, and follow-ups.',
    articles: [
      {
        slug: 'adding-applications-to-leads',
        title: 'Adding Applications to Your Leads',
        category: 'Leads & CRM',
        categorySlug: 'crm',
        excerpt: 'How to turn planning applications into managed leads in your CRM pipeline.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Adding a lead',
            paragraphs: [
              'When you find a planning application you want to pursue, click "Add to Leads" on the application detail page. PlanningIndex will create a new lead in your CRM pipeline, automatically populated with the property address, planning reference, and application details.',
              'You do not need to manually enter any information — the lead is created from the application data, saving you time and ensuring accuracy.',
            ],
          },
          {
            heading: 'What happens when you add a lead',
            paragraphs: [
              'The new lead appears in your CRM pipeline at the "New" stage. It includes the property address, planning reference, application description, and a link back to the original application. You can then add contact information, notes, and follow-up dates.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'Add applications to your leads as soon as you identify them as relevant. Even if you are not ready to contact the homeowner yet, having them in your pipeline means they will not be forgotten.',
            ],
          },
          {
            heading: 'Adding contact information',
            paragraphs: [
              'After adding a lead, you can add contact information — the applicant name, phone number, and email. This information may be available on the planning application itself, or you may need to research it separately. Add it to the lead so you have everything in one place when you are ready to reach out.',
            ],
          },
        ],
      },
      {
        slug: 'managing-your-pipeline',
        title: 'Managing Your Pipeline',
        category: 'Leads & CRM',
        categorySlug: 'crm',
        excerpt: 'How to use the Kanban pipeline to move leads through stages and track progress.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Pipeline stages',
            paragraphs: [
              'The PlanningIndex CRM pipeline has five stages that represent the journey from finding an opportunity to winning the work:',
            ],
            type: 'list',
            items: [
              'New: The lead has been added but no contact has been made yet.',
              'Contacted: You have reached out to the homeowner — by phone, email, or post.',
              'Proposal Sent: You have created and sent a proposal to the homeowner.',
              'Follow Up: You have sent a proposal and are waiting for a response or following up.',
              'Won: The homeowner has accepted your proposal and you have a signed contract.',
            ],
          },
          {
            heading: 'Moving leads between stages',
            paragraphs: [
              'In the pipeline view, leads are displayed as cards in columns, one for each stage. To move a lead from one stage to the next, simply drag the card from one column to another. You can also move a lead by opening it and changing its status from the detail page.',
              'The pipeline also supports a "Lost" status for leads that do not result in work. Marking a lead as Lost rather than deleting it helps you track your win rate over time.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'The pipeline summary bar shows your total pipeline value, win rate, and number of active leads. These metrics update automatically as you move leads between stages.',
            ],
          },
        ],
      },
      {
        slug: 'adding-notes-and-follow-ups',
        title: 'Adding Notes and Follow-Ups',
        category: 'Leads & CRM',
        categorySlug: 'crm',
        excerpt: 'How to keep track of conversations, set reminders, and never miss a follow-up.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Adding notes',
            paragraphs: [
              'Open any lead in your pipeline to see the lead detail page. Here you can add notes — record conversations with the homeowner, details about the project, quotes you have discussed, or any other information you need to remember.',
              'Notes are timestamped and displayed in chronological order, creating a complete history of your interactions with each lead.',
            ],
          },
          {
            heading: 'Setting follow-up reminders',
            paragraphs: [
              'On the lead detail page, you can set a follow-up date. This is a reminder to contact the homeowner again on a specific date. Follow-up dates appear on your dashboard and in your pipeline, so you always know which leads need attention.',
            ],
            type: 'steps',
            steps: [
              'Open the lead you want to add a follow-up to.',
              'Click "Set Follow-Up" in the Next Action section.',
              'Choose a date for the follow-up.',
              'Add a note about why you are following up.',
              'Click "Save".',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'Set a follow-up date for every lead after you make contact. A well-timed follow-up is often the difference between winning and losing a job.',
            ],
          },
        ],
      },
      {
        slug: 'tracking-lead-activity',
        title: 'Tracking Lead Activity',
        category: 'Leads & CRM',
        categorySlug: 'crm',
        excerpt: 'How to use the activity history to see the full timeline of every lead.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'The activity timeline',
            paragraphs: [
              'Every lead in PlanningIndex has an activity timeline that records every action taken on that lead. This includes when the lead was added, when notes were created, when the status changed, when proposals were sent, and when follow-ups were set.',
              'The timeline gives you a complete history of your relationship with each lead, so you can see at a glance what has happened and what needs to happen next.',
            ],
          },
          {
            heading: 'Why activity tracking matters',
            paragraphs: [
              'When you are managing multiple leads, it is easy to forget what you have done and what you have not. The activity timeline prevents this by showing you exactly what has happened on each lead and when. If you have a lead that has been sitting in "Contacted" for three weeks, the timeline will show you when you last made contact, so you know it is time to follow up.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'proposals',
    name: 'Proposals',
    description: 'Learn how to create, edit, send, and track professional proposals.',
    articles: [
      {
        slug: 'creating-a-proposal',
        title: 'Creating a Proposal',
        category: 'Proposals',
        categorySlug: 'proposals',
        excerpt: 'How to generate a professional proposal from a planning application or lead.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Starting a proposal',
            paragraphs: [
              'You can create a proposal from two places: the application detail page or the lead detail page. Click "Create Proposal" and PlanningIndex will open the proposal builder with the property address, planning reference, and project description automatically populated from the application data.',
            ],
          },
          {
            heading: 'Filling in the proposal',
            paragraphs: [
              'The proposal builder has several sections for you to complete:',
            ],
            type: 'list',
            items: [
              'Recipient: The homeowner name and property address (auto-populated).',
              'Planning reference: The application reference number (auto-populated).',
              'Project: A brief description of the project (auto-populated, editable).',
              'Introduction: A personal message to the homeowner.',
              'Scope of works: A detailed list of the work you are proposing, with quantities and pricing.',
              'Terms: Your payment terms, warranty, and conditions.',
              'Contact information: Your company details (auto-populated from your company profile).',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'The more detailed your scope of works, the more professional your proposal looks. List each item of work separately with a clear description, quantity, and price.',
            ],
          },
          {
            heading: 'Using templates',
            paragraphs: [
              'If you frequently create proposals for the same type of work, you can save a proposal as a template. Templates pre-fill the scope of works, terms, and introduction, so you only need to adjust the pricing and details specific to each job.',
              'PlanningIndex includes several built-in templates for common trades — window replacement, roofing, extensions, and general building works. You can also create your own custom templates.',
            ],
          },
        ],
      },
      {
        slug: 'previewing-your-proposal',
        title: 'Previewing Your Proposal',
        category: 'Proposals',
        categorySlug: 'proposals',
        excerpt: 'How to use the live preview to review your proposal before sending.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'The live preview',
            paragraphs: [
              'As you fill in the proposal builder, the live preview on the right side of the screen updates in real time. The preview shows exactly how your proposal will look when printed and posted — including your company letterhead, the recipient address, the scope of works table, the total price, and the signature area.',
            ],
          },
          {
            heading: 'What to check in the preview',
            paragraphs: [
              'Before sending your proposal, review the preview carefully:',
            ],
            type: 'list',
            items: [
              'Check the recipient name and address are correct.',
              'Verify the planning reference matches the application.',
              'Review the scope of works for accuracy and completeness.',
              'Check the pricing and total are correct.',
              'Ensure your company information and logo appear correctly.',
              'Read through the introduction and terms for any errors.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'warning',
            paragraphs: [
              'Once you send a proposal by post, you cannot recall it. Always review the preview carefully before sending.',
            ],
          },
        ],
      },
      {
        slug: 'sending-by-post',
        title: 'Sending Proposals by Post',
        category: 'Proposals',
        categorySlug: 'proposals',
        excerpt: 'How to send your proposal as a physical letter to the property.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'How postal sending works',
            paragraphs: [
              'When you click "Send by Post," PlanningIndex takes your proposal, prints it as a professional document, places it in an envelope, and posts it directly to the property address. You do not need to print, envelope, or post anything yourself.',
              'The postal service is fully integrated — you do not need a separate account with a mailing provider. The cost of postage is included in your plan, up to your monthly limit.',
            ],
          },
          {
            heading: 'Confirming the address',
            paragraphs: [
              'Before sending, PlanningIndex will ask you to confirm the recipient address. This is the address from the planning application. If you have updated the address on the lead, the updated address will be used. Always check the address is correct before confirming.',
            ],
            type: 'steps',
            steps: [
              'Review your proposal in the live preview.',
              'Click "Send by Post".',
              'Confirm the recipient name and address.',
              'Click "Confirm and Send".',
              'PlanningIndex will print, pack, and post your proposal.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'Your monthly postal allowance depends on your plan: Local does not include postal sending, Regional includes 10 per month, National includes 50 per month, and Enterprise includes unlimited.',
            ],
          },
        ],
      },
      {
        slug: 'tracking-proposal-status',
        title: 'Tracking Proposal Status',
        category: 'Proposals',
        categorySlug: 'proposals',
        excerpt: 'How to check the delivery status of your posted proposals.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Proposal statuses',
            paragraphs: [
              'Every proposal you send has a status that tells you where it is in the delivery process:',
            ],
            type: 'list',
            items: [
              'Draft: The proposal has been created but not yet sent.',
              'Ready: The proposal has been reviewed and is ready to send.',
              'Sent: The proposal has been submitted for postal delivery.',
              'Processing: The proposal is being printed and prepared for posting.',
              'Mailed: The proposal has been posted and is in the postal system.',
              'Delivered: The proposal has been delivered to the property.',
              'Delivery issue: There was a problem with the delivery.',
              'Undeliverable: The proposal could not be delivered.',
            ],
          },
          {
            heading: 'Where to find your proposals',
            paragraphs: [
              'All your proposals are listed in the Proposals section of your workspace. You can filter by status to see, for example, all proposals that have been mailed but not yet delivered, or all drafts that have not been sent.',
              'Each proposal in the list shows the recipient, the lead it is connected to, the date created, the date sent, and the current status. Click any proposal to see more details, including tracking information for posted proposals.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'account',
    name: 'Account',
    description: 'Manage your profile, company information, preferences, and security.',
    articles: [
      {
        slug: 'updating-your-profile',
        title: 'Updating Your Profile',
        category: 'Account',
        categorySlug: 'account',
        excerpt: 'How to update your personal information and company details.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Personal profile',
            paragraphs: [
              'Go to Settings > Profile to update your personal information — your name, email address, and password. Your email address is used for login and for receiving notifications about your saved searches and leads.',
            ],
          },
          {
            heading: 'Company profile',
            paragraphs: [
              'Go to Settings > Company to update your company information. This includes your company name, address, phone number, email, website, and logo.',
              'Your company profile information automatically appears in every proposal you create. Keeping it up to date ensures your proposals always show the correct company details.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'Upload your company logo in Settings > Company. Your logo will appear on the letterhead of every proposal you send by post, giving them a professional, branded appearance.',
            ],
          },
        ],
      },
      {
        slug: 'managing-notifications',
        title: 'Managing Notifications',
        category: 'Account',
        categorySlug: 'account',
        excerpt: 'How to control email notifications for new applications and lead activity.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Notification types',
            paragraphs: [
              'PlanningIndex can send you email notifications for several types of activity:',
            ],
            type: 'list',
            items: [
              'New applications matching your saved searches.',
              'Status changes on applications in your leads.',
              'Proposal delivery updates.',
              'Follow-up reminders.',
              'Team activity (if you have team members).',
            ],
          },
          {
            heading: 'Configuring notifications',
            paragraphs: [
              'Go to Settings > Notifications to choose which notifications you want to receive. You can turn each notification type on or off independently. You can also choose to receive a daily or weekly digest email summarising all activity, rather than individual emails for each event.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'We recommend keeping new application notifications on so you never miss an opportunity. You can always adjust other notifications based on your preferences.',
            ],
          },
        ],
      },
      {
        slug: 'security-and-password',
        title: 'Security and Password Management',
        category: 'Account',
        categorySlug: 'account',
        excerpt: 'How to change your password and keep your account secure.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Changing your password',
            paragraphs: [
              'Go to Settings > Security to change your password. Enter your current password and your new password, then click "Update Password." Choose a strong password that is at least 8 characters long and includes a mix of letters, numbers, and symbols.',
            ],
          },
          {
            heading: 'Keeping your account secure',
            paragraphs: [
              'Your PlanningIndex account contains your business data — leads, proposals, and customer information. Keep it secure by using a strong, unique password and not sharing your login details with anyone.',
              'If you have team members, each person should have their own account with their own login. Do not share a single account between multiple users.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'billing',
    name: 'Billing',
    description: 'Information about pricing, plans, upgrading, downgrading, and billing.',
    articles: [
      {
        slug: 'understanding-plans-and-coverage',
        title: 'Understanding Plans and Coverage',
        category: 'Billing',
        categorySlug: 'billing',
        excerpt: 'What each plan includes and how council coverage works.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Plan overview',
            paragraphs: [
              'PlanningIndex plans are based on two factors: the number of councils you can search and the number of team members you can add. All plans include the full PlanningIndex feature set — the difference is coverage and team size.',
            ],
            type: 'list',
            items: [
              'Local: 1 council, 1 team member. Best for solo tradespeople covering a single area.',
              'Regional: Up to 10 councils, 3 team members. Best for growing businesses.',
              'National: All councils, 10 team members. Best for established companies.',
              'Enterprise: All councils, unlimited team members. For large organisations.',
            ],
          },
          {
            heading: 'Council coverage',
            paragraphs: [
              'Your plan determines how many councils you can search. On the Local plan, you choose one council. On the Regional plan, you choose up to 10 councils. On the National and Enterprise plans, you have access to all councils across the UK.',
              'You can change your selected councils at any time from Settings > Billing. If you need to search a council that is not in your current plan, you will need to upgrade.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'Not sure which plan is right for you? Start with a free trial and explore the features. You can choose your plan after the trial ends.',
            ],
          },
        ],
      },
      {
        slug: 'upgrading-and-downgrading',
        title: 'Upgrading and Downgrading Your Plan',
        category: 'Billing',
        categorySlug: 'billing',
        excerpt: 'How to change your plan, add or remove councils, and what happens to your data.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Upgrading your plan',
            paragraphs: [
              'You can upgrade your plan at any time from Settings > Billing. Click "Manage Subscription" and choose the plan you want to upgrade to. The upgrade takes effect immediately, and we prorate the difference in cost — you only pay for the remaining time in your billing period.',
            ],
          },
          {
            heading: 'Downgrading your plan',
            paragraphs: [
              'You can downgrade your plan at any time. The downgrade will take effect at the start of your next billing period, so you continue to have full access until then. If you are downgrading to a plan with fewer councils, you will need to choose which councils to keep.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'warning',
            paragraphs: [
              'If you downgrade to a plan with fewer team members, you will need to remove team members before the downgrade takes effect. Plan ahead to avoid disruption.',
            ],
          },
          {
            heading: 'Cancelling your subscription',
            paragraphs: [
              'You can cancel your subscription at any time from Settings > Billing. Cancellation takes effect at the end of your current billing period. Your data is retained for 90 days after cancellation, so you can resubscribe and pick up where you left off.',
            ],
          },
        ],
      },
      {
        slug: 'viewing-payment-history',
        title: 'Viewing Payment History',
        category: 'Billing',
        categorySlug: 'billing',
        excerpt: 'How to view your past invoices and payment history.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Payment history',
            paragraphs: [
              'Go to Settings > Billing to view your payment history. You will see a list of all past payments, including the date, amount, plan, and billing period. You can download invoices for your records or for accounting purposes.',
            ],
          },
          {
            heading: 'Updating payment method',
            paragraphs: [
              'You can update your payment method at any time from Settings > Billing. Click "Update Payment Method" and enter your new card details. Your next payment will be charged to the new card.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'teams',
    name: 'Teams',
    description: 'Learn how to add team members, share leads, and manage permissions.',
    articles: [
      {
        slug: 'inviting-team-members',
        title: 'Inviting Team Members',
        category: 'Teams',
        categorySlug: 'teams',
        excerpt: 'How to add users to your team and assign roles.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Adding team members',
            paragraphs: [
              'Go to the Team section of your workspace and click "Invite Member." Enter the person\'s name and email address, and choose their role. They will receive an email invitation to join your team.',
              'When they accept the invitation, they will have their own login and will be able to access the shared workspace — leads, proposals, and applications — according to their role and permissions.',
            ],
          },
          {
            heading: 'Available roles',
            paragraphs: [
              'PlanningIndex supports several roles with different levels of access:',
            ],
            type: 'list',
            items: [
              'Owner: Full access to everything, including billing and team management.',
              'Admin: Full access to leads, proposals, and applications. Cannot manage billing.',
              'Sales: Can view and manage leads and proposals. Cannot change account settings.',
              'Estimator: Can view applications and create proposals. Cannot send proposals.',
              'Installer: Can view assigned jobs and related information. Limited access.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'The number of team members you can add depends on your plan. Local includes 1 member, Regional includes 3, National includes 10, and Enterprise includes unlimited.',
            ],
          },
        ],
      },
      {
        slug: 'sharing-leads-and-proposals',
        title: 'Sharing Leads and Proposals',
        category: 'Teams',
        categorySlug: 'teams',
        excerpt: 'How leads and proposals are shared across your team.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'Shared workspace',
            paragraphs: [
              'When you add team members, your workspace becomes shared. All leads, proposals, and saved searches are visible to all team members according to their role. This means everyone in your team can see the same pipeline, the same leads, and the same proposals.',
              'You do not need to manually share individual leads or proposals — they are all shared by default.',
            ],
          },
          {
            heading: 'Assigning leads',
            paragraphs: [
              'While leads are shared, you can assign individual leads to specific team members. This helps clarify who is responsible for each lead. On the lead detail page, use the "Assigned To" field to choose a team member.',
              'Assigned leads appear in the team member\'s dashboard and pipeline, making it clear what they need to work on.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'tip',
            paragraphs: [
              'Assign leads as soon as they are added to the pipeline. This prevents confusion about who is responsible for following up.',
            ],
          },
        ],
      },
      {
        slug: 'managing-permissions',
        title: 'Managing Team Permissions',
        category: 'Teams',
        categorySlug: 'teams',
        excerpt: 'How role-based permissions work and how to change a team member\'s role.',
        lastUpdated: 'August 2026',
        content: [
          {
            heading: 'How permissions work',
            paragraphs: [
              'Permissions in PlanningIndex are role-based. Each role has a defined set of permissions that control what the user can see and do. When you invite a team member, you choose their role. You can change their role at any time from the Team page.',
            ],
          },
          {
            heading: 'Changing a team member\'s role',
            paragraphs: [
              'Go to the Team page and click "Manage" next to the team member whose role you want to change. Select the new role from the dropdown and click "Save." The change takes effect immediately.',
            ],
          },
          {
            heading: 'Removing a team member',
            paragraphs: [
              'To remove a team member, go to the Team page and click "Remove" next to their name. They will lose access to the workspace immediately. Any leads assigned to them will become unassigned, and you can reassign them to other team members.',
            ],
          },
          {
            type: 'callout',
            calloutType: 'info',
            paragraphs: [
              'Permissions are enforced server-side, not just in the interface. A user with restricted permissions cannot access restricted data through any means — the backend rejects the request.',
            ],
          },
        ],
      },
    ],
  },
];

export function getAllHelpCategories(): HelpCategory[] {
  return helpCategories;
}

export function getHelpCategoryBySlug(slug: string): HelpCategory | undefined {
  return helpCategories.find((cat) => cat.slug === slug);
}

export function getHelpArticleBySlug(categorySlug: string, articleSlug: string): HelpArticle | undefined {
  const category = getHelpCategoryBySlug(categorySlug);
  if (!category) return undefined;
  return category.articles.find((article) => article.slug === articleSlug);
}

export function getRelatedHelpArticles(categorySlug: string, articleSlug: string, limit = 3): HelpArticle[] {
  const category = getHelpCategoryBySlug(categorySlug);
  if (!category) return [];
  return category.articles.filter((article) => article.slug !== articleSlug).slice(0, limit);
}

export function getPopularHelpArticles(limit = 6): HelpArticle[] {
  const popularSlugs = [
    { category: 'getting-started', article: 'running-your-first-search' },
    { category: 'planning-search', article: 'using-keyword-search' },
    { category: 'crm', article: 'adding-applications-to-leads' },
    { category: 'proposals', article: 'creating-a-proposal' },
    { category: 'proposals', article: 'sending-by-post' },
    { category: 'crm', article: 'managing-your-pipeline' },
  ];

  return popularSlugs
    .map(({ category, article }) => getHelpArticleBySlug(category, article))
    .filter((article): article is HelpArticle => article !== undefined)
    .slice(0, limit);
}

export function getAllHelpArticleSlugs(): { category: string; article: string }[] {
  return helpCategories.flatMap((category) =>
    category.articles.map((article) => ({
      category: category.slug,
      article: article.slug,
    }))
  );
}

export function getAllHelpCategorySlugs(): string[] {
  return helpCategories.map((cat) => cat.slug);
}
