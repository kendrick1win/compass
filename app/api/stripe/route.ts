import { stripe } from "@/lib/stripe/stripe";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SIGNING_KEY!
    );
  } catch (error) {
    console.error("❌ Stripe webhook verification failed:", error);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" &&
    event.data.object.payment_status === "paid"
  ) {
    console.log("✅ Payment completed");

    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;
    const userId = metadata?.userId;

    if (!userId) {
      console.warn("⚠️ Missing userId in metadata");
      return new NextResponse("Missing metadata", { status: 400 });
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert or update subscription record
    const { error } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: userId,
        stripe_subscription_id: session.subscription as string,
        stripe_customer_id: session.customer as string,
        status: "active",
        current_period_end: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days from now
        created_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Supabase update failed:", error);
      return new NextResponse("DB error", { status: 500 });
    }

    //console.log("✅ Subscription created/updated successfully");
  }

  revalidatePath("/", "layout");
  return new NextResponse(null, { status: 200 });
}
