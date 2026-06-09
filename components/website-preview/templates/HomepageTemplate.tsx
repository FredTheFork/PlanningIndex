'use client';

import React from 'react';

export interface HomepageContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  benefits: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  socialProof: {
    type: 'testimonial' | 'trust_signals' | 'logos';
    headline?: string;
    content?: string;
    testimonial?: {
      quote: string;
      author: string;
      role?: string;
    };
  };
  finalCta: {
    headline: string;
    body: string;
    buttonText: string;
  };
}

interface HomepageTemplateProps {
  content: HomepageContent;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export default function HomepageTemplate({ content, brandColors = {} }: HomepageTemplateProps) {
  const primary = brandColors.primary || '#1B3F7A';
  const secondary = brandColors.secondary || '#2C68C4';
  const accent = brandColors.accent || '#FF8C42';

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded" style={{ backgroundColor: primary }} />
            <span className="font-bold text-lg" style={{ color: primary }}>Brand</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-gray-600 hover:text-gray-900 text-sm">Services</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 text-sm">About</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 text-sm">Testimonials</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</a>
          </nav>
          <a
            href="#contact"
            className="px-4 py-2 text-white text-sm font-medium rounded"
            style={{ backgroundColor: accent }}
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32" style={{ backgroundColor: `${primary}08` }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: primary }}
              dangerouslySetInnerHTML={{ __html: content.hero.headline }}
            />
            <p
              className="text-lg md:text-xl text-gray-600 mb-8"
              dangerouslySetInnerHTML={{ __html: content.hero.subheadline }}
            />
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-white text-lg font-medium rounded transition-transform hover:scale-105"
              style={{ backgroundColor: accent }}
            >
              {content.hero.ctaText}
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24" id="services">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: primary }}>
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the advantages of working with our team
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${accent}20` }}
                >
                  <span className="text-2xl">{benefit.icon || String(index + 1)}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: primary }}>
                  {benefit.title}
                </h3>
                <p
                  className="text-gray-600 text-sm"
                  dangerouslySetInnerHTML={{ __html: benefit.description }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 md:py-24 bg-gray-50" id="testimonials">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: primary }}>
              {content.socialProof.headline || 'What Our Clients Say'}
            </h2>
          </div>
          {content.socialProof.type === 'testimonial' && content.socialProof.testimonial && (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <blockquote className="text-lg md:text-xl text-gray-700 mb-6 italic">
                "{content.socialProof.testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full" style={{ backgroundColor: primary }} />
                <div>
                  <p className="font-semibold" style={{ color: primary }}>
                    {content.socialProof.testimonial.author}
                  </p>
                  {content.socialProof.testimonial.role && (
                    <p className="text-gray-500 text-sm">{content.socialProof.testimonial.role}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {content.socialProof.type === 'trust_signals' && (
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: accent }}>500+</div>
                <div className="text-gray-600 text-sm">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: accent }}>98%</div>
                <div className="text-gray-600 text-sm">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: accent }}>10+</div>
                <div className="text-gray-600 text-sm">Years Experience</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: primary }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {content.finalCta.headline}
          </h2>
          <p
            className="text-lg text-white opacity-80 mb-8"
            dangerouslySetInnerHTML={{ __html: content.finalCta.body }}
          />
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium rounded transition-transform hover:scale-105"
            style={{ backgroundColor: accent, color: '#fff' }}
          >
            {content.finalCta.buttonText}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: primary }} />
                <span className="font-bold text-lg">Brand</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs">
                Helping businesses achieve their goals with professional services.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#services" className="text-gray-400 hover:text-white text-sm">Services</a>
              <a href="#about" className="text-gray-400 hover:text-white text-sm">About</a>
              <a href="#contact" className="text-gray-400 hover:text-white text-sm">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
