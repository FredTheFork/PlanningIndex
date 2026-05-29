'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact';
}

export default function NewsletterSignup({ variant = 'default' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not configured');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/send-newsletter-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          source: variant === 'compact' ? 'footer' : 'blog-page',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      console.error('Newsletter signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-navy/5 border border-navy/10 rounded-lg p-4">
        {submitted ? (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle size={18} />
            <span className="font-inter font-medium" style={{ fontSize: '0.9rem' }}>
              Thanks! Check your inbox for confirmation.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded font-inter focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue"
              style={{ fontSize: '0.85rem' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="font-inter font-semibold text-white bg-navy rounded hover:bg-medium-blue transition-colors disabled:opacity-50"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {loading ? '...' : 'Join'}
            </button>
          </form>
        )}
        {error && (
          <p className="font-inter text-danger mt-2" style={{ fontSize: '0.8rem' }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-navy to-medium-blue rounded-2xl p-8 md:p-10">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <Mail size={24} className="text-white" />
        </div>
        <div>
          <h3 className="font-inter font-bold text-white mb-1" style={{ fontSize: '1.25rem' }}>
            Get Business Tips for UK Sole Traders
          </h3>
          <p className="font-inter text-white/80" style={{ fontSize: '0.95rem' }}>
            Practical advice, legal updates, and resources — delivered occasionally. No spam.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-success" />
          <span className="font-inter font-medium text-white" style={{ fontSize: '0.95rem' }}>
            Thanks for subscribing! Check your inbox to confirm.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 border border-white/30 bg-white/10 rounded-lg font-inter text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white"
            style={{ fontSize: '0.95rem' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="font-inter font-semibold text-navy bg-white rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 px-6"
            style={{ fontSize: '0.95rem' }}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}

      {error && (
        <p className="font-inter text-red-300 mt-3" style={{ fontSize: '0.85rem' }}>
          {error}
        </p>
      )}

      <p className="font-inter text-white/60 mt-4" style={{ fontSize: '0.8rem' }}>
        Unsubscribe anytime. No spam, ever.
      </p>
    </div>
  );
}
