export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: number;
  image: string;
  keywords: string;
  content: React.ReactNode;
}

// Sole Trader Setup Guide
export const SoleTraderSetupArticle: Article = {
  id: 'sole-trader-business-setup-guide-uk',
  slug: 'sole-trader-business-setup-guide-uk',
  title: 'Sole Trader Business Setup Guide: UK',
  description: 'A comprehensive guide to setting up as a sole trader in the UK, including registration, taxes, and legal requirements.',
  category: 'Legal',
  date: '2024-01-15',
  readTime: 8,
  image: '📋',
  keywords: 'sole trader setup UK, register sole trader, UK business registration, self-employment',
  content: (
    <div>
      <p className="text-lg mb-6">
        Starting a business as a sole trader in the UK is one of the simplest and most popular ways to become your own boss. This comprehensive guide walks you through everything you need to know to get started properly.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">What is a Sole Trader?</h2>
      <p className="mb-4">
        A sole trader is a self-employed individual who owns and runs their own business. It's the simplest business structure in the UK, with you personally responsible for the business's debts and obligations.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Step 1: Register with HMRC</h2>
      <p className="mb-4">
        You must register for Self Assessment with HM Revenue and Customs (HMRC) by 5th October following the end of the tax year in which you became self-employed. Register online through the HMRC website.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Step 2: Choose Your Business Name</h2>
      <p className="mb-4">
        You can trade under your own name or choose a business name. Ensure it's unique and doesn't infringe on existing trademarks. Some words require permission to use.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Step 3: Set Up Your Finances</h2>
      <p className="mb-4">
        Open a separate business bank account to keep your personal and business finances separate. This makes accounting much easier and provides clear records for HMRC.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Step 4: Understand Your Tax Obligations</h2>
      <p className="mb-4">
        As a sole trader, you'll pay Income Tax on your profits and Class 2 and Class 4 National Insurance contributions. You'll need to complete a Self Assessment tax return each year.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Documents You Need</h2>
      <p className="mb-4">
        Having proper business documents from day one protects you and presents a professional image:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li>Client service agreements</li>
        <li>Privacy policy (required for GDPR)</li>
        <li>Invoice templates</li>
        <li>Terms and conditions</li>
        <li>Professional business profile</li>
      </ul>

      <p className="mb-4">
        Getting these documents professionally prepared ensures they're legally sound and tailored to your specific business needs.
      </p>
    </div>
  ),
};

// GDPR Compliance Article
export const GdprArticle: Article = {
  id: 'gdpr-compliance-for-sole-traders-uk',
  slug: 'gdpr-compliance-for-sole-traders-uk',
  title: 'GDPR Compliance for UK Sole Traders',
  description: 'Everything UK sole traders need to know about GDPR compliance, privacy policies, and data protection.',
  category: 'Legal',
  date: '2024-01-22',
  readTime: 6,
  image: '🔒',
  keywords: 'GDPR sole trader, UK data protection, privacy policy UK, GDPR compliance small business',
  content: (
    <div>
      <p className="text-lg mb-6">
        If you collect or process any personal data from clients or customers, GDPR compliance isn't optional - it's a legal requirement. Here's what UK sole traders need to know.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Does GDPR Apply to Me?</h2>
      <p className="mb-4">
        Yes, if you collect, store, or process any personal data - including names, email addresses, phone numbers, or payment details - you must comply with GDPR and the UK Data Protection Act 2018.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Your Key Obligations</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>Inform individuals how you use their data</li>
        <li>Only collect data you actually need</li>
        <li>Keep data secure and up to date</li>
        <li>Delete data when it's no longer needed</li>
        <li>Respect individuals' rights to access their data</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">The Privacy Policy Requirement</h2>
      <p className="mb-4">
        Every business that collects personal data must have a clear, accessible privacy policy. This document explains what data you collect, why you collect it, how you use it, and how people can contact you about their data.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">What the Penalties Are</h2>
      <p className="mb-4">
        The ICO (Information Commissioner's Office) can issue fines of up to £17.5 million or 4% of your annual turnover for serious breaches. More commonly, they issue enforcement notices and public reprimands.
      </p>

      <p className="mb-4">
        A properly drafted GDPR-compliant privacy policy protects your business and builds trust with clients.
      </p>
    </div>
  ),
};

// Client Contract Article
export const ClientContractArticle: Article = {
  id: 'client-contract-essentials-uk-freelancers',
  slug: 'client-contract-essentials-uk-freelancers',
  title: 'Client Contract Essentials for UK Freelancers',
  description: 'Key clauses every UK freelancer should include in their client contracts to protect their business.',
  category: 'Legal',
  date: '2024-02-01',
  readTime: 7,
  image: '📝',
  keywords: 'freelance contract UK, client agreement template, freelancer legal protection, service agreement',
  content: (
    <div>
      <p className="text-lg mb-6">
        A solid client contract protects both you and your client. It sets clear expectations and provides legal recourse if things go wrong. Here are the essential elements every UK freelancer should include.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">1. Scope of Work</h2>
      <p className="mb-4">
        Clearly define exactly what you'll deliver. Be specific about deliverables, formats, and revision limits. Vague scopes lead to scope creep and disputes.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">2. Payment Terms</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>Your rates (hourly, project-based, or retainer)</li>
        <li>Payment schedule (upfront, milestone-based, or on completion)</li>
        <li>Accepted payment methods</li>
        <li>Late payment fees and interest</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">3. Intellectual Property Rights</h2>
      <p className="mb-4">
        Specify who owns the work and when ownership transfers. Typically, ownership transfers on full payment, protecting you if a client doesn't pay.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">4. Revision and Amendment Process</h2>
      <p className="mb-4">
        Include how many rounds of revisions are included and the cost of additional changes. This prevents endless revision cycles.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">5. Termination Clause</h2>
      <p className="mb-4">
        Define how either party can end the contract and what happens to work in progress. Include notice periods and kill fees.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">6. Limitation of Liability</h2>
      <p className="mb-4">
        Cap your liability at a reasonable amount, typically the value of the contract. This protects you from excessive claims.
      </p>

      <p className="mb-4">
        Having a professionally drafted contract tailored to your specific services provides much better protection than generic templates.
      </p>
    </div>
  ),
};

// Invoice Article
export const InvoiceArticle: Article = {
  id: 'invoice-template-best-practices-uk',
  slug: 'invoice-template-best-practices-uk',
  title: 'Invoice Template Best Practices for UK Businesses',
  description: 'How to create professional invoices that comply with UK requirements and get you paid faster.',
  category: 'Financial',
  date: '2024-02-08',
  readTime: 5,
  image: '🧾',
  keywords: 'invoice template UK, sole trader invoice requirements, UK invoice format, billing best practices',
  content: (
    <div>
      <p className="text-lg mb-6">
        A well-designed invoice does more than just request payment - it presents a professional image, ensures legal compliance, and can actually help you get paid faster.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Legal Requirements for UK Invoices</h2>
      <p className="mb-4">In the UK, your invoice must include:</p>
      <ul className="list-disc pl-6 mb-6">
        <li>Your business name and address</li>
        <li>Your client's name and address</li>
        <li>A unique invoice number</li>
        <li>Date of issue</li>
        <li>Description of goods or services</li>
        <li>Amount payable (excluding VAT if not registered)</li>
        <li>Payment terms and due date</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">Best Practices for Faster Payment</h2>
      <ul className="list-disc pl-6 mb-6">
        <li><strong>Clear payment terms:</strong> State when payment is due (e.g., "Payment due within 30 days")</li>
        <li><strong>Multiple payment options:</strong> Include bank transfer details, making payment easy</li>
        <li><strong>Professional design:</strong> Clean, branded invoices convey professionalism</li>
        <li><strong>Itemised breakdown:</strong> Clear details prevent queries and delays</li>
        <li><strong>Contact information:</strong> Make it easy to reach you with questions</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">Late Payment Protection</h2>
      <p className="mb-4">
        UK law allows you to charge statutory interest (8% above Bank of England base rate) and fixed fees (£40-100) on late payments. Including this information on your invoice signals you know your rights.
      </p>
    </div>
  ),
};

// Late Payment Article
export const LatePaymentArticle: Article = {
  id: 'late-payment-fees-uk-law',
  slug: 'late-payment-fees-uk-law',
  title: 'Late Payment Fees and UK Law',
  description: 'Your rights under UK law for charging late payment fees and interest on unpaid invoices.',
  category: 'Financial',
  date: '2024-02-15',
  readTime: 6,
  image: '⏰',
  keywords: 'late payment fees UK, statutory interest UK, unpaid invoices, debt recovery sole trader',
  content: (
    <div>
      <p className="text-lg mb-6">
        Chasing unpaid invoices is frustrating, but UK law gives you powerful tools to encourage timely payment. Here's what you can charge and how to apply it.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Statutory Interest</h2>
      <p className="mb-4">
        Under the Late Payment of Commercial Debts (Interest) Act 1998, you can claim statutory interest on late payments. The rate is 8% above the Bank of England base rate.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Fixed Compensation Fees</h2>
      <p className="mb-4">
        In addition to interest, you can claim fixed compensation costs based on the invoice value:</p>
      <ul className="list-disc pl-6 mb-6">
        <li><strong>£40</strong> for debts under £1,000</li>
        <li><strong>£70</strong> for debts between £1,000 and £9,999</li>
        <li><strong>£100</strong> for debts of £10,000 or more</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">What "Late" Means</h2>
      <p className="mb-4">
        A payment is late after the agreed payment term. If no term is agreed, it's late after 30 days for public authorities or 60 days for business transactions. You don't need to mention these rights in your contract - they apply automatically.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">How to Apply These Rights</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>Include a sentence about late payment consequences on your invoices</li>
        <li>Send a formal late payment notice when payment is overdue</li>
        <li>Apply interest and compensation fees consistently</li>
        <li>Consider debt collection services for persistent non-payers</li>
      </ul>

      <p className="mb-4">
        Having clear payment terms in your contract from the start makes enforcing these rights much easier.
      </p>
    </div>
  ),
};

// Array of all articles
export const articles: Article[] = [
  SoleTraderSetupArticle,
  GdprArticle,
  ClientContractArticle,
  InvoiceArticle,
  LatePaymentArticle,
];

// Helper functions
export function getArticleBySlug(slug: string): Article | null {
  return articles.find(a => a.slug === slug) || null;
}

export function getRelatedArticles(currentSlug: string, limit: number = 2): Article[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return [];

  // Get articles from same category, excluding current article
  const sameCategory = articles.filter(a =>
    a.category === current.category && a.slug !== currentSlug
  );

  // If not enough same category, fill with other articles
  const others = articles.filter(a =>
    a.category !== current.category && a.slug !== currentSlug
  );

  return [...sameCategory, ...others].slice(0, limit);
}
