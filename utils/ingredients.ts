import { Ingredient, MealList } from "@/types/types";

// Helper function to find an existing ingredient in the list
const findExistingIngredient = (acc: Ingredient[], ingredient: Ingredient) => {
  return acc.find(
    (i) => i.item === ingredient.item && i.unit === ingredient.unit
  );
};

// Helper function to handle unit conversion from grams to kilograms
const convertUnits = (ingredient: Ingredient) => {
  if (ingredient.unit === "g" && ingredient.quantity >= 1000) {
    ingredient.quantity /= 1000;
    ingredient.unit = "kg";
  }
};

// Main function to sum ingredients
export const sumIngredients = (mealList: MealList): Ingredient[] => {
  return mealList.reduce<Ingredient[]>((acc, mealType) => {
    mealType.meals.forEach((meal) => {
      meal.dishes.forEach((dish) => {
        dish.ingredients.forEach((ingredient) => {
          const existing = findExistingIngredient(acc, ingredient);

          if (existing) {
            existing.quantity += ingredient.quantity;
          } else {
            acc.push({ ...ingredient });
          }
        });
      });
    });

    // Apply unit conversion after all ingredients are summed
    acc.forEach(convertUnits);
    return acc;
  }, []);
};
