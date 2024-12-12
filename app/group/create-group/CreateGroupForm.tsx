"use client";

import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { createGroupAction } from "@/app/api/actions";
import { useFormConfig } from "@/hooks/useFormConfig";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CreateGroupForm = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { inputConfig } = useFormConfig();
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>, formData: FormData) => {
    e.preventDefault()
    try {
      setLoading(true);
      const groupId = await createGroupAction(formData);
      if (groupId) {
        router.push(`${baseUrl}/group/${groupId}/`);
      } else {
        console.error("Error creating group");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden bg-white">
      <form onSubmit={e => handleCreateGroup(e, new FormData(e.target as HTMLFormElement))}>
        <div className="grid gap-3">
          {inputConfig.map((config) => (
            <TextInput key={config.id} {...config} />
          ))}
        </div>

        <Button type="submit" className="my-10" center>
          {loading ? "Salvataggio..." : "Crea un gruppo"}
        </Button>
      </form>
    </div>
  );
};
