import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust based on your project
import { auth } from "@clerk/nextjs/server";
export async function POST(req: Request) {
  try {
    const { userId } = auth(); // Get the authenticated user ID from Clerk

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json(); // Parse the request body for group name

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    // Create the group and associate the user as the owner
    const group = await prisma.group.create({
      data: {
        name,
        ownerId: userId, // Set the current user as the owner
        members: {
          create: {
            userId, // Add the owner to the members list as well
          },
        },
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: `Internal Server Error ${error}` },
      { status: 500 }
    );
  }
}
