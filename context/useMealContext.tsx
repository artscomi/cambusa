import { MealList } from "@/types/types";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { getMealListFromDB } from "@/app/api/actions";
import { useUser } from "@clerk/nextjs";

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
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !user?.id) return;

    const loadInitialData = async () => {
      try {
        // First try to load from database
        const dbMealList = await getMealListFromDB(user.id);
        if (dbMealList) {
          setMealList(JSON.parse(dbMealList));
          return;
        }

        // If no data in DB, try localStorage as fallback
        if (typeof window !== "undefined") {
          const storedMealList = localStorage.getItem("mealList");
          if (storedMealList) {
            setMealList(JSON.parse(storedMealList));
          }
        }
      } catch (error) {
        console.error("Error loading meal list:", error);
        // If error loading from DB, try localStorage as fallback
        if (typeof window !== "undefined") {
          const storedMealList = localStorage.getItem("mealList");
          if (storedMealList) {
            setMealList(JSON.parse(storedMealList));
          }
        }
      }
    };

    loadInitialData();
  }, [isMounted, user?.id]);

  useEffect(() => {
    if (mealList && isMounted && typeof window !== "undefined") {
      localStorage.setItem("mealList", JSON.stringify(mealList));
    }
  }, [mealList, isMounted]);

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
