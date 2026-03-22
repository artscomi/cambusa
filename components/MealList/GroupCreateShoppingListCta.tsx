"use client";

import { CTA } from "@/components/CTA";
import { useShoppingContext } from "@/context/useShoppingListContext";
import { sumIngredients, combineIngredients } from "@/utils/ingredients";
import {
  generateGroupAlcoholIngredients,
  generateWaterIngredients,
} from "@/utils/alcoholUtils";
import { useRouter } from "next/navigation";
import { Info, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import type { Ingredient, MealList } from "@/types/types";

/** Stesso messaggio per pulsante disabilitato (menu gruppo + Il mio menu). */
export const GROUP_SHOPPING_CTA_DISABLED_HINT =
  "Quando tutta la ciurma avrà votato, sarà possibile generare la lista della spesa.";

type GroupPreferenceRow = {
  userId: string;
  preference: string;
  user: { name: string };
};

type GroupCreateShoppingListCtaProps = {
  groupId: string;
  mealList: MealList;
  alcoholPreferences: GroupPreferenceRow[];
  waterPreferences: GroupPreferenceRow[];
  peopleCount: number;
  /** Giorni di navigazione (stesso uso del menu personale; default conservativo). */
  tripDays?: number;
  /** Se true, il pulsante è disattivato; tooltip su hover CTA e sull’icona info. */
  disabled?: boolean;
};

export function GroupCreateShoppingListCta({
  groupId,
  mealList,
  alcoholPreferences,
  waterPreferences,
  peopleCount,
  tripDays = 1,
  disabled = false,
}: GroupCreateShoppingListCtaProps) {
  const [showDisabledHint, setShowDisabledHint] = useState(false);
  useEffect(() => {
    if (!disabled) setShowDisabledHint(false);
  }, [disabled]);

  const { setShoppingList, setShoppingListGroupId } = useShoppingContext();
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;
    const foodIngredients = sumIngredients(mealList) as Ingredient[];
    const people = Math.max(1, peopleCount);
    const days = Math.max(1, tripDays);

    const alcoholIngredients = generateGroupAlcoholIngredients(
      alcoholPreferences,
      people,
      days,
    );

    const waterBlob = waterPreferences.map((w) => w.preference).join(" ");
    const waterIngredients = generateWaterIngredients(waterBlob, people, days);

    const allIngredients = combineIngredients(foodIngredients, [
      ...alcoholIngredients,
      ...waterIngredients,
    ]);

    setShoppingListGroupId(groupId);
    setShoppingList(allIngredients);
    router.push("/shopping-list");
  };

  return (
    <div
      className="relative mt-2 w-full min-w-0"
      onPointerEnter={() => {
        if (disabled) setShowDisabledHint(true);
      }}
      onPointerLeave={() => setShowDisabledHint(false)}
    >
      <CTA
        variant="accent"
        type="button"
        full
        disabled={disabled}
        className="w-full"
        onClick={handleClick}
      >
        <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden />
        Genera la lista della spesa
      </CTA>
      {disabled ? (
        <div className="group/info-badge pointer-events-auto absolute right-3 top-0 z-20 -translate-y-1/2 sm:right-5">
          <button
            type="button"
            className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-600 shadow-sm outline-none transition-colors hover:bg-gray-50 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            aria-label={GROUP_SHOPPING_CTA_DISABLED_HINT}
            title={GROUP_SHOPPING_CTA_DISABLED_HINT}
          >
            <Info className="h-3 w-3" aria-hidden strokeWidth={2.5} />
          </button>
          <span
            role="tooltip"
            className="pointer-events-none invisible absolute bottom-full right-0 z-30 mb-1.5 w-[min(calc(100vw-2rem),17rem)] rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs leading-snug text-gray-700 opacity-0 shadow-lg transition-opacity group-hover/info-badge:visible group-hover/info-badge:opacity-100 group-focus-within/info-badge:visible group-focus-within/info-badge:opacity-100"
          >
            {GROUP_SHOPPING_CTA_DISABLED_HINT}
          </span>
        </div>
      ) : null}
      {disabled && showDisabledHint ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 z-30 mb-1.5 w-[min(calc(100vw-2rem),17rem)] rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs leading-snug text-gray-700 shadow-lg sm:left-auto sm:right-0"
        >
          {GROUP_SHOPPING_CTA_DISABLED_HINT}
        </span>
      ) : null}
    </div>
  );
}
