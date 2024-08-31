import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { GroupData } from "@/pages/group/[groupId]/menu";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { groupId } = req.query;
    const { dietaryPreferences } = req.body;

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, `${groupId}.json`);

    let groupData: GroupData = {
      id: groupId as string,
      dietaryPreferences: dietaryPreferences,
    };
    groupData.dietaryPreferences = groupData.dietaryPreferences || "";

    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, "utf-8");
      groupData = JSON.parse(existingData);
    }

    const newPreferences = Array.isArray(dietaryPreferences)
      ? dietaryPreferences
      : [dietaryPreferences];
    groupData.dietaryPreferences = Array.from(
      new Set([...groupData.dietaryPreferences.split(","), ...newPreferences])
    )
      .filter((item) => item.trim() !== "")
      .join(", ");

    try {
      fs.writeFileSync(filePath, JSON.stringify(groupData));
      res.status(200).json({ message: "Dietary preferences updated" });
    } catch (error) {
      console.error("Error writing file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
export default handler;
