"use client";

import { MealContextProvider } from "@/context/useMealContext";
import { ShoppingProvider } from "@/context/useShoppingListContext";

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MealContextProvider>
      <ShoppingProvider>{children}</ShoppingProvider>
    </MealContextProvider>
  );
}
