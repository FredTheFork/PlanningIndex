'use client';

import { useState, useEffect } from 'react';
import { X, Download, Mail } from 'lucide-react';

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAgain, setShowAgain] = useState(true);

  useEffect(() => {
    // Check if user has already dismissed the popup
    const dismissed = localStorage.getItem('exit-intent-dismissed');
    if (dismissed) {
      setShowAgain(false);
      return;
    }

    let triggerCount = 0;
    const maxTriggers = 1; // Only trigger once per session

    const handleMouseLeave = (e: MouseEvent) => {
      if (triggerCount >= maxTriggers || !showAgain) return;

      // Detect when mouse leaves viewport from top (exit intent)
      if (e.clientY <= 0) {
        setShowPopup(true);
        triggerCount++;
      }
    };

    // Only start listening after user has been on page for 5 seconds
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showAgain]);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem('exit-intent-dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      return;
    }

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not configured');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/send-lead-magnet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send checklist');
      }

      setSubmitted(true);
      localStorage.setItem('exit-intent-dismissed', 'true');

      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Lead magnet signup error:', error);
      alert('Failed to send checklist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showPopup || !showAgain) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {submitted ? (
          // Success state
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download size={32} className="text-success" />
            </div>

            <h2 className="font-inter font-bold text-navy text-2xl mb-3">
              Check Your Inbox!
            </h2>

            <p className="font-inter text-secondary-text leading-relaxed">
              Your free UK Sole Trader Legal Checklist is on its way to <strong className="text-navy">{email}</strong>.
              <br />
              <span className="text-sm">Please check your spam folder if you don't see it within 5 minutes.</span>
            </p>

            <div className="mt-8 p-4 bg-off-white rounded-lg border border-border">
              <p className="font-inter text-sm text-secondary-text">
                <strong className="text-navy">BONUS:</strong> While you wait, complete your Business Foundations Pack for just £79 and get all 10 professional documents delivered within 24 hours.
              </p>
              <a
                href="/checkout"
                className="inline-block mt-4 font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors"
                style={{ padding: '12px 24px', fontSize: '0.95rem' }}
              >
                Get My Documents — £79
              </a>
            </div>
          </div>
        ) : (
          // Initial lead capture form
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-medium-blue p-8 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Download size={20} className="text-white" />
                </div>
                <span className="font-inter font-semibold text-white text-sm uppercase tracking-wide">
                  Free Download
                </span>
              </div>

              <h2 className="font-inter font-bold text-white text-2xl mb-2">
                UK Sole Trader Legal Checklist
              </h2>

              <p className="font-inter text-white/90 leading-relaxed">
                The 12 essential legal documents every UK sole trader needs — and why most freelancers are missing at least 5
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <ul className="mb-6 space-y-2">
                {[
                  'Client contract checklist',
                  'GDPR compliance essentials',
                  'Invoice requirements',
                  'Data protection basics',
                  'Terms you must include',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 font-inter text-sm text-secondary-text">
                    <span className="text-success font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="exit-email" className="block font-inter font-medium text-navy mb-2 text-sm">
                    Your Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="exit-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-medium-blue focus:border-medium-blue"
                      style={{ fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-inter font-bold text-navy bg-white border-2 border-navy rounded-lg hover:bg-navy hover:text-white transition-colors disabled:opacity-50 py-3"
                  style={{ fontSize: '1rem' }}
                >
                  {loading ? 'Sending...' : 'Get Free Checklist'}
                </button>
              </form>

              <p className="font-inter text-xs text-gray-500 text-center mt-4">
                No spam, ever. Unsubscribe anytime.
              </p>

              {/* Quick exit */}
              <button
                onClick={handleClose}
                className="w-full mt-4 font-inter text-sm text-secondary-text hover:text-navy transition-colors"
              >
                No thanks, I'll figure it out myself
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
