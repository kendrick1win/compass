import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/custom/header";
import { Button } from "@/components/ui/button";
import DailyReadingTest from "./(components)/DailyReading";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const userEmail = data.user.email || "";
  const displayName = userEmail.split("@")[0];

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
          <DailyReadingTest />
        </div>
      </main>
    </>
  );
}
