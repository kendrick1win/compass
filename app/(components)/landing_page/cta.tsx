"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
export default function CTASection() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-6">
              Begin Your Journey to Balance
            </h2>
            <p className="text-xl mb-8">
              Join others who have discovered their personal aspects and found
              greater clarity and purpose.
            </p>
            <Link href={session ? "/dashboard/profile" : "/login"}>
              <Button className="px-8 py-6 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-sm font-normal">
                {session ? "VIEW PROFILE" : "CREATE YOUR PROFILE"}
              </Button>
            </Link>

            <p className="mt-4 text-sm opacity-80">
              No credit card required. Free basic account.
            </p>
          </div>
        </div>
      </section>
      ;
    </>
  );
}
