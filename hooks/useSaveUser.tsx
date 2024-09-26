import { saveUser } from "@/app/api/actions";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export const useSaveUser = () => {
  const { user } = useUser();

  useEffect(() => {
    const fetchSaveUser = async () => {
      if (!user) return;

      const result = await saveUser();

      if (result?.success) {
        console.log("User saved to database:");
      } else {
        console.error("Error saving user:", result?.message);
      }
    };

    fetchSaveUser();
  }, [user]);
};
