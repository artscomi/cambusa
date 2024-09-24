"use server";

import db from "@/utils/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export const getUserInfo = async () => {
  "use server";
  const { userId } = auth();

  if (!userId) {
    console.error("user not found");
    return {
      apiCallCount: 0,
      hasPaidForIncrease: false,
      name: "",
    };
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      apiCallCount: true,
      hasPaidForIncrease: true,
      name: true
    },
  });

  if (!user) {
    console.error("user not found");
    return {
      apiCallCount: 0,
      hasPaidForIncrease: false,
      name: "",
    };
  }

  revalidatePath("/", "layout");

  return {
    apiCallCount: user.apiCallCount,
    hasPaidForIncrease: user.hasPaidForIncrease,
    name: user.name
  };
};
