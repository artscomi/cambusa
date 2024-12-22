import { Dispatch, SetStateAction } from "react";
import { getMaxAiCall } from "./user";
import {
  getMealListFromAi,
  getUserInfo,
  saveMealList,
} from "@/app/api/actions";
import { Result, ResultErrors } from "@/components/MainForm";
import { MealList } from "@/types/types";

export const handleMealListGeneration = async (
  userId: string,
  dietaryPreferences: string,
  groupMeals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    people: string;
  },
  setError: Dispatch<SetStateAction<string | null>>,
  startTransition: (callback: () => void) => void,
  setMealList: (mealList: MealList) => void,
  router: any,
  openDialogStripe: () => void
) => {
  scrollTo(0, 0);
  setError(null);

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
          breakfast: groupMeals.breakfast,
          lunch: groupMeals.lunch,
          dinner: groupMeals.dinner,
          dietaryPreferences,
          people: groupMeals.people,
        },
        userId,
      });

      handleResult(result, setMealList, router, setError);
    } catch (error) {
      setError(
        "Ops.. qualcosa è andato storto durante la generazione del menu"
      );
      console.error(error);
    }
  });
};

const handleResult = async (
  result: Result,
  setMealList: (mealList: MealList) => void,
  router: any,
  setError: Dispatch<SetStateAction<string | null>>
) => {
  if (result.type === "success") {
    setMealList(result.menu);
    await saveMealList(JSON.stringify(result.menu));
    router.push("/meal-menu");
  } else {
    handleError(result, setError);
  }
};

const handleError = (
  result: Result,
  setError: Dispatch<SetStateAction<string | null>>
) => {
  if (result.type === "success") return;

  const errorMessages: Record<ResultErrors["type"], string> = {
    "user-not-found": "Utente non trovato.",
    "validation-error": "Il formato della ricetta non è valido.",
    "parse-error": "Impossibile analizzare i dati della ricetta.",
    "unknown-error": "Ops... qualcosa è andato storto.",
  };

  const message = errorMessages[result.type] || "An unknown error occurred.";
  setError(message);
  console.error(message);
};
