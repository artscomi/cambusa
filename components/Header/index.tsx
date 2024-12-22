import { getMaxAiCall } from "@/utils/user";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { getUserInfo } from "@/app/api/actions";
import { RefreshCcw } from "lucide-react";
import { DropdownMenuComponent } from "./Dropdown";
import { Logo } from "./Logo";
import { ApiCallCountComponent } from "./ApiCallCountComponent";

export const Header = async () => {
  const { userId } = await auth();

  const { apiCallCount, hasPaidForIncrease, name } = await getUserInfo();
  const maxAiCall = getMaxAiCall(hasPaidForIncrease);
  const aiCallLeft = maxAiCall - apiCallCount;

  return (
    <header className="bg-white fixed w-full z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center w-full">
        <Logo />
        <nav className="text-primary w-full">
          <ul className="flex justify-end items-center gap-5 text-sm md:text-base w-full sm:justify-end">
            {userId ? (
              <>
                <ApiCallCountComponent aiCallLeft={aiCallLeft} />
                <li>
                  <DropdownMenuComponent name={name} />
                </li>
              </>
            ) : (
              <li>
                <SignInButton>Sign In</SignInButton>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
