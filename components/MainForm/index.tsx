"use client";

import { TextInput } from "../MealPlanner/TextInput";
import { useFormConfig } from "@/hooks/useInputConfig";
import { useMealContext } from "@/context/useMealContext";
import { GroupData } from "@/types/types";
import { useEffect, useState } from "react";
import { ToastError } from "../ToastError";

export const MainForm = ({ groupData }: { groupData?: GroupData }) => {
  const { inputConfig, formState } = useFormConfig();
  const { setMealList } = useMealContext();
  const { breakfast, lunch, dinner, dietaryPreferences, people } = formState;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);

  useEffect(() => {
    setError(false);
  }, [isInputFocused]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
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
      // await new Promise((resolve, reject) =>
      //   setTimeout(() => resolve("resolve"), 1000)
      // );

      setMealList(mealList);
    } catch (e) {
      setError(true);
      console.error('Error fetching OpenAI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="md:rounded-lg p-14 bg-white mb-10">
        <div className="">
          <h1 className="mb-10 text-2xl font-bold">{`Crea la tua cambusa ⛵ ${
            groupData ? `per il gruppo ${groupData.id}` : ""
          }`}</h1>

          <form className="flex-1" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 mb-10">
              {inputConfig.map((config) => (
                <TextInput
                  key={config.id}
                  {...config}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              ))}
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className={`bg-black rounded h-15 text-white p-2 hover:bg-gray-800 w-full ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Loading..." : "Genera il menu! 😍"}
            </button>

            <ToastError error={error} />
          </form>
        </div>
      </div>
    </>
  );
};
