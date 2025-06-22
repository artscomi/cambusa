import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the path as needed
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function POST(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { preference } = await req.json(); // Parse the request body

    if (!preference) {
      return NextResponse.json(
        { error: "Preference is required" },
        { status: 400 }
      );
    }

    // Add the user as a member if they aren't already in the group
    await prisma.groupMembership.upsert({
      where: {
        userId_groupId: {
          userId,
          groupId: params.groupId,
        },
      },
      update: {}, // Do nothing if already a member
      create: { userId, groupId: params.groupId }, // Add new membership if not
    });

    // Create the alcohol preference for the group
    const alcoholPreference = await prisma.alcoholPreference.create({
      data: {
        userId,
        groupId: params.groupId,
        preference,
      },
    });

    // Revalidate the path to refresh the group's alcohol preferences
    revalidatePath(`/groups/${params.groupId}/menu`);

    return NextResponse.json(alcoholPreference, { status: 201 });
  } catch (error) {
    console.error("Error adding alcohol preference:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
