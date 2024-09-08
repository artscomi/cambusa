import { mealMenuSchema } from "@/app/api/generate-meal-menu/schema";
import { z } from "zod";

export type MenuData = z.infer<typeof mealMenuSchema>;

export interface GroupData {
  id: string;
  dietaryPreferences: string[][];
}
