import type { Metadata } from 'next';
import QuarterlyRefreshClient from './QuarterlyRefreshClient';

export const metadata: Metadata = {
  title: 'Quarterly Document Refresh — Keep Your Business Documents Current | Foundationary',
  description: 'Keep your business documents accurate as your business evolves. One update per quarter. £29 every 4 months. Cancel anytime.',
};

export default function QuarterlyRefreshPage() {
  return <QuarterlyRefreshClient />;
}
