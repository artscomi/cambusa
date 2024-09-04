interface MealItemProps {
  meal: { [key: string]: { item: string; quantity: string }[] };
}

export const MealItem = ({ meal }: MealItemProps) => {
  return (
    <ul>
      {Object.keys(meal).map((dish) => (
        <li key={dish} className="mb-10 indent-3">
          <p className="mb-2 font-bold">{dish}</p>
          <ul>
            {meal[dish].map((ingredient) => (
              <li key={ingredient.item} className="mb-2">
                {ingredient.item}: {ingredient.quantity}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
