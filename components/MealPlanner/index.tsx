"use client";

import { useState } from "react";
import { getInputConfig, mockShoppingList } from "./data";
import { TextInput } from "./TextInput";
import { MealMenu } from "./MealMenu";

export const MealPlanner = () => {
  const [days, setDays] = useState("7");
  const [people, setPeople] = useState("5");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  const handleGeneratePlan = async () => {
    const response = await fetch("/api/generate-shopping-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        days,
        dietaryPreferences,
        people,
      }),
    });
    const data = await response.json();
    const shoppingList = JSON.parse(data.shoppingList);

    setShoppingList(shoppingList);
  };

  console.log({ mockShoppingList });
  console.log({ shoppingList });

  const inputConfig = getInputConfig({
    days,
    setDays,
    people,
    setPeople,
    dietaryPreferences,
    setDietaryPreferences,
  });

  return (
    <>
      <div className="rounded-lg p-10 bg-white border-solid border border-current">
        <div className="md:w-2/3">
          <h1 className="mb-10 text-2xl font-bold">Crea la tua cambusa ⛵</h1>
          <div className="mb-10">
            {inputConfig.map((config) => (
              <TextInput key={config.id} {...config} />
            ))}
          </div>
          <button
            className="bg-black rounded h-15 text-white p-2 hover:bg-gray-800"
            onClick={handleGeneratePlan}
          >
            Genera il menu! 😍
          </button>
        </div>
      </div>

      <MealMenu shoppingList={shoppingList} />
    </>
  );
};
