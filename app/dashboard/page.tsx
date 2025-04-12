import { formatDate } from "@/lib/utils";
import Sidebar from "@/components/dashboard/Sidebar";

export default function Dashboard() {
  const today = new Date();
  const username = "user8729";

  return (
    <div className="w-full min-h-screen px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar - Stack on top on small screens, fixed width on medium+ */}
      <div className="w-full md:w-[300px]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full">
        {/* Greeting */}
        <div className="mb-8 pb-4 border-b border-border px-2 md:px-6">
          <h2 className="text-2xl font-light">
            Good evening, <span className="font-medium">@{username}</span>
          </h2>
          <p className="text-muted-foreground">
            It&apos;s {formatDate(today)}. Today at a glance:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 md:px-6">
          {/* Main Content Columns */}
          <div className="lg:col-span-2">
            {/* Daily Message */}
            <div className="p-6 sm:p-8 flex flex-col items-center space-y-8 border border-border rounded-lg mb-8">
              <h2 className="text-2xl sm:text-3xl font-light text-center leading-tight">
                Finding balance requires mindfulness today.
              </h2>

              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-foreground">
                <div className="absolute inset-0 bg-gradient-to-r from-foreground to-background rounded-full" />
              </div>
            </div>

            {/* Do & Don't */}
            <div className="grid grid-cols-1 sm:grid-cols-2 border border-border rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl mb-6 font-medium">Do</h3>
                <ul className="space-y-4">
                  <li className="text-lg">Practice mindfulness</li>
                  <li className="text-lg">Organize your space</li>
                  <li className="text-lg">Morning reflection</li>
                  <li className="text-lg">Connect with nature</li>
                </ul>
              </div>
              <div className="p-6 border-t sm:border-t-0 sm:border-l border-border">
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
        </div>
      </div>
    </div>
  );
}
