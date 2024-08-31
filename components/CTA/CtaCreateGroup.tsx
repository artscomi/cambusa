import { useRouter } from "next/router";
import { useState } from "react";

export const CtaCreateGroup = () => {
  const [groupId, setGroupId] = useState("");
  const router = useRouter();

  const createGroup = async () => {
    try {
      const response = await fetch("/api/create-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGroupId(data.groupId);
        router.push(`/group/${data.groupId}`);
      } else {
        console.error("Error creating group:", response.status);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <>
      <button
        className="h-15 p-2 underline underline-offset-8"
        onClick={createGroup}
      >
        Crea un gruppo
      </button>
    </>
  );
};
