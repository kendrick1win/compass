"use server";
import { stripe } from "@/lib/stripe/stripe";

type Props = {
  userId: string;
};

export const subscribeAction = async ({ userId }: Props) => {
  // Get the base URL with fallback
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  // Ensure the URL has a protocol
  const fullBaseUrl = baseUrl.startsWith("http")
    ? baseUrl
    : `https://${baseUrl}`;

  const { url } = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    mode: "subscription",
    success_url: `${fullBaseUrl}/dashboard?success=true`,
    cancel_url: `${fullBaseUrl}/dashboard?canceled=true`,
  });

  return url;
};
