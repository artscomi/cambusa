import { z } from "zod";

const ingredientSchema = z.object({
  id: z.string().describe("deve essere un id univoco"),
  item: z.string(),
  quantity: z.number(),
  unit: z.string(),
});

const dishSchema = z.object({
  id: z.string().describe("deve essere un id univoco"),
  dishName: z.string(),
  ingredients: z.array(ingredientSchema),
});

const mealSchema = z.object({
  id: z.string().describe("deve essere un id univoco"),
  mealName: z.string(),
  dishes: z
    .array(dishSchema)
    .describe("Aggiungi almeno un piatto di verdure nei pranzi e nelle cene"),
});

export const mealTypeSchema = z.object({
  id: z.string().describe("deve essere un id univoco"),
  mealTypeName: z
    .string()
    .describe("Il nome deve essere al plurale: Colazioni, Pranzi, Cene. Non ripetere lo stesso MealType."),
  meals: z.array(mealSchema),
});

export const mealMenuSchema = z.object({
  menu: z.array(mealTypeSchema).length(3),
});
