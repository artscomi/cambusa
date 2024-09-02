import { useMealContext } from "@/context/useMealContext";
import { AddMealFormState } from "@/hooks/useAddMealInputConfig";
import { Meal, MenuData } from "@/types/types";

export const CtaAddMenu = ({ formData }: { formData: AddMealFormState }) => {
  const { mealList, setMealList } = useMealContext();

  const handleAddMenu = () => {
    const { "meal-name": mealName, ingredient, quantity } = formData;
  
    const updatedMenu: MenuData = {
      ...mealList, // Copy the current state
      Colazioni: {
        ...(mealList?.Colazioni || {}), 
        [mealName]: {
          [mealName]: [{ item: ingredient, quantity: quantity }]
        }
      }
    };
  
    setMealList(updatedMenu);
  };

  console.log({ mealList });
  return (
    <button
      className="bg-black rounded h-15 text-white p-2 hover:bg-gray-800"
      onClick={handleAddMenu}
    >
      Aggiungi un pasto! 😍
    </button>
  );
};
