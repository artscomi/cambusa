"use client";

import { MealMenu } from "../MealPlanner/MealMenu";
import { TextInput } from "../MealPlanner/TextInput";
import { CtaCreateMenu } from "../CTA/CtaCreateMenu";
import { CreateGroupBox } from "./CreateGroupBox";
import { CtaCreateMenuGroup } from "../CTA/CtaCreateMenuGroup";
import { useFormConfig } from "@/hooks/useInputConfig";
import { useMealContext } from "@/context/useMealContext";
import { GroupData } from "@/types/types";

export const MainForm = ({ groupData }: { groupData?: GroupData }) => {
  const { inputConfig, formState } = useFormConfig();
  const { mealList, setMealList } = useMealContext();

  return (
    <>
      <div className="rounded-lg p-14 bg-white mb-10">
        <div className="">
          <h1 className="mb-10 text-2xl font-bold">{`Crea la tua cambusa ⛵ ${
            groupData ? `per il gruppo ${groupData.id}` : ""
          }`}</h1>

          <div className="flex flex-col md:flex-row justify-items-center gap-16">
            <div className="flex-1 flex flex-col">
              {inputConfig.map((config) => (
                <TextInput key={config.id} {...config} />
              ))}
              {groupData ? (
                <CtaCreateMenuGroup
                  setShoppingList={setMealList}
                  inputData={{
                    people: formState.people,
                    groupDataDietaryPreferences: groupData.dietaryPreferences
                      .map(
                        (pref) =>
                          `una persona ha le seguenti preferenze: ${pref.join(
                            ", "
                          )}`
                      )
                      .join(", "),
                  }}
                />
              ) : (
                <CtaCreateMenu inputData={formState} />
              )}
            </div>

            {!groupData && <CreateGroupBox />}
          </div>
        </div>
      </div>

      {mealList && <MealMenu />}
    </>
  );
};
