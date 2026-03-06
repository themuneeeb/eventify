"use client";

import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    role: session?.user?.role,
    isAdmin: session?.user?.role === "ADMIN",
    isOrganizer: session?.user?.role === "ORGANIZER",
    isAttendee: session?.user?.role === "ATTENDEE",
  };
}
