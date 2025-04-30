"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  user: any;
  handleSignInClick: () => void;
}

export default function MobileNav({ user, handleSignInClick }: MobileNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        className="flex items-center"
        aria-label="Toggle mobile menu"
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

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="w-full rounded-sm font-normal hover:bg-muted"
                >
                  DASHBOARD
                </Button>
              </Link>
            ) : (
              <form action={handleSignInClick}>
                <Button
                  variant="ghost"
                  className="w-full rounded-sm font-normal hover:bg-muted"
                  type="submit"
                >
                  SIGN IN
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
