'use client';

import Link from 'next/link';
import { XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-6">
          <XCircle size={32} className="text-danger-600" />
        </div>

        <h1 className="font-sans font-bold text-primary-900 mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
          Checkout cancelled
        </h1>

        <p className="font-sans text-primary-500 leading-relaxed mb-8" style={{ fontSize: '1.05rem' }}>
          Your checkout was cancelled and no payment was taken. You can choose a different plan or try again whenever you are ready.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/choose-plan">
            <Button rightIcon={<ArrowRight size={16} />}>
              Choose a Plan
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
