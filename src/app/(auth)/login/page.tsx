import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
};

// Placeholder — full form in Phase 2
export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your Eventify account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-brand-soft-black text-center text-sm">
          Login form will be built in Phase 2.
        </p>
        <p className="text-brand-soft-black mt-4 text-center text-sm">
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
