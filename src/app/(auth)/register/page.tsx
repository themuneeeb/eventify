import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Eventify account to discover or create events",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
