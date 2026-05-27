import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './hooks/components/Layout';
import { ProtectedRoute } from './hooks/components/ProtectedRoute';

// Marketing pages
import WhatsIncludedPage from './pages/WhatsIncludedPage';
import PricingPage from './pages/PricingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AdditionalServicesPage from './pages/AdditionalServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';

// Public flow pages
import CheckoutPage from './pages/Checkout';
import { Success } from './pages/Success';
import LoginPage from './pages/Login';
import AuthCallback from './pages/AuthCallback';

// Personal area pages
import PersonalLayout from './pages/personal/PersonalLayout';
import PersonalOverview from './pages/personal/PersonalOverview';
import PersonalIntake from './pages/personal/PersonalIntake';
import PersonalStatus from './pages/personal/PersonalStatus';
import PersonalDocuments from './pages/personal/PersonalDocuments';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClientDetail from './pages/admin/AdminClientDetail';

// Home sections
import Hero from './hooks/components/Hero';
import SocialProof from './hooks/components/SocialProof';
import Problem from './hooks/components/Problem';
import WhatYouGet from './hooks/components/WhatYouGet';
import HowItWorks from './hooks/components/HowItWorks';
import Testimonials from './hooks/components/Testimonials';
import Pricing from './hooks/components/Pricing';
import CTABanner from './hooks/components/CTABanner';

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
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />
        </Route>

        {/* Auth flow (public) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

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
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/:userId" element={<AdminClientDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}
