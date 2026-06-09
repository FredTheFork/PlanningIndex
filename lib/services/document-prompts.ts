// Document generation prompt templates.
// Each document type has a specific generation prompt, agent instructions, and
// receives the client brief as context. The prompts here are placeholders —
// replace the PLACEHOLDER strings with the real prompt text when ready.

interface DocumentPromptTemplate {
  document_type: string;
  document_label: string;
  /** The document-specific generation prompt (placeholder). */
  generationPrompt: string;
  /** Instructions for the agent executing the prompt. */
  agentInstructions: string;
}

// ─── Agent Instructions (shared across all documents) ────────────────────────

const SHARED_AGENT_INSTRUCTIONS = `AGENT INSTRUCTIONS
==================
You are generating a professional business document for a UK sole trader / small business.
This document will be used in real commercial, legal, and high-stakes environments.
It must be production-ready — not a draft, not a template, not a rough outline.

Output requirements:
1. Generate the full document content as a DOCX-ready artefact (structured text that maps
   cleanly to a Word document with appropriate headings, numbered clauses, and formatting).
2. Also prepare a PDF-equivalent layout — the same content structured for print/PDF output.
3. Quality standard: This must be equivalent to a document produced by a specialist solicitor
   or professional copywriter. Every clause, every sentence, every formatting choice matters.
4. Tone and style must match the client's brand voice as described in their brief.
5. Where legal language is required (T&Cs, contracts, privacy policies), use precise,
   enforceable UK legal phrasing — no vague or generic filler.
6. Where persuasive copy is required (bio, pitch, website copy, emails), write with clarity,
   confidence, and commercial intent — the kind of copy that wins clients.
7. Do not include placeholder text like [INSERT] or [YOUR BUSINESS]. Use the client's actual
   information from their brief. If a specific detail is genuinely missing, make a reasonable
   assumption based on the business context and flag it with a brief note at the end.
8. Return ONLY the finished document content. No meta-commentary, no explanations of your
   process, no "here is your document" preamble. Just the deliverable.`;

// ─── Per-document prompt templates ───────────────────────────────────────────

const DOCUMENT_PROMPTS: DocumentPromptTemplate[] = [
  // Business Foundations Pack
  {
    document_type: 'terms_and_conditions',
    document_label: 'Terms and Conditions',
    generationPrompt: `You are a senior UK commercial solicitor specialising in business terms and conditions.

Create a standalone Terms & Conditions document.

This document will govern the ongoing relationship between the business and all customers.

It must be suitable for publication on a website, attachment to proposals, inclusion in onboarding packs and incorporation into contracts.

The document must be compliant with England & Wales law.

────────────────────────
OBJECTIVE
────────────────────────

Create business-wide protection.

Reduce misunderstandings.

Set expectations.

Protect revenue.

Protect intellectual property.

Protect operational processes.

Protect reputation.

Protect against abusive customers.

────────────────────────
DOCUMENT DESIGN
────────────────────────

Create a visually branded document.

Use:

• Client colours
• Client brand personality
• Client tone
• Industry style

The document must feel custom designed for the business.

No generic layouts.

No generic formatting.

────────────────────────
REQUIRED SECTIONS
────────────────────────

Business Information

Services Overview

Acceptance Of Terms

Eligibility To Purchase

Quotations & Proposals

Orders & Engagement

Pricing

Deposits

Subscriptions

Renewals

Payment Terms

Late Payments

Chargebacks

Cancellation Policy

Refund Policy

Service Delivery

Client Responsibilities

Communication Standards

Delays

Intellectual Property

Website Usage

Acceptable Use

Confidentiality

Data Protection

Marketing Communications

Third Party Services

Limitation Of Liability

Indemnities

Suspension Of Services

Termination

Complaints Procedure

Force Majeure

Changes To Terms

Governing Law

Contact Information

────────────────────────
ADVANCED PROTECTION
────────────────────────

Review the client brief.

Create bespoke clauses addressing:

• Client ghosting
• Chargebacks
• Non-payment
• Scope creep
• Excessive revisions
• Harassment of staff
• Abuse of systems
• False reviews
• Unauthorised sharing of deliverables
• Misuse of intellectual property
• Failure to provide information

Create additional clauses where commercially sensible.

────────────────────────
BUSINESS-SPECIFIC INTELLIGENCE
────────────────────────

Use the client's services, pricing model, delivery method and target audience.

Ensure the terms fit the actual business.

Do not generate generic agency terms.

Do not generate generic consultant terms.

Do not generate generic freelancer terms.

Generate terms that genuinely fit this business.

────────────────────────
OUTPUT
────────────────────────

Return only the completed Terms & Conditions document.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'service_agreement_contract',
    document_label: 'Service Agreement Contract',
    generationPrompt: `You are a senior UK commercial solicitor specialising in contracts for sole traders, consultants, agencies, freelancers, coaches, marketing providers, service businesses and professional services firms.

Your task is to create a PREMIUM CLIENT SERVICE AGREEMENT.

This is not a template.

This must be a fully bespoke agreement built specifically from the client brief provided.

The final document must feel equivalent to a £1,000-£3,000 solicitor-drafted contract.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a legally robust contract that:

• Protects the business owner
• Reduces liability
• Minimises disputes
• Prevents scope creep
• Protects against chargebacks
• Protects against late payment
• Protects against client non-response
• Protects against unreasonable client demands
• Establishes professional credibility
• Creates clear expectations

This document must comply with England & Wales law.

Use UK legal drafting standards.

Avoid American legal terminology.

────────────────────────
DOCUMENT DESIGN REQUIREMENTS
────────────────────────

The contract must NOT look generic.

Use the client brief to create a unique visual identity.

Incorporate:

• Brand colours
• Brand tone
• Industry positioning
• Professional style
• Client personality
• Service type

Every contract generated for every customer should feel visually different.

For example:

A construction consultant should not receive the same styled contract as a social media manager.

A creative designer should not receive the same styled contract as a business coach.

Create a professional cover page.

Include:

• Business name
• Contract title
• Date
• Prepared for clients of the business

Include a professionally formatted contents page.

Include footer recommendations.

Include section numbering.

Include signature section.

Include acceptance section.

────────────────────────
REQUIRED CLAUSES
────────────────────────

Include ALL clauses below where relevant.

1. Definitions

2. Parties

3. Services Provided

4. Scope Of Services

5. Excluded Services

6. Client Responsibilities

7. Deliverables

8. Project Timelines

9. Delays Outside Provider Control

10. Fees

11. Deposits

12. Payment Terms

13. Subscription Terms (if relevant)

14. Late Payment Interest

15. Debt Recovery Costs

16. Failed Payments

17. Chargebacks

18. Suspension For Non Payment

19. Refund Policy

20. Intellectual Property

21. Licence To Use Deliverables

22. Third Party Assets

23. Confidentiality

24. Data Protection

25. GDPR Compliance

26. Limitation Of Liability

27. Indirect Loss Exclusion

28. Force Majeure

29. Service Availability

30. Independent Contractor Status

31. Variation Of Agreement

32. Notices

33. Termination Rights

34. Immediate Termination Events

35. Consequences Of Termination

36. Dispute Resolution

37. Governing Law

38. Entire Agreement

39. Severability

40. Electronic Signatures

────────────────────────
ADVANCED BUSINESS PROTECTION
────────────────────────

Review the client brief.

Identify risks.

Create custom clauses that specifically address:

• Previous client disputes
• Historic payment problems
• Industry-specific risks
• Scope ambiguity
• Client delays
• Client approvals
• Missing information
• Reputation risks
• Service misuse
• CRM access
• Platform access
• Social media access
• Lead generation expectations
• Marketing claims
• Software failures
• Third-party services

Where appropriate create bespoke clauses not listed above.

Think like a solicitor whose client has already been sued before.

────────────────────────
COMMERCIAL PROTECTION
────────────────────────

Ensure the contract protects against:

• Unlimited revisions
• Endless support requests
• Scope expansion
• Unpaid work
• Last-minute changes
• Client ghosting
• Refund demands after completion
• Results guarantees
• Revenue guarantees
• Marketing performance guarantees

State clearly:

The business provides professional services.

Outcomes can never be guaranteed.

Client actions impact results.

────────────────────────
WRITING STYLE
────────────────────────

Professional.

Authoritative.

Readable.

Premium.

Do not write like a generic legal template.

Do not use excessive legal jargon.

Make the document understandable to ordinary UK clients.

────────────────────────
OUTPUT REQUIREMENTS
────────────────────────

Output ONLY the finished agreement.

No explanations.

No commentary.

No notes.

No placeholders.

No drafting guidance.

Produce a complete solicitor-quality agreement ready for immediate delivery to the client.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'gdpr_privacy_policy',
    document_label: 'GDPR Privacy Policy',
    generationPrompt: `You are a UK GDPR consultant, ICO compliance specialist and privacy lawyer.

Create a fully bespoke UK GDPR Privacy Policy.

The document must be suitable for:

• Website publication
• Client onboarding
• Regulatory review
• Professional due diligence

The document must be written specifically from the client brief.

Never use generic GDPR wording.

────────────────────────
OBJECTIVE
────────────────────────

Create a privacy policy that:

• Complies with UK GDPR
• Complies with Data Protection Act 2018
• Demonstrates professionalism
• Builds trust
• Explains data handling clearly
• Protects the business

────────────────────────
DOCUMENT DESIGN
────────────────────────

Create a professionally branded document.

Use the client's:

• Colours
• Brand style
• Industry positioning
• Tone of voice

Each policy should feel unique to the business.

────────────────────────
MANDATORY SECTIONS
────────────────────────

1. Introduction

2. Data Controller Information

3. Personal Data Collected

4. Special Category Data

5. How Data Is Collected

6. Lawful Bases For Processing

7. Why Information Is Processed

8. Marketing Communications

9. Automated Decision Making

10. Data Sharing

11. International Transfers

12. Data Storage

13. Data Retention

14. Data Security

15. Individual Rights

16. Right Of Access

17. Right Of Rectification

18. Right Of Erasure

19. Right Of Restriction

20. Right To Object

21. Data Portability

22. Withdrawal Of Consent

23. Complaints To ICO

24. Cookies

25. Website Analytics

26. Third Party Providers

27. Children's Data

28. Updates To This Policy

29. Contact Information

────────────────────────
COMPLIANCE REVIEW
────────────────────────

Review the client brief.

Identify GDPR risks.

If information appears incomplete:

Make commercially reasonable assumptions.

Draft conservatively.

Protect the client.

Ensure lawful basis selection matches the actual business activities.

────────────────────────
EXPERT REQUIREMENT
────────────────────────

This document should feel like it has been reviewed by a professional Data Protection Officer.

Avoid generic AI GDPR language.

Avoid vague statements.

Be specific.

Be practical.

Be compliant.

────────────────────────
OUTPUT
────────────────────────

Return only the completed privacy policy.

No commentary.

No notes.

No explanations.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'professional_invoice_template',
    document_label: 'Professional Invoice Template',
    generationPrompt: `[PLACEHOLDER: Professional Invoice Template generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'late_payment_letters',
    document_label: 'Late Payment Letters',
    generationPrompt: `[PLACEHOLDER: Late Payment Letters generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'welcome_email_sequence',
    document_label: 'Welcome Email Sequence',
    generationPrompt: `[PLACEHOLDER: Welcome Email Sequence generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'professional_bio',
    document_label: 'Professional Bio',
    generationPrompt: `[PLACEHOLDER: Professional Bio generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'elevator_pitch',
    document_label: 'Elevator Pitch',
    generationPrompt: `[PLACEHOLDER: Elevator Pitch generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'linkedin_profile_script',
    document_label: 'LinkedIn Profile Script',
    generationPrompt: `[PLACEHOLDER: LinkedIn Profile Script generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'service_description_sheets',
    document_label: 'Service Description Sheets',
    generationPrompt: `[PLACEHOLDER: Service Description Sheets generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // Website Copy Pack
  {
    document_type: 'website_homepage',
    document_label: 'Homepage Copy',
    generationPrompt: `[PLACEHOLDER: Website Homepage Copy generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'website_about',
    document_label: 'About Page Copy',
    generationPrompt: `[PLACEHOLDER: About Page Copy generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'website_services',
    document_label: 'Services Page Copy',
    generationPrompt: `[PLACEHOLDER: Services Page Copy generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'website_contact',
    document_label: 'Contact Page Copy',
    generationPrompt: `[PLACEHOLDER: Contact Page Copy generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // Social Media Pack
  {
    document_type: 'social_media_posts',
    document_label: 'Social Media Posts (30)',
    generationPrompt: `[PLACEHOLDER: Social Media Posts generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
];

const PROMPT_MAP = new Map(DOCUMENT_PROMPTS.map(p => [p.document_type, p]));

/**
 * Get the prompt template for a specific document type.
 */
export function getDocumentPromptTemplate(documentType: string): DocumentPromptTemplate | undefined {
  return PROMPT_MAP.get(documentType);
}

/**
 * Assemble the full generation prompt for a document type.
 *
 * Structure:
 * 1. Document-specific generation prompt
 * 2. Agent instructions (quality, format, DOCX/PDF output requirements)
 * 3. Client brief (full context from their intake data)
 *
 * The client brief provides all the business-specific context the agent needs
 * to generate a bespoke, production-ready document.
 */
export function buildFullPrompt(documentType: string, clientBriefContent: string): string {
  const template = PROMPT_MAP.get(documentType);
  if (!template) {
    return `[Unknown document type: ${documentType}]\n\n${SHARED_AGENT_INSTRUCTIONS}\n\n=== CLIENT BRIEF ===\n${clientBriefContent}`;
  }

  const parts: string[] = [];

  // Section 1: Document-specific prompt
  parts.push(`=== DOCUMENT GENERATION PROMPT: ${template.document_label.toUpperCase()} ===\n`);
  parts.push(template.generationPrompt);

  // Section 2: Agent instructions
  parts.push(`\n\n=== AGENT INSTRUCTIONS ===\n`);
  parts.push(template.agentInstructions);

  // Section 3: Client brief
  if (clientBriefContent) {
    parts.push(`\n\n=== CLIENT BRIEF ===\n`);
    parts.push(clientBriefContent);
  } else {
    parts.push(`\n\n=== CLIENT BRIEF ===\n[No client brief available — generate based on document prompt alone]`);
  }

  return parts.join('');
}
