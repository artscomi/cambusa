"use client";

import { CTA } from "@/components/CTA";
import { TextInput, TextInputConfig } from "@/components/TextInput";
import { Checkbox, CheckboxProps } from "@/components/Checkbox";
import { Select } from "@/components/Select";
import { SelectConfig } from "@/hooks/useFormConfig";
import { createGroupAction } from "@/app/api/actions";
import { useFormConfig } from "@/hooks/useFormConfig";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Utensils } from "lucide-react";

const GROUP_CREATE_FIELD_KEYS = [
  "groupName",
  "people",
  "breakfast",
  "lunch",
  "dinner",
  "sameBreakfast",
] as const;

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
    fields: ["breakfast", "sameBreakfast", "lunch", "dinner"],
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const config = inputConfig.find((c) => c.id === fieldId);
    if (!config) return;

    if ("onChange" in config) {
      config.onChange(e as any);
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

      if (fieldId === "sameBreakfast") {
        return;
      }

      const value = formState[fieldId as keyof typeof formState];

      if (!value || (typeof value === "string" && value.trim() === "")) {
        if ("required" in config && config.required) {
          newErrors[fieldId] = "Questo campo è obbligatorio";
          isValid = false;
        }
        return;
      }

      if (fieldId === "people" && value) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 1 || numValue > 20) {
          newErrors[fieldId] = "Inserisci un numero tra 1 e 20";
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
      for (const key of GROUP_CREATE_FIELD_KEYS) {
        const value = formState[key];
        if (value === undefined) continue;
        if (key === "sameBreakfast") {
          if (value === true) {
            formData.append(key, "on");
          }
        } else {
          formData.append(key, String(value));
        }
      }

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
    <div className="overflow-x-hidden">
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
                {index === 1 && <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />}
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

                if ("type" in config && config.type === "select") {
                  const selectConfig = config as SelectConfig;
                  return (
                    <Select
                      key={fieldId}
                      {...selectConfig}
                      onChange={(e) => handleFieldChange(fieldId, e)}
                      error={showErrors ? errors[fieldId] : undefined}
                    />
                  );
                }

                if (fieldId === "sameBreakfast") {
                  const checkboxConfig = config as CheckboxProps;
                  return (
                    <Checkbox
                      key={fieldId}
                      {...checkboxConfig}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (config?.onChange) {
                          config.onChange(e as any);
                        }
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors[fieldId];
                          return newErrors;
                        });
                      }}
                      error={showErrors ? errors[fieldId] : undefined}
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
            <CTA
              type="button"
              onClick={handlePrev}
              variant="formOutline"
              className="px-6"
            >
              Indietro
            </CTA>
          )}

          {!isLastStep ? (
            <CTA type="button" onClick={handleNext} className="ml-auto px-6" variant="form">
              Avanti
            </CTA>
          ) : (
            <CTA type="submit" className="ml-auto px-6" variant="form" disabled={loading}>
              {loading ? "Creazione in corso..." : "Crea Gruppo"}
            </CTA>
          )}
        </div>
      </form>
    </div>
  );
};
