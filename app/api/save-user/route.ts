import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the path as needed
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth(); // Get the authenticated user ID from Clerk

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await req.json(); // Parse the request body

    // Check if the user already exists
    // const existingUser = await prisma.user.findUnique({
    //   where: { id: userId },
    // });

    // if (existingUser) {
    //   return NextResponse.json(
    //     { message: "User already exists" },
    //     { status: 200 }
    //   );
    // }

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { name, email },
      create: { id: userId, name, email },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
