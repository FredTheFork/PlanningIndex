'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${formState.name}`);
    const body = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    );
    window.location.href = `mailto:foundationarybusiness@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#F0F4FF] rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="font-bold text-[#1B3F7A] text-xl mb-2">Message sent</h3>
        <p className="text-[#5a5a7a]">
          Your email client should have opened with your message. We&apos;ll get
          back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-[#1B3F7A] mb-2"
        >
          Your Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={formState.name}
          onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
          placeholder="Jane Smith"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-transparent transition"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-[#1B3F7A] mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          value={formState.email}
          onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
          placeholder="jane@yourbusiness.co.uk"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-transparent transition"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-[#1B3F7A] mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formState.message}
          onChange={(e) =>
            setFormState((s) => ({ ...s, message: e.target.value }))
          }
          placeholder="Tell us what you need help with..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2C68C4] focus:border-transparent transition resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full font-semibold text-white bg-[#1B3F7A] rounded-lg hover:bg-[#2C68C4] transition-colors px-6 py-4"
      >
        Send Message →
      </button>

      <p className="text-xs text-[#5a5a7a] text-center">
        By submitting this form you agree to us using your details to respond to
        your enquiry. We won&apos;t add you to any mailing list.
      </p>
    </form>
  );
}
