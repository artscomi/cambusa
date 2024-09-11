"use client";

import CopyLink from "@/components/CopyLinkButton";
import { TextInput } from "@/components/TextInput";
import { useSaveUser } from "@/hooks/useSaveUser";
import { useUser } from "@clerk/nextjs";
import { FormEvent, useState } from "react";

export const CreateGroupContent = () => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [groupLink, setGroupLink] = useState("");
  const { user } = useUser();
  useSaveUser(); // save the clerk user into prisma db
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const createGroup = async (
    e: FormEvent<HTMLFormElement>,
    groupName: string
  ) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/create-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create group");
      }

      const group = await response.json();
      console.log("Group created:", group);
      const groupNameParsed = groupName.replace(/ /g, "-");

      setGroupLink(`${baseUrl}/group/${group.id}/${groupNameParsed}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <form onSubmit={(e) => createGroup(e, groupName)}>
        {user && (
          <p className="text-4xl text-center mb-10">Ciao {user?.firstName}</p>
        )}
        <h1 className="text-2xl text-center mb-10">Crea il tuo gruppo</h1>
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
        <button className="h-15 p-2 underline underline-offset-8 block m-auto my-10">
          Crea un gruppo
        </button>
      </form>
      {groupLink && <CopyLink url={groupLink} />}
    </>
  );
};
