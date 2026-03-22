"use client";

import { useMealContext } from "@/context/useMealContext";
import { useShoppingContext } from "@/context/useShoppingListContext";
import { sumIngredients, combineIngredients } from "@/utils/ingredients";
import {
  generateAlcoholIngredients,
  generateGroupAlcoholIngredients,
  generateWaterIngredients,
} from "@/utils/alcoholUtils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Info, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Ingredient } from "@/types/types";
import { GROUP_SHOPPING_CTA_DISABLED_HINT } from "./GroupCreateShoppingListCta";

export type CreateShoppingListCtaProps = {
  /** Se presente e il pulsante non è disabilitato, la lista è legata al gruppo. */
  groupIdForShoppingContext?: string;
  /** Es. votazione gruppo non completa su «Il mio menu». */
  disabled?: boolean;
  disabledHint?: string;
};

export const CreateShoppingListCta = ({
  groupIdForShoppingContext,
  disabled = false,
  disabledHint = GROUP_SHOPPING_CTA_DISABLED_HINT,
}: CreateShoppingListCtaProps = {}) => {
  const [showDisabledHint, setShowDisabledHint] = useState(false);
  useEffect(() => {
    if (!disabled) setShowDisabledHint(false);
  }, [disabled]);

  const { setShoppingList, setShoppingListGroupId } = useShoppingContext();
  const {
    mealList,
    alcoholPreferences,
    waterPreference,
    people,
    days,
    groupAlcoholPreferences,
  } = useMealContext();
  const router = useRouter();

  if (!mealList) {
    return;
  }

  const handleCreatehoppingList = () => {
    if (disabled) return;

    const foodIngredients = sumIngredients(mealList) as Ingredient[];

    const totalDays = days || 1;
    const peopleCount = people || 1;

    const alcoholIngredients = groupAlcoholPreferences
      ? generateGroupAlcoholIngredients(
          groupAlcoholPreferences,
          peopleCount,
          totalDays,
        )
      : generateAlcoholIngredients(alcoholPreferences, peopleCount, totalDays);

    const waterIngredients = generateWaterIngredients(
      waterPreference,
      peopleCount,
      totalDays,
    );

    const allIngredients = combineIngredients(foodIngredients, [
      ...alcoholIngredients,
      ...waterIngredients,
    ]);

    if (groupIdForShoppingContext) {
      setShoppingListGroupId(groupIdForShoppingContext);
    } else {
      setShoppingListGroupId(undefined);
    }
    setShoppingList(allIngredients);
    router.push("/shopping-list");
  };

  return (
    <div className="fixed bottom-auto right-10 z-10 max-sm:bottom-10 sm:right-[135px] sm:top-32">
      <div
        className="relative inline-block"
        onPointerEnter={() => {
          if (disabled) setShowDisabledHint(true);
        }}
        onPointerLeave={() => setShowDisabledHint(false)}
      >
        <motion.button
          type="button"
          whileTap={disabled ? undefined : { scale: 0.97 }}
          disabled={disabled}
          onClick={handleCreatehoppingList}
          className={`rounded border border-primary/40 bg-primary p-4 text-white ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          aria-label={
            disabled
              ? `${disabledHint} — Genera la lista della spesa`
              : "Genera la lista della spesa"
          }
        >
          <ShoppingCart role="img" aria-hidden height={25} width={25} />
        </motion.button>
        {disabled ? (
          <div className="group/info-badge pointer-events-auto absolute -right-px -top-px z-20">
            <button
              type="button"
              className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-600 shadow-sm outline-none transition-colors hover:bg-gray-50 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              aria-label={disabledHint}
              title={disabledHint}
            >
              <Info className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
            </button>
            <span
              role="tooltip"
              className="pointer-events-none invisible absolute bottom-full right-0 z-30 mb-1.5 w-[min(calc(100vw-2rem),17rem)] rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs leading-snug text-gray-700 opacity-0 shadow-lg transition-opacity group-hover/info-badge:visible group-hover/info-badge:opacity-100 group-focus-within/info-badge:visible group-focus-within/info-badge:opacity-100"
            >
              {disabledHint}
            </span>
          </div>
        ) : null}
        {disabled && showDisabledHint ? (
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full right-0 z-30 mb-1.5 w-[min(calc(100vw-2rem),17rem)] rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs leading-snug text-gray-700 shadow-lg"
          >
            {disabledHint}
          </span>
        ) : null}
      </div>
    </div>
  );
};
