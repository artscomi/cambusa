import { UNLIMITED_USERS } from "@/utils/constants";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    const isSpecialAccount = userId && UNLIMITED_USERS.includes(userId);

    return NextResponse.json({ isSpecialAccount });
  } catch (error) {
    console.error("Error checking special account:", error);
    return NextResponse.json({ isSpecialAccount: false });
  }
}
