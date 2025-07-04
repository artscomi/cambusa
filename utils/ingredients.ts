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
    ingredient.quantity = Number((ingredient.quantity / 1000).toFixed(2));
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
            existing.quantity = Number(
              (existing.quantity + ingredient.quantity).toFixed(2)
            );
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

// Function to combine food ingredients with alcohol ingredients
export const combineIngredients = (
  foodIngredients: Ingredient[],
  alcoholIngredients: Ingredient[]
): Ingredient[] => {
  const allIngredients = [...foodIngredients];

  alcoholIngredients.forEach((alcoholIngredient) => {
    const existing = findExistingIngredient(allIngredients, alcoholIngredient);

    if (existing) {
      existing.quantity = Number(
        (existing.quantity + alcoholIngredient.quantity).toFixed(2)
      );
    } else {
      allIngredients.push({ ...alcoholIngredient });
    }
  });

  return allIngredients;
};
