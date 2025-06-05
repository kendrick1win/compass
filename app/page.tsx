import CTASection from "./(components)/landing_page/cta";
import LandingNav from "./(components)/nav/landing-nav";
import HeroSection from "./(components)/landing_page/hero";
import FeaturesSection from "./(components)/landing_page/features";
import ProcedureSection from "./(components)/landing_page/procedure";
import FooterSection from "./(components)/landing_page/footer";
import Try from "./(components)/try";
import WhatIsBaziSection from "./(components)/landing_page/explain-bazi";
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
