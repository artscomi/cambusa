import { UNLIMITED_API_CALLS } from "@/utils/constants";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { getUserInfo, getMaxAiCall } from "@/app/api/actions";
import { DropdownMenuComponent } from "./Dropdown";
import { Logo } from "./Logo";
import { ApiCallCountComponent } from "./ApiCallCountComponent";
import Link from "next/link";

export const Header = async () => {
  const { userId } = await auth();

  const { apiCallCount, hasPaidForIncrease, name } = await getUserInfo(userId || "");
  const maxAiCall = await getMaxAiCall(hasPaidForIncrease, userId || "");

  const aiCallLeft =
    maxAiCall === UNLIMITED_API_CALLS ? maxAiCall : maxAiCall - apiCallCount;

  return (
    <header className="bg-white fixed w-full z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center w-full">
        <Logo />
        <nav className="text-primary w-full">
          <ul className="flex justify-end items-center gap-5 text-sm md:text-base w-full sm:justify-end">
            <li>
              <Link href="/blog">Blog</Link>
            </li>
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
