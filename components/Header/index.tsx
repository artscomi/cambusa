import {
  getMaxAiCall,
  UNLIMITED_ACCOUNTS,
  UNLIMITED_API_CALLS,
} from "@/utils/user";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { getUserInfo } from "@/app/api/actions";
import { DropdownMenuComponent } from "./Dropdown";
import { Logo } from "./Logo";
import { ApiCallCountComponent } from "./ApiCallCountComponent";
import Link from "next/link";

export const Header = async () => {
  const { userId } = await auth();

  const { apiCallCount, hasPaidForIncrease, name } = await getUserInfo();
  const maxAiCall = await getMaxAiCall(hasPaidForIncrease);
  const isSpecialAccount = userId && UNLIMITED_ACCOUNTS.includes(userId);

  const aiCallLeft = isSpecialAccount
    ? UNLIMITED_API_CALLS
    : maxAiCall - apiCallCount;

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
