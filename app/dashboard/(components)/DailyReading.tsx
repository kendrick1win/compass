"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ScrollText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

// Add the markdown components styling from Profile.tsx
const markdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-3xl font-bold mb-4 text-primary" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-2xl font-semibold mb-3 text-primary" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-2xl font-medium mb-2 text-primary/90" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p
      className="text-xl mb-4 leading-relaxed text-muted-foreground"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul className="mb-4 pl-6 list-disc space-y-2" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="text-muted-foreground" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="italic text-foreground/90" {...props} />
  ),
};

export default function DailyReadingTest() {
  const [reading, setReading] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hasCheckedExisting, setHasCheckedExisting] = useState(false);
  const supabase = createClient();

  const checkExistingReading = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.user) return;

      const { data, error } = await supabase
        .from("daily_readings")
        .select("reading")
        .eq("user_id", session.session.user.id)
        .eq("date", today)
        .single();

      if (error) throw error;
      if (data) setReading(data.reading);
    } catch (err) {
      console.error("Error checking existing reading:", err);
    } finally {
      setHasCheckedExisting(true);
    }
  };

  useEffect(() => {
    checkExistingReading();
  }, []);

  const fetchDailyReading = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Please log in to get your daily reading");
      }

      const response = await fetch("/api/daily");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch daily reading");
      }

      setReading(data.reading);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Daily Reading</h1>
        <p className="text-muted-foreground">
          Your personalized BaZi guidance for today
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="bg-primary/3 text-center">
          <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            <span>Today's Reading</span>
          </CardTitle>
          <CardDescription>
            {reading
              ? "Your BaZi reading for today"
              : "Get your personalized BaZi reading for today"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {hasCheckedExisting && !reading && (
            <Button
              onClick={fetchDailyReading}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Reading...
                </>
              ) : (
                <>
                  Get Today's Reading
                  <ScrollText className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}

          {reading && (
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {reading}
              </ReactMarkdown>
            </div>
          )}

          {!hasCheckedExisting && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
