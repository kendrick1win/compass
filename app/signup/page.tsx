"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleSignInButton from "@/components/login/googleSignInButton";
import { toast } from "sonner";

interface SignupResult {
  error?: string;
}

export async function signup(formData: FormData): Promise<SignupResult | void> {
  // Implementation here
}

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (err) {
      setError("An error occurred during sign up");
      toast.error("An error occurred during sign up");
    }
  };

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
        <form action={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Create a new account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Google Sign In Button Component */}
            <GoogleSignInButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
              />
            </div>
            {/* Password Field */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-3">
            <Button className="w-full" formAction={handleSubmit}>
              Sign up
            </Button>
            {error && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {error}
              </div>
            )}
            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
