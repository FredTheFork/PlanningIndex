import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Inter, Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Self-hosted via next/font — no render-blocking Google Fonts CSS request.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
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
    <html lang="en-GB" className={`${inter.variable} ${archivo.variable} ${jetbrainsMono.variable}`}>
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
