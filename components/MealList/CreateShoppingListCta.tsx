import { useMealContext } from "@/context/useMealContext";
import { useShoppingContext } from "@/context/useShoppingListContext";
import { sumIngredients, combineIngredients } from "@/utils/ingredients";
import {
  generateAlcoholIngredients,
  generateGroupAlcoholIngredients,
  generateWaterIngredients,
} from "@/utils/alcoholUtils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Ingredient } from "@/types/types";

export const CreateShoppingListCta = () => {
  const { setShoppingList } = useShoppingContext();
  const {
    mealList,
    alcoholPreferences,
    waterPreference,
    people,
    days,
    groupAlcoholPreferences,
  } = useMealContext();
  const router = useRouter();

  if (!mealList) {
    return;
  }

  const handleCreatehoppingList = () => {
    const foodIngredients = sumIngredients(mealList) as Ingredient[];

    // Use days from context, default to 1 if not available
    const totalDays = days || 1;

    // Use people count from context, default to 1 if not available
    const peopleCount = people || 1;

    // Generate alcohol ingredients based on preferences, people, and days
    const alcoholIngredients = groupAlcoholPreferences
      ? generateGroupAlcoholIngredients(
          groupAlcoholPreferences,
          peopleCount,
          totalDays
        )
      : generateAlcoholIngredients(alcoholPreferences, peopleCount, totalDays);

    // Generate water ingredients based on preferences, people, and days
    const waterIngredients = generateWaterIngredients(
      waterPreference,
      peopleCount,
      totalDays
    );

    // Combine food ingredients with alcohol and water ingredients
    const allIngredients = combineIngredients(foodIngredients, [
      ...alcoholIngredients,
      ...waterIngredients,
    ]);

    setShoppingList(allIngredients);
    router.push("/shopping-list");
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleCreatehoppingList}
      className="fixed bottom-auto right-10 z-10 rounded border border-primary/40 bg-primary p-4 text-white max-sm:bottom-10 sm:right-[135px] sm:top-32"
    >
      <ShoppingCart
        role="img"
        aria-label="Create your shopping list!"
        height={25}
        width={25}
      />
    </motion.button>
  );
};
