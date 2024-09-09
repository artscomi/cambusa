import {
  mealMenuSchema,
  mealTypeSchema,
} from "@/app/api/generate-meal-menu/schema";
import { z } from "zod";

export type MenuData = z.infer<typeof mealMenuSchema>;
export type MenuType = z.infer<typeof mealTypeSchema>;

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
