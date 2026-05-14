import React, { useState } from 'react';
import { StripeProduct } from '../../stripe-config';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface ProductCardProps {
  product: StripeProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please sign in to make a purchase');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/products`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {product.name}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {product.description}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-bold text-gray-900">
          {product.currencySymbol}{product.price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500 capitalize">
          {product.mode === 'payment' ? 'One-time' : 'Monthly'}
        </span>
      </div>
      
      <Button
        onClick={handlePurchase}
        loading={loading}
        className="w-full"
      >
        {product.mode === 'payment' ? 'Buy Now' : 'Subscribe'}
      </Button>
    </div>
  );
}