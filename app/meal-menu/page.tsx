import { MealListComponent } from "@/components/MealList";
import { getMealListFromDB } from "../api/actions";

const MealMenuPage = async () => {
  const mealListFromDB = await getMealListFromDB();
  if (!mealListFromDB) return null;

  return <MealListComponent savedMealList={JSON.parse(mealListFromDB)} />;
};

export default MealMenuPage;
