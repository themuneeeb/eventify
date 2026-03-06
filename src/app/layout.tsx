import type { Metadata } from "next";
import { inter } from "../lib/fonts";
import { Providers } from "../providers/toast-provider";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Eventify — Discover & Create Events",
    template: "%s | Eventify",
  },
  description: "Discover, create, and manage events. Purchase tickets securely.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
