'use client';

import React from 'react';

export interface AboutContent {
  opening: string;
  story: string;
  values: Array<{
    title: string;
    description: string;
  }>;
  whyWorkWithUs: Array<{
    reason: string;
    outcome: string;
  }>;
  teamSection?: {
    enabled: boolean;
    members?: Array<{
      name: string;
      role: string;
      bio: string;
    }>;
  };
  cta: string;
}

interface AboutTemplateProps {
  content: AboutContent;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export default function AboutTemplate({ content, brandColors = {} }: AboutTemplateProps) {
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
            <a href="#about" className="text-gray-900 font-medium text-sm">About</a>
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

      {/* Opening Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: `${primary}08` }}>
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-lg md:text-xl text-gray-600 text-center italic">
            {content.opening}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: primary }}>
            Our Story
          </h1>
          <div
            className="text-lg text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: content.story }}
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: primary }}>
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4 text-white font-bold"
                  style={{ backgroundColor: secondary }}
                >
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: primary }}>
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12" style={{ color: primary }}>
            Why Work With Us
          </h2>
          <div className="space-y-6">
            {content.whyWorkWithUs.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accent}20` }}
                >
                  <svg className="w-4 h-4" style={{ color: accent }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: primary }}>{item.reason}</p>
                  <p className="text-gray-600 text-sm">{item.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (optional) */}
      {content.teamSection?.enabled && content.teamSection.members && content.teamSection.members.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: primary }}>
              Meet the Team
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.teamSection.members.map((member, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm text-center">
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: primary }}
                  >
                    <span className="text-3xl text-white font-bold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: primary }}>{member.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: primary }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl text-white opacity-90 mb-6">{content.cta}</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium rounded transition-transform hover:scale-105"
            style={{ backgroundColor: accent, color: '#fff' }}
          >
            Get in Touch
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
