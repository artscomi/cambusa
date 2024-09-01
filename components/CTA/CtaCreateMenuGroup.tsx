export const CtaCreateMenuGroup = ({
  setShoppingList,
  inputData,
}: {
  setShoppingList: any;
  inputData: { groupDataDietaryPreferences: string; people: string };
}) => {
  const { groupDataDietaryPreferences, people } = inputData;

  const handleGeneratePlan = async () => {
    const response = await fetch("/api/generate-shopping-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dietaryPreferences: groupDataDietaryPreferences,
        people,
      }),
    });
    const data = await response.json();
    const shoppingList = JSON.parse(data.shoppingList);

    setShoppingList(shoppingList);
  };

  return (
    <button
      className="bg-black rounded h-15 text-white p-2 hover:bg-gray-800"
      onClick={handleGeneratePlan}
    >
      Genera il menu! 😍
    </button>
  );
};
