import { FormState } from "@/hooks/useInputConfig";

export const CtaCreateMenu = ({
  setMealList,
  inputData,
}: {
  setMealList: any;
  inputData: FormState;
}) => {
  const { breakfast, lunch, dinner, dietaryPreferences, people } = inputData;

  const handleGeneratePlan = async () => {
    const response = await fetch("/api/generate-shopping-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        breakfast,
        lunch,
        dinner,
        dietaryPreferences,
        people,
      }),
    });
    const data = await response.json();
    const shoppingList = JSON.parse(data.shoppingList);

    setMealList(shoppingList);
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
