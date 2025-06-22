import { MealList } from "@/types/types";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { getMealListFromDB } from "@/app/api/actions";

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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // First try to load from database
        const dbMealList = await getMealListFromDB();
        if (dbMealList) {
          setMealList(JSON.parse(dbMealList));
          return;
        }

        // If no data in DB, try localStorage as fallback
        const storedMealList = localStorage.getItem("mealList");
        if (storedMealList) {
          setMealList(JSON.parse(storedMealList));
        }
      } catch (error) {
        console.error("Error loading meal list:", error);
        // If error loading from DB, try localStorage as fallback
        const storedMealList = localStorage.getItem("mealList");
        if (storedMealList) {
          setMealList(JSON.parse(storedMealList));
        }
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (mealList) {
      localStorage.setItem("mealList", JSON.stringify(mealList));
    }
  }, [mealList]);

  // Load alcohol preferences from localStorage
  useEffect(() => {
    const storedAlcoholPreferences = localStorage.getItem("alcoholPreferences");
    if (storedAlcoholPreferences) {
      setAlcoholPreferences(storedAlcoholPreferences);
    }
  }, []);

  // Save alcohol preferences to localStorage
  useEffect(() => {
    if (alcoholPreferences) {
      localStorage.setItem("alcoholPreferences", alcoholPreferences);
    }
  }, [alcoholPreferences]);

  // Load water preferences from localStorage
  useEffect(() => {
    const storedWaterPreference = localStorage.getItem("waterPreference");
    if (storedWaterPreference) {
      setWaterPreference(storedWaterPreference);
    }
  }, []);

  // Save water preferences to localStorage
  useEffect(() => {
    if (waterPreference) {
      localStorage.setItem("waterPreference", waterPreference);
    }
  }, [waterPreference]);

  // Load people count from localStorage
  useEffect(() => {
    const storedPeople = localStorage.getItem("people");
    if (storedPeople) {
      setPeople(parseInt(storedPeople));
    }
  }, []);

  // Save people count to localStorage
  useEffect(() => {
    if (people > 0) {
      localStorage.setItem("people", people.toString());
    }
  }, [people]);

  // Load days count from localStorage
  useEffect(() => {
    const storedDays = localStorage.getItem("days");
    if (storedDays) {
      setDays(parseInt(storedDays));
    }
  }, []);

  // Save days count to localStorage
  useEffect(() => {
    if (days > 0) {
      localStorage.setItem("days", days.toString());
    }
  }, [days]);

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
