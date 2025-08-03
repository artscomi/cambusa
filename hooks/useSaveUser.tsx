import { saveUser } from "@/app/api/actions";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export const useSaveUser = () => {
  const { user } = useUser();

  useEffect(() => {
    const fetchSaveUser = async () => {
      console.log("🔄 useSaveUser hook triggered, user:", user ? "exists" : "null");
      if (!user) {
        console.log("❌ No user found, skipping saveUser");
        return;
      }

      console.log("✅ User found, calling saveUser");
      try {
        await saveUser();
        console.log("✅ saveUser completed successfully");
      } catch (error) {
        console.error("❌ Error in saveUser:", error);
      }
    };

    fetchSaveUser();
  }, [user]);
};
