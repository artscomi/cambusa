"use client";
import { Icon } from "@/components/Icons";
import { useMealContext } from "@/context/useMealContext";
import { Ingredient, MenuData } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { useShoppingContext } from "@/context/useShoppingListContext";
import { useRouter } from "next/navigation";
import { containerVariants, itemVariants } from "@/animations/framer-variants";
import { getPrompt } from "@/utils/getPrompt";
import { useFormConfig } from "@/hooks/useFormConfig";

export const MealMenu = () => {
  const { mealList, setMealList } = useMealContext();
  const { setShoppingList } = useShoppingContext();
  const router = useRouter();
  const { formState } = useFormConfig();

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

    setMealList({ ...mealList, menu: updatedMealList });
  };

  const sumIngredients = (mealList: MenuData) => {
    const combinedIngredients = mealList.menu.reduce<Ingredient[]>(
      (acc, mealType) => {
        mealType.meals.forEach((meal) => {
          meal.dishes.forEach((dish) => {
            dish.ingredients.forEach((ingredient) => {
              const existing = acc.find(
                (i) => i.item === ingredient.item && i.unit === ingredient.unit
              );

              if (existing) {
                existing.quantity += ingredient.quantity;
              } else {
                acc.push({ ...ingredient });
              }
            });
          });
        });
        return acc;
      },
      []
    );

    return combinedIngredients;
  };

  const handleCreatehoppingList = () => {
    const combinedIngredients = sumIngredients(mealList);
    setShoppingList(combinedIngredients);
    router.push("/shopping-list");
  };

  return (
    <AnimatePresence mode="popLayout">
      <div className="px-5">
        <p className="text-5xl mb-14 text-center">
          Et voilà! Ecco le proposte di menu
        </p>
        {/* <p className="text-xl mb-6">
       <span><Icon.Delete className="text-red-500" /></span> Elimina il pasto che non ti piace
      </p> */}
        {mealList.menu?.map((mealType) => (
          <>
            {mealType.meals?.length > 0 && (
              <>
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
                          <p className="mb-2 font-semibold">{dish.dishName}</p>
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
                        onClick={() => handleDeleteMeal(mealType.id, meal.id)}
                        className="ml-auto p-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Icon.Delete className="text-red-500" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </>
        ))}
        <div className="text-center">
          <p className="mt-16 mb-10 text-2xl">E adesso?</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCreatehoppingList}
            className="bg-black rounded h-14 text-white p-2 hover:bg-gray-800"
          >
            Genera la lista della spesa!
          </motion.button>
        </div>
      </div>
    </AnimatePresence>
  );
};
