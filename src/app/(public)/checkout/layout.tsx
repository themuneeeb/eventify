// Checkout layout — navbar is already provided by the (public) parent layout.
// This layout omits the footer for a focused checkout flow (HCI: no distractions).
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-off-white flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
