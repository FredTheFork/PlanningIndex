import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout Cancelled',
  robots: { index: false, follow: false },
};

export default function CheckoutCancelledLayout({ children }: { children: React.ReactNode }) {
  return children;
}
