import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Layout from './components/Layout';
import { Header } from './components/layout/Header';

// Marketing pages
import WhatsIncludedPage from './pages/WhatsIncludedPage';
import PricingPage from './pages/PricingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AdditionalServicesPage from './pages/AdditionalServicesPage';
import AboutPage from './pages/AboutPage';

// App / Stripe flow pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Products } from './pages/Products';
import { Dashboard } from './pages/Dashboard';
import { Success } from './pages/Success';

// Home sections
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
        <h1 className="font-bold text-2xl">{title}</h1>
        <p className="mt-3 text-gray-500">Coming soon.</p>
      </div>
    </div>
  );
}

export default function App() {
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
    <Router>
      <Header />

      <Routes>
        {/* Marketing site */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/whats-included" element={<WhatsIncludedPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/additional-services" element={<AdditionalServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<PlaceholderPage title="FAQ" />} />
        </Route>

        {/* Auth / Stripe flow */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}
