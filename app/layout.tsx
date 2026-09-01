import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG, SITE_URL, KEYWORDS } from '@/lib/seo';
import { JsonLd } from '@/components/seo';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';
import { ToastProvider } from '@/components/ui/Toast';

const ClientOverlays = dynamic(() => import('@/components/layout/ClientOverlays'), {
  ssr: false,
});

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PlanningIndex | UK Planning Application Intelligence',
    template: '%s | PlanningIndex',
  },
  description: SITE_CONFIG.description,
  keywords: [...KEYWORDS.primary, ...KEYWORDS.secondary, ...KEYWORDS.longTail].join(', '),
  authors: [{ name: SITE_CONFIG.name, url: SITE_URL }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  category: 'Planning Intelligence',
  formatDetection: {
    email: false,
    telephone: true,
    address: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-GB': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    siteName: SITE_CONFIG.name,
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'GB',
    'geo.placename': 'United Kingdom',
    'language': 'en-GB',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="bg-surface-page font-sans text-primary-900 antialiased">
        <ToastProvider>
          <JsonLd data={[generateOrganizationSchema(), generateWebSiteSchema()]} />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ClientOverlays />
        </ToastProvider>
      </body>
    </html>
  );
}
