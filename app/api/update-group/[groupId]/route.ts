import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { GroupData } from "@/types/types";

export async function POST(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  const { groupId } = params;

  if (groupId) {
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, `${groupId}.json`);

    let groupData: GroupData = {
      id: groupId,
      dietaryPreferences: await req.json(),
    };
    groupData.dietaryPreferences = groupData.dietaryPreferences || [];

    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, "utf-8");
      const existingPreferences =
        JSON.parse(existingData).dietaryPreferences || [];
      groupData.dietaryPreferences = [
        ...existingPreferences,
        ...groupData.dietaryPreferences,
      ];
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(groupData));
      return NextResponse.json(
        { message: "Dietary preferences updated" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error writing file:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Group ID is required" },
      { status: 400 }
    );
  }
}
