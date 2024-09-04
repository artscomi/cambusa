import { useMealContext } from "@/context/useMealContext";
import { AnimatePresence, motion } from "framer-motion";
import { Meal, MenuData } from "@/types/types";
import { MealItem } from "./MealItem";

interface MealCategoryProps {
  category: keyof MenuData;
  meals: Meal;
}

export const MealCategory = ({ category, meals }: MealCategoryProps) => {
  const { setMealList, mealList } = useMealContext();

  const handleDeleteMeal = (meal: string) => {
    const updatedMenu: MenuData = {
      ...mealList,
      [category]: {
        ...(mealList?.[category] || {}),
      },
    };

    if (updatedMenu[category]) {
      delete updatedMenu[category][meal];

      if (Object.keys(updatedMenu[category]).length === 0) {
        delete updatedMenu[category];
      }
    }

    setMealList(updatedMenu);
  };

  return (
    <div className="gap-5 grid lg:grid-cols-3 mb-5">
      <AnimatePresence>
        {Object.keys(meals).map((meal) => (
          <motion.div
            layout
            transition={{ type: "spring" }}
            key={meal}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            initial={{ scale: 0.8, opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-lg flex-1 h-full min-h-[400px]">
              <button onClick={() => handleDeleteMeal(meal)}>Delete</button>
              <MealItem meal={meals[meal]} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
