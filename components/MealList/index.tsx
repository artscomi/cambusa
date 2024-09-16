"use client";
import { Icon } from "@/components/Icons";
import { useMealContext } from "@/context/useMealContext";
import { AnimatePresence, motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations/framer-variants";
import { EmptyMealList } from "./EmptyMealList";
import { CreateShoppingListCta } from "./CreateShoppingListCta";

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
      <div className="px-5 py-10 max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-14">
          Et voilà! Ecco le proposte di menu
        </h1>
        {mealList.menu.length === 0 ? (
          <EmptyMealList />
        ) : (
          <motion.div key="meal-list" exit={{ opacity: 0 }}>
            {mealList.menu?.map(
              (mealType) =>
                mealType.meals?.length > 0 && (
                  <motion.div key={mealType.id} exit={{ opacity: 0 }}>
                    <h2 className="py-3 mb-5 text-2xl font-semibold text-gray-700 bg-gray-50 text-center rounded-lg shadow-sm">
                      {mealType.mealTypeName}
                    </h2>
                    <motion.div
                      key={mealType.id}
                      className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mb-8"
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
                          className="bg-white p-6 rounded-lg h-full shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between group cursor-pointer"
                        >
                          {meal.dishes?.map((dish) => (
                            <ul key={dish.id} className="mb-5">
                              <p className="mb-3 font-bold text-gray-800">
                                {dish.dishName}
                              </p>
                              {dish.ingredients?.map(
                                (ingredient, ingredientIndex) => (
                                  <li
                                    key={ingredientIndex}
                                    className="text-gray-600"
                                  >
                                    {ingredient.item} -{" "}
                                    <span className="font-medium">
                                      {ingredient.quantity}
                                    </span>
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
                            className="ml-auto text-red-500 opacity-80 hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 p-2 rounded"
                          >
                            <Icon.Delete className="text-red-500" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )
            )}
            <CreateShoppingListCta />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
