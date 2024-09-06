"use client";

import { MealContextProvider } from "@/context/useMealContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const PageContent: React.FC<{ groupId: string }> = ({ groupId }) => {
  const router = useRouter();
  const [dietaryPreferences, setDietaryPreferences] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/update-group/${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([dietaryPreferences.split(", ")]),
      });

      if (response.ok) router.push(`/group/${groupId}/menu`);
      else throw Error;
    } catch (e) {
      console.error(e);
    }
  };

  return (
      <div>
        <input
          type="text"
          value={dietaryPreferences}
          onChange={(e) => setDietaryPreferences(e.target.value)}
          placeholder="Enter dietary preferences"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
  );
};
