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
}

const MealContext = createContext<MyContextType | undefined>(undefined);

interface MyProviderProps {
  children: ReactNode;
}

export const MealContextProvider: React.FC<MyProviderProps> = ({
  children,
}) => {
  const [mealList, setMealList] = useState<MealList>();

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

  return (
    <MealContext.Provider value={{ mealList, setMealList }}>
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
