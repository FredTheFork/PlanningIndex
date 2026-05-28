import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Foundationary',
  description: 'Professional documents for UK sole traders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
