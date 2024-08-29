"use client";

import { useState } from "react";

export const MealPlanner = () => {
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [days, setDays] = useState("");
  const [people, setPeople] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  const handleGeneratePlan = async () => {
    const response = await fetch("/api/generate-shopping-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mealsPerDay,
        days,
        dietaryPreferences,
        people,
      }),
    });
    const data = await response.json();
    setShoppingList(data.shoppingList);
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const labelStyle = (field: string) =>
    `block absolute ${
      focusedField === field
        ? "-translate-y-6 text-sm"
        : "translate-y-0 text-xs left-3"
    } transition-all`;

  const inputStyle = (field: string) =>
    `block mb-10 h-10 rounded w-1/3 p-4 ${
      focusedField === field ? "pt-4" : "pt-7"
    } outline-none`;

  return (
    <>
      <h1 className="mb-10 text-2xl">Crea la tua cambusa ⛵</h1>
      <div className="mb-10">
        <div className="relative">
          <label
            className={labelStyle("meals-per-day")}
            htmlFor="meals-per-day"
          >
            Quanti pasti al giorno?
          </label>
          <input
            className={inputStyle("meals-per-day")}
            id="meals-per-day"
            type="text"
            value={mealsPerDay}
            onChange={(e) => setMealsPerDay(e.target.value)}
            onFocus={(e) => handleFocus(e.target.id)}
            placeholder="3"
          />
        </div>
        <div className="relative">
          <label className={labelStyle("days")} htmlFor="days">
            Per quanti giorni?
          </label>
          <input
            id="days"
            className={inputStyle("days")}
            type="text"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            onFocus={(e) => handleFocus(e.target.id)}
            placeholder="7"
          />
        </div>
        <div className="relative">
          <label className={labelStyle("people")} htmlFor="people">
            Per quante persone?
          </label>
          <input
            id="people"
            className={inputStyle("people")}
            type="text"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            onFocus={(e) => handleFocus(e.target.id)}
            placeholder="5"
          />
        </div>
        <div className="relative">
          <label
            className={labelStyle("dietary-preferences")}
            htmlFor="dietary-preferences"
          >
            Aggiungi le tue preferenze alimentari
          </label>
          <input
            id="dietary-preferences"
            className={inputStyle("dietary-preferences")}
            type="text"
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            placeholder="vegan, gluten-free"
            onFocus={(e) => handleFocus(e.target.id)}
            inputMode="text"
          />
        </div>
      </div>
      <button
        className="bg-black rounded h-15 text-white p-2"
        onClick={handleGeneratePlan}
      >
        Genera il menu! 😍
      </button>

      <div className="mt-10 whitespace-pre-line">{shoppingList}</div>
    </>
  );
};
