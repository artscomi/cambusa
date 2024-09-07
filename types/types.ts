import { mealMenuSchema } from "@/app/api/generate-shopping-list/schema";
import { z } from "zod";

export type MenuData = z.infer<typeof mealMenuSchema>;

export interface GroupData {
  id: string;
  dietaryPreferences: string[][];
}
