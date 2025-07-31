import React from "react";
import { Ingredient } from "@/types/types";
import { useShoppingContext } from "@/context/useShoppingListContext";
import IngredientListWrapper from "../IngredientList/IngredientListWrapper";

const CheckListWithCommon: React.FC<{ items: Ingredient[] }> = ({ items }) => {
  const { shoppingList, setShoppingList } = useShoppingContext();

  const handleAddItem = (item: Omit<Ingredient, "id">) => {
    const newIngredient: Ingredient = {
      id: `manual_${Date.now()}`,
      ...item,
    };
    setShoppingList([...shoppingList, newIngredient]);
  };

  const handleRemoveItem = (itemId: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number, unit?: string) => {
    setShoppingList(shoppingList.map(item => 
      item.id === itemId 
        ? { ...item, quantity, ...(unit && { unit }) }
        : item
    ));
  };

  const handleToggleCompletion = (itemId: string) => {
    // In CheckList, clicking checkbox removes the item
    handleRemoveItem(itemId);
  };

  return (
    <IngredientListWrapper
      items={items}
      title="La tua lista della spesa"
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onUpdateQuantity={handleUpdateQuantity}
      onToggleCompletion={handleToggleCompletion}
      canEdit={true}
      canRemove={false} // No remove button in CheckList
      canAdd={true}
      showShareButtons={true}
      showSections={true} // Show separate sections like CheckList
    />
  );
};

export default CheckListWithCommon; 