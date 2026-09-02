export interface BlogSection {
  heading?: string;
  paragraphs: string[];
  type?: 'text' | 'callout' | 'steps' | 'list';
  steps?: string[];
  items?: string[];
  calloutType?: 'tip' | 'warning' | 'info';
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  displayDate: string;
  readTime: string;
  author: string;
  authorBio: string;
  tags: string[];
  image: string;
  imageAlt: string;
  content: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-find-loft-conversion-jobs',
    title: 'How to Find Loft Conversion Jobs in Your Area',
    excerpt: 'Learn how to use PlanningIndex filters to find loft conversion planning applications near you before your competitors do.',
    category: 'Guides',
    date: '2026-08-28',
    displayDate: '28 August 2026',
    readTime: '5 min read',
    author: 'PlanningIndex Team',
    authorBio: 'The PlanningIndex team helps UK construction professionals find and win work through planning application intelligence.',
    tags: ['loft conversion', 'planning applications', 'search filters', 'builders'],
    image: 'https://images.pexels.com/photos/8082327/pexels-photo-8082327.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Spacious loft room with skylights and natural light',
    content: [
      {
        heading: 'Why loft conversions are a goldmine for builders',
        paragraphs: [
          'Loft conversions are one of the most common types of householder planning application in the UK. Every week, hundreds of homeowners submit applications to convert their lofts into usable living space — and every one of those applications represents a potential contract for a builder or loft conversion specialist.',
          'The advantage of finding work through planning applications is timing. When a homeowner submits a loft conversion application, they are at the very start of their project journey. They have not yet hired a builder. They have not yet received quotes. They are planning, and they are looking for someone to do the work.',
          'If you can find those applications the day they go public, you can reach out to the homeowner before any of your competitors even know the project exists.',
        ],
      },
      {
        heading: 'Setting up your search in PlanningIndex',
        paragraphs: [
          'PlanningIndex makes it straightforward to find loft conversion applications. Start on the Planning Search page and use the keyword field to search for terms that commonly appear in loft conversion applications.',
        ],
        type: 'steps',
        steps: [
          'Open Planning Search from your workspace sidebar.',
          'In the keyword field, type "loft conversion" or "loft alteration".',
          'Set your location — enter your town, postcode, or operating area.',
          'Choose a radius. For loft conversions, 15 to 25 miles is a good starting point since most homeowners want a local contractor.',
          'Set the date filter to "Last 30 days" to catch recent applications.',
          'Click Search to see all matching applications.',
        ],
      },
      {
        heading: 'Keywords that find loft conversion work',
        paragraphs: [
          'Not every loft conversion application uses the exact phrase "loft conversion." Some use alternative descriptions. Try these keywords to catch applications you might otherwise miss:',
        ],
        type: 'list',
        items: [
          'Loft conversion',
          'Loft alteration',
          'Dormer window',
          'Rear dormer',
          'Hip to gable',
          'Velux windows',
          'Roof light installation',
          'Storey-and-a-half extension',
        ],
      },
      {
        heading: 'Filtering for quality leads',
        paragraphs: [
          'Once you have your search results, use the additional filters to narrow down to the most promising applications. Filter by status to focus on applications that have been validated by the council — these are more likely to proceed to construction.',
          'You can also filter by application type. Most loft conversions fall under "Householder" applications, so setting this filter will remove commercial and major development applications that are unlikely to be relevant.',
          'Pay attention to the application description. A description that mentions "rear dormer" or "hip to gable alteration" signals a substantial loft conversion project. A description that only mentions "roof lights" may be a smaller, simpler job.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Save your loft conversion search once you have it configured. PlanningIndex will keep it updated with new applications as they are submitted, so you never miss a new opportunity.',
        ],
      },
      {
        heading: 'Turning applications into leads',
        paragraphs: [
          'When you find a relevant loft conversion application, open it to review the full details. Check the description, the property address, and the documents. If the project looks like a good fit for your business, click "Add to Leads" to save it to your CRM pipeline.',
          'From there, you can add notes, set a follow-up date, and eventually create a proposal. The key advantage is speed — by the time other builders find out about this project, you have already made contact and sent a proposal.',
        ],
      },
      {
        heading: 'Start finding loft conversion jobs today',
        paragraphs: [
          'Loft conversions are a steady, reliable source of work for builders across the UK. With PlanningIndex, you can find these opportunities the day they appear and reach homeowners before your competitors. Set up your saved search today and start turning planning applications into paying jobs.',
        ],
      },
    ],
  },
  {
    slug: 'uk-planning-application-trends-2026',
    title: 'The State of UK Planning Applications in 2026',
    excerpt: 'Our analysis of planning application trends across the UK, including which regions are seeing the most growth and what it means for construction businesses.',
    category: 'Industry',
    date: '2026-08-20',
    displayDate: '20 August 2026',
    readTime: '7 min read',
    author: 'PlanningIndex Team',
    authorBio: 'The PlanningIndex team helps UK construction professionals find and win work through planning application intelligence.',
    tags: ['planning trends', 'UK construction', 'industry analysis', 'data'],
    image: 'https://images.pexels.com/photos/8148350/pexels-photo-8148350.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Aerial view of a suburban neighbourhood with houses and streets',
    content: [
      {
        heading: 'Planning applications: the early signal',
        paragraphs: [
          'Planning applications are the earliest publicly available signal that construction work is coming. Before a contractor is hired, before a tender goes out, and before a project appears on any lead-generation site, a planning application is submitted to the local council.',
          'Understanding the volume and distribution of planning applications across the UK gives construction businesses a strategic advantage. It tells you where work is being planned, what type of work is being proposed, and which regions are growing.',
        ],
      },
      {
        heading: 'Volume: applications are increasing',
        paragraphs: [
          'Across the UK, planning application volumes have been steadily increasing. More homeowners are investing in extensions, loft conversions, and property improvements. More developers are submitting applications for new dwellings. And more businesses are seeking planning permission for commercial alterations and expansions.',
          'For construction businesses, this means the opportunity pool is growing. But it also means competition is increasing. The businesses that win are the ones that find relevant applications first and act on them quickly.',
        ],
      },
      {
        heading: 'Regional trends: where the work is',
        paragraphs: [
          'Planning application volumes vary significantly by region. The South East and London consistently see the highest volumes of householder applications, driven by property values that justify significant investment in extensions and conversions.',
          'The North West and West Midlands are seeing strong growth in new build applications, particularly for small-scale residential developments. Scotland and Wales are seeing increased activity in both residential and commercial applications.',
          'For construction businesses, this means your location matters — but so does your willingness to travel. If you are based in an area with lower application volumes, expanding your radius can open up significantly more opportunities.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'info',
        paragraphs: [
          'PlanningIndex covers every council across the UK. You can search by region, by council, or by radius from a specific location — giving you complete visibility of where the work is, wherever you are based.',
        ],
      },
      {
        heading: 'Application types: what work is being proposed',
        paragraphs: [
          'Householder applications dominate the volume — these are the extensions, loft conversions, window replacements, and garage conversions that represent the bulk of work for tradespeople. Within householder applications, the most common types are:',
        ],
        type: 'list',
        items: [
          'Single-storey rear extensions',
          'Loft conversions with rear dormers',
          'Window and door replacements',
          'Garage conversions',
          'Two-storey side extensions',
          'Outbuildings and garden rooms',
        ],
      },
      {
        heading: 'What this means for your business',
        paragraphs: [
          'If you are a specialist — a window company, a roofing contractor, an extension builder — the trends tell you that there is more work in your specialism than ever before. The challenge is not finding work; it is finding the right work, early enough, and acting on it before your competitors.',
          'PlanningIndex is built to solve exactly that problem. By searching across every UK council from one place, filtering by your trade and area, and turning relevant applications into managed leads, you can stay ahead of the trends rather than chasing them.',
        ],
      },
      {
        heading: 'Using data to plan your strategy',
        paragraphs: [
          'Beyond finding individual jobs, planning application data can help you make strategic business decisions. If you notice a cluster of applications in a particular town or postcode, you might decide to focus your marketing there. If you see a trend toward a specific type of work, you might invest in training or equipment to capitalise on it.',
          'The businesses that use planning data strategically — not just to find individual jobs, but to understand their market — are the ones that grow fastest. PlanningIndex gives you the tools to do both.',
        ],
      },
    ],
  },
  {
    slug: 'win-more-roofing-contracts',
    title: '5 Ways to Win More Roofing Contracts This Year',
    excerpt: 'Practical strategies for roofing contractors to find more work, manage leads effectively, and close more deals using planning application data.',
    category: 'Business',
    date: '2026-07-15',
    displayDate: '15 July 2026',
    readTime: '6 min read',
    author: 'PlanningIndex Team',
    authorBio: 'The PlanningIndex team helps UK construction professionals find and win work through planning application intelligence.',
    tags: ['roofing', 'business strategy', 'leads', 'contracts'],
    image: 'https://images.pexels.com/photos/11467876/pexels-photo-11467876.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Construction workers installing roof tiles',
    content: [
      {
        heading: 'The roofing opportunity in planning data',
        paragraphs: [
          'Every roof replacement, roof extension, and dormer installation starts with a planning application. For roofing contractors, planning applications are one of the most reliable sources of upcoming work — but most roofers never look at them.',
          'By the time a roofing job appears on a lead-generation site or gets recommended through word of mouth, the homeowner has often already spoken to two or three other contractors. Planning applications give you a head start.',
        ],
      },
      {
        heading: '1. Search for roof-specific keywords',
        paragraphs: [
          'The most direct way to find roofing work is to search for keywords that appear in roofing planning applications. In PlanningIndex, use the keyword search to find applications mentioning roof work.',
        ],
        type: 'list',
        items: [
          'Roof replacement',
          'Re-roof',
          'Roof covering',
          'Tile replacement',
          'Slate roof',
          'Flat roof',
          'Dormer',
          'Roof alteration',
        ],
      },
      {
        heading: '2. Look for extension and conversion applications',
        paragraphs: [
          'Not all roofing work comes from applications that mention "roof" in the description. Extensions require roofing work — flat roofs for single-storey extensions, pitched roofs for two-storey extensions. Loft conversions require dormer construction and roof alterations.',
          'Search for "extension" and "loft conversion" applications in your area. Every one of these projects will need a roofer at some point. By identifying them at the planning stage, you can reach out to the homeowner or the main contractor early.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'When you find an extension application, check the documents for site plans and drawings. These often show the roof design and give you an idea of the scope of roofing work involved.',
        ],
      },
      {
        heading: '3. Track applications in your CRM',
        paragraphs: [
          'Finding applications is only the first step. To win the work, you need to follow up. Use the PlanningIndex CRM pipeline to track every roofing application you find. Move leads through stages — New, Contacted, Proposal Sent, Follow Up, Won — and never lose track of an opportunity.',
          'Set follow-up reminders for each lead. A homeowner who was not ready to hire a roofer when the application was submitted may be ready three months later when planning permission is granted. A well-timed follow-up can win you the job.',
        ],
      },
      {
        heading: '4. Send professional proposals by post',
        paragraphs: [
          'When you are ready to approach a homeowner, use the PlanningIndex proposal builder to create a professional, branded proposal. The property address and planning reference auto-populate from the application data, saving you time and ensuring accuracy.',
          'Send the proposal by physical post through PlanningIndex. A printed, posted proposal stands out far more than an email. It arrives at the property addressed to the homeowner, looking professional, and clearly connected to the planning application they submitted.',
        ],
      },
      {
        heading: '5. Build a pipeline of recurring work',
        paragraphs: [
          'The roofing contractors who win the most work are not the ones who find individual jobs — they are the ones who build a pipeline. By consistently searching planning applications, adding leads to your CRM, and following up systematically, you create a steady flow of opportunities rather than a feast-or-famine cycle.',
          'PlanningIndex is designed to support this workflow. Saved searches keep you updated with new applications. The CRM pipeline keeps your leads organised. The proposal builder makes it easy to act. And the postal sending service means you can reach homeowners without leaving your office.',
        ],
      },
      {
        heading: 'Start winning more roofing contracts',
        paragraphs: [
          'Roofing work is out there — in every council, every week, in the form of planning applications. The question is whether you will find it before your competitors do. Start searching with PlanningIndex today and turn planning data into roofing contracts.',
        ],
      },
    ],
  },
  {
    slug: 'planning-applications-best-lead-source',
    title: 'Why Planning Applications Are the Best Lead Source for Builders',
    excerpt: 'Planning applications give you a head start on every competitor. Here is why they matter and how to use them to find construction work.',
    category: 'Industry',
    date: '2026-07-08',
    displayDate: '8 July 2026',
    readTime: '6 min read',
    author: 'PlanningIndex Team',
    authorBio: 'The PlanningIndex team helps UK construction professionals find and win work through planning application intelligence.',
    tags: ['lead generation', 'planning applications', 'builders', 'construction leads'],
    image: 'https://images.pexels.com/photos/6615086/pexels-photo-6615086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Architectural blueprints with a compass',
    content: [
      {
        heading: 'The problem with traditional lead sources',
        paragraphs: [
          'Most builders find work through word of mouth, repeat customers, or lead-generation websites. Word of mouth is reliable but unpredictable — you cannot control when or whether someone will recommend you. Lead-generation sites sell the same lead to multiple contractors, meaning you are competing against four or five other businesses for every job.',
          'Neither source gives you an advantage. By the time you hear about a project through these channels, other contractors have already quoted. You are not first to the door — you are one of many.',
        ],
      },
      {
        heading: 'The planning application advantage',
        paragraphs: [
          'Planning applications solve both problems. They are public information, available to anyone, and they appear before any contractor has been hired. When a homeowner submits a planning application for a rear extension, they are at the start of their project. They have not yet spoken to a builder. They have not yet received quotes. They are planning.',
          'If you find that application the day it goes public, you can reach out to the homeowner immediately. You are not competing with four other contractors — you are the first and only builder to contact them. That is a fundamentally different position to be in.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'info',
        paragraphs: [
          'A planning application is submitted weeks or months before construction work begins. Finding it early means you can build a relationship with the homeowner while they are still in the planning stage — long before they start actively seeking quotes.',
        ],
      },
      {
        heading: 'What planning applications tell you',
        paragraphs: [
          'Every planning application contains valuable information that helps you assess the opportunity and prepare your approach:',
        ],
        type: 'list',
        items: [
          'The property address — so you know exactly where the work is.',
          'The description of proposed work — so you know what is being built.',
          'The application type — householder, commercial, new build, etc.',
          'The council and ward — so you know the local planning context.',
          'The received date and status — so you know how far along the application is.',
          'Supporting documents — site plans, drawings, and design statements.',
        ],
      },
      {
        heading: 'Why this is better than buying leads',
        paragraphs: [
          'When you buy a lead from a lead-generation site, you pay for contact details that have already been sold to other contractors. The homeowner is often overwhelmed by calls and quotes, and your chances of winning the work are diluted by competition.',
          'With planning applications, there is no lead fee. There is no competition from the same platform. You find the opportunity yourself, you reach out directly, and you are in control of the entire process. The only cost is your PlanningIndex subscription — which gives you access to every planning application in the UK.',
        ],
      },
      {
        heading: 'How to use planning applications effectively',
        paragraphs: [
          'Finding applications is just the start. To turn them into paying work, you need a system. Search consistently — daily or weekly — for applications that match your trade and area. Save your searches so PlanningIndex keeps them updated. Add relevant applications to your CRM pipeline as leads. Follow up systematically. And when the time is right, send a professional proposal.',
          'PlanningIndex is built to support this entire workflow. From search to CRM to proposal to postal delivery, every step is connected. You do not need separate tools for finding work, managing leads, and sending proposals — it is all in one place.',
        ],
      },
      {
        heading: 'The bottom line',
        paragraphs: [
          'Planning applications are the earliest, most reliable, and most cost-effective lead source available to UK construction businesses. They give you a head start, they cost less than buying leads, and they put you in control. If you are not using planning application data to find work, you are leaving opportunities on the table for your competitors to pick up.',
        ],
      },
    ],
  },
  {
    slug: 'price-jobs-competitively',
    title: 'How to Price Your Jobs Competitively',
    excerpt: 'A practical guide to using planning application data to build accurate quotes that win contracts without leaving money on the table.',
    category: 'Business',
    date: '2026-06-22',
    displayDate: '22 June 2026',
    readTime: '5 min read',
    author: 'PlanningIndex Team',
    authorBio: 'The PlanningIndex team helps UK construction professionals find and win work through planning application intelligence.',
    tags: ['pricing', 'quoting', 'business strategy', 'proposals'],
    image: 'https://images.pexels.com/photos/4963359/pexels-photo-4963359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Business handshake symbolising agreement',
    content: [
      {
        heading: 'Why pricing matters more than ever',
        paragraphs: [
          'Pricing a job correctly is one of the hardest parts of running a construction business. Price too high and you lose the work to a cheaper competitor. Price too low and you win the job but lose money on it. The key is pricing accurately — understanding the scope of work, the materials required, and the time involved, then pricing at a level that is competitive and profitable.',
          'Planning application data gives you an advantage here that most contractors do not have. When you find a job through a planning application, you have access to information that helps you assess the scope before you even visit the site.',
        ],
      },
      {
        heading: 'Use the application description to assess scope',
        paragraphs: [
          'The application description tells you what work is being proposed. A description like "single-storey rear extension measuring 6m x 4m" gives you the dimensions. A description like "replacement of 12 timber sash windows" tells you the quantity. This information helps you estimate materials and labour before you visit the property.',
          'Look for specific details in the description — measurements, quantities, materials mentioned, and the extent of the work. The more specific the description, the more accurately you can price the job.',
        ],
      },
      {
        heading: 'Check the documents for detailed information',
        paragraphs: [
          'Many planning applications include supporting documents — site plans, floor plans, elevation drawings, and design statements. These documents often contain far more detail than the application description itself.',
          'A site plan will show you the footprint of the proposed work. A floor plan will show you the internal layout. An elevation drawing will show you the external finishes. All of this information helps you build a more accurate quote.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Download and review the planning application documents before you visit the property. You will arrive already understanding the project, which saves time on site and demonstrates professionalism to the homeowner.',
        ],
      },
      {
        heading: 'Build your proposal from the application data',
        paragraphs: [
          'When you use the PlanningIndex proposal builder, the property address and planning reference auto-populate from the application. But you should also use the application data to inform the scope of works section of your proposal.',
          'List each item of work mentioned in the application description and documents. Add quantities, materials, and unit prices. The more detailed and specific your proposal, the more confidence the homeowner will have in your pricing.',
        ],
      },
      {
        heading: 'Price for the relationship, not just the job',
        paragraphs: [
          'When you find a job through a planning application, you are often the first contractor to contact the homeowner. That gives you an opportunity to build a relationship, not just quote for a single job. Consider pricing your first proposal competitively to win the work and establish trust — then look for additional work on the same property.',
          'Many planning applications are part of a larger project. A homeowner who is replacing windows this year may be planning an extension next year. A homeowner who is building an extension may need a roofer, a plumber, and an electrician. By pricing competitively and delivering well, you position yourself for the follow-on work.',
        ],
      },
      {
        heading: 'Use PlanningIndex to streamline the process',
        paragraphs: [
          'PlanningIndex connects the entire workflow — from finding the application to assessing the scope, building the proposal, and sending it by post. By using one platform for the whole process, you save time, reduce errors, and present a professional image to the homeowner from the very first contact.',
        ],
      },
    ],
  },
  {
    slug: 'from-application-to-signed-contract',
    title: 'From Planning Application to Signed Contract: A Case Study',
    excerpt: 'Follow a real PlanningIndex user from finding a planning application to winning the job in under two weeks.',
    category: 'Case Study',
    date: '2026-06-10',
    displayDate: '10 June 2026',
    readTime: '5 min read',
    author: 'PlanningIndex Team',
    authorBio: 'The PlanningIndex team helps UK construction professionals find and win work through planning application intelligence.',
    tags: ['case study', 'workflow', 'success story', 'proposals'],
    image: 'https://images.pexels.com/photos/28885512/pexels-photo-28885512.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'House renovation with scaffolding and building materials',
    content: [
      {
        heading: 'The business',
        paragraphs: [
          'Thames Construction is a small building company based in Uxbridge, West London. They specialise in extensions, loft conversions, and general building work within a 25-mile radius. Before PlanningIndex, they relied on word of mouth and repeat customers — which meant work was inconsistent and they had no control over their pipeline.',
        ],
      },
      {
        heading: 'The challenge',
        paragraphs: [
          'Like many small construction businesses, Thames Construction faced a common problem: work was either plentiful or non-existent, with no middle ground. When word of mouth dried up, they had no way to find new opportunities. Lead-generation sites were expensive and competitive. They needed a way to find work on their own terms.',
        ],
      },
      {
        heading: 'Finding the application',
        paragraphs: [
          'On a Monday morning, the owner logged into PlanningIndex and ran a saved search for "rear extension" within 25 miles of Uxbridge. The search returned 47 applications submitted in the last 30 days. He filtered by status to show only validated applications, narrowing the list to 31.',
          'One application caught his eye immediately: a single-storey rear extension in Amersham, Buckinghamshire. The description mentioned a 6m x 4m extension with bi-fold doors and a flat roof with roof lights. The application had been validated three days earlier. He opened the application, reviewed the description, downloaded the site plan, and checked the location on the map.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'info',
        paragraphs: [
          'The application was validated on a Friday. By Monday morning, Thames Construction had found it, reviewed it, and added it to their CRM pipeline. No other contractor knew the application existed yet.',
        ],
      },
      {
        heading: 'Adding the lead and preparing the proposal',
        paragraphs: [
          'He clicked "Add to Leads" and the application was saved to the CRM pipeline as a new lead, with the property address and planning reference automatically populated. He added a note about the project scope and set a follow-up date for two days later.',
          'On Wednesday, he returned to the lead and used the proposal builder to create a professional proposal. The property details and planning reference were already filled in. He added the scope of works — excavation and footings, brickwork, flat roof, bi-fold doors, roof lights, and internal finishes — with quantities and pricing. He reviewed the live preview, made a few edits, and the proposal was ready.',
        ],
      },
      {
        heading: 'Sending the proposal by post',
        paragraphs: [
          'On Thursday, he clicked "Send by Post." PlanningIndex printed the proposal, put it in an envelope, and posted it directly to the property in Amersham. The delivery was tracked, and the CRM pipeline was updated to show the lead had moved to "Proposal Sent."',
          'The proposal arrived at the property on Saturday. The homeowner, who had only submitted the planning application the previous week, was impressed. A professional proposal had arrived at their door, clearly connected to the application they had submitted, from a local builder who understood their project.',
        ],
      },
      {
        heading: 'Winning the work',
        paragraphs: [
          'The homeowner called Thames Construction on the following Tuesday. They arranged a site visit for that Thursday. At the site visit, the owner was already familiar with the project from the planning application documents. The homeowner had not yet contacted any other builders — Thames Construction was the first and only contractor to reach out.',
          'By the end of the following week — less than two weeks after finding the planning application on PlanningIndex — Thames Construction had a signed contract for the extension work. The total contract value was £42,000.',
        ],
      },
      {
        heading: 'The result',
        paragraphs: [
          'From finding the planning application to signing the contract took 13 days. The total cost of finding and winning the work was the PlanningIndex subscription fee — no lead fees, no commission, no competition. And because Thames Construction was the first contractor to contact the homeowner, they had no competition for the work.',
          'This is the core PlanningIndex workflow: search, identify, add lead, create proposal, send by post, win the work. It is a direct path from planning application to signed contract, and it works for any trade in any part of the UK.',
        ],
      },
    ],
  },
  {
    slug: 'using-map-view-effectively',
    title: 'Using Map View to Find Construction Work',
    excerpt: 'Master the PlanningIndex interactive map — search by radius, find clusters of activity, and target the postcodes you want to work in.',
    category: 'Guides',
    date: '2026-08-05',
    displayDate: '5 August 2026',
    readTime: '4 min read',
    author: 'PlanningIndex Team',
    authorBio: 'The PlanningIndex team helps UK construction professionals find and win work through planning application intelligence.',
    tags: ['map view', 'geographic search', 'search filters', 'guide'],
    image: 'https://images.pexels.com/photos/7937280/pexels-photo-7937280.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Aerial view of a suburban neighbourhood with houses and streets',
    content: [
      {
        heading: 'Why geographic search matters',
        paragraphs: [
          'Construction work is inherently local. Most homeowners want a contractor who is nearby — someone who knows the area, can visit the site easily, and is part of the local community. When you search for planning applications, being able to search geographically — by location and radius — is essential.',
          'PlanningIndex offers an interactive map view alongside the standard list view. The map shows planning applications as markers, colour-coded by type, so you can see where work is being planned at a glance.',
        ],
      },
      {
        heading: 'Getting started with the map',
        paragraphs: [
          'To use the map view, open Planning Search and click the "Map" toggle at the top of the results. The map will display all applications that match your current search filters, plotted as markers at their property locations.',
          'You can pan and zoom the map just like any other map. Use the zoom controls in the top-right corner, or use your mouse wheel or trackpad. As you zoom in, you will see more detail — individual streets, property boundaries, and the exact location of each application.',
        ],
        type: 'steps',
        steps: [
          'Open Planning Search from your workspace sidebar.',
          'Enter a location — a town, postcode, or place name.',
          'Set a radius from 1 to 100 miles.',
          'Enter any keywords or set any other filters you need.',
          'Click Search, then toggle to Map view.',
        ],
      },
      {
        heading: 'Reading the markers',
        paragraphs: [
          'Each marker on the map represents a single planning application. Markers are colour-coded by application type or status, so you can quickly identify the type of work being proposed. The legend in the bottom-right corner of the map shows what each colour means.',
          'Click any marker to see a summary of the application — title, reference, address, and status. From the summary, you can open the full application details or add the application to your leads.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Look for clusters of markers. A cluster of applications in one area may indicate a new development, a neighbourhood undergoing renovation, or an area where planning permission is being granted frequently. These clusters represent concentrations of opportunity.',
        ],
      },
      {
        heading: 'Radius search: choosing the right distance',
        paragraphs: [
          'The radius filter determines how far from your chosen location the search will look. The right radius depends on your trade and your willingness to travel.',
          'For trades that require multiple site visits — like extensions and loft conversions — a smaller radius of 10 to 15 miles is practical. For one-off jobs — like window replacements or roofing — you might extend to 25 miles or more. Start with a smaller radius and expand if you are not finding enough opportunities.',
        ],
      },
      {
        heading: 'Combining map and list views',
        paragraphs: [
          'The map view and list view are connected. When you apply filters, both views update. When you click a marker on the map, the corresponding result is highlighted in the list. This makes it easy to switch between seeing where applications are and reading their details.',
          'Use the map to identify geographic patterns and clusters. Use the list to read application descriptions and assess relevance. Switching between the two gives you both the spatial overview and the detailed information you need to decide which applications to pursue.',
        ],
      },
    ],
  },
  {
    slug: 'setting-up-smart-filters',
    title: 'Setting Up Smart Filters for Your Trade',
    excerpt: 'Create saved searches that automatically find the exact types of jobs you want — loft conversions, new roofs, extensions, and more.',
    category: 'Guides',
    date: '2026-07-25',
    displayDate: '25 July 2026',
    readTime: '4 min read',
    author: 'PlanningIndex Team',
    authorBio: 'The PlanningIndex team helps UK construction professionals find and win work through planning application intelligence.',
    tags: ['saved searches', 'filters', 'search strategy', 'guide'],
    image: 'https://images.pexels.com/photos/4458205/pexels-photo-4458205.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Architectural floor plan showing design details',
    content: [
      {
        heading: 'The power of saved searches',
        paragraphs: [
          'Searching for planning applications manually every day is time-consuming and easy to forget. Saved searches solve this problem. You configure your search once — with the right keywords, location, radius, and filters — and PlanningIndex keeps it updated automatically. Every time a new application matches your saved search, it appears in your results.',
          'This means you never miss a new opportunity. Set up your saved searches once, and PlanningIndex does the monitoring for you.',
        ],
      },
      {
        heading: 'Choosing the right keywords',
        paragraphs: [
          'The keyword field is the most important part of your saved search. Think about the specific terms that appear in planning applications for your trade. A window company should search for "replacement windows" and "double glazing." A roofer should search for "roof replacement" and "re-roof." An extension builder should search for "rear extension" and "side extension."',
          'Use multiple keywords separated by commas to broaden your search. PlanningIndex will return applications that match any of the keywords. You can also use more specific phrases to narrow your search — "timber sash windows" will find fewer but more relevant results than just "windows."',
        ],
      },
      {
        heading: 'Setting location and radius',
        paragraphs: [
          'Choose a location that represents your operating area — your office, your home, or the centre of the area you want to work in. Then set a radius that matches how far you are willing to travel.',
          'If you work in a dense urban area like London, a 10-mile radius may cover a huge number of applications. If you work in a rural area, you may need a 30 or 50-mile radius to find enough opportunities. Adjust until you are seeing a manageable number of relevant results.',
        ],
      },
      {
        type: 'callout',
        calloutType: 'tip',
        paragraphs: [
          'Create multiple saved searches for different parts of your operating area. If you cover North West London and the Home Counties, create one search centred on your London area and another centred on your Home Counties area. This gives you clearer, more focused results for each region.',
        ],
      },
      {
        heading: 'Using additional filters',
        paragraphs: [
          'Beyond keywords and location, PlanningIndex offers filters for application type, status, date received, and council. Use these to further refine your saved searches.',
          'Filter by application type to focus on householder applications if you do residential work, or commercial applications if you do commercial work. Filter by status to see only validated applications, which are more likely to proceed. Filter by date to focus on recent applications that have not yet been picked up by other contractors.',
        ],
      },
      {
        heading: 'Creating trade-specific searches',
        paragraphs: [
          'Here are some example saved search configurations for different trades:',
        ],
        type: 'list',
        items: [
          'Window company: keywords "replacement windows, double glazing, timber sash", radius 15 miles, type Householder.',
          'Roofer: keywords "roof replacement, re-roof, dormer, roof covering", radius 25 miles, type Householder.',
          'Extension builder: keywords "rear extension, side extension, wraparound, two-storey extension", radius 20 miles, type Householder.',
          'Loft conversion specialist: keywords "loft conversion, loft alteration, dormer", radius 20 miles, type Householder.',
          'Landscaper: keywords "garden room, landscaping, driveway, patio, outbuilding", radius 15 miles, type Householder.',
        ],
      },
      {
        heading: 'Reviewing your saved searches',
        paragraphs: [
          'Check your saved searches regularly — daily or every few days. New applications will appear as they are submitted. Review the new results, add relevant applications to your CRM pipeline, and dismiss the ones that are not a good fit. This keeps your pipeline fresh and ensures you are always acting on the latest opportunities.',
          'With well-configured saved searches, finding new work becomes a daily habit rather than a sporadic effort. Consistency is what separates businesses that always have work from those that struggle.',
        ],
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (category === 'All') return blogPosts;
  return blogPosts.filter((post) => post.category === category);
}

export function getRelatedBlogPosts(slug: string, limit = 3): BlogPost[] {
  const currentPost = getBlogPostBySlug(slug);
  if (!currentPost) return [];

  const sameCategory = blogPosts.filter(
    (post) => post.slug !== slug && post.category === currentPost.category
  );

  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const sharedTags = blogPosts.filter(
    (post) =>
      post.slug !== slug &&
      post.category !== currentPost.category &&
      post.tags.some((tag) => currentPost.tags.includes(tag))
  );

  return [...sameCategory, ...sharedTags].slice(0, limit);
}

export function getFeaturedBlogPost(): BlogPost {
  return blogPosts[0];
}

export function getBlogCategories(): string[] {
  return ['All', ...Array.from(new Set(blogPosts.map((post) => post.category)))];
}
