import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, FileText, ArrowRight } from 'lucide-react';
import { stripeProducts, stripeMode } from '../stripe-config';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const product = stripeProducts[0];

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase URL not configured. Check your environment variables.');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: stripeMode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/checkout`,
        }),
      });

      if (response.status === 404 || response.type === 'opaque') {
        throw new Error('The checkout service is starting up. Please wait 30 seconds and try again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Checkout failed (status ${response.status})`);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const includedItems = [
    'Bespoke Client Contract',
    'Terms & Conditions',
    'GDPR Privacy Policy',
    'Professional Bio',
    'Elevator Pitch (3 versions)',
    'LinkedIn Profile Script',
    'Professional Invoice Template',
    'New Client Welcome Emails (x3)',
    'Late Payment Letters (x3)',
    'Service Description Sheets',
  ];

  return (
    <div className="min-h-screen bg-off-white pt-24 pb-16">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-inter font-bold text-navy text-3xl mb-3">
            Complete Your Purchase
          </h1>
          <p className="font-inter text-secondary-text text-lg">
            Your business foundations, delivered within 24 hours of completing your intake form.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Order summary */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg border border-border p-8">
              <h2 className="font-inter font-bold text-navy text-xl mb-1">
                {product.name}
              </h2>
              <p className="font-inter text-secondary-text text-sm mb-6">
                Complete business foundations pack for UK sole traders
              </p>

              <div className="border-t border-border pt-6 mb-6">
                <h3 className="font-inter font-semibold text-navy text-sm mb-3">
                  What's included:
                </h3>
                <ul className="space-y-2">
                  {includedItems.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <FileText size={16} className="text-medium-blue mt-0.5 shrink-0" />
                      <span className="font-inter text-sm text-dark-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="font-inter font-semibold text-navy">Total</span>
                <span className="font-inter font-bold text-navy text-2xl">
                  {product.currencySymbol}{product.price.toFixed(2)}
                </span>
              </div>
              <p className="font-inter text-secondary-text text-xs mt-1">One-time payment. No recurring charges.</p>
            </div>
          </div>

          {/* Checkout action */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-border p-8 sticky top-24">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-success" />
                  <span className="font-inter font-medium text-sm text-dark-text">Secure checkout via Stripe</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-medium-blue" />
                  <span className="font-inter font-medium text-sm text-dark-text">24-hour delivery after intake</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="font-inter text-sm text-danger">{error}</p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full font-inter font-semibold text-white bg-navy rounded-md hover:bg-medium-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ padding: '14px 24px', fontSize: '1rem' }}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    Pay {product.currencySymbol}{product.price.toFixed(2)}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="font-inter text-secondary-text text-xs mt-4 text-center">
                No account needed. You'll receive a login link after payment.
              </p>

              <div className="mt-6 pt-4 border-t border-border">
                <Link
                  to="/pricing"
                  className="font-inter text-medium-blue text-sm hover:underline"
                >
                  View full pricing details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
