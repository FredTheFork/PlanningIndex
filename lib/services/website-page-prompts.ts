// Website page-specific prompt templates.
// Each page type has tailored prompts that use relevant intake responses.

import { PlatformId } from '@/lib/social-platforms';

// ─── Page Configuration Types ────────────────────────────────────────────────

export interface PageConfig {
  id: string;
  label: string;
  icon: string; // lucide icon name for reference
  intakeFields: string[]; // relevant intake question IDs for this page
  promptTemplate: string;
}

// ─── Page-Specific Prompt Templates ───────────────────────────────────────────

const HOMEPAGE_PROMPT = `You are a professional website copywriter creating Homepage content.

OBJECTIVE
Create compelling, conversion-focused Homepage copy that establishes credibility, communicates value, and drives action.

PAGE CONTEXT
This is the first page visitors see. It must immediately communicate:
- Who the business is
- What they offer
- Why they're different
- What action to take next

INTAKE RESPONSES (Client Preferences)
{{pageContext}}

REQUIREMENTS
1. Hero Section: Strong headline, subheading, and primary CTA
2. Value Proposition: Clear statement of what makes this business unique
3. Social Proof Preview: Tease testimonials or credentials
4. Services Overview: Brief mention of core offerings
5. Call to Action: Clear next step for visitors

BRAND VOICE
- Professional yet approachable
- Confident without being aggressive
- Client-focused, not self-centered

OUTPUT
Return ONLY the Homepage copy. Structure it with clear section headers. No placeholder text.`;

const ABOUT_PROMPT = `You are a professional website copywriter creating an About page.

OBJECTIVE
Create an About page that builds trust, establishes credibility, and creates personal connection.

PAGE CONTEXT
This page tells the story of who the business owner is, why they do what they do, and why visitors should trust them.

INTAKE RESPONSES (Client Preferences)
{{pageContext}}

REQUIREMENTS
1. Opening Hook: Engaging introduction that draws readers in
2. Story Section: Founder's journey and motivation
3. Credentials/Experience: Professional qualifications
4. Values/Mission: What the business stands for
5. Personal Touch: Human elements that create connection
6. Call to Action: Invite to work together or learn more

TONE
Match the client's specified tone preference from intake responses.

OUTPUT
Return ONLY the About page copy. Include section headers. No placeholder text.`;

const SERVICES_PROMPT = `You are a professional website copywriter creating a Services page.

OBJECTIVE
Create a Services page that clearly communicates offerings, benefits, and pricing (if applicable).

PAGE CONTEXT
This page converts interest into enquiries by showing exactly what clients get.

INTAKE RESPONSES (Client Preferences)
{{pageContext}}

REQUIREMENTS
1. Introduction: Brief services overview
2. Service Items: Each service with:
   - Clear name
   - What's included
   - Key benefits
   - Pricing (if specified to show)
   - CTA for this service
3. Process: How it works (if relevant)
4. FAQ Preview: Address common service questions
5. Call to Action: Primary next step

FORMAT
Use the format specified in intake responses (cards, list, table, etc.)

OUTPUT
Return ONLY the Services page copy. Structure by service. No placeholder text.`;

const CONTACT_PROMPT = `You are a professional website copywriter creating a Contact page.

OBJECTIVE
Create a Contact page that makes it easy for visitors to reach out.

PAGE CONTEXT
This page is where enquiries happen. It must be clear, inviting, and functional.

INTAKE RESPONSES (Client Preferences)
{{pageContext}}

REQUIREMENTS
1. Opening: Welcoming invitation to connect
2. Contact Methods: All specified methods clearly presented
3. Contact Form: Field labels and placeholder text (if form present)
4. Response Expectations: When they'll hear back
5. Alternative Contact: Backup options (phone, email, etc.)
6. Location/Hours: If applicable

TONE
Approachable, responsive, professional

OUTPUT
Return ONLY the Contact page copy. Include all contact methods. No placeholder text.`;

const FAQ_PROMPT = `You are a professional website copywriter creating an FAQ page.

OBJECTIVE
Create an FAQ page that answers common questions and overcomes objections.

PAGE CONTEXT
This page reduces friction, builds confidence, and reduces repetitive enquiries.

INTAKE RESPONSES (Client Preferences)
{{pageContext}}

REQUIREMENTS
1. Page Introduction: Brief context setting
2. FAQ Items: Each question with:
   - Clear, specific question
   - Direct, helpful answer
   - Mini CTA where relevant (e.g., "Ready to get started? Contact us")
3. Categories: Group by topic if appropriate
4. Final CTA: Encourage next step after questions answered

QUANTITY
Create the number of FAQs specified in intake responses (default: 6-8).

TONE
Helpful, patient, authoritative but not condescending

OUTPUT
Return ONLY the FAQ page content. Number each question. No placeholder text.`;

const BLOG_PROMPT = `You are a professional website copywriter creating a Blog section structure.

OBJECTIVE
Create blog page structure and first post ideas that demonstrate expertise.

PAGE CONTEXT
This page showcases expertise, improves SEO, and provides value to visitors.

INTAKE RESPONSES (Client Preferences)
{{pageContext}}

REQUIREMENTS
1. Blog Introduction: What readers can expect
2. Category Structure: Define blog categories
3. Sample Post Titles: 5-7 compelling article titles
4. First Post Outline: One detailed post outline
5. Author Bio: Brief credibility statement

TONE
Educational, valuable, not overly promotional

OUTPUT
Return blog structure with specified categories and sample post concepts. No placeholder text.`;

const PORTFOLIO_PROMPT = `You are a professional website copywriter creating a Portfolio/Case Studies page.

OBJECTIVE
Create a Portfolio page that demonstrates capability through real results.

PAGE CONTEXT
This page proves competence through evidence, not just claims.

INTAKE RESPONSES (Client Preferences)
{{pageContext}}

REQUIREMENTS
1. Page Introduction: Context for what follows
2. Project Entries: Each with:
   - Project title/client (or anonymous)
   - Challenge they faced
   - Solution provided
   - Outcome/results achieved
   - Visual description suggestion
3. CTA: Invite to discuss their project

FORMAT
Use format specified in intake responses (grid, cards, before/after, etc.)

OUTPUT
Return portfolio content for all specified projects. No placeholder text.`;

const PRICING_PROMPT = `You are a professional website copywriter creating a Pricing page.

OBJECTIVE
Create a Pricing page that is transparent, confidence-building, and enquiry-driving.

PAGE CONTEXT
This page sets expectations and filters for the right clients.

INTAKE RESPONSES (Client Preferences)
{{pageContext}}

REQUIREMENTS
1. Pricing Philosophy: Brief intro to pricing approach
2. Pricing Options: Structured as specified in intake:
   - Package tiers OR service list OR starting prices
   - What's included in each option
   - Clear differentiation between options
3. Pricing Highlights: Key differentiators (no hidden fees, etc.)
4. Comparison: If packages, show differences clearly
5. Custom Quote CTA: For bespoke work
6. FAQ: Pricing-specific questions answered

TONE
Transparent, confident, not apologetic about pricing

OUTPUT
Return complete pricing page content. No placeholder text.`;

const TESTIMONIALS_PROMPT = `You are a professional website copywriter creating a Testimonials page.

OBJECTIVE
Create a Testimonials page that builds trust through social proof.

PAGE CONTEXT
This page lets past clients sell for you through their experiences.

INTAKE RESPONSES (Client Preferences)
{{pageContext}}

REQUIREMENTS
1. Page Introduction: Context for testimonials
2. Featured Testimonials: Prominent placement for key testimonial(s)
3. Testimonial Collection: All testimonials formatted with:
   - Quote (with proper attribution)
   - Client name and context (if provided)
   - Relevant service mentioned
4. Credibility Markers: Awards, certifications, press mentions
5. Call to Action: Encourage visitor to become next success story

FORMAT
Use format specified in intake responses (cards, carousel, list, etc.)

OUTPUT
Return testimonials page content. Format all provided testimonials. No placeholder text.`;

// ─── Page Configuration Map ────────────────────────────────────────────────────

export const PAGE_CONFIGS: Record<string, PageConfig> = {
  Homepage: {
    id: 'homepage',
    label: 'Homepage',
    icon: 'Home',
    intakeFields: ['wc_homepage_sections', 'wc_homepage_cta_style'],
    promptTemplate: HOMEPAGE_PROMPT,
  },
  About: {
    id: 'about',
    label: 'About',
    icon: 'User',
    intakeFields: ['wc_about_focus', 'wc_about_tone'],
    promptTemplate: ABOUT_PROMPT,
  },
  Services: {
    id: 'services',
    label: 'Services',
    icon: 'Briefcase',
    intakeFields: ['wc_services_format', 'wc_services_show_pricing', 'wc_services_cta'],
    promptTemplate: SERVICES_PROMPT,
  },
  Contact: {
    id: 'contact',
    label: 'Contact',
    icon: 'Mail',
    intakeFields: ['wc_contact_method', 'wc_contact_form_fields'],
    promptTemplate: CONTACT_PROMPT,
  },
  FAQ: {
    id: 'faq',
    label: 'FAQ',
    icon: 'HelpCircle',
    intakeFields: ['wc_faq_topics', 'wc_faq_count'],
    promptTemplate: FAQ_PROMPT,
  },
  Blog: {
    id: 'blog',
    label: 'Blog',
    icon: 'FileText',
    intakeFields: ['wc_blog_style', 'wc_blog_categories'],
    promptTemplate: BLOG_PROMPT,
  },
  Portfolio: {
    id: 'portfolio',
    label: 'Portfolio',
    icon: 'FolderOpen',
    intakeFields: ['wc_portfolio_format', 'wc_portfolio_projects'],
    promptTemplate: PORTFOLIO_PROMPT,
  },
  Pricing: {
    id: 'pricing',
    label: 'Pricing',
    icon: 'DollarSign',
    intakeFields: ['wc_pricing_display', 'wc_pricing_highlights', 'wc_pricing_text', 'wc_show_pricing_on_website'],
    promptTemplate: PRICING_PROMPT,
  },
  Testimonials: {
    id: 'testimonials',
    label: 'Testimonials',
    icon: 'Quote',
    intakeFields: ['wc_testimonials_format', 'wc_testimonials_featured', 'wc_testimonials'],
    promptTemplate: TESTIMONIALS_PROMPT,
  },
};

// ─── Additional Context Fields (beyond page-specific) ─────────────────────────

const CORE_CONTEXT_FIELDS = [
  'q1_business_name',
  'q2_industry',
  'q3_business_description',
  'q62_tone_of_voice',
  'q63_target_audience',
  'q64_brand_personality',
  'q67_brand_colours',
  'wc_font_style',
  'wc_colour_preferences',
];

// ─── Helper: Format intake responses for prompt ───────────────────────────────

function formatPageContext(
  pageName: string,
  intakeResponses: Record<string, any>
): string {
  const pageConfig = PAGE_CONFIGS[pageName];
  const lines: string[] = [];

  // Include core business context
  lines.push('### Core Business Context');
  for (const field of CORE_CONTEXT_FIELDS) {
    const value = intakeResponses[field];
    if (value) {
      const label = field.replace(/_/g, ' ').replace(/^q\d+\s*|^wc_/, '');
      lines.push(`**${label}:** ${formatFieldValue(value)}`);
    }
  }
  lines.push('');

  // Include page-specific fields
  if (pageConfig) {
    lines.push('### Page-Specific Preferences');
    for (const field of pageConfig.intakeFields) {
      const value = intakeResponses[field];
      if (value !== undefined && value !== null && value !== '') {
        const label = field.replace(/_/g, ' ').replace(/^wc_/, '');
        lines.push(`**${label}:** ${formatFieldValue(value)}`);
      }
    }
    lines.push('');
  }

  // Include testimonials if available
  if (intakeResponses.wc_testimonials) {
    lines.push('### Provided Testimonials');
    lines.push(intakeResponses.wc_testimonials);
    lines.push('');
  }

  return lines.join('\n');
}

function formatFieldValue(value: any): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'string') {
    return value;
  }
  return String(value);
}

// ─── Main Export: Build Page Prompt ───────────────────────────────────────────

export function buildPagePrompt(
  pageName: string,
  briefContent: string,
  intakeResponses: Record<string, any> | null
): string {
  const pageConfig = PAGE_CONFIGS[pageName];

  if (!pageConfig) {
    return `[Unknown page type: ${pageName}]\n\nSelect a valid page: ${Object.keys(PAGE_CONFIGS).join(', ')}`;
  }

  const sections: string[] = [];

  // Add page prompt
  sections.push(`# ${pageName.toUpperCase()} PAGE GENERATION PROMPT`);
  sections.push('');
  sections.push(pageConfig.promptTemplate.replace('{{pageContext}}', formatPageContext(pageName, intakeResponses || {})));
  sections.push('');

  // Add brief content
  if (briefContent) {
    sections.push('---');
    sections.push('');
    sections.push('### CLIENT BRIEF (Reference Context)');
    sections.push('');
    sections.push(briefContent);
    sections.push('');
  }

  // Add shared output requirements
  sections.push('---');
  sections.push('');
  sections.push(`### OUTPUT REQUIREMENTS FOR ${pageName.toUpperCase()}`);
  sections.push('');
  sections.push('Return ONLY the finished page content.');
  sections.push('No meta-commentary or explanations.');
  sections.push('No placeholder text like [INSERT] or [YOUR BUSINESS].');
  sections.push('Use the actual business information from the brief and intake responses.');
  sections.push('Format for direct insertion into a webpage.');

  return sections.join('\n');
}

// ─── Bulk Prompt Builder ──────────────────────────────────────────────────────

export function buildAllPagePrompts(
  pages: string[],
  briefContent: string,
  intakeResponses: Record<string, any> | null
): string {
  const sections: string[] = [];

  sections.push(`# COMPLETE WEBSITE COPY GENERATION PACKAGE`);
  sections.push(`Generated: ${new Date().toLocaleString()}`);
  sections.push(`Pages: ${pages.join(', ')}`);
  sections.push('');

  for (const page of pages) {
    sections.push('='.repeat(60));
    sections.push('');
    sections.push(buildPagePrompt(page, briefContent, intakeResponses));
    sections.push('');
  }

  return sections.join('\n');
}

// ─── Social Media Master Prompt Builder ───────────────────────────────────────

export function buildMasterSocialMediaPrompt(
  briefContent: string,
  intakeResponses: Record<string, any> | null,
  platforms: PlatformId[]
): string {
  const sections: string[] = [];

  sections.push(`# COMPLETE SOCIAL MEDIA GENERATION PACKAGE`);
  sections.push(`Generated: ${new Date().toLocaleString()}`);
  sections.push(`Platforms: ${platforms.join(', ')}`);
  sections.push('');

  // Social media context from intake
  if (intakeResponses) {
    sections.push('---');
    sections.push('### SOCIAL MEDIA STRATEGY CONTEXT');
    sections.push('');

    const smFields = [
      ['sm1_platforms', 'Platforms'],
      ['sm2_content_types', 'Content Types'],
      ['sm3_avoid_topics', 'Topics to Avoid'],
      ['sm4_posting_frequency', 'Posting Frequency'],
      ['sm5_content_pillars', 'Content Pillars'],
      ['sm6_personal_boundaries', 'Personal Boundaries'],
      ['sm7_hashtag_strategy', 'Hashtag Strategy'],
      ['sm8_competitor_accounts', 'Competitor Accounts'],
      ['sm9_content_tone', 'Content Tone'],
      ['sm10_call_to_action', 'Preferred CTA'],
      ['sm13_upcoming_launches', 'Upcoming Launches'],
    ];

    for (const [field, label] of smFields) {
      const value = intakeResponses[field];
      if (value) {
        sections.push(`**${label}:** ${formatFieldValue(value)}`);
      }
    }
    sections.push('');
  }

  // Add brief
  if (briefContent) {
    sections.push('---');
    sections.push('### CLIENT BRIEF');
    sections.push('');
    sections.push(briefContent);
    sections.push('');
  }

  // Platform-specific sections
  for (const platform of platforms) {
    sections.push('---');
    sections.push(`### ${platform.toUpperCase()} GENERATION INSTRUCTIONS`);
    sections.push('');
    sections.push(getPlatformGenerationGuide(platform));
    sections.push('');
  }

  // Output format specification
  sections.push('---');
  sections.push('### OUTPUT FORMAT');
  sections.push('');
  sections.push('Return a JSON array of posts with the following structure:');
  sections.push(`[
  {
    "post_number": 1,
    "platform": "${platforms[0] || 'LinkedIn'}",
    "category": "educational|promotional|personal",
    "week": 1,
    "day": "Mon",
    "caption": "Full caption text...",
    "hashtags": "#hashtag1 #hashtag2",
    "image_prompt": "Optional image generation prompt if applicable"
  }
]`);
  sections.push('');
  sections.push('Generate posts for all platforms listed above, distributing the total post count proportionally.');

  return sections.join('\n');
}

function getPlatformGenerationGuide(platform: PlatformId): string {
  const guides: Record<PlatformId, string> = {
    LinkedIn: `LinkedIn posts should be professional, thought-leadership focused.

- Lead with a strong hook
- Share insights or experiences
- Include clear takeaways
- End with engagement question or CTA
-hashtags: 3-5 relevant tags
- Image prompts: Professional, clean graphics`,

    Instagram: `Instagram posts are visual-first with supporting captions.

- Captions tell stories
- Strong opening line (appears above fold)
- Emoji appropriate to brand
- Carousel prompts provided when multi-slide content
- Hashtags: 15-25 targeted tags
- Image prompts: Detailed visual descriptions matching platform aesthetic`,

    Facebook: `Facebook posts balance visual and text.

- Conversational tone
- Longer captions acceptable
- Community-building focus
- Hashtags: 3-5 relevant tags
- Image prompts: Eye-catching, shareable visuals`,

    X: `X (Twitter) posts are short and punchy.

- Maximum 280 characters
- Strong opinion or hot take
- Punchy and memorable
- Hashtags: 1-3 maximum
- Image prompts: Simple, bold graphics`,

    TikTok: `TikTok content is video-first.

- Video concept description
- Trending audio suggestions
- Hook in first 3 seconds
- Casual, authentic tone
- Less formal than other platforms`,

    Pinterest: `Pinterest is visual discovery focused.

- SEO-optimized image descriptions
- Rich pin titles and descriptions
- Vertical format emphasis
- Keywords prominent
- Less social, more search-oriented`,
  };

  return guides[platform] || `Generate ${platform} content following platform best practices.`;
}

// ─── Caption Generation Prompt ────────────────────────────────────────────────

export function buildCaptionGenerationPrompt(
  postStructure: Array<{ post_number: number; platform: PlatformId; category: string; week: number; day: string }>,
  briefContent: string,
  intakeResponses: Record<string, any> | null
): string {
  const sections: string[] = [];

  sections.push(`# BULK SOCIAL MEDIA CAPTION GENERATION PROMPT`);
  sections.push(`Generated: ${new Date().toLocaleString()}`);
  sections.push('');

  // Content strategy context
  if (intakeResponses) {
    sections.push('### CONTENT STRATEGY');
    sections.push('');
    sections.push(`**Content Pillars:** ${intakeResponses.sm5_content_pillars || 'Not specified'}`);
    sections.push(`**Content Tone:** ${intakeResponses.sm9_content_tone || 'Match brand voice'}`);
    sections.push(`**Hashtag Strategy:** ${intakeResponses.sm7_hashtag_strategy || 'Moderate use'}`);
    sections.push(`**Topics to Avoid:** ${intakeResponses.sm3_avoid_topics || 'None specified'}`);
    sections.push('');
  }

  // Brief
  if (briefContent) {
    sections.push('---');
    sections.push('### CLIENT BRIEF');
    sections.push('');
    sections.push(briefContent);
    sections.push('');
  }

  // Post structure to fill
  sections.push('---');
  sections.push('### POSTS TO GENERATE');
  sections.push('');
  sections.push('Generate captions and hashtags for the following posts:');
  sections.push('');
  sections.push('```json');
  sections.push(JSON.stringify(postStructure, null, 2));
  sections.push('```');
  sections.push('');

  // Output format
  sections.push('---');
  sections.push('### OUTPUT FORMAT');
  sections.push('');
  sections.push('Return a JSON array with caption and hashtags for each post:');
  sections.push(`[
  {
    "post_number": 1,
    "caption": "Full caption text...",
    "hashtags": "#hashtag1 #hashtag2 #hashtag3"
  }
]`);

  return sections.join('\n');
}
