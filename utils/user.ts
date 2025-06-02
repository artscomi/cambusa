export const FREE_TIER_API_CALLS = 3;
export const PAID_TIER_API_CALLS = 5;
export const UNLIMITED_API_CALLS = Infinity;

export const UNLIMITED_ACCOUNTS = [
  process.env.NEXT_PUBLIC_SPECIAL_USER_1,
  process.env.NEXT_PUBLIC_SPECIAL_USER_2,
].filter(Boolean) as string[];

export const getMaxAiCall = async (hasPaidForIncrease: boolean) => {
  try {
    const response = await fetch("/api/check-special-account");
    const { isSpecialAccount } = await response.json();

    if (isSpecialAccount) {
      return UNLIMITED_API_CALLS;
    }
  } catch (error) {
    console.error("Error checking special account:", error);
  }

  return hasPaidForIncrease ? PAID_TIER_API_CALLS : FREE_TIER_API_CALLS;
};
