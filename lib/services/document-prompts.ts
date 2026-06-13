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
