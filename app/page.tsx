"use client";

import { AddMenu } from "@/components/AddMenuForm";
import { CreateGroupBox } from "@/components/CreateGroupBox";
import { MainForm } from "@/components/MainForm";
import { MealMenu } from "@/components/MealMenu";

export default function Home() {
  return (
    <main className="md:py-24 md:mx-20 lg:mx-30 xl:mx-60 2xl:mx-96 h-full overflow-auto">
      <div className="max-md:p-5 max-md:pt-10 mb-5 md:mb-16">
        <h1 className="text-5xl mb-4">Cambusa AI</h1>
        <p className="text-xl text-left text-pretty">
          Crea il menu perfetto per tutto l&apos;equipaggio. Siete pronti a
          salpare? ⛵
        </p>
      </div>

      <div className="w-full items-end">
        <div className="flex flex-col md:flex-row justify-items-center gap-16 items-center  md:rounded">
          <div className="flex-1 w-full">
            <MainForm />
          </div>
          <div className="flex-1 w-full">
            <CreateGroupBox />
          </div>
        </div>
        {/* <MealMenu /> */}
        {/* <AddMenu /> */}
      </div>
    </main>
  );
}
