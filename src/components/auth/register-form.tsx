"use client";

import { useActionState } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/actions/auth.actions";
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
import { AlertCircle, CheckCircle, Users, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, undefined);
  const [selectedRole, setSelectedRole] = useState<"ATTENDEE" | "ORGANIZER">("ATTENDEE");

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Join Eventify to discover or create events</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Google OAuth */}
        <GoogleSignInButton />

        <AuthDivider />

        <form action={formAction} className="space-y-4">
          {/* Error message */}
          {state?.error && (
            <div
              className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg p-3 text-sm"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          {/* Success message */}
          {state?.success && (
            <div
              className="bg-success/10 text-success flex items-center gap-2 rounded-lg p-3 text-sm"
              role="status"
            >
              <CheckCircle className="h-4 w-4 shrink-0" />
              {state.success}
            </div>
          )}

          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            required
            autoComplete="name"
            disabled={isPending}
          />

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
            placeholder="Min 6 characters"
            required
            autoComplete="new-password"
            disabled={isPending}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            required
            autoComplete="new-password"
            disabled={isPending}
          />

          {/* Role selection — HCI: Clear affordance, visual distinction */}
          <div className="space-y-2">
            <label className="text-brand-charcoal text-sm font-medium">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all",
                  selectedRole === "ATTENDEE"
                    ? "border-brand-orange bg-brand-orange/5 text-brand-orange"
                    : "border-brand-sage/30 text-brand-soft-black hover:border-brand-sage"
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value="ATTENDEE"
                  checked={selectedRole === "ATTENDEE"}
                  onChange={() => setSelectedRole("ATTENDEE")}
                  className="sr-only"
                />
                <Users className="h-6 w-6" />
                <span className="text-sm font-medium">Attend Events</span>
              </label>

              <label
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all",
                  selectedRole === "ORGANIZER"
                    ? "border-brand-orange bg-brand-orange/5 text-brand-orange"
                    : "border-brand-sage/30 text-brand-soft-black hover:border-brand-sage"
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value="ORGANIZER"
                  checked={selectedRole === "ORGANIZER"}
                  onChange={() => setSelectedRole("ORGANIZER")}
                  className="sr-only"
                />
                <UserCheck className="h-6 w-6" />
                <span className="text-sm font-medium">Organize Events</span>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isPending}>
            Create Account
          </Button>
        </form>

        <p className="text-brand-soft-black mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-orange font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
