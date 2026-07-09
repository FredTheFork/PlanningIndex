import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo';
import { generateBreadcrumbSchema, generateWebPageSchema, SITE_URL } from '@/lib/seo';
import {
  ClarityStrip,
  ProblemDiagram,
  WhyWeExist,
  ComparisonBlock,
  ProcessTransparency,
  FounderSection,
  DesignPhilosophy,
  WhoItsFor,
  EthicsSection,
  SuccessSection,
  NotLegalService,
  TrustResponsibility,
  LongTermView,
  AboutFinalCTA,
} from '@/components/sections/about';

export const metadata: Metadata = {
  title: 'About | Foundationary - Done-for-You Business Content for UK Sole Traders',
  description: 'Professional foundations for UK sole traders — documents, website copy, and social media posts built around your business. Learn about our mission and approach.',
  keywords: 'Foundationary about, sole trader document service UK, business foundations company, website copy UK, social media posts UK, who we are',
  openGraph: {
    title: 'About Foundationary | Professional Content for UK Sole Traders',
    description: 'We help UK sole traders operate properly with professional documents, website copy, and social media posts — no templates, no solicitors, no complexity.',
    url: `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/og/about.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  const webPage = generateWebPageSchema({
    name: 'About | Foundationary - Done-for-You Business Content for UK Sole Traders',
    description: 'Professional foundations for UK sole traders — documents, website copy, and social media posts built around your business.',
    path: '/about',
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, webPage]} />
      <section
        className="text-center px-6"
        style={{
          padding: '80px 0 72px',
          background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <span
            className="font-inter font-semibold uppercase block"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.7)',
              marginTop: '72px',
            }}
          >
            ABOUT FOUNDATIONARY
          </span>
          <h1
            className="font-inter font-extrabold text-white mt-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
          >
            Professional foundations for businesses that don&apos;t want to wing it.
          </h1>
          <p
            className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 620,
            }}
          >
            Foundationary exists for UK sole traders who want to operate properly — with professional documents, website copy that sounds like them, and social media posts that save hours — without pretending they&apos;re a corporation, hiring a solicitor on retainer, or spending weeks stitching together templates from the internet.
          </p>
          <p
            className="font-inter font-normal mx-auto mt-5 leading-[1.7]"
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 620,
            }}
          >
            This is not a platform. It&apos;s not a tool. It&apos;s a done-for-you service that quietly fixes the operational and presentational gaps most small businesses don&apos;t realise they have — until something goes wrong.
          </p>
        </div>
      </section>
      <ClarityStrip />
      <ProblemDiagram />
      <WhyWeExist />
      <ComparisonBlock />
      <ProcessTransparency />
      <FounderSection />
      <DesignPhilosophy />
      <WhoItsFor />
      <EthicsSection />
      <SuccessSection />
      <NotLegalService />
      <TrustResponsibility />
      <LongTermView />
      <AboutFinalCTA />
    </>
  );
}
