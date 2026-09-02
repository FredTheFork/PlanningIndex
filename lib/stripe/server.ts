import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from './config';

let cachedClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!cachedClient) {
    cachedClient = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return cachedClient;
}
