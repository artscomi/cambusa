"use client";
import { Icon } from "@/components/Icons";
import { useMealContext } from "@/context/useMealContext";
import { AnimatePresence, motion } from "framer-motion";

export const MealMenu = () => {
  const { mealList, setMealList } = useMealContext();

  if (!mealList || Object.keys(mealList).length === 0) {
    return;
  }

  const handleDeleteMeal = (mealTypeId: number, mealId: number) => {
    const updatedMealList = mealList.menu.map((mealType) => {
      if (mealType.id === mealTypeId) {
        return {
          ...mealType,
          meals: mealType.meals.filter((meal) => meal.id !== mealId),
        };
      }
      return mealType;
    });

    setMealList({ ...mealList, menu: updatedMealList });
  };

  return (
    <AnimatePresence>
      {mealList.menu?.map((mealType) => (
        <>
          {mealType.meals?.length > 0 && (
            <>
              <h2 className="font-bold my-5 text-lg">{mealType.mealTypeName}</h2>
              <div key={mealType.id} className="gap-5 grid lg:grid-cols-3 mb-5">
                {mealType.meals?.map((meal) => (
                  <motion.div
                    layout
                    transition={{ type: "spring" }}
                    key={meal.id}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    className="bg-white p-6 rounded-lg flex-1 h-full min-h-[350px] flex justify-between flex-col group"
                  >
                    {meal.dishes?.map((dish) => (
                      <ul key={dish.id} className="mb-5">
                        <p className="mb-2 font-bold">{dish.dishName}</p>
                        {dish.ingredients?.map(
                          (ingredient, ingredientIndex) => (
                            <li key={ingredientIndex}>
                              {ingredient.item} {ingredient.quantity}
                            </li>
                          )
                        )}
                      </ul>
                    ))}
                    <button
                      onClick={() => handleDeleteMeal(mealType.id, meal.id)}
                      className="ml-auto p-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Icon.Delete className="text-red-500" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </>
      ))}
    </AnimatePresence>
  );
};
