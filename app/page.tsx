"use client";

import { CreateGroupBox } from "@/components/CreateGroupBox";
import { Loading } from "@/components/Loading";
import LottieAnimation from "@/components/LottieAnimation";
import { MainForm } from "@/components/MainForm";
import { ToastError } from "@/components/ToastError";
import { useState, useTransition } from "react";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return isPending ? (
    <Loading />
  ) : (
    <>
      <div className="max-sm:h-screen max-sm:flex flex-col justify-center">
        <div className="max-md:p-5 mb-5 md:mb-16">
          <h1 className="text-5xl mb-4">Cambusa AI</h1>
          <p className="text-xl text-left text-pretty">
            Crea il menu perfetto per tutto l&apos;equipaggio. Siete pronti a
            salpare? ⛵
          </p>
        </div>

        <div className="w-full items-end">
          <div className="flex flex-col md:flex-row justify-items-center gap-16 items-center">
            <div className="flex-1 w-full">
              <MainForm startTransition={startTransition} setError={setError} />
            </div>
            <div className="flex-1 w-full max-sm:hidden">
              <CreateGroupBox />
            </div>
          </div>
          {/* <MealMenu /> */}
          {/* <AddMenu /> */}
        </div>
        <ToastError error={error} setError={setError} />
      </div>
      <div className="sm:hidden pt-20">
        <CreateGroupBox />
      </div>
    </>
  );
}
