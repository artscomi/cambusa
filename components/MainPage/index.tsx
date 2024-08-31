"use client";

import { useState } from "react";
import { getInputConfig } from "../MealPlanner/data";
import { MealMenu } from "../MealPlanner/MealMenu";
import { TextInput } from "../MealPlanner/TextInput";
import { CtaCreateMenu } from "../CTA/CtaCreateMenu";
import { GroupData } from "@/pages/group/[groupId]/menu";
import { CreateGroupBox } from "./CreateGroupBox";

export const MainPage = ({ groupData }: { groupData?: GroupData }) => {
  const [days, setDays] = useState("7");
  const [people, setPeople] = useState("5");
  const [dietaryPreferences, setDietaryPreferences] = useState(
    groupData ? groupData.dietaryPreferences : ""
  );
  const [shoppingList, setShoppingList] = useState([]);

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
      <div className="rounded-lg p-14 bg-white">
        <div className="">
          <h1 className="mb-10 text-2xl font-bold">{`Crea la tua cambusa ⛵ ${
            groupData ? `per il gruppo ${groupData.id}` : ""
          }`}</h1>

          <div className="flex flex-col md:flex-row justify-items-center gap-16">
            <div className="flex-1 flex flex-col">
              {inputConfig.map((config) => (
                <TextInput key={config.id} {...config} />
              ))}
              <CtaCreateMenu
                setShoppingList={setShoppingList}
                inputData={{ days, people, dietaryPreferences }}
              />
            </div>

            {!groupData && <CreateGroupBox />}
          </div>

          {dietaryPreferences}
        </div>
      </div>

      <MealMenu shoppingList={shoppingList} />
    </>
  );
};
