import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function CTASection() {
  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-6">
              Begin Your Journey to Balance
            </h2>
            <p className="text-xl mb-8">
              Join others who have discovered their personal aspects and found
              greater clarity and purpose.
            </p>
            <Link href={"/login"}>
              <Button className="px-8 py-6 text-lg bg-background text-foreground hover:bg-background/90 dark:bg-[#121212] dark:text-[#e5e5e5] dark:hover:bg-[#121212]/90 rounded-sm font-normal">
                CREATE YOUR PROFILE
              </Button>
            </Link>

            <p className="mt-4 text-sm opacity-80">
              No credit card required. Free basic account.
            </p>
          </div>
        </div>
      </section>
      ;
    </>
  );
}
