'use client';

import { useState, useEffect } from 'react';
import { Shield, Award, Clock, Users, Star, CheckCircle, TrendingUp, Zap, Globe, Lock } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { AnimatedCounter } from './AnimatedGraphs';

// Trust Badge Component
interface TrustBadgeProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  color?: string;
  className?: string;
}

export function TrustBadge({ icon, label, description, color = '#1B3F7A', className = '' }: TrustBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 transition-all duration-300 ${isHovered ? 'shadow-md scale-105' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <span className="font-inter font-semibold text-dark-text text-sm">{label}</span>
        {description && (
          <p className="font-inter text-secondary-text text-xs mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

// Trust Badge Grid
interface TrustBadgeGridProps {
  badges: Array<{
    icon: React.ReactNode;
    label: string;
    description?: string;
    color?: string;
  }>;
  className?: string;
}

export function TrustBadgeGrid({ badges, className = '' }: TrustBadgeGridProps) {
  const [ref, inView] = useInView(0.2);

  return (
    <div ref={ref} className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {badges.map((badge, i) => (
        <div
          key={badge.label}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.4s ease ${i * 100}ms, transform 0.4s ease ${i * 100}ms`,
          }}
        >
          <TrustBadge {...badge} />
        </div>
      ))}
    </div>
  );
}

// Certification/Shield Row
interface CertificationRowProps {
  className?: string;
}

export function CertificationRow({ className = '' }: CertificationRowProps) {
  const [ref, inView] = useInView(0.2);

  const certifications = [
    { icon: <Shield size={18} />, label: 'GDPR Compliant', color: '#38A169' },
    { icon: <Lock size={18} />, label: 'UK Law Compliant', color: '#1B3F7A' },
    { icon: <Globe size={18} />, label: 'UK-Based Team', color: '#2C68C4' },
    { icon: <CheckCircle size={18} />, label: 'Secure Checkout', color: '#38A169' },
  ];

  return (
    <div ref={ref} className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {certifications.map((cert, i) => (
        <div
          key={cert.label}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`,
          }}
        >
          <div style={{ color: cert.color }}>{cert.icon}</div>
          <span className="font-inter font-medium text-dark-text text-sm">{cert.label}</span>
        </div>
      ))}
    </div>
  );
}

// Live Activity Ticker
interface ActivityItem {
  type: 'purchase' | 'delivery' | 'review';
  message: string;
  time: string;
  location?: string;
}

interface ActivityTickerProps {
  activities: ActivityItem[];
  className?: string;
}

export function ActivityTicker({ activities, className = '' }: ActivityTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [activities.length]);

  const currentActivity = activities[currentIndex];

  const iconMap: Record<string, React.ReactNode> = {
    purchase: <Zap size={12} />,
    delivery: <CheckCircle size={12} />,
    review: <Star size={12} />,
  };

  const colorMap: Record<string, string> = {
    purchase: '#38A169',
    delivery: '#2C68C4',
    review: '#F59E0B',
  };

  return (
    <div className={`bg-navy/5 rounded-xl border border-navy/20 overflow-hidden ${className}`}>
      <div className="px-4 py-3 flex items-center gap-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${colorMap[currentActivity.type]}20`, color: colorMap[currentActivity.type] }}
        >
          {iconMap[currentActivity.type]}
        </div>
        <div
          className={`flex-1 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="font-inter text-sm text-dark-text">{currentActivity.message}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-inter text-xs text-secondary-text">{currentActivity.time}</span>
            {currentActivity.location && (
              <>
                <span className="text-slate-300">•</span>
                <span className="font-inter text-xs text-secondary-text">{currentActivity.location}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {activities.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-navy' : 'bg-slate-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Stats Bar with animated counters
interface StatsBarProps {
  stats: Array<{
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
  variant?: 'light' | 'dark';
}

export function StatsBar({ stats, className = '', variant = 'light' }: StatsBarProps) {
  const [ref, inView] = useInView(0.2);
  const isDark = variant === 'dark';

  return (
    <div
      ref={ref}
      className={`flex flex-wrap justify-center gap-x-8 gap-y-4 py-6 px-4 rounded-2xl ${isDark ? 'bg-navy' : 'bg-white border border-slate-200'} ${className}`}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="text-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity 0.4s ease ${i * 100}ms, transform 0.4s ease ${i * 100}ms`,
          }}
        >
          {stat.icon && (
            <div className={`flex justify-center mb-2 ${isDark ? 'text-white/70' : 'text-navy'}`}>
              {stat.icon}
            </div>
          )}
          <div className={`font-inter font-bold ${isDark ? 'text-white' : 'text-navy'}`} style={{ fontSize: '1.75rem' }}>
            {stat.prefix}
            <AnimatedCounter target={stat.value} duration={1200} triggerOnView={false} />
            {stat.suffix}
          </div>
          <div className={`font-inter text-sm mt-1 ${isDark ? 'text-white/70' : 'text-secondary-text'}`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// Social Trust Section - combines multiple trust elements
interface SocialTrustSectionProps {
  className?: string;
}

export function SocialTrustSection({ className = '' }: SocialTrustSectionProps) {
  const trustBadges = [
    { icon: <Shield size={18} />, label: 'ICO Compliant', description: 'Data protection', color: '#38A169' },
    { icon: <Award size={18} />, label: '5.0 Rating', description: 'Client satisfaction', color: '#F59E0B' },
    { icon: <Clock size={18} />, label: '24-72 Hours', description: 'Delivery time', color: '#2C68C4' },
    { icon: <Users size={18} />, label: '200+', description: 'Sole traders served', color: '#1B3F7A' },
  ];

  const recentActivity: ActivityItem[] = [
    { type: 'purchase', message: 'Sarah in Manchester just purchased the Business Foundations Pack', time: '2 mins ago' },
    { type: 'delivery', message: 'Documents delivered to James in Bristol', time: '5 mins ago', location: 'Bristol' },
    { type: 'review', message: '5-star review from Emma: "Exactly what I needed"', time: '12 mins ago' },
    { type: 'purchase', message: 'Photographer Pack purchased in London', time: '18 mins ago', location: 'London' },
  ];

  const stats = [
    { value: 200, suffix: '+', label: 'Sole traders served', icon: <Users size={20} /> },
    { value: 70, suffix: '+', label: 'Documents delivered', icon: <Award size={20} /> },
    { value: 5, suffix: '.0', label: 'Star rating', icon: <Star size={20} /> },
    { value: 24, suffix: 'hrs', label: 'Avg delivery', icon: <Clock size={20} /> },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats */}
      <StatsBar stats={stats} variant="dark" />

      {/* Recent activity ticker */}
      <ActivityTicker activities={recentActivity} />

      {/* Trust badges */}
      <TrustBadgeGrid badges={trustBadges} />
    </div>
  );
}

// Company Logo Strip (placeholder friendly)
interface LogoStripProps {
  logos?: Array<{
    name: string;
    logo?: string;
  }>;
  title?: string;
  className?: string;
}

export function LogoStrip({
  logos = [
    { name: 'Logo 1' },
    { name: 'Logo 2' },
    { name: 'Logo 3' },
    { name: 'Logo 4' },
    { name: 'Logo 5' },
  ],
  title = 'Trusted by UK sole traders',
  className = '',
}: LogoStripProps) {
  const [ref, inView] = useInView(0.2);

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <p className="font-inter text-secondary-text text-sm mb-4">{title}</p>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {logos.map((logo, i) => (
          <div
            key={logo.name}
            className="w-24 h-12 bg-slate-100 rounded-lg flex items-center justify-center"
            style={{
              opacity: inView ? 0.6 : 0,
              transform: inView ? 'scale(1)' : 'scale(0.9)',
              transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`,
            }}
          >
            {logo.logo ? (
              <img src={logo.logo} alt={logo.name} className="max-w-full max-h-full object-contain p-2" />
            ) : (
              <span className="font-inter font-medium text-slate-400 text-xs">{logo.name}</span>
            )}
          </div>
        ))}
      </div>
      <p className="font-inter text-secondary-text text-xs mt-3 italic">
        Upload client logos to /public/images/clients/ directory
      </p>
    </div>
  );
}

// Animated Map Dots (UK regions lighting up)
interface UKMapDotsProps {
  className?: string;
}

export function UKMapDots({ className = '' }: UKMapDotsProps) {
  const [ref, inView] = useInView(0.2);
  const [activeDots, setActiveDots] = useState<number[]>([]);

  // Coordinates for UK regions (simplified relative positions)
  const regions = [
    { name: 'Scotland', x: 50, y: 20, count: 23 },
    { name: 'Northern Ireland', x: 25, y: 45, count: 8 },
    { name: 'North East', x: 55, y: 35, count: 18 },
    { name: 'North West', x: 42, y: 38, count: 31 },
    { name: 'Yorkshire', x: 58, y: 40, count: 25 },
    { name: 'East Midlands', x: 55, y: 50, count: 22 },
    { name: 'West Midlands', x: 48, y: 52, count: 27 },
    { name: 'Wales', x: 35, y: 55, count: 14 },
    { name: 'London', x: 58, y: 62, count: 45 },
    { name: 'South East', x: 62, y: 65, count: 38 },
    { name: 'South West', x: 40, y: 68, count: 19 },
  ];

  useEffect(() => {
    if (inView) {
      // Animate dots lighting up one by one
      regions.forEach((_, i) => {
        setTimeout(() => {
          setActiveDots(prev => [...prev, i]);
        }, i * 200);
      });
    }
  }, [inView]);

  return (
    <div ref={ref} className={`relative bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
      <h3 className="font-inter font-bold text-navy text-lg mb-4">Served Across the UK</h3>

      {/* Simple UK outline shape */}
      <div className="relative w-full" style={{ paddingBottom: '80%' }}>
        <svg
          viewBox="0 0 100 80"
          className="absolute inset-0 w-full h-full"
          style={{ background: '#F8FAFF' }}
        >
          {/* UK outline (simplified path) */}
          <path
            d="M25 30 Q20 25 30 15 Q35 10 45 12 Q55 5 60 15 Q65 10 70 20 Q75 25 70 35 Q75 45 70 55 Q65 65 55 70 Q45 75 35 70 Q25 65 20 55 Q15 45 20 35 Q22 32 25 30 Z"
            fill="#EEF2FF"
            stroke="#C7D2FE"
            strokeWidth="1"
          />

          {/* Region dots */}
          {regions.map((region, i) => (
            <g key={region.name}>
              <circle
                cx={region.x}
                cy={region.y}
                r={activeDots.includes(i) ? 5 : 0}
                fill="#1B3F7A"
                opacity={activeDots.includes(i) ? 1 : 0}
                className="transition-all duration-500"
              >
                <animate
                  attributeName="r"
                  values={activeDots.includes(i) ? "5;7;5" : "0;0;0"}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              {activeDots.includes(i) && (
                <text
                  x={region.x}
                  y={region.y - 8}
                  textAnchor="middle"
                  className="font-inter fill-navy text-xs"
                  fontSize="3"
                >
                  {region.count}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Region list */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
        {regions.slice(0, 6).map((region, i) => (
          <div
            key={region.name}
            className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-300"
            style={{
              background: activeDots.includes(i) ? '#EEF2FF' : 'transparent',
              opacity: activeDots.includes(i) ? 1 : 0.5,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: activeDots.includes(i) ? '#1B3F7A' : '#CBD5E1' }}
            />
            <span className="font-inter text-xs text-dark-text">{region.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
