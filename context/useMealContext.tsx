import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  getMealListFromDB,
  getGroupMealListForViewer,
  getMemberGroupMenuFallback,
  getMyMenuSourcesForViewer,
} from "@/app/api/actions";
import { useUser } from "@clerk/nextjs";
import type { MealList } from "@/types/types";

export const MY_MENU_SOURCE_STORAGE_KEY = "myMenuSource";

function tryNonEmptyMealList(
  raw: string | null | undefined,
): MealList | undefined {
  if (raw == null || raw === "") return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return undefined;
    return parsed as MealList;
  } catch {
    return undefined;
  }
}

interface MyContextType {
  mealList: MealList | undefined;
  setMealList: (newState: MealList | undefined) => void;
  alcoholPreferences: string;
  setAlcoholPreferences: (preferences: string) => void;
  waterPreference: string;
  setWaterPreference: (preference: string) => void;
  people: number;
  setPeople: (people: number) => void;
  days: number;
  setDays: (days: number) => void;
  groupAlcoholPreferences:
    | Array<{ userId: string; preference: string; user: { name: string } }>
    | undefined;
  setGroupAlcoholPreferences: (
    preferences:
      | Array<{ userId: string; preference: string; user: { name: string } }>
      | undefined
  ) => void;
  currentGroupId: string | undefined;
  setCurrentGroupId: (groupId: string | undefined) => void;
  /** Carica menu personale (`personal`) o di gruppo (`groupId`). Ritorna true se ha trovato un menu non vuoto. */
  loadMenuForSource: (
    source: "personal" | string,
    userId: string,
  ) => Promise<boolean>;
}

const MealContext = createContext<MyContextType | undefined>(undefined);

interface MyProviderProps {
  children: ReactNode;
}

export const MealContextProvider: React.FC<MyProviderProps> = ({
  children,
}) => {
  const [mealList, setMealList] = useState<MealList>();
  const [alcoholPreferences, setAlcoholPreferences] = useState<string>("");
  const [waterPreference, setWaterPreference] = useState<string>("");
  const [people, setPeople] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [groupAlcoholPreferences, setGroupAlcoholPreferences] = useState<
    | Array<{ userId: string; preference: string; user: { name: string } }>
    | undefined
  >();
  const [currentGroupId, setCurrentGroupIdState] = useState<
    string | undefined
  >();
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();

  const setCurrentGroupId = useCallback((groupId: string | undefined) => {
    setCurrentGroupIdState(groupId);
    if (typeof window !== "undefined") {
      if (groupId) localStorage.setItem("currentGroupId", groupId);
      else localStorage.removeItem("currentGroupId");
    }
  }, []);

  const loadMenuForSource = useCallback(
    async (source: "personal" | string, userId: string): Promise<boolean> => {
      if (source === "personal") {
        const dbRaw = await getMealListFromDB(userId);
        const fromDb = tryNonEmptyMealList(dbRaw ?? undefined);
        if (fromDb) {
          setMealList(fromDb);
          setCurrentGroupId(undefined);
          if (typeof window !== "undefined") {
            localStorage.setItem(MY_MENU_SOURCE_STORAGE_KEY, "personal");
          }
          return true;
        }
        if (typeof window !== "undefined") {
          const fromLs = tryNonEmptyMealList(localStorage.getItem("mealList"));
          if (fromLs) {
            setMealList(fromLs);
            setCurrentGroupId(undefined);
            localStorage.setItem(MY_MENU_SOURCE_STORAGE_KEY, "personal");
            return true;
          }
        }
        return false;
      }

      const fromGroup = await getGroupMealListForViewer(source);
      if (fromGroup && fromGroup.length > 0) {
        setMealList(fromGroup);
        setCurrentGroupId(source);
        if (typeof window !== "undefined") {
          localStorage.setItem(MY_MENU_SOURCE_STORAGE_KEY, source);
        }
        return true;
      }
      return false;
    },
    [setCurrentGroupId],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !user?.id) return;

    const loadInitialData = async () => {
      const tryGroupFallback = async () => {
        if (typeof window === "undefined") return;
        const preferred = localStorage.getItem("currentGroupId");
        const groupFb = await getMemberGroupMenuFallback(user.id, preferred);
        if (groupFb) {
          setCurrentGroupId(groupFb.groupId);
          setMealList(groupFb.mealList);
          localStorage.setItem(MY_MENU_SOURCE_STORAGE_KEY, groupFb.groupId);
        }
      };

      try {
        const sources = await getMyMenuSourcesForViewer();

        if (sources) {
          const stored =
            typeof window !== "undefined"
              ? localStorage.getItem(MY_MENU_SOURCE_STORAGE_KEY)
              : null;
          const valid =
            stored === "personal"
              ? sources.hasPersonalMenu
              : !!(
                  stored &&
                  sources.groups.some((g) => g.id === stored)
                );

          if (valid && stored) {
            const ok = await loadMenuForSource(
              stored === "personal" ? "personal" : stored,
              user.id,
            );
            if (ok) return;
          }

          if (typeof window !== "undefined") {
            const preferred = localStorage.getItem("currentGroupId");
            const prefOk =
              preferred && sources.groups.some((g) => g.id === preferred);
            if (prefOk && preferred) {
              const ok = await loadMenuForSource(preferred, user.id);
              if (ok) return;
            }
          }

          if (sources.hasPersonalMenu) {
            const ok = await loadMenuForSource("personal", user.id);
            if (ok) return;
          }

          if (sources.groups.length > 0) {
            const ok = await loadMenuForSource(sources.groups[0]!.id, user.id);
            if (ok) return;
          }
        }

        const dbRaw = await getMealListFromDB(user.id);
        const fromDb = tryNonEmptyMealList(dbRaw ?? undefined);
        if (fromDb) {
          setMealList(fromDb);
          setCurrentGroupId(undefined);
          if (typeof window !== "undefined") {
            localStorage.setItem(MY_MENU_SOURCE_STORAGE_KEY, "personal");
          }
          return;
        }

        if (typeof window !== "undefined") {
          const preferred = localStorage.getItem("currentGroupId");
          if (preferred) {
            const fromGroup = await getGroupMealListForViewer(preferred);
            if (fromGroup && fromGroup.length > 0) {
              setCurrentGroupId(preferred);
              setMealList(fromGroup);
              localStorage.setItem(MY_MENU_SOURCE_STORAGE_KEY, preferred);
              return;
            }
          }

          const fromLs = tryNonEmptyMealList(localStorage.getItem("mealList"));
          if (fromLs) {
            setMealList(fromLs);
            setCurrentGroupId(undefined);
            localStorage.setItem(MY_MENU_SOURCE_STORAGE_KEY, "personal");
            return;
          }
          await tryGroupFallback();
        }
      } catch (error) {
        console.error("Error loading meal list:", error);
        if (typeof window !== "undefined") {
          const preferred = localStorage.getItem("currentGroupId");
          if (preferred) {
            const fromGroup = await getGroupMealListForViewer(preferred);
            if (fromGroup && fromGroup.length > 0) {
              setCurrentGroupId(preferred);
              setMealList(fromGroup);
              localStorage.setItem(MY_MENU_SOURCE_STORAGE_KEY, preferred);
              return;
            }
          }

          const fromLs = tryNonEmptyMealList(localStorage.getItem("mealList"));
          if (fromLs) {
            setMealList(fromLs);
            setCurrentGroupId(undefined);
            localStorage.setItem(MY_MENU_SOURCE_STORAGE_KEY, "personal");
            return;
          }
          await tryGroupFallback();
        }
      }
    };

    loadInitialData();
  }, [isMounted, user?.id, loadMenuForSource, setCurrentGroupId]);

  useEffect(() => {
    if (
      mealList &&
      isMounted &&
      typeof window !== "undefined" &&
      !currentGroupId
    ) {
      localStorage.setItem("mealList", JSON.stringify(mealList));
    }
  }, [mealList, isMounted, currentGroupId]);

  // Load alcohol preferences from localStorage
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const storedAlcoholPreferences = localStorage.getItem("alcoholPreferences");
    if (storedAlcoholPreferences) {
      setAlcoholPreferences(storedAlcoholPreferences);
    }
  }, [isMounted]);

  // Save alcohol preferences to localStorage
  useEffect(() => {
    if (alcoholPreferences && isMounted && typeof window !== "undefined") {
      localStorage.setItem("alcoholPreferences", alcoholPreferences);
    }
  }, [alcoholPreferences, isMounted]);

  // Load water preferences from localStorage
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const storedWaterPreference = localStorage.getItem("waterPreference");
    if (storedWaterPreference) {
      setWaterPreference(storedWaterPreference);
    }
  }, [isMounted]);

  // Save water preferences to localStorage
  useEffect(() => {
    if (waterPreference && isMounted && typeof window !== "undefined") {
      localStorage.setItem("waterPreference", waterPreference);
    }
  }, [waterPreference, isMounted]);

  // Load people count from localStorage
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const storedPeople = localStorage.getItem("people");
    if (storedPeople) {
      setPeople(parseInt(storedPeople));
    }
  }, [isMounted]);

  // Save people count to localStorage
  useEffect(() => {
    if (people > 0 && isMounted && typeof window !== "undefined") {
      localStorage.setItem("people", people.toString());
    }
  }, [people, isMounted]);

  // Load days count from localStorage
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const storedDays = localStorage.getItem("days");
    if (storedDays) {
      setDays(parseInt(storedDays));
    }
  }, [isMounted]);

  // Save days count to localStorage
  useEffect(() => {
    if (days > 0 && isMounted && typeof window !== "undefined") {
      localStorage.setItem("days", days.toString());
    }
  }, [days, isMounted]);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;
    const stored = localStorage.getItem("currentGroupId");
    if (stored) setCurrentGroupIdState(stored);
  }, [isMounted]);

  return (
    <MealContext.Provider
      value={{
        mealList,
        setMealList,
        alcoholPreferences,
        setAlcoholPreferences,
        waterPreference,
        setWaterPreference,
        people,
        setPeople,
        days,
        setDays,
        groupAlcoholPreferences,
        setGroupAlcoholPreferences,
        currentGroupId,
        setCurrentGroupId,
        loadMenuForSource,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};

export const useMealContext = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMealContext must be used within a MealContextProvider");
  }
  return context;
};

export default MealContext;
