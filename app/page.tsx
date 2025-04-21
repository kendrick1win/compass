import CTASection from "./(components)/cta";
import LandingNav from "./(components)/landing-nav";
import HeroSection from "./(components)/hero";
import FeaturesSection from "./(components)/features";
import ProcedureSection from "./(components)/procedure";
import FooterSection from "./(components)/footer";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Session } from "@supabase/supabase-js"; // Import Session type

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <div className="flex flex-col">
        <HeroSection />
        {/* Features Section */}
        <FeaturesSection />
        {/* How It Works Section */}
        <ProcedureSection />
        {/* Testimonials Section */}

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <FooterSection />
      </div>
    </>
  );
}
