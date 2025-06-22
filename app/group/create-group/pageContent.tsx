import { currentUser } from "@clerk/nextjs/server";
import { CreateGroupForm } from "./CreateGroupForm";
import { CreateGroupLayout } from "./CreateGroupLayout";

export const CreateGroupContent = async () => {
  const user = await currentUser();
  if (!user) {
    console.error("user not found in SaveUser");
    return;
  }

  return (
    <CreateGroupLayout>
      <CreateGroupForm />
    </CreateGroupLayout>
  );
};
