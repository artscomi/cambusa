"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { TextArea } from "@/components/TextArea";
import { useUser } from "@clerk/nextjs";
import { useSaveUser } from "@/hooks/useSaveUser";
import Toast from "@/components/Toast";
import { Button } from "@/components/Button";

export const PageContent: React.FC<{ groupId: string; groupName: string }> = ({
  groupId,
  groupName,
}) => {
  const [foodPreferences, setFoodPreferences] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const { user } = useUser();
  useSaveUser();

  console.log({ error });
  console.log({ isSuccess });
  async function addFoodPreference(groupId: string, preference: string) {
    if (!foodPreferences) {
      setFieldError("Preferenze obbligatorie");
    } else {
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

        setIsSuccess(true);
        console.log("Food preference added:", foodPreference);
        return foodPreference;
      } catch (error) {
        console.error("Error:", error);
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
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
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-4xl mb-2">
          Congratulazioni! <br />
          Hai ricevuto un invito al gruppo{" "}
          <span className="text-teal-500 capitalize">{groupName}</span>
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
        error={fieldError}
      />
      <Button
        className={`${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => addFoodPreference(groupId, foodPreferences)}
      >
        {isLoading ? "Loading" : "Salva preferenze"}
      </Button>

      <Toast
        message={"Preferenze salvate!"}
        type="success"
        showToast={isSuccess}
        onClose={() => setIsSuccess(false)}
      />

      <Toast
        message={error}
        type="error"
        showToast={!!error}
        onClose={() => setError("")}
      />
    </div>
  );
};
