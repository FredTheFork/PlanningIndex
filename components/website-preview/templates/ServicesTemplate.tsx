'use client';

import React from 'react';

export interface ServiceBlock {
  name: string;
  description: string;
  included: string[];
  notIncluded?: string[];
  outcome: string;
  investment?: string;
}

export interface ServicesContent {
  intro: string;
  services: ServiceBlock[];
  cta: {
    text: string;
    action: string;
  };
}

interface ServicesTemplateProps {
  content: ServicesContent;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export default function ServicesTemplate({ content, brandColors = {} }: ServicesTemplateProps) {
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
            <a href="#services" className="text-gray-900 font-medium text-sm">Services</a>
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

      {/* Hero/Intro */}
      <section className="py-16 md:py-24" style={{ backgroundColor: `${primary}08` }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: primary }}>
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            {content.intro}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-16">
            {content.services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
              >
                <div className="grid lg:grid-cols-3 gap-0">
                  {/* Service Name & Description */}
                  <div className="p-8 lg:col-span-2">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${accent}20` }}
                      >
                        <span className="text-xl font-bold" style={{ color: accent }}>
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2" style={{ color: primary }}>
                          {service.name}
                        </h3>
                        <p
                          className="text-gray-600"
                          dangerouslySetInnerHTML={{ __html: service.description }}
                        />
                      </div>
                    </div>

                    {/* What's Included */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-sm mb-3" style={{ color: primary }}>
                        What's Included
                      </h4>
                      <ul className="space-y-2">
                        {service.included.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <svg
                              className="w-5 h-5 shrink-0 mt-0.5"
                              style={{ color: secondary }}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-gray-600 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What's Not Included */}
                    {service.notIncluded && service.notIncluded.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-3 text-gray-500">
                          Not Included
                        </h4>
                        <ul className="space-y-2">
                          {service.notIncluded.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <svg
                                className="w-5 h-5 shrink-0 mt-0.5 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-gray-500 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Outcome & Investment */}
                  <div
                    className="p-8 lg:border-l"
                    style={{ backgroundColor: `${primary}05`, borderColor: `${primary}20` }}
                  >
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm mb-2" style={{ color: primary }}>
                        Expected Outcome
                      </h4>
                      <p className="text-gray-600 text-sm">{service.outcome}</p>
                    </div>
                    {service.investment && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-sm mb-2" style={{ color: primary }}>
                          Investment
                        </h4>
                        <p className="text-2xl font-bold" style={{ color: accent }}>
                          {service.investment}
                        </p>
                      </div>
                    )}
                    <a
                      href="#contact"
                      className="block w-full text-center py-3 text-white rounded font-medium transition-colors"
                      style={{ backgroundColor: secondary }}
                    >
                      Enquire Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: primary }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-2xl text-white mb-6">{content.cta.text}</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium rounded transition-transform hover:scale-105"
            style={{ backgroundColor: accent, color: '#fff' }}
          >
            {content.cta.action}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </footer>
    </div>
  );
}
