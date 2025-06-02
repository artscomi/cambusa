import { auth } from "@clerk/nextjs/server";

export const FREE_TIER_API_CALLS = 3;
export const PAID_TIER_API_CALLS = 5;
export const UNLIMITED_API_CALLS = 999;

// Lista degli account speciali con chiamate illimitate
const UNLIMITED_ACCOUNTS = [
  process.env.NEXT_PUBLIC_SPECIAL_USER_1,
  process.env.NEXT_PUBLIC_SPECIAL_USER_2,
].filter(Boolean) as string[];

export const getMaxAiCall = async (hasPaidForIncrease: boolean) => {
  try {
    const { userId } = await auth();
    if (userId && UNLIMITED_ACCOUNTS.includes(userId)) {
      return UNLIMITED_API_CALLS;
    }
  } catch (error) {
    console.error("Error checking special account:", error);
  }

  return hasPaidForIncrease ? PAID_TIER_API_CALLS : FREE_TIER_API_CALLS;
};
