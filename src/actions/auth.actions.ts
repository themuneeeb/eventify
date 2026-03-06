"use server";

import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema } from "@/validations/auth.schema";
import { AuthError } from "next-auth";

// ─── REGISTER ────────────────────────────────

export async function registerAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role") || "ATTENDEE",
  };

  const validated = registerSchema.safeParse(raw);

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password, role } = validated.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: role as "ATTENDEE" | "ORGANIZER",
        isApproved: role === "ATTENDEE",
      },
    });

    return { success: "Account created successfully! Please sign in." };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

// ─── LOGIN ───────────────────────────────────

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validated = loginSchema.safeParse(raw);

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    // Next.js redirect throws an error — we need to re-throw it
    throw error;
  }
}

// ─── GOOGLE SIGN IN ──────────────────────────

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

// ─── SIGN OUT ────────────────────────────────

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
