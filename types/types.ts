export type Ingredient = {
  item: string; // Nome dell'ingrediente
  quantity: string; // Quantità dell'ingrediente
};

export type Dish = {
  [dishName: string]: Ingredient[];
};

export type Meal = {
  [mealOption: string]: Dish;
};

export type MenuData = {
  Colazioni: Meal;
  Pranzi: Meal;
  Cene: Meal;
};