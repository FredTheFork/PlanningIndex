import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Marketing pages
import WhatsIncludedPage from './pages/WhatsIncludedPage';
import PricingPage from './pages/PricingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AdditionalServicesPage from './pages/AdditionalServicesPage';
import AboutPage from './pages/AboutPage';

// Public flow pages
import CheckoutPage from './pages/Checkout';
import { Success } from './pages/Success';

// Personal area pages
import PersonalLayout from './pages/personal/PersonalLayout';
import PersonalOverview from './pages/personal/PersonalOverview';
import PersonalIntake from './pages/personal/PersonalIntake';
import PersonalStatus from './pages/personal/PersonalStatus';
import PersonalDocuments from './pages/personal/PersonalDocuments';

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
  return (
    <Router>
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

        {/* Checkout flow (public) */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<Success />} />

        {/* Personal area (protected) */}
        <Route
          path="/personal"
          element={
            <ProtectedRoute>
              <PersonalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PersonalOverview />} />
          <Route path="intake" element={<PersonalIntake />} />
          <Route path="status" element={<PersonalStatus />} />
          <Route path="documents" element={<PersonalDocuments />} />
        </Route>
      </Routes>
    </Router>
  );
}
