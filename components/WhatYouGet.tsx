import Link from 'next/link';

const documents = [
  { num: '01', title: 'Bespoke Client Contract', desc: 'UK law-compliant service agreement covering scope, payment, IP, termination, and dispute resolution. Specific to your services.' },
  { num: '02', title: 'Terms & Conditions', desc: 'Your complete operating rulebook — payment terms, late payment rights (Late Payment Act 1998), refunds, cancellations.' },
  { num: '03', title: 'GDPR Privacy Policy', desc: 'ICO-compliant and specific to your actual data activities. Not a generic template — built around what you actually collect and why.' },
  { num: '04', title: 'Professional Bio', desc: '150-word website version and 50-word social version, written in your voice, that makes you sound exactly as good as you are.' },
  { num: '05', title: 'Elevator Pitch (3 Versions)', desc: "30-second, 2-minute, and written versions. Never stumble over 'so what do you do?' again." },
  { num: '06', title: 'LinkedIn Profile Script', desc: 'Headline, full About section, and Featured section — keyword-optimised and ready to copy-paste.' },
  { num: '07', title: 'Professional Invoice Template', desc: 'UK-formatted, VAT-ready, with your branding and the correct statutory late payment interest notice.' },
  { num: '08', title: 'New Client Welcome Emails (×3)', desc: "The onboarding sequence that makes every client feel like they've hired a professional firm, not a one-person business." },
  { num: '09', title: 'Late Payment Letters (×3)', desc: 'Friendly reminder → formal demand → Letter Before Action. All legally sound. All ready to send.' },
  { num: '10', title: 'Service Description Sheets', desc: "One-page professional breakdown per service — what's in, what's out, who it's for, what they get." },
];

export default function WhatYouGet() {
  return (
    <section id="pack" className="bg-off-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <span className="text-xs font-semibold text-medium-blue uppercase tracking-wider block mb-3">
          THE PACK
        </span>
        <h2 className="text-3xl lg:text-4xl font-bold text-dark-text">
          10 Documents. Built Around Your Business.
        </h2>
        <p className="text-lg text-secondary-text mt-3 leading-relaxed">
          Every document is generated specifically for your business — your services, your payment terms, your clients, your voice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14">
          {documents.map((doc) => (
            <div
              key={doc.num}
              className="bg-white rounded-xl border border-border p-6 flex gap-4 hover:border-medium-blue hover:shadow-lg transition-all duration-200"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
                {doc.num}
              </div>
              <div>
                <h3 className="font-semibold text-dark-text text-base">
                  {doc.title}
                </h3>
                <p className="text-sm text-secondary-text mt-1.5 leading-relaxed">
                  {doc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/whats-included"
            className="inline-block font-semibold text-navy border-2 border-navy rounded-lg px-7 py-3 hover:bg-off-white transition-colors"
          >
            See Everything That&apos;s Included →
          </Link>
        </div>
      </div>
    </section>
  );
}
