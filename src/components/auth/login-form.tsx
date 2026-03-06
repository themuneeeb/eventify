"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/actions/auth.actions";
import { GoogleSignInButton } from "@/components/auth/social-login-button";
import { AuthDivider } from "@/components/auth/auth-divider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your Eventify account</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Google OAuth — HCI: Recognizable, single-click sign in */}
        <GoogleSignInButton />

        <AuthDivider />

        {/* Credentials form */}
        <form action={formAction} className="space-y-4">
          {/* Error message — HCI: Feedback */}
          {state?.error && (
            <div
              className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg p-3 text-sm"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={isPending}
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            disabled={isPending}
          />

          <Button type="submit" className="w-full" isLoading={isPending}>
            Sign In
          </Button>
        </form>

        <p className="text-brand-soft-black mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-brand-orange font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
