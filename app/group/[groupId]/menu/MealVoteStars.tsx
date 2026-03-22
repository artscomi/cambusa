"use client";

import { Star } from "lucide-react";
import { voteMenuItem } from "@/app/api/actions";
import { useEffect, useRef, useState, useTransition } from "react";

type VoteData = { average: number; count: number; userVote?: number };

function optimisticAvgCount(
  voteData: VoteData | undefined,
  newUserVote: number,
): { average: number; count: number } {
  const avg = voteData?.average ?? 0;
  const count = voteData?.count ?? 0;
  const prev = voteData?.userVote;
  const sum = avg * count;
  if (prev === undefined || prev < 1) {
    const newCount = count + 1;
    const newSum = sum + newUserVote;
    return {
      count: newCount,
      average:
        newCount > 0 ? Math.round((newSum / newCount) * 10) / 10 : 0,
    };
  }
  const newSum = sum - prev + newUserVote;
  return {
    count,
    average: count > 0 ? Math.round((newSum / count) * 10) / 10 : 0,
  };
}

export function MealVoteStars({
  groupId,
  mealTypeId,
  mealId,
  voteData,
  onVoteSuccess,
}: {
  groupId: string;
  mealTypeId: string;
  mealId: string;
  voteData?: VoteData;
  onVoteSuccess?: () => void;
}) {
  const [, startTransition] = useTransition();
  const [optimisticUserVote, setOptimisticUserVote] = useState<number | null>(
    null,
  );
  const voteSeqRef = useRef(0);

  const serverVote = voteData?.userVote ?? 0;
  const current = optimisticUserVote ?? serverVote;

  useEffect(() => {
    if (
      optimisticUserVote !== null &&
      serverVote === optimisticUserVote
    ) {
      setOptimisticUserVote(null);
    }
  }, [serverVote, optimisticUserVote]);

  const serverAverage = voteData?.average ?? 0;
  const serverCount = voteData?.count ?? 0;
  const { average, count } =
    optimisticUserVote !== null
      ? optimisticAvgCount(voteData, optimisticUserVote)
      : { average: serverAverage, count: serverCount };

  const handleVote = (value: number) => {
    const seq = ++voteSeqRef.current;
    setOptimisticUserVote(value);
    startTransition(async () => {
      const result = await voteMenuItem(groupId, mealTypeId, mealId, value);
      if (voteSeqRef.current !== seq) return;
      if (result.error) {
        setOptimisticUserVote(null);
        return;
      }
      onVoteSuccess?.();
    });
  };

  return (
    <div className="flex flex-col items-start gap-1 mt-2">
      <div className="flex items-center gap-0.5" aria-label="Vota da 1 a 5 stelle">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleVote(star)}
            className="p-0.5 rounded hover:bg-gray-100 transition-opacity"
            aria-pressed={current === star}
            aria-label={`${star} stella`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= current
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 hover:text-amber-200"
              }`}
            />
          </button>
        ))}
      </div>
      {(average > 0 || current > 0) && (
        <p className="text-xs text-gray-500">
          {count > 0 && (
            <span>Media: {average.toFixed(1)} ({count} voti)</span>
          )}
          {current > 0 && (
            <span className={count > 0 ? " ml-2" : ""}>Il tuo voto: {current}</span>
          )}
        </p>
      )}
    </div>
  );
}
