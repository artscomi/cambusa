"use client";
import { Icon } from "@/components/Icons";
import { useMealContext } from "@/context/useMealContext";
import { AnimatePresence, motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations/framer-variants";
import { EmptyMealList } from "./EmptyMealList";

export const MealList = () => {
  const { mealList, setMealList } = useMealContext();

  if (!mealList || Object.keys(mealList).length === 0) {
    return;
  }

  const handleDeleteMeal = (mealTypeId: string, mealId: string) => {
    const updatedMealList = mealList.menu.map((mealType) => {
      if (mealType.id === mealTypeId) {
        return {
          ...mealType,
          meals: mealType.meals.filter((meal) => meal.id !== mealId),
        };
      }
      return mealType;
    });

    const cleanedMealList = updatedMealList.filter(
      (mealType) => mealType.meals.length > 0
    );

    setMealList({ ...mealList, menu: cleanedMealList });
  };

  return (
    <AnimatePresence mode="wait">
      <div className="px-5">
        <p className="text-5xl mb-14 text-center">
          Et voilà! Ecco le proposte di menu
        </p>
        {mealList.menu.length === 0 ? (
          <EmptyMealList />
        ) : (
          <motion.div key="meal-list" exit={{ opacity: 0 }}>
            {mealList.menu?.map(
              (mealType) =>
                mealType.meals?.length > 0 && (
                  <motion.div key={mealType.id} exit={{ opacity: 0 }}>
                    <h2 className="py-2 mb-5 text-2xl bg-white text-center">
                      {mealType.mealTypeName}
                    </h2>
                    <motion.div
                      key={mealType.id}
                      className="gap-5 grid lg:grid-cols-4 mb-5"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={containerVariants}
                    >
                      {mealType.meals?.map((meal) => (
                        <motion.div
                          layout
                          key={meal.id}
                          variants={itemVariants}
                          className="bg-white p-6 rounded-lg flex-1 h-full min-h-[300px] flex justify-between flex-col shadow-md group"
                        >
                          {meal.dishes?.map((dish) => (
                            <ul key={dish.id} className="first:mb-5">
                              <p className="mb-2 font-semibold">
                                {dish.dishName}
                              </p>
                              {dish.ingredients?.map(
                                (ingredient, ingredientIndex) => (
                                  <li key={ingredientIndex}>
                                    {ingredient.item} {ingredient.quantity}
                                  </li>
                                )
                              )}
                            </ul>
                          ))}
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() =>
                              handleDeleteMeal(mealType.id, meal.id)
                            }
                            className="ml-auto p-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <Icon.Delete className="text-red-500" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )
            )}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
