import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const UNLIMITED_ACCOUNTS = [
  process.env.NEXT_PUBLIC_SPECIAL_USER_1,
  process.env.NEXT_PUBLIC_SPECIAL_USER_2,
].filter(Boolean) as string[];

export async function GET() {
  try {
    const { userId } = await auth();
    const isSpecialAccount = userId && UNLIMITED_ACCOUNTS.includes(userId);

    return NextResponse.json({ isSpecialAccount });
  } catch (error) {
    console.error("Error checking special account:", error);
    return NextResponse.json({ isSpecialAccount: false });
  }
}
