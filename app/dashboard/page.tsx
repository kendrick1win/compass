import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/custom/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const today = new Date();
  const username = "user8729";

  return (
    <>
      <Header />
      Welcome User
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-4">
        <Card className="w-full max-w-md p-6">
          <div className="grid grid-cols-2 gap-4">
            <Button className="aspect-square h-full w-full p-2 flex flex-col items-center justify-center">
              <span className="text-lg font-medium">Free</span>
              <span className="text-lg font-medium">Reading</span>
            </Button>
            <Button className="aspect-square h-full w-full p-2 flex flex-col items-center justify-center">
              <span className="text-lg font-medium">Daily</span>
              <span className="text-lg font-medium">Reading</span>
            </Button>
            <Button className="aspect-square h-full w-full p-2 flex flex-col items-center justify-center">
              <span className="text-lg font-medium">Pair</span>
              <span className="text-lg font-medium">Reading</span>
            </Button>
            <Button className="aspect-square h-full w-full p-2 flex flex-col items-center justify-center">
              <span className="text-lg font-medium">Ask and</span>
              <span className="text-lg font-medium">Receive</span>
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
