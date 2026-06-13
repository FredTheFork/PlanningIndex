'use client';

import { useInView } from '@/hooks/useInView';

const steps = [
  {
    num: '1',
    title: 'Choose Your Services',
    desc: 'Select the Documents Pack, website copy, social media posts, quarterly refresh — or any combination. Bundle two or more and your discount applies automatically.',
  },
  {
    num: '2',
    title: 'Tell Us About Your Business',
    desc: 'Complete a structured questionnaire. The questions adapt precisely to what you have purchased. Most clients finish in 20–30 minutes.',
  },
  {
    num: '3',
    title: 'We Build Everything',
    desc: 'Your deliverables are built to your specific answers: documents in PDF and Word, a fully built website, social posts formatted per platform. Delivered within 3–5 business days.',
  },
  {
    num: '4',
    title: 'Review and Confirm',
    desc: 'We send everything for your review. If the tone, wording, or content is not right, tell us — we revise at no extra charge until it is.',
  },
];

export default function HowItWorks() {
  const [ref, inView] = useInView(0.15);

  return (
    <section id="process" className="bg-white py-24 px-6">
      <div className="max-w-[1100px] mx-auto">
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
          Four steps. No back-and-forth.
        </h2>

        <div ref={ref} className="mt-14 relative">
          {/* Animated connector line — desktop only */}
          <div
            className="hidden md:block absolute pointer-events-none"
            style={{
              top: 26,
              left: 'calc(12.5% + 26px)',
              right: 'calc(12.5% + 26px)',
              height: 2,
              borderTop: '2px dashed #2C68C4',
              opacity: inView ? 1 : 0,
              width: inView ? '100%' : '0%',
              transition: 'width 1.2s ease 0.3s, opacity 0.3s ease 0.3s',
              zIndex: 0,
            }}
          >
            {inView && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: '8px solid #2C68C4',
              }} />
            )}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-10 md:gap-4">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="flex flex-col items-center text-center"
                style={{
                  maxWidth: 240,
                  flex: 1,
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease ${i * 150 + 200}ms, transform 0.5s ease ${i * 150 + 200}ms`,
                }}
              >
                <div
                  className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-inter font-bold shrink-0"
                  style={{
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 6px 20px rgba(27,63,122,0.3)',
                    animation: inView ? `scaleInBounce 0.5s ease ${i * 150 + 300}ms both` : 'none',
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
        </div>

        <div className="flex justify-center mt-12">
          <div
            className="bg-off-white border border-medium-blue/30 rounded-full font-inter font-medium text-navy"
            style={{ padding: '10px 22px', fontSize: '0.875rem' }}
          >
            ⏱ Payment to delivery: 3–5 business days (documents often faster)
          </div>
        </div>
      </div>
    </section>
  );
}
