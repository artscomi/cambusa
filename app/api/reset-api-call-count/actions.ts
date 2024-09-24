"use server";

import db from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import {  revalidatePath } from "next/cache";

export const resetApiCallCount = async () => {
  "use server";
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    throw new Error("Missing clerkUserId");
  }

  try {
    await db.user.update({
      where: { clerkUserId },
      data: { apiCallCount: 0, hasPaidForIncrease: true },
    });

    revalidatePath('/', 'layout')

  } catch (error) {
    console.error("Error resetting API call count:", error);
    throw new Error("Failed to reset API call count");
  }
};
