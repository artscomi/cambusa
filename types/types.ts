import { mealMenuSchema, mealSchema, mealTypeSchema } from "@/app/api/schemas/meal-menu";
import { z } from "zod";

export type MenuData = z.infer<typeof mealMenuSchema>;
export type MealList = z.infer<typeof mealTypeSchema>[];
export type Meal = z.infer<typeof mealSchema>;

export interface GroupData {
  id: string;
  dietaryPreferences: string[][];
}

export interface Ingredient {
  id: string;
  item: string;
  quantity: number;
  unit: string;
}

export type GroupInfo = {
  groupId: string;
  groupName: string;
  isTheGroupOwner: boolean;
  breakfast: string;
  lunch: string;
  dinner: string;
  people: string;
};

export type Preference = {
  id: string;
  userId: string;
  groupId: string;
  preference: string;
};
