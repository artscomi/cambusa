import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface VoteButtonsProps {
  itemId: string;
  currentVote: boolean | null;
  voteCount: number;
  onVote: (vote: boolean) => void;
  disabled?: boolean;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  itemId,
  currentVote,
  voteCount,
  onVote,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {/* Thumbs Down */}
      <button
        onClick={() => onVote(false)}
        disabled={disabled}
        className={`p-1 rounded transition-colors ${
          currentVote === false
            ? 'bg-red-100 text-red-600'
            : 'hover:bg-gray-100 text-gray-500 hover:text-red-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Non mi piace"
      >
        <ThumbsDown size={12} />
      </button>

      {/* Vote Count */}
      <span className={`text-xs font-medium px-1 ${
        voteCount > 0 ? 'text-green-600' : 
        voteCount < 0 ? 'text-red-600' : 
        'text-gray-500'
      }`}>
        {voteCount > 0 ? `+${voteCount}` : voteCount}
      </span>

      {/* Thumbs Up */}
      <button
        onClick={() => onVote(true)}
        disabled={disabled}
        className={`p-1 rounded transition-colors ${
          currentVote === true
            ? 'bg-green-100 text-green-600'
            : 'hover:bg-gray-100 text-gray-500 hover:text-green-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Mi piace"
      >
        <ThumbsUp size={12} />
      </button>
    </div>
  );
};

export default VoteButtons; 