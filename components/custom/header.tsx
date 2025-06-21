"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Calendar, User, Users, LogOut } from "lucide-react";
import { ModeToggle } from "../theme/ModeToggle";
import supabase from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [canAccessPair, setCanAccessPair] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkAccess = async (userId: string) => {
      try {
        const [profileRes, subscriptionRes] = await Promise.all([
          supabase.from("profiles").select("id").eq("user_id", userId).single(),
          supabase.from("subscriptions").select("status").eq("user_id", userId).order("created_at", { ascending: false })
        ]);

        const hasProfile = !profileRes.error && profileRes.data;
        const isSubscribed = !subscriptionRes.error && 
          subscriptionRes.data && 
          subscriptionRes.data.length > 0 && 
          subscriptionRes.data[0]?.status === "active";
        
        setCanAccessPair(hasProfile && isSubscribed);
      } catch (error) {
        setCanAccessPair(false);
      }
    };


    // Initial check
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
    });


    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session|null) => {
      if (session?.user?.id) {
        await checkAccess(session.user.id);
      } else {
        setCanAccessPair(false);
      }
    });


    // Set up realtime subscription
    const channel = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions'
        },
        () => {
          supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
            if (session?.user?.id) {
              checkAccess(session.user.id);
            }
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    redirect("/");
  };

  const PairLink = ({ isMobile = false }: { isMobile?: boolean }) => {
    const baseClasses = isMobile 
      ? "flex items-center gap-2 p-2 hover:bg-muted rounded-sm"
      : "flex items-center gap-2";

    if (canAccessPair) {
      return (
        <Link
          href="/dashboard/pair"
          className={`${baseClasses} text-muted-foreground hover:text-foreground transition-colors`}
        >
          <Users className="h-4 w-4" />
          <span>PAIR</span>
        </Link>
      );
    }

    return (
      <div
        className={`${baseClasses} text-muted-foreground/50 cursor-not-allowed`}
        title="Complete your profile and subscribe to access Pair Reading"
      >
        <Users className="h-4 w-4" />
        <span>PAIR (Premium)</span>
      </div>
    );
  };

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
        <Link href="/" className="text-xl font-light tracking-wider">
          COMPASS
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>HOME</span>
          </Link>

          <PairLink />

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="h-4 w-4" />
            <span>YOU</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>SIGN OUT</span>
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border shadow-lg md:hidden">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-sm"
              >
                <Home className="h-4 w-4" />
                <span>HOME</span>
              </Link>

              <PairLink isMobile={true} />

              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-sm"
              >
                <User className="h-4 w-4" />
                <span>YOU</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-sm w-full"
              >
                <LogOut className="h-4 w-4" />
                <span>SIGN OUT</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
