import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { GroupData } from "@/app/group/[groupId]/menu";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { groupId } = req.query;

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, `${groupId}.json`);

    let groupData: GroupData = {
      id: groupId as string,
      dietaryPreferences: JSON.parse(JSON.stringify(req.body)),
    };
    groupData.dietaryPreferences = groupData.dietaryPreferences || [];

    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, "utf-8");
      const existingPreferences = JSON.parse(existingData)
        .dietaryPreferences as [][];
      groupData.dietaryPreferences = [
        ...existingPreferences,
        ...groupData.dietaryPreferences,
      ];
    }

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
