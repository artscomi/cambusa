"use client";

import { TextInput } from "../TextInput";
import { useFormConfig } from "@/hooks/useInputConfig";
import { useMealContext } from "@/context/useMealContext";
import { GroupData } from "@/types/types";
import { useEffect, useState } from "react";
import { ToastError } from "../ToastError";
import { experimental_useObject as useObject } from "ai/react";
import { mealMenuSchema } from "@/app/api/generate-shopping-list/schema";

export const MainForm = ({ groupData }: { groupData?: GroupData }) => {
  const { inputConfig, formState } = useFormConfig();
  const { setMealList, mealList } = useMealContext();
  const { breakfast, lunch, dinner, dietaryPreferences, people } = formState;
  const [error, setError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);

  useEffect(() => {
    setError(false);
  }, [isInputFocused]);

  const { object, submit, isLoading, stop } = useObject({
    api: "/api/generate-shopping-list",
    schema: mealMenuSchema,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    submit({
      breakfast,
      lunch,
      dinner,
      dietaryPreferences,
      people,
    });

    setMealList(object);

    // await new Promise((resolve, reject) =>
    //   setTimeout(() => resolve("resolve"), 1000)
    // );
  };

  useEffect(() => {
    if (object) {
      setMealList(object);
    }
  }, [object]);


  return (
    <>
      <div className="md:rounded-lg p-14 bg-white mb-10 shadow-md">
        <div className="">
          <h1 className="mb-10 text-3xl">{`Genera la tua cambusa ${
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
