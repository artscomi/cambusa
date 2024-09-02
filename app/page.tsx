"use client";

import { AddMenu } from "@/components/AddMenuForm";
import { MainForm } from "@/components/MainForm";
import { MealContextProvider } from "@/context/useMealContext";

export default function Home() {
  return (
    <main className="m-4 md:py-32 md:mx-20 lg:mx-30 xl:mx-60 2xl:mx-96 h-full overflow-auto">
      <div className="w-full items-end">
        <MealContextProvider>
          <MainForm />
          <AddMenu />
        </MealContextProvider>
      </div>
    </main>
  );
}
