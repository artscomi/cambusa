"use server";

import db from "@/utils/db";

export async function getUserApiCallCount(userId: string) {
  "use server";

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      apiCallCount: true,
    },
  });

  if (!user) {
    console.log("user not found");
    return;
  }

  console.log("api call", user.apiCallCount);
  // Return success response
  return user.apiCallCount;
}
