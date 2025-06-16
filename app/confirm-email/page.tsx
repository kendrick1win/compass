"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Link
        href="/"
        className="absolute top-4 left-4 p-2 hover:bg-accent rounded-full transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="h-6 w-6" />
        <span>Back</span>
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Almost There! 🎉</CardTitle>
          <CardDescription className="text-base mt-2">
            We've sent you a confirmation email. Click the link to start your journey with Compass!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="bg-primary/5 rounded-lg p-4 space-y-3">
            <p className="font-medium text-primary">What's Next?</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Check your inbox</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Click the verification link</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Start your journey!</span>
              </li>
            </ul>
          </div>

          <div className="text-sm text-muted-foreground space-y-3">
            <p className="font-medium">Didn't receive the email?</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span>Check your spam folder</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span>Make sure you entered the correct email address</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span>Wait a few minutes and try again</span>
              </li>
            </ul>
          </div>

          <Link href="/login">
            <Button className="w-full" variant="outline">
              Return to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}