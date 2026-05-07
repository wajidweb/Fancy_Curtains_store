import Navbar from "@/components/shared/Navbar";
import CartNotification from "@/components/shared/CartNotification";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartNotification />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
}
