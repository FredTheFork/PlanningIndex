'use client';

import React from 'react';

export interface ContactContent {
  heading: string;
  welcomeText: string;
  howToReach: {
    preferredMethod?: string;
    email?: string;
    phone?: string;
    businessHours?: string;
  };
  whatHappensNext: string;
  mapAddress?: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    x?: string;
  };
}

interface ContactTemplateProps {
  content: ContactContent;
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export default function ContactTemplate({ content, brandColors = {} }: ContactTemplateProps) {
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
            <a href="#contact" className="text-gray-900 font-medium text-sm">Contact</a>
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
      <section className="py-16 md:py-24" style={{ backgroundColor: `${primary}08` }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: primary }}>
            {content.heading}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            {content.welcomeText}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-8" style={{ color: primary }}>
                How to Reach Us
              </h2>

              {content.howToReach.preferredMethod && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${accent}10` }}>
                  <p className="text-sm font-medium mb-1" style={{ color: accent }}>Preferred Contact Method</p>
                  <p className="text-gray-700">{content.howToReach.preferredMethod}</p>
                </div>
              )}

              <div className="space-y-4">
                {content.howToReach.email && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${secondary}15` }}
                    >
                      <svg className="w-5 h-5" style={{ color: secondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a
                        href={`mailto:${content.howToReach.email}`}
                        className="font-medium hover:underline"
                        style={{ color: primary }}
                      >
                        {content.howToReach.email}
                      </a>
                    </div>
                  </div>
                )}

                {content.howToReach.phone && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${secondary}15` }}
                    >
                      <svg className="w-5 h-5" style={{ color: secondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <a
                        href={`tel:${content.howToReach.phone}`}
                        className="font-medium hover:underline"
                        style={{ color: primary }}
                      >
                        {content.howToReach.phone}
                      </a>
                    </div>
                  </div>
                )}

                {content.howToReach.businessHours && (
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${secondary}15` }}
                    >
                      <svg className="w-5 h-5" style={{ color: secondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Business Hours</p>
                      <p className="text-gray-700">{content.howToReach.businessHours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* What happens next */}
              <div className="mt-10 p-6 rounded-lg border border-gray-200 bg-gray-50">
                <h3 className="font-semibold mb-3" style={{ color: primary }}>
                  What Happens Next
                </h3>
                <p className="text-gray-600 text-sm">{content.whatHappensNext}</p>
              </div>

              {/* Social Links */}
              {content.socialLinks && (
                <div className="mt-10">
                  <h3 className="font-semibold mb-4" style={{ color: primary }}>
                    Connect With Us
                  </h3>
                  <div className="flex gap-3">
                    {content.socialLinks.linkedin && (
                      <a
                        href={content.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    )}
                    {content.socialLinks.instagram && (
                      <a
                        href={content.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {content.socialLinks.facebook && (
                      <a
                        href={content.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                        </svg>
                      </a>
                    )}
                    {content.socialLinks.x && (
                      <a
                        href={content.socialLinks.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.15z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form Placeholder */}
            <div>
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6" style={{ color: primary }}>
                  Send a Message
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ '--tw-ring-color': primary } as React.CSSProperties}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 min-h-[120px]"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 text-white font-medium rounded-lg transition-colors"
                    style={{ backgroundColor: accent }}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {content.mapAddress && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Map: {content.mapAddress}</p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </footer>
    </div>
  );
}
