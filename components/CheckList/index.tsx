import {
  containerVariantsShoppingList,
  itemVariantsShoppingList,
} from "@/animations/framer-variants";
import { Ingredient } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
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
import { useUser } from "@clerk/nextjs";
import { isViewerGroupOwner } from "@/app/api/actions";

const Checklist: React.FC<{ items: Ingredient[] }> = ({ items }) => {
  const { shoppingList, setShoppingList, shoppingListGroupId } =
    useShoppingContext();
  const { user } = useUser();
  const [groupOwnerMayEdit, setGroupOwnerMayEdit] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    if (!shoppingListGroupId) {
      setGroupOwnerMayEdit(null);
      return;
    }
    setGroupOwnerMayEdit(null);
    isViewerGroupOwner(shoppingListGroupId).then(setGroupOwnerMayEdit);
  }, [shoppingListGroupId, user?.id]);

  const canEditList =
    !shoppingListGroupId || groupOwnerMayEdit === true;
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
    if (!canEditList) return;
    setItemToRemove(item);
    setShowConfirmModal(true);
  };

  const confirmRemoveItem = () => {
    if (!canEditList) return;
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
    if (!canEditList) return;
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
      setShowQuantityModal(false);
      setEditingQuantity(null);
    } else {
      // If quantity is 0 or negative, don't save and keep modal open
      // You could also show an error message here
      console.warn("Quantity must be greater than 0");
    }
  };

  const openQuantityModal = (item: Ingredient) => {
    if (!canEditList) return;
    setEditingQuantity({ id: item.id, quantity: item.quantity });
    setShowQuantityModal(true);
  };

  const handleAddItem = () => {
    if (!canEditList) return;
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
    if (!canEditList) return;
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
    if (!canEditList) return;
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
              whileHover={{ scale: canEditList ? 0.98 : 1 }}
              role="listitem"
              tabIndex={0}
              variants={itemVariantsShoppingList}
              key={item.id}
              className={`group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition-all duration-300 ${
                canEditList ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center">
                <label
                  className={`flex items-center ${
                    canEditList ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <input
                    tabIndex={-1}
                    onChange={() =>
                      canEditList ? handleCheckboxChange(item) : undefined
                    }
                    type="checkbox"
                    disabled={!canEditList}
                    style={{
                      accentColor: "var(--accent-light)",
                      width: "1.5rem",
                      height: "1.5rem",
                      marginRight: "0.75rem",
                      cursor: canEditList ? "pointer" : "not-allowed",
                      pointerEvents: "none",
                    }}
                    className="rounded disabled:opacity-40"
                    checked={false}
                  />
                  <span className="max-w-[130px] truncate" title={item.item}>
                    {item.item}
                  </span>
                </label>
              </div>

              <div className="ml-4 flex items-center gap-1">
                {/* Quantity display */}
                <span className="text-center font-medium">{item.quantity}</span>

                <span className="text-gray-600">
                  {getCorrectUnit(item.unit, item.quantity)}
                </span>

                {canEditList ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuantityModal(item);
                    }}
                    className="rounded p-1 text-primary transition-colors hover:bg-gray-100"
                    title="Modifica quantità e unità"
                  >
                    <Pencil size={14} />
                  </button>
                ) : null}
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
            {canEditList ? (
              <>
                Spunta gli elementi quando li hai acquistati per rimuoverli
                dalla lista. Puoi anche modificare quantità e unità di misura o
                aggiungere nuovi ingredienti.
              </>
            ) : (
              <>
                Lista generata dal menu del gruppo: solo il proprietario del
                gruppo (chi l&apos;ha creato) può apportare modifiche alla lista
                della spesa. Tutti possono copiarla o condividerla con i pulsanti
                a destra.
              </>
            )}
          </p>
        </div>
        <div className="fixed bottom-auto right-10 z-10 flex gap-2 max-sm:bottom-10 sm:right-[135px] sm:top-32">
          {canEditList ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openAddModal}
              className="rounded border border-primary/30 bg-primary p-4 text-white"
              title="Aggiungi ingrediente"
            >
              <Plus
                role="img"
                aria-label="aggiungi ingrediente"
                height={25}
                width={25}
              />
            </motion.button>
          ) : null}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="rounded border border-primary/30 bg-primary p-4 text-white"
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
            className="rounded border border-primary/30 bg-primary p-4 text-white"
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
                    shoppingList.find((item) => item.id === editingQuantity.id)
                      ?.unit || "pezzi"
                  }
                  onChange={(e) => {
                    if (!canEditList) return;
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
