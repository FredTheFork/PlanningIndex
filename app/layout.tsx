import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG, SITE_URL, KEYWORDS } from '@/lib/seo';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
