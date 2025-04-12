import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  const today = new Date();
  const username = "user8729";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Greeting */}
        <div className="mb-8 pb-4 border-b border-border">
          <h2 className="text-2xl font-light">
            Good evening, <span className="font-medium">@{username}</span>
          </h2>
          <p className="text-muted-foreground">
            It&apos;s {formatDate(today)}. Today at a glance:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Daily Message */}
            <div className="p-8 flex flex-col items-center space-y-8 border border-border rounded-lg mb-8">
              <h2 className="text-3xl font-light text-center leading-tight">
                Finding balance requires mindfulness today.
              </h2>

              <div className="relative w-40 h-40 rounded-full overflow-hidden bg-foreground">
                <div className="absolute inset-0 bg-gradient-to-r from-foreground to-background rounded-full" />
              </div>
            </div>

            {/* Do & Don't */}
            <div className="grid grid-cols-2 border border-border rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl mb-6 font-medium">Do</h3>
                <ul className="space-y-4">
                  <li className="text-lg">Practice mindfulness</li>
                  <li className="text-lg">Organize your space</li>
                  <li className="text-lg">Morning reflection</li>
                  <li className="text-lg">Connect with nature</li>
                </ul>
              </div>
              <div className="p-6 border-l border-border">
                <h3 className="text-xl mb-6 font-medium">Don&apos;t</h3>
                <ul className="space-y-4">
                  <li className="text-lg">Rush decisions</li>
                  <li className="text-lg">Overcommit yourself</li>
                  <li className="text-lg">Neglect self-care</li>
                  <li className="text-lg">Dwell on past events</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-xl mb-4 font-medium">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/daily" className="block">
                  <Button
                    variant="outline"
                    className="w-full py-4 text-base bg-foreground text-background hover:bg-foreground/90 rounded-sm font-normal"
                  >
                    DAILY INSIGHTS
                  </Button>
                </Link>
                <Link href="/ask" className="block">
                  <Button
                    variant="outline"
                    className="w-full py-4 text-base hover:bg-secondary/80 rounded-sm font-normal"
                  >
                    ASK COMPASS
                  </Button>
                </Link>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-xl mb-4 font-medium">Focus Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Morning</span>
                  <span>7:00 - 9:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Afternoon</span>
                  <span>13:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Evening</span>
                  <span>19:00 - 21:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
