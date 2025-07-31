import {
  containerVariantsShoppingList,
  itemVariantsShoppingList,
} from "@/animations/framer-variants";
import { IngredientItem } from "@/hooks/useIngredientList";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import {
  Pencil,
  Trash2,
} from "lucide-react";

interface IngredientListProps {
  items: IngredientItem[];
  title: string;
  icon: React.ReactNode;
  onCheckboxChange: (item: IngredientItem) => void;
  onQuantityEdit: (item: IngredientItem) => void;
  onRemoveItem?: (item: IngredientItem) => void;
  canEdit?: boolean;
  canRemove?: boolean;
  getCorrectUnit: (unit: string, quantity: number) => string;
}

const IngredientList: React.FC<IngredientListProps> = ({
  items,
  title,
  icon,
  onCheckboxChange,
  onQuantityEdit,
  onRemoveItem,
  canEdit = true,
  canRemove = true,
  getCorrectUnit,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariantsShoppingList}
      >
        {items.map((item) => (
          <motion.li
            whileHover={{ scale: 0.98 }}
            role="listitem"
            tabIndex={0}
            variants={itemVariantsShoppingList}
            key={item.id}
            className="cursor-pointer flex items-center justify-between bg-white rounded-lg px-5 py-4 shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  tabIndex={-1}
                  onChange={() => onCheckboxChange(item)}
                  type="checkbox"
                  style={{
                    accentColor: "var(--accent-light)",
                    width: "1.5rem",
                    height: "1.5rem",
                    marginRight: "0.75rem",
                    cursor: "pointer",
                    pointerEvents: canEdit ? "auto" : "none",
                  }}
                  className="rounded"
                  checked={item.isCompleted || false}
                  disabled={!canEdit}
                />
                <span 
                  className={`max-w-[130px] truncate ${item.isCompleted ? 'line-through text-gray-500' : ''}`} 
                  title={item.item}
                >
                  {item.item}
                </span>
              </label>
            </div>

            <div className="flex items-center gap-1 ml-4">
              {/* Quantity display */}
              <span className="font-medium text-center">{item.quantity}</span>

              <span className="text-gray-600">
                {getCorrectUnit(item.unit, item.quantity)}
              </span>

              {/* Quantity edit button */}
              {canEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityEdit(item);
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors text-primary"
                  title="Modifica quantità e unità"
                >
                  <Pencil size={14} />
                </button>
              )}

              {/* Remove button */}
              {canRemove && onRemoveItem && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item);
                  }}
                  className="p-1 hover:bg-red-100 rounded transition-colors text-red-500"
                  title="Rimuovi elemento"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default IngredientList; 