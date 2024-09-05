import { useState } from "react";

export type TextInputConfig = {
  id: string;
  label: string;
  value: string;
  type: "number" | "text";
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export type FormState = {
  people: string;
  dietaryPreferences: string;
  breakfast: string;
  lunch: string;
  type: "number" | "text";
  dinner: string;
};

export type FormStateKeys = keyof FormState;

const initialState: FormState = {
  people: "",
  dietaryPreferences: "",
  breakfast: "",
  lunch: "",
  dinner: "",
  type: "text",
};

export const useFormConfig = () => {
  const [formState, setFormState] = useState<FormState>(initialState);

  const handleChange =
    (field: FormStateKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const maxValue = field === "people" ? 20 : 7;

      const numericValue = Number(value);
      if (field === "dietaryPreferences") {
        if (numericValue) {
          return;
        }
      } else {
        if (
          value !== "" &&
          (isNaN(numericValue) || numericValue < 1 || numericValue > maxValue)
        ) {
          return;
        }
      }

      setFormState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };

  const inputConfig: TextInputConfig[] = [
    {
      id: "breakfast",
      label: "Quante colazioni?",
      value: formState.breakfast,
      placeholder: "7",
      type: "text",
      onChange: handleChange("breakfast"),
    },
    {
      id: "lunch",
      label: "Quanti pranzi?",
      value: formState.lunch,
      placeholder: "7",
      type: "text",
      onChange: handleChange("lunch"),
    },
    {
      id: "dinner",
      label: "Quante cene?",
      value: formState.dinner,
      placeholder: "7",
      type: "text",
      onChange: handleChange("dinner"),
    },
    {
      id: "people",
      label: "Per quante persone?",
      value: formState.people,
      placeholder: "5",
      type: "text",
      onChange: handleChange("people"),
    },
    {
      id: "dietaryPreferences",
      label: "Aggiungi le tue preferenze alimentari",
      value: formState.dietaryPreferences,
      placeholder: "vegan, gluten-free",
      type: "text",
      onChange: handleChange("dietaryPreferences"),
    },
  ];

  return { inputConfig, formState };
};
