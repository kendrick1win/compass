import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MobileNav from "./mobile-nav";

export default async function LandingNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, clicking sign in will redirect to dashboard
  const handleSignInClick = async () => {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  };

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
        <Link href="/" className="text-xl font-light tracking-wider">
          COMPASS
        </Link>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" className="rounded-sm font-normal">
                  DASHBOARD
                </Button>
              </Link>
            ) : (
              <form action={handleSignInClick}>
                <Button
                  variant="ghost"
                  className="rounded-sm font-normal"
                  type="submit"
                >
                  SIGN IN
                </Button>
              </form>
            )}
          </div>
          <MobileNav user={user} handleSignInClick={handleSignInClick} />
        </div>
      </div>
    </header>
  );
}
