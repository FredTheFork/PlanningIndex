export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: 'what-is',
    category: 'The Basics',
    question: 'What exactly is Foundationary?',
    answer: 'Foundationary is a done-for-you service that creates professional business content tailored to your specific situation. You answer a structured questionnaire about your business, and we generate a complete set of documents, website copy, and social media posts — all specific to you and UK law. It\'s not a template tool, not a legal service, and not software. It\'s bespoke work delivered once.',
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
    answer: 'Foundationary is built for UK sole traders and micro-businesses who sell services. You should be comfortable working independently, want your documents and content to sound professional but human, and want done-for-you work without having to piece it together yourself. We\'re for people who want strong foundations — in documents, website copy, and social presence — without the solicitor price tag.',
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
    answer: 'The Business Foundations Pack includes 10 tailored documents created from your completed questionnaire, covering legal protection, client communication, positioning, and admin essentials for UK sole traders. This includes a bespoke client contract, Terms and Conditions, GDPR-compliant Privacy Policy, professional bio, elevator pitches, LinkedIn profile copy, branded invoice template, client welcome emails, late payment letters, and service description sheets.',
  },
  {
    id: 'custom',
    category: 'What You Get',
    question: 'Can I customise the documents?',
    answer: 'Absolutely. You receive editable Word documents, so you can adjust them as your business evolves. However, customisation is your responsibility — we don\'t provide ongoing editing or updates (unless you subscribe to the Quarterly Refresh). The documents are designed to be clear and straightforward, so most changes are simple. If you want something substantially different, you\'re free to work with a solicitor to modify them further.',
  },
  {
    id: 'how-works',
    category: 'How It Works',
    question: 'How do I get started?',
    answer: 'You choose the service or bundle you want, then complete our structured intake form — it takes about 20-30 minutes and asks about your business, how you work, how you charge, how you handle data, and how you want to sound. We then generate your complete package based on your answers. You\'ll receive documents within 5 business days; website copy and social media posts within 3-5 business days. If we spot any red flags or inconsistencies, we let you know before delivery.',
  },
  {
    id: 'timeline',
    category: 'How It Works',
    question: 'How long does it take?',
    answer: 'Documents are typically delivered within 5 business days. Website copy and social media posts are delivered within 3-5 business days. The intake form itself takes about 20-30 minutes to complete. We don\'t rush this process — every piece of content is reviewed individually for accuracy and consistency before you receive it.',
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
    answer: 'They\'re yours to use. Add them to your website, share with clients, print them, adapt them — you own them completely. Your responsibility is to keep them current as your business evolves. If you need to make changes in the future, you can do so yourself, subscribe to the Quarterly Document Refresh for regular updates, or work with a solicitor.',
  },
  {
    id: 'updates',
    category: 'After Delivery',
    question: 'Do I need to update my documents over time?',
    answer: 'Yes, responsibly. If significant things change about your business — your services, how you charge, how you handle data, your contact details — you should review and update relevant sections. This isn\'t complex; the documents are written to be clear. Annual reviews are sensible. Major legal changes (like GDPR updates) might also require attention. You can handle updates yourself, or subscribe to the Quarterly Document Refresh and we\'ll update one document every four months for you.',
  },
  {
    id: 'legal-changes',
    category: 'After Delivery',
    question: 'What if UK law changes after I get my documents?',
    answer: 'You\'re responsible for staying informed about legal changes that affect your business. Foundationary doesn\'t include ongoing legal monitoring or automatic updates (unless you subscribe to the Quarterly Refresh). If major legal changes happen (GDPR reforms, employment law changes, etc.), we won\'t proactively notify you. It\'s worth subscribing to business law update services and consulting with a solicitor if you\'re unsure whether changes affect your documents.',
  },
  {
    id: 'price',
    category: 'Pricing & Bundles',
    question: 'How much does it cost?',
    answer: 'The Business Foundations Pack is £79 — a one-time payment for 10 bespoke documents. The Website Copy Starter Pack starts from £35 per page (1–10 pages). The Social Media Starter Pack starts from £20 for 5 posts (up to 30 posts). The Quarterly Document Refresh is £29 every 4 months as a subscription. All prices are in GBP.',
  },
  {
    id: 'add-ons',
    category: 'Pricing & Bundles',
    question: 'What additional services do you offer?',
    answer: 'Beyond the Business Foundations Pack, we offer the Website Copy Starter Pack (from £35 per page), the Social Media Starter Pack (from £20 for 5 posts), and the Quarterly Document Refresh (£29 every 4 months). Each service can be purchased on its own or bundled together for a discount.',
  },
  {
    id: 'bundles',
    category: 'Pricing & Bundles',
    question: 'How do bundle discounts work?',
    answer: 'When you purchase two services together, you receive 10% off the total. When you purchase three or more services, you receive 15% off — our best value. The discount applies to the combined price of all services in your order and is applied automatically at checkout.',
  },
  {
    id: 'quantity-pricing',
    category: 'Pricing & Bundles',
    question: 'How does pricing work for website copy and social media posts?',
    answer: 'Website copy is priced per page, starting at £35 for a single page with volume discounts as you add more pages — up to 10 pages. Social media posts are priced in tiers: 5 posts for £20, 10 for £40, 15 for £57, 20 for £73, 25 for £80, and 30 for £110. You choose the quantity that fits your needs during checkout.',
  },
  {
    id: 'money-back',
    category: 'Trust & Safety',
    question: 'Is there a guarantee?',
    answer: 'We stand by our work. If you receive your content and it genuinely doesn\'t meet your needs — the tone is wrong, something feels off, or you spot an error — we\'ll revise it at no extra cost. We\'re not offering refunds for "I changed my mind" scenarios, but we will make sure what you receive is actually good.',
  },
  {
    id: 'data-privacy',
    category: 'Trust & Safety',
    question: 'What happens to my business information?',
    answer: 'Your intake form data is only used to generate your content. We don\'t sell, share, or use it for marketing. You own all documents, website copy, and social media posts — there\'s no licensing or tracking. We store your information securely to enable content generation and quality review. You can request deletion of your data after delivery (we\'ll keep minimal records for invoicing). Our full Privacy Policy is on this website.',
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
    id: 'website-what',
    category: 'Website Copy & Social Media',
    question: 'What does the Website Copy Starter Pack include?',
    answer: 'You receive professionally written website copy tailored to your brand voice and services. This typically includes Homepage (hero, benefits, CTA), About page, Services page, Contact page, and additional pages as needed (FAQ, Blog, Pricing, Testimonials). Copy is SEO-aware and ready to paste into any website builder. You can choose between 1 and 10 pages.',
  },
  {
    id: 'website-delivery',
    category: 'Website Copy & Social Media',
    question: 'How is website copy delivered?',
    answer: 'Website copy is delivered as a structured document you can paste directly into your website builder (Wix, Squarespace, WordPress, etc.). You\'ll also receive a Bolt.new prompt that can generate a complete, styled website from your copy — a ready-to-deploy site you can host on Vercel or Netlify. This is website copy, not web development — it gives you the words and structure, not a custom-coded site.',
  },
  {
    id: 'social-what',
    category: 'Website Copy & Social Media',
    question: 'What does the Social Media Starter Pack include?',
    answer: 'You receive done-for-you social media posts tailored to your industry, audience, and tone. Posts include a mix of educational content, promotional posts, and personal/trust-building posts. Each post comes with a caption and hashtag suggestions. You can choose between 5 and 30 posts.',
  },
  {
    id: 'social-platforms',
    category: 'Website Copy & Social Media',
    question: 'Which social media platforms are covered?',
    answer: 'Posts are written to work across major platforms including LinkedIn, Instagram, Facebook, and X (Twitter). During the intake process, you tell us which platforms you use, and we tailor the copy length, tone, and hashtag strategy accordingly. Posts for LinkedIn tend to be more professional and long-form; Instagram posts are more visual and concise.',
  },
  {
    id: 'social-results',
    category: 'Website Copy & Social Media',
    question: 'Can you guarantee social media results?',
    answer: 'No. Social media success depends on many factors beyond the posts themselves — your consistency, engagement, audience, platform algorithm, and timing. We provide high-quality, professionally written posts that give you a strong foundation and save you significant time. But no service can guarantee followers, engagement, or conversions from social media content alone.',
  },
  {
    id: 'support',
    category: 'Support',
    question: 'Do you offer ongoing support?',
    answer: 'Standard Foundationary includes post-delivery support for questions about your specific content. Beyond that, the Quarterly Document Refresh provides ongoing document updates on a subscription basis. We\'re responsive and helpful, but we\'re not a retainer service. Think of it as: we deliver excellent work and answer questions about it; we don\'t manage your business operations.',
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
    answer: 'Foundationary was built by someone who got tired of seeing talented sole traders operate without proper protection or professional content. We combine business experience, design thinking, and an obsession with clarity to deliver documents, website copy, and social media posts that actually work. We\'re not a corporate operation; we\'re a focused service designed specifically for UK sole traders.',
  },
  {
    id: 'why-different',
    category: 'About Us',
    question: 'Why is Foundationary different from template sites?',
    answer: 'Template sites give you generic documents. Foundationary generates bespoke content based on your specific answers. Templates force you to read 20 pages and delete what doesn\'t apply; we only include what does. Templates sound corporate; ours sound like you. Templates assume you know what you\'re doing; ours are reviewed for sense before delivery. It\'s bespoke without the solicitor cost — and we don\'t just do documents. We cover your website copy and social media too.',
  },
  {
    id: 'feedback',
    category: 'About Us',
    question: 'Can I give feedback on Foundationary?',
    answer: 'Absolutely. We genuinely want to know if something doesn\'t work for you. Email us with feedback, suggestions, or complaints. We read everything and take it seriously. If Foundationary isn\'t serving your needs well, we want to know why and how to improve.',
  },
];
