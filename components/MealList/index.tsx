"use client";
import { useMealContext } from "@/context/useMealContext";
import { AnimatePresence, motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations/framer-variants";
import { EmptyMealList } from "./EmptyMealList";
import { CreateShoppingListCta } from "./CreateShoppingListCta";
import { useUser } from "@clerk/nextjs";
import { useFormConfig } from "@/hooks/useFormConfig";
import { MenuData } from "@/types/types";
import { getMaxAiCall } from "@/utils/user";
import { useState } from "react";
import { DialogStripe } from "../ui/dialogs/Stripe";
import { getUserInfo, regenerateSingleMeal } from "@/app/api/actions";
import { RefreshCcw, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), {
  ssr: false,
});

export const MealList = () => {
  const { mealList, setMealList } = useMealContext();
  const { user } = useUser();
  const { formState } = useFormConfig();
  const [isDialogStripeOpen, setIsDialogStripeOpen] = useState(false);
  const [loadingMealId, setLoadingMealId] = useState<string | null>(null);

  const openDialogStripe = () => {
    setIsDialogStripeOpen(true);
  };

  if (!mealList || Object.keys(mealList).length === 0) {
    return;
  }

  const findMealById = (mealList: MenuData, mealId: string) => {
    for (const mealType of mealList.menu) {
      const foundMeal = mealType.meals.find((meal) => meal.id === mealId);
      if (foundMeal) {
        return foundMeal;
      }
    }
    return null;
  };

  const handleRegenerateMeal = async (mealTypeId: string, mealId: string) => {
    const { apiCallCount, hasPaidForIncrease } = await getUserInfo();
    const maxAiCall = getMaxAiCall(hasPaidForIncrease);

    if (apiCallCount && apiCallCount >= maxAiCall) {
      openDialogStripe();
      return;
    }

    setLoadingMealId(mealId);

    const mealToRegenerate = findMealById(mealList, mealId);
    if (!mealToRegenerate) return;

    try {
      if (!user) return null;
      const response = await regenerateSingleMeal({
        dietaryPreferences: formState.dietaryPreferences,
        userId: user.id,
        meal: mealToRegenerate,
      });

      if (response.type === "success") {
        const updatedMealList = mealList.menu.map((mealType) => {
          if (mealType.id === mealTypeId) {
            return {
              ...mealType,
              meals: mealType.meals.map((meal) =>
                meal.id === mealId ? response.meal : meal
              ),
            };
          }
          return mealType;
        });

        setMealList({ ...mealList, menu: updatedMealList });
      }
    } catch (error) {
      console.error("Failed to regenerate meal", error);
    } finally {
      setLoadingMealId(null);
    }
  };

  const handleDeleteMeal = async (mealTypeId: string, mealId: string) => {
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
    <AnimatePresence mode="sync">
      <div className="px-5 pb-10 max-w-screen-xl mx-auto">
        <h1>Et voilà! Ecco le proposte di menu</h1>
        {mealList.menu.length === 0 ? (
          <EmptyMealList />
        ) : (
          <motion.div key="meal-list" exit={{ opacity: 0 }}>
            {mealList.menu?.map(
              (mealType) =>
                mealType.meals?.length > 0 && (
                  <motion.div key={mealType.id} exit={{ opacity: 0 }}>
                    <h2 className="py-3 text-2xl font-semibold">
                      {mealType.mealTypeName}
                    </h2>
                    <motion.div
                      key={mealType.id}
                      className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] mb-8"
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                    >
                      {mealType.meals?.map((meal) => (
                        <motion.div
                          layout
                          key={meal.id}
                          variants={itemVariants}
                          className="bg-white p-6 rounded-lg h-full shadow-md flex flex-col justify-between relative overflow-hidden"
                        >
                          {loadingMealId === meal.id && (
                            <div className="absolute left-0 right-0 top-0 z-10 bg-white bg-opacity-80">
                              <LottieAnimation
                                name="waveBig"
                                isResponsive={false}
                              />
                            </div>
                          )}
                          {meal.dishes?.map((dish) => (
                            <ul key={dish.id} className="mb-5">
                              <p className="mb-3 font-bold  text-lg">
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
                                      {ingredient.quantity} {ingredient.unit}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          ))}
                          <div className="flex justify-end opacity-80 hover:opacity-100">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                handleRegenerateMeal(mealType.id, meal.id)
                              }
                              className="p-2 rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-300"
                            >
                              <RefreshCcw className="text-primary" width={25} />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                handleDeleteMeal(mealType.id, meal.id)
                              }
                              className="p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors duration-300 ml-2"
                            >
                              <Trash2 className="text-red-500" />
                            </motion.button>
                          </div>
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

      <DialogStripe
        isOpen={isDialogStripeOpen}
        setIsOpen={setIsDialogStripeOpen}
      />
    </AnimatePresence>
  );
};
