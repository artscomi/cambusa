import React from "react";
import { Users, ThumbsUp, ThumbsDown, CheckCircle, Clock } from "lucide-react";
import { SharedIngredientItem } from "@/types/types";

interface SharedListStatsProps {
  items: SharedIngredientItem[];
  totalVotes: number;
  uniqueVoters: number;
}

const SharedListStats: React.FC<SharedListStatsProps> = ({
  items,
  totalVotes,
  uniqueVoters,
}) => {
  const completedItems = items.filter(item => item.isCompleted).length;
  const pendingItems = items.length - completedItems;
  const positiveVotes = items.reduce((sum, item) => {
    if (item.votes) {
      return sum + Object.values(item.votes).filter(vote => vote).length;
    }
    return sum;
  }, 0);
  const negativeVotes = items.reduce((sum, item) => {
    if (item.votes) {
      return sum + Object.values(item.votes).filter(vote => !vote).length;
    }
    return sum;
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiche Lista</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Elementi Totali */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{items.length}</div>
          <div className="text-sm text-gray-600">Elementi totali</div>
        </div>

        {/* Elementi Completati */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
            <CheckCircle size={20} />
            {completedItems}
          </div>
          <div className="text-sm text-gray-600">Completati</div>
        </div>

        {/* Elementi in Attesa */}
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
            <Clock size={20} />
            {pendingItems}
          </div>
          <div className="text-sm text-gray-600">In attesa</div>
        </div>

        {/* Votanti Unici */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
            <Users size={20} />
            {uniqueVoters}
          </div>
          <div className="text-sm text-gray-600">Hanno votato</div>
        </div>
      </div>

      {/* Statistiche Voti */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-900 mb-3">Voti</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-1">
              <ThumbsUp size={16} />
              {positiveVotes}
            </div>
            <div className="text-xs text-gray-600">Positivi</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600 flex items-center justify-center gap-1">
              <ThumbsDown size={16} />
              {negativeVotes}
            </div>
            <div className="text-xs text-gray-600">Negativi</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${
              totalVotes > 0 ? 'text-green-600' : 
              totalVotes < 0 ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {totalVotes > 0 ? `+${totalVotes}` : totalVotes}
            </div>
            <div className="text-xs text-gray-600">Totale</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso</span>
          <span className="text-sm text-gray-600">
            {completedItems}/{items.length} ({Math.round((completedItems / items.length) * 100)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedItems / items.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SharedListStats; 