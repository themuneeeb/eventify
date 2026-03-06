import { Navbar } from "@/components/layout/navbar";

// Checkout gets navbar but no footer — HCI: Focused flow, no distractions
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-off-white flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
