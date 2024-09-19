import { useMealContext } from "@/context/useMealContext";
import { useShoppingContext } from "@/context/useShoppingListContext";
import { sumIngredients } from "@/utils/ingredients";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "../Button";

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
    <motion.div className="text-center" exit={{ opacity: 0 }}>
      <p className="mt-16 mb-10 text-2xl">E adesso?</p>
      <Button onClick={handleCreatehoppingList} center>
        Genera la lista della spesa!
      </Button>
    </motion.div>
  );
};
