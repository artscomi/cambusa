"use client";

import {
  getMealListFromAi,
  getUserInfo,
} from "@/app/api/actions";
import { Button } from "@/components/Button";
import { useFormConfig } from "@/hooks/useFormConfig";
import { useRouter } from "next/navigation";
import React, { startTransition } from "react";
import { useMealContext } from "@/context/useMealContext";
import { useClerk, useUser } from "@clerk/nextjs";
import { getMaxAiCall } from "@/utils/user";
import { Result, ResultErrors } from "@/components/MainForm";
import { useStripeModal } from "@/context/useStripeModalContext";

export const ButtonGenerateMealList: React.FC<{
  userId: string;
  dietaryPreferences: string;
  groupMeals: { lunch: string; dinner: string };
}> = ({ userId, dietaryPreferences, groupMeals }) => {
  const { inputConfig, formState } = useFormConfig(true);
  const { setMealList } = useMealContext();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { openDialogStripe } = useStripeModal();

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
    // setError(message);
    console.error(message);
  };

  const handleResult = (result: Result) => {
    if (result.type === "success") {
      setMealList(result.menu);
      router.push("/meal-menu");
    } else {
      handleError(result);
    }
  };

  const handleCtaClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    scrollTo(0, 0);
    // setError(null);

    console.log({ user });
    console.log({ isLoaded });

    if (!userId) {
      openSignIn();
      return;
    }

    const { apiCallCount, hasPaidForIncrease } = await getUserInfo();
    const maxAiCall = getMaxAiCall(hasPaidForIncrease);

    if (apiCallCount && apiCallCount >= maxAiCall) {
      openDialogStripe();
      return;
    }

    startTransition(async () => {
      try {
        const result = await getMealListFromAi({
          formValues: {
            breakfast: "2",
            lunch: groupMeals.lunch,
            dinner: groupMeals.dinner,
            dietaryPreferences,
            people: "4",
          },
          userId,
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
        // setError(
        //   "Ops.. qualcosa è andato storto durante la generazione del menu"
        // );
        console.error(error);
      }
    });
  };

  return <Button onClick={handleCtaClick}>Genera il menu</Button>;
};
