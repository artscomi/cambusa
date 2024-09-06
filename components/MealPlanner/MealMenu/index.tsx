"use client"
import { useMealContext } from "@/context/useMealContext";
import { MealCategory } from "./MealCategory";

export const MealMenu = () => {
  const { mealList } = useMealContext();

  if (!mealList || Object.keys(mealList).length === 0) {
    return;
  }

  return (
    <div className="m-5 mb-20">
      {mealList["Colazioni"] && (
        <>
          <h2 className="text-xl font-bold mb-5">Colazioni</h2>
          <MealCategory category="Colazioni" meals={mealList["Colazioni"]} />
        </>
      )}

      {mealList["Pranzi"] && (
        <>
          <h2 className="text-xl font-bold mb-5">Pranzi</h2>
          <MealCategory category="Pranzi" meals={mealList["Pranzi"]} />
        </>
      )}

      {mealList["Cene"] && (
        <>
          <h2 className="text-xl font-bold mb-5">Cene</h2>
          <MealCategory category="Cene" meals={mealList["Cene"]} />
        </>
      )}
    </div>
  );
};
