import fs from "fs";
import path from "path";
import { MainForm } from "@/components/MainForm";
import { GroupData } from "@/types/types";
import { MealMenu } from "@/components/MealMenu";

async function getGroupData(groupId: string): Promise<GroupData> {
  const filePath = path.join(process.cwd(), "data", `${groupId}.json`);
  const groupData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return groupData;
}

const GroupMenu = async ({ params }: { params: { groupId: string } }) => {
  const groupData = await getGroupData(params.groupId);

  return (
    <>
      <MainForm groupData={groupData} />
      <MealMenu />
    </>
  );
};

export default GroupMenu;
