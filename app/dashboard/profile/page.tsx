"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { Components } from "react-markdown";

interface BaziResult {
  message: string;
  chineseCharacters: string;
  reading: string;
  analysis: any;
}

const markdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <h1 className="text-3xl font-bold mb-4 text-primary" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-2xl font-semibold mb-3 text-primary" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-xl font-medium mb-2 text-primary/90" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />
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

export default function BaziProfilePage() {
  const [formData, setFormData] = useState({
    date: new Date(1990, 0, 1), // Default date
    hour: 12,
    gender: "male",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BaziResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("reading");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "gender" ? value : Number.parseInt(value, 10),
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.valueAsDate;
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date,
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
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: formData.date.getFullYear(),
          month: formData.date.getMonth() + 1,
          day: formData.date.getDate(),
          hour: formData.hour,
          gender: formData.gender,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate Bazi reading");
      }

      const data = await response.json();
      setResult(data);
      setActiveTab("chart");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">BaZi Analysis</h1>
        <p className="text-muted-foreground">
          Discover your Chinese Four Pillars of Destiny chart and interpretation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span>Your Birth Information</span>
          </CardTitle>
          <CardDescription>
            Enter your birth details to generate your personalized BaZi chart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="bazi-form" onSubmit={handleSubmit} className="space-y-6">
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hour" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Birth Hour (24hr)
                </Label>
                <Input
                  id="hour"
                  type="number"
                  name="hour"
                  value={formData.hour || ""}
                  onChange={handleChange}
                  min="0"
                  max="24"
                  required
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

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="overflow-hidden border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl font-semibold text-center">
              Your BaZi Analysis
            </CardTitle>
            <CardDescription className="text-center">
              Based on {formData.date.toLocaleDateString()} at {formData.hour}
              :00, {formData.gender}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="chart"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Chart
                </TabsTrigger>
                <TabsTrigger
                  value="reading"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Reading
                </TabsTrigger>
                <TabsTrigger
                  value="technical"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Technical Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="chart"
                className="p-6 focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Your BaZi Chart
                  </h3>
                  <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="p-6">
                      <div className="font-mono text-lg tracking-wide text-center whitespace-pre-wrap">
                        {result.chineseCharacters}
                      </div>
                    </CardContent>
                  </Card>
                  <p className="text-sm text-muted-foreground italic text-center">
                    This is your Four Pillars of Destiny chart in Chinese
                    characters
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                value="reading"
                className="p-6 focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Your BaZi Reading
                  </h3>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <div className="prose prose-slate max-w-none">
                      <ReactMarkdown components={markdownComponents}>
                        {result.reading}
                      </ReactMarkdown>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent
                value="technical"
                className="p-6 focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Technical Analysis
                  </h3>
                  <ScrollArea className="h-[400px] rounded-md border">
                    <pre className="bg-slate-50 p-4 text-sm font-mono text-slate-800 whitespace-pre-wrap">
                      {JSON.stringify(result.analysis, null, 2)}
                    </pre>
                  </ScrollArea>
                  <p className="text-sm text-muted-foreground italic">
                    This is the raw technical data used to generate your reading
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
