import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B3F7A',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://foundationary.vercel.app'),
  title: {
    default: 'Foundationary — Business Foundations. Fast.',
    template: '%s | Foundationary',
  },
  description: '10 professional documents built entirely around your UK sole trader business - contracts, privacy policies, invoices, bios, pitches and more. Done for you. Delivered in 24 hours.',
  keywords: ['sole trader UK', 'business documents UK', 'freelancer contract', 'GDPR compliance', 'privacy policy', 'business foundations', 'client contract', 'UK freelancer'],
  authors: [{ name: 'Foundationary' }],
  creator: 'Foundationary',
  publisher: 'Foundationary',
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
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Foundationary',
    title: 'Foundationary — Business Foundations. Fast.',
    description: '10 professional documents built entirely around your UK sole trader business - contracts, privacy policies, invoices, bios, pitches and more. Done for you. Delivered in 24 hours.',
    url: 'https://foundationary.vercel.app',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Foundationary - Professional business documents for UK sole traders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foundationary — Business Foundations. Fast.',
    description: '10 professional documents built entirely around your UK sole trader business.',
    images: ['/og-home.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://foundationary.vercel.app/#organization',
              name: 'Foundationary',
              description: 'Professional business documents for UK sole traders and freelancers',
              url: 'https://foundationary.vercel.app',
              logo: {
                '@type': 'ImageObject',
                url: 'https://foundationary.vercel.app/logo.png',
                width: 1200,
                height: 630,
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+44-7377-203834',
                contactType: 'customer service',
                email: 'foundationarybusiness@gmail.com',
                areaServed: 'GB',
              },
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://foundationary.vercel.app/#business',
              name: 'Foundationary',
              description: 'Professional business documents for UK sole traders',
              url: 'https://foundationary.vercel.app',
              telephone: '+44-7377-203834',
              email: 'foundationarybusiness@gmail.com',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'GB',
                addressLocality: 'United Kingdom',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '51.5074',
                longitude: '-0.1278',
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '17:00',
              },
              priceRange: '££',
              areaServed: {
                '@type': 'Country',
                name: 'United Kingdom',
              },
              serviceType: ['Document Drafting', 'Legal Document Preparation', 'Business Setup Services'],
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
