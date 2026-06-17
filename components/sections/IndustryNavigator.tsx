'use client';

import Link from 'next/link';
import { Camera, Users, Briefcase, HardHat, FolderOpen } from 'lucide-react';

const industries = [
  {
    label: 'Photographers',
    href: '/for/photographers',
    icon: Camera,
    description: 'Licensing agreements, model releases, delivery terms, and editing briefs.',
    price: 'From £249',
  },
  {
    label: 'Coaches',
    href: '/for/coaches',
    icon: Users,
    description: 'Coaching agreements, session terms, ethics policies, and CPD tracking.',
    price: 'From £199',
  },
  {
    label: 'Consultants',
    href: '/for/consultants',
    icon: Briefcase,
    description: 'Consulting agreements, deliverables specs, NDAs, and handover protocols.',
    price: 'From £199',
  },
  {
    label: 'Contractors',
    href: '/for/contractors',
    icon: HardHat,
    description: 'H&S policy, risk assessments, method statements, and CDM compliance.',
    price: 'From £299',
  },
  {
    label: 'General Sole Trader',
    href: '/services',
    icon: FolderOpen,
    description: 'Foundation documents, website copy, and social media for any profession.',
    price: 'From £79',
  },
];

export default function IndustryNavigator() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 1200 }}>
        <div className="text-center mb-12">
          <span
            className="font-inter font-semibold text-medium-blue uppercase block mb-3"
            style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
          >
            WHO IT'S FOR
          </span>
          <h2
            className="font-inter font-bold text-dark-text"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
          >
            Find what fits your profession
          </h2>
          <p
            className="font-inter font-normal text-secondary-text mt-3 mx-auto leading-[1.7]"
            style={{ fontSize: '1rem', maxWidth: 520 }}
          >
            Industry-specific documents designed for how you actually work. Click your profession to see exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <Link
                key={industry.label}
                href={industry.href}
                className="group bg-off-white rounded-2xl p-6 border-2 border-transparent hover:border-medium-blue hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)' }}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '1.05rem' }}>
                  {industry.label}
                </h3>
                <p
                  className="font-inter font-normal text-secondary-text mt-2 leading-[1.5]"
                  style={{ fontSize: '0.85rem' }}
                >
                  {industry.description}
                </p>
                <span
                  className="font-inter font-bold text-navy mt-4"
                  style={{ fontSize: '0.9rem' }}
                >
                  {industry.price}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
