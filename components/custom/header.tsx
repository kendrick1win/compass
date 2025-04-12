import Link from "next/link";
import { Home, Calendar, User, MessageCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-light tracking-wider">
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
            href="/daily"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span>DAILY</span>
          </Link>
          <Link
            href="/ask"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>ASK</span>
          </Link>
          <Link
            href="/you"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="h-4 w-4" />
            <span>PROFILE</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
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
