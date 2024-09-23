"use client";

import { CreateGroupBox } from "@/components/CreateGroupBox";
import { Loading } from "@/components/Loading";
import { MainForm } from "@/components/MainForm";
import { ToastError } from "@/components/ToastError";
import { useState, useTransition } from "react";
import Image from "next/image";
import { DialogStripe } from "@/components/ui/dialogs/Stripe";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDialogStripeOpen, setIsDialogStripeOpen] = useState(false);

  const openDialogStripe = () => {
    setIsDialogStripeOpen(true)
  }

  return isPending ? (
    <Loading />
  ) : (
    <>
      <div className="max-sm:h-screen max-sm:flex max-sm:-mt-10 flex-col justify-center pb-safe">
        <div className="max-md:pt-10 max-md:px-4 md:mb-16">
          <h1 className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary relative">
            Cambusa<span className="text-secondary">Ai</span>
          </h1>

          <p
            className={
              "text-base lg:text-xl text-left text-pretty font-subtitle text-gray-600"
            }
          >
            Crea il menu perfetto per tutto l&apos;equipaggio. Siete pronti a
            salpare? ⛵
          </p>
        </div>

        <div className="w-full items-end">
          <div className="flex flex-col md:flex-row justify-items-center gap-16 items-center ">
            <div className="flex-1 w-full min-h-[520px]">
              <MainForm
                startTransition={startTransition}
                setError={setError}
                onUserReachedApiCallLimit={openDialogStripe}
              />
            </div>
            <div className="flex-1 w-full max-sm:hidden">
              <CreateGroupBox />
            </div>
          </div>
        </div>
        <ToastError error={error} setError={setError} />
      </div>
      <div className="sm:hidden">
        <CreateGroupBox />
      </div>

      <DialogStripe
        isOpen={isDialogStripeOpen}
        setIsOpen={setIsDialogStripeOpen}
      />

      <Image
        alt=""
        height={60}
        width={60}
        src="/apple.png"
        className="absolute top-20 right-28 rotate-12 max-sm:hidden"
      />
      <Image
        alt=""
        height={120}
        width={120}
        src="/basket.png"
        className="absolute top-20 right-40 -rotate-12 max-sm:hidden"
      />
      <Image
        alt=""
        height={80}
        width={80}
        src="/avocado.png"
        className="absolute bottom-10 right-5 sm:right-20 sm-max:hidden max-sm:scale-50"
      />
      <Image
        alt=""
        height={150}
        width={150}
        src="/broccoli.png"
        className="absolute bottom-5 max-sm:left-0 sm:right-[140px] -rotate-12 sm-max:hidden max-sm:scale-50"
      />
    </>
  );
}
