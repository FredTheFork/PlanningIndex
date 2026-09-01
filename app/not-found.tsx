import { Metadata } from 'next';
import Link from 'next/link';
import { Home, FileText, ArrowLeft } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
  alternates: { canonical: SITE_URL },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-primary-50">
      <div className="text-center max-w-2xl">
        <div className="relative inline-block mb-6">
          <h1 className="font-sans font-extrabold text-primary-200" style={{ fontSize: '12rem', lineHeight: 1 }}>
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary-900 rounded-full p-6 shadow-xl">
              <FileText size={48} className="text-white" />
            </div>
          </div>
        </div>

        <h2 className="font-sans font-bold text-primary-900 mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Page not found
        </h2>
        <p className="font-sans font-normal text-primary-500 mb-10 leading-relaxed" style={{ fontSize: '1.1rem' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans font-semibold text-white bg-primary-900 rounded-lg hover:bg-primary-800 transition-all duration-200 mb-8"
          style={{ padding: '16px 32px', fontSize: '1rem' }}
        >
          <Home size={18} />
          Back to Home
        </Link>

        <div className="mt-8 pt-8 border-t border-primary-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans font-medium text-accent-600 hover:underline"
            style={{ fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} />
            Go back to previous page
          </Link>
        </div>
      </div>
    </div>
  );
}
