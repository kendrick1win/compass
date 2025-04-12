import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/custom/header";

export default function LandingPage() {
  return (
    <div className="w-full px-4 py-16 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12">
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
          <Link href="/dashboard" className="inline-block">
            <Button
              variant="outline"
              className="px-8 py-6 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-sm font-normal"
            >
              BEGIN JOURNEY
            </Button>
          </Link>
        </div>

        {/* Circular Element */}
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Base circle - full black */}
          <div className="absolute inset-0 rounded-full bg-black"></div>
          {/* Overlay half - beige */}
          <div
            className="absolute inset-0 rounded-full bg-white"
            style={{ clipPath: "polygon(100% 0, 50% 0, 50% 100%, 100% 100%)" }}
          ></div>
          {/* Border */}
          <div className="absolute inset-0 rounded-full border border-border"></div>
        </div>
      </div>
    </div>
  );
}
