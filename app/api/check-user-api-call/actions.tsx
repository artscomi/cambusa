"use server";

import db from "@/utils/db";
import { revalidatePath } from "next/cache";

export async function getUserApiCallCount(userId: string) {
  "use server";

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      apiCallCount: true,
      hasPaidForIncrease: true,
    },
  });

  if (!user) {
    console.log("user not found");
    return {
      apiCallCount: 0,
      hasPaidForIncrease: false,
    };
  }

  revalidatePath("/");

  // Return success response
  return {
    apiCallCount: user.apiCallCount,
    hasPaidForIncrease: user.hasPaidForIncrease,
  };
}
