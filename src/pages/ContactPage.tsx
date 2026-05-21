import { useState } from 'react';
import { Mail, Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-inter font-semibold text-medium-blue uppercase block mb-3"
      style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  );
}

function PageHeader() {
  return (
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
          GET IN TOUCH
        </span>
        <h1
          className="font-inter font-extrabold text-white mt-3"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.2 }}
        >
          Let's talk about your business.
        </h1>
        <p
          className="font-inter font-normal mx-auto mt-4 leading-[1.7]"
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 620,
          }}
        >
          Have questions about Foundationary? Need to discuss your specific situation? We're here to help. Reach out directly and we'll get back to you promptly.
        </p>
      </div>
    </section>
  );
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function ContactForm() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          recipientEmail: 'foundationarybusiness@gmail.com',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Failed to send your message. Please try again or contact us directly at foundationarybusiness@gmail.com');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto" style={{ maxWidth: 900 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Direct Contact Info */}
          <div className="bg-off-white rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)' }}
              >
                <Mail size={20} />
              </div>
              <h3 className="font-inter font-semibold text-navy" style={{ fontSize: '1rem' }}>
                Email
              </h3>
            </div>
            <p className="font-inter text-secondary-text break-words" style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
              foundationarybusiness@gmail.com
            </p>
            <p className="font-inter text-secondary-text mt-2" style={{ fontSize: '0.85rem' }}>
              We aim to respond within 24 hours.
            </p>
          </div>

          {/* Phone */}
          <div className="bg-off-white rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #1B3F7A, #2C68C4)' }}
              >
                <Phone size={20} />
              </div>
              <h3 className="font-inter font-semibold text-navy" style={{ fontSize: '1rem' }}>
                Phone
              </h3>
            </div>
            <p className="font-inter text-secondary-text" style={{ fontSize: '0.95rem' }}>
              +44 7377 203834
            </p>
            <p className="font-inter text-secondary-text mt-2" style={{ fontSize: '0.85rem' }}>
              Best for urgent enquiries
            </p>
          </div>

          {/* Response Time */}
          <div className="bg-off-white rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #38A169, #48BB78)' }}
              >
                <MessageCircle size={20} />
              </div>
              <h3 className="font-inter font-semibold text-navy" style={{ fontSize: '1rem' }}>
                Response Time
              </h3>
            </div>
            <p className="font-inter text-secondary-text" style={{ fontSize: '0.95rem' }}>
              Typically within 24 hours
            </p>
            <p className="font-inter text-secondary-text mt-2" style={{ fontSize: '0.85rem' }}>
              We read and respond to every enquiry.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-off-white rounded-3xl p-8 md:p-12">
          <h2 className="font-inter font-bold text-dark-text mb-1" style={{ fontSize: '1.5rem' }}>
            Send us a message
          </h2>
          <p className="font-inter text-secondary-text mb-8" style={{ fontSize: '0.95rem' }}>
            Fill in the form below and we'll get back to you as soon as possible.
          </p>

          {submitted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="font-inter text-success font-medium">
                Thank you! Your message has been sent. We'll be in touch shortly.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="font-inter text-danger font-medium" style={{ fontSize: '0.9rem' }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-inter font-medium text-dark-text mb-2" style={{ fontSize: '0.9rem' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue"
                  style={{ fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label className="block font-inter font-medium text-dark-text mb-2" style={{ fontSize: '0.9rem' }}>
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue"
                  style={{ fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-inter font-medium text-dark-text mb-2" style={{ fontSize: '0.9rem' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+44 7xxx xxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue"
                  style={{ fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label className="block font-inter font-medium text-dark-text mb-2" style={{ fontSize: '0.9rem' }}>
                  Subject
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue bg-white"
                  style={{ fontSize: '0.95rem' }}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Enquiry</option>
                  <option value="pricing">Pricing Question</option>
                  <option value="customisation">Customisation Request</option>
                  <option value="support">Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-inter font-medium text-dark-text mb-2" style={{ fontSize: '0.9rem' }}>
                Your Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Tell us what's on your mind..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue resize-none"
                style={{ fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-inter font-bold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors disabled:opacity-50 py-3"
              style={{ fontSize: '1rem' }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Expectations() {
  return (
    <section className="bg-off-white py-20 px-6">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <SectionLabel>WHAT TO EXPECT</SectionLabel>
        <h2
          className="font-inter font-bold text-dark-text"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}
        >
          We keep things simple.
        </h2>

        <div className="flex flex-col gap-4 mt-8">
          {[
            { title: 'Fast response', desc: 'Most enquiries receive a response within 24 hours.' },
            { title: 'Honest answers', desc: 'If we can\'t help, we\'ll tell you. If we can, we will.' },
            { title: 'No spam', desc: 'We won\'t add you to mailing lists or sell your details.' },
            { title: 'Direct', desc: 'You\'re talking to the team, not a support bot.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-5 border border-border">
              <h3 className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.95rem' }}>
                {item.title}
              </h3>
              <p className="font-inter text-secondary-text mt-1" style={{ fontSize: '0.9rem' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHeader />
      <ContactForm />
      <Expectations />
    </>
  );
}
