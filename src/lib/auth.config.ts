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
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/dashboard/admin");
      const isOnOrganizer = nextUrl.pathname.startsWith("/dashboard/organizer");

      if (isOnDashboard) {
        if (!isLoggedIn) return false; // redirect to /login

        // Role-based route protection
        const role = auth?.user?.role;

        if (isOnAdmin && role !== "ADMIN") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        if (isOnOrganizer && role !== "ORGANIZER" && role !== "ADMIN") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }

        return true;
      }

      // Redirect logged-in users away from auth pages
      const isOnAuth =
        nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
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
  providers: [], // providers added in auth.ts (server-only)
};
