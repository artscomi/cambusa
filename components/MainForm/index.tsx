"use client";

import { useFormConfig } from "@/hooks/useFormConfig";
import {
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import { Button } from "@/components/Button";
import { useMealContext } from "@/context/useMealContext";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { handleMealListGeneration } from "@/utils/mealUtils";
import { useStripeModal } from "@/context/useStripeModalContext";
import { GroupData, MealList } from "@/types/types";
import { TextInput } from "../TextInput";
import { TextArea } from "../TextArea";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Utensils, Heart, ArrowRight } from "lucide-react";
import { Checkbox } from "../Checkbox";

export type Result = { type: "success"; menu: MealList } | ResultErrors;

export type ResultErrors =
  | { type: "parse-error"; text: string }
  | { type: "validation-error"; value: unknown }
  | { type: "unknown-error"; error: unknown }
  | { type: "user-not-found"; error: unknown };

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
    title: "Preferenze",
    description: "Aggiungi le preferenze alimentari del gruppo",
    icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
    fields: ["dietaryPreferences"],
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
  const { setMealList } = useMealContext();
  const { dietaryPreferences, people } = formState;
  const { user } = useUser();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { openDialogStripe } = useStripeModal();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const LottieAnimation = useMemo(
    () =>
      dynamic(() => import("@/components/LottieAnimation"), {
        ssr: false,
      }),
    []
  );

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
        if ("required" in config && config.required) {
          newErrors[field] = "Questo campo è obbligatorio";
        }
        return;
      }

      if (
        field !== "dietaryPreferences" &&
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
      breakfast: formState.breakfast,
      lunch: formState.lunch,
      dinner: formState.dinner,
      people,
      sameBreakfast: formState.sameBreakfast,
    };

    if (!user) {
      sessionStorage.setItem("pendingFormData", JSON.stringify(formData));
      openSignIn();
      return;
    }

    await handleMealListGeneration(
      user.id,
      dietaryPreferences,
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
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[config.id];
        return newErrors;
      });
      config.onChange?.(e);
    };

    if (config.id === "dietaryPreferences") {
      return (
        <TextArea
          key={config.id}
          {...config}
          onChange={handleChange}
          error={errors[config.id]}
          rows={2}
          placeholder="Non mangiamo carne. A colazione mangiamo yogurt e frutta."
        />
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
    <div className="z-10 md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-8 overflow-y-clip bg-white">
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
            <p
              key={step.title}
              className={`flex-1 text-center font-bold text-sm sm:text-base ${
                index <= currentStep ? "text-primary" : "text-gray-400"
              }`}
            >
              <div className="flex flex-col items-center gap-1 mb-2">
                {step.icon}
              </div>
            </p>
          ))}
        </div>
        <div className="h-1.5 sm:h-2 bg-secondary rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <form
        className="z-10 flex-1 relative bg-white p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
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

      <div className="absolute left-0 right-0 top-0 bottom-0 sm:overflow-hidden sm:hidden">
        <LottieAnimation name="waveBig" isResponsive={false} speed={0.1} />
      </div>
    </div>
  );
};
