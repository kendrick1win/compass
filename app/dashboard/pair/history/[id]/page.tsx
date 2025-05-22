"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User, Calendar, Users, FileText } from "lucide-react";
import Header from "@/components/custom/header";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";
import { Components } from "react-markdown";

type PairReading = {
  id: string;
  partner_gender: string;
  partner_birthdate: string;
  relationship_type: string;
  specific_relation: string | null;
  created_at: string;
  reading: string;
};

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

export default function ReadingPage() {
  const params = useParams();
  const [reading, setReading] = useState<PairReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const response = await fetch(`/api/pair/history/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch reading");
        }

        setReading(data.reading);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reading");
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Header />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Header />
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Header />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Reading not found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Header />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/dashboard/pair/history">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to History
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-semibold text-center">
            Your Compatibility Reading
          </CardTitle>
          <CardDescription className="text-center">
            Understanding Your Relationship Dynamics
          </CardDescription>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">
                {reading.relationship_type.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="capitalize">{reading.partner_gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(reading.partner_birthdate), "PP")}</span>
            </div>
            {reading.specific_relation && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                {reading.specific_relation}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {reading.reading}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
