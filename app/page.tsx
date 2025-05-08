"use client";

import { CreateGroupBox } from "@/components/CreateGroupBox";
import { Loading } from "@/components/Loading";
import { MainForm } from "@/components/MainForm";
import { ToastError } from "@/components/ToastError";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";
import { resetApiCallCount } from "./api/actions";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successPayment, setSuccessPayment] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchStripeState = async () => {
      return fetch(
        `/api/checkout-sessions?session_id=${searchParams.get("session_id")}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then(async (data) => {
          if (data.status === "complete") {
            try {
              await resetApiCallCount();
              console.log("API call count reset successfully");
              setSuccessPayment(true);
            } catch (e) {
              console.error("Error resetting API call count:");
            }
          } else {
            throw new Error("Pagamento non completato, riprova");
          }
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    };

    if (searchParams.get("session_id")) {
      fetchStripeState();
    }
  }, [searchParams]);

  return isPending ? (
    <Loading />
  ) : (
    <>
      <div className="max-sm:flex max-sm:-mt-10 flex-col justify-center pb-safe">
        <div className="max-md:pt-10 max-md:px-4 md:mb-16 max-w-[800px]">
          <h1 className="text-6xl font-display font-bold relative">
            <Link href="/">
              Cambusa<span className="text-secondary">ai</span>
            </Link>
          </h1>

          <p
            className={
              "text-base lg:text-xl text-left text-pretty font-subtitle text-gray-700 mb-2"
            }
          >
            Crea il menu perfetto per tutto l&apos;equipaggio. Siete pronti a
            salpare? ⛵
          </p>
          <p className="text-s text-pretty font-subtitle text-gray-500 max-sm:hidden">
            Con cambusaai puoi creare un menu personalizzato, modificare i
            piatti e generare una lista cambusa completa per una settimana in
            barca.
          </p>
        </div>

        <div className="w-full items-end">
          <div className="flex flex-col md:flex-row justify-items-center gap-16 items-center ">
            <div className="flex-1 w-full">
              <MainForm startTransition={startTransition} setError={setError} />
            </div>
            <div className="flex-1 w-full max-sm:hidden">
              <CreateGroupBox />
            </div>
          </div>
        </div>
        <ToastError error={error} setError={setError} />
        <Toast
          message="Pagamento effettuato con successo!"
          type="success"
          onClose={() => setSuccessPayment(false)}
          showToast={successPayment}
        />
      </div>
      <div className="sm:hidden">
        <CreateGroupBox />
      </div>

      <Image
        alt=""
        height={60}
        width={60}
        priority
        src="/apple.png"
        className="absolute top-20 right-28 rotate-12 max-sm:hidden w-auto h-auto"
      />
      <Image
        alt=""
        height={120}
        width={120}
        src="/basket.png"
        priority
        className="absolute top-20 right-40 -rotate-12 max-sm:hidden w-auto h-auto"
      />
      <Image
        alt=""
        height={80}
        width={80}
        src="/avocado.png"
        priority
        className="absolute bottom-36 right-5 sm:right-20 sm-max:hidden max-sm:scale-50 w-auto h-auto"
      />
      <Image
        alt=""
        height={150}
        width={150}
        src="/broccoli.png"
        priority
        className="absolute bottom-36 max-sm:left-0 sm:right-[140px] -rotate-12 sm-max:hidden max-sm:scale-50 w-auto h-auto"
      />
    </>
  );
}
