import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/custom/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DailyReading from "./(components)/DailyReading";
import SubscribeCard from "../(components)/subscription/subscribe";
import { AIPrompts } from "@/components/ui/ai-prompts";
import { BaziChart } from "./profile/(components)/BaziChart";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const userEmail = data.user.email || "";
  const displayName = userEmail.split("@")[0];

  // Check if the user has a row in the profile table with force refresh
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, chinese_characters")
    .eq("user_id", data.user.id);

  // A user has a profile if we got data back and it's not empty
  const hasProfile = !profileError && profileData && profileData.length > 0;
  const chineseCharacters = hasProfile ? profileData[0]?.chinese_characters : null;

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
          {!hasProfile ? (
            <Link href="/dashboard/profile" className="w-full max-w-4xl">
              <Button className="w-full py-6 text-lg">
                Get Your Free Reading
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/dashboard/profile" className="w-full max-w-4xl">
                <Button className="w-full py-6 text-lg">
                  View Your Free Reading
                </Button>
              </Link>
              
              {/* Combined BaZi Chart and AI Prompts */}
              {chineseCharacters && (
                <div className="w-full max-w-4xl">
                  <Card className="border-primary/20">
                    <CardHeader className="bg-primary/3 text-center">
                      <CardTitle className="text-2xl font-semibold">
                        Your BaZi Chart & AI Insights
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Your Four Pillars of Destiny and tools for deeper analysis
                      </p>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Chart Section */}
                      <div>
                        <BaziChart chineseCharacters={chineseCharacters} />
                      </div>
                      
                      {/* AI Prompts Section */}
                      <div className="pt-4 border-t border-border/50">
                        <AIPrompts 
                          chineseCharacters={chineseCharacters}
                          title="Get AI Insights for Your Reading"
                          description="You can use AI tools to ask more about your BaZi chart. Just click Copy Chart and use one of our sample prompts to get started!"
                          embedded={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* AI Prompts Section for users without chart */}
              {!chineseCharacters && (
                <div className="w-full max-w-4xl">
                  <AIPrompts 
                    title="Get AI Insights for Your Reading"
                    description="You can use AI tools to ask more about your BaZi chart. Just click Copy Chart and use one of our sample prompts to get started!"
                  />
                </div>
              )}
              
              {!isSubscribed && (
                <SubscribeCard userId={data.user.id} />
              )}
              
              {isSubscribed && (
                <>
                  <Link href="/dashboard/pair" className="w-full max-w-4xl">
                    <Button className="w-full py-6 text-lg">Pair Reading</Button>
                  </Link>
                  <DailyReading />
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
