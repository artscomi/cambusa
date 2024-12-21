import { MealListComponent } from "@/components/MealList";
import { getMealListFromDB, saveMealList } from "../api/actions";

const MyMenuPage = async () => {
  const mealList = await getMealListFromDB();
  if (!mealList) return null;
  
  return <MealListComponent savedMealList={JSON.parse(mealList)} />;
};

export default MyMenuPage;
