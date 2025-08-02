import Stripe from 'stripe';

// ====== hardcoded secret (replace with your real key) ======
const STRIPE_SECRET_KEY = 'sk_test_YOUR_SECRET_KEY_HERE';
// ==========================================================

if (!STRIPE_SECRET_KEY) {
  throw new Error('Stripe secret key missing in code');
}

const stripeClient = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16', // you can bump if needed per Stripe changelog
});

export default stripeClient;
