import { useMealContext } from "@/context/useMealContext";
import { AddMealFormState } from "@/hooks/useAddMealInputConfig";

export const CtaAddMenu = ({ formData }: { formData: AddMealFormState }) => {
  const { mealList, setMealList } = useMealContext();

  const handleAddMenu = () => {
    const { "meal-name": mealName, ingredient, quantity } = formData;

    if (mealList && !mealList?.Colazioni) {
      mealList.Colazioni = {};
    }

    if (mealList && mealList.Colazioni) {
      mealList.Colazioni["Colazione 4"] = {
        [mealName]: [{ item: ingredient, quantity: quantity }],
      };
    }

    setMealList(mealList);
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
