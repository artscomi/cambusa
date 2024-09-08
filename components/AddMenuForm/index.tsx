import { useAddMealInputConfig } from "@/hooks/useAddMealInputConfig";
import { TextInput } from "../TextInput";
import { useMealContext } from "@/context/useMealContext";
import { MenuData } from "@/types/types";

export const AddMenu = () => {
  const { inputConfig, formState } = useAddMealInputConfig();
  const { mealList, setMealList } = useMealContext();

  if (!mealList) return null;

  const handleSubit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { "meal-name": mealName, ingredient, quantity } = formState;

    const updatedMenu: MenuData = {
      ...mealList,
      // Colazioni: {
      //   ...(mealList?.Colazioni || {}),
      //   [mealName]: {
      //     [mealName]: [{ item: ingredient, quantity: quantity }],
      //   },
      // },
    };

    setMealList(updatedMenu);
  };

  return (
    <form className="bg-white p-10 rounded-lg m-5" onSubmit={handleSubit}>
      <p className="text-lg font-bold mb-8">Aggiungi un pasto</p>
      <div className="flex flex-col gap-4 mb-10">
        {inputConfig.map((config) => (
          <TextInput key={config.id} {...config} />
        ))}
      </div>
      <button className="bg-black rounded h-15 text-white p-2 hover:bg-gray-800">
        Aggiungi un pasto! 😍
      </button>
    </form>
  );
};
