export interface IndustryTestimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface IndustryFAQ {
  q: string;
  a: string;
}

export interface IndustryComplianceAlert {
  title: string;
  content: string;
}

export type IndustryIconName = 'users' | 'briefcase' | 'hard-hat' | 'camera';

export interface IndustryPageConfig {
  slug: string;
  label: string;
  iconName: IndustryIconName;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  packId: string;
  bundleId: string;
  foundationDescription: string;
  testimonials: IndustryTestimonial[];
  faqs: IndustryFAQ[];
  complianceAlert?: IndustryComplianceAlert;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
}

export const industryConfigs: Record<string, IndustryPageConfig> = {
  coaches: {
    slug: 'coaches',
    label: 'FOR COACHES',
    iconName: 'users',
    heroImage: '/images/hero/coaches-hero.jpg',
    heroTitle: 'Professional documents for UK coaches',
    heroSubtitle: 'Coaching agreements, session terms, ethical standards, and CPD tracking. Built specifically for UK coaching professionals.',
    packId: 'coach_industry_pack',
    bundleId: 'coach_full_bundle',
    foundationDescription: 'The core business documents every coach needs: client contracts, terms, invoice templates, and welcome emails.',
    testimonials: [
      {
        quote: "I bought the documents and website copy together and the 10% discount made the decision easy. The bigger win was consistency. My contract, my website, my LinkedIn — they all read like the same person runs them now. Two clients have mentioned how professional everything looks, completely unprompted.",
        name: 'Anita S.',
        role: 'Business Coach, Edinburgh',
        initials: 'AS',
      },
    ],
    faqs: [
      {
        q: 'Do these documents suit executive and life coaches?',
        a: 'Yes. The coaching agreement is written to be adaptable. Whether you coach executives on leadership or individuals on personal development, the core terms (confidentiality, session structure, payment, cancellations) work the same way.',
      },
      {
        q: 'Does the Coaching Code of Ethics replace my professional body membership?',
        a: 'No. The code of ethics in this pack aligns with common UK coaching standards but is not a substitute for membership bodies like the Association for Coaching or ICF. Use it as your client-facing ethics statement.',
      },
      {
        q: "What's the CPD Tracker for?",
        a: 'Continuing Professional Development tracking is essential for accredited coaches. The template helps you log training hours, workshops, and supervision sessions for credential renewal.',
      },
      {
        q: 'Can I edit the supervision policy?',
        a: 'Yes. You receive editable Word files. The supervision policy outlines your commitment to professional supervision as a coach, which some accreditation bodies require.',
      },
    ],
    ctaTitle: 'Ready to professionalise your coaching practice?',
    ctaSubtitle: 'Get coaching agreements, session terms, and ethics documentation delivered within 3-5 business days.',
    ctaButtonLabel: 'Get the Coach Bundle',
  },
  consultants: {
    slug: 'consultants',
    label: 'FOR CONSULTANTS',
    iconName: 'briefcase',
    heroImage: '/images/hero/consultants-hero.jpg',
    heroTitle: 'Professional documents for UK consultants',
    heroSubtitle: 'Consulting agreements, deliverables specs, NDAs, and engagement closure. Built specifically for UK consulting professionals.',
    packId: 'consultant_industry_pack',
    bundleId: 'consultant_full_bundle',
    foundationDescription: 'The core business documents every consultant needs: client contracts, terms, invoice templates, and welcome emails.',
    testimonials: [
      {
        quote: "I'd been working on a verbal agreement for two years — nothing in writing. Then a client tried to dispute the scope of a whole month's work. I'd received my Foundationary pack two weeks earlier. My new contract had a scope-of-work clause that settled it immediately. That document paid for itself in the first week.",
        name: 'Marcus T.',
        role: 'IT Consultant, Leeds',
        initials: 'MT',
      },
    ],
    faqs: [
      {
        q: 'Do these documents work for management consultants?',
        a: 'Yes. The consulting agreement covers strategic engagements, deliverables, milestones, and knowledge transfer. Whether you consult on IT, management, HR, or operations, the core terms apply.',
      },
      {
        q: 'What is the Knowledge Transfer Protocol?',
        a: 'A structured document for handing over work to clients at the end of an engagement. It ensures your findings, recommendations, and deliverables are properly documented and transferred.',
      },
      {
        q: "Do I need the NDA if my clients already have one?",
        a: "It's wise to have your own mutual NDA. Client NDAs often protect only their interests. This one protects your methodologies, findings, and work product too.",
      },
      {
        q: 'Can I use the Engagement Closure Report for fixed-price projects?',
        a: 'Yes. The closure report template works for both fixed-price and time-based engagements. It documents what was delivered, any outstanding items, and formal closure.',
      },
    ],
    ctaTitle: 'Ready to protect your consulting work?',
    ctaSubtitle: 'Get consulting agreements, NDAs, and deliverables specs delivered within 3-5 business days.',
    ctaButtonLabel: 'Get the Consultant Bundle',
  },
  contractors: {
    slug: 'contractors',
    label: 'FOR CONTRACTORS',
    iconName: 'hard-hat',
    heroImage: '/images/hero/contractors-hero.jpg',
    heroTitle: 'Professional documents for UK contractors',
    heroSubtitle: 'H&S policy, risk assessments, method statements, COSHH, and CDM compliance. Built specifically for UK construction contractors.',
    packId: 'contractor_industry_pack',
    bundleId: 'contractor_full_bundle',
    foundationDescription: 'The core business documents every contractor needs: client contracts, terms, invoice templates, and payment protection.',
    testimonials: [
      {
        quote: "I knew I needed a GDPR policy — the ICO reminders made that very clear — but every template I found was written for a US business or missed entire sections. The policy from Foundationary was written specifically for UK sole traders who collect client data by email. No grey areas. I finally felt like a compliant business.",
        name: 'Priya K.',
        role: 'Kitchen Fitter, Birmingham',
        initials: 'PK',
      },
    ],
    faqs: [
      {
        q: 'Do these documents meet CDM 2015 requirements?',
        a: 'Yes. The Construction Phase Plan is written for small contractors operating as sole traders. It covers your legal duties under CDM 2015 without the overhead of larger principal contractor paperwork.',
      },
      {
        q: 'What is COSHH and do I need it?',
        a: 'COSHH (Control of Substances Hazardous to Health) is required if your work involves materials like cement, adhesives, dust, or chemicals. The COSHH Assessment template helps you document handling procedures.',
      },
      {
        q: 'Is the H&S Policy suitable for subcontractors?',
        a: 'Yes. The H&S policy works for both main contractors and subcontractors. It covers site safety, risk assessments, and your responsibilities regardless of your role in the project chain.',
      },
      {
        q: 'Can commercial clients require different documentation?',
        a: 'Commercial clients may have their own forms. These documents cover your statutory requirements. You can adapt them or attach client-specific forms as needed. The Risk Assessment and Method Statement templates align with industry standards most commercial clients expect.',
      },
    ],
    complianceAlert: {
      title: 'Legal requirements for UK contractors',
      content: 'UK law requires contractors to have a written Health & Safety Policy (5+ employees), Risk Assessments for all work activities, and Method Statements for higher-risk tasks. CDM 2015 applies to all construction work, including jobs for domestic clients. These documents help you meet those obligations.',
    },
    ctaTitle: 'Ready to meet your legal requirements?',
    ctaSubtitle: 'Get H&S policy, risk assessments, and method statements delivered within 3-5 business days.',
    ctaButtonLabel: 'Get the Contractor Bundle',
  },
  photographers: {
    slug: 'photographers',
    label: 'FOR PHOTOGRAPHERS',
    iconName: 'camera',
    heroImage: '/images/hero/photographers-hero.jpg',
    heroTitle: 'Professional documents for UK photographers',
    heroSubtitle: 'Licensing agreements, model releases, delivery terms, and editing briefs. Built specifically for UK photography businesses.',
    packId: 'photographer_industry_pack',
    bundleId: 'photographer_full_bundle',
    foundationDescription: 'The core business documents every photographer needs: client contracts, terms, invoice templates, and welcome emails.',
    testimonials: [
      {
        quote: "The quarterly refresh is something I didn't know I needed. I updated my contract once in three years and by then my pricing, working conditions, and cancellation policy had all changed. Now I update one document every quarter. It costs less than a coffee order per month and means I'm never operating on outdated terms.",
        name: 'Emma W.',
        role: 'Photographer, Brighton',
        initials: 'EW',
      },
    ],
    faqs: [
      {
        q: 'Do these documents cover UK photography law?',
        a: 'Yes. All documents reference UK copyright law, GDPR requirements for image data, and standard UK commercial photography practices. The licensing agreements are written for UK enforcement.',
      },
      {
        q: 'Can I use the model release for minors?',
        a: 'The model release form includes provisions for parental/guardian consent. You can use it for both adult and minor subjects.',
      },
      {
        q: "What's the difference between the Photography Pack and the Business Foundations Pack?",
        a: 'The Business Foundations Pack gives you core business documents (contracts, terms, invoices, welcome emails). The Photography Pack adds industry-specific documents (licensing agreements, model releases, shot lists). Most photographers start with a bundle that includes both.',
      },
      {
        q: 'Can I edit the licensing terms for each client?',
        a: 'Yes. You receive editable Word files. The licensing agreement includes standard usage rights, but you can adjust permitted uses, timeframes, and territorial restrictions per client.',
      },
    ],
    ctaTitle: 'Ready to protect your photography business?',
    ctaSubtitle: 'Get licensing agreements, model releases, and client terms delivered within 3-5 business days.',
    ctaButtonLabel: 'Get the Photographer Bundle',
  },
};

export const industrySlugs = Object.keys(industryConfigs);

export function getIndustryConfig(slug: string): IndustryPageConfig | undefined {
  return industryConfigs[slug];
}
