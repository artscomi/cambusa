import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/utils/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = params;
    const { preference } = await request.json();

    if (!preference || typeof preference !== "string") {
      return NextResponse.json(
        { error: "Preference is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if user is a member of the group
    const membership = await prisma.groupMembership.findUnique({
      where: {
        userId_groupId: {
          userId: userId,
          groupId: groupId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "User is not a member of this group" },
        { status: 403 }
      );
    }

    // Delete existing water preferences for this user in this group
    await prisma.waterPreference.deleteMany({
      where: {
        userId: userId,
        groupId: groupId,
      },
    });

    // Create new water preference
    const waterPreference = await prisma.waterPreference.create({
      data: {
        userId: userId,
        groupId: groupId,
        preference: preference,
      },
    });

    return NextResponse.json(waterPreference, { status: 201 });
  } catch (error) {
    console.error("Error setting water preference:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
