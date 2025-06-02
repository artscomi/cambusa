import { UNLIMITED_ACCOUNTS } from "@/utils/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
