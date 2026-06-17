'use client';

import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { Star, Shield, Clock, FileText, Zap, CheckCircle } from 'lucide-react';

function CountStat({ target, suffix, label, icon }: { target: number; suffix?: string; label: string; icon?: React.ReactNode }) {
  const [ref, inView] = useInView(0.4);
  const count = useCountUp(target, 1400, inView);

  return (
    <div ref={ref} className="text-center">
      {icon && (
        <div className="flex justify-center mb-2 opacity-70">
          {icon}
        </div>
      )}
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

function TextStat({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center">
      {icon && (
        <div className="flex justify-center mb-2 opacity-70">
          {icon}
        </div>
      )}
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

// Live activity ticker
function LiveActivityTicker() {
  const activities = [
    { message: 'Sarah M. in Manchester purchased Business Foundations Pack', time: '2 min ago' },
    { message: 'James R. in Bristol submitted intake form', time: '5 min ago' },
    { message: 'Emma W. received complete document pack', time: '8 min ago' },
    { message: 'New order from London - Photographer Pack', time: '12 min ago' },
    { message: '5-star review from Anita S. in Edinburgh', time: '15 min ago' },
  ];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % activities.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [activities.length]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 mb-4">
      <div className="flex items-center justify-center gap-3 bg-white/10 rounded-full px-4 py-2">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping" />
        </div>
        <span className="font-inter text-white/90 text-sm truncate">
          <span
            className={`inline-block transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
          >
            {activities[index].message}
          </span>
          <span className="text-white/50 text-xs ml-2">{activities[index].time}</span>
        </span>
      </div>
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="bg-navy py-6">
      {/* Live activity ticker */}
      <LiveActivityTicker />

      {/* Stats row */}
      <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-6">
        <CountStat target={200} suffix="+" label="Sole traders served" icon={<Users size={18} className="text-white" />} />
        <Divider />
        <TextStat value="3–5 days" label="From payment to delivery" icon={<Clock size={18} className="text-white" />} />
        <Divider />
        <CountStat target={10} label="Documents per pack" icon={<FileText size={18} className="text-white" />} />
        <Divider />
        <TextStat value="5.0 ★" label="Client satisfaction" icon={<Star size={18} className="text-yellow-400" />} />
      </div>

      {/* Trust badges row */}
      <div className="max-w-[1200px] mx-auto px-6 mt-6 flex flex-wrap justify-center gap-4">
        {[
          { icon: <Shield size={14} />, label: 'UK Law Compliant' },
          { icon: <CheckCircle size={14} />, label: 'GDPR Ready' },
          { icon: <Zap size={14} />, label: 'Fast Delivery' },
        ].map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/5"
          >
            <div className="text-white/70">{badge.icon}</div>
            <span className="font-inter font-medium text-white/80 text-xs">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// Users icon component since lucide doesn't export it directly in some versions
function Users({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
