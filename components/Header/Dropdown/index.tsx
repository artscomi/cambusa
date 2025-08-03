"use client";

import { LogOut, User, Users, UsersIcon } from "lucide-react";

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
import { getMealListFromDB, getUserGroups } from "@/app/api/actions";
import { useState, useEffect } from "react";

export const DropdownMenuComponent = ({ name }: { name: string }) => {
  const { user } = useUser();
  const [mealList, setMealList] = useState<string | null>(null);
  const [userGroup, setUserGroup] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        const [mealListData, userGroupData] = await Promise.all([
          getMealListFromDB(user.id),
          getUserGroups(user.id)
        ]);
        setMealList(mealListData || null);
        setUserGroup(userGroupData);
      }
    };

    loadData();
  }, [user?.id]);

  if (!userGroup?.group) return null;

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
          {mealList && (
            <Link href="/my-menu">
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Il mio menu</span>
              </DropdownMenuItem>
            </Link>
          )}
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
