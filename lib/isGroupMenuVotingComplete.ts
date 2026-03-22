import type { MealList } from "@/types/types";

type VoteByKey = Record<
  string,
  { average: number; count: number; userVote?: number }
>;

/**
 * True se ogni pasto ha almeno `votersRequired` voti (un voto per membro che deve votare).
 * Si usa il numero di membri del gruppo, non il campo «persone» del viaggio (che può essere più alto).
 */
export function isGroupMenuVotingComplete(
  mealList: MealList | undefined | null,
  votesByKey: VoteByKey | undefined,
  votersRequired: number,
): boolean {
  if (!mealList || mealList.length === 0 || votersRequired <= 0) return false;

  for (const mealType of mealList) {
    for (const meal of mealType.meals ?? []) {
      const key = `${mealType.id}-${meal.id}`;
      const count = votesByKey?.[key]?.count ?? 0;
      if (count < votersRequired) return false;
    }
  }

  return true;
}
