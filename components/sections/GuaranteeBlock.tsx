'use client';

import { Shield } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const pills = ['No-charge revisions', 'Your voice, your brand', 'UK law compliant'];

export default function GuaranteeBlock() {
  const [ref, inView] = useInView(0.25);

  return (
    <section className="bg-white py-20 px-6">
      <div
        ref={ref}
        className="max-w-[760px] mx-auto text-center"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)', boxShadow: '0 8px 24px rgba(27,63,122,0.25)' }}
        >
          <Shield size={30} className="text-white" />
        </div>

        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)' }}
        >
          We stand behind every piece of work.
        </h2>

        <p
          className="font-inter font-normal text-secondary-text mt-4 leading-[1.7] mx-auto"
          style={{ fontSize: '1.05rem', maxWidth: 560 }}
        >
          If your deliverables do not feel right — tone, accuracy, structure, or content — we revise them at no extra charge. No questions. No argument. That is the commitment we make to every client.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {pills.map((pill) => (
            <span
              key={pill}
              className="font-inter font-medium text-navy"
              style={{
                fontSize: '0.85rem',
                padding: '8px 18px',
                background: '#EBF2FF',
                borderRadius: 999,
                border: '1px solid rgba(27,63,122,0.12)',
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
