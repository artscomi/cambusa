import { getUserApiCallCount } from "@/app/api/check-user-api-call/actions";
import { getMaxAiCall } from "@/utils/user";
import { auth } from "@clerk/nextjs/server";

export const Header = async () => {
  const { userId } = auth();
  if (!userId) return;

  const { apiCallCount, hasPaidForIncrease } = await getUserApiCallCount(
    userId
  );
  const maxAiCall = getMaxAiCall(hasPaidForIncrease);
  const aiCallLeft = maxAiCall - apiCallCount;

  return (
    <header className="text-primary fixed top-0 right-0 sm:right-20">
      <div className="container mx-auto">
        <div className="flex md:flex-row justify-end items-center text-primary px-4 py-1 text-xs sm:text-base">
          <p>
            hai ancora <strong>{aiCallLeft}</strong> generazioni
          </p>
          <div className="flex items-center"></div>
        </div>
      </div>
    </header>
  );
};
