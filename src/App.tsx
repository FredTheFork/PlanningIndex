import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import WhatsIncludedPage from './pages/WhatsIncludedPage';
import PricingPage from './pages/PricingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Problem from './components/Problem';
import WhatYouGet from './components/WhatYouGet';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTABanner from './components/CTABanner';

function HomePage() {
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

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-inter font-bold text-navy" style={{ fontSize: '2rem' }}>{title}</h1>
        <p className="font-inter font-normal text-secondary-text mt-3" style={{ fontSize: '1.05rem' }}>Coming soon.</p>
      </div>
    </div>
  );
}

function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <BrowserRouter>
      <div id="scroll-progress" style={{ width: `${progress}%` }} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/whats-included" element={<WhatsIncludedPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/additional-services" element={<PlaceholderPage title="Additional Services" />} />
          <Route path="/about" element={<PlaceholderPage title="About" />} />
          <Route path="/faq" element={<PlaceholderPage title="FAQ" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
