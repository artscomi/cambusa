"use client";

import { LogOut, User, Users, UsersIcon, UtensilsCrossed } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { getUserGroups } from "@/app/api/actions";
import { useState, useEffect } from "react";

export const DropdownMenuComponent = ({ name }: { name: string }) => {
  const { user } = useUser();
  const [userGroup, setUserGroup] = useState<Awaited<
    ReturnType<typeof getUserGroups>
  > | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        setUserGroup(await getUserGroups(user.id));
      }
    };

    loadData();
  }, [user?.id]);

  const memberships = userGroup?.group ?? [];

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
        <DropdownMenuLabel>Profilo</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href="/my-menu">
            <DropdownMenuItem>
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              <span>Il mio menu</span>
            </DropdownMenuItem>
          </Link>
          {memberships.length > 0 ? (
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
