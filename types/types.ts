export type Ingredient = {
  item: string; 
  quantity: string;
};

export type Dish = {
  [dishName: string]: Ingredient[];
};

export type Meal = {
  [mealName: string]: Dish;
};

export type MenuData = {
  Colazioni: Meal;
  Pranzi: Meal;
  Cene: Meal;
};