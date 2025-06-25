"use client";

import { MealContextProvider } from "@/context/useMealContext";
import { ShoppingProvider } from "@/context/useShoppingListContext";
import { StripeModalProvider } from "@/context/useStripeModalContext";
import { useSaveUser } from "@/hooks/useSaveUser";
import { pageview } from "@/lib/gtag";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  useSaveUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && pathname && typeof window !== "undefined") {
      pageview(pathname);
    }
  }, [pathname, isMounted]);

  return (
    <StripeModalProvider>
      <MealContextProvider>
        <ShoppingProvider>{children}</ShoppingProvider>
      </MealContextProvider>
    </StripeModalProvider>
  );
}
