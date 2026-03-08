import { UNLIMITED_API_CALLS } from "@/utils/constants";
import { auth } from "@clerk/nextjs/server";
import { getUserInfo, getMaxAiCall } from "@/app/api/actions";
import { HeaderBar } from "./HeaderBar";
import { HeaderNavContent } from "./HeaderNavContent";
import { Logo } from "./Logo";

export const Header = async () => {
  const { userId } = await auth();

  const { apiCallCount, hasPaidForIncrease, name } = await getUserInfo(userId || "");
  const maxAiCall = await getMaxAiCall(hasPaidForIncrease, userId || "");

  const aiCallLeft =
    maxAiCall === UNLIMITED_API_CALLS ? maxAiCall : maxAiCall - apiCallCount;

  return (
    <HeaderBar>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center w-full">
        <Logo />
        <HeaderNavContent
          userId={userId}
          aiCallLeft={aiCallLeft}
          name={name}
        />
      </div>
    </HeaderBar>
  );
};
