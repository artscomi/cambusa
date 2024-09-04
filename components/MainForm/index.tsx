"use client";

import { MealMenu } from "../MealPlanner/MealMenu";
import { TextInput } from "../MealPlanner/TextInput";
import { CreateGroupBox } from "./CreateGroupBox";
import { useFormConfig } from "@/hooks/useInputConfig";
import { useMealContext } from "@/context/useMealContext";
import { GroupData } from "@/types/types";

export const MainForm = ({ groupData }: { groupData?: GroupData }) => {
  const { inputConfig, formState } = useFormConfig();
  const { mealList, setMealList } = useMealContext();
  const { breakfast, lunch, dinner, dietaryPreferences, people } = formState;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/generate-shopping-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        breakfast,
        lunch,
        dinner,
        dietaryPreferences,
        people,
      }),
    });
    const data = await response.json();
    const mealList = JSON.parse(data.shoppingList);

    setMealList(mealList);
  };
  
  return (
    <>
      <div className="rounded-lg p-14 bg-white mb-10">
        <div className="">
          <h1 className="mb-10 text-2xl font-bold">{`Crea la tua cambusa ⛵ ${
            groupData ? `per il gruppo ${groupData.id}` : ""
          }`}</h1>

          <div className="flex flex-col md:flex-row justify-items-center gap-16">
            <form className="flex-1" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 mb-10">
                {inputConfig.map((config) => (
                  <TextInput key={config.id} {...config} />
                ))}
              </div>

              <button
                type="submit"
                className="bg-black rounded h-15 text-white p-2 hover:bg-gray-800 w-full"
              >
                Genera il menu! 😍
              </button>
            </form>

            <div className="flex-1">{!groupData && <CreateGroupBox />}</div>
          </div>
        </div>
      </div>

      {mealList && <MealMenu />}
    </>
  );
};
