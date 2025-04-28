"use client";

import { useState, useEffect } from "react"; // Updated import
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  User,
  FileText,
  ChevronRight,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BaziChart } from "./BaziChart";

interface BaziResult {
  message: string;
  chineseCharacters: string;
  reading: string;
  analysis: any;
}

import type { Components } from "react-markdown";

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

export default function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BaziResult | null>(null);
  const [activeTab, setActiveTab] = useState("chart");
  const [showForm, setShowForm] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // First check if profile exists
          const { count, error: countError } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);

          if (countError) {
            console.error("Error checking profile existence:", countError);
            return;
          }

          // Only fetch full profile if it exists
          if (count && count > 0) {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", user.id)
              .single();

            if (error) {
              console.error("Error fetching profile:", error);
              return;
            }

            setResult({
              message: "Existing reading found",
              chineseCharacters: profile.chinese_characters,
              reading: profile.reading,
              analysis: profile.analysis,
            });
            setShowForm(false);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchExistingProfile();
  }, []); // Empty dependency array means this runs once when component mounts

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        year: parseInt(formData.get("year") as string),
        month: parseInt(formData.get("month") as string),
        day: parseInt(formData.get("day") as string),
        hour: parseInt(formData.get("hour") as string),
        gender: formData.get("gender"),
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setResult(result);
      setActiveTab("chart");
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {showForm ? (
        <>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Generate Your Reading
            </h1>
            <p className="text-muted-foreground">
              Enter your birth details to generate your BaZi chart
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span>Birth Information</span>
              </CardTitle>
              <CardDescription>
                Please provide your birth details for an accurate reading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="bazi-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="year" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Year
                    </Label>
                    <Input
                      type="number"
                      id="year"
                      name="year"
                      required
                      placeholder="Birth year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Month
                    </Label>
                    <Input
                      type="number"
                      id="month"
                      name="month"
                      min="1"
                      max="12"
                      required
                      placeholder="1-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="day" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Day
                    </Label>
                    <Input
                      type="number"
                      id="day"
                      name="day"
                      min="1"
                      max="31"
                      required
                      placeholder="1-31"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hour" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Hour (24hr)
                    </Label>
                    <Input
                      type="number"
                      id="hour"
                      name="hour"
                      min="0"
                      max="23"
                      required
                      placeholder="0-23"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Gender
                    </Label>
                    <Select name="gender" required>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                form="bazi-form"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate BaZi Reading
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : null}

      {result && (
        <>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Your Free Reading
            </h1>
            <p className="text-muted-foreground">
              Below is your personalized BaZi analysis
            </p>
          </div>

          {/* Chart Section */}
          <Card className="border-primary/20 ">
            {" "}
            {/* Changed from opacity-25 to bg-white/25 */}
            <CardHeader className="bg-primary/3 text-center">
              <CardTitle className="text-2xl font-semibold">
                Your BaZi Chart
              </CardTitle>
              <CardDescription>
                Your Four Pillars of Destiny in Chinese Characters
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <BaziChart chineseCharacters={result.chineseCharacters} />
            </CardContent>
          </Card>

          {/* Reading Section */}
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/3 text-center">
              <CardTitle className="text-2xl font-semibold">
                Your BaZi Reading
              </CardTitle>
              <CardDescription>
                Detailed interpretation of your chart
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown components={markdownComponents}>
                  {result.reading}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Technical Analysis Section */}
          <Card className="border-primary/20">
            <CardHeader className="bg-primary/3 text-center">
              <CardTitle className="text-2xl font-semibold">
                Technical Analysis
              </CardTitle>
              <CardDescription>
                Detailed breakdown of your chart elements
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[400px] rounded-md border">
                <pre className="bg-slate-50 p-4 text-sm font-mono text-slate-800 whitespace-pre-wrap">
                  {JSON.stringify(result.analysis, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}

      {!showForm && !result && (
        <Button onClick={() => setShowForm(true)} className="mx-auto block">
          Generate New Reading
        </Button>
      )}
    </div>
  );
}
