'use client';

import { useState } from 'react';
import { Mail, Linkedin, Twitter, Send, Briefcase, LifeBuoy, MessageCircle, Handshake } from 'lucide-react';
import { PageHero, Input, Select, Textarea, Button, useToast } from '@/components/ui';

const contactReasons = [
  { value: 'sales', label: 'Sales', icon: Briefcase, desc: 'Questions about plans, pricing, or setting up an account.' },
  { value: 'support', label: 'Support', icon: LifeBuoy, desc: 'Help with your account, billing, or using the platform.' },
  { value: 'general', label: 'General Enquiries', icon: MessageCircle, desc: 'Anything else you would like to ask us.' },
  { value: 'partnerships', label: 'Partnerships', icon: Handshake, desc: 'Integration, API, or business partnership opportunities.' },
];

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Please enter your name.';
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!reason) newErrors.reason = 'Please select a reason for contacting us.';
    if (!message.trim()) newErrors.message = 'Please enter a message.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    toast({ variant: 'success', title: 'Message sent!', message: 'We\'ll get back to you within 24 hours.' });
    setName('');
    setEmail('');
    setCompany('');
    setReason('');
    setMessage('');
    setErrors({});
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact PlanningIndex"
        subtitle="Have a question about PlanningIndex? We'd love to hear from you. Send us a message and we'll get back to you within 24 hours."
      />

      {/* Contact reason categories */}
      <section className="bg-white py-16 px-6 border-b border-primary-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactReasons.map((item) => (
              <div
                key={item.value}
                className="rounded-xl border border-primary-200 bg-white p-5 hover:border-primary-300 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
                onClick={() => setReason(item.value)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 mb-3">
                  <item.icon className="text-accent-700" size={20} />
                </div>
                <h3 className="font-sans font-semibold text-primary-900 text-sm mb-1">{item.label}</h3>
                <p className="font-sans text-primary-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-sans font-semibold text-primary-900 text-h3 mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Input
                  label="Your name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  error={errors.name}
                  required
                />
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  error={errors.email}
                  required
                />
                <Input
                  label="Company (optional)"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company name"
                />
                <Select
                  label="Reason"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Select a reason"
                  error={errors.reason}
                  required
                >
                  {contactReasons.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </Select>
                <Textarea
                  label="Message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help..."
                  error={errors.message}
                  required
                />
                <Button
                  type="submit"
                  loading={loading}
                  rightIcon={!loading ? <Send size={16} /> : undefined}
                >
                  Send Message
                </Button>
              </form>
            </div>

            <div className="lg:pl-8">
              <h2 className="font-sans font-semibold text-primary-900 text-h3 mb-6">
                Other ways to reach us
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                    <Mail className="text-accent-700" size={20} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-primary-900 text-sm mb-1">Email</h3>
                    <a href="mailto:hello@planningindex.co.uk" className="font-sans text-primary-500 hover:text-accent-600 transition-colors text-sm">
                      hello@planningindex.co.uk
                    </a>
                    <p className="font-sans text-primary-400 mt-1" style={{ fontSize: '0.85rem' }}>
                      We respond within 24 hours, Monday to Friday.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                    <Linkedin className="text-accent-700" size={20} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-primary-900 text-sm mb-1">LinkedIn</h3>
                    <a
                      href="https://www.linkedin.com/company/planningindex"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-primary-500 hover:text-accent-600 transition-colors text-sm"
                    >
                      linkedin.com/company/planningindex
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
                    <Twitter className="text-accent-700" size={20} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-primary-900 text-sm mb-1">Twitter</h3>
                    <a
                      href="https://twitter.com/PlanningIndex"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-primary-500 hover:text-accent-600 transition-colors text-sm"
                    >
                      @PlanningIndex
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-primary-50 rounded-xl border border-primary-100">
                <h3 className="font-sans font-semibold text-primary-900 text-sm mb-2">
                  Already a member?
                </h3>
                <p className="font-sans text-primary-500 text-sm leading-relaxed mb-4">
                  Log in to your account and use the in-app support for faster assistance.
                </p>
                <a
                  href="/login"
                  className="font-sans font-semibold text-accent-600 hover:text-accent-700 transition-colors text-sm"
                >
                  Log In →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
