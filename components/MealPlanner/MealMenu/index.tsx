import { Ingredient, MenuData } from "@/types/types";

export const MealMenu = ({ menu }: { menu: MenuData }) => {
  const renderList = (category: keyof MenuData) => {
    return (
      <div className="mt-10 gap-5 grid lg:grid-cols-3">
        {Object.keys(menu[category]).map((meal, mealIndex) => (
          <div key={mealIndex} className="bg-white p-6 rounded-lg flex-1 mb-10">
            <ul>
              {Object.keys(menu[category][meal]).map((dish, dishIndex) => (
                <li key={dishIndex} className="mb-10 indent-3">
                  <p className="mb-2 font-bold">{dish}</p>
                  <ul>
                    {menu[category][meal][dish].map(
                      (ingredient, ingredientIndex) => (
                        <li key={ingredientIndex} className="mb-2">
                          {ingredient.item}: {ingredient.quantity}
                        </li>
                      )
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">Colazioni</h2>
      {renderList("Colazioni")}

      <h2 className="text-xl font-bold mb-5">Pranzi</h2>
      {renderList("Pranzi")}

      <h2 className="text-xl font-bold mb-5">Cene</h2>
      {renderList("Cene")}
    </div>
  );
};
