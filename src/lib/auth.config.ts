import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const isOnDashboard = pathname.startsWith("/dashboard");
      const isOnAdmin = pathname.startsWith("/dashboard/admin");
      const isOnOrganizer = pathname.startsWith("/dashboard/organizer");
      const isOnAttendeeSubpage =
        pathname.startsWith("/dashboard/attendee/tickets") ||
        pathname.startsWith("/dashboard/attendee/orders");
      const isOnDashboardHome =
        pathname === "/dashboard" || pathname === "/dashboard/attendee";

      if (isOnDashboard) {
        if (!isLoggedIn) return false;

        const role = auth?.user?.role;

        // Attendees: allow tickets/orders pages, redirect everything else to /events
        if (role === "ATTENDEE") {
          if (isOnAttendeeSubpage) return true;
          return Response.redirect(new URL("/events", nextUrl));
        }

        // Non-admin trying admin routes
        if (isOnAdmin && role !== "ADMIN") {
          return Response.redirect(new URL("/dashboard/organizer", nextUrl));
        }

        // Non-organizer/non-admin trying organizer routes
        if (isOnOrganizer && role !== "ORGANIZER" && role !== "ADMIN") {
          return Response.redirect(new URL("/events", nextUrl));
        }

        return true;
      }

      // Redirect logged-in users away from auth pages
      const isOnAuth = pathname.startsWith("/login") || pathname.startsWith("/register");
      if (isOnAuth && isLoggedIn) {
        const role = auth?.user?.role;
        if (role === "ATTENDEE") {
          return Response.redirect(new URL("/events", nextUrl));
        }
        if (role === "ADMIN") {
          return Response.redirect(new URL("/dashboard/admin", nextUrl));
        }
        return Response.redirect(new URL("/dashboard/organizer", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [],
};
