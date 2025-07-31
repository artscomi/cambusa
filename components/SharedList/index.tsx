import {
  containerVariantsShoppingList,
  itemVariantsShoppingList,
} from "@/animations/framer-variants";
import { SharedIngredientItem } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Toast from "../Toast";
import {
  Clipboard,
  Share2,
  Plus,
  Pencil,
  Trash2,
  List,
} from "lucide-react";
import { useSharedListContext } from "@/context/useSharedListContext";

interface SharedListProps {
  listId: string;
  items: SharedIngredientItem[];
  listName: string;
  listDescription?: string;
  isOwner: boolean;
  completedBy?: string;
}

const SharedList: React.FC<SharedListProps> = ({
  listId,
  items,
  listName,
  listDescription,
  isOwner,
  completedBy,
}) => {
  const {
    addItemToList,
    removeItemFromList,
    toggleItemCompletion,
    updateItemQuantity,
    updateItemUnit,
  } = useSharedListContext();
  
  const [showToast, setShowToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<SharedIngredientItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item: "",
    quantity: 1,
    unit: "pezzi",
  });
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState<{
    id: string;
    quantity: number;
  } | null>(null);

  // Function to get the correct unit form based on quantity
  const getCorrectUnit = (unit: string, quantity: number): string => {
    if (quantity === 1) {
      switch (unit) {
        case "bottiglie":
          return "bottiglia";
        case "vasetti":
          return "vasetto";
        case "pezzi":
          return "pezzo";
        default:
          return unit;
      }
    } else {
      switch (unit) {
        case "bottiglia":
          return "bottiglie";
        case "vasetto":
          return "vasetti";
        case "pezzo":
          return "pezzi";
        default:
          return unit;
      }
    }
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeItemFromList(listId, itemToRemove.id);
      setItemToRemove(null);
      setShowConfirmModal(false);
    }
  };

  const cancelRemoveItem = () => {
    setItemToRemove(null);
    setShowConfirmModal(false);
  };

  const handleQuantityChange = (
    id: string,
    newQuantity: number,
    newUnit?: string
  ) => {
    updateItemQuantity(listId, id, newQuantity);
    if (newUnit) {
      updateItemUnit(listId, id, newUnit);
    }
    setShowQuantityModal(false);
    setEditingQuantity(null);
  };

  const openQuantityModal = (item: SharedIngredientItem) => {
    setEditingQuantity({
      id: item.id,
      quantity: item.quantity,
    });
    setShowQuantityModal(true);
  };

  const handleAddItem = () => {
    if (newItem.item.trim()) {
      addItemToList(listId, {
        item: newItem.item.trim(),
        quantity: newItem.quantity,
        unit: newItem.unit,
        isCompleted: false,
      });
      setNewItem({ item: "", quantity: 1, unit: "pezzi" });
      setShowAddModal(false);
    } else {
      // Se il campo è vuoto, mostra un feedback visivo ma non chiudere la modale
      // L'utente può decidere di compilare il campo o chiudere manualmente
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewItem({ item: "", quantity: 1, unit: "pezzi" });
  };

  const handleCopyToClipboard = () => {
    const listText = items
      .map((item) => `${item.item} - ${item.quantity} ${item.unit}`)
      .join("\n");

    navigator.clipboard.writeText(listText);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShare = async () => {
    const listText = items
      .map((item) => `${item.item} - ${item.quantity} ${item.unit}`)
      .join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Lista condivisa: ${listName}`,
          text: listText,
        });
      } else {
        handleCopyToClipboard();
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleUnitChange = (id: string, newUnit: string) => {
    updateItemUnit(listId, id, newUnit);
    setEditingUnit(null);
  };

  const handleToggleCompletion = (item: SharedIngredientItem) => {
    if (completedBy) {
      toggleItemCompletion(listId, item.id, completedBy);
    }
  };

  const renderIngredientList = (
    ingredients: SharedIngredientItem[],
    title: string,
    icon: React.ReactNode
  ) => {
    if (ingredients.length === 0) return null;

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
          {ingredients.map((item) => (
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
                    onChange={() => handleToggleCompletion(item)}
                    type="checkbox"
                    style={{
                      accentColor: "var(--accent-light)",
                      width: "1.5rem",
                      height: "1.5rem",
                      marginRight: "0.75rem",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    className="rounded"
                    checked={item.isCompleted}
                    disabled={!completedBy}
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openQuantityModal(item);
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors text-primary"
                  title="Modifica quantità e unità"
                >
                  <Pencil size={14} />
                </button>

                {/* Remove button for owner */}
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setItemToRemove(item);
                      setShowConfirmModal(true);
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

  return (
    <AnimatePresence>
      <div className="flex flex-col lg:flex-row justify-between pb-8 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{listName}</h1>
          {listDescription && (
            <p className="text-gray-600 mb-4">{listDescription}</p>
          )}
          <p className="text-l max-w-[700px]">
            Spunta gli elementi quando li hai acquistati per rimuoverli dalla
            lista. Puoi anche modificare quantità e unità di misura o aggiungere
            nuovi ingredienti.
          </p>
        </div>
        
        <div className="flex gap-2 fixed max-sm:bottom-10 bottom-auto sm:top-32 right-10 sm:right-[135px] z-10">
          {isOwner && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openAddModal}
              className="p-4 rounded bg-primary text-white shadow-md"
              title="Aggiungi ingrediente"
            >
              <Plus
                role="img"
                aria-label="aggiungi ingrediente"
                height={25}
                width={25}
              />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="p-4 rounded bg-primary text-white shadow-md"
            title="Condividi lista"
          >
            <Share2
              role="img"
              aria-label="condividi lista"
              height={25}
              width={25}
            />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCopyToClipboard}
            className="p-4 rounded bg-primary text-white shadow-md"
            title="Copia negli appunti"
          >
            <Clipboard
              role="img"
              aria-label="copia negli appunti"
              height={25}
              width={25}
            />
          </motion.button>
        </div>
      </div>

      {/* All Items in one list */}
      {renderIngredientList(items, "Lista ingredienti", <List className="w-6 h-6 text-primary" />)}

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeAddModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Aggiungi ingrediente</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome ingrediente
                  </label>
                  <input
                    type="text"
                    value={newItem.item}
                    onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Es. Pomodori"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantità
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unità
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="pezzi">pezzi</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="l">l</option>
                      <option value="ml">ml</option>
                      <option value="bottiglie">bottiglie</option>
                      <option value="vasetti">vasetti</option>
                      <option value="pacchi">pacchi</option>
                      <option value="scatole">scatole</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={closeAddModal}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleAddItem}
                    disabled={!newItem.item.trim()}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    Aggiungi
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quantity Edit Modal */}
      <AnimatePresence>
        {showQuantityModal && editingQuantity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowQuantityModal(false);
              setEditingQuantity(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
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
                        setEditingQuantity({
                          ...editingQuantity,
                          quantity: 0,
                        });
                      } else {
                        const parsedValue = parseInt(value);
                        if (!isNaN(parsedValue) && parsedValue > 0) {
                          setEditingQuantity({
                            ...editingQuantity,
                            quantity: parsedValue,
                          });
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
                    value={
                      items.find((item) => item.id === editingQuantity.id)
                        ?.unit || "pezzi"
                    }
                    onChange={(e) => {
                      handleUnitChange(editingQuantity.id, e.target.value);
                    }}
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
                  onClick={() => {
                    setShowQuantityModal(false);
                    setEditingQuantity(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      editingQuantity.id,
                      editingQuantity.quantity
                    )
                  }
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Remove Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={cancelRemoveItem}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Rimuovi elemento</h3>
              <p className="text-gray-600 mb-6">
                Sei sicuro di voler rimuovere "{itemToRemove?.item}" dalla lista?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={cancelRemoveItem}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annulla
                </button>
                <button
                  onClick={confirmRemoveItem}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Rimuovi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <Toast
        showToast={showToast}
        message="Lista copiata negli appunti!"
        type="success"
        onClose={() => setShowToast(false)}
      />
    </AnimatePresence>
  );
};

export default SharedList; 