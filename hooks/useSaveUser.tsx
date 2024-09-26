import { saveUser } from "@/app/api/actions";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export const useSaveUser = () => {
  const { user } = useUser();

  useEffect(() => {
    const fetchSaveUser = async () => {
      if (!user) return;

      await saveUser();
    };

    fetchSaveUser();
  }, [user]);
};
