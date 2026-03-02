"use client";

import { Star } from "lucide-react";
import { voteMenuItem } from "@/app/api/actions";
import { useTransition } from "react";

type VoteData = { average: number; count: number; userVote?: number };

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
  const [isPending, startTransition] = useTransition();
  const current = voteData?.userVote ?? 0;
  const average = voteData?.average ?? 0;
  const count = voteData?.count ?? 0;

  const handleVote = (value: number) => {
    startTransition(async () => {
      const result = await voteMenuItem(groupId, mealTypeId, mealId, value);
      if (!result.error && onVoteSuccess) onVoteSuccess();
    });
  };

  return (
    <div className="flex flex-col items-start gap-1 mt-2">
      <div className="flex items-center gap-0.5" aria-label="Vota da 1 a 5 stelle">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isPending}
            onClick={() => handleVote(star)}
            className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-50 transition-opacity"
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
