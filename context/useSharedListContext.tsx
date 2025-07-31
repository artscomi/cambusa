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
  fetchLists: () => Promise<void>;
  fetchList: (listId: string) => Promise<void>;
  createList: (name: string, description: string, groupId?: string | null) => Promise<SharedIngredientList>;
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

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/shared-lists');
      if (response.ok) {
        const lists = await response.json();
        setSharedLists(lists);
      }
    } catch (error) {
      console.error('Errore nel recupero delle liste:', error);
    }
  };

  const fetchList = async (listId: string) => {
    try {
      const response = await fetch(`/api/shared-lists/${listId}`);
      if (response.ok) {
        const list = await response.json();
        setCurrentList(list);
      }
    } catch (error) {
      console.error('Errore nel recupero della lista:', error);
    }
  };

  const createList = async (name: string, description: string, groupId?: string | null): Promise<SharedIngredientList> => {
    try {
      const response = await fetch('/api/shared-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          groupId,
        }),
      });

      if (response.ok) {
        const newList = await response.json();
        setSharedLists(prev => [newList, ...prev]);
        return newList;
      } else {
        throw new Error('Errore nella creazione della lista');
      }
    } catch (error) {
      console.error('Errore nella creazione della lista:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isMounted) {
      fetchLists();
    }
  }, [isMounted]);

  const addItemToList = (listId: string, item: Omit<SharedIngredientItem, "id" | "listId" | "createdAt" | "updatedAt">) => {
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
                      totalVotes: calculateTotalVotes({
                        ...item.votes,
                        [userId]: vote,
                      }),
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
    return item.votes?.[userId] ?? null;
  };

  const getItemVoteCount = (item: SharedIngredientItem): number => {
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
        fetchLists,
        fetchList,
        createList,
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