"use client";

import { CTA } from "@/components/CTA";
import { useMealContext } from "@/context/useMealContext";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { handleMealListGeneration } from "@/utils/mealUtils";
import { useStripeModal } from "@/context/useStripeModalContext";

export const ButtonGenerateMealList: React.FC<{
  startTransition: (callback: () => void) => void;
  setError: Dispatch<SetStateAction<string | null>>;
  userId: string;
  dietaryPreferences: string;
  alcoholPreferences: string;
  waterPreference: string;
  groupMeals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    people: string;
    sameBreakfast: boolean;
  };
  groupAlcoholPreferences: Array<{
    userId: string;
    preference: string;
    user: { name: string };
  }>;
  groupId?: string;
}> = ({
  userId,
  dietaryPreferences,
  alcoholPreferences,
  waterPreference,
  groupMeals,
  groupAlcoholPreferences,
  startTransition,
  setError,
  groupId,
}) => {
  const {
    setMealList,
    setAlcoholPreferences,
    setWaterPreference,
    setPeople,
    setDays,
    setGroupAlcoholPreferences,
    setCurrentGroupId,
  } = useMealContext();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { openDialogStripe } = useStripeModal();

  const handleCtaClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!userId) {
      openSignIn();
      return;
    }

    await handleMealListGeneration(
      userId,
      dietaryPreferences,
      alcoholPreferences,
      waterPreference,
      groupMeals,
      setError,
      startTransition,
      setMealList,
      setAlcoholPreferences,
      setWaterPreference,
      setPeople,
      setDays,
      setGroupAlcoholPreferences,
      router,
      openDialogStripe,
      groupAlcoholPreferences,
      groupId,
      setCurrentGroupId
    );
  };

  return (
    <CTA variant="accent" full onClick={handleCtaClick}>
      Genera il menu
    </CTA>
  );
};
