"use client";
import { Icon } from "@/components/Icons";
import { useMealContext } from "@/context/useMealContext";
import { AnimatePresence, motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

export const MealMenu = () => {
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

    setMealList({ ...mealList, menu: updatedMealList });
  };

  return (
    <AnimatePresence>
      <p className="text-5xl mb-14 text-center">Et voilà! Ecco le proposte di menu</p>
      {/* <p className="text-xl mb-6">
       <span><Icon.Delete className="text-red-500" /></span> Elimina il pasto che non ti piace
      </p> */}
      {mealList.menu?.map((mealType) => (
        <>
          {mealType.meals?.length > 0 && (
            <>
              <h2 className="py-2 mb-5 text-2xl bg-white text-center">{mealType.mealTypeName}</h2>
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
                    transition={{ type: "spring" }}
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
                    <button
                      onClick={() => handleDeleteMeal(mealType.id, meal.id)}
                      className="ml-auto p-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Icon.Delete className="text-red-500" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </>
      ))}
      <div className="text-center">
        <p className="mt-16 mb-10 text-2xl">E adesso?</p>
        <button
          type="submit"
          className="bg-black rounded h-14 text-white p-2 hover:bg-gray-800"
        >
          Genera la lista della spesa!
        </button>
      </div>
    </AnimatePresence>
  );
};
