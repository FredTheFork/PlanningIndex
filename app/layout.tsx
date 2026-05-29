import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyCTA from '@/components/ui/StickyCTA';
import CookieConsent from '@/components/ui/CookieConsent';
import ExitIntentPopup from '@/components/ui/ExitIntentPopup';
import { JsonLd } from '@/components/seo';
import { generateOrganizationSchema, generateWebSiteSchema, SITE_CONFIG, SITE_URL, KEYWORDS } from '@/lib/seo';

export const viewport: Viewport = {
  themeColor: '#1B3F7A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Foundationary | Business Documents for UK Sole Traders',
    template: '%s | Foundationary',
  },
  description: SITE_CONFIG.description,
  keywords: [...KEYWORDS.primary, ...KEYWORDS.secondary].join(', '),

  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,

  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },

  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: SITE_CONFIG.name,
    title: 'Foundationary | Business Documents for UK Sole Traders',
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_URL}/og/default.png`,
        width: 1200,
        height: 630,
        alt: 'Foundationary - Business Documents for UK Sole Traders',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: 'Foundationary | Business Documents for UK Sole Traders',
    description: SITE_CONFIG.description,
    images: [`${SITE_URL}/og/default.png`],
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

  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-GB': SITE_URL,
    },
  },

  other: {
    'geo.region': 'GB',
    'geo.placename': 'United Kingdom',
    'language': 'en-GB',
    'msapplication-TileColor': '#1B3F7A',
  },

  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },

  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <JsonLd data={[generateOrganizationSchema(), generateWebSiteSchema()]} />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <StickyCTA />
        <CookieConsent />
        <ExitIntentPopup />
      </body>
    </html>
  );
}
