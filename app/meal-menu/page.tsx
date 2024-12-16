'use server';

import { MealList } from "@/components/MealList";
import { getMealListFromDB } from "../api/actions";

const MealMenuPage = async () => {
  const mealList = await getMealListFromDB();
  if (!mealList) return null;
  return <MealList mealListFromDB={JSON.parse(mealList)} />;
};

export default MealMenuPage;
