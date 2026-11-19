import { saveUser } from "@/app/api/actions";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { trackEvent } from "@/lib/gtag";

export const useSaveUser = () => {
  const { user } = useUser();

  useEffect(() => {
    const fetchSaveUser = async () => {
      console.log("🔄 useSaveUser hook triggered, user:", user ? "exists" : "null");
      if (!user) {
        console.log("❌ No user found, skipping saveUser");
        return;
      }

      // Registrazione: utente creato da meno di 10 minuti, segnalato una sola volta
      const createdAt = user.createdAt?.getTime() ?? 0;
      const flag = `cambusa_signup_tracked_${user.id}`;
      try {
        if (Date.now() - createdAt < 10 * 60 * 1000 && !localStorage.getItem(flag)) {
          trackEvent("sign_up", { method: "clerk" });
          localStorage.setItem(flag, "1");
        }
      } catch {
        // storage non disponibile: nessun evento
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
