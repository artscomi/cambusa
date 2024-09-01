import { MealItem, MealList } from "@/types/types";

export const MealMenu = ({ menu }: { menu: MealList }) => {
  const renderMealItems = (items: MealItem[]) => {
    return (
      <ul className="indent-3">
        {items.map((item, index) => (
          <li key={index}>
            {item.item}: {item.quantity}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-10 gap-5 grid lg:grid-cols-3">
      {menu.map((day, index: number) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg flex-1"
        >
          <p className="text-xl font-bold mb-5">Giorno {index + 1}</p>
          {Object.entries(day).map(([meal, items]) => (
            <div key={meal} className="mb-10 indent-3 ">
              <h2 className="text-lg font-bold mb-1">{meal}</h2>
              {renderMealItems(items)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
