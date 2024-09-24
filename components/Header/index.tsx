import { getUserApiCallCount } from "@/app/api/check-user-api-call/actions";
import { getMaxAiCall } from "@/utils/user";
import { auth } from "@clerk/nextjs/server";
import { usePathname } from "next/navigation";

export const Header = async () => {
  const { userId } = auth();
  if (!userId) return;

  const { apiCallCount, hasPaidForIncrease } = await getUserApiCallCount(
    userId, 
  );
  const maxAiCall = getMaxAiCall(hasPaidForIncrease);
  const aiCallLeft = maxAiCall - apiCallCount;

  return (
    <header className="text-primary py-4">
      <div className="container mx-auto px-4">
        <div className="flex md:flex-row justify-end items-center">
          <p>hai ancora {aiCallLeft} generazioni</p>
          <div className="flex items-center"></div>
        </div>
      </div>
    </header>
  );
};
