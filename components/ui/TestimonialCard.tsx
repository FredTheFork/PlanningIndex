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
    <div className="bg-white rounded-2xl p-8 border border-border">
      <span
        className="block text-medium-blue font-bold leading-none -mb-3"
        style={{ fontSize: '2.4rem' }}
      >
        &ldquo;
      </span>
      <p
        className="font-inter text-dark-text leading-[1.7]"
        style={{ fontSize: '1rem', fontStyle: 'italic' }}
      >
        {testimonial.quote}
      </p>
      <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)' }}
        >
          <span className="font-inter font-semibold text-white" style={{ fontSize: '0.75rem' }}>
            {testimonial.initials}
          </span>
        </div>
        <div>
          <span className="font-inter font-semibold text-dark-text block" style={{ fontSize: '0.9rem' }}>
            {testimonial.name}
          </span>
          <span className="font-inter font-normal text-secondary-text" style={{ fontSize: '0.8rem' }}>
            {testimonial.role}
          </span>
        </div>
      </div>
    </div>
  );
}
