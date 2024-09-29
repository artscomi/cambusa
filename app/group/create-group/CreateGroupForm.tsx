"use client";

import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { createGroupAction } from "@/app/api/actions";
import { useFormConfig } from "@/hooks/useFormConfig";
import { useRouter } from "next/navigation";

export const CreateGroupForm = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { inputConfig } = useFormConfig();

  const handleCreateGroup = async (formData: FormData) => {
    const groupId = await createGroupAction(formData);

    if (groupId) {
      router.push(`${baseUrl}/group/${groupId}/`);
    } else {
      console.error("Error creating group");
    }
  };

  return (
    <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden bg-white">
      <form action={handleCreateGroup}>
        <div className="grid gap-3">
          {inputConfig.map((config) => (
            <TextInput key={config.id} {...config} />
          ))}
        </div>

        <Button type="submit" className="my-10" center>
          Crea un gruppo
        </Button>
      </form>
    </div>
  );
};
