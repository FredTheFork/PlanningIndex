'use client';

import Link from 'next/link';
import { Home, FileText, HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-gradient-to-br from-white to-gray-50">
      <div className="text-center max-w-2xl">
        {/* Large 404 with branding */}
        <div className="relative inline-block mb-6">
          <h1 className="font-inter font-extrabold text-navy/10" style={{ fontSize: '12rem', lineHeight: 1 }}>
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-navy rounded-full p-6 shadow-xl">
              <FileText size={48} className="text-white" />
            </div>
          </div>
        </div>

        <h2 className="font-inter font-bold text-navy mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Oops! This document hasn't been drafted yet.
        </h2>
        <p className="font-inter font-normal text-secondary-text mb-10 leading-[1.7]" style={{ fontSize: '1.1rem' }}>
          The page you're looking for doesn't exist or has been moved. But don't worry — your actual business documents will be delivered on time.
        </p>

        {/* Primary CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(27,63,122,0.25)] transition-all duration-200 mb-8"
          style={{ padding: '16px 32px', fontSize: '1rem' }}
        >
          <Home size={18} />
          Back to Home
        </Link>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="font-inter font-medium text-secondary-text mb-4" style={{ fontSize: '0.9rem' }}>
            Or try one of these helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 font-inter font-medium text-navy bg-white border border-border rounded-lg hover:border-medium-blue hover:shadow-md transition-all duration-200"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              View Pricing
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 font-inter font-medium text-navy bg-white border border-border rounded-lg hover:border-medium-blue hover:shadow-md transition-all duration-200"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              <HelpCircle size={16} />
              FAQs
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 font-inter font-medium text-navy bg-white border border-border rounded-lg hover:border-medium-blue hover:shadow-md transition-all duration-200"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-inter font-medium text-navy bg-white border border-border rounded-lg hover:border-medium-blue hover:shadow-md transition-all duration-200"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Back link */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 font-inter font-medium text-medium-blue hover:underline mt-8 cursor-pointer bg-transparent border-none"
          style={{ fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}
