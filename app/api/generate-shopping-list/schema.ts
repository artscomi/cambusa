import { z } from "zod";

const ingredientSchema = z.object({
  id: z.number(),
  item: z.string(),
  quantity: z.string(),
});

const dishSchema = z.object({
  id: z.number(),
  dishName: z.string(),
  ingredients: z.array(ingredientSchema),
});

const mealSchema = z.object({
  id: z.number(),
  mealName: z.string(),
  dishes: z.array(dishSchema).describe("Aggiungi almeno un piatto di verdure nei pranzi e nelle cene"),
});

 const mealTypeSchema = z.object({
  id: z.number(),
  mealTypeName: z.string().describe('Il nome deve essere al plurale: Colazioni, Pranzi, Cene'),
  meals: z.array(mealSchema),
});

export const mealMenuSchema = z.object({
  menu: z.array(mealTypeSchema),
});