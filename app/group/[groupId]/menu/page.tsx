import { getGroupInfo, getGroupMealList, getGroupMenuVotes } from "@/app/api/actions";
import { PageContent } from "./PageContent";
import db from "@/utils/db";
import { getGroupPreferenceProgress } from "@/lib/getGroupPreferenceProgress";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";

const GroupMenu = async ({ params }: { params: { groupId: string } }) => {
  const { groupId } = params;
  const { userId } = await auth();
  const group = await getGroupInfo(groupId);
  if (!group) {
    console.error(`Group not found for groupId: ${groupId}`);
    return <p>Group not found</p>;
  }

  // Utente invitato senza preferenze: reindirizza al form del gruppo per compilarle
  if (userId && !group.isTheGroupOwner) {
    const [foodCount, alcoholCount, waterCount] = await Promise.all([
      db.foodPreference.count({ where: { groupId, userId } }),
      db.alcoholPreference.count({ where: { groupId, userId } }),
      db.waterPreference.count({ where: { groupId, userId } }),
    ]);
    if (foodCount === 0 && alcoholCount === 0 && waterCount === 0) {
      redirect(`/group/${groupId}`);
    }
  }

  const [
    preferences,
    alcoholPreferences,
    waterPreferences,
    groupMealList,
    votes,
    preferenceProgress,
  ] = await Promise.all([
    db.foodPreference.findMany({
      where: { groupId },
      include: {
        user: { select: { name: true } },
      },
    }),
    db.alcoholPreference.findMany({
      where: { groupId },
      include: {
        user: { select: { name: true } },
      },
    }),
    db.waterPreference.findMany({
      where: { groupId },
      include: {
        user: { select: { name: true } },
      },
    }),
    getGroupMealList(groupId),
    getGroupMenuVotes(groupId),
    getGroupPreferenceProgress(groupId, group.people),
  ]);

  return (
    <PageContainer>
      <PageContent
        group={group}
        preferences={preferences}
        alcoholPreferences={alcoholPreferences}
        waterPreferences={waterPreferences}
        groupMealList={groupMealList ?? undefined}
        votes={votes ?? undefined}
        preferenceProgress={preferenceProgress}
      />
    </PageContainer>
  );
};

export default GroupMenu;
