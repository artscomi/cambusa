"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { TextArea } from "@/components/TextArea";
import { useUser } from "@clerk/nextjs";
import { useSaveUser } from "@/hooks/useSaveUser";

export const PageContent: React.FC<{ groupId: string; groupName: string }> = ({
  groupId,
  groupName,
}) => {
  const [foodPreferences, setFoodPreferences] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  useSaveUser();

  async function addFoodPreference(groupId: string, preference: string) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preference }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add food preference");
      }

      const foodPreference = await response.json();
      console.log("Food preference added:", foodPreference);
      return foodPreference;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    confetti({
      particleCount: 500,
      spread: 500,
      origin: { y: 0.2 },
    });
  }, []);

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl m-auto flex flex-col justify-center gap-10 p-5 md:p-20 max-w-[768px] align-center">
      <div>
        <h1 className="font-semibold text-2xl mb-2">
          Congratulazioni! Hai ricevuto un invito al gruppo {groupName}
        </h1>
        <p>
          Aggiungi le tue preferenze alimentari per creare una cambusa per il
          viaggio
        </p>
      </div>
      <TextArea
        rows={5}
        value={foodPreferences}
        onChange={(e) => setFoodPreferences(e.target.value)}
        placeholder="mangio 150g di yogurt greco a colazione, non mangio la pasta"
        id={"food-preferences"}
        label={"Inserisci le tue preferenze alimentari"}
      />
      <button
        className={`bg-black rounded h-15 text-white p-2 hover:bg-gray-800 w-[200px] ml-auto  ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => addFoodPreference(groupId, foodPreferences)}
      >
        {isLoading ? "Salva Loading" : "Salva preferenze"}
      </button>
    </div>
  );
};
