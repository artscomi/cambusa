"use server";

import db from "@/utils/db";
import { auth } from "@clerk/nextjs/server";

export const resetApiCallCount = async () => {
  const { userId: clerkUserId } = auth();
  console.log({ clerkUserId });
  if (!clerkUserId) {
    throw new Error("Missing clerkUserId");
  }

  try {
    await db.user.update({
      where: { clerkUserId },
      data: { apiCallCount: 0 },
    });
  } catch (error) {
    console.error("Error resetting API call count:", error);
    throw new Error("Failed to reset API call count");
  }
};
