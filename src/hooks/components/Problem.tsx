import { FileX, ShieldOff, AlertCircle, UserX, Receipt, MessageSquareOff } from 'lucide-react';

const problems = [
  {
    icon: FileX,
    title: 'No Client Contract',
    desc: "When clients dispute, delay, or disappear — without a signed contract, you have no legal protection at all.",
  },
  {
    icon: ShieldOff,
    title: 'No GDPR Privacy Policy',
    desc: "The ICO can fine you for not having one. As soon as you collect a client's email address, you legally need it.",
  },
  {
    icon: AlertCircle,
    title: 'No Terms & Conditions',
    desc: 'Scope creep, refund demands, payment disputes — all unenforceable without clearly agreed written terms.',
  },
  {
    icon: UserX,
    title: 'No Professional Bio',
    desc: "You're underselling yourself in every pitch, every introduction, every time you describe what you do.",
  },
  {
    icon: Receipt,
    title: 'Invoices Without Legal Teeth',
    desc: 'Missing the right statutory wording means clients know they can delay payment with no real consequence.',
  },
  {
    icon: MessageSquareOff,
    title: 'No Onboarding System',
    desc: "Clients feel like they've hired a sole trader. They should feel like they've hired an agency.",
  },
];

export default function Problem() {
  return (
    <section id="about" className="bg-white py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <span
          className="font-inter font-semibold text-medium-blue uppercase block mb-3"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
        >
          THE PROBLEM
        </span>
        <h2
          className="font-inter font-bold text-dark-text leading-snug"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', maxWidth: 640 }}
        >
          You started your business. But is it properly set up?
        </h2>
        <p
          className="font-inter font-normal text-secondary-text mt-4 leading-[1.7]"
          style={{ fontSize: '1.05rem', maxWidth: 600 }}
        >
          Most UK sole traders are running their business legally exposed, professionally underselling themselves, and financially unprotected — not because they're bad at what they do, but because nobody ever helped them get the foundations right.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-off-white rounded-xl p-7 border-l-4 border-medium-blue hover:shadow-md transition-all duration-200"
            >
              <p.icon size={24} className="text-medium-blue mb-4" />
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1rem' }}>
                {p.title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-1 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
