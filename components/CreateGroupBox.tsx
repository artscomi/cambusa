"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { TextInput } from "./MealPlanner/TextInput";

export const CreateGroupBox = () => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Il nome del gruppo è obbligatorio.");
      return;
    }

    setError("");
    const groupId = nanoid(10);
    router.push(`/group/${groupId}/${groupName.replace(/ /g, "-")}`);
  };

  return (
    <form className="p-8 md:rounded-lg flex-1 flex flex-col onSubmit={handleSubmit} justify-center" onSubmit={handleSubmit}>
      <div className="mb-5">
        <span role="img" className="text-center block mb-3 text-2xl">
          👫👬👭
        </span>
        <p className="mb-8 text-center">
          Crea il tuo gruppo per raccogliere le preferenze alimentari di tutta
          la ciurma!
        </p>
        <TextInput
          className="max-md:bg-white"
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
        <button
          type="submit"
          className="h-15 p-2 underline underline-offset-8 block m-auto"
        >
          Crea un gruppo
        </button>
      </div>
    </form>
  );
};
