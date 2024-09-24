import { getUserInfo } from "@/app/api/get-user-info/actions";
import { getMaxAiCall } from "@/utils/user";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton, SignInButton } from "@clerk/nextjs";
import { Icon } from "../Icons";

export const Header = async () => {
  const { userId } = auth();

  const { apiCallCount, hasPaidForIncrease, name } = await getUserInfo();
  const maxAiCall = getMaxAiCall(hasPaidForIncrease);
  const aiCallLeft = maxAiCall - apiCallCount;

  return (
    <header className="bg-white fixed w-full z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center w-full">
        <nav className="flex items-center gap-4 text-primary w-full ">
          <ul className="flex items-center gap-5 text-sm md:text-base w-full justify-between sm:justify-end">
            {userId ? (
              <>
                <li>
                  <i className="inline-block align-middle mr-2">
                    <Icon.User width={25} />
                  </i>
                  {name}
                </li>
                <li>
                  <strong>{aiCallLeft}</strong>
                  <i className="inline-block align-middle ml-2">
                    <Icon.Reload width={25} />
                  </i>
                </li>
                <li>
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
