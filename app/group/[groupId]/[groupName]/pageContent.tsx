"use client";

import { TextInput } from "@/components/TextInput";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { TextArea } from "@/components/TextArea";

export const PageContent: React.FC<{ groupId: string; groupName: string }> = ({
  groupId,
  groupName,
}) => {
  const router = useRouter();
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/update-group/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([dietaryPreferences.split(", ")]),
      });

      if (response.ok) router.push(`/group/${groupId}/menu`);
      else throw Error;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    confetti({
      particleCount: 500,
      spread: 500,
      origin: { y: 0.2 },
    });
  }, []);

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
        value={dietaryPreferences}
        onChange={(e) => setDietaryPreferences(e.target.value)}
        placeholder="Enter dietary preferences"
        id={"group-dietary-preferences"}
        label={"Inserisci le tue preferenze alimentari"}
      />
      <button
        className={`bg-black rounded h-15 text-white p-2 hover:bg-gray-800 w-[200px] ml-auto  ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};
