"use client";

import { useFormConfig } from "@/hooks/useFormConfig";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Button } from "@/components/Button";
import { useMealContext } from "@/context/useMealContext";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { handleMealListGeneration } from "@/utils/mealUtils";
import { useStripeModal } from "@/context/useStripeModalContext";
import { GroupData, MealList } from "@/types/types";
import { TextInput } from "../TextInput";
import dynamic from "next/dynamic";

export type Result = { type: "success"; menu: MealList } | ResultErrors;

export type ResultErrors =
  | { type: "parse-error"; text: string }
  | { type: "validation-error"; value: unknown }
  | { type: "unknown-error"; error: unknown }
  | { type: "user-not-found"; error: unknown }

export const MainForm = ({
  groupData,
  startTransition,
  setError,
}: {
  setError: Dispatch<SetStateAction<null | string>>;
  groupData?: GroupData;
  startTransition: (callback: () => void) => void;
}) => {
  const { inputConfig, formState } = useFormConfig(true);
  const { setMealList } = useMealContext();
  const { dietaryPreferences, people } = formState;
  const { user } = useUser();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { openDialogStripe } = useStripeModal();
  const LottieAnimation = useMemo(
    () =>
      dynamic(() => import("@/components/LottieAnimation"), {
        ssr: false,
      }),
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sessionStorage.setItem("formState", JSON.stringify(formState));

    if (!user) {
      openSignIn();
      return;
    }

    await handleMealListGeneration(
      user.id,
      dietaryPreferences,
      {
        breakfast: formState.breakfast,
        lunch: formState.lunch,
        dinner: formState.dinner,
        people,
      },
      setError,
      startTransition,
      setMealList,
      router,
      openDialogStripe
    );
  };

  return (
    <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden sm:bg-white">
      {groupData ? (
        <h1 className="mb-10 text-3xl">{`Genera la tua cambusa per il gruppo ${groupData.id}`}</h1>
      ) : (
        <h2 className="mb-10 text-xl text-primary font-semibold max-sm:hidden">
          Siete un piccolo gruppo?
          <span className="block text-base text-gray-500 font-normal">
            Compila il form e genera subito il menu
          </span>
        </h2>
      )}

      <form className="flex-1 z-10 relative" onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-4">
          {inputConfig.map((config) => (
            <TextInput key={config.id} {...config} />
          ))}
        </div>

        <Button type="submit" full>
          Crea il menu
        </Button>
      </form>

      <div className="absolute left-0 right-0 top-0 bottom-0 sm:overflow-hidden sm:hidden">
        <LottieAnimation name="waveBig" isResponsive={false} speed={0.1} />
      </div>
    </div>
  );
};
