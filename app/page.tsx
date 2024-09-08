"use client";

import { CreateGroupBox } from "@/components/CreateGroupBox";
import { Loading } from "@/components/Loading";
import { MainForm } from "@/components/MainForm";
import { useTransition } from "react";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  return isPending ? (
    <Loading />
  ) : (
    <>
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
            <MainForm startTransition={startTransition} />
          </div>
          <div className="flex-1 w-full">
            <CreateGroupBox />
          </div>
        </div>
        {/* <MealMenu /> */}
        {/* <AddMenu /> */}
      </div>
    </>
  );
}
