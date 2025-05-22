"use client";

import { useState } from "react";
import { PairReadingRequest } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import {
  Calendar,
  Clock,
  User,
  FileText,
  ChevronRight,
  Loader2,
  Users,
  History,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import Loading from "./(components)/loading";
import Header from "@/components/custom/header";

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
};

export default function PairReadingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const request: PairReadingRequest = {
      partnerName: formData.get("partnerName") as string,
      partnerBirthdate: formData.get("birthdate") as string,
      partnerBirthtime: parseInt(formData.get("birthtime") as string),
      partnerGender: formData.get("gender") as "male" | "female",
      relationshipType: formData.get(
        "relationshipType"
      ) as PairReadingRequest["relationshipType"],
      specificRelation: formData.get("specificRelation") as string,
    };

    try {
      const response = await fetch("/api/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate reading");
      }

      setReading(data.reading);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Header />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Compatibility Reading
          </h1>
          <p className="text-muted-foreground">
            Discover your relationship dynamics through Bazi analysis
          </p>
        </div>
        <Link href="/dashboard/pair/history">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            View History
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Partner Information</span>
          </CardTitle>
          <CardDescription>
            Enter your partner's details to generate a compatibility reading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="pair-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="birthdate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Birth Date
                </Label>
                <Input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  required
                  className="[&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthtime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Birth Hour (0-23)
                </Label>
                <Input
                  id="birthtime"
                  name="birthtime"
                  type="number"
                  min="0"
                  max="23"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Gender
                </Label>
                <Select name="gender" defaultValue="male">
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="relationshipType"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Relationship Type
                </Label>
                <Select name="relationshipType" defaultValue="friend">
                  <SelectTrigger id="relationshipType">
                    <SelectValue placeholder="Select relationship type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="romantic_partner">
                      Romantic Partner
                    </SelectItem>
                    <SelectItem value="family_member">Family Member</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="business_partner">
                      Business Partner
                    </SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="partnerName"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Partner's Name
                </Label>
                <Input
                  id="partnerName"
                  name="partnerName"
                  type="text"
                  required
                  placeholder="Enter partner's name"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            form="pair-form"
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
                Generate Reading
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

      {reading && (
        <Card className="overflow-hidden border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl font-semibold text-center">
              Your Compatibility Reading
            </CardTitle>
            <CardDescription className="text-center">
              Understanding Your Relationship Dynamics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {reading}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
