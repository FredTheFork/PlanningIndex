import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG, SITE_URL, KEYWORDS } from '@/lib/seo';
import { JsonLd } from '@/components/seo';

const ClientOverlays = dynamic(() => import('@/components/layout/ClientOverlays'), {
  ssr: false,
});

export const viewport: Viewport = {
  themeColor: '#1B3F7A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// Set NEXT_PUBLIC_GSC_VERIFICATION in Vercel env vars after verifying with Google Search Console
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION || '';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Foundationary | Business Foundations Platform for UK Sole Traders',
    template: '%s | Foundationary',
  },
  description: SITE_CONFIG.description,
  keywords: [...KEYWORDS.primary, ...KEYWORDS.secondary, ...KEYWORDS.longTail].join(', '),
  authors: [{ name: SITE_CONFIG.name, url: SITE_URL }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  category: 'Business Services',
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
  ...(GSC_VERIFICATION && {
    verification: {
      google: GSC_VERIFICATION,
    },
  }),
  other: {
    'geo.region': 'GB',
    'geo.placename': 'United Kingdom',
    'language': 'en-GB',
  },
};

function generateRootSchemas() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      'https://www.linkedin.com/company/foundationary',
      'https://twitter.com/foundationary',
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      areaServed: 'GB',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
    foundingDate: SITE_CONFIG.foundingDate,
    priceRange: '££',
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_URL,
    description: SITE_CONFIG.description,
    inLanguage: 'en-GB',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_URL,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
    priceRange: '££',
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    openingHours: 'Mo-Fr 09:00-17:00',
    sameAs: [
      'https://www.linkedin.com/company/foundationary',
      'https://twitter.com/foundationary',
    ].filter(Boolean),
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  };

  return [org, website, localBusiness];
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="alternate" type="application/rss+xml" title="Foundationary Blog" href={`${SITE_URL}/feed.xml`} />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2H97MZ9P07"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2H97MZ9P07');
          `}
        </Script>
        <JsonLd data={generateRootSchemas()} />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ClientOverlays />
      </body>
    </html>
  );
}
