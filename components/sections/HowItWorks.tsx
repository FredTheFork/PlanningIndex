const steps = [
  {
    num: '1',
    title: 'Choose Your Services',
    desc: 'Select the Business Foundations Pack, website copy, social media posts, or any combination. Bundle and save.',
  },
  {
    num: '2',
    title: 'Tell Us About Your Business',
    desc: 'Complete a structured questionnaire. The questions adapt to exactly what you\'ve purchased. 20-30 minutes.',
  },
  {
    num: '3',
    title: 'Receive Your Deliverables',
    desc: 'Documents in PDF + Word. Website copy ready to paste. Social posts formatted for each platform. Delivered within 3-5 business days.',
  },
];

export default function HowItWorks() {
  return (
    <section id="process" className="bg-white py-24 px-6">
      <div className="max-w-[900px] mx-auto">
        <span
          className="font-inter font-semibold text-medium-blue uppercase block mb-3"
          style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
        >
          THE PROCESS
        </span>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
        >
          Three Steps. No Back-and-Forth.
        </h2>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-0 mt-14 relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-[26px] left-[calc(16.67%+26px)] right-[calc(16.67%+26px)] border-t border-dashed border-medium-blue pointer-events-none"
            style={{ borderWidth: 1, zIndex: 0 }}
          />

          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center max-w-[260px] relative">
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                style={{
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                  zIndex: 1,
                  position: 'relative',
                }}
              >
                {step.num}
              </div>
              <h3 className="font-inter font-semibold text-dark-text mt-5" style={{ fontSize: '1.05rem' }}>
                {step.title}
              </h3>
              <p className="font-inter font-normal text-secondary-text mt-2.5 leading-[1.6]" style={{ fontSize: '0.9rem' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <div
            className="bg-off-white border border-medium-blue rounded-full font-inter font-medium text-navy"
            style={{ padding: '10px 20px', fontSize: '0.875rem' }}
          >
            ⏱ Total time from payment to delivery: 3-5 business days (documents typically faster)
          </div>
        </div>
      </div>
    </section>
  );
}
