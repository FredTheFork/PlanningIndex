'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

// Animated Bar Chart Component
export interface BarData {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  suffix?: string;
  prefix?: string;
}

interface AnimatedBarChartProps {
  data: BarData[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AnimatedBarChart({ data, title, subtitle, className = '' }: AnimatedBarChartProps) {
  const [ref, inView] = useInView(0.2);
  const [animatedValues, setAnimatedValues] = useState(data.map(() => 0));

  useEffect(() => {
    if (inView) {
      const maxVal = Math.max(...data.map(d => d.value));
      const duration = 1200;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const eased = 1 - Math.pow(1 - progress, 3);

        setAnimatedValues(
          data.map(d => {
            const targetPercent = (d.value / (d.maxValue || maxVal)) * 100;
            return targetPercent * eased;
          })
        );

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [inView, data]);

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
      {title && (
        <div className="mb-6">
          <h3 className="font-inter font-bold text-navy text-lg">{title}</h3>
          {subtitle && (
            <p className="font-inter text-secondary-text text-sm mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {data.map((bar, i) => (
          <div key={bar.label} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-inter font-medium text-dark-text text-sm">
                {bar.label}
              </span>
              <span className="font-inter font-bold text-navy text-sm">
                {bar.prefix}{animatedValues[i].toFixed(0)}{bar.suffix}
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${animatedValues[i]}%`,
                  background: bar.color || 'linear-gradient(90deg, #1B3F7A, #2C68C4)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated Counter with large display
interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  triggerOnView?: boolean;
  decimals?: number;
}

export function AnimatedCounter({
  target,
  duration = 1500,
  prefix = '',
  suffix = '',
  className = '',
  triggerOnView = true,
  decimals = 0,
}: AnimatedCounterProps) {
  const [ref, inView] = useInView(0.3);
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const shouldAnimate = triggerOnView ? inView && !hasAnimated.current : !hasAnimated.current;

    if (shouldAnimate) {
      hasAnimated.current = true;
      const steps = 60;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(target * eased);

        if (currentStep >= steps) {
          clearInterval(interval);
          setCount(target);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [inView, target, duration, triggerOnView]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}

// Animated Pie/Donut Chart
interface PieSegment {
  label: string;
  value: number;
  color: string;
}

interface AnimatedPieChartProps {
  data: PieSegment[];
  size?: number;
  strokeWidth?: number;
  centerText?: string;
  centerValue?: string;
  className?: string;
}

export function AnimatedPieChart({
  data,
  size = 200,
  strokeWidth = 24,
  centerText,
  centerValue,
  className = '',
}: AnimatedPieChartProps) {
  const [ref, inView] = useInView(0.2);
  const [animatedSegments, setAnimatedSegments] = useState(data.map(() => 0));

  useEffect(() => {
    if (inView) {
      const duration = 1200;
      const steps = 60;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const eased = 1 - Math.pow(1 - progress, 3);

        setAnimatedSegments(data.map(d => d.value * eased));
        if (currentStep >= steps) clearInterval(interval);
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [inView, data]);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div ref={ref} className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {/* Animated segments */}
        {data.map((segment, i) => {
          const percentage = animatedSegments[i] / total;
          const segmentLength = circumference * percentage;
          const offset = cumulativeOffset;
          cumulativeOffset += segmentLength;

          return (
            <circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          );
        })}
      </svg>
      {/* Center content */}
      {(centerText || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="font-inter font-bold text-navy text-2xl">{centerValue}</span>
          )}
          {centerText && (
            <span className="font-inter text-secondary-text text-xs mt-1">{centerText}</span>
          )}
        </div>
      )}
    </div>
  );
}

// Animated Number Grid - displays multiple stats in a grid
interface StatItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface AnimatedStatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function AnimatedStatsGrid({ stats, columns = 4, className = '' }: AnimatedStatsGridProps) {
  const [ref, inView] = useInView(0.2);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <div ref={ref} className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-slate-200 p-5 text-center"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
          }}
        >
          {stat.icon && (
            <div className="flex justify-center mb-2" style={{ color: stat.color || '#1B3F7A' }}>
              {stat.icon}
            </div>
          )}
          <div className="font-inter font-bold text-3xl text-navy">
            <AnimatedCounter
              target={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              triggerOnView={false}
            />
          </div>
          <div className="font-inter text-secondary-text text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Animated Line Graph (simpleSVG-based)
interface LineDataPoint {
  label: string;
  value: number;
}

interface AnimatedLineGraphProps {
  data: LineDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showLabels?: boolean;
  className?: string;
}

export function AnimatedLineGraph({
  data,
  width = 400,
  height = 200,
  color = '#2C68C4',
  showLabels = true,
  className = '',
}: AnimatedLineGraphProps) {
  const [ref, inView] = useInView(0.2);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (inView) {
      const duration = 1200;
      const steps = 60;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setProgress(currentStep / steps);
        if (currentStep >= steps) clearInterval(interval);
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [inView]);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((point, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((point.value - minValue) / (maxValue - minValue || 1)) * chartHeight,
  }));

  const visiblePoints = points.slice(0, Math.ceil(points.length * progress) + 1);

  const pathD = visiblePoints.length > 1
    ? visiblePoints.reduce((d, p, i) => `${d}${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')
    : '';

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 p-4 ${className}`}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        <g stroke="#E2E8F0" strokeWidth="1">
          <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} />
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} />
          <line x1={width - padding.right} y1={padding.top} x2={width - padding.right} y2={height - padding.bottom} />
        </g>

        {/* Animated line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {visiblePoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={color}
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        {showLabels && data.map((point, i) => (
          <text
            key={point.label}
            x={padding.left + (i / (data.length - 1)) * chartWidth}
            y={height - 10}
            textAnchor="middle"
            className="font-inter text-xs fill-slate-500"
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
