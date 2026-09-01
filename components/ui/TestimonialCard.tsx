import React from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-primary-200">
      <span
        className="block text-accent-500 font-bold leading-none -mb-3"
        style={{ fontSize: '2.4rem' }}
      >
        &ldquo;
      </span>
      <p
        className="font-sans text-primary-700 leading-relaxed"
        style={{ fontSize: '1rem', fontStyle: 'italic' }}
      >
        {testimonial.quote}
      </p>
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-primary-100">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary-900">
          <span className="font-sans font-semibold text-white" style={{ fontSize: '0.75rem' }}>
            {testimonial.initials}
          </span>
        </div>
        <div>
          <span className="font-sans font-semibold text-primary-900 block" style={{ fontSize: '0.9rem' }}>
            {testimonial.name}
          </span>
          <span className="font-sans text-primary-500" style={{ fontSize: '0.8rem' }}>
            {testimonial.role}
          </span>
        </div>
      </div>
    </div>
  );
}
