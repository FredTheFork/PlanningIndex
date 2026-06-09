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
    generationPrompt: `[PLACEHOLDER: Terms and Conditions generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'service_agreement_contract',
    document_label: 'Service Agreement Contract',
    generationPrompt: `[PLACEHOLDER: Service Agreement Contract generation prompt]`,
    agentInstructions: SHARED_AGENT_INSTRUCTIONS,
  },
  {
    document_type: 'gdpr_privacy_policy',
    document_label: 'GDPR Privacy Policy',
    generationPrompt: `[PLACEHOLDER: GDPR Privacy Policy generation prompt]`,
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
