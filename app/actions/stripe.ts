"use server";
import { stripe } from "@/lib/stripe/stripe";

type Props = {
  userId: string;
};

export const subscribeAction = async ({ userId }: Props) => {
  // Get the base URL with fallback
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://compass-indol.vercel.app"
      : "http://localhost:3000";

  const fullBaseUrl = baseUrl.startsWith("http")
    ? baseUrl
    : `https://${baseUrl}`;

  const { url } = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE!,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    mode: "payment",
    success_url: `${fullBaseUrl}/dashboard?success=true`,
    cancel_url: `${fullBaseUrl}/dashboard?canceled=true`,
  });

  return url;
};
