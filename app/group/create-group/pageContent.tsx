import { currentUser } from "@clerk/nextjs/server";
import { CreateGroupForm } from "./CreateGroupForm";

export const CreateGroupContent = async () => {

  const user = await currentUser();
  if (!user) {
    console.error("user not found in SaveUser");
    return;
  }

  return (
    <div className="md:rounded-lg p-8 md:p-14 relative max-sm:-mx-4 md:overflow-hidden">
      <p className="text-2xl text-center mb-6 font-medium text-gray-700">
        Ciao {user.firstName}!
      </p>
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Crea il tuo gruppo
      </h1>
      <CreateGroupForm />
    </div>
  );
};
