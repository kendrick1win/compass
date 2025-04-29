import { redirect } from "next/navigation";
import ProfileForm from "./(components)/Profile";
import Header from "@/components/custom/header";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <main>
      <Header />
      <ProfileForm />
    </main>
  );
}
