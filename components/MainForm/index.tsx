"use client";

import { useFormConfig } from "@/hooks/useFormConfig";
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { Button } from "@/components/Button";
import { useMealContext } from "@/context/useMealContext";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { handleMealListGeneration } from "@/utils/mealUtils";
import { useStripeModal } from "@/context/useStripeModalContext";
import { GroupData, MealList } from "@/types/types";
import { TextInput } from "../TextInput";
import { TextArea } from "../TextArea";
import { Select } from "../Select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Utensils,
  Heart,
  ArrowRight,
  Wine,
  Droplets,
} from "lucide-react";
import { Checkbox } from "../Checkbox/index";

export type Result = { type: "success"; menu: MealList } | ResultErrors;

export type ResultErrors =
  | { type: "parse-error"; text: string }
  | { type: "validation-error"; value: unknown }
  | { type: "unknown-error"; error: unknown }
  | { type: "user-not-found"; error: unknown }
  | { type: "timeout-error"; error: string };

type Step = {
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: string[];
};

const steps: Step[] = [
  {
    title: "Informazioni Base",
    description: "Iniziamo con le informazioni principali",
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    fields: ["people"],
  },
  {
    title: "Pasti",
    description: "Quanti pasti prevede il tuo viaggio?",
    icon: <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />,
    fields: ["breakfast", "sameBreakfast", "lunch", "dinner"],
  },
  {
    title: "Preferenze alimentari",
    description: "Aggiungi le preferenze alimentari del gruppo",
    icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
    fields: ["dietaryPreferences"],
  },
  {
    title: "Preferenze sugli alcolici",
    description: "Aggiungi le preferenze sugli alcolici del gruppo",
    icon: <Wine className="w-5 h-5 sm:w-6 sm:h-6" />,
    fields: ["alcoholPreferences"],
  },
  {
    title: "Preferenza acqua",
    description: "Che tipo di acqua preferisci?",
    icon: <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />,
    fields: ["waterPreference"],
  },
];

export const MainForm = ({
  groupData,
  startTransition,
  setError,
}: {
  setError: Dispatch<SetStateAction<null | string>>;
  groupData?: GroupData;
  startTransition: (callback: () => void) => void;
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const { inputConfig, formState } = useFormConfig(true);
  const {
    setMealList,
    setAlcoholPreferences,
    setWaterPreference,
    setPeople,
    setDays,
    setGroupAlcoholPreferences,
  } = useMealContext();
  const { dietaryPreferences, alcoholPreferences, waterPreference, people } =
    formState;
  const { user } = useUser();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { openDialogStripe } = useStripeModal();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepIndex: number): boolean => {
    const stepFields = steps[stepIndex].fields;
    const newErrors: Record<string, string> = {};

    stepFields.forEach((field) => {
      const value = formState[field as keyof typeof formState];
      const config = inputConfig.find((c) => c.id === field);

      if (!config) return;

      if (config.id === "sameBreakfast") {
        return; // Skip validation for checkbox
      }

      if (!value || (typeof value === "string" && value.trim() === "")) {
        if (field === "alcoholPreferences" || field === "dietaryPreferences") {
          newErrors[field] =
            field === "alcoholPreferences"
              ? "Inserisci le preferenze sugli alcolici o specifica se non ne hai"
              : "Questo campo è obbligatorio";
        } else if (field === "waterPreference") {
          newErrors[field] = "Seleziona una preferenza per l'acqua";
        } else if ("required" in config && config.required) {
          newErrors[field] = "Questo campo è obbligatorio";
        }
        return;
      }

      if (
        field !== "dietaryPreferences" &&
        field !== "alcoholPreferences" &&
        field !== "waterPreference" &&
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          newErrors[field] = "Inserisci un numero valido maggiore di 0";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    const formData = {
      dietaryPreferences,
      alcoholPreferences,
      breakfast: formState.breakfast,
      lunch: formState.lunch,
      dinner: formState.dinner,
      people,
      sameBreakfast: formState.sameBreakfast,
      waterPreference,
    };

    if (!user) {
      sessionStorage.setItem("pendingFormData", JSON.stringify(formData));
      openSignIn();
      return;
    }

    await handleMealListGeneration(
      user.id,
      dietaryPreferences,
      alcoholPreferences,
      waterPreference,
      {
        breakfast: formState.breakfast,
        lunch: formState.lunch,
        dinner: formState.dinner,
        people,
        sameBreakfast: formState.sameBreakfast,
      },
      setError,
      startTransition,
      setMealList,
      setAlcoholPreferences,
      setWaterPreference,
      setPeople,
      setDays,
      setGroupAlcoholPreferences,
      router,
      openDialogStripe
    );
  };

  useEffect(() => {
    const handlePostLogin = async () => {
      if (user) {
        const pendingFormData = sessionStorage.getItem("pendingFormData");
        if (pendingFormData) {
          const formData = JSON.parse(pendingFormData);
          await handleMealListGeneration(
            user.id,
            formData.dietaryPreferences,
            formData.alcoholPreferences,
            formData.waterPreference,
            {
              breakfast: formData.breakfast,
              lunch: formData.lunch,
              dinner: formData.dinner,
              people: formData.people,
              sameBreakfast: formData.sameBreakfast,
            },
            setError,
            startTransition,
            setMealList,
            setAlcoholPreferences,
            setWaterPreference,
            setPeople,
            setDays,
            setGroupAlcoholPreferences,
            router,
            openDialogStripe
          );
          sessionStorage.removeItem("pendingFormData");
        }
      }
    };

    handlePostLogin();
  }, [user]);

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      progressRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    progressRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const currentFields = steps[currentStep].fields;
  const currentInputs = inputConfig.filter((config) =>
    currentFields.includes(config.id)
  );

  const renderInput = (config: any) => {
    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[config.id];
        return newErrors;
      });
      config.onChange?.(e);
    };

    if (config.type === "select") {
      return (
        <Select
          key={config.id}
          {...config}
          onChange={
            handleChange as (e: React.ChangeEvent<HTMLSelectElement>) => void
          }
          error={errors[config.id]}
        />
      );
    }

    if (
      config.id === "dietaryPreferences" ||
      config.id === "alcoholPreferences"
    ) {
      return (
        <TextArea
          key={config.id}
          {...config}
          onChange={handleChange}
          error={errors[config.id]}
          rows={2}
          placeholder={
            config.id === "dietaryPreferences"
              ? "Non mangiamo carne. A colazione mangiamo yogurt e frutta."
              : "Es. Non bevo alcolici, preferisco vino bianco, niente superalcolici..."
          }
        />
      );
    }

    if (config.id === "waterPreference") {
      const waterOptions = [
        { value: "naturale", label: "Acqua naturale" },
        { value: "gassata", label: "Acqua gassata" },
        { value: "indifferente", label: "Indifferente" },
      ];

      return (
        <div key={config.id}>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {config.label}
          </label>
          <div className="space-y-3">
            {waterOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name={config.id}
                  value={option.value}
                  checked={config.value === option.value}
                  onChange={(e) => config.onChange(e)}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="ml-3 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors[config.id] && (
            <p className="mt-1 text-sm text-red-600">{errors[config.id]}</p>
          )}
        </div>
      );
    }

    if (config.id === "sameBreakfast") {
      return <Checkbox key={config.id} {...config} onChange={handleChange} />;
    }

    return (
      <TextInput
        key={config.id}
        {...config}
        onChange={handleChange}
        error={errors[config.id]}
        errorMessage={
          formState[`${config.id}Error` as keyof typeof formState] as string
        }
      />
    );
  };

  return (
    <div className="z-10 relative w-full">
      {groupData ? (
        <h1 className="mb-10 text-3xl">{`Genera la tua cambusa per il gruppo ${groupData.id}`}</h1>
      ) : (
        <h2 className="mb-10 text-2xl text-primary font-semibold max-sm:hidden">
          Siete un piccolo gruppo?
          <span className="block text-base text-gray-500 font-normal">
            Compila il form e genera subito il menu
          </span>
        </h2>
      )}

      {/* Progress Bar */}
      <div className="mb-8 z-10 relative">
        <div ref={progressRef} className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex-1 text-center font-bold text-sm sm:text-base ${
                index <= currentStep ? "text-primary" : "text-gray-400"
              }`}
            >
              <div className="flex flex-col items-center gap-1 mb-2">
                {step.icon}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1.5 sm:h-2 bg-secondary rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <form className="z-10 flex-1 relative w-full" onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 mb-6">
              {steps[currentStep].description}
            </p>

            <div className="grid gap-4 mb-4">
              {currentInputs.map(renderInput)}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <Button
              type="button"
              onClick={prevStep}
              variant="primary"
              className="px-2 text-sm"
            >
              Indietro
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 group"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <Button type="submit" className="ml-auto px-6">
              Crea il menu
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
