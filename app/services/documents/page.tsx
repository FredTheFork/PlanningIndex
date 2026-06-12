import type { Metadata } from 'next';
import DocumentsClient from './DocumentsClient';

export const metadata: Metadata = {
  title: 'Business Foundations Pack — 10 Documents for UK Sole Traders | Foundationary',
  description: 'Complete pack of 10 bespoke business documents for UK sole traders. Client contracts, GDPR policies, invoices and more. £79 one-time, delivered fast.',
};

export default function DocumentsPage() {
  return <DocumentsClient />;
}
