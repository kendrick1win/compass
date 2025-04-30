"use client";
import { useState } from "react";
import Link from "next/link";
import { Home, Calendar, User, MessageCircle, LogOut } from "lucide-react";
import { ModeToggle } from "../theme/ModeToggle";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    redirect("/");
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

          <Link
            href=""
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>ASK {"(COMING SOON)"}</span>
          </Link>
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
          <ModeToggle />
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

              <Link
                href=""
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>ASK {"(COMING SOON)"}</span>
              </Link>
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
