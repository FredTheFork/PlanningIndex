import type { Metadata } from 'next';
import SocialMediaClient from './SocialMediaClient';

export const metadata: Metadata = {
  title: 'Social Media Starter Pack — Done-For-You Posts for UK Sole Traders | Foundationary',
  description: 'Done-for-you social media posts for UK sole traders. Educational, promotional, and trust-building content. From £20 for 5 posts.',
};

export default function SocialMediaPage() {
  return <SocialMediaClient />;
}
