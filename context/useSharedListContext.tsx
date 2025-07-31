"use client";

import { SharedIngredientList, SharedIngredientItem } from "@/types/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SharedListContextProps {
  sharedLists: SharedIngredientList[];
  setSharedLists: (lists: SharedIngredientList[]) => void;
  currentList: SharedIngredientList | null;
  setCurrentList: (list: SharedIngredientList | null) => void;
  addItemToList: (listId: string, item: Omit<SharedIngredientItem, "id" | "listId" | "createdAt" | "updatedAt">) => void;
  removeItemFromList: (listId: string, itemId: string) => void;
  toggleItemCompletion: (listId: string, itemId: string, completedBy: string) => void;
  updateItemQuantity: (listId: string, itemId: string, quantity: number) => void;
  updateItemUnit: (listId: string, itemId: string, unit: string) => void;
  voteOnItem: (listId: string, itemId: string, userId: string, vote: boolean) => void;
  getUserVote: (item: SharedIngredientItem, userId: string) => boolean | null;
  getItemVoteCount: (item: SharedIngredientItem) => number;
}

const SharedListContext = createContext<SharedListContextProps | undefined>(
  undefined
);

export const SharedListProvider = ({ children }: { children: ReactNode }) => {
  const [sharedLists, setSharedLists] = useState<SharedIngredientList[]>([]);
  const [currentList, setCurrentList] = useState<SharedIngredientList | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const storedLists = localStorage.getItem("sharedLists");
    if (storedLists) {
      setSharedLists(JSON.parse(storedLists));
    }
  }, [isMounted]);

  useEffect(() => {
    if (sharedLists && isMounted && typeof window !== "undefined") {
      localStorage.setItem("sharedLists", JSON.stringify(sharedLists));
    }
  }, [sharedLists, isMounted]);

  const addItemToList = (
    listId: string,
    item: Omit<SharedIngredientItem, "id" | "listId" | "createdAt" | "updatedAt">
  ) => {
    const newItem: SharedIngredientItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random()}`,
      listId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSharedLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? { ...list, items: [...list.items, newItem] }
          : list
      )
    );
  };

  const removeItemFromList = (listId: string, itemId: string) => {
    setSharedLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? { ...list, items: list.items.filter(item => item.id !== itemId) }
          : list
      )
    );
  };

  const toggleItemCompletion = (listId: string, itemId: string, completedBy: string) => {
    setSharedLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId
                  ? {
                      ...item,
                      isCompleted: !item.isCompleted,
                      completedBy: !item.isCompleted ? completedBy : undefined,
                      completedAt: !item.isCompleted ? new Date() : undefined,
                    }
                  : item
              ),
            }
          : list
      )
    );
  };

  const updateItemQuantity = (listId: string, itemId: string, quantity: number) => {
    setSharedLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId
                  ? { ...item, quantity, updatedAt: new Date() }
                  : item
              ),
            }
          : list
      )
    );
  };

  const updateItemUnit = (listId: string, itemId: string, unit: string) => {
    setSharedLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId
                  ? { ...item, unit, updatedAt: new Date() }
                  : item
              ),
            }
          : list
      )
    );
  };

  const voteOnItem = (listId: string, itemId: string, userId: string, vote: boolean) => {
    // This function is now synchronous, so no need for fetch or async operations
    // The state update will happen immediately after the function call.
    setSharedLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId
                  ? {
                      ...item,
                      votes: {
                        ...item.votes,
                        [userId]: vote,
                      },
                      totalVotes: calculateTotalVotes(item.votes || {}),
                      updatedAt: new Date(),
                    }
                  : item
              ),
            }
          : list
      )
    );
  };

  const getUserVote = (item: SharedIngredientItem, userId: string): boolean | null => {
    // This function is now synchronous, so no need for fetch or async operations
    return item.votes?.[userId] ?? null;
  };

  const getItemVoteCount = (item: SharedIngredientItem): number => {
    // This function is now synchronous, so no need for fetch or async operations
    return calculateTotalVotes(item.votes || {});
  };

  const calculateTotalVotes = (votes: { [userId: string]: boolean }): number => {
    return Object.values(votes).reduce((total, vote) => {
      return total + (vote ? 1 : -1);
    }, 0);
  };

  return (
    <SharedListContext.Provider
      value={{
        sharedLists,
        setSharedLists,
        currentList,
        setCurrentList,
        addItemToList,
        removeItemFromList,
        toggleItemCompletion,
        updateItemQuantity,
        updateItemUnit,
        voteOnItem,
        getUserVote,
        getItemVoteCount,
      }}
    >
      {children}
    </SharedListContext.Provider>
  );
};

export const useSharedListContext = () => {
  const context = useContext(SharedListContext);
  if (!context) {
    throw new Error(
      "useSharedListContext must be used within a SharedListProvider"
    );
  }
  return context;
}; 