import { TextInputConfig } from "@/components/TextInput";
import { useState } from "react";

export type FormState = {
  people: string;
  dietaryPreferences: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  groupName?: string;
};

export type FormStateKeys = keyof FormState;

const initialState: FormState = {
  people: "",
  dietaryPreferences: "",
  breakfast: "",
  lunch: "",
  dinner: "",
  groupName: "",
};

export const useFormConfig = (isSimpleFlow?: boolean) => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const currentYear = new Date().getFullYear();

  const handleChange =
    (field: FormStateKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const maxValue = field === "people" ? 20 : 7;

      const numericValue = Number(value);
      if (field === "dietaryPreferences" || field === "groupName") {
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
    ...(!isSimpleFlow
      ? [
          {
            name: "groupName",
            id: "groupName",
            label: "Nome del gruppo",
            value: formState.groupName ?? "",
            placeholder: `Capraia ${currentYear}`,
            type: "text" as "text",
            inputType: "text" as "text",
            onChange: handleChange("groupName"),
            required: true
          },
        ]
      : []),
    {
      name: "breakfast",
      id: "breakfast",
      label: "Quante colazioni?",
      value: formState.breakfast,
      placeholder: "7",
      type: "number",
      inputType: "numeric",
      onChange: handleChange("breakfast"),
    },
    {
      name: "lunch",
      id: "lunch",
      label: "Quanti pranzi?",
      value: formState.lunch,
      placeholder: "7",
      type: "number",
      inputType: "numeric",
      onChange: handleChange("lunch"),
    },
    {
      name: "dinner",
      id: "dinner",
      label: "Quante cene?",
      value: formState.dinner,
      placeholder: "7",
      type: "number",
      inputType: "numeric",
      onChange: handleChange("dinner"),
    },
    {
      name: "people",
      id: "people",
      label: "Per quante persone?",
      value: formState.people,
      placeholder: "5",
      type: "number",
      inputType: "numeric",
      onChange: handleChange("people"),
    },
    ...(isSimpleFlow
      ? [
          {
            name: "dietaryPreferences",
            id: "dietaryPreferences",
            label: "Preferenze alimentari",
            value: formState.dietaryPreferences,
            placeholder: "vegan, gluten-free",
            type: "text" as "text",
            inputType: "text" as "text",
            onChange: handleChange("dietaryPreferences"),
          },
        ]
      : []),
  ];

  return { inputConfig, formState };
};
