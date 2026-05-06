import { action } from "./_generated/server";
import { v } from "convex/values";
import Stripe from "stripe";

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set. Add it in your Convex dashboard: Settings → Environment Variables");
    }
    stripe = new Stripe(key, {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return stripe;
}

export const createPaymentIntent = action({
  args: {
    amount: v.number(),
    currency: v.string(),
    metadata: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (_ctx, args) => {
    const client = getStripe();
    const pi = await client.paymentIntents.create({
      amount: args.amount,
      currency: args.currency,
      metadata: args.metadata,
      automatic_payment_methods: { enabled: true },
    });
    return { clientSecret: pi.client_secret };
  },
});