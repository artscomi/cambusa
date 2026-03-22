// context/ShoppingContext.tsx
import { Ingredient } from "@/types/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

interface ShoppingContextProps {
  shoppingList: Ingredient[];
  setShoppingList: (list: Ingredient[]) => void;
  /** Se valorizzato, la lista proviene dal menu di quel gruppo (solo il proprietario del gruppo può apportare modifiche alla lista in UI). */
  shoppingListGroupId: string | undefined;
  setShoppingListGroupId: (groupId: string | undefined) => void;
}

const ShoppingContext = createContext<ShoppingContextProps | undefined>(
  undefined
);

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);
  const [shoppingListGroupId, setShoppingListGroupIdState] = useState<
    string | undefined
  >();
  const [isMounted, setIsMounted] = useState(false);
  const prevListLengthRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const storedShoppingList = localStorage.getItem("shoppingList");
    if (storedShoppingList) {
      try {
        setShoppingList(JSON.parse(storedShoppingList));
      } catch {
        /* ignore */
      }
    }
    const gid = localStorage.getItem("shoppingListGroupId");
    if (gid) setShoppingListGroupIdState(gid);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;
    if (shoppingListGroupId)
      localStorage.setItem("shoppingListGroupId", shoppingListGroupId);
    else localStorage.removeItem("shoppingListGroupId");
  }, [shoppingListGroupId, isMounted]);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;
    const prev = prevListLengthRef.current;
    prevListLengthRef.current = shoppingList.length;
    if (prev !== null && prev > 0 && shoppingList.length === 0) {
      setShoppingListGroupIdState(undefined);
      localStorage.removeItem("shoppingListGroupId");
    }
  }, [shoppingList.length, isMounted]);

  const setShoppingListGroupId = (groupId: string | undefined) => {
    setShoppingListGroupIdState(groupId);
  };

  useEffect(() => {
    if (shoppingList && isMounted && typeof window !== "undefined") {
      localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    }
  }, [shoppingList, isMounted]);

  return (
    <ShoppingContext.Provider
      value={{
        shoppingList,
        setShoppingList,
        shoppingListGroupId,
        setShoppingListGroupId,
      }}
    >
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
