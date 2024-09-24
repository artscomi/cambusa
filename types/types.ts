import {
  mealMenuSchema,
  mealSchema,
  mealTypeSchema,
} from "@/app/api/generate-meal-menu/schema";
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
