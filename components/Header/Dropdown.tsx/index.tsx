import { LogOut, User, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export const DropdownMenuComponent = ({ name }: { name: string }) => {
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
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/my-groups">
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>I miei Gruppi</span>
            </DropdownMenuItem>
          </Link>
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
