// Article content database - extracted from static HTML blog files
// Each article is a React component with full content

export interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  date: string;
  image: string;
  keywords: string;
  content: React.ReactNode;
  relatedArticles: { title: string; slug: string }[];
}

// GDPR Compliance Article
export const GdprArticle = (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">What is UK GDPR?</h2>
    <p>The UK General Data Protection Regulation (GDPR) is the primary law governing how organisations collect, use, and protect personal data. It came into effect on 1 January 2021, following the UK's departure from the EU, and replaces the previous Data Protection Act 1998.</p>
    <p>GDPR gives individuals rights over their personal data and requires organisations to be transparent about how they use it. Non-compliance can result in fines up to £17.5 million or 4% of annual turnover (whichever is higher).</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Does GDPR Apply to Sole Traders?</h2>
    <p><strong>Yes. If you process any personal data, GDPR applies to you.</strong></p>
    <p>Many sole traders think GDPR only applies to large companies. This is a dangerous misconception. GDPR applies to:</p>
    <ul className="list-disc pl-6 space-y-3">
      <li>Freelancers collecting client contact information</li>
      <li>Service providers with email lists</li>
      <li>Anyone with a website form that collects names/emails</li>
      <li>Consultants storing client data</li>
      <li>Trainers maintaining attendee records</li>
    </ul>
    <p>If you're a sole trader and you process personal data in any way, GDPR applies.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">What Data Do You Collect?</h2>
    <p>Personal data includes any information that can identify an individual:</p>
    <ul className="list-disc pl-6 space-y-3">
      <li><strong>Names and contact details</strong> - Email addresses, phone numbers, postal addresses</li>
      <li><strong>Business information</strong> - Company names, job titles, work contact details</li>
      <li><strong>Usage data</strong> - IP addresses from website visitors, cookie data</li>
      <li><strong>Payment information</strong> - Though payment processors handle PCI compliance</li>
      <li><strong>Communication records</strong> - Emails, messages, call logs</li>
      <li><strong>Transaction history</strong> - Records of what clients bought/used</li>
    </ul>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-[#1B3F7A] mb-3">Quick Tip</h4>
      <p>Even collecting a client's email address for a quote is processing personal data under GDPR. You need to tell them how you'll use it.</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Lawful Basis for Processing</h2>
    <p>Before you process any personal data, you must have a "lawful basis." GDPR lists six possible bases:</p>
    <ol className="list-decimal pl-6 space-y-3">
      <li><strong>Consent</strong> - The person has explicitly agreed (most common for marketing)</li>
      <li><strong>Contract</strong> - You need the data to fulfill a contract with them</li>
      <li><strong>Legal obligation</strong> - UK/EU law requires you to process it (tax, employment, etc.)</li>
      <li><strong>Vital interests</strong> - Protecting someone's health or life</li>
      <li><strong>Public task</strong> - You're performing a public function</li>
      <li><strong>Legitimate interests</strong> - You have a legitimate business reason (most common for business)</li>
    </ol>

    <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-red-700 mb-3">Critical</h4>
      <p>"Because they're my client" is NOT a lawful basis. You must pick one from the list above. For most sole traders, "contract" or "legitimate interests" work best.</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Privacy Policy Requirements</h2>
    <p>You MUST have a privacy policy if you collect any personal data. Here's what it must include:</p>
    <ul className="list-disc pl-6 space-y-3">
      <li><strong>Who you are</strong> - Your business name and contact details</li>
      <li><strong>What data you collect</strong> - Be specific and honest</li>
      <li><strong>Why you collect it</strong> - Your lawful basis and purpose</li>
      <li><strong>How long you keep it</strong> - Storage duration (e.g., "until contract ends, then 6 years for accounting")</li>
      <li><strong>Who you share it with</strong> - Your email provider, accountant, contractors, etc.</li>
      <li><strong>Data subject rights</strong> - Their rights under GDPR (see below)</li>
      <li><strong>How to contact you</strong> - For data access requests</li>
    </ul>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-[#1B3F7A] mb-3">Pro Tip</h4>
      <p>Your privacy policy should be on your website and available to download. Make it plain language, not legal jargon. People should actually understand it.</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Data Subject Rights</h2>
    <p>Under GDPR, anyone whose data you collect has seven key rights:</p>
    <ul className="list-disc pl-6 space-y-3">
      <li><strong>Right of access</strong> - They can ask for a copy of their data</li>
      <li><strong>Right to rectification</strong> - They can correct inaccurate data</li>
      <li><strong>Right to erasure</strong> - They can ask you to delete their data ("right to be forgotten")</li>
      <li><strong>Right to restrict processing</strong> - They can limit how you use their data</li>
      <li><strong>Right to data portability</strong> - They can get their data in a portable format</li>
      <li><strong>Right to object</strong> - They can object to certain processing (like marketing)</li>
      <li><strong>Right not to be subject to automated decision-making</strong> - They can't be judged by algorithms alone</li>
    </ul>

    <p className="mt-6">You must have a process to handle these requests within 30 days. This is usually an email address on your website.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">ICO Registration</h2>
    <p>The Information Commissioner's Office (ICO) is the UK's independent authority for GDPR enforcement.</p>
    <p><strong>Do you need to register with the ICO?</strong></p>
    <p>Most sole traders DON'T need to register. You're exempt if you:</p>
    <ul className="list-disc pl-6 space-y-3">
      <li>Only process personal data for your own business purposes</li>
      <li>Don't share data with other organisations</li>
      <li>Only keep it for as long as needed</li>
    </ul>

    <p className="mt-4">However, you MUST register if you:</p>
    <ul className="list-disc pl-6 space-y-3">
      <li>Process data on behalf of others (data processor)</li>
      <li>Monitor individuals systematically (e.g., CCTV)</li>
      <li>Process special category data (health, religion, biometric data)</li>
      <li>Use profiling or automated decision-making</li>
    </ul>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-[#1B3F7A] mb-3">Action Item</h4>
      <p>Check the <a href="https://ico.org.uk" className="text-blue-600 underline">ICO website</a> or use their self-assessment tool to confirm whether you need to register. If you do, it costs £40/year.</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Practical GDPR Compliance Checklist</h2>
    <ul className="space-y-3">
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">✓</span>
        <span>Create a privacy policy (required)</span>
      </li>
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">✓</span>
        <span>Publish it on your website (required)</span>
      </li>
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">✓</span>
        <span>Document your lawful basis for processing (required)</span>
      </li>
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">✓</span>
        <span>Set up a process for data access requests (required)</span>
      </li>
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">✓</span>
        <span>Document contracts with data processors (email providers, etc.)</span>
      </li>
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">✓</span>
        <span>Set data retention periods (how long you keep things)</span>
      </li>
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">✓</span>
        <span>Securely delete data when it's no longer needed</span>
      </li>
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">✓</span>
        <span>Check if you need ICO registration (usually no for sole traders)</span>
      </li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Common Mistakes Sole Traders Make</h2>
    <p><strong>1. No Privacy Policy</strong></p>
    <p>Many sole traders have zero privacy policy. This is illegal if you collect ANY personal data. Even if you only get email addresses through contact forms, you need one.</p>

    <p className="mt-6"><strong>2. Unclear Data Storage</strong></p>
    <p>If you keep client data in email, spreadsheets, or accounting software—without knowing for how long or why—you're not compliant. Document everything.</p>

    <p className="mt-6"><strong>3. No Data Security</strong></p>
    <p>Your data should be reasonably protected. This doesn't mean military-grade encryption, but don't email sensitive data unencrypted or leave passwords on sticky notes.</p>

    <p className="mt-6"><strong>4. Marketing Without Consent</strong></p>
    <p>Many sole traders collect client emails, then add them to marketing lists without permission. Under GDPR, you need their consent first (with limited exceptions for existing customers).</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Bottom Line</h2>
    <p>GDPR isn't as scary as it sounds for sole traders. Here's what you actually need:</p>
    <ol className="list-decimal pl-6 space-y-3">
      <li>A privacy policy (one page is fine)</li>
      <li>Published on your website</li>
      <li>A system for handling data access requests (usually an email address)</li>
      <li>Secure storage of client data (not unencrypted emails)</li>
      <li>Clarity on how long you keep data</li>
    </ol>

    <p className="mt-6">That's it. You don't need a data protection officer, complex systems, or extensive documentation. Just transparency and basic security.</p>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-[#1B3F7A] mb-3">We Can Help</h4>
      <p>Foundationary's Business Foundations Pack includes a GDPR-compliant privacy policy tailored to your business, plus guidance on data retention and security. No jargon—just practical compliance.</p>
    </div>
  </div>
);

// Sole Trader Setup Article
export const SoleTraderSetupArticle = (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Step 1: Register as Self-Employed</h2>
    <p>The first legal step is telling HMRC (Her Majesty's Revenue and Customs) that you're self-employed. You must do this within 3 months of starting work, or face penalties.</p>
    <p><strong>How to register:</strong></p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Visit <a href="https://www.gov.uk" className="text-blue-600 underline">gov.uk</a></li>
      <li>Search for "tell HMRC you're self-employed"</li>
      <li>Complete the online form (takes 15 minutes)</li>
      <li>You'll get a Unique Taxpayer Reference (UTR) number</li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Step 2: Open a Business Bank Account</h2>
    <p>You don't legally need a separate bank account, but it's highly recommended. It makes tax accounting much easier and looks more professional.</p>
    <p><strong>What to look for:</strong></p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Low fees (many banks offer free accounts for sole traders)</li>
      <li>Online banking support</li>
      <li>Integration with accounting software</li>
      <li>No transaction limits</li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Step 3: Set Up Accounting Systems</h2>
    <p>You must keep records of all income and expenses for tax purposes. You don't need an accountant initially, but you do need a system.</p>
    <p><strong>Options:</strong></p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Simple:</strong> Spreadsheet (Google Sheets or Excel)</li>
      <li><strong>Better:</strong> Accounting software (Xero, FreeAgent, Wave - many free for startups)</li>
      <li><strong>Professional:</strong> Hire a bookkeeper (£50-150/month)</li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Step 4: Get Business Insurance</h2>
    <p>Depending on your industry, you may need:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Professional Indemnity Insurance:</strong> Protects if your work causes financial loss to clients (often required by clients)</li>
      <li><strong>Public Liability Insurance:</strong> Covers if someone is injured or property damaged (essential if meeting clients in person)</li>
      <li><strong>Contents Insurance:</strong> If you have a home office with valuable equipment</li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Step 5: Create Professional Documents</h2>
    <p>You'll need:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Client Contract:</strong> Outlines scope, payment terms, deliverables</li>
      <li><strong>Privacy Policy:</strong> Required by GDPR (even for small businesses)</li>
      <li><strong>Terms & Conditions:</strong> Your business rules</li>
      <li><strong>Invoice Template:</strong> With your UTR number and bank details</li>
      <li><strong>Professional Bio:</strong> For websites and proposals</li>
    </ul>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-[#1B3F7A] mb-3">Pro Tip</h4>
      <p>Don't try to write these from scratch. Use templates or services like Foundationary that provide professional documents ready to use.</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Understanding Tax as a Sole Trader</h2>
    <p><strong>Income Tax:</strong> You pay tax on your profit (income minus expenses) at standard rates (20% for most people in 2026).</p>
    <p><strong>National Insurance:</strong> You also pay National Insurance contributions (currently 10.45% of profit between £12,570 and £50,270).</p>
    <p><strong>VAT:</strong> If your turnover exceeds £85,000, you must register for VAT. Until then, it's optional.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Key Dates to Remember</h2>
    <ul className="space-y-3">
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">→</span>
        <span><strong>5 April:</strong> Tax year ends. Start planning for your return.</span>
      </li>
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">→</span>
        <span><strong>31 January:</strong> Self-Assessment Tax Return deadline (for previous tax year)</span>
      </li>
      <li className="flex items-start">
        <span className="text-green-600 font-bold mr-3">→</span>
        <span><strong>3 months from start:</strong> Register with HMRC as self-employed</span>
      </li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Bottom Line</h2>
    <p>Setting up as a sole trader requires:</p>
    <ol className="list-decimal pl-6 space-y-2">
      <li>HMRC registration (online, 15 minutes)</li>
      <li>Business bank account (recommended)</li>
      <li>Accounting system (spreadsheet or software)</li>
      <li>Professional documents (contract, privacy policy, invoice template)</li>
      <li>Insurance (depends on your industry)</li>
    </ol>

    <p className="mt-6">Total cost: £200-1,000 depending on insurance and professional help. Most of this is optional—the bare minimum is registration and accounting records.</p>
  </div>
);

// Client Contract Article
export const ClientContractArticle = (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Why You Need a Client Contract</h2>
    <p>A written contract protects both you and your client. It clarifies expectations, prevents disputes, and gives you legal recourse if things go wrong.</p>
    <p><strong>Without a contract, you have:</strong></p>
    <ul className="list-disc pl-6 space-y-2">
      <li>No protection if a client doesn't pay</li>
      <li>Ambiguity about what you're supposed to deliver</li>
      <li>No basis to charge late payment fees</li>
      <li>Risk of scope creep (client constantly adding work)</li>
    </ul>

    <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-red-700 mb-3">Critical</h4>
      <p>A verbal agreement is legally binding, but very hard to prove in court. Always get it in writing.</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Essential Contract Clauses</h2>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Scope of Work</h3>
    <p><strong>What it should say:</strong> Exactly what you're delivering. Not vague ("design a website") but specific ("design 5-page WordPress website, included 3 rounds of revisions").</p>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Fee and Payment Terms</h3>
    <p><strong>What it should say:</strong></p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Total fee (£X.XX)</li>
      <li>Payment schedule (upfront, upon delivery, 50/50 split, etc.)</li>
      <li>Late payment interest (statutory right under Late Payment of Commercial Debts (Interest) Act 1998—currently 8% + Bank of England base rate)</li>
      <li>Currency (GBP)</li>
      <li>Whether VAT is included</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Timeline and Deadlines</h3>
    <p><strong>What it should say:</strong> When work starts, when deliverables are due, and what happens if timelines slip. For example: "Website design completed within 4 weeks of project start. Client approval required within 5 business days of delivery."</p>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property Rights</h3>
    <p><strong>What it should say:</strong> Who owns the final work. Do they own everything, or do you retain rights to use it as a portfolio piece?</p>
    <p><strong>Example language:</strong> "Client owns all work product upon final payment. Contractor retains right to reference this project in portfolio and marketing materials."</p>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Revisions and Changes</h3>
    <p><strong>What it should say:</strong> How many revisions are included, and what happens if client asks for changes beyond scope. For example: "3 rounds of revisions included in fee. Additional revisions charged at £X per hour."</p>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. Termination Clause</h3>
    <p><strong>What it should say:</strong> How either party can exit the agreement. For example: "Either party may terminate with 7 days written notice. Client pays for work completed to date."</p>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. Liability Limits</h3>
    <p><strong>What it should say:</strong> You're not liable for losses beyond the contract value. This protects you if something goes wrong. Professional Indemnity Insurance covers this.</p>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">8. Confidentiality</h3>
    <p><strong>What it should say:</strong> Both parties keep business discussions confidential. Especially important if discussing client business strategies.</p>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">9. Dispute Resolution</h3>
    <p><strong>What it should say:</strong> If there's a disagreement, you'll first try mediation before court. This saves money and time.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">What NOT to Include</h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>Anything illegal (you can't waive consumer rights, for example)</li>
      <li>Unreasonable liability waivers (courts will ignore them)</li>
      <li>Clauses that contradict your insurance policy</li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Contract Length</h2>
    <p>Don't overthink this. A solid contract for most freelance projects is 1-2 pages. It should be readable and clear—if the client needs a lawyer to understand it, it's too complex.</p>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-[#1B3F7A] mb-3">Pro Tip</h4>
      <p>Use a template. Foundationary's Business Foundations Pack includes a professional client contract ready to customise for your business. Don't write from scratch.</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">When to Use a Contract</h2>
    <p><strong>Always use one if:</strong></p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Payment is more than £500</li>
      <li>Project takes more than 2 weeks</li>
      <li>Client is a company (not an individual)</li>
      <li>Work is creative or strategic</li>
    </ul>

    <p className="mt-4"><strong>Even use one if:</strong></p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Payment is small (£100+)</li>
      <li>It's "just a quick project"</li>
      <li>It's for a friend</li>
    </ul>

    <p className="mt-4">A simple contract protects both parties and shows professionalism.</p>
  </div>
);

// Invoice Best Practices Article
export const InvoiceArticle = (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Why Professional Invoices Matter</h2>
    <p>A professional invoice isn't just about getting paid. It's also:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>A legal record of the transaction (for your tax return)</li>
      <li>Protection under the Late Payment of Commercial Debts Act</li>
      <li>Proof you're a serious business</li>
      <li>A chance to reinforce your brand</li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Essential Information to Include</h2>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Details</h3>
    <ul className="list-disc pl-6 space-y-2">
      <li>Full business name</li>
      <li>Address</li>
      <li>Phone number and email</li>
      <li>UTR number (Unique Taxpayer Reference)</li>
      <li>VAT number (if registered)</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Client Details</h3>
    <ul className="list-disc pl-6 space-y-2">
      <li>Full name or company name</li>
      <li>Contact address</li>
      <li>Contact person (if company)</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Invoice Information</h3>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Invoice number:</strong> Unique reference (001, 002, etc. or YYYY-001)</li>
      <li><strong>Invoice date:</strong> When you issued it</li>
      <li><strong>Payment due date:</strong> Usually 30 days from invoice date (unless agreed otherwise)</li>
      <li><strong>PO number:</strong> If client provided one (for company clients)</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">What You're Charging For</h3>
    <ul className="list-disc pl-6 space-y-2">
      <li>Description of work/product delivered</li>
      <li>Quantity (if applicable)</li>
      <li>Rate (hourly or per item)</li>
      <li>Total for each line item</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Payment Summary</h3>
    <ul className="list-disc pl-6 space-y-2">
      <li>Subtotal</li>
      <li>VAT (if applicable)</li>
      <li><strong>Total amount due</strong></li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Payment Instructions</h3>
    <ul className="list-disc pl-6 space-y-2">
      <li>Bank account name</li>
      <li>Sort code</li>
      <li>Account number</li>
      <li>Or: "Invoiced via Stripe—pay at [link]"</li>
    </ul>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-[#1B3F7A] mb-3">Late Payment Terms (Legally Important)</h4>
      <p>Include this language: "Payment is due within 30 days of invoice date. After this date, statutory interest of 8% + Bank of England base rate will be charged per day, plus £40 debt recovery fee."</p>
      <p className="mt-3">This is your right under UK law and makes clients take payment seriously.</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Invoice Format & Design</h2>
    <p><strong>Options:</strong></p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Word/Google Docs:</strong> Simple template, save as PDF</li>
      <li><strong>Excel/Google Sheets:</strong> Better for calculations</li>
      <li><strong>Dedicated invoicing software:</strong> Wave, Stripe Invoices, or accounting software</li>
      <li><strong>Professional design:</strong> Canva has free invoice templates</li>
    </ul>

    <p className="mt-4"><strong>Design tip:</strong> Use your brand colors and logo. Make it professional but not overly fancy. Clear, readable fonts. White space. Easy to scan.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Common Invoice Mistakes</h2>
    <p><strong>1. Not Including Your UTR</strong></p>
    <p>You're legally required to include this on invoices. Get it from HMRC when you register as self-employed.</p>

    <p className="mt-6"><strong>2. Vague Descriptions</strong></p>
    <p>Don't write "consulting - £500." Write "Strategic business consultation, 5 hours @ £100/hr, 3 March 2026."</p>

    <p className="mt-6"><strong>3. No Payment Terms</strong></p>
    <p>Always state when payment is due. Legally, it defaults to "on delivery," but 30 days is standard for business.</p>

    <p className="mt-6"><strong>4. Forgetting Payment Instructions</strong></p>
    <p>Make it easy to pay. Include bank details, or a payment link. If it's hard to pay, they'll delay.</p>

    <p className="mt-6"><strong>5. Not Following Up</strong></p>
    <p>Send invoices immediately. Follow up at 15 days and 29 days if unpaid. Send a formal "Letter Before Action" at day 30.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Going Professional: Invoicing Software</h2>
    <p>If you're invoicing regularly:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Wave:</strong> Free, integrates with bank, sends automatic reminders</li>
      <li><strong>Stripe Invoices:</strong> Free, integrates with Stripe payments</li>
      <li><strong>Xero/FreeAgent:</strong> Paid, but handles accounting too</li>
    </ul>

    <p className="mt-4">These tools automate sending reminders and track which invoices are paid.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Bottom Line</h2>
    <p>Your invoice should include:</p>
    <ol className="list-decimal pl-6 space-y-2">
      <li>Your business details and UTR</li>
      <li>Client details</li>
      <li>Clear description of work</li>
      <li>Total amount due</li>
      <li>Payment terms (due 30 days from invoice date)</li>
      <li>Late payment terms (8% interest + £40 fee after 30 days)</li>
      <li>Bank details or payment link</li>
    </ol>

    <p className="mt-6">That's it. Professional, legal, and effective.</p>
  </div>
);

// Late Payment Act Article
export const LatePaymentArticle = (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">What is the Late Payment Act?</h2>
    <p>The Late Payment of Commercial Debts (Interest) Act 1998 is a UK law that protects business-to-business transactions. It gives you the automatic right to charge interest and debt recovery fees if a client doesn't pay on time.</p>
    <p><strong>Key point:</strong> This applies to ALL business debts. You don't need to mention it in your contract—it's your legal right by default.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Your Rights Under the Act</h2>
    <p><strong>1. Statutory Interest</strong></p>
    <p>If payment is late, you can charge interest at: <strong>8% + Bank of England base rate</strong> per annum.</p>
    <p>As of 2026, this is approximately <strong>13-14%</strong> depending on the current base rate.</p>

    <p className="mt-6"><strong>2. Debt Recovery Fee</strong></p>
    <p>For late payment, you can charge a fixed fee:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>£40 for debts under £1,000</li>
      <li>£70 for debts £1,000-£10,000</li>
      <li>£100 for debts over £10,000</li>
    </ul>

    <p className="mt-6"><strong>3. Recovery Costs</strong></p>
    <p>If you have to take legal action, you can recover the costs of doing so (solicitor fees, court fees, etc.).</p>

    <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-red-700 mb-3">Important</h4>
      <p>These are your rights AUTOMATICALLY. You don't need special terms in your contract. However, it's good practice to state them clearly in your invoice and contract.</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Payment Terms Matter</h2>
    <p>The Act assumes payment is due on delivery (immediately). However, you can agree different terms:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>30 days from invoice date (standard)</li>
      <li>7 days from delivery</li>
      <li>On receipt of invoice</li>
      <li>Any date you both agree</li>
    </ul>

    <p className="mt-4"><strong>Pro tip:</strong> Always specify payment terms on your invoice and contract. 30 days is standard for UK business.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">The Letter Before Action</h2>
    <p>Before taking legal action, you must send a formal "Letter Before Action." This is:</p>
    <ol className="list-decimal pl-6 space-y-2">
      <li>A formal written demand for payment</li>
      <li>Stating exactly what is owed and why</li>
      <li>Giving a deadline (usually 7-14 days) to pay</li>
      <li>Warning that legal action will follow</li>
    </ol>

    <p className="mt-4">This letter protects you legally and often motivates clients to pay.</p>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-[#1B3F7A] mb-3">Example Language</h4>
      <p>"Dear [Client], We have outstanding payment for invoice #001 dated 15 March 2026 in the amount of £2,500. Payment was due 30 days from invoice date. We require payment by 30 April 2026. If payment is not received, we will pursue legal action and recover our costs from you. Yours faithfully, [Your name]"</p>
    </div>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Small Claims Court Process</h2>
    <p>If a client owes you under £10,000, you can use Small Claims Court. The process:</p>
    <ol className="list-decimal pl-6 space-y-2">
      <li>Send Letter Before Action (give 14 days to respond)</li>
      <li>File claim at court (costs £25-£354 depending on amount)</li>
      <li>Serve the claim on defendant</li>
      <li>Attend hearing if they defend</li>
      <li>If you win, get a judgment</li>
      <li>If they still don't pay, use enforcement proceedings</li>
    </ol>

    <p className="mt-4"><strong>Timeline:</strong> Usually 3-6 months from filing to resolution.</p>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Enforcement Procedures</h2>
    <p>If you win in court but the client still doesn't pay, you can use enforcement procedures:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>County Court bailiff:</strong> They try to collect the money</li>
      <li><strong>Attachment of earnings:</strong> Money taken directly from their wages</li>
      <li><strong>Charging order:</strong> Money taken from their property sale</li>
      <li><strong>Insolvency petition:</strong> Forces them into bankruptcy (serious)</li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">What the Act Does NOT Cover</h2>
    <p>The Late Payment Act applies to:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Business-to-business transactions (not consumer)</li>
      <li>Debts arising from contracts</li>
      <li>Debts over £3,000 (though you can still sue for smaller amounts)</li>
    </ul>

    <p className="mt-4">It does NOT apply to:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>Consumer transactions (selling to individuals for personal use)</li>
      <li>Illegal transactions</li>
      <li>Debts the client legitimately disputes</li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Prevention: Get Paid On Time</h2>
    <p>The best strategy is preventing late payment:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Clear payment terms:</strong> 30 days from invoice</li>
      <li><strong>Invoice immediately:</strong> Don't wait</li>
      <li><strong>Easy payment methods:</strong> Bank transfer, Stripe, PayPal</li>
      <li><strong>Follow up early:</strong> Email at 10 days, call at 20 days</li>
      <li><strong>Payment deposits:</strong> Get 50% upfront for new clients</li>
      <li><strong>Milestone payments:</strong> Payment at different stages of work</li>
    </ul>

    <h2 className="text-2xl font-bold text-[#1B3F7A] mt-12 mb-6">Bottom Line</h2>
    <p>The Late Payment Act protects you. You have the right to charge:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>8% + base rate interest on late payments</li>
      <li>£40-£100 debt recovery fee</li>
      <li>Your court and legal costs</li>
    </ul>

    <p className="mt-6">Use this power to:</p>
    <ol className="list-decimal pl-6 space-y-2">
      <li>Include late payment terms on all invoices</li>
      <li>Follow up promptly on late payments</li>
      <li>Send formal demand letters if needed</li>
      <li>Take small claims action if necessary</li>
    </ol>

    <p className="mt-6">Most clients will pay on time if they know you're serious about collecting.</p>

    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded">
      <h4 className="font-semibold text-[#1B3F7A] mb-3">Legal Resources</h4>
      <p>For more information:</p>
      <ul className="list-disc pl-6 mt-3">
        <li><a href="https://www.gov.uk" className="text-blue-600 underline">gov.uk</a> - Official guidance</li>
        <li><a href="https://www.moneyhelper.org.uk" className="text-blue-600 underline">MoneyHelper</a> - Free debt advice</li>
        <li>Citizens Advice Bureau - Free legal help</li>
      </ul>
    </div>
  </div>
);

// Article database with all data
export const articles: Article[] = [
  {
    id: 1,
    slug: 'sole-trader-business-setup-guide-uk',
    title: 'Complete Guide to Setting Up a Sole Trader Business in the UK (2026)',
    description: 'Everything you need to know about registering as a sole trader, legal requirements, tax obligations, and essential documents from day one.',
    category: 'Legal',
    readTime: 12,
    date: '2026-05-27',
    image: '📋',
    keywords: 'sole trader setup UK, how to start sole trader business, UK sole trader registration',
    content: SoleTraderSetupArticle,
    relatedArticles: [
      { title: 'GDPR Compliance for UK Sole Traders', slug: 'gdpr-compliance-for-sole-traders-uk' },
      { title: 'What Every UK Freelancer Needs in Their Client Contract', slug: 'client-contract-essentials-uk-freelancers' },
    ],
  },
  {
    id: 2,
    slug: 'gdpr-compliance-for-sole-traders-uk',
    title: 'GDPR Compliance for UK Sole Traders: Complete 2026 Guide',
    description: 'Understand your obligations under UK GDPR. Privacy policy requirements, data subject rights, ICO registration, and practical compliance steps.',
    category: 'Legal',
    readTime: 10,
    date: '2026-05-27',
    image: '🔒',
    keywords: 'GDPR sole trader, data protection UK freelancer, privacy policy requirements',
    content: GdprArticle,
    relatedArticles: [
      { title: 'Complete Guide to Setting Up a Sole Trader Business', slug: 'sole-trader-business-setup-guide-uk' },
      { title: 'Invoice Best Practices for UK Sole Traders', slug: 'invoice-best-practices-uk-sole-traders' },
    ],
  },
  {
    id: 3,
    slug: 'client-contract-essentials-uk-freelancers',
    title: 'What Every UK Freelancer Needs in Their Client Contract',
    description: 'Essential contract clauses explained: scope, payment terms, IP rights, termination, and dispute resolution. Protect yourself from day one.',
    category: 'Legal',
    readTime: 8,
    date: '2026-05-27',
    image: '📝',
    keywords: 'freelancer contract UK, service agreement sole trader, client contract terms',
    content: ClientContractArticle,
    relatedArticles: [
      { title: 'Complete Guide to Setting Up a Sole Trader Business', slug: 'sole-trader-business-setup-guide-uk' },
      { title: 'Late Payment Act 1998: How to Get Paid on Time', slug: 'late-payment-act-1998-guide' },
    ],
  },
  {
    id: 4,
    slug: 'invoice-best-practices-uk-sole-traders',
    title: 'Invoice Best Practices for UK Sole Traders',
    description: 'Create professional invoices that get you paid on time. Essential elements, payment terms, and Late Payment Act requirements.',
    category: 'Financial',
    readTime: 7,
    date: '2026-05-27',
    image: '🧾',
    keywords: 'invoice UK sole trader, invoicing freelancers, late payment terms',
    content: InvoiceArticle,
    relatedArticles: [
      { title: 'Late Payment Act 1998: How to Get Paid on Time', slug: 'late-payment-act-1998-guide' },
      { title: 'Complete Guide to Setting Up a Sole Trader Business', slug: 'sole-trader-business-setup-guide-uk' },
    ],
  },
  {
    id: 5,
    slug: 'late-payment-act-1998-guide',
    title: 'Late Payment Act 1998: How to Get Paid on Time',
    description: 'Your rights under UK law. Statutory interest, compensation claims, and the Letter Before Action that protects your position.',
    category: 'Financial',
    readTime: 6,
    date: '2026-05-27',
    image: '💰',
    keywords: 'late payment UK, statutory interest, legal action payment',
    content: LatePaymentArticle,
    relatedArticles: [
      { title: 'Invoice Best Practices for UK Sole Traders', slug: 'invoice-best-practices-uk-sole-traders' },
      { title: 'What Every UK Freelancer Needs in Their Client Contract', slug: 'client-contract-essentials-uk-freelancers' },
    ],
  },
];

// Helper function to get article by slug
export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

// Helper function to get related articles
export const getRelatedArticles = (slug: string): Article[] => {
  const article = getArticleBySlug(slug);
  if (!article) return [];

  return article.relatedArticles
    .map(related => getArticleBySlug(related.slug))
    .filter((article): article is Article => article !== undefined);
};
