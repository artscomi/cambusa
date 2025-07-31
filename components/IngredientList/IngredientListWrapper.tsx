import React from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import {
  Clipboard,
  Share2,
  Plus,
  Utensils,
  Droplets,
  Wine,
} from "lucide-react";
import { useIngredientList, IngredientItem } from "@/hooks/useIngredientList";
import IngredientList from "./index";
import { AddItemModal, QuantityEditModal, ConfirmRemoveModal } from "./Modals";
import Toast from "../Toast";

interface IngredientListWrapperProps {
  items: IngredientItem[];
  title?: string;
  description?: string;
  onAddItem?: (item: Omit<IngredientItem, "id" | "isCompleted" | "completedBy" | "completedAt">) => void;
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number, unit?: string) => void;
  onToggleCompletion?: (itemId: string, completedBy?: string) => void;
  canEdit?: boolean;
  canRemove?: boolean;
  canAdd?: boolean;
  completedBy?: string;
  showShareButtons?: boolean;
  listName?: string;
  showSections?: boolean; // Per mostrare le sezioni separate come in CheckList
}

const IngredientListWrapper: React.FC<IngredientListWrapperProps> = ({
  items,
  title = "Lista ingredienti",
  description,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onToggleCompletion,
  canEdit = true,
  canRemove = true,
  canAdd = true,
  completedBy,
  showShareButtons = true,
  listName,
  showSections = false,
}) => {
  const {
    showToast,
    setShowToast,
    showConfirmModal,
    setShowConfirmModal,
    itemToRemove,
    setItemToRemove,
    showAddModal,
    setShowAddModal,
    newItem,
    setNewItem,
    showQuantityModal,
    setShowQuantityModal,
    editingQuantity,
    setEditingQuantity,
    getCorrectUnit,
    handleCheckboxChange,
    confirmRemoveItem,
    cancelRemoveItem,
    handleQuantityChange,
    openQuantityModal,
    handleAddItem,
    openAddModal,
    closeAddModal,
    handleCopyToClipboard,
    handleShare,
    handleUnitChange,
  } = useIngredientList({
    items,
    onAddItem,
    onRemoveItem,
    onUpdateQuantity,
    onToggleCompletion,
    canEdit,
    canRemove,
    completedBy,
  });

  const handleNewItemChange = (field: string, value: string | number) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditingQuantityChange = (quantity: number) => {
    setEditingQuantity(prev => prev ? { ...prev, quantity } : null);
  };

  const handleUnitChangeForModal = (unit: string) => {
    if (editingQuantity) {
      handleUnitChange(editingQuantity.id, unit);
    }
  };

  const handleSaveQuantity = () => {
    if (editingQuantity) {
      handleQuantityChange(editingQuantity.id, editingQuantity.quantity);
    }
  };

  const currentUnit = editingQuantity 
    ? items.find(item => item.id === editingQuantity.id)?.unit || "pezzi"
    : "pezzi";

  // Separate items into sections like CheckList
  const waterIngredients = items.filter(
    (item) => item.id.startsWith("water_") || item.item.includes("💧")
  );

  const alcoholIngredients = items.filter(
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

  const foodIngredients = items.filter(
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

  return (
    <AnimatePresence>
      <div className="flex flex-col lg:flex-row justify-between pb-8 items-center">
        <div className="text-center lg:text-left">
          <h1>{title}</h1>
          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}
          <p className="text-l max-w-[700px]">
            Spunta gli elementi quando li hai acquistati per rimuoverli dalla
            lista. Puoi anche modificare quantità e unità di misura o aggiungere
            nuovi ingredienti.
          </p>
        </div>
        
        {showShareButtons && (
          <div className="flex gap-2 fixed max-sm:bottom-10 bottom-auto sm:top-32 right-10 sm:right-[135px] z-10">
            {canAdd && onAddItem && (
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
              onClick={() => handleShare(listName)}
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
        )}
      </div>

      {/* Render sections like CheckList */}
      {showSections ? (
        <>
          {/* Food Ingredients Section */}
          <IngredientList
            items={foodIngredients}
            title="Ingredienti per i pasti"
            icon={<Utensils className="w-6 h-6" />}
            onCheckboxChange={handleCheckboxChange}
            onQuantityEdit={openQuantityModal}
            onRemoveItem={canRemove ? (item) => setItemToRemove(item) : undefined}
            canEdit={canEdit}
            canRemove={canRemove}
            getCorrectUnit={getCorrectUnit}
          />

          {/* Water Ingredients Section */}
          <IngredientList
            items={waterIngredients}
            title="Acqua"
            icon={<Droplets className="w-6 h-6" />}
            onCheckboxChange={handleCheckboxChange}
            onQuantityEdit={openQuantityModal}
            onRemoveItem={canRemove ? (item) => setItemToRemove(item) : undefined}
            canEdit={canEdit}
            canRemove={canRemove}
            getCorrectUnit={getCorrectUnit}
          />

          {/* Alcohol Ingredients Section */}
          <IngredientList
            items={alcoholIngredients}
            title="Bevande alcoliche"
            icon={<Wine className="w-6 h-6" />}
            onCheckboxChange={handleCheckboxChange}
            onQuantityEdit={openQuantityModal}
            onRemoveItem={canRemove ? (item) => setItemToRemove(item) : undefined}
            canEdit={canEdit}
            canRemove={canRemove}
            getCorrectUnit={getCorrectUnit}
          />
        </>
      ) : (
        /* Single list for other use cases */
        <IngredientList
          items={items}
          title={title}
          icon={<Utensils className="w-6 h-6 text-primary" />}
          onCheckboxChange={handleCheckboxChange}
          onQuantityEdit={openQuantityModal}
          onRemoveItem={canRemove ? (item) => setItemToRemove(item) : undefined}
          canEdit={canEdit}
          canRemove={canRemove}
          getCorrectUnit={getCorrectUnit}
        />
      )}

      {/* Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={closeAddModal}
        newItem={newItem}
        onNewItemChange={handleNewItemChange}
        onAddItem={handleAddItem}
      />

      <QuantityEditModal
        isOpen={showQuantityModal}
        onClose={() => {
          setShowQuantityModal(false);
          setEditingQuantity(null);
        }}
        editingQuantity={editingQuantity}
        onEditingQuantityChange={handleEditingQuantityChange}
        onUnitChange={handleUnitChangeForModal}
        onSave={handleSaveQuantity}
        currentUnit={currentUnit}
        items={items}
      />

      <ConfirmRemoveModal
        isOpen={showConfirmModal}
        onClose={cancelRemoveItem}
        onConfirm={confirmRemoveItem}
        itemName={itemToRemove?.item}
      />

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

export default IngredientListWrapper; 