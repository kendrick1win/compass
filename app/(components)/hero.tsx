"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

export default function HeroSection() {
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
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-8 md:w-1/2">
            {/* Logo */}
            <div className="space-y-2">
              <h1 className="text-5xl font-light tracking-wider">COMPASS</h1>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">
                Personal Guidance
              </p>
            </div>

            {/* Tagline */}
            <p className="text-xl font-light max-w-md">
              Discover your personal balance and navigate life with clarity,
              purpose, and mindfulness
            </p>

            {/* Enter Button */}
            <div className="flex gap-4">
              <Link href={session ? "/dashboard" : "/login"}>
                <Button className="px-8 py-6 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-sm font-normal">
                  {session ? "VIEW DASHBOARD" : "SIGN UP FOR FREE"}
                </Button>
              </Link>
            </div>
          </div>

          {/* Circular Element */}
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 rounded-full bg-foreground dark:bg-[#e5e5e5]"></div>
            <div
              className="absolute inset-0 rounded-full bg-background dark:bg-[#121212]"
              style={{
                clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
              }}
            ></div>
            <div className="absolute inset-0 rounded-full border border-border"></div>
          </div>
        </div>
      </section>
    </>
  );
}
