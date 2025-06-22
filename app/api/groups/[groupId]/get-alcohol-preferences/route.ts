import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  const { groupId } = params;

  if (!groupId) {
    return NextResponse.json(
      { error: "Group ID is required" },
      { status: 400 }
    );
  }

  const alcoholPreferences = await prisma.alcoholPreference.findMany({
    where: { groupId },
    include: { user: true },
  });

  return NextResponse.json(alcoholPreferences || []);
}
