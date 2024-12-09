import { MealList } from "@/components/MealList";
import { getMealListFromDB, saveMealList } from "../api/actions";

const MyMenuPage = async () => {
  const mealList = await getMealListFromDB();
  if (!mealList) return null;
  return <MealList mealListFromDB={JSON.parse(mealList)} />;
};

export default MyMenuPage;
