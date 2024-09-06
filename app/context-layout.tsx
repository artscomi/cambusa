"use client";

import { MealContextProvider } from "@/context/useMealContext";

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MealContextProvider>{children}</MealContextProvider>;
}
