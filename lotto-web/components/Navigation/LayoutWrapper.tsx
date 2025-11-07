"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Navigation/Footer";
import { ScrollProvider } from "@/providers/ScrollProvider";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes that should hide Navbar and Footer
  const hideLayout = ["/login", "/sign-up"].includes(pathname);

  return (
    <ScrollProvider>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </ScrollProvider>
  );
}
