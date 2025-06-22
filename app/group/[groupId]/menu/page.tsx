import { getGroupInfo } from "@/app/api/actions";
import { PageContent } from "./PageContent";
import db from "@/utils/db";

const GroupMenu = async ({ params }: { params: { groupId: string } }) => {
  const { groupId } = params;
  const group = await getGroupInfo(groupId);
  if (!group) {
    console.error(`Group not found for groupId: ${groupId}`);
    return <p>Group not found</p>;
  }

  const preferences = await db.foodPreference.findMany({
    where: {
      groupId: groupId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const alcoholPreferences = await db.alcoholPreference.findMany({
    where: {
      groupId: groupId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const waterPreferences = await db.waterPreference.findMany({
    where: {
      groupId: groupId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <PageContent
      group={group}
      preferences={preferences}
      alcoholPreferences={alcoholPreferences}
      waterPreferences={waterPreferences}
    />
  );
};

export default GroupMenu;
