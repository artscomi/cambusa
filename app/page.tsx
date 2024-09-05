"use client";

import { AddMenu } from "@/components/AddMenuForm";
import { CreateGroupBox } from "@/components/CreateGroupBox";
import { MainForm } from "@/components/MainForm";
import { MealMenu } from "@/components/MealPlanner/MealMenu";
import { MealContextProvider } from "@/context/useMealContext";

export default function Home() {
  return (
    <main className="md:py-32 md:mx-20 lg:mx-30 xl:mx-60 2xl:mx-96 h-full overflow-auto">
      <div className="w-full items-end">
        <MealContextProvider>
          <div className="flex flex-col md:flex-row justify-items-center gap-16 items-center md:bg-white md:rounded">
            <div className="flex-1 w-full">
              <MainForm />
            </div>
            <div className="flex-1 w-full">
              <CreateGroupBox />
            </div>
          </div>
          <MealMenu />
          <AddMenu />
        </MealContextProvider>
      </div>
    </main>
  );
}
