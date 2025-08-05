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
  console.log("🚀 handleMealListGeneration started with userId:", userId);
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log("📝 Group meals:", groupMeals);
  console.log("🍽️ Dietary preferences:", dietaryPreferences);
  scrollTo(0, 0);
  setError(null);

  try {
    console.log("📞 Calling getUserInfo with userId:", userId);
    const { apiCallCount, hasPaidForIncrease } = await getUserInfo(userId);
    console.log("📊 User info received:", { apiCallCount, hasPaidForIncrease });
    
    console.log("📞 Calling getMaxAiCall");
    const maxAiCall = await getMaxAiCall(hasPaidForIncrease, userId);
    console.log("📊 Max AI call:", maxAiCall);

    if (apiCallCount && apiCallCount >= maxAiCall) {
      console.log("⚠️ User has reached API call limit");
      openDialogStripe();
      return;
    }
    
    console.log("✅ Starting meal generation...");
    console.log("🔄 About to call startTransition...");
    startTransition(async () => {
      console.log("🔄 Inside startTransition callback");
      try {
        console.log("📞 Calling getMealListFromAi");
        console.log("📝 Form values being passed:", {
          breakfast: groupMeals.breakfast,
          lunch: groupMeals.lunch,
          dinner: groupMeals.dinner,
          dietaryPreferences,
          alcoholPreferences,
          waterPreference,
          people: groupMeals.people,
          sameBreakfast: groupMeals.sameBreakfast,
        });
        
        console.log("🔍 About to call getMealListFromAi with userId:", userId);
        console.log("🔍 getMealListFromAi function exists:", typeof getMealListFromAi);
        console.log("🔍 About to await getMealListFromAi...");
        
        // Create a plain object to avoid serialization issues
        const formValuesPlain = {
          breakfast: groupMeals.breakfast,
          lunch: groupMeals.lunch,
          dinner: groupMeals.dinner,
          dietaryPreferences,
          alcoholPreferences,
          waterPreference,
          people: groupMeals.people,
          sameBreakfast: groupMeals.sameBreakfast,
        };
        
        console.log("🔍 Form values being passed (plain object):", formValuesPlain);
        console.log("🔍 Form values type:", typeof formValuesPlain);
        console.log("🔍 Form values constructor:", formValuesPlain.constructor.name);
        
        // Check each value individually
        console.log("🔍 Individual value checks:");
        console.log("  - breakfast:", typeof groupMeals.breakfast, groupMeals.breakfast);
        console.log("  - lunch:", typeof groupMeals.lunch, groupMeals.lunch);
        console.log("  - dinner:", typeof groupMeals.dinner, groupMeals.dinner);
        console.log("  - dietaryPreferences:", typeof dietaryPreferences, dietaryPreferences);
        console.log("  - alcoholPreferences:", typeof alcoholPreferences, alcoholPreferences);
        console.log("  - waterPreference:", typeof waterPreference, waterPreference);
        console.log("  - people:", typeof groupMeals.people, groupMeals.people);
        console.log("  - sameBreakfast:", typeof groupMeals.sameBreakfast, groupMeals.sameBreakfast);
        console.log("  - userId:", typeof userId, userId);
        
        // Try to JSON.stringify to test serialization
        try {
          const testSerialization = JSON.stringify(formValuesPlain);
          console.log("✅ Form values can be serialized:", testSerialization.length, "characters");
        } catch (serializationError) {
          console.error("❌ Form values cannot be serialized:", serializationError);
        }

        let result;
        try {
          result = await getMealListFromAi({
            formValues: formValuesPlain,
            userId,
          });
          console.log("✅ getMealListFromAi call completed successfully");
        } catch (serverActionError) {
          console.error("❌ Server action error:", serverActionError);
          console.error("❌ Server action error details:", {
            message: serverActionError instanceof Error ? serverActionError.message : String(serverActionError),
            stack: serverActionError instanceof Error ? serverActionError.stack : undefined,
            name: serverActionError instanceof Error ? serverActionError.name : 'Unknown'
          });
          throw serverActionError;
        }

        console.log("📊 getMealListFromAi result:", result);

        handleResult(
          result,
          userId,
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
        console.error("❌ Error in meal generation:", error);
        console.error("❌ Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : 'Unknown'
        });
        setError(
          "Ops.. qualcosa è andato storto durante la generazione del menu"
        );
        console.error(error);
      }
    });
    console.log("✅ startTransition called successfully");
  } catch (error) {
    console.error("❌ Error in handleMealListGeneration:", error);
    setError("Errore durante la verifica dell'utente");
  }
};

const handleResult = async (
  result: Result,
  userId: string,
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
    await saveMealList(JSON.stringify(result.menu), userId);
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
