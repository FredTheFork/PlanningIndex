import type { Metadata } from 'next';
import WebsiteCopyClient from './WebsiteCopyClient';

export const metadata: Metadata = {
  title: 'Website Copy Starter Pack — Professional Copy for UK Sole Traders | Foundationary',
  description: 'Professional website copy written in your voice. SEO-aware, ready to paste, delivered in 3-5 days. From £35/page.',
};

export default function WebsiteCopyPage() {
  return <WebsiteCopyClient />;
}
