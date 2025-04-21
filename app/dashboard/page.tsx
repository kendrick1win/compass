import { formatDate } from "@/lib/utils";
import Sidebar from "@/components/dashboard/Sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/custom/header";

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
    </>
  );
}
