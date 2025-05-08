"use client";

import { Button } from "@/components/Button";
import { TextInput, TextInputConfig } from "@/components/TextInput";
import { TextArea } from "@/components/TextArea";
import { Checkbox } from "@/components/Checkbox";
import { createGroupAction } from "@/app/api/actions";
import { useFormConfig } from "@/hooks/useFormConfig";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Utensils, Heart } from "lucide-react";

type Step = {
  title: string;
  description: string;
  fields: string[];
};

const steps: Step[] = [
  {
    title: "Informazioni Base",
    description: "Iniziamo con le informazioni principali del gruppo",
    fields: ["groupName", "people"],
  },
  {
    title: "Pasti",
    description: "Quanti pasti prevede il tuo viaggio?",
    fields: ["breakfast", "lunch", "dinner"],
  },
  {
    title: "Preferenze",
    description:
      "Hai delle preferenze alimentari o allergie? Inseriscile qui per aiutare gli altri a pianificare i pasti",
    fields: ["dietaryPreferences"],
  },
];

export const CreateGroupForm = () => {
  const router = useRouter();
  const { inputConfig, formState } = useFormConfig(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  const handleFieldChange = (
    fieldId: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const config = inputConfig.find((c) => c.id === fieldId);
    if (config?.onChange) {
      config.onChange(e);
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  };

  const validateStep = (stepIndex: number): boolean => {
    const currentStepFields = steps[stepIndex].fields;
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentStepFields.forEach((fieldId) => {
      const config = inputConfig.find((c) => c.id === fieldId);
      if (!config) return;

      const value = formState[fieldId as keyof typeof formState];

      if (
        config.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        newErrors[fieldId] = "Questo campo è obbligatorio";
        isValid = false;
      } else if (fieldId === "groupSize" && value) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 1 || numValue > 20) {
          newErrors[fieldId] = "Inserisci un numero tra 1 e 20";
          isValid = false;
        }
      } else if (fieldId === "dietaryPreferences") {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[fieldId] = "Inserisci almeno una preferenza alimentare";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowErrors(true);
    if (!validateStep(currentStep)) return;

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      const groupId = await createGroupAction(formData);
      if (groupId) {
        router.push(`/group/${groupId}`);
      } else {
        console.error("Error creating group");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setShowErrors(true);
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const isLastStep = currentStep === steps.length - 1;
  const currentStepConfig = steps[currentStep];

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden bg-white">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <p
              key={step.title}
              className={`flex-1 text-center font-bold text-sm sm:text-base ${
                index <= currentStep ? "text-primary" : "text-gray-400"
              }`}
            >
              <div className="flex flex-col items-center gap-1 mb-2">
                {index === 0 && <Users className="w-5 h-5 sm:w-6 sm:h-6" />}
                {index === 1 && <Heart className="w-5 h-5 sm:w-6 sm:h-6" />}
                {index === 2 && <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />}
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

      <form onSubmit={handleCreateGroup}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2">
              {currentStepConfig.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {currentStepConfig.description}
            </p>

            <div className="grid gap-4">
              {currentStepConfig.fields.map((fieldId) => {
                const config = inputConfig.find((c) => c.id === fieldId);
                if (!config) return null;

                if (fieldId === "dietaryPreferences") {
                  return (
                    <TextArea
                      key={fieldId}
                      {...config}
                      onChange={(e) => handleFieldChange(fieldId, e)}
                      error={showErrors ? errors[fieldId] : undefined}
                      rows={8}
                    />
                  );
                }

                const textInputConfig = config as TextInputConfig;
                return (
                  <TextInput
                    key={fieldId}
                    {...textInputConfig}
                    onChange={(e) => handleFieldChange(fieldId, e)}
                    error={showErrors ? errors[fieldId] : undefined}
                  />
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <Button
              type="button"
              onClick={handlePrev}
              variant="outline"
              className="px-6"
            >
              Indietro
            </Button>
          )}

          {!isLastStep ? (
            <Button type="button" onClick={handleNext} className="ml-auto px-6">
              Avanti
            </Button>
          ) : (
            <Button type="submit" className="ml-auto px-6" disabled={loading}>
              {loading ? "Creazione in corso..." : "Crea Gruppo"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
