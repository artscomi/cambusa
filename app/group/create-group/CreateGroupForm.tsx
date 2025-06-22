"use client";

import { Button } from "@/components/Button";
import { TextInput, TextInputConfig } from "@/components/TextInput";
import { TextArea, TextAreaConfig } from "@/components/TextArea";
import { Checkbox, CheckboxProps } from "@/components/Checkbox";
import { Select } from "@/components/Select";
import { SelectConfig } from "@/hooks/useFormConfig";
import { createGroupAction } from "@/app/api/actions";
import { useFormConfig } from "@/hooks/useFormConfig";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Utensils, Heart, Wine, Droplets } from "lucide-react";

type Step = {
  title: string;
  description: string;
  fields: string[];
  icon?: React.ComponentType<{ className?: string }>;
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
  {
    title: "Preferenze alimentari",
    description:
      "Hai delle preferenze alimentari o allergie? Inseriscile qui per aiutare gli altri a pianificare i pasti.",
    fields: ["dietaryPreferences"],
  },
  {
    title: "Preferenze sugli alcolici",
    description: "Hai delle preferenze sugli alcolici? Inseriscile qui!",
    fields: ["alcoholPreferences"],
    icon: Wine,
  },
  {
    title: "Preferenza acqua",
    description: "Che tipo di acqua preferisci?",
    fields: ["waterPreference"],
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
      } else if (
        fieldId === "dietaryPreferences" ||
        fieldId === "alcoholPreferences"
      ) {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[fieldId] =
            fieldId === "dietaryPreferences"
              ? "Inserisci almeno una preferenza alimentare"
              : "Inserisci le preferenze sugli alcolici o specifica se non ne hai";
          isValid = false;
        }
      } else if (fieldId === "waterPreference") {
        if (!value || value === "") {
          newErrors[fieldId] = "Seleziona una preferenza per l'acqua";
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
        if (value !== undefined) {
          if (key === "sameBreakfast") {
            if (value === true) {
              formData.append(key, "on");
            }
          } else {
            formData.append(key, String(value));
          }
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
    <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden bg-white max-w-[500px] m-auto">
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
                {index === 2 && <Heart className="w-5 h-5 sm:w-6 sm:h-6" />}
                {index === 3 && <Wine className="w-5 h-5 sm:w-6 sm:h-6" />}
                {index === 4 && <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />}
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

                if (
                  fieldId === "dietaryPreferences" ||
                  fieldId === "alcoholPreferences"
                ) {
                  const textAreaConfig = config as TextAreaConfig;
                  return (
                    <TextArea
                      key={fieldId}
                      {...textAreaConfig}
                      onChange={(e) => handleFieldChange(fieldId, e)}
                      error={showErrors ? errors[fieldId] : undefined}
                      rows={fieldId === "dietaryPreferences" ? 8 : 4}
                      placeholder={
                        fieldId === "dietaryPreferences"
                          ? "Non mangiamo carne. A colazione mangiamo yogurt e frutta."
                          : "Es. Non bevo alcolici, preferisco vino bianco, niente superalcolici..."
                      }
                    />
                  );
                }

                if (fieldId === "waterPreference") {
                  const waterOptions = [
                    { value: "naturale", label: "Acqua naturale" },
                    { value: "gassata", label: "Acqua gassata" },
                    { value: "indifferente", label: "Indifferente" },
                  ];

                  return (
                    <div key={fieldId}>
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
                              name={fieldId}
                              value={option.value}
                              checked={
                                ("value" in config ? config.value : "") ===
                                option.value
                              }
                              onChange={(e) => handleFieldChange(fieldId, e)}
                              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="ml-3 text-gray-700">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      {showErrors && errors[fieldId] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[fieldId]}
                        </p>
                      )}
                    </div>
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
