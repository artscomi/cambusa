import { LogOut, User, Users, UsersIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { getUserGroups } from "@/app/api/actions";

export const DropdownMenuComponent = async ({ name }: { name: string }) => {
  const userGroup = await getUserGroups();
  if (!userGroup.group) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <p className="font-bold cursor-pointer">
          <i className="inline-block align-middle mr-2">
            <User />
          </i>
          {name}
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          {userGroup.group.length > 0 ? (
            <Link href="/my-groups">
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>I miei Gruppi</span>
              </DropdownMenuItem>
            </Link>
          ) : (
            <Link href="/group/create-group">
              <DropdownMenuItem>
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>Crea gruppo</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>

        <SignOutButton>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
