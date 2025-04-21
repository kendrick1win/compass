import { login, signup } from "@/app/login/actions";
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

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Use a Card for the main form container */}
      {/* Added max-w-sm for responsiveness on larger screens */}
      <Card className="w-full max-w-sm">
        {/* Wrap the entire card content in the form */}
        <form>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account or sign up.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com" // Added placeholder
                required
              />
            </div>
            {/* Password Field */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                // Consider adding placeholder="********" if desired
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {/* Sign up Button - using outline variant */}
            <Button variant="outline" formAction={signup}>
              Sign up
            </Button>
            {/* Log in Button - using default variant */}
            <Button formAction={login}>Log in</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
