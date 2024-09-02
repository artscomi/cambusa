import { useState } from "react";

type InputConfig = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type AddMealFormState = {
  ["meal-name"]: string;
  ingredient: string;
  quantity: string;
};

export type FormStateKeys = keyof AddMealFormState;

const initialState: AddMealFormState = {
  ["meal-name"]: "",
  ingredient: "",
  quantity: "",
};

export const useAddMealInputConfig = () => {
  const [formState, setFormState] = useState<AddMealFormState>(initialState);

  const handleChange =
    (field: FormStateKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: e.target.value,
      }));
    };

  const inputConfig: InputConfig[] = [
    {
      id: "meal-name",
      label: "Nome pasto",
      value: formState["meal-name"],
      placeholder: "7",
      onChange: handleChange("meal-name"),
    },
    {
      id: "ingredient",
      label: "Ingredienti",
      value: formState.ingredient,
      placeholder: "7",
      onChange: handleChange("ingredient"),
    },
    {
      id: "quantity",
      label: "Quantità",
      value: formState.quantity,
      placeholder: "7",
      onChange: handleChange("quantity"),
    },
  ];

  return { inputConfig, formState };
};
