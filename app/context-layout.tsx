"use client";

import { MealContextProvider } from "@/context/useMealContext";
import { ShoppingProvider } from "@/context/useShoppingListContext";
import { pageview } from "@/lib/gtag";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);

  return (
    <MealContextProvider>
      <ShoppingProvider>{children}</ShoppingProvider>
    </MealContextProvider>
  );
}
