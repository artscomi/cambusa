import { useMealContext } from "@/context/useMealContext";
import { useShoppingContext } from "@/context/useShoppingListContext";
import { Ingredient, MenuData } from "@/types/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const CreateShoppingListCta = () => {
  const { setShoppingList } = useShoppingContext();
  const { mealList } = useMealContext();
  const router = useRouter();

  if (!mealList) {
    return;
  }

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
    <motion.div className="text-center" exit={{ opacity: 0 }}>
      <p className="mt-16 mb-10 text-2xl">E adesso?</p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleCreatehoppingList}
        className="bg-black rounded h-14 text-white p-2 hover:bg-gray-800"
      >
        Genera la lista della spesa!
      </motion.button>
    </motion.div>
  );
};
