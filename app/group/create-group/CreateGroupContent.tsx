"use client";

import { TextInput } from "@/components/TextInput";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CreateGroupContent = () => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Il nome del gruppo è obbligatorio.");
      return;
    }

    const groupNameParsed = groupName.replace(/ /g, "-");

    setError("");
    const groupId = nanoid(10);
    // router.push(`/group/${groupId}/${groupNameParsed}`);
    router.push(`/group/${groupId}/${groupNameParsed}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl text-center mb-10">Crea il tuo gruppo</h1>
      <TextInput
        center
        inputType="text"
        className="bg-white min-w-[250px]"
        id="group-name"
        label="Nome del gruppo"
        value={groupName}
        type="text"
        placeholder="Capraia 2024"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setGroupName(e.target.value)
        }
      />
      {error && <p className="text-red-500">{error}</p>}
      <button className="h-15 p-2 underline underline-offset-8 block m-auto mt-10">
        Crea un gruppo
      </button>
    </form>
  );
};
