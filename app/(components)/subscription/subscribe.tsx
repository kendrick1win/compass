"use client";

import React, { useTransition } from "react";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscribeAction } from "@/app/actions/stripe";
import { useRouter } from "next/navigation";

interface SubscribeCardProps {
  userId: string;
  className?: string;
}

export default function SubscribeCard({
  userId,
  className = "",
}: SubscribeCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = async () => {
    startTransition(async () => {
      const url = await subscribeAction({ userId });
      if (url) {
        router.push(url);
      } else {
        console.error("Failed to create subscription session");
      }
    });
  };

  const features = [
    "Daily personalized readings",
    "Pair compatibility analysis",
    "Life balance insights",
    "Mindful guidance",
    "Personal aspect understanding",
  ];

  return (
    <section className="bg-secondary/50 dark:bg-secondary/20 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">✨</span>
              </div>
              <CardTitle className="text-3xl font-light mb-4">
                Premium Compass
              </CardTitle>
              <CardDescription className="text-lg mb-6">
                Unlock deeper insights into your personal journey
              </CardDescription>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-light">£1</span>
                  <span className="text-xl text-muted-foreground">/week</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-4">
              <Button
                onClick={handleSubscribe}
                disabled={isPending}
                className="w-full max-w-md mx-auto"
                size="lg"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Start Your Journey"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Cancel anytime. No commitments.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
