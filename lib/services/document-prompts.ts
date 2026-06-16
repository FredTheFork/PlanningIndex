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
    generationPrompt: `You are a senior finance operations consultant, credit control specialist and business documentation designer.

Your task is to create a premium UK invoice template.

The template must be suitable for use by a real business immediately.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create an invoice that:

• Looks highly professional
• Encourages prompt payment
• Reinforces credibility
• Supports legal enforceability
• Protects cash flow
• Reduces payment friction

────────────────────────
DOCUMENT DESIGN
────────────────────────

Use the client brief.

Create a branded invoice style.

Incorporate:

• Brand colours
• Brand personality
• Industry positioning

Every invoice template should feel bespoke.

A consultant's invoice should not resemble a designer's invoice.

A construction service invoice should not resemble a coach's invoice.

────────────────────────
REQUIRED SECTIONS
────────────────────────

Business Information

Invoice Number

Issue Date

Due Date

Client Details

Project Reference

Purchase Order Field

Description Of Services

Quantity

Rate

Subtotal

VAT (if applicable)

Total Due

Payment Method

Bank Transfer Information

Payment Reference Instructions

Payment Terms

Late Payment Notice

Notes Section

Authorised Signature Section

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Ensure compliance with:

• UK invoicing best practice
• VAT requirements where applicable
• Late Payment of Commercial Debts legislation where relevant

Include wording regarding:

• Payment due dates
• Late payment charges
• Interest rights
• Debt recovery costs

────────────────────────
ADVANCED COMMERCIAL FEATURES
────────────────────────

Include:

• Professional payment instructions
• Invoice completion guidance
• Example completed invoice
• Recurring invoice version
• Deposit invoice version
• Final balance invoice version

Include wording designed to:

• Reduce excuses for non-payment
• Improve payment speed
• Maintain professionalism

────────────────────────
OUTPUT REQUIREMENTS
────────────────────────

Generate the complete invoice package.

Ready for Word and PDF formatting.

No commentary.

No notes.

No explanations.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'late_payment_letters',
    document_label: 'Late Payment Letters',
    generationPrompt: `You are a senior UK commercial debt recovery solicitor, credit control specialist, finance director and business risk consultant.

Your task is to create a complete Late Payment Recovery Package.

This is not simply a collection of payment reminder letters.

This is a professionally structured debt recovery sequence designed to maximise payment recovery while protecting the business's legal position.

The sequence must be suitable for sole traders, consultants, agencies, freelancers, service providers and small businesses operating within England & Wales.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a payment recovery system that:

• Maximises collection rates
• Preserves professionalism
• Protects cash flow
• Demonstrates seriousness
• Creates legal evidence
• Encourages voluntary payment
• Escalates appropriately
• Maintains compliance with UK law

The sequence should progressively increase pressure while remaining professional, reasonable and legally sound.

────────────────────────
CLIENT-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Analyse:

• Industry
• Services
• Pricing structure
• Typical client profile
• Previous payment issues
• Existing terms
• Business tone of voice
• Professional positioning

Ensure the letters sound like they originate directly from the business owner.

The letters must never feel generic.

A construction consultant should not send the same payment letters as a designer.

A business coach should not sound like a solicitor.

A premium consultancy should sound different from a trades business.

Tailor language accordingly.

────────────────────────
DOCUMENT DESIGN REQUIREMENTS
────────────────────────

Create a branded document suite.

Incorporate:

• Business name
• Brand colours
• Industry style
• Professional identity

Include:

• Letterhead recommendations
• Reference number field
• Invoice number field
• Outstanding balance field
• Date fields
• Contact details
• Signature block

The sequence should feel like a genuine credit-control system.

────────────────────────
REQUIRED DELIVERABLES
────────────────────────

LETTER 1
FRIENDLY PAYMENT REMINDER

Purpose:

• Assume oversight
• Maintain goodwill
• Encourage immediate payment

Include:

• Subject line
• Letter version
• Email version

Psychology:

• Helpful
• Professional
• Non-accusatory

Reference:

• Original invoice
• Due date
• Amount outstanding

Include:

• Clear payment instructions
• New response deadline

────────────────────────

LETTER 2
FORMAL PAYMENT DEMAND

Purpose:

• Escalate seriousness
• Establish consequences
• Reinforce contractual obligations

Include:

• Subject line
• Letter version
• Email version

Reference:

• Previous communication
• Outstanding amount
• Original due date

Include:

• Reference to agreed payment terms
• Reference to contractual obligations
• Potential late payment interest
• Debt recovery rights

Tone:

Firm

Professional

Direct

────────────────────────

LETTER 3
LETTER BEFORE ACTION

Purpose:

• Final opportunity before escalation
• Establish legal record
• Protect enforcement rights

Include:

• Formal legal-style letter
• Email version
• Letter version

Reference:

• Previous correspondence
• Outstanding debt
• Payment history

Include:

• Final payment deadline
• Potential legal proceedings
• County Court action warning
• Debt recovery cost warning
• Interest warning
• Credit implications where appropriate

The letter must be robust but reasonable.

────────────────────────

OPTIONAL BONUS LETTER

CLIENT DISAPPEARED / GHOSTING LETTER

Create a specialist version for situations where:

• Client stops responding
• Client disappears
• Work has already been completed

────────────────────────

OPTIONAL BONUS LETTER

CHARGEBACK DISPUTE RESPONSE

Create a professional response template for:

• Card disputes
• Stripe disputes
• PayPal disputes

Include:

• Evidence summary section
• Contract reference section
• Timeline section

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Ensure all content aligns with:

• England & Wales law
• Contract law principles
• Debt recovery best practice

Where appropriate reference:

• Late Payment of Commercial Debts (Interest) Act 1998
• Contractual payment obligations
• Debt recovery rights

Do NOT make threats.

Do NOT make misleading legal claims.

Do NOT overstate legal rights.

Remain accurate and professional.

────────────────────────
PSYCHOLOGY REQUIREMENTS
────────────────────────

Structure the sequence to gradually move through:

1. Cooperation
2. Accountability
3. Consequences
4. Enforcement

The objective is payment.

Not confrontation.

Maintain professionalism throughout.

────────────────────────
OUTPUT REQUIREMENTS
────────────────────────

Return the complete payment recovery package.

Ready for immediate use.

No explanations.

No notes.

No commentary.

No placeholders.

Produce solicitor-quality business documents suitable for real commercial use.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'welcome_email_sequence',
    document_label: 'Welcome Email Sequence',
    generationPrompt: `You are a customer onboarding consultant, client experience strategist, email copywriter and service operations expert.

Create a premium New Client Welcome Sequence.

The objective is to create confidence, clarity and professionalism from day one.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

The sequence should:

• Build trust
• Reduce anxiety
• Set expectations
• Explain processes
• Increase responsiveness
• Reduce misunderstandings
• Reduce disputes
• Improve retention
• Create a premium experience

────────────────────────
REQUIRED DELIVERABLES
────────────────────────

EMAIL 1
Immediate Welcome

Purpose:

• Thank the client
• Confirm engagement
• Reinforce buying decision
• Explain next steps
• Set expectations

Include:

• Subject line options
• Preview text
• Full email

────────────────────────

EMAIL 2
Onboarding & Action Required

Purpose:

• Gather information
• Secure required documents
• Confirm timelines
• Explain responsibilities

Include:

• Subject line options
• Preview text
• Full email

────────────────────────

EMAIL 3
Preparation & Success Guide

Purpose:

• Educate the client
• Improve cooperation
• Improve outcomes
• Increase professionalism

Include:

• Subject line options
• Preview text
• Full email

────────────────────────
ADVANCED CLIENT MANAGEMENT
────────────────────────

Review the client brief.

Identify risks.

Build messaging that proactively addresses:

• Slow client responses
• Missing information
• Delayed approvals
• Unrealistic expectations
• Scope creep
• Payment issues
• Revision misunderstandings

Without sounding aggressive.

────────────────────────
BRAND PERSONALITY
────────────────────────

Match the client's tone.

Match the client's audience.

Match the client's industry.

Every sequence must feel custom written.

Not templated.

Not generic.

────────────────────────
PSYCHOLOGY REQUIREMENTS
────────────────────────

Use:

• Reassurance
• Professional authority
• Clarity
• Trust
• Momentum

The client should finish the sequence feeling:

"I've made the right decision."

────────────────────────
OUTPUT REQUIREMENTS
────────────────────────

Return all three emails fully written.

Ready to use.

No notes.

No explanations.

No commentary.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'professional_bio',
    document_label: 'Professional Bio',
    generationPrompt: `You are an elite brand strategist, positioning consultant and professional copywriter.

Create a premium personal and business biography.

Your objective is not to describe the person.

Your objective is to position them as a credible professional within their market.

────────────────────────
DELIVERABLES
────────────────────────

Generate:

1. 50-word version
2. 150-word version
3. 300-word version
4. Website About section version
5. Proposal introduction version
6. Social profile version

────────────────────────
POSITIONING REQUIREMENTS
────────────────────────

Use the client brief to identify:

• Expertise
• Industry knowledge
• Unique strengths
• Differentiators
• Client outcomes
• Personal story
• Professional credibility

Where experience is limited:

Position intelligently.

Focus on:

• Systems
• Process
• Innovation
• Commitment
• Results orientation

Never fabricate qualifications.

Never invent achievements.

────────────────────────
WRITING STYLE
────────────────────────

Match the client's brand voice.

Create language that sounds authentic.

Avoid clichés.

Avoid corporate buzzwords.

Avoid LinkedIn influencer language.

Avoid Steven Bartlett style writing.

The biography should sound like a real professional.

────────────────────────
BRANDING
────────────────────────

The tone, formatting and presentation should feel unique to the business.

Not every biography should follow the same structure.

Adapt to industry.

Adapt to audience.

Adapt to personality.

────────────────────────
OUTPUT
────────────────────────

Return all versions fully written.

Ready for immediate use.

No notes.

No explanations.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'elevator_pitch',
    document_label: 'Elevator Pitch',
    generationPrompt: `You are an elite business positioning consultant, sales strategist, communications coach and direct-response copywriter.

Your task is to create a complete Elevator Pitch Package.

You are NOT simply writing introductions.

You are creating strategic positioning assets that help the business owner confidently explain their value, attract clients and win work.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create messaging that:

• Builds credibility
• Generates interest
• Creates trust
• Differentiates the business
• Makes the business memorable
• Encourages follow-up conversations
• Converts curiosity into enquiries

The pitches must sound natural when spoken aloud.

They must never sound scripted.

────────────────────────
REQUIRED DELIVERABLES
────────────────────────

Generate:

1. 15-second version
2. 30-second version
3. 60-second version
4. 2-minute networking version
5. Written proposal version
6. Email introduction version
7. Website introduction version
8. "What do you do?" casual version
9. High-ticket sales call version
10. Referral partner version

────────────────────────
CLIENT BRIEF ANALYSIS
────────────────────────

Before writing anything:

Analyse:

• Target audience
• Service offering
• Industry
• Pricing model
• Unique advantages
• Client outcomes
• Differentiators
• Brand personality

Identify:

What truly makes the business different.

Do NOT rely on generic claims.

Avoid:

• Quality service
• Customer focused
• Passionate
• Dedicated
• Years of experience

Unless genuinely supported by the brief.

────────────────────────
PSYCHOLOGY REQUIREMENTS
────────────────────────

Every pitch should answer:

Who are you?

Who do you help?

What problem do you solve?

What outcome do you create?

Why should somebody choose you?

Why now?

Each version should use slightly different psychological triggers.

Examples:

• Authority
• Trust
• Simplicity
• Efficiency
• Risk reduction
• Opportunity
• Revenue generation
• Time saving

────────────────────────
TONE REQUIREMENTS
────────────────────────

Match the client's voice.

If professional:
sound professional.

If premium:
sound premium.

If creative:
sound creative.

If technical:
sound technical.

Never use the same structure for every client.

Every pitch package must feel unique.

────────────────────────
OUTPUT REQUIREMENTS
────────────────────────

Return all pitch versions fully written.

Ready for immediate use.

No notes.

No explanations.

No commentary.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'linkedin_profile_script',
    document_label: 'LinkedIn Profile Script',
    generationPrompt: `You are a LinkedIn strategist, personal branding consultant, recruitment expert, SEO specialist and B2B copywriter.

Your task is to create a complete LinkedIn Profile Optimisation Package.

The objective is to transform the client into a credible, trustworthy and highly discoverable professional within their market.

This must feel like work completed by a specialist LinkedIn consultant.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a LinkedIn profile that:

• Builds trust
• Generates inbound enquiries
• Improves discoverability
• Increases profile views
• Positions expertise
• Supports authority building
• Converts visitors into conversations

────────────────────────
REQUIRED DELIVERABLES
────────────────────────

Generate:

1. Optimised Headline (10 alternatives)

2. LinkedIn About Section

3. Experience Section

4. Business Description

5. Featured Section Recommendations

6. Services Section

7. Skills Recommendations

8. Profile SEO Keywords

9. Content Pillars

10. Connection Request Templates

11. Follow-Up Message Templates

12. Recommendation Request Template

13. Client Testimonial Request Template

14. Profile Banner Copy

15. Creator Mode Strategy (if applicable)

────────────────────────
SEO REQUIREMENTS
────────────────────────

Research the brief.

Identify:

• Industry keywords
• Buyer intent phrases
• Service-related terms
• Searchable expertise areas

Naturally incorporate these throughout the profile.

Avoid keyword stuffing.

Write for humans first.

Search visibility second.

────────────────────────
POSITIONING REQUIREMENTS
────────────────────────

Position the client as:

• Credible
• Professional
• Competent
• Trustworthy

Never invent qualifications.

Never invent achievements.

Never invent clients.

Never fabricate testimonials.

Where experience is limited:

Emphasise:

• Process
• Systems
• Innovation
• Methodology
• Results focus

────────────────────────
ADVANCED LINKEDIN STRATEGY
────────────────────────

Include guidance on:

• Profile photo style
• Banner design
• Featured section structure
• Content strategy
• Posting frequency
• Engagement approach

Tailor recommendations to the specific business.

────────────────────────
OUTPUT REQUIREMENTS
────────────────────────

Return all sections fully completed.

Ready for copy-and-paste implementation.

No notes.

No explanations.

No commentary.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'service_description_sheets',
    document_label: 'Service Description Sheets',
    generationPrompt: `You are a senior sales consultant, offer strategist, conversion copywriter, buyer psychology specialist and business positioning expert.

Your task is to create a premium Service Description Sheet for every service identified within the client brief.

This is NOT a service description.

This is a strategic sales asset.

The finished document should simultaneously:

• Explain the service
• Increase perceived value
• Generate enquiries
• Pre-qualify prospects
• Reduce objections
• Control expectations
• Prevent scope creep
• Reinforce professionalism

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a document that makes a prospective client think:

"This is exactly what I need."

while also making clear:

"This is exactly what is and is not included."

────────────────────────
CLIENT BRIEF ANALYSIS
────────────────────────

Before writing:

Analyse:

• Industry
• Service type
• Client profile
• Pricing model
• Brand voice
• Competitive advantages
• Business goals
• Desired outcomes

Identify:

• Core pain points
• Desired outcomes
• Emotional drivers
• Commercial drivers
• Industry-specific concerns

Build the document around those findings.

────────────────────────
DOCUMENT DESIGN REQUIREMENTS
────────────────────────

Create a unique branded design concept.

Use:

• Brand colours
• Industry styling
• Business personality
• Target audience preferences

Every service sheet generated must look different depending on the business.

A construction consultant should not receive the same structure as a social media manager.

A coach should not receive the same style as a web designer.

A consultant should not receive the same format as a tradesperson.

Avoid generic layouts.

Avoid standard templates.

────────────────────────
CREATE ONE SHEET PER SERVICE
────────────────────────

If multiple services exist:

Create a separate service sheet for each.

Each service must be individually tailored.

────────────────────────
REQUIRED SECTIONS
────────────────────────

SERVICE NAME

Professional headline.

Outcome-focused.

────────────────────────

WHO THIS SERVICE IS FOR

Describe ideal client profile.

Include:

• Business type
• Client characteristics
• Suitable situations

────────────────────────

THE PROBLEM

Clearly explain:

• Pain points
• Frustrations
• Risks
• Missed opportunities

Specific to the industry.

────────────────────────

THE SOLUTION

Explain:

• What the service does
• How it works
• Why it works

Focus on transformation.

Not features.

────────────────────────

WHAT'S INCLUDED

Provide a detailed breakdown.

Clearly list:

• Deliverables
• Processes
• Support
• Communication

Specific to the service.

────────────────────────

WHAT'S NOT INCLUDED

This section is mandatory.

Use it to reduce scope creep.

Clearly identify:

• Exclusions
• Additional services
• Out-of-scope requests

Tailored to the industry.

────────────────────────

THE PROCESS

Provide a step-by-step breakdown.

From:

Initial enquiry

To

Completion or ongoing support.

Create confidence through clarity.

────────────────────────

EXPECTED TIMELINES

Explain:

• Typical durations
• Dependencies
• Approval requirements

Include client responsibilities where relevant.

────────────────────────

EXPECTED OUTCOMES

Focus on:

• Benefits
• Improvements
• Efficiencies
• Opportunities

Never promise guaranteed results.

Never create legal risk.

────────────────────────

FREQUENTLY ASKED QUESTIONS

Generate FAQs based on:

• Industry concerns
• Common objections
• Buyer hesitation
• Typical misunderstandings

Provide persuasive but honest answers.

────────────────────────

PRICING INFORMATION

Where pricing exists:

Present it professionally.

Where pricing is absent:

Provide pricing structure explanation.

Avoid creating fictional prices.

────────────────────────

WHY CHOOSE US

Use information from the brief.

Position genuine differentiators.

Never invent credentials.

Never invent experience.

Never fabricate authority.

────────────────────────

CALL TO ACTION

Create a professional next-step section.

Encourage enquiry.

Encourage conversation.

Avoid pushy sales language.

────────────────────────
ADVANCED SALES PSYCHOLOGY
────────────────────────

Throughout the document:

Use:

• Clarity
• Trust
• Authority
• Simplicity
• Risk reduction
• Outcome focus

Reduce:

• Confusion
• Skepticism
• Objections
• Friction

The document should increase conversion rates without appearing sales-heavy.

────────────────────────
ADVANCED BUSINESS PROTECTION
────────────────────────

Where relevant:

Subtly reinforce:

• Scope boundaries
• Client responsibilities
• Approval requirements
• Timeline dependencies
• Payment expectations

Do this professionally.

Not aggressively.

────────────────────────
WRITING STYLE
────────────────────────

Match the client's voice exactly.

If the client is:

• Premium → sound premium.
• Corporate → sound corporate.
• Friendly → sound friendly.
• Technical → sound technical.
• Creative → sound creative.

The finished document should feel like the business owner wrote it personally.

────────────────────────
OUTPUT REQUIREMENTS
────────────────────────

Create a complete service description sheet for every service identified.

Ready for:

• PDF delivery
• Word document delivery
• Website adaptation
• Proposal inclusion
• Client onboarding

Return only the finished service sheets.

No explanations.

No notes.

No commentary.

No placeholders.

Produce consultant-grade sales collateral suitable for real commercial use.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // ─── Client Onboarding & Scope Control Pack ────────────────────────────────

  {
    document_type: 'client_onboarding_questionnaire',
    document_label: 'Client Onboarding Questionnaire',
    generationPrompt: `You are a senior client experience consultant and business operations strategist.

Create a comprehensive Client Onboarding Questionnaire.

This document will be completed by new clients before work begins.

It must collect every piece of information the business needs to deliver excellent service, prevent misunderstandings, and protect the business owner from scope creep and disputes.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a questionnaire that:

• Gathers complete client context before work starts
• Identifies potential red flags early
• Establishes decision-making authority
• Captures communication preferences
• Records success criteria in the client's own words
• Protects the business legally by documenting agreements in advance

────────────────────────
REQUIRED SECTIONS
────────────────────────

Client & Business Information

Contact Details

Business Background

Project Goals & Objectives

Success Criteria

Scope & Priorities

Budget & Timeline

Decision-Making Authority

Communication Preferences

Previous Experience

Risk & Challenges

Final Confirmation & Sign-Off

────────────────────────
DESIGN REQUIREMENTS
────────────────────────

Create a branded professional document.

Use the client's:

• Business name and colours
• Brand personality
• Professional positioning
• Industry style

The questionnaire should feel custom built for this specific business.

Not a generic agency onboarding form.

Not a generic template.

────────────────────────
ADVANCED INTELLIGENCE
────────────────────────

Review the client brief.

Add industry-specific questions relevant to their business.

Identify potential client red flags and include questions designed to surface them early.

Examples:

• Unrealistic expectations
• Unclear decision-making
• Prior bad experiences
• Budget misalignment
• Scope ambiguity

────────────────────────
OUTPUT
────────────────────────

Return only the completed questionnaire.

Ready for PDF and DOCX formatting.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'scope_of_work_document',
    document_label: 'Scope of Work Document',
    generationPrompt: `You are a senior UK commercial solicitor and project management consultant specialising in scope definition and dispute prevention.

Create a comprehensive Scope of Work Document.

This document must prevent scope creep, protect the business's time, and be legally enforceable under England & Wales law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a scope document that:

• Defines exactly what is included
• Defines exactly what is excluded
• Establishes change request procedures
• Protects the business from unlimited revisions
• Creates a clear legal record of agreed deliverables
• Reduces client disputes

────────────────────────
REQUIRED SECTIONS
────────────────────────

Project Overview

Parties

Scope of Services

Detailed Deliverables

Explicitly Excluded Items

Assumptions & Dependencies

Client Responsibilities

Revision & Amendment Policy

Change Request Procedure

Timeline & Milestones

Acceptance Criteria

Sign-Off Requirements

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Draft using clear, enforceable language.

Include change request procedures with:

• Written change request requirement
• Impact assessment (time and cost)
• Written approval before proceeding

Include revision limits appropriate to the service type.

Include consequences for scope expansion without approval.

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Adapt the scope structure to the specific services offered.

Identify and address the most likely scope creep risks for this business type.

Create bespoke exclusions based on the industry and service type.

────────────────────────
OUTPUT
────────────────────────

Return only the completed scope of work document.

Ready for PDF and DOCX formatting.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'project_brief_template',
    document_label: 'Project Brief Template',
    generationPrompt: `You are a senior project management consultant and business operations strategist.

Create a reusable Project Brief Template.

This template will be completed for each new client engagement.

It must capture everything needed to plan, execute, and deliver a project successfully.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a project brief that:

• Aligns expectations before work begins
• Documents agreed objectives and deliverables
• Establishes milestones and timelines
• Records sign-off requirements
• Prevents misunderstandings
• Creates a professional starting point for every engagement

────────────────────────
REQUIRED SECTIONS
────────────────────────

Project Title & Reference Number

Project Overview

Business Objectives

Target Audience / End Users

Deliverables

Project Milestones

Timeline

Budget Allocation

Resources & Dependencies

Risks & Constraints

Communication Plan

Sign-Off & Approval Section

────────────────────────
DESIGN REQUIREMENTS
────────────────────────

Create a branded, professional template.

Use the client's business identity.

Every completed brief should feel like a premium business document.

────────────────────────
USABILITY REQUIREMENTS
────────────────────────

The template must be:

• Easy to complete quickly
• Clear and unambiguous
• Suitable for sharing with clients
• Professional enough to build confidence

Include completion guidance for each section.

────────────────────────
OUTPUT
────────────────────────

Return only the completed project brief template.

Ready for PDF and DOCX formatting.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'change_request_form',
    document_label: 'Change Request Form',
    generationPrompt: `You are a senior project management consultant and UK commercial solicitor specialising in scope management and dispute prevention.

Create a professional Change Request Form.

This form must create a clear, auditable trail for every scope modification and protect the business from unpaid work.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a change request process that:

• Documents every requested change formally
• Assesses time and cost impact before approval
• Requires written client approval before work proceeds
• Creates a legal record of agreed changes
• Protects the business from disputes about additional work

────────────────────────
REQUIRED SECTIONS
────────────────────────

Change Request Reference Number

Date of Request

Project Reference

Requested By

Description of Change

Reason for Change

Impact Assessment:
  — Additional Time Required
  — Additional Cost
  — Impact on Timeline
  — Impact on Deliverables

Recommendation

Business Decision

Authorised By

Signature & Date

Status Tracking

────────────────────────
PROCESS DESIGN
────────────────────────

Include clear instructions for use.

Define the change request process:

• How to submit
• Response timescales
• Approval requirements
• What happens if change proceeds without approval

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Include wording that:

• Work will not commence until written approval is received
• Verbal approvals are not binding
• Changes affect original delivery timelines

────────────────────────
OUTPUT
────────────────────────

Return only the completed change request form.

Ready for PDF and DOCX formatting.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'onboarding_checklist',
    document_label: 'Onboarding Checklist',
    generationPrompt: `You are a senior business operations consultant and client experience specialist.

Create a comprehensive New Client Onboarding Checklist.

This checklist will be used by the business owner every time they onboard a new client.

It must be thorough, practical, and ensure nothing is missed.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a checklist that:

• Ensures consistent onboarding every time
• Protects the business legally and administratively
• Creates a professional client experience
• Prevents common onboarding failures
• Builds client confidence from day one

────────────────────────
REQUIRED SECTIONS
────────────────────────

Pre-Engagement (Before Work Starts)

Administrative Setup

Legal & Documentation

Communication Setup

Project Setup

Client Welcome

Work Commencement

Post-Onboarding Review

────────────────────────
CHECKLIST ITEMS
────────────────────────

For each section include specific, actionable checklist items.

Examples:

• Contract signed and returned
• Deposit received and reconciled
• Onboarding questionnaire completed
• Communication channels confirmed
• Access credentials received
• Project brief agreed
• Kick-off meeting scheduled

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Add industry-specific checklist items.

Identify onboarding steps unique to this type of business.

────────────────────────
DESIGN REQUIREMENTS
────────────────────────

Create a professional branded checklist.

Format for practical daily use.

Include space for notes and dates against each item.

────────────────────────
OUTPUT
────────────────────────

Return only the completed onboarding checklist.

Ready for PDF and DOCX formatting.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'client_communication_protocols',
    document_label: 'Client Communication Protocols',
    generationPrompt: `You are a senior business operations consultant and client experience strategist.

Create a comprehensive Client Communication Protocols document.

This document will set clear expectations for how the business and its clients communicate — reducing misunderstandings, managing response time expectations, and protecting the business from communication overload.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create communication protocols that:

• Set clear channel preferences
• Define response time expectations
• Establish escalation procedures
• Protect the business from out-of-hours demands
• Reduce communication friction
• Maintain professional standards

────────────────────────
REQUIRED SECTIONS
────────────────────────

Preferred Communication Channels

Expected Response Times

Out-of-Hours Policy

Emergency Contact Procedure

Meeting & Call Protocols

Document Sharing & Approval

Feedback Timelines

Escalation Procedure

Communication Dos and Don'ts

Breach of Communication Standards

────────────────────────
PROFESSIONAL STANDARDS
────────────────────────

Review the client brief.

Identify communication challenges specific to this business.

Create protocols that address the most common communication problems in this industry.

────────────────────────
TONE & PRESENTATION
────────────────────────

The document must be:

• Professional but approachable
• Clear and specific
• Not aggressive
• Branded to the business

────────────────────────
OUTPUT
────────────────────────

Return only the completed communication protocols document.

Ready for PDF and DOCX formatting.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'welcome_packet_guide',
    document_label: 'Welcome Packet Guide',
    generationPrompt: `You are a senior client experience consultant, brand strategist, and business operations specialist.

Create a professional New Client Welcome Packet.

This is not a simple welcome letter.

This is a comprehensive first impression — the first tangible experience a new client has with this business.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a welcome packet that:

• Builds immediate confidence in the decision to hire
• Demonstrates professionalism and organisation
• Sets clear expectations before work begins
• Reduces anxiety and uncertainty
• Creates a premium client experience

────────────────────────
REQUIRED SECTIONS
────────────────────────

Personal Welcome Message

About the Business

How We Work

What Happens Next

Your Onboarding Timeline

Key Contacts & Communication Details

What We Need From You

Important Documents Enclosed

Frequently Asked Questions

Our Promise to You

────────────────────────
DESIGN REQUIREMENTS
────────────────────────

Create a document that feels premium.

Use the client's:

• Brand colours
• Brand tone
• Professional identity
• Industry positioning

The welcome packet must feel custom created for this business.

Not generic.

Not templated.

────────────────────────
PSYCHOLOGY REQUIREMENTS
────────────────────────

Throughout the packet:

Reinforce the client's buying decision.

Create confidence.

Reduce buyer's remorse.

Establish authority and professionalism.

────────────────────────
OUTPUT
────────────────────────

Return only the completed welcome packet.

Ready for PDF and DOCX formatting.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'feedback_closing_questionnaire',
    document_label: 'Feedback & Closing Questionnaire',
    generationPrompt: `You are a senior client experience consultant and business development specialist.

Create a professional Feedback & Closing Questionnaire.

This document will be sent to clients at the end of each engagement.

It must gather actionable feedback, capture testimonial opportunities, and support ongoing business development.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a closing questionnaire that:

• Captures genuine client satisfaction data
• Identifies improvement opportunities
• Gathers testimonials and reviews
• Assesses referral likelihood
• Identifies potential ongoing work
• Creates a professional end to every engagement

────────────────────────
REQUIRED SECTIONS
────────────────────────

Overall Satisfaction

Service Quality Assessment

Communication & Responsiveness

Value for Money

Outcome Achievement

What Worked Well

What Could Be Improved

Testimonial Consent & Capture

Referral Likelihood (Net Promoter Style)

Future Work Interest

Permission to Use Feedback

────────────────────────
DESIGN REQUIREMENTS
────────────────────────

Create a branded, professional document.

Use a rating scale format where appropriate.

Include space for written responses.

Easy to complete in under ten minutes.

────────────────────────
BUSINESS DEVELOPMENT INTELLIGENCE
────────────────────────

Review the client brief.

Add questions specific to the services delivered.

Identify opportunities to ask about adjacent services or future needs.

────────────────────────
OUTPUT
────────────────────────

Return only the completed feedback and closing questionnaire.

Ready for PDF, DOCX, and digital form formatting.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // ─── Payment Protection Pack ────────────────────────────────────────────────

  {
    document_type: 'invoice_terms_conditions',
    document_label: 'Invoice Terms & Conditions',
    generationPrompt: `You are a senior UK commercial solicitor and credit control specialist.

Create comprehensive Invoice Terms & Conditions.

These terms will appear on every invoice issued by the business.

They must be legally enforceable under England & Wales law and protect the business's revenue.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create invoice terms that:

• Establish unambiguous payment obligations
• Define late payment consequences clearly
• Protect the business's right to charge interest
• Enable debt recovery cost recovery
• Deter chargeback attempts
• Reduce late payment incidents

────────────────────────
REQUIRED SECTIONS
────────────────────────

Payment Due Date

Accepted Payment Methods

Late Payment Interest

Statutory Interest Rights

Debt Recovery Costs

Disputed Invoice Procedure

Suspension of Services for Non-Payment

Chargeback Policy

Ownership Retention Until Full Payment

Governing Law

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Late Payment of Commercial Debts (Interest) Act 1998.

Include:

• Statutory interest rate (currently 8% above Bank of England base rate)
• Right to claim £40–£100 fixed debt recovery cost depending on invoice value
• Right to claim reasonable debt recovery costs beyond the fixed fee

Ensure compliance with England & Wales law.

Do not include misleading legal claims.

Do not overstate rights.

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Tailor the payment terms to the specific pricing model and service type.

────────────────────────
OUTPUT
────────────────────────

Return only the completed invoice terms and conditions.

Formatted for inclusion on invoices and standalone use.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'late_payment_policy',
    document_label: 'Late Payment Policy',
    generationPrompt: `You are a senior UK commercial solicitor, credit control specialist, and debt recovery expert.

Create a comprehensive Late Payment Policy.

This policy must protect the business's cash flow, be legally enforceable, and be suitable for publication on the business website and inclusion in client contracts.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a policy that:

• Defines what constitutes late payment
• Establishes escalation stages clearly
• Protects the business's right to charge interest and costs
• Enables suspension of services for non-payment
• Supports legal recovery action if required
• Deters late payment before it occurs

────────────────────────
REQUIRED SECTIONS
────────────────────────

Policy Statement

Scope

Payment Due Dates

Grace Period (if any)

Late Payment Definition

Escalation Stage 1 — Reminder
Escalation Stage 2 — Formal Notice
Escalation Stage 3 — Final Demand
Escalation Stage 4 — Legal Proceedings

Late Payment Interest

Debt Recovery Costs

Suspension of Services

Account Reinstatement

Legal Proceedings

Policy Review

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Late Payment of Commercial Debts (Interest) Act 1998.

Include:

• Statutory interest rate (8% above Bank of England base rate for business-to-business transactions)
• Fixed debt recovery compensation (£40 for debts under £1,000; £70 for £1,000–£9,999; £100 for debts of £10,000 or more)
• Right to reasonable additional recovery costs

Ensure compliance with England & Wales law.

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Adjust escalation timelines to the business's typical invoice values and client profile.

────────────────────────
OUTPUT
────────────────────────

Return only the completed late payment policy.

Ready for PDF, DOCX, and website publication.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'payment_schedule_template',
    document_label: 'Payment Schedule Template',
    generationPrompt: `You are a senior commercial finance consultant and project billing specialist.

Create a professional Payment Schedule Template.

This template will be used for every client engagement where payment is structured across multiple milestones.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a payment schedule that:

• Structures payments clearly across project phases
• Protects cash flow throughout the engagement
• Defines trigger conditions for each payment stage
• Reduces payment disputes
• Aligns with the project timeline

────────────────────────
REQUIRED SECTIONS
────────────────────────

Project Reference

Client Details

Total Engagement Value

Deposit — Amount, Due Date, Conditions

Progress Payment(s) — Amount, Due Date, Milestone Trigger

Final Payment — Amount, Due Date, Delivery Conditions

VAT Treatment

Payment Method Details

Late Payment Conditions

Schedule Agreement & Sign-Off

────────────────────────
TEMPLATES TO INCLUDE
────────────────────────

Create three versions:

1. Two-stage schedule (deposit + final payment)

2. Three-stage schedule (deposit + midpoint + final payment)

3. Monthly/recurring schedule template

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Include wording that:

• Progress payments are due regardless of project status
• Final payment is due before final delivery of work
• Late payment interest applies as per invoice terms
• Non-payment suspends further delivery

────────────────────────
OUTPUT
────────────────────────

Return all three payment schedule templates.

Ready for PDF and DOCX formatting.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'refund_policy_document',
    document_label: 'Refund & Cancellation Policy',
    generationPrompt: `You are a senior UK commercial solicitor specialising in consumer rights, digital services, and bespoke professional service contracts.

Create a comprehensive Refund & Cancellation Policy.

This policy must protect the business's revenue while remaining fair and compliant with UK consumer and commercial law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a policy that:

• Protects revenue on bespoke and time-invested work
• Addresses cancellation at different project stages
• Handles digital services appropriately
• Reduces chargeback risk
• Remains commercially fair and legally defensible
• Complies with the Consumer Rights Act 2015 where applicable

────────────────────────
REQUIRED SECTIONS
────────────────────────

Policy Overview

Services Covered

Right to Cancel (Consumer Rights Act 2015)

Cancellation by Client — Pre-Commencement

Cancellation by Client — Mid-Project

Cancellation by Client — Near or Post-Completion

Cancellation by the Business

Bespoke Work Provisions

Digital Services Provisions

Deposit Refund Policy

Partial Refund Framework

Refund Process & Timescales

Disputes

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Address the Consumer Rights Act 2015 clearly.

Where relevant include:

• Right to cancel within 14 days for distance selling (and how the business handles this for bespoke digital work)
• Loss of cancellation right once work has commenced with consumer consent
• Treatment of deposits as consideration for time reserved

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Adapt the refund structure to the specific services and pricing model.

────────────────────────
OUTPUT
────────────────────────

Return only the completed refund and cancellation policy.

Ready for PDF, DOCX, and website publication.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'deposit_cancellation_terms',
    document_label: 'Deposit & Cancellation Terms',
    generationPrompt: `You are a senior UK commercial solicitor specialising in service contracts and deposit protection.

Create comprehensive Deposit & Cancellation Terms.

These terms must protect the business's revenue when clients cancel and ensure deposits are legally retained.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create terms that:

• Clearly establish non-refundable deposit status
• Define cancellation windows with appropriate outcomes
• Protect the business against client abandonment
• Are legally enforceable under England & Wales law
• Remain commercially fair

────────────────────────
REQUIRED SECTIONS
────────────────────────

Deposit Requirement

Deposit Amount and Conditions

Non-Refundable Status

What the Deposit Secures

Cancellation Windows:
  — 14+ days before start
  — 7–13 days before start
  — Less than 7 days before start
  — After work has commenced

Client Abandonment Clause

Rescheduling Policy

Business Cancellation

Consequences of Cancellation

Payment of Outstanding Balance on Cancellation

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Establish the deposit as genuine consideration for time reserved.

Address the Consumer Rights Act 2015 fairly.

Include client abandonment provisions for situations where:

• Client stops responding
• Client fails to provide required information
• Client delays project indefinitely

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Adapt deposit percentages and cancellation windows to the business's typical project values and timescales.

────────────────────────
OUTPUT
────────────────────────

Return only the completed deposit and cancellation terms.

Ready for PDF, DOCX, and contract inclusion.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'payment_tracking_template',
    document_label: 'Payment Tracking Template',
    generationPrompt: `You are a senior finance operations consultant and credit control specialist.

Create a professional Payment Tracking Template.

This template will be used by the business owner to track all outstanding invoices, monitor payment status, and manage credit control efficiently.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a tracking system that:

• Gives instant visibility of all outstanding payments
• Tracks invoice status from issue to receipt
• Flags overdue invoices immediately
• Supports escalation decisions
• Maintains a clear payment history

────────────────────────
REQUIRED COLUMNS
────────────────────────

Invoice Reference Number

Client Name

Invoice Date

Due Date

Invoice Amount

VAT Amount

Total Due

Payment Method

Date Paid

Amount Received

Outstanding Balance

Days Overdue

Follow-Up Action

Follow-Up Date

Notes

Status (Paid / Outstanding / Overdue / Disputed / Written Off)

────────────────────────
ADDITIONAL DELIVERABLES
────────────────────────

Include a summary dashboard section with:

• Total invoiced (this month / this year)
• Total received
• Total outstanding
• Total overdue
• Count of outstanding invoices

Include guidance notes on how to use the template.

Include colour coding guidance for status categories.

────────────────────────
OUTPUT
────────────────────────

Return the complete payment tracking template with all sections.

Ready for spreadsheet (Excel/Google Sheets) implementation.

Include clear instructions for daily use.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'chasing_payment_scripts',
    document_label: 'Chasing Payment Scripts',
    generationPrompt: `You are a senior UK commercial debt recovery solicitor, credit control specialist, and business communications consultant.

Create a complete Chasing Payment Scripts Package — five professionally escalating scripts for recovering outstanding invoices.

This package must balance professionalism with firmness, maximise payment recovery rates, and protect the business's legal position throughout.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a five-stage payment recovery sequence that:

• Progressively increases pressure
• Maintains professionalism throughout
• Creates a strong legal paper trail
• Maximises voluntary payment
• Protects the right to pursue legal recovery if required

────────────────────────
SCRIPT 1 — FRIENDLY REMINDER
────────────────────────

Tone: Helpful, assuming oversight

Purpose: First contact after due date passes

Include:
• Email subject line
• Letter version
• Email version

Psychology: Assume non-payment is an error.

────────────────────────
SCRIPT 2 — FORMAL PAYMENT NOTICE
────────────────────────

Tone: Firm, professional

Purpose: Escalate after no response to Script 1

Include:
• Email subject line
• Letter version
• Email version

Reference:
• Original invoice
• Previous reminder
• Payment terms
• Consequences of continued non-payment

────────────────────────
SCRIPT 3 — FINAL PAYMENT DEMAND
────────────────────────

Tone: Direct, serious

Purpose: Final attempt before formal action

Include:
• Email subject line
• Letter version
• Email version

Reference:
• All prior communications
• Late payment interest accruing
• Debt recovery costs
• Clear final deadline

────────────────────────
SCRIPT 4 — LETTER BEFORE ACTION
────────────────────────

Tone: Formal legal tone

Purpose: Final step before legal proceedings

This must be a proper Letter Before Action (LBA) suitable for use before County Court proceedings.

Include:
• Full formal letter

Reference:
• Late Payment of Commercial Debts (Interest) Act 1998
• Specific amount owed including interest
• Final payment deadline
• County Court proceedings warning
• Debt recovery costs warning

────────────────────────
SCRIPT 5 — CLIENT GHOSTING / ABANDONED DEBT
────────────────────────

Tone: Firm, factual

Purpose: For situations where client has stopped responding

Include:
• Email version
• Letter version

Reference:
• Work completed
• Multiple unanswered contact attempts
• Final opportunity before formal escalation

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Late Payment of Commercial Debts (Interest) Act 1998 in Scripts 3 and 4.

Do NOT make threats that cannot be carried out.

Do NOT overstate legal rights.

Do NOT use aggressive or intimidating language.

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Ensure the tone and language match the business's brand voice.

Adapt the scripts to the typical client profile and invoice values.

────────────────────────
OUTPUT
────────────────────────

Return all five scripts fully written.

Ready for immediate use.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'chargeback_response_templates',
    document_label: 'Chargeback Response Templates',
    generationPrompt: `You are a senior commercial solicitor, disputes specialist, and payment fraud consultant.

Create a comprehensive Chargeback Response Templates Package.

These templates will be used by the business to dispute card payment chargebacks and protect revenue from fraudulent or unfair disputes.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create response templates that:

• Present the strongest possible defence against chargebacks
• Structure evidence clearly and professionally
• Demonstrate contract compliance and service delivery
• Increase chargeback dispute success rates
• Protect the business's payment processing standing

────────────────────────
TEMPLATE 1 — STRIPE DISPUTE RESPONSE
────────────────────────

Structured for Stripe's dispute submission format.

Include:
• Introduction statement
• Contract summary section
• Service delivery evidence section
• Timeline of events
• Evidence checklist
• Closing statement

────────────────────────
TEMPLATE 2 — CARD SCHEME DISPUTE RESPONSE
────────────────────────

Suitable for Visa and Mastercard disputes via the card issuer.

Include:
• Formal response letter
• Contract terms summary
• Proof of delivery section
• Client communications summary
• Supporting evidence list

────────────────────────
TEMPLATE 3 — PAYPAL DISPUTE RESPONSE
────────────────────────

Structured for PayPal's dispute and claim process.

Include:
• Case summary
• Evidence narrative
• Timeline section
• Supporting documents list

────────────────────────
EVIDENCE GUIDANCE
────────────────────────

Include a standalone Evidence Guidance Section covering:

• What evidence to gather for each dispute type
• How to present evidence effectively
• Common chargeback reasons and how to counter each

────────────────────────
LEGAL & COMPLIANCE REQUIREMENTS
────────────────────────

All templates must:

• Be factual and professional
• Reference the signed contract
• Reference proof of delivery
• Not contain exaggerations or false claims

────────────────────────
OUTPUT
────────────────────────

Return all three templates and the evidence guidance section.

Ready for immediate use.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // ─── Copyright & Licensing Pack ─────────────────────────────────────────────

  {
    document_type: 'copyright_notice_ip_policy',
    document_label: 'Copyright Notice & IP Policy',
    generationPrompt: `You are a senior UK intellectual property solicitor specialising in copyright, creative industries, and digital content.

Create a comprehensive Copyright Notice & Intellectual Property Policy.

This document must protect the business's creative output and be legally enforceable under England & Wales law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create an IP policy that:

• Asserts copyright ownership clearly and unambiguously
• Defines permitted and prohibited uses of deliverables
• Establishes consequences for unauthorised use
• Protects the business's commercial interests
• Applies to all work produced by or for the business

────────────────────────
REQUIRED SECTIONS
────────────────────────

Copyright Ownership Statement

Works Covered by This Policy

Permitted Uses

Prohibited Uses

Licence Grant (upon full payment)

Conditions of Licence

Third-Party Assets

Moral Rights

Breach of Copyright

Reporting Infringement

Consequences & Remedies

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Copyright, Designs and Patents Act 1988 (CDPA 1988).

Address:

• Automatic copyright in original creative works
• Duration of copyright protection
• Moral rights of the creator
• Consequences of infringement
• Licences vs assignment distinction

Ensure compliance with England & Wales law.

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Adapt the policy to the specific types of work produced by this business.

Address the most relevant IP risks for this industry.

────────────────────────
OUTPUT
────────────────────────

Return only the completed copyright notice and IP policy.

Ready for PDF, DOCX, and website publication.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'content_licensing_agreement',
    document_label: 'Content Licensing Agreement',
    generationPrompt: `You are a senior UK intellectual property solicitor specialising in content licensing and creative industry agreements.

Create a comprehensive Content Licensing Agreement.

This agreement will govern how clients may use content and deliverables produced by the business.

It must be legally enforceable under England & Wales law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a licensing agreement that:

• Clearly defines what is being licensed
• Specifies the scope, territory, and duration of the licence
• Lists permitted and prohibited uses
• Protects the business's underlying IP rights
• Establishes payment conditions for the licence
• Defines consequences for breach

────────────────────────
REQUIRED SECTIONS
────────────────────────

Definitions

Licence Grant

Scope of Licence:
  — Permitted Territory
  — Permitted Duration
  — Permitted Media & Channels
  — Permitted Uses

Restrictions & Prohibited Uses

Moral Rights

Attribution Requirements

Payment Conditions

Modifications & Derivative Works

Sub-licensing

Termination

Consequences of Breach

Surviving Obligations

Governing Law

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Copyright, Designs and Patents Act 1988.

Distinguish clearly between a licence (permission to use) and an assignment (transfer of ownership).

Address moral rights and whether the creator has asserted them.

Ensure compliance with England & Wales law.

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Adapt the licensing scope to the specific types of content produced.

────────────────────────
OUTPUT
────────────────────────

Return only the completed content licensing agreement.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'image_media_usage_rights',
    document_label: 'Image & Media Usage Rights',
    generationPrompt: `You are a senior UK intellectual property solicitor and media licensing specialist.

Create a comprehensive Image & Media Usage Rights document.

This document will govern how clients and third parties may use images, videos, audio, and other media created or supplied by the business.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a usage rights document that:

• Defines precisely what can and cannot be done with media assets
• Protects the creator's copyright
• Distinguishes between personal and commercial use
• Addresses digital and print permissions separately
• Covers social media usage specifically
• Prevents unauthorised distribution

────────────────────────
REQUIRED SECTIONS
────────────────────────

Media Covered by This Agreement

Personal Use Licence

Commercial Use Licence

Print Usage Rights

Digital & Online Usage Rights

Social Media Usage Rights

Editorial Usage

Advertising & Promotional Use

Broadcast Rights

Modifications & Editing

Model Release & Property Release Status

Third-Party Licensing Restrictions

Duration of Rights

Geographic Territory

Expiry & Renewal

Breach & Consequences

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Copyright, Designs and Patents Act 1988.

Address:

• Model releases where relevant
• Property releases where relevant
• Stock image licensing distinctions
• Reverse engineering or AI training restrictions (where applicable)

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Adapt to the specific types of media produced by this business (photography, video, graphic design, etc.).

────────────────────────
OUTPUT
────────────────────────

Return only the completed image and media usage rights document.

Ready for PDF, DOCX, and delivery to clients.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'work_for_hire_agreement',
    document_label: 'Work-for-Hire Agreement',
    generationPrompt: `You are a senior UK intellectual property solicitor specialising in commissioned work and copyright assignment.

Create a comprehensive Work-for-Hire Agreement.

This agreement must clearly establish IP ownership when the business creates commissioned work for clients.

It must be legally enforceable under England & Wales law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create an agreement that:

• Clarifies who owns the intellectual property in commissioned work
• Documents the consideration (payment) for any IP transfer
• Addresses moral rights appropriately
• Protects the business's portfolio rights
• Prevents future IP ownership disputes

────────────────────────
REQUIRED SECTIONS
────────────────────────

Definitions

Parties

Description of Work

IP Ownership (pre and post delivery)

Assignment of Rights (if applicable):
  — What is being assigned
  — Consideration
  — Warranty of ownership

Retained Rights of the Creator

Portfolio Rights

Moral Rights

Source Files & Working Materials

Delivery Conditions

Payment Conditions

Representations & Warranties

Consequences of Breach

Governing Law

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Copyright, Designs and Patents Act 1988.

Address:

• Default copyright position in the UK (creator owns unless assigned)
• Assignment requires written agreement and consideration
• Moral rights (right of attribution, right of integrity)
• Distinction between employee and contractor positions

Do NOT assign moral rights as these cannot be assigned under UK law — only waived.

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Adapt to the specific creative services provided.

────────────────────────
OUTPUT
────────────────────────

Return only the completed work-for-hire agreement.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'brand_usage_guidelines',
    document_label: 'Brand Usage Guidelines',
    generationPrompt: `You are a senior brand strategist, intellectual property consultant, and business communications specialist.

Create comprehensive Brand Usage Guidelines.

These guidelines will govern how third parties — clients, partners, affiliates, press, and the public — may use the business's brand assets.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create guidelines that:

• Protect the business's brand integrity
• Define exactly what third parties may and may not do
• Cover all brand asset types (logo, colours, typography, imagery, tone)
• Establish approval processes for brand usage
• Prevent unauthorised or damaging use of the brand

────────────────────────
REQUIRED SECTIONS
────────────────────────

Brand Overview

Brand Assets Covered:
  — Primary Logo
  — Secondary Logo Variations
  — Brand Colours (with hex codes)
  — Typography
  — Photography Style
  — Tone of Voice

Permitted Uses

Prohibited Uses

Logo Usage Rules:
  — Minimum size
  — Clear space
  — Permitted backgrounds
  — Colour variants
  — Do's and Don'ts

Co-Branding Rules

Press & Media Usage

Social Media Tagging Policy

Approval Process for Third-Party Use

Breach & Consequences

Brand Asset Request Process

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Use the actual brand colours, fonts, and visual identity described.

Create guidelines that feel genuinely specific to this business.

────────────────────────
OUTPUT
────────────────────────

Return only the completed brand usage guidelines.

Ready for PDF, DOCX, and website publication.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'nda_agreement',
    document_label: 'Non-Disclosure Agreement (NDA)',
    generationPrompt: `You are a senior UK commercial solicitor specialising in confidentiality agreements and business contracts.

Create a comprehensive Non-Disclosure Agreement (NDA).

This agreement must protect confidential business information and be legally enforceable under England & Wales law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create an NDA that:

• Clearly defines confidential information
• Establishes binding confidentiality obligations
• Permits necessary disclosures only
• Survives termination of the relationship
• Enables legal remedies for breach
• Is suitable for use with clients, suppliers, and partners

────────────────────────
REQUIRED SECTIONS
────────────────────────

Parties

Recitals

Definitions:
  — Confidential Information
  — Permitted Purpose
  — Recipient
  — Disclosing Party

Confidentiality Obligations

Permitted Disclosures (e.g. legal requirements, professional advisers)

Excluded Information

Duration of Obligations

Permitted Use

Return & Destruction of Materials

Remedies for Breach

No Licence Granted

Independent Contractor Status

Entire Agreement

Governing Law

Signature Blocks

────────────────────────
VERSIONS TO INCLUDE
────────────────────────

Create two versions:

1. Mutual NDA (both parties share and receive confidential information)

2. One-Way NDA (disclosing party to recipient only)

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Draft in accordance with England & Wales law.

Ensure consideration is present (reference to the business relationship).

Include injunctive relief as a remedy, acknowledging damages may be inadequate.

────────────────────────
OUTPUT
────────────────────────

Return both NDA versions fully drafted.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'ip_assignment_agreement',
    document_label: 'IP Assignment Agreement',
    generationPrompt: `You are a senior UK intellectual property solicitor specialising in copyright assignment and creative industry transactions.

Create a comprehensive IP Assignment Agreement.

This agreement will formally transfer intellectual property rights from the creator to the client upon specified conditions.

It must be legally enforceable under England & Wales law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create an assignment agreement that:

• Formally transfers agreed IP rights to the client
• Documents appropriate consideration for the assignment
• Clearly limits what is and is not being assigned
• Retains portfolio rights for the creator where appropriate
• Addresses moral rights appropriately
• Is legally valid under UK copyright law

────────────────────────
REQUIRED SECTIONS
────────────────────────

Parties

Background & Recitals

Definitions

Assigned Works

IP Rights Being Assigned

Excluded Rights

Consideration

Warranties of Ownership & Originality

Third-Party Content

Moral Rights (Waiver where applicable)

Portfolio & Attribution Rights

Delivery Conditions

Payment Conditions

Indemnity

Governing Law

Execution & Signatures

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Copyright, Designs and Patents Act 1988.

Include:

• Assignment must be in writing and signed to be valid under UK law (s.90 CDPA 1988)
• Future copyright can be assigned if sufficiently defined
• Moral rights cannot be assigned but can be waived (s.87 CDPA 1988)
• Consideration is required for a binding assignment

────────────────────────
BUSINESS-SPECIFIC CUSTOMISATION
────────────────────────

Review the client brief.

Adapt to the specific creative services and IP types relevant to this business.

────────────────────────
OUTPUT
────────────────────────

Return only the completed IP assignment agreement.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'cease_desist_template',
    document_label: 'Cease & Desist Template',
    generationPrompt: `You are a senior UK intellectual property solicitor specialising in copyright infringement, brand protection, and enforcement letters.

Create a professional Cease & Desist Letter Template for IP infringement situations.

This template must be legally robust, professionally drafted, and effective in stopping infringing activity.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a cease and desist template that:

• Clearly identifies the infringing act
• States the legal basis for the claim
• Makes specific, achievable demands
• Sets a firm but reasonable deadline
• Reserves all legal rights
• Deters further infringement without unnecessary escalation

────────────────────────
REQUIRED SECTIONS
────────────────────────

Without Prejudice Header (where appropriate)

Addressee Details

Introduction & Identification of Sender

Identification of Infringing Work or Act

Legal Basis for the Claim

Demands:
  — Immediate cessation of infringement
  — Removal of infringing content
  — Destruction of infringing copies
  — Account of profits (where appropriate)
  — Written confirmation of compliance

Deadline for Compliance

Reservation of Rights

Consequences of Non-Compliance

────────────────────────
VERSIONS TO INCLUDE
────────────────────────

Create three versions:

1. Copyright infringement (use of creative work without licence)

2. Brand / trademark infringement (unauthorised use of business name, logo, brand)

3. Confidentiality / NDA breach

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Copyright, Designs and Patents Act 1988 for copyright claims.

Do NOT make threats that cannot be carried out.

Do NOT include false statements.

The letter must be:

• Factual
• Specific
• Professional
• Measured

────────────────────────
OUTPUT
────────────────────────

Return all three versions of the cease and desist template.

Ready for PDF and DOCX use.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // ─── GDPR & Data Retention Deep Pack ────────────────────────────────────────

  {
    document_type: 'comprehensive_privacy_policy',
    document_label: 'Comprehensive Privacy Policy',
    generationPrompt: `You are a UK GDPR expert, ICO compliance specialist, and data protection solicitor.

Create a comprehensive, ICO-aligned Privacy Policy that goes significantly beyond the standard foundation-level policy.

This document must meet the full requirements of UK GDPR Articles 13 and 14 and be suitable for sophisticated regulatory scrutiny.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a comprehensive privacy policy that:

• Meets every UK GDPR Article 13/14 requirement
• Covers all lawful bases for processing in detail
• Addresses legitimate interests with proper assessment
• Covers automated decision-making and profiling
• Addresses international data transfers post-Brexit
• Is suitable for ICO audit and professional due diligence
• Goes beyond the basic privacy policy included in the Business Foundations Pack

────────────────────────
REQUIRED SECTIONS
────────────────────────

Data Controller Identity & Contact Details

DPO Contact (or explanation of why not required)

Categories of Personal Data Collected

Special Category Data

How Data is Collected

All Lawful Bases for Processing (with specific justifications)

Legitimate Interests Assessments Summary

Purposes of Processing

Automated Decision-Making & Profiling

Data Sharing:
  — Processors
  — Third Parties
  — Legal Obligations

International Transfers (UK Adequacy Decisions)

Data Retention Periods by Category

Data Security Measures

Individual Rights (all 8 rights under UK GDPR)

Complaints to the ICO

Cookies & Tracking Technologies

Analytics & Advertising

Children's Data Policy

Marketing Communications & Consent

Updates to This Policy

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference UK GDPR and Data Protection Act 2018.

Do NOT reference EU GDPR as the primary legislation (UK GDPR applies post-Brexit).

Reference ICO guidance where relevant.

────────────────────────
OUTPUT
────────────────────────

Return only the completed comprehensive privacy policy.

Ready for PDF, DOCX, and website publication.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'data_retention_schedule',
    document_label: 'Data Retention Schedule',
    generationPrompt: `You are a UK GDPR specialist and data governance consultant.

Create a comprehensive Data Retention Schedule.

This document must define how long each category of personal data is retained, the justification for each period, how data is deleted, and when the schedule is reviewed.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a retention schedule that:

• Covers all categories of personal data processed by the business
• Justifies each retention period with a lawful basis
• Defines deletion procedures for each category
• Meets the UK GDPR data minimisation and storage limitation principles
• Supports ICO audit readiness
• Is practical for a sole trader or small business to maintain

────────────────────────
REQUIRED COLUMNS
────────────────────────

Data Category

Description of Data

Purpose of Processing

Lawful Basis

Retention Period

Justification for Period

Trigger for Deletion

Deletion Method

Responsible Party

Review Date

────────────────────────
DATA CATEGORIES TO COVER
────────────────────────

Include retention schedules for:

• Client contact and identity data
• Contract and engagement records
• Financial and invoicing records (HMRC requirements)
• Bank and payment records
• Marketing and email lists
• Website analytics
• Cookies and tracking data
• Employee / contractor records (if applicable)
• Enquiry and prospect data
• Website contact form submissions
• Social media interactions

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference UK GDPR Article 5(1)(e) — storage limitation principle.

Reference relevant non-GDPR legal retention requirements:

• Companies Act 2006 (accounting records — 6 years)
• HMRC requirements (tax records — 5-6 years)
• Contracts Act limitation periods (6 years for simple contracts; 12 years for deeds)

────────────────────────
OUTPUT
────────────────────────

Return the completed data retention schedule.

Ready for PDF, DOCX, and spreadsheet implementation.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'data_processing_agreement',
    document_label: 'Data Processing Agreement (DPA)',
    generationPrompt: `You are a UK GDPR solicitor and data protection specialist.

Create a comprehensive Data Processing Agreement (DPA).

This agreement must comply fully with UK GDPR Article 28 and be suitable for use where the business processes personal data on behalf of a controller, or engages processors to process data on its behalf.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a DPA that:

• Meets every UK GDPR Article 28 requirement
• Covers both directions (as processor and as controller)
• Provides clear processing instructions
• Establishes security and breach notification obligations
• Governs sub-processor relationships
• Supports ICO audit readiness

────────────────────────
REQUIRED SECTIONS
────────────────────────

Parties & Recitals

Definitions

Subject Matter of Processing

Duration of Processing

Nature of Processing

Purpose of Processing

Type of Personal Data

Categories of Data Subjects

Controller's Obligations

Processor's Obligations:
  — Process only on written instructions
  — Confidentiality obligations on staff
  — Appropriate technical and organisational security measures
  — Sub-processor restrictions
  — Data subject rights assistance
  — Deletion / return at end of relationship
  — Audit assistance

Sub-Processors:
  — Current approved list
  — Prior authorisation requirement for new sub-processors
  — Sub-processor DPA requirement

Data Subject Rights Assistance

Data Breach Notification (72 hours to controller)

Data Protection Impact Assessments

International Transfers

Audit Rights

Liability

Term & Termination

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference UK GDPR Article 28 throughout.

Reference Data Protection Act 2018 where appropriate.

────────────────────────
OUTPUT
────────────────────────

Return only the completed data processing agreement.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'cookie_consent_implementation',
    document_label: 'Cookie Consent Implementation Guide',
    generationPrompt: `You are a UK GDPR compliance specialist, PECR expert, and web privacy consultant.

Create a comprehensive Cookie Consent Implementation Guide.

This document must give the business a practical, step-by-step guide for implementing compliant cookie consent on their website.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a guide that:

• Explains PECR requirements clearly
• Categorises cookies accurately
• Provides a compliant consent mechanism
• Gives practical implementation steps
• Includes a ready-to-use cookie policy
• Is achievable for a non-technical business owner

────────────────────────
REQUIRED SECTIONS
────────────────────────

What Are Cookies & Why They Matter

UK Legal Requirements (PECR + UK GDPR)

Cookie Categorisation:
  — Strictly Necessary Cookies (no consent required)
  — Functional / Preference Cookies
  — Analytics Cookies
  — Marketing / Advertising Cookies

Consent Requirements Per Category

What Valid Consent Looks Like

What Consent Banners Must NOT Do (dark patterns)

Implementation Steps for Common Platforms:
  — WordPress / WooCommerce
  — Squarespace
  — Wix
  — Custom-built websites

Cookie Audit Process

Cookie Policy Template

Consent Record-Keeping

When to Review Your Cookie Implementation

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference the Privacy and Electronic Communications Regulations 2003 (PECR) as amended.

Reference UK GDPR where processing of personal data is involved.

Reference ICO guidance on cookies.

Address the common misconception that consent banners alone are sufficient — the consent mechanism itself must also be compliant.

────────────────────────
INCLUDED COOKIE POLICY
────────────────────────

Include a ready-to-use Cookie Policy document as an appendix.

Tailored to the client's specific website and cookie types.

────────────────────────
OUTPUT
────────────────────────

Return the complete cookie consent implementation guide and cookie policy.

Ready for PDF and DOCX format.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'subject_access_request_template',
    document_label: 'Subject Access Request Template',
    generationPrompt: `You are a UK GDPR compliance specialist and data rights consultant.

Create a comprehensive Subject Access Request (SAR) Response Template Package.

This package must give the business everything needed to respond to SARs correctly, within statutory timescales, and in a way that satisfies ICO requirements.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a SAR package that:

• Meets all UK GDPR Article 15 requirements
• Includes an acknowledgement letter
• Covers identity verification procedures
• Provides a response letter template
• Addresses exemptions appropriately
• Includes a timeline tracking tool
• Protects the business from ICO complaints

────────────────────────
REQUIRED DOCUMENTS
────────────────────────

DOCUMENT 1 — SAR ACKNOWLEDGEMENT LETTER

Sent immediately upon receiving a SAR.

Include:
• Confirmation of receipt
• Identity verification request (if needed)
• 30-day response timeline
• Contact details for queries

────────────────────────

DOCUMENT 2 — IDENTITY VERIFICATION PROCESS

Step-by-step guide for verifying the requester's identity.

Include:
• What documents to request
• How to handle refusal to verify
• Timeline implications of verification delay

────────────────────────

DOCUMENT 3 — SAR RESPONSE LETTER TEMPLATE

Full response to the SAR once information is compiled.

Include:
• Introduction and legal basis
• Data categories provided
• Why certain data may not be provided (with exemptions)
• How data is used
• Retention periods
• Third parties data is shared with
• Rights of the data subject
• Right to complain to the ICO

────────────────────────

DOCUMENT 4 — SAR TIMELINE TRACKER

Simple tracking document for managing multiple SARs.

Include columns for:
• Date received
• Requester identity
• Verification status
• Response deadline
• Extensions (if applicable)
• Status

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference UK GDPR Article 15.

Address:
• 30 calendar day response deadline
• Extension to 3 months for complex requests (with notice within first month)
• Right to request reasonable fee for manifestly unfounded or excessive requests
• Exemptions under Schedule 2 of the Data Protection Act 2018

────────────────────────
OUTPUT
────────────────────────

Return all four documents.

Ready for PDF, DOCX, and immediate use.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'data_breach_notification_template',
    document_label: 'Data Breach Notification Template',
    generationPrompt: `You are a UK GDPR compliance specialist and data incident response consultant.

Create a comprehensive Data Breach Notification Template Package.

This package must enable the business to respond to personal data breaches correctly, notify the ICO within 72 hours where required, and communicate with affected individuals appropriately.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a breach notification package that:

• Enables fast, structured breach assessment
• Supports ICO notification within 72 hours where required
• Provides individual notification templates
• Creates an auditable breach record
• Protects the business from ICO enforcement action
• Meets all UK GDPR Articles 33 and 34 requirements

────────────────────────
REQUIRED DOCUMENTS
────────────────────────

DOCUMENT 1 — BREACH ASSESSMENT CHECKLIST

For use immediately when a potential breach is identified.

Include:
• What constitutes a reportable breach
• Assessment questions (type, cause, data involved, individuals affected)
• Risk scoring framework
• Decision tree: report to ICO? Yes/No/Maybe

────────────────────────

DOCUMENT 2 — ICO NOTIFICATION TEMPLATE

For reportable breaches (72-hour deadline from awareness).

Include all mandatory fields:
• Nature of the breach
• Categories of data involved
• Approximate number of individuals affected
• Likely consequences
• Measures taken or proposed

────────────────────────

DOCUMENT 3 — INDIVIDUAL NOTIFICATION LETTER TEMPLATE

For breaches likely to result in high risk to individuals.

Include:
• Clear description of the breach
• Likely consequences
• Measures taken
• Steps individuals can take to protect themselves
• Contact details for further information
• ICO complaint rights

────────────────────────

DOCUMENT 4 — BREACH LOG TEMPLATE

For recording all breaches (reportable and non-reportable).

Mandatory under UK GDPR Article 33(5).

Include columns for:
• Date of breach
• Nature of breach
• Data categories affected
• Individuals affected
• Risk assessment outcome
• ICO notified? (Y/N)
• Individuals notified? (Y/N)
• Remedial action
• Lessons learned

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference UK GDPR Articles 33 and 34.

Reference Data Protection Act 2018.

Address:
• 72-hour notification deadline to ICO
• "Without undue delay" notification to individuals for high-risk breaches
• Obligation to maintain a breach log regardless of whether ICO notification is required

────────────────────────
OUTPUT
────────────────────────

Return all four documents.

Ready for PDF, DOCX, and immediate use.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'dpia_template',
    document_label: 'Data Protection Impact Assessment (DPIA)',
    generationPrompt: `You are a UK GDPR compliance specialist and data protection consultant.

Create a comprehensive Data Protection Impact Assessment (DPIA) Template.

This template must meet the requirements of UK GDPR Article 35 and ICO DPIA guidance.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a DPIA template that:

• Meets every UK GDPR Article 35 requirement
• Is practical for a sole trader or small business to complete
• Identifies high-risk processing activities
• Assesses and mitigates privacy risks systematically
• Supports DPO consultation where required
• Creates an auditable record of privacy risk management

────────────────────────
REQUIRED SECTIONS
────────────────────────

PART 1 — PROJECT / PROCESSING DESCRIPTION

Purpose of the processing

Description of the processing operation

Scope and context

Data categories and volumes

Legal basis and necessity

Proportionality assessment

────────────────────────

PART 2 — NECESSITY & PROPORTIONALITY

Processing purpose and necessity

Minimum data necessary

Lawful basis

Balancing test (for legitimate interests)

────────────────────────

PART 3 — RISK IDENTIFICATION

Risk identification matrix

For each risk:
  — Description
  — Likelihood (1-5)
  — Severity (1-5)
  — Risk Score
  — Existing Controls
  — Residual Risk

────────────────────────

PART 4 — RISK MITIGATION MEASURES

Proposed measures for each identified risk

Responsibility

Implementation timeline

Residual risk after mitigation

Acceptance decision

────────────────────────

PART 5 — SIGN-OFF

Data controller sign-off

DPO advice (if applicable)

Outcome: Proceed / Proceed with mitigations / Do not proceed

Review date

────────────────────────

APPENDIX — WHEN IS A DPIA REQUIRED?

Practical guide covering:

• List of processing types requiring mandatory DPIA under ICO guidance
• Voluntary DPIA assessment checklist for lower-risk processing
• Common DPIA triggers for small businesses

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference UK GDPR Article 35.

Reference ICO DPIA guidance.

────────────────────────
OUTPUT
────────────────────────

Return the complete DPIA template and appendix.

Ready for PDF, DOCX, and practical use.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'marketing_consent_management',
    document_label: 'Marketing Consent Management Procedures',
    generationPrompt: `You are a UK GDPR compliance specialist, direct marketing expert, and PECR consultant.

Create comprehensive Marketing Consent Management Procedures.

These procedures must enable the business to obtain, record, and manage marketing consent lawfully — and comply with both UK GDPR and PECR requirements for electronic marketing.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create procedures that:

• Define what constitutes valid marketing consent under UK GDPR and PECR
• Provide practical consent collection mechanisms
• Establish consent record-keeping procedures
• Define withdrawal processes
• Address soft opt-in for existing customers
• Protect the business from ICO enforcement action for marketing violations

────────────────────────
REQUIRED SECTIONS
────────────────────────

What is Marketing Consent?

UK GDPR vs PECR Requirements

When is Consent Required?

The Soft Opt-In Rule for Existing Customers

What Valid Marketing Consent Looks Like:
  — Freely given
  — Specific
  — Informed
  — Unambiguous

Consent Collection Methods:
  — Website forms
  — In-person collection
  — Telephone
  — Physical forms

Consent Wording Templates (ready to use)

Consent Record-Keeping Requirements

The Consent Register Template

Withdrawal of Consent:
  — Unsubscribe mechanism
  — Processing withdrawal requests
  — Timescales
  — Suppression lists

Preference Management

Marketing Channel-Specific Rules:
  — Email marketing
  — SMS marketing
  — Post
  — Telephone (TPS / CTPS considerations)
  — Social media retargeting

Review & Audit Schedule

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference UK GDPR Article 7 (conditions for consent).

Reference PECR Regulation 22 (electronic mail marketing).

Reference the Telephone Preference Service (TPS) and Corporate Telephone Preference Service (CTPS) rules.

Reference ICO direct marketing guidance.

────────────────────────
OUTPUT
────────────────────────

Return the complete marketing consent management procedures.

Ready for PDF, DOCX, and internal policy use.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'third_party_data_sharing_agreement',
    document_label: 'Third-Party Data Sharing Agreement',
    generationPrompt: `You are a UK GDPR solicitor and data governance specialist.

Create a comprehensive Third-Party Data Sharing Agreement.

This agreement must govern the lawful sharing of personal data with third parties and comply fully with UK GDPR and the ICO's Data Sharing Code of Practice.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a data sharing agreement that:

• Establishes a lawful basis for the data share
• Defines the purpose and limits of sharing
• Protects individuals' privacy rights
• Establishes security expectations
• Allocates breach responsibility clearly
• Meets ICO Data Sharing Code of Practice requirements

────────────────────────
REQUIRED SECTIONS
────────────────────────

Parties

Background & Purpose

Definitions

Personal Data Being Shared:
  — Categories of data
  — Data subjects covered
  — Volumes

Lawful Basis for Sharing

Purpose Limitation

Data Minimisation

Recipient's Use of Data

Restrictions on Further Sharing

Data Retention by Recipient

Security Requirements

Data Subject Rights Obligations

Breach Notification Obligations

Audit Rights

Liability & Indemnity

Term & Termination

Return / Destruction of Data

Governing Law

────────────────────────
LEGAL REQUIREMENTS
────────────────────────

Reference UK GDPR — specifically:

• Article 5 (principles)
• Article 6 (lawful basis)
• Article 28 (where the recipient acts as processor)
• Articles 44-49 (international transfers, if applicable)

Reference the ICO Data Sharing Code of Practice.

Address the distinction between controller-to-controller sharing and controller-to-processor sharing.

────────────────────────
OUTPUT
────────────────────────

Return only the completed third-party data sharing agreement.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // ─── Coach Industry Pack (7 documents) ─────────────────────────────────

  {
    document_type: 'coaching_agreement',
    document_label: 'Coaching Agreement',
    generationPrompt: `You are a UK legal specialist in coaching and professional services contracts.

Create a comprehensive Coaching Agreement.

This agreement must govern the coaching engagement between a UK-based sole trader coach and their clients, complying with UK contract law and aligned with International Coach Federation (ICF) or European Mentoring & Coaching Council (EMCC) standards.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a coaching agreement that:

• Defines the scope and nature of the coaching engagement
• Establishes session format, duration, and scheduling terms
• Covers payment terms including session fees, packages, and cancellations
• Sets clear boundaries on coaching vs therapy, counselling, or medical advice
• Addresses confidentiality and its specific exceptions (risk of harm, legal duty, supervision)
• Includes data protection provisions compliant with UK GDPR
• Establishes professional standards and code of ethics commitment
• Covers termination, refund, and dispute resolution procedures

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Parties and definitions
2. Nature of coaching engagement (scope, boundaries, what coaching is NOT)
3. Session terms (format, length, frequency, scheduling)
4. Programme structure (individual sessions vs fixed programme vs retainer)
5. Fees and payment terms (session rate, package pricing, payment methods)
6. Cancellation and rescheduling policy (notice periods, late cancellation fees)
7. Confidentiality and data protection (with specific coaching exceptions)
8. Professional standards and code of ethics commitment
9. Supervision arrangements (if applicable)
10. Limitation of liability
11. Termination provisions
12. Dispute resolution
13. Governing law (England & Wales / Scotland / Northern Ireland as appropriate)

Use the client's brief to populate all specifics: coaching modality, accreditation, session format, programme structure, cancellation policy, and supervision details.

Return only the completed coaching agreement.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'session_terms_policy',
    document_label: 'Session Terms & Cancellation Policy',
    generationPrompt: `You are a UK professional services contract specialist with expertise in coaching and consultancy scheduling terms.

Create a comprehensive Session Terms & Cancellation Policy.

This policy must clearly define how coaching sessions are booked, rescheduled, and cancelled, including fee implications for late cancellations and no-shows.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a session terms policy that:

• Establishes clear booking and scheduling procedures
• Defines cancellation notice periods with fee consequences
• Covers rescheduling procedures and timeframes
• Addresses no-show policies and session forfeiture
• Handles programme-specific terms (fixed programme vs ad hoc sessions)
• Covers force majeure and exceptional circumstances
• Provides transparent fee structures for policy breaches

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Booking procedures and confirmation process
2. Session scheduling and availability
3. Cancellation policy by notice period (24h, 48h, 72h, etc.)
4. Late cancellation fees (percentage or fixed amount)
5. No-show policy and session forfeiture rules
6. Rescheduling procedures and limits
7. Programme-specific terms (sessions within a package)
8. Client-initiated vs coach-initiated changes
9. Emergency and force majeure provisions
10. Refund calculations for cancelled sessions
11. Communication requirements for changes

Use the client's brief to populate: session length, cancellation notice period, late cancellation fee policy, programme structure, and confidentiality exceptions.

Return only the completed session terms and cancellation policy.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'supervision_policy',
    document_label: 'Supervision Policy',
    generationPrompt: `You are a UK coaching professional standards specialist with expertise in supervision requirements for practising coaches.

Create a comprehensive Supervision Policy.

This policy must document the coach's supervision arrangements, professional accountability structures, and ethical oversight commitments, aligned with ICF, EMCC, or Association for Coaching (AC) supervision requirements.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a supervision policy that:

• Defines the purpose and scope of coaching supervision
• Documents the supervision arrangement (frequency, format, supervisor credentials)
• Establishes confidentiality boundaries within supervision
• Clarifies what client information is shared in supervision
• Addresses professional accountability and ethical oversight
• Covers the distinction between supervision, mentoring, and therapy
• Meets professional body requirements for supervision

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Purpose and definition of coaching supervision
2. Supervision arrangement (frequency, duration, format)
3. Supervisor credentials and professional standing
4. Confidentiality boundaries (what is and is not shared)
5. Client consent and awareness of supervision
6. Professional accountability framework
7. Ethical oversight and duty of care
8. Types of issues brought to supervision
9. Record-keeping within supervision
10. Professional body alignment statement

Use the client's brief to populate: supervision arrangement frequency, coaching modality, accreditation body, and any specific professional requirements.

Return only the completed supervision policy.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'cpd_tracker_template',
    document_label: 'CPD Tracker Template',
    generationPrompt: `You are a professional development specialist creating a Continuing Professional Development (CPD) tracking template for a UK-based coach.

Create a comprehensive CPD Tracker Template.

This template must enable a practising coach to track, record, and evidence their CPD activities in alignment with their professional body's requirements (ICF, EMCC, AC, or other).

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a CPD tracker that:

• Provides a structured format for recording all CPD activities
• Categorises CPD by type (formal learning, self-directed, professional practice)
• Tracks hours against professional body requirements
• Includes reflection prompts for each activity
• Provides annual summary and review sections
• Supports audit preparation and credential renewal
• Covers the full range of CPD: training, reading, supervision, peer learning

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. CPD policy statement and professional body requirements
2. Annual CPD targets and hour requirements
3. CPD activity log (date, type, description, hours, provider, evidence)
4. Activity categories: formal training, self-directed study, supervision, peer learning, professional practice, writing/research
5. Reflection prompts per activity
6. Quarterly review sections
7. Annual summary and total hours
8. Evidence checklist for credential renewal
9. Next year planning section
10. Professional body reference and standards alignment

Use the client's brief to populate: accreditation body, CPD hours target, coaching modality, and any specific CPD requirements.

Return only the completed CPD tracker template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'coaching_code_of_ethics',
    document_label: 'Coaching Code of Ethics',
    generationPrompt: `You are a UK coaching professional standards specialist creating a Code of Ethics for a practising coach.

Create a comprehensive Coaching Code of Ethics.

This code must establish the ethical principles and professional conduct standards for a UK-based coach, aligned with the International Coach Federation (ICF) Code of Ethics or equivalent professional body standards.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a code of ethics that:

• Establishes core ethical principles for coaching practice
• Defines professional conduct standards and expectations
• Addresses confidentiality and its specific coaching exceptions
• Covers boundaries between coaching and other professions (therapy, counselling, mentoring)
• Addresses conflicts of interest and multiple relationships
• Establishes data protection and client record standards
• Provides for complaint and grievance procedures
• Aligns with ICF, EMCC, or AC ethical frameworks

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Purpose and scope of the code
2. Core ethical principles (autonomy, beneficence, non-maleficence, justice, fidelity)
3. Professional competence and scope of practice
4. Client relationship standards (boundaries, dual relationships, conflicts of interest)
5. Confidentiality standards and exceptions (risk of harm, legal duty, supervision disclosure)
6. Boundaries of coaching practice (what coaching is and is not)
7. Informed consent and client autonomy
8. Data protection and client records (UK GDPR compliance)
9. Professional development and supervision commitment
10. Equality, diversity, and inclusion commitment
11. Complaints and grievance procedure
12. Breach of ethics consequences
13. Professional body alignment statement

Use the client's brief to populate: coaching modality, accreditation body, supervision arrangement, and confidentiality exceptions.

Return only the completed coaching code of ethics.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'client_progress_tracker',
    document_label: 'Client Progress Tracker',
    generationPrompt: `You are a professional coaching practice management specialist creating a client progress tracking template for a UK-based coach.

Create a comprehensive Client Progress Tracker.

This template must enable a coach to systematically track client goals, session outcomes, actions, and overall progress across the coaching engagement.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a progress tracker that:

• Provides a structured format for tracking each client's coaching journey
• Records goals, actions, and outcomes per session
• Tracks progress against initial objectives
• Includes reflective prompts for both coach and client
• Provides summary views for progress reporting
• Supports programme milestone tracking
• Enables evidence-based coaching practice

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Client profile and engagement overview
2. Initial goals and desired outcomes (from onboarding)
3. Session log (date, focus area, key discussion points, insights, actions agreed)
4. Action tracking (action items, completion status, obstacles, adjustments)
5. Goal progress indicators (baseline, current, target)
6. Milestone checkpoints (aligned with programme structure)
7. Client self-assessment sections
8. Coach observations and reflections
9. Overall progress summary and trend indicators
10. Next steps and recommendations section

Use the client's brief to populate: session format, programme structure, coaching modality, and session length.

Return only the completed client progress tracker template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'testimonial_request_template',
    document_label: 'Testimonial Request Template',
    generationPrompt: `You are a professional copywriter and coaching business specialist creating a testimonial request template for a UK-based coach.

Create a comprehensive Testimonial Request Template.

This template must provide a professional, ethical approach to requesting testimonials from coaching clients, with guidance on timing, phrasing, and GDPR-compliant consent for using client feedback.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a testimonial request that:

• Provides a professional, respectful approach to requesting feedback
• Includes multiple template variations (email, in-session verbal, follow-up)
• Guides the client on what makes a useful testimonial
• Obtains explicit consent for using the testimonial (GDPR compliance)
• Covers different use contexts (website, LinkedIn, marketing materials)
• Maintains coaching professionalism and boundaries
• Includes guidance on timing the request appropriately

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Timing guidance for testimonial requests (when to ask)
2. Email template variations (formal, warm, brief)
3. In-session verbal request script
4. Guidance on what makes an effective coaching testimonial
5. Prompt questions for the client (outcomes, experience, transformation)
6. GDPR consent form for testimonial use
7. Approved use contexts (website, social media, print, third-party)
8. Anonymisation and editing provisions
9. Client right to withdraw consent
10. Follow-up reminder template

Use the client's brief to populate: coaching modality, first name, business name, and tone of voice.

Return only the completed testimonial request template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // ─── Photographer Industry Pack (7 documents) ─────────────────────────────

  {
    document_type: 'photography_licensing_agreement',
    document_label: 'Photography Licensing Agreement',
    generationPrompt: `You are a UK intellectual property and media law specialist creating a photography licensing agreement.

Create a comprehensive Photography Licensing Agreement.

This agreement must govern the licensing of photographs from a UK-based sole trader photographer to their clients, complying with the Copyright, Designs and Patents Act 1988 (CDPA) and UK contract law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a licensing agreement that:

• Clearly defines the copyright ownership position
• Specifies the scope of the licence (personal, commercial, editorial)
• Covers usage territory, duration, and exclusivity
• Addresses digital and print reproduction rights
• Handles sub-licensing and third-party use restrictions
• Covers attribution and credit requirements
• Addresses alteration, modification, and derivative works
• Complies with UK CDPA 1988 and moral rights provisions

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Parties and definitions
2. Copyright ownership declaration
3. Grant of licence (scope, purpose, territory)
4. Permitted uses (personal, commercial, editorial, advertising)
5. Restrictions (sub-licensing, resale, modification limits)
6. Duration and territory of licence
7. Exclusivity provisions
8. Attribution and credit requirements
9. Moral rights (right of attribution, integrity)
10. Fee and payment terms
11. Indemnification (model release reliance, content liability)
12. Breach and termination of licence
13. Governing law (UK jurisdiction)

Use the client's brief to populate: photography specialism, licensing intent, commercial use, delivery format, and portfolio usage preferences.

Return only the completed photography licensing agreement.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'model_release_form',
    document_label: 'Model Release Form',
    generationPrompt: `You are a UK media and privacy law specialist creating a model release form for a professional photographer.

Create a comprehensive Model Release Form.

This form must obtain lawful consent from individuals whose likeness appears in photographs, complying with UK data protection law (UK GDPR, DPA 2018), privacy law, and the Copyright, Designs and Patents Act 1988.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a model release that:

• Obtains informed consent for use of the subject's image
• Specifies permitted uses (personal, commercial, editorial, advertising)
• Covers digital and print reproduction
• Addresses UK GDPR compliance for biometric data in photographs
• Includes provisions for minors (parental/guardian consent)
• Covers duration and territory of consent
• Provides for withdrawal of consent under GDPR
• Addresses moral rights and attribution

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Photographer and model details
2. Shoot details (date, location, project reference)
3. Grant of consent (specific uses authorised)
4. Permitted media (print, digital, online, advertising, editorial)
5. Territory and duration of consent
6. UK GDPR consent for processing biometric/image data
7. Minor provisions (parental/guardian consent section)
8. Right to withdraw consent (process and consequences)
9. Compensation and consideration
10. Indemnification provisions
11. Data protection notice (how images will be stored and processed)
12. Signatures and date

Use the client's brief to populate: photography specialism, model release needs, commercial use, and portfolio usage preferences.

Return only the completed model release form.

Ready for PDF, DOCX, and wet/digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'shot_list_template',
    document_label: 'Shot List Template',
    generationPrompt: `You are a professional photography workflow specialist creating a shot list template for a UK-based photographer.

Create a comprehensive Shot List Template.

This template must provide a structured format for planning and executing photography shoots, ensuring all required images are captured efficiently and to the client's specifications.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a shot list that:

• Provides a clear, organised format for shot planning
• Categorises shots by type, priority, and sequence
• Includes technical specifications (lens, lighting, composition notes)
• Tracks completion status during the shoot
• Supports different photography specialisms
• Enables client communication and approval of planned shots
• Integrates with the broader project workflow

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Project/client overview
2. Shoot details (date, location, duration, weather contingency)
3. Shot categories (must-have, desired, bonus/creative)
4. Per-shot specification: subject, composition, angle, lens, lighting notes
5. Sequence and timing suggestions
6. Equipment checklist aligned to shot requirements
7. Client must-provide items list
8. Shot completion tracker (captured, review, retake)
9. Post-shoot notes section
10. Client sign-off section

Use the client's brief to populate: photography specialism, client type, delivery format, and delivery timeline.

Return only the completed shot list template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'delivery_terms_policy',
    document_label: 'Delivery Terms & Timeline Policy',
    generationPrompt: `You are a UK professional services contract specialist creating delivery terms for a photography business.

Create a comprehensive Delivery Terms & Timeline Policy.

This policy must clearly define how photographs are delivered to clients, including timelines, formats, revision procedures, and delivery method, complying with UK consumer rights and contract law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a delivery policy that:

• Defines delivery timelines for different shoot types
• Specifies file formats and resolution standards
• Covers editing and post-production processes
• Addresses revision rounds and client feedback procedures
• Handles delivery method (online gallery, USB, download link)
• Covers storage and archival policies
• Addresses force majeure and delay provisions
• Complies with UK Consumer Rights Act 2015 where applicable

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Delivery timeline standards (by shoot type)
2. File format specifications (JPEG, TIFF, RAW policy)
3. Resolution and quality standards
4. Editing process and style description
5. Client proofing and selection process
6. Revision rounds included and additional revision fees
7. Delivery method (online gallery, download, physical media)
8. Storage and archival policy (duration, backup, deletion schedule)
9. Delay provisions and force majeure
10. Client responsibilities for timely feedback
11. Re-delivery and access recovery provisions
12. Governing law

Use the client's brief to populate: delivery format, delivery timeline, editing rounds, and photography specialism.

Return only the completed delivery terms and timeline policy.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'editing_brief_template',
    document_label: 'Editing Brief Template',
    generationPrompt: `You are a professional photography post-production specialist creating an editing brief template for a UK-based photographer.

Create a comprehensive Editing Brief Template.

This template must capture all the information needed to guide the post-production editing process, ensuring consistency with the photographer's style and the client's expectations.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create an editing brief that:

• Captures the desired editing style and aesthetic
• Defines colour grading, toning, and white balance preferences
• Covers retouching level and specific requirements
• Addresses cropping and composition adjustments
• Handles black-and-white vs colour decisions
• Covers export specifications (format, resolution, colour space)
• Provides a communication framework for feedback between photographer and editor

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Project overview and client details
2. Shooting context and conditions
3. Style reference (mood board description, reference images)
4. Colour grading preferences (warm, cool, natural, film-inspired)
5. Exposure and contrast treatment
6. Retouching level (minimal, moderate, extensive with specifics)
7. Specific retouching instructions (skin, blemishes, backgrounds, objects)
8. Cropping and composition guidance
9. Black-and-white vs colour decisions
10. Export specifications (format, resolution, colour space, naming convention)
11. Priority images for first delivery
12. Client feedback and revision instructions

Use the client's brief to populate: photography specialism, editing rounds, delivery format, and visual style.

Return only the completed editing brief template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'print_release_form',
    document_label: 'Print Release Form',
    generationPrompt: `You are a UK intellectual property law specialist creating a print release form for a professional photographer.

Create a comprehensive Print Release Form.

This form must authorise the client to reproduce photographs for print purposes while maintaining the photographer's copyright, complying with the Copyright, Designs and Patents Act 1988.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a print release that:

• Grants specific permission for print reproduction
• Maintains the photographer's copyright ownership
• Defines permitted print uses (personal, gift, display)
• Restricts commercial reproduction and resale
• Covers print size and quality specifications
• Addresses third-party printer requirements
• Includes attribution requirements

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Photographer and client details
2. Copyright ownership declaration
3. Grant of print permission (scope and purpose)
4. Permitted print uses (personal, gift, wall display)
5. Restrictions (commercial, advertising, resale prohibited)
6. Print specifications (size limits, resolution requirements)
7. Third-party printer provisions (lab requirements, file handling)
8. Attribution and credit requirements
9. File format and delivery specifications
10. Limitations and liability
11. Signatures and date

Use the client's brief to populate: licensing intent, commercial use policy, and delivery format.

Return only the completed print release form.

Ready for PDF, DOCX, and wet/digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'event_photography_terms',
    document_label: 'Event Photography Terms',
    generationPrompt: `You are a UK event and commercial photography contract specialist creating terms and conditions for event photography services.

Create comprehensive Event Photography Terms.

These terms must govern the provision of photography services at events, covering access, liability, exclusivity, guest photography, and force majeure, compliant with UK contract law.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create event photography terms that:

• Define the scope of event photography services
• Cover venue access and logistical requirements
• Address exclusivity and guest photography policies
• Handle event cancellation and postponement provisions
• Cover liability for missed shots or equipment failure
• Address image usage by the venue, sponsors, and third parties
• Include force majeure provisions
• Cover health and safety at the event

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Parties and event details
2. Scope of services (coverage duration, deliverables, shot list)
3. Photographer access and logistical requirements
4. Exclusivity provisions (exclusive vs non-exclusive coverage)
5. Guest photography policy (restrictions, social media)
6. Venue, sponsor, and third-party image usage
7. Delivery timeline and format
8. Cancellation and postponement provisions (client-initiated and force majeure)
9. Liability limitations (equipment failure, venue restrictions, weather)
10. Health and safety obligations
11. Payment terms and deposit requirements
12. Image licensing and copyright
13. Governing law

Use the client's brief to populate: photography specialism, event cancellation policy, delivery timeline, and licensing intent.

Return only the completed event photography terms.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // ─── Consultant Industry Pack (7 documents) ──────────────────────────────

  {
    document_type: 'consulting_agreement',
    document_label: 'Consulting Agreement',
    generationPrompt: `You are a UK commercial contract specialist with expertise in consulting and professional services agreements.

Create a comprehensive Consulting Agreement.

This agreement must govern the consulting engagement between a UK-based sole trader consultant and their client, complying with UK contract law and reflecting consulting best practices.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a consulting agreement that:

• Defines the consulting scope and deliverables with precision
• Establishes the engagement model (fixed-scope, time and materials, retainer)
• Covers intellectual property ownership and licensing
• Addresses confidentiality and NDA provisions
• Establishes milestone tracking and acceptance criteria
• Covers knowledge transfer obligations
• Handles conflicts of interest and professional independence
• Includes data protection provisions compliant with UK GDPR

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Parties and definitions
2. Scope of consulting services (detailed description)
3. Engagement model and fee structure
4. Deliverables specification and acceptance criteria
5. Timeline and milestones
6. Consultant obligations and professional standards
7. Client obligations (access, information, cooperation)
8. Intellectual property ownership and licensing
9. Confidentiality and NDA provisions
10. Data protection (UK GDPR compliance)
11. Conflicts of interest and professional independence
12. Knowledge transfer obligations
13. Fees, invoicing, and payment terms
14. Limitation of liability and indemnification
15. Termination provisions
16. Dispute resolution
17. Governing law (UK jurisdiction)

Use the client's brief to populate: consulting specialism, engagement model, deliverable types, methodology, knowledge transfer approach, conflicts of interest position, milestones, and acceptance criteria.

Return only the completed consulting agreement.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'consultant_nda',
    document_label: 'Consultant NDA',
    generationPrompt: `You are a UK commercial confidentiality and intellectual property law specialist creating a Non-Disclosure Agreement for consulting engagements.

Create a comprehensive Consultant NDA.

This NDA must protect confidential information exchanged during consulting engagements, complying with UK contract law and the Trade Secrets (Enforcement, etc.) Regulations 2019.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create an NDA that:

• Protects both parties' confidential information (mutual or one-way as appropriate)
• Defines confidential information with sufficient breadth and clarity
• Covers all forms of disclosure (oral, written, electronic, visual)
• Addresses return and destruction of confidential information
• Covers permitted disclosures (legal obligations, professional advisors)
• Includes remedies for breach (injunction, damages)
• Addresses trade secrets with enhanced protection
• Complies with UK GDPR for any personal data shared

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Parties and effective date
2. Definition of confidential information (broad, specific categories)
3. Obligations of receiving party (use limitation, protection standard)
4. Permitted disclosures (employees, advisors, legal requirements)
5. Exclusions from confidentiality (public domain, independent development)
6. Duration of confidentiality obligations
7. Return and destruction of confidential information
8. Trade secrets (enhanced protection under Trade Secrets Regulations 2019)
9. Remedies for breach (injunction, damages, indemnity)
10. Data protection provisions (UK GDPR where personal data is shared)
11. No licence or rights granted
12. Governing law and jurisdiction

Use the client's brief to populate: NDA type preference (mutual vs one-way) and consulting specialism context.

Return only the completed consultant NDA.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'deliverables_specification',
    document_label: 'Deliverables Specification',
    generationPrompt: `You are a professional consulting practice specialist creating a deliverables specification template for a UK-based consultant.

Create a comprehensive Deliverables Specification Template.

This template must define consulting deliverables with sufficient precision to prevent scope disputes and establish clear acceptance criteria, aligned with consulting best practices.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a specification that:

• Defines each deliverable with measurable precision
• Establishes acceptance criteria and review processes
• Covers format, medium, and quality standards
• Addresses revision rounds and change management
• Links deliverables to project milestones
• Covers partial delivery and interim deliverables
• Establishes sign-off procedures and approval timelines

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Project overview and engagement context
2. Deliverable inventory (complete list with references)
3. Per-deliverable specification: description, format, length/size, quality standard
4. Acceptance criteria for each deliverable
5. Review and feedback process (timeline for client review)
6. Revision policy (included rounds, additional revision fees)
7. Delivery schedule linked to milestones
8. Interim and partial deliverable provisions
9. Sign-off procedure (written acceptance, email confirmation, meeting)
10. Change management (scope change impact on deliverables)
11. Quality assurance process
12. Final delivery confirmation and project closure

Use the client's brief to populate: deliverable types, engagement model, methodology, milestones, and acceptance criteria.

Return only the completed deliverables specification template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'milestone_tracking_template',
    document_label: 'Milestone Tracking Template',
    generationPrompt: `You are a professional consulting project management specialist creating a milestone tracking template for a UK-based consultant.

Create a comprehensive Milestone Tracking Template.

This template must enable a consultant to track project milestones, payments, deliverables, and overall engagement progress systematically.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a milestone tracker that:

• Maps all project milestones with dates and dependencies
• Tracks deliverable completion against milestones
• Links milestone achievement to payment triggers
• Provides status visibility for both consultant and client
• Handles milestone delays and adjustments
• Supports different engagement models (fixed-scope, T&M, retainer)
• Enables progress reporting and stakeholder communication

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Project overview and engagement model
2. Milestone register (name, description, target date, status)
3. Deliverable mapping per milestone
4. Payment schedule linked to milestones
5. Status indicators (planned, in progress, delivered, accepted, overdue)
6. Dependency tracking between milestones
7. Risk and issue log per milestone
8. Client sign-off tracker per milestone
9. Timeline Gantt-style view (simplified)
10. Progress summary dashboard
11. Change and adjustment log
12. Reporting frequency and next review date

Use the client's brief to populate: milestones, reporting frequency, and acceptance criteria.

Return only the completed milestone tracking template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'knowledge_transfer_protocol',
    document_label: 'Knowledge Transfer Protocol',
    generationPrompt: `You are a UK consulting professional standards specialist creating a knowledge transfer protocol for consulting engagements.

Create a comprehensive Knowledge Transfer Protocol.

This protocol must govern the structured handover of knowledge, methodology, and deliverables from the consultant to the client, ensuring the client can maintain and build upon the consultant's work after the engagement ends.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a protocol that:

• Defines what knowledge must be transferred and in what format
• Establishes the timeline and process for knowledge transfer
• Covers documentation, training, and walkthrough requirements
• Addresses proprietary methodology licensing vs transfer
• Handles ongoing access and support provisions
• Ensures institutional knowledge is captured before engagement ends
• Provides for verification that transfer is complete

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Purpose and scope of knowledge transfer
2. Knowledge inventory (what must be transferred)
3. Transfer methods (documentation, training sessions, walkthroughs, Q&A)
4. Documentation requirements (format, detail level, accessibility)
5. Training and walkthrough schedule
6. Proprietary methodology provisions (licence vs full transfer)
7. Key personnel involvement (who participates from both sides)
8. Timeline and milestones for transfer activities
9. Verification and acceptance criteria for successful transfer
10. Post-engagement access and support provisions
11. Confidentiality during and after transfer
12. Knowledge transfer sign-off

Use the client's brief to populate: knowledge transfer approach, methodology, deliverable types, and reporting frequency.

Return only the completed knowledge transfer protocol.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'consultant_code_of_conduct',
    document_label: 'Consultant Code of Conduct',
    generationPrompt: `You are a UK professional consulting standards specialist creating a code of conduct for a practising consultant.

Create a comprehensive Consultant Code of Conduct.

This code must establish the ethical principles and professional conduct standards for a UK-based sole trader consultant, covering integrity, objectivity, competence, and confidentiality.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a code of conduct that:

• Establishes core ethical principles for consulting practice
• Addresses conflicts of interest and professional independence
• Covers confidentiality and client data protection
• Establishes competence and continuous development standards
• Addresses gift, hospitality, and bribery prevention (Bribery Act 2010)
• Covers client relationship boundaries and expectations
• Provides for complaint and grievance procedures
• Addresses social media and public communications

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Purpose and scope
2. Core principles (integrity, objectivity, competence, confidentiality, professionalism)
3. Conflicts of interest and professional independence
4. Client engagement standards
5. Confidentiality and data protection (UK GDPR)
6. Competence and professional development
7. Anti-bribery and corruption (Bribery Act 2010 compliance)
8. Gifts and hospitality policy
9. Client relationship boundaries
10. Intellectual property and ownership ethics
11. Social media and public communications
12. Reporting concerns and whistleblowing
13. Breach consequences and disciplinary provisions
14. Review and updates

Use the client's brief to populate: consulting specialism, conflicts of interest approach, and methodology.

Return only the completed consultant code of conduct.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'engagement_closure_report',
    document_label: 'Engagement Closure Report',
    generationPrompt: `You are a professional consulting practice specialist creating an engagement closure report template for a UK-based consultant.

Create a comprehensive Engagement Closure Report Template.

This template must provide a structured format for formally closing a consulting engagement, documenting outcomes, lessons learned, and knowledge handover status.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a closure report that:

• Documents the engagement scope, objectives, and outcomes achieved
• Tracks deliverable completion and acceptance status
• Records knowledge transfer completion and verification
• Captures lessons learned for both consultant and client
• Provides formal closure confirmation and sign-off
• Addresses any outstanding items or ongoing obligations
• Supports testimonial and reference discussions
• Enables future re-engagement with clear context

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Engagement overview (scope, duration, objectives)
2. Outcomes achieved vs original objectives
3. Deliverable completion and acceptance status
4. Knowledge transfer completion and verification
5. Outstanding items and post-engagement obligations
6. Key findings and recommendations summary
7. Lessons learned (what worked, what could improve)
8. Client feedback and satisfaction summary
9. Ongoing support or warranty provisions
10. Engagement sign-off (consultant and client)
11. Appendix: deliverable inventory with acceptance dates
12. Appendix: knowledge transfer checklist completion status

Use the client's brief to populate: consulting specialism, deliverable types, methodology, and knowledge transfer approach.

Return only the completed engagement closure report template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },

  // ─── Contractor Industry Pack (8 documents) ──────────────────────────────

  {
    document_type: 'health_safety_policy',
    document_label: 'Health & Safety Policy',
    generationPrompt: `You are a UK health and safety compliance specialist creating a Health and Safety Policy for a sole trader contractor or tradesperson.

Create a comprehensive Health and Safety Policy.

This policy must comply with the Health and Safety at Work etc. Act 1974 (HSWA), the Management of Health and Safety at Work Regulations 1999 (MHSWR), and applicable HSE guidance for small businesses and sole traders in the construction and trades sector.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a health and safety policy that:

• States the contractor's commitment to health and safety
• Defines responsibilities for the sole trader, employees, and subcontractors
• Covers hazard identification and risk management
• Addresses specific trades-related risks (working at height, electrical, manual handling)
• Covers provision of PPE and equipment safety
• Addresses welfare facilities and first aid provision
• Covers accident reporting and RIDDOR obligations
• Complies with HSE requirements for small businesses

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Statement of intent (health and safety commitment)
2. Organisation and responsibilities (sole trader, employees, subcontractors, visitors)
3. Arrangements for health and safety:
   a. Risk assessment process
   b. Hazard identification and control
   c. Safe systems of work
   d. Provision and use of PPE
   e. Equipment safety and maintenance (PUWER)
   f. Working at height procedures
   g. Manual handling
   h. Electrical safety
   i. COSHH and hazardous substances
   j. Fire safety and emergency procedures
   k. First aid provision
   l. Welfare facilities
   m. Accident reporting (RIDDOR)
   n. Information, instruction, and training
   o. Consultation with workers
4. Specific trade-related hazards and controls
5. Review and revision arrangements
6. Signed and dated by the responsible person

Use the client's brief to populate: trade type, work environments, workforce structure, height working, hazardous substances, plant and equipment, existing H&S documentation, and insurance coverage.

Return only the completed health and safety policy.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'risk_assessment_template',
    document_label: 'Risk Assessment Template',
    generationPrompt: `You are a UK health and safety compliance specialist creating a risk assessment template for a sole trader contractor or tradesperson.

Create a comprehensive Risk Assessment Template.

This template must comply with the Management of Health and Safety at Work Regulations 1999 and HSE guidance on risk assessment for small construction and trades businesses.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a risk assessment template that:

• Provides a systematic approach to identifying workplace hazards
• Enables evaluation of risk severity and likelihood
• Supports the specification of control measures
• Covers trades-specific hazards (falls from height, electrical, asbestos, manual handling)
• Tracks implementation of control measures
• Supports regular review and updating
• Complies with HSE five-step risk assessment approach

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Assessment details (date, assessor, location, activity)
2. Hazard identification (systematic listing by category)
3. Who might be harmed and how
4. Risk evaluation (likelihood x severity = risk rating matrix)
5. Existing control measures
6. Additional control measures required
7. Action plan with responsibility and completion dates
8. Risk rating after controls (residual risk)
9. Review schedule and review date
10. Sign-off by competent person

Hazard categories to include:
- Working at height
- Slips, trips, and falls
- Manual handling
- Hazardous substances (COSHH)
- Electrical safety
- Use of tools and equipment
- Moving vehicles and plant
- Noise and vibration
- Dust and fumes
- Asbestos
- Temperature and weather exposure
- Lone working

Use the client's brief to populate: trade type, work environments, height working, hazardous substances, plant and equipment, and specific hazards.

Return only the completed risk assessment template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'method_statement',
    document_label: 'Method Statement',
    generationPrompt: `You are a UK health and safety compliance specialist creating a method statement template for a sole trader contractor or tradesperson.

Create a comprehensive Method Statement Template.

This template must provide a structured format for documenting the safe method of work for specific construction or trade activities, complying with HSE guidance and CDM Regulations 2015 where applicable.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a method statement that:

• Defines the task and its scope with precision
• Identifies hazards specific to the task
• Details the step-by-step safe method of work
• Specifies PPE and equipment requirements
• Addresses emergency procedures for the task
• Covers environmental considerations and waste management
• Provides for supervision and monitoring
• Supports client and principal contractor review

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Project and task details
2. Site location and access arrangements
3. Task description and scope
4. Hazards identified (linked to risk assessment)
5. Personnel requirements (competence, certifications)
6. Equipment and materials required
7. PPE requirements (specific to the task)
8. Step-by-step method of work (sequential)
9. Environmental controls (waste, spillage, noise, dust)
10. Emergency procedures (specific to the task)
11. Supervision and monitoring arrangements
12. Quality control checks
13. Permits required (hot work, confined space, excavation)
14. Communication and briefing arrangements
15. Sign-off and acceptance

Use the client's brief to populate: trade type, work environments, height working, hazardous substances, plant and equipment, and specific hazards.

Return only the completed method statement template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'coshh_assessment',
    document_label: 'COSHH Assessment',
    generationPrompt: `You are a UK health and safety compliance specialist creating a COSHH assessment template for a sole trader contractor or tradesperson.

Create a comprehensive COSHH Assessment Template.

This template must comply with the Control of Substances Hazardous to Health Regulations 2002 (COSHH) and HSE guidance on COSHH assessment for construction and trades businesses.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a COSHH assessment that:

• Identifies all hazardous substances used in the trade
• Assesses the health risks from exposure
• Specifies control measures to prevent or reduce exposure
• Covers safe handling, storage, and disposal procedures
• Addresses personal protective equipment requirements
• Covers health surveillance where required
• Provides for employee information and training
• Complies with HSE COSHH essentials approach

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Assessment details (date, assessor, activity/work area)
2. Substance identification (product name, supplier, SDS reference)
3. Hazard classification (CLP/GHS classification, hazard statements)
4. Form of the substance and how it is used
5. Who is exposed and how (routes of entry: inhalation, skin, ingestion)
6. Duration and frequency of exposure
7. Health effects (acute and chronic)
8. Workplace exposure limits (WELs) where applicable
9. Control measures (elimination, substitution, engineering controls, PPE hierarchy)
10. Safe handling and storage procedures
11. Spillage and decontamination procedures
12. Waste disposal requirements
13. Health surveillance requirements
14. Information and training requirements
15. Emergency first aid measures
16. Review date

Common trade substances to reference:
- Cement and concrete (silica dust, skin irritation)
- Solvents and adhesives (VOCs, neurotoxic effects)
- Wood dust (carcinogenic classification)
- Lead paint (in older properties)
- Asbestos (if encountered)
- Chemical treatments (preservatives, pesticides)
- Welding fumes (metal fume fever)

Use the client's brief to populate: trade type, hazardous substances, work environments, and specific hazards.

Return only the completed COSHH assessment template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'construction_phase_plan',
    document_label: 'Construction Phase Plan',
    generationPrompt: `You are a UK CDM compliance specialist creating a construction phase plan template for a sole trader contractor.

Create a comprehensive Construction Phase Plan Template.

This plan must comply with the Construction (Design and Management) Regulations 2015 (CDM 2015) and HSE guidance on construction phase plans for small projects.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a construction phase plan that:

• Describes the project and its health and safety risks
• Identifies significant risks and how they will be managed
• Covers the coordination of work activities
• Addresses welfare facilities on site
• Covers site rules and induction requirements
• Provides for monitoring and review of health and safety
• Complies with CDM 2015 Regulation 12 requirements
• Is proportionate to the scale and risk of the project

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Project description (scope, location, client, duration)
2. Client and principal designer/contractor details
3. Key health and safety risks and hazards
4. Risk management measures (linked to risk assessments)
5. Construction work sequence and phasing
6. Site layout and logistics
7. Welfare facilities provision
8. Site rules and induction requirements
9. Emergency procedures (fire, first aid, rescue)
10. Coordination and communication arrangements
11. Monitoring and review arrangements
12. Information for pre-construction phase (design risk information)
13. Arrangements for controlling significant risks:
    - Working at height
    - Structural stability and demolition
    - Asbestos management
    - Underground and overhead services
    - Vehicle and plant movements
    - Hazardous substances (COSHH)
    - Noise, vibration, and dust
14. Training and competence verification
15. Review and update schedule

Use the client's brief to populate: trade type, CDM exposure, work environments, height working, hazardous substances, plant and equipment, and specific hazards.

Return only the completed construction phase plan template.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'subcontractor_agreement',
    document_label: 'Subcontractor Agreement',
    generationPrompt: `You are a UK construction contract specialist creating a subcontractor agreement for a sole trader contractor.

Create a comprehensive Subcontractor Agreement.

This agreement must govern the engagement of subcontractors by a UK-based sole trader contractor, complying with UK contract law, the Construction (Design and Management) Regulations 2015 (CDM 2015), and the Health and Safety at Work etc. Act 1974.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a subcontractor agreement that:

• Defines the subcontracted scope of work clearly
• Establishes health and safety obligations (CDM compliance)
• Covers insurance requirements (public liability, employer's liability)
• Addresses CIS tax and payment terms
• Covers CDM 2015 coordination and communication duties
• Handles intellectual property in designs and specifications
• Covers provision of tools, equipment, and materials
• Addresses substitution and labour supply restrictions
• Includes data protection provisions

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Parties and definitions
2. Scope of subcontracted work
3. Health and safety obligations (CDM 2015 compliance)
4. Insurance requirements (minimum cover levels)
5. CDM 2015 duties and coordination
6. Payment terms (CIS deduction, invoicing schedule)
7. Programme and timeline obligations
8. Quality standards and defect rectification
9. Materials, tools, and equipment provision
10. Substitution and labour supply restrictions
11. Indemnification and liability
12. Termination provisions
13. Confidentiality and data protection
14. Dispute resolution (Adjudication under Housing Grants Act)
15. Governing law (UK jurisdiction)

Use the client's brief to populate: trade type, workforce structure, CDM exposure, work environments, and insurance coverage.

Return only the completed subcontractor agreement.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'site_induction_checklist',
    document_label: 'Site Induction Checklist',
    generationPrompt: `You are a UK health and safety compliance specialist creating a site induction checklist for a sole trader contractor.

Create a comprehensive Site Induction Checklist.

This checklist must ensure all workers, visitors, and subcontractors receive adequate site-specific health and safety induction before starting work, complying with CDM 2015 and HSE guidance.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create an induction checklist that:

• Covers site-specific hazards and rules
• Ensures workers understand emergency procedures
• Verifies competence and certification requirements
• Addresses welfare facilities and first aid arrangements
• Covers PPE requirements specific to the site
• Documents induction attendance and understanding
• Supports CDM 2015 information provision duties

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Site details (project name, location, principal contractor)
2. Inductee details (name, role, employer, trade)
3. Site overview and current work activities
4. Site-specific hazards and controls
5. Emergency procedures (fire, first aid, evacuation, rescue)
6. Site rules (PPE, access restrictions, prohibited areas)
7. Welfare facilities location (toilets, washing, rest area, drinking water)
8. First aid arrangements (first aider, first aid box location)
9. Accident and incident reporting procedures
10. Permit-to-work requirements (if applicable)
11. Environmental rules (waste, spillage, noise hours)
12. Certification and competence verification:
    - CSCS or equivalent card
    - Trade-specific certifications
    - Asbestos awareness training
    - Working at height training
    - First aid training
13. Information acknowledged and understood
14. Inductee signature and date
15. Inductor signature and date

Use the client's brief to populate: trade type, work environments, height working, hazardous substances, plant and equipment, and specific hazards.

Return only the completed site induction checklist.

Ready for PDF and DOCX.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'defect_liability_template',
    document_label: 'Defect Liability Template',
    generationPrompt: `You are a UK construction contract specialist creating a defect liability template for a sole trader contractor.

Create a comprehensive Defect Liability Template.

This template must govern the rectification of defects following completion of construction work, complying with UK construction law and the Housing Grants, Construction and Regeneration Act 1996.

────────────────────────
PRIMARY OBJECTIVE
────────────────────────

Create a defect liability template that:

• Defines the defect liability period and its scope
• Establishes procedures for reporting defects
• Covers the contractor's obligations to rectify defects
• Addresses the distinction between defects and fair wear and tear
• Handles the client's rights if defects are not rectified
• Covers costs and payment for defect rectification
• Addresses latent defects and longer-term liability
• Provides for third-party inspection and dispute resolution

────────────────────────
REQUIRED SECTIONS
────────────────────────

1. Parties and project details
2. Defect liability period (start date, duration)
3. Scope of defect liability (what is covered)
4. Exclusions (fair wear and tear, client misuse, third-party damage, maintenance items)
5. Defect reporting procedure (notification requirements, timeline)
6. Contractor's rectification obligations (response time, rectification method)
7. Client's rights on non-rectification (self-remedy, cost recovery)
8. Inspection and verification procedures
9. Cost allocation for defect rectification
10. Latent defects provisions
11. Insurance during defect liability period
12. Dispute resolution (adjudication, mediation)
13. Completion certificate and final sign-off
14. Governing law

Use the client's brief to populate: trade type, defect liability period, work environments, and insurance coverage.

Return only the completed defect liability template.

Ready for PDF, DOCX, and digital signature.

No explanations.

No notes.

No placeholders.
`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
];

// ─── Social Media Generation Prompt ─────────────────────────────────────────

export const SOCIAL_MEDIA_GENERATION_PROMPT = `You are an elite social media content strategist and copywriter creating a complete social media post package for a UK small business.

OBJECTIVE
Create posts that:
• Build brand awareness and professional credibility
• Demonstrate expertise in the client's specific industry
• Drive meaningful engagement from their ideal audience
• Attract qualified enquiries and new clients
• Save the client time with ready-to-post content that sounds like them

OUTPUT FORMAT
Return a JSON object with this exact structure:
{
  "posts": [
    {
      "postNumber": 1,
      "category": "educational",
      "platform": "LinkedIn",
      "week": 1,
      "day": "Mon",
      "caption": "Full post text ready to copy-paste",
      "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5",
      "imagePrompt": "1-2 sentence description of the accompanying image"
    }
  ]
}

CONTENT MIX
• 30% Educational posts (tips, insights, how-tos, myth-busting)
• 30% Personal posts (behind-scenes, philosophy, story, values)
• 40% Promotional posts (services, results, offers, case studies, testimonials)

CAPTION GUIDELINES — platform-specific lengths and tone:
• LinkedIn: 200-300 words, professional, thought-leadership tone
• Instagram: 100-150 words, visual focus, warm and aspirational
• Facebook: 150-200 words, community-building, conversational
• X: 50-80 words, punchy, conversation-starting, opinionated
• TikTok: 100-150 words, casual, trendy, authentic
• Pinterest: 50-80 words, keyword-rich, descriptive, aspirational

WRITING REQUIREMENTS
• Match the client's brand voice EXACTLY as described in their brief
• Be specific to their industry — no generic business advice
• Use their actual service names, outcomes, and differentiators
• Avoid generic inspirational quotes, motivational cliches, or LinkedIn influencer language
• No hashtags in captions — add separately in the hashtags field
• Reference the client's specific achievements, story, or credentials where relevant
• Each post must feel like the business owner wrote it personally

IMAGE PROMPT GUIDELINES
• Describe the visual style matching the client's brand colours and visual identity from the brief
• Specify imagery style (photography, illustration, flat design, etc.) matching their preferences
• Include brand colour suggestions for the image where relevant
• Make prompts specific enough that an AI image generator can produce on-brand results`;

// ─── Website Generation Prompt ──────────────────────────────────────────────

export const WEBSITE_GENERATION_PROMPT = `You are an expert full-stack web developer and copywriter creating a COMPLETE, PRODUCTION-READY website for a UK small business.

OBJECTIVE
Build a professional website that:
• Accurately represents the business and its brand identity
• Converts visitors into enquiries or clients
• Demonstrates credibility and professionalism
• Contains all the business's actual information — no placeholders
• Is ready to deploy immediately

TECH STACK
Use Next.js 14 with App Router, TypeScript, Tailwind CSS, and Supabase (for any backend needs).

DESIGN REQUIREMENTS
• Use the client's exact brand colours, font style, and visual identity from their brief
• Mobile-first responsive design with proper breakpoints
• Professional, clean, modern aesthetic appropriate to their industry
• Clear visual hierarchy with strategic use of white space
• Consistent design language across all pages

CONTENT REQUIREMENTS
• Use the client's ACTUAL business name, services, descriptions, and contact details
• Write all copy in the client's brand voice and tone as described in their brief
• Include all services with accurate descriptions matching their brief
• Add testimonials, credentials, and social proof exactly as provided
• Include all contact methods, business hours, and booking links as specified
• Create compelling headlines and CTAs based on their hero message and primary action

PAGE STRUCTURE
Build every page the client ordered at checkout. Each page must be complete with:
• Proper SEO meta tags and Open Graph data
• Structured data appropriate for a UK service business
• Working navigation between all pages
• Consistent header and footer across the site

FEATURES TO IMPLEMENT
• All forms specified in the brief (contact form, newsletter signup, etc.)
• Legal pages as specified (Privacy Policy, Terms, Cookie Policy)
• Cookie consent banner if required
• Booking tool integration if specified
• Newsletter signup if specified
• Social media links as specified
• Pricing display as specified

LEGAL & GDPR
• Include a Privacy Policy page using the client's actual data collection details
• Include cookie consent if the client needs it
• Ensure all forms have appropriate consent mechanisms

Write the complete website code now. Every page, every component, every piece of content. No placeholders. No TODO comments. No "add your content here" markers. Use the client's actual information from their brief throughout.`;

// ─── Platform-specific social media prompt templates ─────────────────────────

import type { PlatformId } from '@/lib/social-platforms';

const PLATFORM_PROMPTS: Record<PlatformId, string> = {
  Instagram: `You are an expert Instagram content creator and AI image prompt engineer for a UK small business.

OBJECTIVE
Create Instagram posts optimised for IMAGE-GENERATING AI (e.g., Midjourney, DALL-E, Leonardo AI, Adobe Firefly).

Every post must have a highly detailed image prompt that will produce a scroll-stopping, on-brand visual when fed into an image generator. The caption supports the image — but the image is the hero.

OUTPUT FORMAT
Return a JSON object:
{
  "posts": [
    {
      "postNumber": 1,
      "category": "educational" | "promotional" | "personal",
      "week": 1,
      "day": "Mon",
      "caption": "Instagram caption with line breaks and emojis where appropriate. 100-150 words. Warm, aspirational, visual-first tone.",
      "hashtags": "#tag1 #tag2 ... (up to 30, mix of industry + niche + trending)",
      "imagePrompt": "DETAILED image generation prompt (see IMAGE PROMPT RULES below)",
      "imageDimensions": "1080x1080 (1:1) or 1080x1350 (4:5) or 1080x1920 (9:16) — specify which",
      "postFormat": "feed" | "carousel" | "reel_cover" | "story"
    }
  ]
}

CONTENT MIX
• 30% Educational (tips, how-tos, myth-busting)
• 30% Personal (behind-scenes, philosophy, story, values)
• 40% Promotional (services, results, offers, testimonials)

IMAGE PROMPT RULES — this is the most critical part:
• Write prompts as if feeding directly into Midjourney/DALL-E — be specific, visual, and descriptive
• Always specify the visual style: photography, flat design, illustration, minimalist, 3D render, etc.
• Include the client's brand colours by hex code or name (from brief)
• Specify composition: close-up, wide shot, overhead, flat lay, portrait, etc.
• Include lighting: natural light, studio, golden hour, soft diffused, dramatic
• Include mood/atmosphere: professional, warm, aspirational, energetic, calm
• For text overlays on images: specify what text appears and where (top, centre, bottom)
• For carousels: describe each slide separately within the imagePrompt field (Slide 1: ..., Slide 2: ...)
• Avoid prompts that would generate faces with text issues — use abstract, object-focused, or graphic design approaches
• Always include aspect ratio hint: --ar 1:1 for feed, --ar 4:5 for portrait, --ar 9:16 for stories/reels

IMAGE DIMENSIONS
• Feed square: 1080x1080 (1:1)
• Feed portrait: 1080x1350 (4:5) — RECOMMENDED for more screen space
• Stories / Reels cover: 1080x1920 (9:16)

CAPTION GUIDELINES
• 100-150 words, warm and aspirational
• Use line breaks for readability
• Start with a hook that makes them stop scrolling
• End with a clear CTA
• Emojis OK but tasteful — match the brand personality

HASHTAG STRATEGY
• 20-30 hashtags per post
• Mix: 5-8 industry hashtags, 5-8 niche hashtags, 5-8 trending/popular, 5 brand-specific
• Place hashtags after caption (not in the body text)`,

  LinkedIn: `You are an expert LinkedIn content strategist and copywriter for a UK small business.

OBJECTIVE
Create LinkedIn posts optimised for TEXT-GENERATING AI (e.g., Claude, ChatGPT) with optional IMAGE prompts for visual posts.

LinkedIn is a TEXT-FIRST platform. The caption carries the message. Images support and amplify — they are not the primary content.

OUTPUT FORMAT
Return a JSON object:
{
  "posts": [
    {
      "postNumber": 1,
      "category": "educational" | "promotional" | "personal",
      "week": 1,
      "day": "Mon",
      "caption": "Full LinkedIn post text. 200-300 words. Professional, thought-leadership tone. Use the 'hook → insight → takeaway' structure.",
      "hashtags": "#tag1 #tag2 ... (3-5 max, placed at end)",
      "imagePrompt": "Optional image prompt if the post benefits from a visual. Leave empty string if text-only. If provided, make it detailed for AI image generators.",
      "imageDimensions": "1200x627 (1.91:1 landscape) or 1080x1080 (1:1 square) — specify which, or empty string for text-only",
      "postFormat": "text_only" | "image_post" | "carousel" | "document"
    }
  ]
}

CONTENT MIX
• 40% Educational (industry insights, how-tos, frameworks, lessons learned)
• 25% Personal (journey, challenges, philosophy, behind-the-business)
• 35% Promotional (case studies, client wins, service announcements, thought leadership that sells)

LINKEDIN CAPTION STRUCTURE — use this proven format:
1. HOOK (first 2 lines): A bold statement, surprising statistic, or provocative question that stops the scroll
2. LINE BREAK: White space increases readability
3. BODY (3-5 short paragraphs): The meat of the post — insight, story, or value
4. TAKEAWAY/CALL TO ACTION: What should the reader do next?
5. HASHTAGS: 3-5 only, placed at the very end

CAPTION GUIDELINES
• 200-300 words (LinkedIn favours substantive posts)
• Professional but not stiff — write like a real person, not a corporate brochure
• Use short paragraphs (1-2 sentences) for readability
• No emojis in the first line (it hurts reach)
• Avoid "I'm humbled to announce..." or LinkedIn influencer cliches
• Share genuine insights, not platitudes
• Reference specific experiences or client outcomes from the brief

IMAGE PROMPT RULES (when image is needed):
• LinkedIn images are SUPPORTING visuals, not the main content
• Professional, clean design: data visualisations, quote cards, checklists, infographics
• Dimensions: 1200x627 (landscape, most common) or 1080x1080 (square)
• Style: professional, corporate-adjacent, clean typography
• Brand colours from the brief should be used as background/accent colours
• For carousel/document posts: describe each slide (up to 10 slides)
• Text on images should be minimal — the caption does the heavy lifting

HASHTAG STRATEGY
• 3-5 hashtags only (LinkedIn algorithm penalises excessive tags)
• Use industry-specific tags, not generic ones like #business #success
• One broad industry tag + 2-3 niche tags`,

  Facebook: `You are an expert Facebook content strategist and copywriter for a UK small business.

OBJECTIVE
Create Facebook posts that combine COMPELLING TEXT with EYE-CATCHING IMAGES. Facebook is a TEXT + IMAGE platform — both must work together to drive engagement.

OUTPUT FORMAT
Return a JSON object:
{
  "posts": [
    {
      "postNumber": 1,
      "category": "educational" | "promotional" | "personal",
      "week": 1,
      "day": "Mon",
      "caption": "Full Facebook post. 150-200 words. Conversational, community-building tone. Ask questions to drive comments.",
      "hashtags": "#tag1 #tag2 ... (5-10, conversational style)",
      "imagePrompt": "Detailed image prompt for AI image generators. Every Facebook post should have a visual — Facebook prioritises posts with images.",
      "imageDimensions": "1200x630 (1.91:1 landscape) or 1080x1080 (1:1 square) or 1080x1350 (4:5 portrait)",
      "postFormat": "image_post" | "carousel" | "link_share"
    }
  ]
}

CONTENT MIX
• 30% Educational (tips, local insights, how-tos relevant to the community)
• 30% Personal (behind-scenes, team, story, local connection)
• 40% Promotional (services, offers, client stories, social proof)

CAPTION GUIDELINES
• 150-200 words, conversational and community-building
• Ask questions to encourage comments — Facebook rewards engagement
• Use a warm, approachable tone — this is the "local business" feel
• Short paragraphs for mobile readability
• End with a question or clear CTA
• Emojis are fine — use them naturally, not excessively

IMAGE PROMPT RULES:
• EVERY Facebook post should have an image — posts with images get 2-3x more engagement
• Facebook images should feel relatable and authentic — not overly polished
• Dimensions: 1200x630 (landscape, best for link previews), 1080x1080 (square), 1080x1350 (portrait)
• Style: mix of lifestyle photography, graphic designs, quote cards, behind-the-scenes shots
• Use brand colours as backgrounds, borders, or accent elements
• For promotional posts: create eye-catching offer graphics with clear text overlays
• For educational posts: tip cards, checklists, infographics
• For personal posts: lifestyle/environment shots that feel authentic
• For carousels: describe each slide (up to 10)

HASHTAG STRATEGY
• 5-10 hashtags per post
• Mix local/community hashtags with industry ones
• Facebook hashtags are less critical than Instagram but still help discoverability`,

  X: `You are an expert X (Twitter) content creator for a UK small business.

OBJECTIVE
Create X posts optimised for TEXT-GENERATING AI. X is a SHORT-FORM TEXT platform. Punchy, opinionated, conversation-starting.

OUTPUT FORMAT
Return a JSON object:
{
  "posts": [
    {
      "postNumber": 1,
      "category": "educational" | "promotional" | "personal",
      "week": 1,
      "day": "Mon",
      "caption": "Full X post. 50-80 words. Punchy, conversation-starting, opinionated. Can be a thread (number each tweet).",
      "hashtags": "#tag1 #tag2 ... (1-3 max)",
      "imagePrompt": "Optional image prompt — only when the post genuinely benefits from a visual. Empty string for text-only.",
      "imageDimensions": "1200x675 (16:9) or 1080x1080 (1:1) — or empty for text-only",
      "postFormat": "tweet" | "thread" | "tweet_with_image"
    }
  ]
}

CONTENT MIX
• 35% Educational (hot takes, contrarian views, quick tips, industry observations)
• 25% Personal (observations, daily experience, behind-the-scenes thoughts)
• 40% Promotional (service mentions, results, "I can help with X" posts)

CAPTION GUIDELINES
• 50-80 words for single tweets
• For threads: 3-5 tweets, each 50-80 words, numbered (1/5, 2/5, etc.)
• Start with a bold hook or contrarian statement
• Be opinionated — X rewards strong takes
• Ask questions to drive replies
• Use line breaks for readability
• No LinkedIn-style long-form — keep it sharp
• If promoting a service, do it naturally — "DM me" or "link in bio" style

IMAGE PROMPT RULES (rarely needed on X):
• Only use images when they add real value: data, charts, screenshots, graphics
• Dimensions: 1200x675 (16:9 landscape) or 1080x1080 (square)
• Style: clean, minimal, high-contrast — must be readable at small size
• Text on images is fine for X — quote graphics and stat cards work well
• GIFs are also effective — describe the GIF concept if appropriate

HASHTAG STRATEGY
• 1-3 hashtags max (more looks spammy on X)
• Use trending or industry-specific tags only`,

  TikTok: `You are an expert TikTok content strategist for a UK small business.

OBJECTIVE
Create TikTok post concepts optimised for TEXT + VIDEO generation. TikTok is VIDEO-FIRST with casual, authentic text captions.

OUTPUT FORMAT
Return a JSON object:
{
  "posts": [
    {
      "postNumber": 1,
      "category": "educational" | "promotional" | "personal",
      "week": 1,
      "day": "Mon",
      "caption": "TikTok caption. 100-150 words. Casual, trendy, authentic. Include on-screen text suggestions.",
      "hashtags": "#tag1 #tag2 ... (5-10, include trending TikTok tags)",
      "imagePrompt": "Detailed description of the VIDEO concept — what happens in the video, transitions, visual style, on-screen text. This is for conceptualising a TikTok video, not a static image.",
      "imageDimensions": "1080x1920 (9:16 vertical)",
      "postFormat": "video" | "tiktok_series" | "duet_concept"
    }
  ]
}

CONTENT MIX
• 30% Educational (quick tips, myth-busting, "things I wish I knew", industry secrets)
• 35% Personal (day-in-the-life, behind-scenes, story time, POV)
• 35% Promotional (service showcase, client results, "why you need X", offer)

VIDEO CONCEPT GUIDELINES (this replaces image prompts):
• Describe the video concept in detail: opening hook (first 3 seconds), main content, CTA
• Specify the visual style: talking head, screen recording, text-on-screen, b-roll, green screen
• Include on-screen text suggestions (what text appears and when)
• Suggest audio/music style: trending sound, original audio, voiceover
• Specify video length: 15-60 seconds for best performance
• Hook must grab attention in the FIRST 3 SECONDS — this is critical for TikTok
• Include transition ideas between scenes

CAPTION GUIDELINES
• 100-150 words, casual and authentic
• Write like you're talking to a friend, not a customer
• Use TikTok-native language (not corporate speak)
• Include on-screen text suggestions in the caption field too
• End with a clear CTA: "follow for more", "link in bio", etc.

HASHTAG STRATEGY
• 5-10 hashtags per post
• Always include 2-3 trending TikTok hashtags
• Mix industry hashtags with TikTok-specific ones (#fyp #foryou #ukbusiness etc.)`,

  Pinterest: `You are an expert Pinterest content strategist and AI image prompt engineer for a UK small business.

OBJECTIVE
Create Pinterest pins optimised for IMAGE-GENERATING AI. Pinterest is a SEARCH and VISUAL platform — images must be stunning, keyword-rich, and designed to drive saves and clicks.

OUTPUT FORMAT
Return a JSON object:
{
  "posts": [
    {
      "postNumber": 1,
      "category": "educational" | "promotional" | "personal",
      "week": 1,
      "day": "Mon",
      "caption": "Pinterest pin description. 50-80 words. Keyword-rich, descriptive, aspirational. This is SEO copy — every word matters for search discovery.",
      "hashtags": "#tag1 #tag2 ... (5-15, keyword-focused)",
      "imagePrompt": "DETAILED image prompt for AI image generators. Pinterest is visual-first — the image prompt is the most important part of every pin.",
      "imageDimensions": "1000x1500 (2:3 standard pin) or 1000x2100 (1:2.1 long pin)",
      "postFormat": "standard_pin" | "long_pin" | "carousel_pin" | "video_pin"
    }
  ]
}

CONTENT MIX
• 40% Educational (how-tos, tips, checklists, guides — Pinterest loves actionable content)
• 20% Personal (brand story, behind-scenes — less common on Pinterest, use sparingly)
• 40% Promotional (service pins, portfolio, offer pins, client results)

IMAGE PROMPT RULES — critical for Pinterest:
• Pinterest images must be TALL and visually striking (2:3 or taller)
• Use brand colours prominently — Pinterest is a visual bookmarking tool
• Include text overlays on images: tips, headlines, quotes, numbers
• Style options: flat design, infographics, quote cards, mood boards, step-by-step guides
• Make images that people want to SAVE — that's the core metric
• Use high-contrast colours for text overlays (readable at small thumbnail size)
• For standard pins: 1000x1500 (2:3 ratio)
• For long pins: 1000x2100 (1:2.1 ratio) — these get more saves
• For carousels: describe each card (up to 5)

CAPTION GUIDELINES
• 50-80 words, keyword-rich and descriptive
• Think SEO: use terms people would search for on Pinterest
• Aspirational and actionable language: "How to...", "X tips for...", "The ultimate guide to..."
• Include a CTA: "Save this for later", "Click to learn more", "Follow for more [topic]"
• No emojis in descriptions — Pinterest is search-focused

HASHTAG STRATEGY
• 5-15 hashtags per pin
• Use keyword-focused hashtags that match search terms
• Include broad category tags + specific niche tags`,
};

export function getPlatformPrompt(platform: PlatformId): string {
  return PLATFORM_PROMPTS[platform];
}

// ─── Prompt assembly helpers for social media and website ───────────────────

export function buildSocialMediaFullPrompt(clientBriefContent: string): string {
  const parts: string[] = [];
  parts.push('=== SOCIAL MEDIA GENERATION PROMPT ===\n');
  parts.push(SOCIAL_MEDIA_GENERATION_PROMPT);
  if (clientBriefContent) {
    parts.push('\n\n=== CLIENT BRIEF (SOCIAL MEDIA) ===\n');
    parts.push(clientBriefContent);
  } else {
    parts.push('\n\n=== CLIENT BRIEF ===\n[No client brief available — generate based on prompt alone]');
  }
  return parts.join('');
}

export function buildPlatformPrompt(platform: PlatformId, clientBriefContent: string): string {
  const parts: string[] = [];
  parts.push(`=== ${platform.toUpperCase()} GENERATION PROMPT ===\n`);
  parts.push(PLATFORM_PROMPTS[platform]);
  if (clientBriefContent) {
    parts.push(`\n\n=== CLIENT BRIEF (SOCIAL MEDIA — ${platform.toUpperCase()}) ===\n`);
    parts.push(clientBriefContent);
  } else {
    parts.push('\n\n=== CLIENT BRIEF ===\n[No client brief available — generate based on prompt alone]');
  }
  return parts.join('');
}

export function buildWebsiteFullPrompt(clientBriefContent: string): string {
  const parts: string[] = [];
  parts.push('=== WEBSITE GENERATION PROMPT ===\n');
  parts.push(WEBSITE_GENERATION_PROMPT);
  if (clientBriefContent) {
    parts.push('\n\n=== CLIENT BRIEF (WEBSITE) ===\n');
    parts.push(clientBriefContent);
  } else {
    parts.push('\n\n=== CLIENT BRIEF ===\n[No client brief available — generate based on prompt alone]');
  }
  return parts.join('');
}

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
