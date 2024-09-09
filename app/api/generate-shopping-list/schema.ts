import { z } from "zod";

const ingredientSchema = z.object({
  id: z.string().describe("deve essere un id univoco"),
  item: z.string(),
  quantity: z.string(),
});

export const shoppingListSchema = z.object({
  shoppingList: z.array(ingredientSchema),
});
