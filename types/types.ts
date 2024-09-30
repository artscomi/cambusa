import { mealMenuSchema, mealSchema } from "@/app/api/schemas/meal-menu";
import { z } from "zod";

export type MenuData = z.infer<typeof mealMenuSchema>;
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
};
