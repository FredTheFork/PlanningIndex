'use client';

import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

function CountStat({ target, suffix, label }: { target: number; suffix?: string; label: string }) {
  const [ref, inView] = useInView(0.4);
  const count = useCountUp(target, 1400, inView);

  return (
    <div ref={ref} className="text-center">
      <div className="font-inter font-bold text-white" style={{ fontSize: '1.9rem' }}>
        {count}{suffix ?? ''}
      </div>
      <div
        className="font-inter font-normal"
        style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em', marginTop: 4 }}
      >
        {label}
      </div>
    </div>
  );
}

function TextStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-inter font-bold text-white" style={{ fontSize: '1.9rem' }}>{value}</div>
      <div
        className="font-inter font-normal"
        style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em', marginTop: 4 }}
      >
        {label}
      </div>
    </div>
  );
}

const Divider = () => (
  <div className="hidden sm:block h-12" style={{ width: 1, background: 'rgba(255,255,255,0.18)' }} />
);

export default function SocialProof() {
  return (
    <section className="bg-navy py-8">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-6">
        <CountStat target={200} suffix="+" label="Sole traders served" />
        <Divider />
        <TextStat value="3–5 days" label="From payment to delivery" />
        <Divider />
        <CountStat target={10} label="Documents per pack" />
        <Divider />
        <TextStat value="5.0 ★" label="Client satisfaction" />
      </div>
    </section>
  );
}
