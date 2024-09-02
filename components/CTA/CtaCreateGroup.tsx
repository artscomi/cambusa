import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export const CtaCreateGroup = () => {
  const router = useRouter();

  const createGroup = () => {
    const groupId = uuidv4();
    router.push(`/group/${groupId}`);
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
