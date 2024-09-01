import fs from "fs";
import path from "path";
import { MainPage } from "@/components/MainPage";

export interface GroupData {
  id: string;
  dietaryPreferences: string[][];
}

const GroupMenu = ({ groupData }: { groupData: GroupData }) => (
  <MainPage groupData={groupData} />
);

export default GroupMenu;

export async function getServerSideProps(context: {
  params: { groupId: string };
}) {
  const { groupId } = context.params;
  const filePath = path.join(process.cwd(), "data", `${groupId}.json`);

  const groupData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return { props: { groupData } };
}
