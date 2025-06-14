import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/custom/header";
import { Button } from "@/components/ui/button";
import DailyReading from "./(components)/DailyReading";
import SubscribeCard from "../(components)/subscription/subscribe";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const userEmail = data.user.email || "";
  const displayName = userEmail.split("@")[0];

  // Check if the user has a row in the profile table
  const { data: profileData, error: profileError } = await supabase
    .from("profile")
    .select("id")
    .eq("user_id", data.user.id)
    .single();

  const hasProfile = !profileError && profileData;

  // Check if the user is subscribed in the subscriptions table
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false }); // Get most recent first

  const isSubscribed =
    !subscriptionError &&
    subscriptionData &&
    subscriptionData.length > 0 &&
    subscriptionData[0]?.status === "active";

  const canAccessPremiumFeatures = hasProfile && isSubscribed;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mt-12 mb-8">
          Welcome, {displayName}!
        </h1>
        <div className="flex flex-col items-center gap-4 w-full">
          <Link href="/dashboard/profile" className="w-full max-w-4xl">
            <Button className="w-full py-6 text-lg">
              Go To Your Free Reading
            </Button>
          </Link>
          
          {canAccessPremiumFeatures ? (
            <>
              <Link href="/dashboard/pair" className="w-full max-w-4xl">
                <Button className="w-full py-6 text-lg">Pair Reading</Button>
              </Link>
              <DailyReading />
            </>
          ) : (
            <>
              <Button className="w-full max-w-4xl py-6 text-lg" disabled>
                Pair Reading (Premium Only)
              </Button>
              <Button className="w-full py-6 text-lg" disabled>
                Daily Reading (Premium Only)
              </Button>
              {!hasProfile && (
                <p className="text-center text-red-500">
                  Please complete your profile to access premium features
                </p>
              )}
              {hasProfile && !isSubscribed && (
                <SubscribeCard userId={data.user.id} />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
