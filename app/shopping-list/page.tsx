"use client";
import Checklist from "@/components/CheckList";
import { useShoppingContext } from "@/context/useShoppingListContext";

const ShoppingListPage = () => {
  const { shoppingList } = useShoppingContext();
  return (
    <div className="px-6 md:px-10 lg:px-32">
      <Checklist items={shoppingList} />
    </div>
  );
};

export default ShoppingListPage;
