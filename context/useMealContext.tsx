import { MenuData } from "@/types/types";
import React, { createContext, useState, ReactNode, useContext } from "react";

interface MyContextType {
  mealList: MenuData | undefined;
  setMealList: (newState: MenuData | undefined) => void;
}

const MealContext = createContext<MyContextType | undefined>(undefined);

interface MyProviderProps {
  children: ReactNode;
}

export const MealContextProvider: React.FC<MyProviderProps> = ({
  children,
}) => {
  const [mealList, setMealList] = useState<MenuData>();
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
