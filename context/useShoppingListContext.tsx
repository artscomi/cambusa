// context/ShoppingContext.tsx
import { Ingredient } from "@/types/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ShoppingContextProps {
  shoppingList: Ingredient[];
  setShoppingList: (list: Ingredient[]) => void;
}

const ShoppingContext = createContext<ShoppingContextProps | undefined>(
  undefined
);

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);

  useEffect(() => {
    const storedShoppingList = localStorage.getItem("shoppingList");
    if (storedShoppingList) {
      setShoppingList(JSON.parse(storedShoppingList));
    }
  }, []);

  useEffect(() => {
    if (shoppingList) {
      localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    }
  }, [shoppingList]);

  return (
    <ShoppingContext.Provider value={{ shoppingList, setShoppingList }}>
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShoppingContext = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error(
      "useShoppingContext must be used within a ShoppingProvider"
    );
  }
  return context;
};
