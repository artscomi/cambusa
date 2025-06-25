"use client";

import { useState, useEffect } from "react";
import { TextInputConfig } from "@/components/TextInput";
import { TextAreaConfig } from "@/components/TextArea";
import { CheckboxProps } from "@/components/Checkbox/index";

export type SelectConfig = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  type: "select";
  options: { value: string; label: string }[];
  error?: string;
};

export type FormState = {
  people: string;
  dietaryPreferences: string;
  alcoholPreferences: string;
  waterPreference: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  groupName?: string;
  sameBreakfast: boolean;
  peopleError?: string;
  dietaryPreferencesError?: string;
  alcoholPreferencesError?: string;
  waterPreferenceError?: string;
  breakfastError?: string;
  lunchError?: string;
  dinnerError?: string;
  groupNameError?: string;
};

export type FormStateKeys = keyof FormState;

const initialState: FormState = {
  people: "",
  dietaryPreferences: "",
  alcoholPreferences: "",
  waterPreference: "",
  lunch: "",
  dinner: "",
  groupName: "",
  breakfast: "",
  sameBreakfast: false,
};

export const useFormConfig = (isSimpleFlow?: boolean) => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isMounted, setIsMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const stored = sessionStorage.getItem("formState");
    if (stored) {
      try {
        const parsedState = JSON.parse(stored);
        setFormState(parsedState);
      } catch (error) {
        console.error("Error parsing stored form state:", error);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      sessionStorage.setItem("formState", JSON.stringify(formState));
    }
  }, [formState, isMounted]);

  const handleChange =
    (field: FormStateKeys) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value = e.target.value;
      const maxValue = field === "people" ? 20 : 10;

      const numericValue = Number(value);
      if (
        field === "dietaryPreferences" ||
        field === "groupName" ||
        field === "alcoholPreferences" ||
        field === "waterPreference"
      ) {
        if (numericValue) {
          return;
        }
      } else {
        if (
          isNaN(numericValue) ||
          numericValue < 0 ||
          numericValue > maxValue
        ) {
          if (numericValue > maxValue) {
            setFormState((prevState) => ({
              ...prevState,
              [`${field}Error`]: `Il numero massimo consentito è ${maxValue}`,
            }));
          }
          return;
        }
      }

      setFormState((prevState) => ({
        ...prevState,
        [field]: value,
        [`${field}Error`]: undefined,
      }));
    };

  const inputConfig: (
    | TextInputConfig
    | TextAreaConfig
    | CheckboxProps
    | SelectConfig
  )[] = [
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
            required: true,
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
      name: "sameBreakfast",
      id: "sameBreakfast",
      label: "Vorrei la stessa colazione ogni giorno",
      checked: formState.sameBreakfast,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prev) => ({
          ...prev,
          sameBreakfast: e.target.checked,
        }));
      },
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
      required: true,
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
      required: true,
    },
    {
      name: "people",
      id: "people",
      label: "Quanti siete a bordo?",
      value: formState.people,
      placeholder: "5",
      type: "number",
      inputType: "numeric",
      onChange: handleChange("people"),
      required: true,
    },

    {
      id: "dietaryPreferences",
      label: "Preferenze alimentari",
      value: formState.dietaryPreferences,
      placeholder:
        "Inserisci le tue preferenze alimentari, allergie o intolleranze...",
      onChange: handleChange("dietaryPreferences"),
      rows: 4,
    },
    {
      id: "alcoholPreferences",
      label: "Preferenze sugli alcolici",
      value: formState.alcoholPreferences,
      placeholder:
        "Es. Non bevo alcolici, preferisco vino bianco, niente superalcolici...",
      onChange: handleChange("alcoholPreferences"),
      rows: 3,
    },
    {
      id: "waterPreference",
      label: "Preferenza acqua",
      value: formState.waterPreference,
      placeholder: "Seleziona la tua preferenza",
      onChange: handleChange("waterPreference"),
    },
  ];

  return { inputConfig, formState };
};
