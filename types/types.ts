export type MealItem = {
  item: string;
  quantity: string;
};

export type Meals = {
  Colazione: MealItem[];
  Pranzo: MealItem[];
  Cena: MealItem[];
};

export type MealList = Meals[];
