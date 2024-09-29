import { getMaxAiCall } from "@/utils/user";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton, SignInButton } from "@clerk/nextjs";
import { Icon } from "../Icons";
import { getUserInfo } from "@/app/api/actions";

export const Header = async () => {
  const { userId } = auth();

  const { apiCallCount, hasPaidForIncrease, name } = await getUserInfo();
  const maxAiCall = getMaxAiCall(hasPaidForIncrease);
  const aiCallLeft = maxAiCall - apiCallCount;

  return (
    <header className="bg-white fixed w-full z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center w-full">
        <nav className="text-primary w-full">
          <ul className="grid grid-cols-[1fr,auto,1fr] sm:flex items-center gap-5 text-sm md:text-base w-full justify-between sm:justify-end">
            {userId ? (
              <>
                <li>
                  <i className="inline-block align-middle mr-2">
                    <Icon.User width={25} />
                  </i>
                  {name}
                </li>
                <li className="text-center">
                  <strong>{aiCallLeft}</strong>
                  <i className="inline-block align-middle ml-2">
                    <Icon.Reload width={25} />
                  </i>
                </li>
                <li className="text-right">
                  <SignOutButton>Sign Out</SignOutButton>
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
