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
