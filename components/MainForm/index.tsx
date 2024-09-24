"use client";

import { TextInput } from "../TextInput";
import { useFormConfig } from "@/hooks/useFormConfig";
import { useMealContext } from "@/context/useMealContext";
import { GroupData, MenuData } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../Button";
import LottieAnimation from "../LottieAnimation";
import { useClerk, useUser } from "@clerk/nextjs";
import { getMealListFromAi } from "@/app/api/generate-meal-menu/actions";
import { Loading } from "../Loading";
import { mockMealList } from "@/utils/mockMealList";
import { DialogStripe } from "../ui/dialogs/Stripe";
import { getMaxAiCall } from "@/utils/user";
import { getUserInfo } from "@/app/api/get-user-info/actions";

export const MainForm = ({
  groupData,
  startTransition,
  setError,
  onUserReachedApiCallLimit,
}: {
  setError: Dispatch<SetStateAction<null | string>>;
  groupData?: GroupData;
  startTransition: (callback: () => void) => void;
  onUserReachedApiCallLimit: VoidFunction;
}) => {
  const { inputConfig, formState } = useFormConfig();
  const { setMealList } = useMealContext();
  const { breakfast, lunch, dinner, dietaryPreferences, people } = formState;
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { openSignIn } = useClerk();

  type Result = { type: "success"; menu: MenuData } | ResultErrors;

  type ResultErrors =
    | { type: "parse-error"; text: string }
    | { type: "validation-error"; value: unknown }
    | { type: "unknown-error"; error: unknown }
    | { type: "user-not-found"; error: unknown }
    | { type: "user-limit-error"; error: unknown };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    scrollTo(0, 0);
    setError(null);

    console.log({ user });
    console.log({ isLoaded });

    if (!user) {
      openSignIn();
      return;
    }

    const { apiCallCount, hasPaidForIncrease } = await getUserInfo();
    const maxAiCall = getMaxAiCall(hasPaidForIncrease);

    if (apiCallCount && apiCallCount >= maxAiCall) {
      onUserReachedApiCallLimit();
      return;
    }

    startTransition(async () => {
      try {
        const result = await getMealListFromAi({
          formValues: {
            breakfast,
            lunch,
            dinner,
            dietaryPreferences,
            people,
          },
          userId: user.id,
        });

        // const result = await new Promise<Result>((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve({
        //       type: "success",
        //       menu: mockMealList,
        //     });

        //     // reject(new Error("Simulated API error"));
        //   }, 2000);
        // });

        handleResult(result);
      } catch (error) {
        setError(
          "Ops.. qualcosa è andato storto durante la generazione del menu"
        );
        console.error(error);
      }
    });
  };

  const handleResult = (result: Result) => {
    if (result.type === "success") {
      setMealList(result.menu);
      router.push("/meal-menu");
    } else {
      handleError(result);
    }
  };

  const handleError = (result: Result) => {
    if (result.type === "success") return;

    const errorMessages: Record<ResultErrors["type"], string> = {
      "user-not-found": "User not found",
      "validation-error": "Recipe format is invalid.",
      "user-limit-error": "",
      "parse-error": "Failed to parse recipe data.",
      "unknown-error": "Ops..qualcosa è andato storto",
    };

    const message = errorMessages[result.type] || "An unknown error occurred.";
    setError(message);
    console.error(message);
  };

  return (
    <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden sm:bg-white">
      {groupData && (
        <h1 className="mb-10 text-3xl">{`Genera la tua cambusa per il gruppo ${groupData.id}`}</h1>
      )}

      <form className="flex-1 z-10 relative" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-10">
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
