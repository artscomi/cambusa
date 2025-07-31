import {
  mealMenuSchema,
  mealSchema,
  mealTypeSchema,
} from "@/app/api/schemas/meal-menu";
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
  isCompleted?: boolean;
  votes?: {
    [userId: string]: boolean; // true = voto positivo, false = voto negativo
  };
  totalVotes?: number; // Somma dei voti positivi - negativi
}

export type GroupInfo = {
  groupId: string;
  groupName: string;
  isTheGroupOwner: boolean;
  breakfast: string;
  lunch: string;
  dinner: string;
  people: string;
  ownerName: string;
  ownerGender: string;
  sameBreakfast: boolean;
  ownerId: string;
};

export type Preference = {
  id: string;
  userId: string;
  groupId: string;
  preference: string;
};

export type AlcoholPreference = {
  id: string;
  userId: string;
  groupId: string;
  preference: string;
};

export type SharedIngredientList = {
  id: string;
  name: string;
  description?: string;
  groupId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  items: SharedIngredientItem[];
};

export type SharedIngredientItem = {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: Date;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
  votes?: {
    [userId: string]: boolean; // true = voto positivo, false = voto negativo
  };
  totalVotes?: number; // Somma dei voti positivi - negativi
};
