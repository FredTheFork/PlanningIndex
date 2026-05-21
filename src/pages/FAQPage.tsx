import { useState } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-inter font-semibold text-medium-blue uppercase block mb-3"
      style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  );
}

function PageHeader() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0 72px',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 800 }}>
        <span
          className="font-inter font-semibold uppercase block"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '72px',
          }}
        >
          COMMON QUESTIONS
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Questions we hear a lot.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 620,
          }}
        >
          Get honest answers about what Foundationary does, what it doesn't, and whether it's right for your business.
        </p>
      </div>
    </section>
  );
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: 'what-is',
    category: 'The Basics',
    question: 'What exactly is Foundationary?',
    answer: 'Foundationary is a done-for-you service that creates professional business documents tailored to your specific situation. You answer a structured questionnaire about your business, and we generate a complete set of documents including Terms & Conditions, Privacy Policy, Client Agreement, and other operational essentials — all specific to you and UK law. It\'s not a template tool, not a legal service, and not software. It\'s bespoke work delivered once.',
  },
  {
    id: 'not-legal',
    category: 'The Basics',
    question: 'Is this a legal service? Are you lawyers?',
    answer: 'No. Foundationary documents are professionally drafted and UK-compliant, but we\'re not a law firm and don\'t provide legal advice. Think of us as a structured service that gets your documentation right the first time. If you need legal advice about your specific situation, you should consult a solicitor. Our documents are designed to work well for most UK sole traders, but they\'re not a substitute for professional legal counsel.',
  },
  {
    id: 'who-for',
    category: 'The Basics',
    question: 'Who is Foundationary for?',
    answer: 'Foundationary is built for UK sole traders and micro-businesses who sell services. You should be comfortable working independently, want your documents to sound professional but human, and don\'t need ongoing subscriptions or endless customisation. You shouldn\'t expect Foundationary to handle complex corporate structures, multi-jurisdictional work, or highly specialised legal scenarios. We\'re for people who want strong foundations without the solicitor price tag.',
  },
  {
    id: 'not-for',
    category: 'The Basics',
    question: 'Who is Foundationary NOT for?',
    answer: 'If you\'re running a large incorporated company, need ongoing legal support, want to modify every single clause yourself, or need advice rather than documents — Foundationary isn\'t the right fit. Similarly, if you operate outside the UK, sell physical products at scale, or have highly complex contract requirements, you\'ll need something more specialist. We\'re comfortable with that line.',
  },
  {
    id: 'what-included',
    category: 'What You Get',
    question: 'What documents do I actually get?',
    answer: 'Your package includes: Terms & Conditions (tailored to your specific services), Privacy Policy (GDPR-compliant), Client Agreement (for project-based work), Invoice Template (branded to your business), Social Media Policy, Email Communications Guidelines, and a Intake Form Template. Everything is delivered as both editable Word documents and professional PDFs. You own all the documents outright — no licensing restrictions.',
  },
  {
    id: 'custom',
    category: 'What You Get',
    question: 'Can I customise the documents?',
    answer: 'Absolutely. You receive editable Word documents, so you can adjust them as your business evolves. However, customisation is your responsibility — we don\'t provide ongoing editing or updates. The documents are designed to be clear and straightforward, so most changes are simple. If you want something substantially different, you\'re free to work with a solicitor to modify them further.',
  },
  {
    id: 'how-works',
    category: 'How It Works',
    question: 'How do I get started?',
    answer: 'You complete our structured intake form — it takes about 20-30 minutes and asks about your business, how you work, how you charge, how you handle data, and how you want to sound. We then generate your complete document package based on your answers. You\'ll receive everything within 5 business days. If we spot any red flags or inconsistencies, we let you know before delivery.',
  },
  {
    id: 'timeline',
    category: 'How It Works',
    question: 'How long does it take?',
    answer: 'From submitting your intake form to receiving your complete package is typically 5 business days. The form itself takes about 20-30 minutes to complete. We don\'t rush this process — every document is reviewed individually for accuracy and consistency before you receive it.',
  },
  {
    id: 'revisions',
    category: 'How It Works',
    question: 'What if I don\'t like the documents?',
    answer: 'We stand by our work. If something doesn\'t feel right — if the tone misses your brand, if something is genuinely unclear, or if you spot an error — we\'ll revise it. We\'re not running a factory; we\'re delivering work that should actually work for you. Just get in touch and we\'ll make it right.',
  },
  {
    id: 'after-delivery',
    category: 'After Delivery',
    question: 'What happens after I receive my documents?',
    answer: 'They\'re yours to use. Add them to your website, share with clients, print them, adapt them — you own them completely. We don\'t provide ongoing updates or support subscriptions. Your responsibility is to keep them current as your business evolves. If you need to make changes in the future, you can do so yourself or work with a solicitor.',
  },
  {
    id: 'updates',
    category: 'After Delivery',
    question: 'Do I need to update my documents over time?',
    answer: 'Yes, responsibly. If significant things change about your business — your services, how you charge, how you handle data, your contact details — you should review and update relevant sections. This isn\'t complex; the documents are written to be clear. Annual reviews are sensible. Major legal changes (like GDPR updates) might also require attention, though we\'ll only know about those if you get in touch.',
  },
  {
    id: 'legal-changes',
    category: 'After Delivery',
    question: 'What if UK law changes after I get my documents?',
    answer: 'You\'re responsible for staying informed about legal changes that affect your business. Foundationary doesn\'t include ongoing legal monitoring or automatic updates. If major legal changes happen (GDPR reforms, employment law changes, etc.), we won\'t proactively notify you. It\'s worth subscribing to business law update services and consulting with a solicitor if you\'re unsure whether changes affect your documents.',
  },
  {
    id: 'price',
    category: 'Pricing & Investment',
    question: 'Why is it £79?',
    answer: 'We\'ve priced Foundationary to be accessible to sole traders, but not so cheap that it suggests the work isn\'t serious. £79 covers bespoke document generation, individual review for your situation, and ownership of everything you receive. It\'s not a subscription trap — you pay once and own the work. Compared to solicitor quotes (£1,000+) or the DIY risk of generic templates, it represents genuine value.',
  },
  {
    id: 'add-ons',
    category: 'Pricing & Investment',
    question: 'What additional services do you offer?',
    answer: 'We offer several add-ons: Branded PDF Generation (professional-looking PDFs with your branding), Document Hosting (we host and manage your documents on your behalf), Quarterly Reviews (we review and update documents for legal changes), and Solicitor Consultation (a single session with a solicitor if you need guidance beyond documents). Check our Additional Services page for current pricing and details.',
  },
  {
    id: 'money-back',
    category: 'Trust & Safety',
    question: 'Is there a guarantee?',
    answer: 'We stand by our work. If you receive your documents and they genuinely don\'t meet your needs — the tone is wrong, something feels off, or you spot an error — we\'ll revise them at no extra cost. We\'re not offering refunds for "I changed my mind" scenarios, but we will make sure what you receive is actually good.',
  },
  {
    id: 'data-privacy',
    category: 'Trust & Safety',
    question: 'What happens to my business information?',
    answer: 'Your intake form data is only used to generate your documents. We don\'t sell, share, or use it for marketing. You own all documents — there\'s no licensing or tracking. We store your information securely to enable document generation and quality review. You can request deletion of your data after delivery (we\'ll keep minimal records for invoicing). Our full Privacy Policy is on this website.',
  },
  {
    id: 'gdpr',
    category: 'Trust & Safety',
    question: 'Are your documents GDPR-compliant?',
    answer: 'Your Privacy Policy is written to meet GDPR requirements for UK sole traders handling customer data. Your other documents follow UK legal standards. However, GDPR compliance isn\'t just about documents — it\'s also about how you actually process and store data. Our Privacy Policy is a starting point; actual compliance depends on your practices. If you handle sensitive personal data at scale, consult with a Data Protection Officer.',
  },
  {
    id: 'contracts',
    category: 'The Documents',
    question: 'Can I use these documents with international clients?',
    answer: 'Your documents are written for UK law and UK sole traders. If you work internationally, you have options: use the documents as-is (many clients accept UK terms), have them reviewed by a solicitor familiar with your client\'s jurisdiction, or get documents created specifically for other territories. Most of our clients work with UK or EU-based clients and use the documents successfully without modification.',
  },
  {
    id: 'liability',
    category: 'The Documents',
    question: 'What if a client disputes a contract term?',
    answer: 'Disputes happen in business. Your Terms & Conditions are designed to be clear and protect your position, but having good documents doesn\'t eliminate all disputes. The quality of your relationships, communication, and how you deliver work matter far more. If a dispute escalates, you may need legal support. Documents are a foundation, not armor.',
  },
  {
    id: 'template',
    category: 'The Documents',
    question: 'Can I use documents for multiple businesses?',
    answer: 'No. Each package is tailored to one specific business based on your answers. If you run multiple businesses, you\'ll need separate packages for each. We can offer a discount for multiple orders — just get in touch. The documents are specific enough that using one for different businesses would undermine the whole point.',
  },
  {
    id: 'support',
    category: 'Support',
    question: 'Do you offer ongoing support?',
    answer: 'Standard Foundationary includes post-delivery support for questions about your specific documents. Beyond that, ongoing support and quarterly reviews are add-on services. We\'re responsive and helpful, but we\'re not a retainer service. Think of it as: we deliver excellent work and answer questions about it; we don\'t manage your business operations.',
  },
  {
    id: 'contact-support',
    category: 'Support',
    question: 'How do I contact support?',
    answer: 'Email foundationarybusiness@gmail.com or call +44 7377 203834. We aim to respond to emails within 24 hours. For complex queries, a phone call often works better — we\'ll discuss your situation and guide you accordingly.',
  },
  {
    id: 'conflict',
    category: 'Support',
    question: 'What if my documents conflict with each other?',
    answer: 'This shouldn\'t happen — we check for consistency before delivery. If you spot a conflict between documents, let us know immediately. We\'ll clarify or revise. Most conflicts are resolved through a quick discussion about what you actually need.',
  },
  {
    id: 'team',
    category: 'About Us',
    question: 'Who\'s behind Foundationary?',
    answer: 'Foundationary was built by someone who got tired of seeing talented sole traders operate without proper protection. We combine business experience, design thinking, and an obsession with clarity to deliver documents that actually work. We\'re not a corporate operation; we\'re a focused service designed specifically for UK sole traders.',
  },
  {
    id: 'why-different',
    category: 'About Us',
    question: 'Why is Foundationary different from template sites?',
    answer: 'Template sites give you generic documents. Foundationary generates bespoke documents based on your specific answers. Templates force you to read 20 pages and delete what doesn\'t apply; we only include what does. Templates sound corporate; ours sound like you. Templates assume you know what you\'re doing; ours are reviewed for sense before delivery. It\'s bespoke without the solicitor cost.',
  },
  {
    id: 'feedback',
    category: 'About Us',
    question: 'Can I give feedback on Foundationary?',
    answer: 'Absolutely. We genuinely want to know if something doesn\'t work for you. Email us with feedback, suggestions, or complaints. We read everything and take it seriously. If Foundationary isn\'t serving your needs well, we want to know why and how to improve.',
  },
];

interface ExpandedState {
  [key: string]: boolean;
}

function FAQAccordion() {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const toggleExpanded = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        {categories.map(category => (
          <div key={category} className="mb-16">
            <SectionLabel>{category.toUpperCase()}</SectionLabel>
            <h2
              className="font-inter font-bold text-dark-text mb-8"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)' }}
            >
              {category}
            </h2>

            <div className="flex flex-col gap-3">
              {faqs.filter(faq => faq.category === category).map(faq => (
                <div
                  key={faq.id}
                  className="bg-off-white rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <h3
                      className="font-inter font-semibold text-dark-text pr-4"
                      style={{ fontSize: '1rem' }}
                    >
                      {faq.question}
                    </h3>
                    <ChevronDown
                      size={20}
                      className="text-navy shrink-0 transition-transform duration-200"
                      style={{
                        transform: expanded[faq.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>

                  {expanded[faq.id] && (
                    <div className="px-6 pb-6 border-t border-border">
                      <p
                        className="font-inter text-secondary-text leading-[1.7]"
                        style={{ fontSize: '0.95rem' }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="text-center px-6"
      style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 700 }}>
        <h2
          className="font-inter font-bold text-white"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          Still have questions?
        </h2>
        <p
          className="font-inter font-normal mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          Get in touch directly and we'll help you work out whether Foundationary is the right fit for your business.
        </p>
        <Link
          to="/contact"
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1rem', minHeight: 48 }}
        >
          Get In Touch
        </Link>
      </div>
    </section>
  );
}

export default function FAQPage() {
  return (
    <>
      <PageHeader />
      <FAQAccordion />
      <CTASection />
    </>
  );
}
