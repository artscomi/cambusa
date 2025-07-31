import { motion } from "framer-motion";
import React from "react";
import { IngredientItem } from "@/hooks/useIngredientList";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  newItem: {
    item: string;
    quantity: number;
    unit: string;
  };
  onNewItemChange: (field: string, value: string | number) => void;
  onAddItem: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  newItem,
  onNewItemChange,
  onAddItem,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 text-primary">
            Aggiungi ingrediente
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome ingrediente
            </label>
            <input
              type="text"
              placeholder="Es. Pomodori"
              value={newItem.item}
              onChange={(e) => onNewItemChange("item", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantità
              </label>
              <input
                type="number"
                min="1"
                placeholder="1"
                value={newItem.quantity}
                onChange={(e) => onNewItemChange("quantity", parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unità di misura
              </label>
              <select
                value={newItem.unit}
                onChange={(e) => onNewItemChange("unit", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pezzi">pezzi</option>
                <option value="g">grammi</option>
                <option value="kg">chilogrammi</option>
                <option value="ml">millilitri</option>
                <option value="l">litri</option>
                <option value="tazze">tazze</option>
                <option value="cucchiai">cucchiai</option>
                <option value="bottiglia">bottiglia</option>
                <option value="bottiglie">bottiglie</option>
                <option value="vasetto">vasetto</option>
                <option value="vasetti">vasetti</option>
                <option value="fette">fette</option>
                <option value="spicchi">spicchi</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={onAddItem}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              disabled={!newItem.item.trim() || newItem.quantity <= 0}
            >
              Salva
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface QuantityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingQuantity: {
    id: string;
    quantity: number;
  } | null;
  onEditingQuantityChange: (quantity: number) => void;
  onUnitChange: (unit: string) => void;
  onSave: () => void;
  currentUnit: string;
  items: IngredientItem[];
}

export const QuantityEditModal: React.FC<QuantityEditModalProps> = ({
  isOpen,
  onClose,
  editingQuantity,
  onEditingQuantityChange,
  onUnitChange,
  onSave,
  currentUnit,
  items,
}) => {
  if (!isOpen || !editingQuantity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-md mx-4"
      >
        <h3 className="text-lg font-semibold mb-4">
          Modifica quantità e unità
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantità:
            </label>
            <input
              type="number"
              min="1"
              value={editingQuantity.quantity === 0 ? "" : editingQuantity.quantity}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  onEditingQuantityChange(0);
                } else {
                  const parsedValue = parseInt(value);
                  if (!isNaN(parsedValue) && parsedValue > 0) {
                    onEditingQuantityChange(parsedValue);
                  }
                }
              }}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                editingQuantity.quantity <= 0 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-primary'
              }`}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unità di misura:
            </label>
            <select
              value={currentUnit}
              onChange={(e) => onUnitChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pezzo">pezzo</option>
              <option value="pezzi">pezzi</option>
              <option value="g">grammi</option>
              <option value="kg">chilogrammi</option>
              <option value="ml">millilitri</option>
              <option value="l">litri</option>
              <option value="tazze">tazze</option>
              <option value="cucchiai">cucchiai</option>
              <option value="bottiglia">bottiglia</option>
              <option value="bottiglie">bottiglie</option>
              <option value="vasetto">vasetto</option>
              <option value="vasetti">vasetti</option>
              <option value="fette">fette</option>
              <option value="spicchi">spicchi</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={onSave}
            disabled={editingQuantity.quantity <= 0}
            className={`px-4 py-2 rounded-lg transition-colors ${
              editingQuantity.quantity <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            Salva
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface ConfirmRemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export const ConfirmRemoveModal: React.FC<ConfirmRemoveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-md mx-4"
      >
        <h3 className="text-lg font-semibold mb-4">Conferma rimozione</h3>
        <p className="text-gray-600 mb-6">
          Sei sicuro di voler rimuovere{" "}
          <strong>"{itemName}"</strong> dalla lista?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Rimuovi
          </button>
        </div>
      </motion.div>
    </div>
  );
}; 