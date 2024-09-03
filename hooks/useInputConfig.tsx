import { useState } from "react";

export type TextInputConfig = {
  id: string;
  label: string;
  value: string;
  type: "number" | "text";
  max?: string;
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
  max?: string;
  dinner: string;
};

export type FormStateKeys = keyof FormState;

const initialState: FormState = {
  people: "",
  dietaryPreferences: "",
  breakfast: "",
  lunch: "",
  dinner: "",
  type: "number",
  max: "7",
};

export const useFormConfig = () => {
  const [formState, setFormState] = useState<FormState>(initialState);

  const handleChange =
    (field: FormStateKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: e.target.value,
      }));
    };

  const inputConfig: TextInputConfig[] = [
    {
      id: "breakfast",
      label: "Quante colazioni?",
      value: formState.breakfast,
      placeholder: "7",
      type: "number",
      max: "7",
      onChange: handleChange("breakfast"),
    },
    {
      id: "lunch",
      label: "Quanti pranzi?",
      value: formState.lunch,
      placeholder: "7",
      type: "number",
      max: "7",
      onChange: handleChange("lunch"),
    },
    {
      id: "dinner",
      label: "Quante cene?",
      value: formState.dinner,
      placeholder: "7",
      type: "number",
      max: "7",
      onChange: handleChange("dinner"),
    },
    {
      id: "people",
      label: "Per quante persone?",
      value: formState.people,
      placeholder: "5",
      type: "number",
      max: "7",
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
