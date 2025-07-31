import { useState } from "react";
import { Ingredient, SharedIngredientItem } from "@/types/types";

export interface IngredientItem {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  isCompleted?: boolean;
  completedBy?: string;
  completedAt?: Date;
}

export interface UseIngredientListProps {
  items: IngredientItem[];
  onAddItem?: (item: Omit<IngredientItem, "id" | "isCompleted" | "completedBy" | "completedAt">) => void;
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number, unit?: string) => void;
  onToggleCompletion?: (itemId: string, completedBy?: string) => void;
  canEdit?: boolean;
  canRemove?: boolean;
  completedBy?: string;
}

export const useIngredientList = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onToggleCompletion,
  canEdit = true,
  canRemove = true,
  completedBy,
}: UseIngredientListProps) => {
  const [showToast, setShowToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<IngredientItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item: "",
    quantity: 1,
    unit: "pezzi",
  });
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

  const handleCheckboxChange = (item: IngredientItem) => {
    if (onToggleCompletion) {
      onToggleCompletion(item.id, completedBy);
    } else {
      setItemToRemove(item);
      setShowConfirmModal(true);
    }
  };

  const confirmRemoveItem = () => {
    if (itemToRemove && onRemoveItem) {
      onRemoveItem(itemToRemove.id);
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
    if (onUpdateQuantity) {
      onUpdateQuantity(id, newQuantity, newUnit);
    }
    setShowQuantityModal(false);
    setEditingQuantity(null);
  };

  const openQuantityModal = (item: IngredientItem) => {
    setEditingQuantity({
      id: item.id,
      quantity: item.quantity,
    });
    setShowQuantityModal(true);
  };

  const handleAddItem = () => {
    if (newItem.item.trim() && onAddItem) {
      onAddItem({
        item: newItem.item.trim(),
        quantity: newItem.quantity,
        unit: newItem.unit,
      });
      setNewItem({ item: "", quantity: 1, unit: "pezzi" });
      setShowAddModal(false);
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

  const handleShare = async (listName?: string) => {
    const listText = items
      .map((item) => `${item.item} - ${item.quantity} ${item.unit}`)
      .join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: listName ? `Lista: ${listName}` : "La mia lista",
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
    if (onUpdateQuantity) {
      onUpdateQuantity(id, items.find(item => item.id === id)?.quantity || 1, newUnit);
    }
  };

  return {
    // State
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
    
    // Functions
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
    
    // Props
    canEdit,
    canRemove,
    completedBy,
  };
}; 