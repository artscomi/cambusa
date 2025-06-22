import {
  containerVariantsShoppingList,
  itemVariantsShoppingList,
} from "@/animations/framer-variants";
import { Ingredient } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Toast from "../Toast";
import {
  Clipboard,
  Share2,
  Wine,
  Utensils,
  Droplets,
  Plus,
  Pencil,
} from "lucide-react";
import { useShoppingContext } from "@/context/useShoppingListContext";

const Checklist: React.FC<{ items: Ingredient[] }> = ({ items }) => {
  const { shoppingList, setShoppingList } = useShoppingContext();
  const [showToast, setShowToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<Ingredient | null>(null);
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
      // Singular forms
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
      // Plural forms
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

  const filteredItems = items;

  // Separate water ingredients from other ingredients
  const waterIngredients = filteredItems.filter(
    (item) => item.id.startsWith("water_") || item.item.includes("💧")
  );

  // Separate alcohol ingredients from food ingredients
  const alcoholIngredients = filteredItems.filter(
    (item) =>
      (item.id.startsWith("alcohol_") ||
        item.item.includes("🍷") ||
        item.item.includes("🥂") ||
        item.item.includes("🍺") ||
        item.item.includes("🍹") ||
        item.item.includes("🥃") ||
        item.item.includes("🥤")) &&
      !item.id.startsWith("water_") &&
      !item.item.includes("💧")
  );

  const foodIngredients = filteredItems.filter(
    (item) =>
      !item.id.startsWith("alcohol_") &&
      !item.id.startsWith("water_") &&
      !item.item.includes("🍷") &&
      !item.item.includes("🥂") &&
      !item.item.includes("🍺") &&
      !item.item.includes("🍹") &&
      !item.item.includes("🥃") &&
      !item.item.includes("🥤") &&
      !item.item.includes("💧")
  );

  const handleCheckboxChange = (item: Ingredient) => {
    setItemToRemove(item);
    setShowConfirmModal(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      const updatedList = shoppingList.filter(
        (item) => item.id !== itemToRemove.id
      );
      setShoppingList(updatedList);
    }
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  const cancelRemoveItem = () => {
    setShowConfirmModal(false);
    setItemToRemove(null);
  };

  const handleQuantityChange = (
    id: string,
    newQuantity: number,
    newUnit?: string
  ) => {
    if (newQuantity > 0) {
      const updatedList = shoppingList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: newQuantity,
            unit: newUnit || item.unit,
          };
        }
        return item;
      });
      setShoppingList(updatedList);
    }
    setShowQuantityModal(false);
    setEditingQuantity(null);
  };

  const openQuantityModal = (item: Ingredient) => {
    setEditingQuantity({ id: item.id, quantity: item.quantity });
    setShowQuantityModal(true);
  };

  const handleAddItem = () => {
    if (newItem.item.trim() && newItem.quantity > 0) {
      const newIngredient: Ingredient = {
        id: `manual_${Date.now()}`,
        item: newItem.item.trim(),
        quantity: newItem.quantity,
        unit: newItem.unit,
      };

      setShoppingList([...shoppingList, newIngredient]);
      setNewItem({ item: "", quantity: 1, unit: "pezzi" });
      setShowAddModal(false);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setNewItem({ item: "", quantity: 1, unit: "pezzi" });
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewItem({ item: "", quantity: 1, unit: "pezzi" });
  };

  const handleCopyToClipboard = () => {
    const listText = items
      .map((item) => `${item.item} - ${item.quantity} ${item.unit}`)
      .join("\n");

    navigator.clipboard.writeText(listText).then(() => setShowToast(true));
  };

  const handleShare = async () => {
    const listText = items
      .map((item) => `${item.item} - ${item.quantity} ${item.unit}`)
      .join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "La mia lista della spesa",
          text: listText,
        });
      } else {
        // Fallback to clipboard if Web Share API is not supported
        handleCopyToClipboard();
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleUnitChange = (id: string, newUnit: string) => {
    const updatedList = shoppingList.map((item) => {
      if (item.id === id) {
        return { ...item, unit: newUnit };
      }
      return item;
    });
    setShoppingList(updatedList);
    setEditingUnit(null);
  };

  const renderIngredientList = (
    ingredients: Ingredient[],
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
                    onChange={() => handleCheckboxChange(item)}
                    type="checkbox"
                    style={{
                      accentColor: "var(--accent-light)",
                      width: "1.5rem",
                      height: "1.5rem",
                      marginRight: "0.75rem",
                      cursor: "pointer",
                      pointerEvents: "none",
                    }}
                    className="rounded"
                    checked={false}
                  />
                  <span className="max-w-[130px] truncate" title={item.item}>
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
          <h1>La tua lista della spesa</h1>
          <p className="text-l max-w-[700px]">
            Spunta gli elementi quando li hai acquistati per rimuoverli dalla
            lista. Puoi anche modificare quantità e unità di misura o aggiungere
            nuovi ingredienti.
          </p>
        </div>
        <div className="flex gap-2 fixed max-sm:bottom-10 bottom-auto sm:top-32 right-10 sm:right-[135px] z-10">
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 text-primary">
                  Aggiungi ingrediente
                </h2>
                <button
                  onClick={closeAddModal}
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
                    onChange={(e) =>
                      setNewItem({ ...newItem, item: e.target.value })
                    }
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
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unità di misura
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unit: e.target.value })
                      }
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
                    onClick={closeAddModal}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    disabled={!newItem.item.trim() || newItem.quantity <= 0}
                  >
                    Salva
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Ingredients Section */}
      {renderIngredientList(
        foodIngredients,
        "Ingredienti per i pasti",
        <Utensils className="w-6 h-6" />
      )}

      {/* Water Ingredients Section */}
      {renderIngredientList(
        waterIngredients,
        "Acqua",
        <Droplets className="w-6 h-6" />
      )}

      {/* Alcohol Ingredients Section */}
      {renderIngredientList(
        alcoholIngredients,
        "Bevande alcoliche",
        <Wine className="w-6 h-6" />
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Conferma rimozione</h3>
            <p className="text-gray-600 mb-6">
              Sei sicuro di voler rimuovere{" "}
              <strong>"{itemToRemove?.item}"</strong> dalla lista della spesa?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelRemoveItem}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={confirmRemoveItem}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Rimuovi
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Quantity Edit Modal */}
      {showQuantityModal && editingQuantity && (
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
                  value={editingQuantity.quantity}
                  onChange={(e) =>
                    setEditingQuantity({
                      ...editingQuantity,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unità di misura:
                </label>
                <select
                  value={
                    shoppingList.find((item) => item.id === editingQuantity.id)
                      ?.unit || "pezzi"
                  }
                  onChange={(e) => {
                    const updatedList = shoppingList.map((item) => {
                      if (item.id === editingQuantity.id) {
                        return { ...item, unit: e.target.value };
                      }
                      return item;
                    });
                    setShoppingList(updatedList);
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
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Salva
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Toast
        message={"Lista della spesa copiata negli appunti!"}
        type="info"
        onClose={() => setShowToast(false)}
        showToast={showToast}
      />
    </AnimatePresence>
  );
};

export default Checklist;
