"use client";

import { MealContextProvider } from "@/context/useMealContext";
import { ShoppingProvider } from "@/context/useShoppingListContext";
import { pageview } from "@/lib/gtag";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    // Handle route changes manually
    router.events.on('routeChangeComplete', handleRouteChange);

    // Clean up the event listener
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  
  return (
    <MealContextProvider>
      <ShoppingProvider>{children}</ShoppingProvider>
    </MealContextProvider>
  );
}
