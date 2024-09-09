"use client";
import Checklist from "@/components/CheckList";
import { useShoppingContext } from "@/context/useShoppingListContext";

const ShoppingListPage = () => {
  const { shoppingList } = useShoppingContext();
  return <Checklist items={shoppingList} />;
};

export default ShoppingListPage;
