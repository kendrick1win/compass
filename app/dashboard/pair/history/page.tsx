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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User, Calendar, Users } from "lucide-react";
import Header from "@/components/custom/header";
import { Skeleton } from "@/components/ui/skeleton";

type PairReading = {
  id: string;
  partner_gender: string;
  partner_birthdate: string;
  relationship_type: string;
  specific_relation: string | null;
  created_at: string;
  reading: string;
};

export default function HistoryPage() {
  const [readings, setReadings] = useState<PairReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch("/api/pair/history");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch readings");
        }

        setReadings(data.readings);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load readings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Header />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Reading History</h1>
          <p className="text-muted-foreground">
            View your past compatibility readings
          </p>
        </div>
        <Link href="/dashboard/pair">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            New Reading
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : readings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No readings found. Generate your first reading!
            </CardContent>
          </Card>
        ) : (
          readings.map((reading) => (
            <Card
              key={reading.id}
              className="group hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="capitalize">
                      {reading.relationship_type.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(reading.created_at), "PPP")}
                  </span>
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="capitalize">
                        {reading.partner_gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(reading.partner_birthdate), "PP")}
                      </span>
                    </div>
                    {reading.specific_relation && (
                      <div className="text-muted-foreground">
                        ({reading.specific_relation})
                      </div>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {reading.reading.slice(0, 200)}...
                  <Button variant="link" asChild className="pl-2 h-auto p-0">
                    <Link href={`/dashboard/pair/history/${reading.id}`}>
                      Read more
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
