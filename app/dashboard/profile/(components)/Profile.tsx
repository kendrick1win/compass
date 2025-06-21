"use client";

import { useState, useEffect } from "react"; // Updated import
import supabase from "@/utils/supabase/client";
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

import { Calendar, Clock, User, ChevronRight, Loader2, Copy, Check, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BaziChart } from "./BaziChart";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

interface BaziResult {
  message: string;
  chineseCharacters: string;
  reading: string;
  analysis: any;
  birthInfo?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: string;
  };
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
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [formData, setFormData] = useState<{
    date: Date;
    hour: number | string;
    gender: string;
  }>({
    date: new Date(2001, 0, 1),
    hour: 12,
    gender: "male",
  });
  const [session, setSession] = useState<Session | null>(null);

  // Sample prompts for AI tools
  const samplePrompts = [
    {
      id: "career",
      title: "Career Guidance",
      prompt: "Based on this BaZi chart, what career paths would be most suitable for me? What are my strengths and potential challenges in the workplace?"
    },
    {
      id: "relationships",
      title: "Relationships & Compatibility",
      prompt: "What does this BaZi chart reveal about my personality in relationships? What type of partner would be most compatible with me?"
    },
    {
      id: "health",
      title: "Health & Wellness",
      prompt: "What health aspects should I pay attention to based on this BaZi chart? Are there any specific elements I should balance?"
    },
    {
      id: "timing",
      title: "Timing & Luck",
      prompt: "What are the best times for important decisions based on this BaZi chart? When should I be more cautious?"
    },
    {
      id: "general",
      title: "General Analysis",
      prompt: "Please provide a comprehensive analysis of this BaZi chart. What are the key characteristics and life themes for this person?"
    }
  ];

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then((response: { data: { session: Session | null } }) => {
      setSession(response.data.session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    
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
            console.error("Error checking profile existence");
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
              birthInfo: {
                year: profile.year,
                month: profile.month,
                day: profile.day,
                hour: profile.hour,
                gender: profile.gender,
              },
            });
            setShowForm(false);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchExistingProfile();
  }, [session]); // Now depends on session changes

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.valueAsDate;
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date,
      }));
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update if value is empty or a valid number within range
    if (
      value === "" ||
      (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 23)
    ) {
      setFormData((prev) => ({
        ...prev,
        hour: value === "" ? "" : parseInt(value),
      }));
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        year: formData.date.getFullYear(),
        month: formData.date.getMonth() + 1,
        day: formData.date.getDate(),
        hour:
          typeof formData.hour === "string"
            ? parseInt(formData.hour)
            : formData.hour,
        gender: formData.gender,
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      // Store birth info with the result
      setResult({
        ...result,
        birthInfo: data,
      });
      setActiveTab("chart");
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format the birthday
  const formatBirthday = (birthInfo: any) => {
    if (!birthInfo) return "";
    const { year, month, day, hour, gender } = birthInfo;
    const formattedHour = hour.toString().padStart(2, "0") + ":00";
    return `${month}/${day}/${year} at ${formattedHour} (${gender})`;
  };

  // Function to copy chart text
  const copyChartText = async () => {
    if (!result?.chineseCharacters) return;
    
    try {
      await navigator.clipboard.writeText(result.chineseCharacters);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Function to copy selected prompt
  const copyPrompt = async (promptText: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPromptId(promptId);
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
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
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Birth Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date.toISOString().split("T")[0]}
                      onChange={handleDateChange}
                      required
                      className="[&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hour" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Birth Hour (24hr)
                    </Label>
                    <Input
                      type="number"
                      id="hour"
                      name="hour"
                      value={formData.hour}
                      onChange={handleHourChange}
                      min="0"
                      max="23"
                      step="1"
                      required
                      placeholder="0-23"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={handleGenderChange}
                    >
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
                Your BaZi Chartz
              </CardTitle>
              {result.birthInfo && (
                <p className="text-sm text-muted-foreground mt-2">
                  Born: {formatBirthday(result.birthInfo)}
                </p>
              )}
              <CardDescription>
                Your Four Pillars of Destiny in Chinese Characters
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <BaziChart chineseCharacters={result.chineseCharacters} />
                
                {/* Copy section */}
                <div className="flex flex-col items-center space-y-3 pt-4 border-t border-border/50">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyChartText}
                      className="flex items-center space-x-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Chart</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    You can copy your chart and ask ChatGPT, DeepSeek, or other AI tools for more insights about your BaZi reading!
                  </p>
                  
                  {/* Sample prompts section */}
                  <div className="w-full max-w-md space-y-3">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Sample prompts you can use:
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPrompts(!showPrompts)}
                        className="flex items-center justify-between"
                      >
                        <span>View Sample Prompts</span>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 ${
                            showPrompts ? 'rotate-180' : ''
                          }`} 
                        />
                      </Button>
                      
                      {showPrompts && (
                        <div className="space-y-3 pt-2">
                          {samplePrompts.map((prompt) => (
                            <div key={prompt.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-foreground">
                                  {prompt.title}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                                  className="h-6 px-2 text-xs"
                                >
                                  {copiedPromptId === prompt.id ? (
                                    <>
                                      <Check className="h-3 w-3 text-green-600 mr-1" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3 mr-1" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                              </div>
                              <div className="p-3 bg-muted/50 rounded-md border">
                                <p className="text-sm text-muted-foreground">
                                  {prompt.prompt}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
