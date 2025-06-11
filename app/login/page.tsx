"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleSignInButton from "@/components/login/googleSignInButton";

const supabase = createClientComponentClient();

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Link
        href="/"
        className="absolute top-4 left-4 p-2 hover:bg-accent rounded-full transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="h-6 w-6" />
        <span>Back</span>
      </Link>
      <Card className="w-full max-w-sm m-1">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in / Sign up</CardTitle>
          <CardDescription>
            Sign in to your account with Google.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <GoogleSignInButton />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
