import { useMealContext } from "@/context/useMealContext";
import { Meal, MenuData } from "@/types/types";

export const MealMenu = () => {
  const { mealList, setMealList } = useMealContext();

  const handleDeleteMeal = (category: keyof MenuData, meal: string) => {
    const updatedMenu: MenuData = {
      ...mealList,
      [category]: {
        ...(mealList?.[category] || {}), 
      },
    };

    if (updatedMenu[category]) {
      delete updatedMenu[category][meal];

      if (Object.keys(updatedMenu[category]).length === 0) {
        delete updatedMenu[category];
      }
    }

    setMealList(updatedMenu);
  };

  console.log({ mealList });

  const renderList = (category: keyof MenuData) => {
    return (
      <div className="mt-10 gap-5 grid lg:grid-cols-3">
        {mealList &&
          mealList[category] &&
          Object?.keys(mealList[category]).map((meal, mealIndex) => (
            <div
              key={mealIndex}
              className="bg-white p-6 rounded-lg flex-1 mb-10"
            >
              <button
                onClick={() =>
                  handleDeleteMeal(category, meal)
                }
              >
                Delete
              </button>
              <ul>
                {mealList[category] && Object.keys(mealList[category][meal]).map(
                  (dish, dishIndex) => (
                    <li key={dishIndex} className="mb-10 indent-3">
                      <p className="mb-2 font-bold">{dish}</p>
                      <ul>
                        {mealList[category] && mealList[category][meal][dish].map(
                          (ingredient, ingredientIndex) => (
                            <li key={ingredientIndex} className="mb-2">
                              {ingredient.item}: {ingredient.quantity}
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div>
      {mealList && mealList["Colazioni"] && (
        <h2 className="text-xl font-bold mb-5">Colazioni</h2>
      )}
      {renderList("Colazioni")}

      {mealList && mealList["Pranzi"] && (
        <h2 className="text-xl font-bold mb-5">Pranzi</h2>
      )}
      {renderList("Pranzi")}

      {mealList && mealList["Cene"] && (
        <h2 className="text-xl font-bold mb-5">Cene</h2>
      )}
      {renderList("Cene")}
    </div>
  );
};
