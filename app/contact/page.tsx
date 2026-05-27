import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, Clock } from 'lucide-react';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Foundationary - Get in Touch',
  description: 'Contact Foundationary for questions about business documents for UK sole traders. Email, phone, and contact form available.',
  keywords: [
    'contact Foundationary',
    'sole trader documents enquiry',
    'business documents UK contact',
    'Foundationary support',
    'freelancer document service contact',
  ],
  openGraph: {
    title: 'Contact Foundationary - Get in Touch',
    description: 'Have a question? Get in touch and we\'ll respond within 24 hours.',
    url: 'https://foundationary.vercel.app/contact',
    images: [{ url: '/og-contact.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="text-center px-6 py-20"
        style={{
          background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)',
        }}
      >
        <div className="mx-auto max-w-[800px]">
          <span className="text-sm font-semibold uppercase tracking-widest text-white/70 block mb-3">
            CONTACT US
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-5 text-lg text-white/90 max-w-[560px] mx-auto">
            Have a question before you order? Need to know if Foundationary is
            right for your situation? We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Details + Form */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-16">
          {/* Left: contact info */}
          <div>
            <h2 className="font-bold text-[#1a1a2e] text-2xl mb-8">
              Contact Details
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F0F4FF] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#2C68C4]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1B3F7A] mb-1">Email</div>
                  <a
                    href="mailto:foundationarybusiness@gmail.com"
                    className="text-[#2C68C4] hover:text-[#1B3F7A] transition-colors"
                  >
                    foundationarybusiness@gmail.com
                  </a>
                  <p className="text-[#5a5a7a] text-sm mt-1">
                    Best for detailed questions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F0F4FF] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#2C68C4]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1B3F7A] mb-1">Phone</div>
                  <a
                    href="tel:+447377203834"
                    className="text-[#2C68C4] hover:text-[#1B3F7A] transition-colors"
                  >
                    +44 7377 203834
                  </a>
                  <p className="text-[#5a5a7a] text-sm mt-1">
                    Available Monday–Friday, 9am–5pm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F0F4FF] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#2C68C4]" />
                </div>
                <div>
                  <div className="font-semibold text-[#1B3F7A] mb-1">
                    Response Time
                  </div>
                  <p className="text-[#1a1a2e]">Within 24 hours</p>
                  <p className="text-[#5a5a7a] text-sm mt-1">
                    Usually much faster on weekdays
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-[#F0F4FF] rounded-xl p-6">
              <h3 className="font-semibold text-[#1B3F7A] mb-3">
                Common reasons to get in touch
              </h3>
              <ul className="space-y-2 text-[#5a5a7a] text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#2C68C4] font-bold">·</span>
                  <span>Checking if Foundationary is right for your type of business</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2C68C4] font-bold">·</span>
                  <span>Questions about what&apos;s included in the pack</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2C68C4] font-bold">·</span>
                  <span>Questions about add-on services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2C68C4] font-bold">·</span>
                  <span>Post-purchase support on your documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2C68C4] font-bold">·</span>
                  <span>Refund requests (7-day guarantee, no questions asked)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: contact form */}
          <div>
            <h2 className="font-bold text-[#1a1a2e] text-2xl mb-8">
              Send a Message
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F0F4FF] py-16 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-bold text-[#1a1a2e] text-3xl mb-4">
            Ready to get your documents?
          </h2>
          <p className="text-[#5a5a7a] text-lg mb-8">
            Don&apos;t need to ask us anything? Go straight to checkout and get
            started today.
          </p>
          <Link
            href="/checkout"
            className="inline-block font-semibold text-white bg-[#1B3F7A] rounded-lg hover:bg-[#2C68C4] transition-colors px-10 py-5"
          >
            Get Started — £79 →
          </Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/faq" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              FAQs →
            </Link>
            <Link href="/how-it-works" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              How It Works →
            </Link>
            <Link href="/pricing" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              Pricing →
            </Link>
            <Link href="/about" className="text-[#2C68C4] hover:text-[#1B3F7A] font-medium">
              About Us →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
