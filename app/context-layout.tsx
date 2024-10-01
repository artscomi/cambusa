"use client";

import { MealContextProvider } from "@/context/useMealContext";
import { ShoppingProvider } from "@/context/useShoppingListContext";
import { StripeModalProvider } from "@/context/useStripeModalContext";
import { useSaveUser } from "@/hooks/useSaveUser";
import { pageview } from "@/lib/gtag";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useSaveUser();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);

  return (
    <StripeModalProvider>
      <MealContextProvider>
        <ShoppingProvider>{children}</ShoppingProvider>
      </MealContextProvider>
    </StripeModalProvider>
  );
}
