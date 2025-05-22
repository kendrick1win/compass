import CTASection from "./(components)/cta";
import LandingNav from "./(components)/nav/landing-nav";
import HeroSection from "./(components)/hero";
import FeaturesSection from "./(components)/features";
import ProcedureSection from "./(components)/procedure";
import FooterSection from "./(components)/footer";
import Try from "./(components)/try";
import WhatIsBaziSection from "./(components)/explain-bazi";
export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <div className="flex flex-col">
        <HeroSection />
        {/* Features Section */}
        <FeaturesSection />
        <WhatIsBaziSection />
        {/* */}
        <Try />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <FooterSection />
      </div>
    </>
  );
}
