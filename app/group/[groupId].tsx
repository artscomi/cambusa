"use client";

import { useRouter } from "next/router";
import { useState } from "react";

export default function GroupPage() {
  const router = useRouter();
  const { groupId } = router.query;
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
      <h1>Group {groupId}</h1>
      <input
        type="text"
        value={dietaryPreferences}
        onChange={(e) => setDietaryPreferences(e.target.value)}
        placeholder="Enter dietary preferences"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
