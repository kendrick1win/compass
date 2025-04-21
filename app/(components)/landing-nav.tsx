import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/ModeToggle";

export default function LandingNav() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-light tracking-wider">
          COMPASS
        </Link>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="hidden md:flex items-center gap-3">
            <Link href="/try-it-now">
              <Button variant="outline" className="rounded-sm font-normal">
                TRY IT NOW
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="ghost" className="rounded-sm font-normal">
                SIGN IN
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-sm font-normal">
                SIGN UP
              </Button>
            </Link>
          </div>
          <button className="md:hidden">
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
      </div>
    </header>
  );
}
