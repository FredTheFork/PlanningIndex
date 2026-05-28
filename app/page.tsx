import Hero from '@/components/sections/Hero';
import SocialProof from '@/components/sections/SocialProof';
import Problem from '@/components/sections/Problem';
import WhatYouGet from '@/components/sections/WhatYouGet';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';
import CTABanner from '@/components/sections/CTABanner';

export const metadata = {
  title: 'Foundationary — Business Foundations. Fast.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Problem />
      <WhatYouGet />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTABanner />
    </>
  );
}
