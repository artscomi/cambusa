import { Dispatch, SetStateAction } from "react";
import {
  getMaxAiCall,
  getMealListFromAi,
  getUserInfo,
  saveMealList,
} from "@/app/api/actions";
import { Result, ResultErrors } from "@/components/MainForm";
import { MealList } from "@/types/types";

export const handleMealListGeneration = async (
  userId: string,
  dietaryPreferences: string,
  alcoholPreferences: string,
  waterPreference: string,
  groupMeals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    people: string;
    sameBreakfast: boolean;
  },
  setError: Dispatch<SetStateAction<string | null>>,
  startTransition: (callback: () => void) => void,
  setMealList: (mealList: MealList) => void,
  setAlcoholPreferences: (preferences: string) => void,
  setWaterPreference: (preference: string) => void,
  setPeople: (people: number) => void,
  setDays: (days: number) => void,
  setGroupAlcoholPreferences: (
    preferences:
      | Array<{ userId: string; preference: string; user: { name: string } }>
      | undefined
  ) => void,
  router: any,
  openDialogStripe: () => void,
  groupAlcoholPreferences?: Array<{
    userId: string;
    preference: string;
    user: { name: string };
  }>
) => {
  scrollTo(0, 0);
  setError(null);


  const { apiCallCount, hasPaidForIncrease } = await getUserInfo();
  const maxAiCall = await getMaxAiCall(hasPaidForIncrease);

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
          alcoholPreferences,
          waterPreference,
          people: groupMeals.people,
          sameBreakfast: groupMeals.sameBreakfast,
        },
        userId,
      });

      handleResult(
        result,
        setMealList,
        setAlcoholPreferences,
        alcoholPreferences,
        setWaterPreference,
        waterPreference,
        setPeople,
        parseInt(groupMeals.people),
        setDays,
        parseInt(groupMeals.dinner),
        setGroupAlcoholPreferences,
        groupAlcoholPreferences,
        router,
        setError
      );
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
  setAlcoholPreferences: (preferences: string) => void,
  alcoholPreferences: string,
  setWaterPreference: (preference: string) => void,
  waterPreference: string,
  setPeople: (people: number) => void,
  people: number,
  setDays: (days: number) => void,
  days: number,
  setGroupAlcoholPreferences: (
    preferences:
      | Array<{ userId: string; preference: string; user: { name: string } }>
      | undefined
  ) => void,
  groupAlcoholPreferences:
    | Array<{ userId: string; preference: string; user: { name: string } }>
    | undefined,
  router: any,
  setError: Dispatch<SetStateAction<string | null>>
) => {
  if (result.type === "success") {
    setMealList(result.menu);
    setAlcoholPreferences(alcoholPreferences);
    setWaterPreference(waterPreference);
    setPeople(people);
    setDays(days);
    setGroupAlcoholPreferences(groupAlcoholPreferences);
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

  // Type guard per accedere a result.error in modo sicuro
  if (result.type === "unknown-error" || result.type === "user-not-found") {
    console.error(result.error);
  } else if (result.type === "parse-error") {
    console.error(result.text);
  } else if (result.type === "validation-error") {
    console.error(result.value);
  }
};
