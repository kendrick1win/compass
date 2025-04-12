import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // adjust the path as needed

const Sidebar: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Links Section */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="text-xl mb-4 font-medium">Quick Links</h3>
        <div className="space-y-3">
          <Link href="/daily" className="block">
            <Button
              variant="outline"
              className="w-full py-4 text-base hover:bg-secondary/80 rounded-sm font-normal"
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

      {/* Focus Hours Section */}
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
  );
};

export default Sidebar;
