'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { Star, Shield, Clock, FileText, Zap, CheckCircle, ShoppingCart, FileCheck, Package, MessageSquare, RefreshCw, Users } from 'lucide-react';
import {
  generateActivity,
  formatTimeAgo,
  getMinutesSince,
  type Activity,
} from '@/lib/activity-data';

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
      <div className="font-inter font-bold text-navy" style={{ fontSize: '1.9rem' }}>
        {count}{suffix ?? ''}
      </div>
      <div
        className="font-inter font-normal"
        style={{ fontSize: '0.825rem', color: '#4A5568', letterSpacing: '0.05em', marginTop: 4 }}
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
      <div className="font-inter font-bold text-navy" style={{ fontSize: '1.9rem' }}>{value}</div>
      <div
        className="font-inter font-normal"
        style={{ fontSize: '0.825rem', color: '#4A5568', letterSpacing: '0.05em', marginTop: 4 }}
      >
        {label}
      </div>
    </div>
  );
}

const Divider = () => (
  <div className="hidden sm:block h-12" style={{ width: 1, background: '#E2E8F0' }} />
);

// Icon mapping for activity types
const activityIcons: Record<string, React.ReactNode> = {
  purchase: <ShoppingCart size={12} />,
  intake: <FileCheck size={12} />,
  delivery: <Package size={12} />,
  review: <MessageSquare size={12} />,
  subscribe: <RefreshCw size={12} />,
};

const activityColors: Record<string, string> = {
  purchase: '#38A169',
  intake: '#2C68C4',
  delivery: '#1B3F7A',
  review: '#F59E0B',
  subscribe: '#8B5CF6',
};

// Live activity ticker with realistic time progression
function LiveActivityTicker() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const initializedRef = useRef(false);
  const lastUpdateRef = useRef(Date.now());

  // Initialize with 4-5 starter activities
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initialActivities: Activity[] = [];
    for (let i = 0; i < 5; i++) {
      initialActivities.push(generateActivity(true));
    }
    // Sort by time (most recent first)
    initialActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setActivities(initialActivities);
  }, []);

  // Update display times every minute
  useEffect(() => {
    const updateTimes = () => {
      setActivities(prev => {
        const now = Date.now();
        const updated = prev.map(activity => {
          const minutesAgo = getMinutesSince(activity.createdAt);
          return {
            ...activity,
            displayTime: formatTimeAgo(minutesAgo),
          };
        });

        // Remove activities older than 22 minutes, add new ones to replace
        const activeActivities = updated.filter(a => getMinutesSince(a.createdAt) <= 22);

        // If we removed some, add new ones
        while (activeActivities.length < 4) {
          activeActivities.unshift(generateActivity(false));
        }

        return activeActivities;
      });
    };

    // Update every minute
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  // Rotate displayed activity every 6-9 seconds
  useEffect(() => {
    if (activities.length === 0) return;

    const rotateInterval = 6000 + Math.random() * 3000; // 6-9 seconds

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentActivityIndex(prev => {
          // Potentially add a new activity occasionally (20% chance)
          if (Math.random() < 0.2) {
            setActivities(prevActivities => {
              // Only add if we haven't added recently (within last 30 seconds)
              const now = Date.now();
              if (now - lastUpdateRef.current < 30000) return prevActivities;
              lastUpdateRef.current = now;

              const newActivity = generateActivity(false);
              const updated = [newActivity, ...prevActivities].slice(0, 8);
              return updated;
            });
          }
          return (prev + 1) % Math.min(activities.length, 5);
        });
        setIsVisible(true);
      }, 250);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [activities.length]);

  if (activities.length === 0) return null;

  const currentActivity = activities[currentActivityIndex];
  if (!currentActivity) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-6 mb-4">
      <div className="flex items-center justify-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 overflow-hidden">
        {/* Live indicator */}
        <div className="relative shrink-0">
          <div className="w-2 h-2 rounded-full bg-success" />
          <div
            className="absolute inset-0 w-2 h-2 rounded-full bg-success"
            style={{
              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            }}
          />
        </div>

        {/* Activity message with crossfade */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{
              background: `${activityColors[currentActivity.type]}20`,
              color: activityColors[currentActivity.type],
            }}
          >
            {activityIcons[currentActivity.type]}
          </div>
          <span className="font-inter text-dark-text text-sm truncate">
            <span
              className={`inline-block transition-all duration-250 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
            >
              {currentActivity.message}
            </span>
            <span
              className={`text-secondary-text text-xs ml-2 inline-block transition-all duration-250 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {currentActivity.displayTime}
            </span>
          </span>
        </div>

        {/* Activity dots indicator */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-2">
          {Array.from({ length: Math.min(activities.length, 5) }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${i === currentActivityIndex ? 'w-4 h-1.5 bg-navy' : 'w-1.5 h-1.5 bg-slate-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="bg-white py-8 border-b border-slate-100">
      {/* Live activity ticker */}
      <LiveActivityTicker />

      {/* Stats row */}
      <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-6">
        <CountStat target={200} suffix="+" label="Sole traders served" icon={<Users size={18} className="text-navy" />} />
        <Divider />
        <TextStat value="3-5 days" label="From payment to delivery" icon={<Clock size={18} className="text-navy" />} />
        <Divider />
        <CountStat target={10} label="Documents per pack" icon={<FileText size={18} className="text-navy" />} />
        <Divider />
        <TextStat value="5.0 star" label="Client satisfaction" icon={<Star size={18} className="text-amber-500" />} />
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
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-slate-50"
          >
            <div className="text-navy/60">{badge.icon}</div>
            <span className="font-inter font-medium text-secondary-text text-xs">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
