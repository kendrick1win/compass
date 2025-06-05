import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
console.log("Stripe key exists:", !!key); // Remove this after debugging

if (!key) throw new Error("STRIPE_SECRET_KEY is not defined");

export const stripe = new Stripe(key, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});
