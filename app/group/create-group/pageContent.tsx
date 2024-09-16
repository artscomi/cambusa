"use client";

import { Button } from "@/components/Button";
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
  useSaveUser(); // Save the Clerk user into Prisma DB
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const createGroup = async (
    e: FormEvent<HTMLFormElement>,
    groupName: string
  ) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Nome gruppo obbligatorio");
      return;
    }

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
    <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden bg-white">
      <form onSubmit={(e) => createGroup(e, groupName)}>
        {user && (
          <p className="text-2xl text-center mb-6 font-medium text-gray-700">
            Ciao {user.firstName}!
          </p>
        )}
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          Crea il tuo gruppo
        </h1>
        <TextInput
          center
          inputType="text"
          id="group-name"
          label="Nome del gruppo"
          value={groupName}
          type="text"
          placeholder="Capraia 2024"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setError("");
            setGroupName(e.target.value);
          }}
          error={error}
        />
        <Button type="submit" className="my-10" center>
          Crea un gruppo
        </Button>
      </form>
      {groupLink && <CopyLink url={groupLink} />}
    </div>
  );
};
