import { prisma } from "@/lib/prisma";

export type GroupPreferenceProgressStats = {
  completedCount: number;
  expectedCrew: number;
  missingCount: number;
  membersJoined: number;
};

export async function getGroupPreferenceProgress(
  groupId: string,
  peopleField: string
): Promise<GroupPreferenceProgressStats> {
  const [allFoodPrefs, allAlcoholPrefs, allWaterPrefs, membersJoined] =
    await Promise.all([
      prisma.foodPreference.findMany({
        where: { groupId },
        select: { userId: true },
      }),
      prisma.alcoholPreference.findMany({
        where: { groupId },
        select: { userId: true },
      }),
      prisma.waterPreference.findMany({
        where: { groupId },
        select: { userId: true },
      }),
      prisma.groupMembership.count({ where: { groupId } }),
    ]);

  const foodUserIds = new Set(allFoodPrefs.map((r) => r.userId));
  const alcoholUserIds = new Set(allAlcoholPrefs.map((r) => r.userId));
  const waterUserIds = new Set(allWaterPrefs.map((r) => r.userId));
  let completedCount = 0;
  for (const uid of foodUserIds) {
    if (alcoholUserIds.has(uid) && waterUserIds.has(uid)) {
      completedCount += 1;
    }
  }

  const parsedPeople = parseInt(peopleField, 10);
  const expectedCrew =
    Number.isFinite(parsedPeople) && parsedPeople > 0
      ? parsedPeople
      : Math.max(membersJoined, 1);
  const missingCount = Math.max(0, expectedCrew - completedCount);

  return {
    completedCount,
    expectedCrew,
    missingCount,
    membersJoined,
  };
}
