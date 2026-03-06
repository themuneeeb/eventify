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
  title: "Create Account",
};

// Placeholder — full form in Phase 2
export default function RegisterPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Join Eventify to discover or create events</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-brand-soft-black text-center text-sm">
          Registration form will be built in Phase 2.
        </p>
        <p className="text-brand-soft-black mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-orange font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
