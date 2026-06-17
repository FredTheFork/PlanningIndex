'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Eye, ChevronLeft, ChevronRight, FileCheck, Ligature as FileSignature, FileCog, Shield, Clock, Check } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

// Single Document Preview Card
interface DocumentCardProps {
  title: string;
  fileName: string;
  icon?: React.ReactNode;
  pages?: number;
  fileType?: 'pdf' | 'docx';
  previewImage?: string;
  className?: string;
}

export function DocumentCard({
  title,
  fileName,
  icon,
  pages = 1,
  fileType = 'pdf',
  previewImage,
  className = '',
}: DocumentCardProps) {
  const [ref, inView] = useInView(0.2);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg scale-[1.02]' : ''} ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* File type badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`font-inter font-semibold text-xs px-2 py-1 rounded ${fileType === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {fileType.toUpperCase()}
        </span>
      </div>

      {/* Preview area */}
      <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
        {previewImage ? (
          <img src={previewImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-navy/10 flex items-center justify-center">
              {icon || <FileText size={32} className="text-navy" />}
            </div>
            <div className="font-inter text-secondary-text text-xs">Preview</div>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-navy/80 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
            <Eye size={18} className="text-navy" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
            <Download size={18} className="text-navy" />
          </button>
        </div>
      </div>

      {/* Document info */}
      <div className="p-4">
        <h4 className="font-inter font-semibold text-dark-text text-sm mb-1 truncate">{title}</h4>
        <p className="font-inter text-secondary-text text-xs truncate">{fileName}</p>
        {pages > 1 && (
          <p className="font-inter text-secondary-text text-xs mt-2">{pages} pages</p>
        )}
      </div>
    </div>
  );
}

// Document Carousel for service pages
interface DocumentCarouselProps {
  documents: Array<{
    title: string;
    fileName: string;
    icon?: React.ReactNode;
    pages?: number;
    previewImage?: string;
    category: string;
  }>;
  title?: string;
  subtitle?: string;
  autoPlay?: boolean;
  className?: string;
}

export function DocumentCarousel({
  documents,
  title,
  subtitle,
  autoPlay = true,
  className = '',
}: DocumentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView(0.2);

  useEffect(() => {
    if (autoPlay && inView) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % documents.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, inView, documents.length]);

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + documents.length) % documents.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % documents.length);
  };

  const currentDoc = documents[currentIndex];
  const categoryDocs = documents.filter(d => d.category === currentDoc.category);

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-inter font-bold text-navy text-lg">{title}</h3>
          {subtitle && (
            <p className="font-inter text-secondary-text text-sm mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className="p-6 relative">
        {/* Navigation arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={20} className="text-navy" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronRight size={20} className="text-navy" />
        </button>

        {/* Main preview */}
        <div className="relative h-80 bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden mx-8">
          {/* Document mockup */}
          <div className="w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-6 transform transition-all duration-500">
            {/* Document header */}
            <div className="h-8 bg-gradient-to-r from-navy to-medium-blue rounded-t-lg flex items-center px-3 -mx-6 -mt-6 mb-4">
              <span className="font-inter font-semibold text-white text-xs truncate">
                FOUNDATIONARY
              </span>
            </div>

            {/* Document content lines */}
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-4/5" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>

            {/* Signature line */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="h-8 bg-slate-100 rounded w-1/2" />
            </div>
          </div>

          {/* Document info overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-inter font-semibold text-dark-text text-sm">{currentDoc.title}</h4>
                <p className="font-inter text-secondary-text text-xs">{currentDoc.fileName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-inter text-xs text-slate-500">{currentDoc.pages || 1} {currentDoc.pages === 1 ? 'page' : 'pages'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {documents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-navy' : 'bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>

        {/* Category count */}
        <div className="text-center mt-4">
          <span className="font-inter text-secondary-text text-sm">
            {categoryDocs.length} documents in this pack
          </span>
        </div>
      </div>
    </div>
  );
}

// Document Stack Visualization for bundles/checkout
interface DocumentStackProps {
  count: number;
  maxVisible?: number;
  className?: string;
  label?: string;
}

export function DocumentStack({ count, maxVisible = 5, className = '', label }: DocumentStackProps) {
  const visibleCount = Math.min(count, maxVisible);
  const hiddenCount = count - maxVisible;
  const [ref, inView] = useInView(0.2);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsAnimating(true);
    }
  }, [inView]);

  return (
    <div ref={ref} className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Stack container */}
      <div className="relative" style={{ width: 140, height: 100 + visibleCount * 8 }}>
        {Array.from({ length: visibleCount }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-lg shadow-md border border-slate-200 transition-all duration-500"
            style={{
              width: 120,
              height: 80,
              top: 20 + i * -8,
              left: 10 + i * 4,
              zIndex: i,
              transform: `${isAnimating ? `rotate(${(i - Math.floor(visibleCount / 2)) * 2}deg)` : 'rotate(0deg)'}`,
              opacity: isAnimating ? 1 : 0,
              transitionDelay: `${i * 50}ms`,
            }}
          >
            <div className="h-6 bg-gradient-to-r from-navy to-medium-blue rounded-t-lg flex items-center justify-center">
              <FileText size={14} className="text-white" />
            </div>
            <div className="p-2 space-y-1">
              <div className="h-1.5 bg-slate-200 rounded w-3/4" />
              <div className="h-1 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}

        {/* Hidden count badge */}
        {hiddenCount > 0 && (
          <div
            className="absolute bg-navy text-white rounded-full flex items-center justify-center font-inter font-semibold text-xs shadow-lg"
            style={{
              width: 32,
              height: 32,
              top: 8,
              right: 0,
              zIndex: visibleCount + 1,
            }}
          >
            +{hiddenCount}
          </div>
        )}
      </div>

      {/* Label */}
      {label && (
        <div className="mt-2 text-center">
          <span className="font-inter font-semibold text-navy text-sm">{count}</span>
          <span className="font-inter text-secondary-text text-sm ml-1">{label}</span>
        </div>
      )}
    </div>
  );
}

// Document list with animated checkmarks
interface DocumentListItem {
  name: string;
  description?: string;
  icon?: React.ReactNode;
}

interface DocumentListProps {
  documents: DocumentListItem[];
  title?: string;
  animated?: boolean;
  className?: string;
}

export function DocumentList({ documents, title, animated = true, className = '' }: DocumentListProps) {
  const [ref, inView] = useInView(0.2);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (inView && animated) {
      const interval = setInterval(() => {
        setVisibleCount(prev => {
          if (prev >= documents.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    } else if (inView) {
      setVisibleCount(documents.length);
    }
  }, [inView, animated, documents.length]);

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
      {title && (
        <h3 className="font-inter font-bold text-navy text-lg mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {documents.map((doc, i) => (
          <div
            key={doc.name}
            className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? 'translateX(0)' : 'translateX(-10px)',
              background: i < visibleCount ? '#F8FAFF' : 'transparent',
            }}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${i < visibleCount ? 'bg-success text-white' : 'bg-slate-200 text-slate-400'}`}>
              {i < visibleCount ? <Check size={14} /> : <FileText size={14} />}
            </div>
            <div>
              <span className="font-inter font-medium text-dark-text text-sm">{doc.name}</span>
              {doc.description && (
                <p className="font-inter text-secondary-text text-xs mt-0.5">{doc.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Delivery Timeline Visual
interface DeliveryTimelineProps {
  steps?: Array<{
    label: string;
    time: string;
    description: string;
  }>;
  currentStep?: number;
  className?: string;
}

export function DeliveryTimeline({
  steps = [
    { label: 'Purchase', time: 'Now', description: 'Complete secure checkout' },
    { label: 'Intake', time: '10-20 min', description: 'Share your business details' },
    { label: 'Build', time: '24-72 hrs', description: 'We create your documents' },
    { label: 'Delivery', time: 'Done', description: 'Receive your bespoke files' },
  ],
  currentStep = 0,
  className = '',
}: DeliveryTimelineProps) {
  const [ref, inView] = useInView(0.2);
  const [animatedStep, setAnimatedStep] = useState(-1);

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => setAnimatedStep(0), 200);
      const intervals = steps.map((_, i) =>
        setTimeout(() => setAnimatedStep(i), 200 + (i + 1) * 300)
      );
      return () => {
        clearTimeout(timeout);
        intervals.forEach(clearTimeout);
      };
    }
  }, [inView, steps.length]);

  return (
    <div ref={ref} className={`bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Clock size={20} className="text-navy" />
        <h3 className="font-inter font-bold text-navy text-lg">Your Delivery Timeline</h3>
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-slate-200">
          <div
            className="bg-navy transition-all duration-500"
            style={{
              height: `${Math.max(0, (animatedStep / (steps.length - 1)) * 100)}%`,
            }}
          />
        </div>

        {/* Step markers */}
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-start gap-4 pl-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${i <= animatedStep ? 'bg-navy' : 'bg-slate-200'}`}
              >
                {i <= animatedStep && <Check size={12} className="text-white" />}
              </div>
              <div
                className={`flex-1 pb-4 transition-all duration-300 ${i <= animatedStep ? 'opacity-100' : 'opacity-50'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-inter font-semibold text-sm ${i <= animatedStep ? 'text-navy' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                  <span className={`font-inter text-xs ${i <= animatedStep ? 'text-medium-blue' : 'text-slate-400'}`}>
                    {step.time}
                  </span>
                </div>
                <p className="font-inter text-secondary-text text-xs mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
