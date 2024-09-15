"use client";

import { TextInput } from "../TextInput";
import { useFormConfig } from "@/hooks/useFormConfig";
import { useMealContext } from "@/context/useMealContext";
import { GroupData, MenuData } from "@/types/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ToastError } from "../ToastError";
import { experimental_useObject as useObject } from "ai/react";
import { mealMenuSchema } from "@/app/api/generate-meal-menu/schema";
import { mockMealList } from "@/utils/mockMealList";
import { useRouter } from "next/navigation";
import { Loading } from "../Loading";
import { getMealListFromAi } from "@/app/api/generate-meal-menu/actions";
import { motion } from "framer-motion";
import { Button } from "../Button";
import LottieAnimation from "../LottieAnimation";

export const MainForm = ({
  groupData,
  startTransition,
  setError,
}: {
  groupData?: GroupData;
  startTransition: (callback: () => void) => void;
  setError: Dispatch<SetStateAction<string | null>>;
}) => {
  const { inputConfig, formState } = useFormConfig();
  const { setMealList } = useMealContext();
  const { breakfast, lunch, dinner, dietaryPreferences, people } = formState;
  const [isInputFocused, setIsInputFocused] = useState(false);

  const router = useRouter();

  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);

  // const { object, submit, isLoading, stop } = useObject({
  //   api: "/api/generate-meal-menu",
  //   schema: mealMenuSchema,
  // });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    startTransition(async () => {
      try {
        const result = await getMealListFromAi({
          breakfast,
          lunch,
          dinner,
          dietaryPreferences,
          people,
        });

        // const result = await new Promise<
        //   | { type: "success"; menu: MenuData }
        //   | { type: "parse-error"; text: string }
        //   | { type: "validation-error"; value: unknown }
        //   | { type: "unknown-error"; error: unknown }
        // >((resolve, reject) => {
        //   setTimeout(() => {
        //     if (Math.random() > 0) {
        //       resolve({
        //         type: "success",
        //         menu: mockMealList,
        //       });
        //     } else {
        //       reject(new Error("Simulated API error"));
        //     }
        //   }, 2000);
        // });

        if (result.type === "success") {
          setMealList(result.menu);
          router.push("/meal-menu");
        } else if (result.type === "validation-error") {
          setError("Recipe format is invalid.");
          console.error("Recipe format is invalid.");
        } else if (result.type === "parse-error") {
          setError('"Failed to parse recipe data."');
          console.error('"Failed to parse recipe data."');
        } else {
          setError("An unknown error occurred.");
          console.error("An unknown error occurred.");
        }
      } catch (e) {
        setError("An unexpected error occurred while fetching the meal list.");
        console.error(e);
      }
    });
  };

  return (
    <>
      <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden">
        {groupData && (
          <h1 className="mb-10 text-3xl">{`Genera la tua cambusa per il gruppo
            ${groupData.id}`}</h1>
        )}

        <form className="flex-1 z-10 relative" onSubmit={handleSubmit}>
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

          <Button type="submit"> Genera il menu! 😍</Button>
        </form>


        <div className="absolute left-0 right-0 top-0 bottom-0 sm:overflow-hidden">
          <LottieAnimation name="waveBig" />
        </div>
      </div>
    </>
  );
};
