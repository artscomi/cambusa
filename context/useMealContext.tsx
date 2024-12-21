import { MealList } from "@/types/types";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

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
    const storedMealList = localStorage.getItem("mealList");
    if (storedMealList) {
      setMealList(JSON.parse(storedMealList));
    }
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
