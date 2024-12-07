import { useMealContext } from "@/context/useMealContext";
import { useShoppingContext } from "@/context/useShoppingListContext";
import { sumIngredients } from "@/utils/ingredients";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "../Button";
import { ShoppingCart } from "lucide-react";

export const CreateShoppingListCta = () => {
  const { setShoppingList } = useShoppingContext();
  const { mealList } = useMealContext();
  const router = useRouter();

  if (!mealList) {
    return;
  }

  const handleCreatehoppingList = () => {
    const combinedIngredients = sumIngredients(mealList);
    setShoppingList(combinedIngredients);
    router.push("/shopping-list");
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleCreatehoppingList}
      className="p-4 rounded bg-gray-50 hover:bg-gray-100 shadow-md fixed max-sm:bottom-5 bottom-auto min-sm:top-32 max-sm:right-5 right-[400px] z-10"
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
