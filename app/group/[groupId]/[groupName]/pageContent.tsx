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

  async function addFoodPreference(groupId: string, preference: string) {
    if (!foodPreferences.trim()) {
      setFieldError("Le preferenze sono obbligatorie");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/set-preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preference }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Errore durante il salvataggio delle preferenze"
        );
      }

      const foodPreference = await response.json();
      setIsSuccess(true);
      console.log("Preferenza alimentare aggiunta:", foodPreference);
    } catch (error) {
      console.error("Errore:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      confetti({
        particleCount: 500,
        spread: 500,
        origin: { y: 0.2 },
      });
    }
  }, [isSuccess]);

  if (!user) return null;

  return (
    <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden bg-white">
      <div>
        <h1 className="text-3xl font-bold mb-4">
          Congratulazioni! <br />
          Hai ricevuto un invito al gruppo{" "}
          <span className="text-tertiary capitalize">{groupName}</span>
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Aggiungi le tue preferenze alimentari per creare una cambusa per il
          viaggio.
        </p>
      </div>
      <TextArea
        rows={5}
        value={foodPreferences}
        onChange={(e) => setFoodPreferences(e.target.value)}
        placeholder="Esempio: mangio 150g di yogurt greco a colazione, non mangio la pasta"
        id={"food-preferences"}
        label={"Inserisci le tue preferenze alimentari"}
        error={fieldError}
      />
      <Button
        onClick={() => addFoodPreference(groupId, foodPreferences)}
        disabled={isLoading}
      >
        {isLoading ? "Salvataggio..." : "Salva preferenze"}
      </Button>

      {isSuccess && (
        <Toast
          message={"Preferenze salvate con successo!"}
          type="success"
          showToast={isSuccess}
          onClose={() => setIsSuccess(false)}
        />
      )}

      {error && (
        <Toast
          message={error}
          type="error"
          showToast={!!error}
          onClose={() => setError("")}
        />
      )}
    </div>
  );
};
