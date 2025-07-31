"use client";

import React, { useState } from "react";
import { TextArea } from "@/components/TextArea";
import { useUser } from "@clerk/nextjs";
import Toast from "@/components/Toast";
import { Button } from "@/components/Button";
import Link from "next/link";
import { Heart, Wine, Droplets, ChevronLeft, ChevronRight } from "lucide-react";
import { ShareSection } from "@/components/ShareSection";

interface StepOption {
  value: string;
  label: string;
}

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  type: "text" | "radio";
  options?: StepOption[];
}

// Helper function to build URLs without double slashes
const buildUrl = (baseUrl: string | undefined, path: string): string => {
  if (!baseUrl) return `https://www.cambusa-online.com/${path}`;
  const cleanBaseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  const cleanPath = path.replace(/^\//, ""); // Remove leading slash
  return `${cleanBaseUrl}/${cleanPath}`;
};

export const PageContent: React.FC<{
  groupId: string;
  group: {
    groupId: string;
    groupName: string;
    isTheGroupOwner: boolean;
    ownerName: string;
  };
  hasExistingPreferences: boolean;
  existingPreferences: {
    food: Array<{
      id: string;
      userId: string;
      groupId: string;
      preference: string;
    }>;
    alcohol: Array<{
      id: string;
      userId: string;
      groupId: string;
      preference: string;
    }>;
    water: Array<{
      id: string;
      userId: string;
      groupId: string;
      preference: string;
    }>;
  };
}> = ({ groupId, group, hasExistingPreferences, existingPreferences }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [foodPreferences, setFoodPreferences] = useState("");
  const [alcoholPreferences, setAlcoholPreferences] = useState("");
  const [waterPreference, setWaterPreference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [arePreferencesSaved, setArePreferencesSaved] = useState(false);
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { user } = useUser();
  const isTheGroupOwner = group?.isTheGroupOwner;
  const groupLink = isTheGroupOwner && buildUrl(baseUrl, `group/${groupId}/`);

  const shareUrl = `${window.location.origin}/group/${groupId}`;

  const steps: Step[] = [
    {
      id: 1,
      title: "Preferenze Alimentari",
      icon: Heart,
      description: "Le tue preferenze alimentari *",
      placeholder:
        "Esempio: mangio 150g di yogurt greco a colazione, non mangio la pasta, sono allergico alle noci...",
      value: foodPreferences,
      setValue: setFoodPreferences,
      type: "text",
    },
    {
      id: 2,
      title: "Preferenze sugli Alcolici",
      icon: Wine,
      description: "Le tue preferenze sugli alcolici *",
      placeholder:
        "Esempio: preferisco vino bianco, niente superalcolici, non bevo alcolici...",
      value: alcoholPreferences,
      setValue: setAlcoholPreferences,
      type: "text",
    },
    {
      id: 3,
      title: "Preferenze sull'Acqua",
      icon: Droplets,
      description: "Le tue preferenze sull'acqua *",
      value: waterPreference,
      setValue: setWaterPreference,
      type: "radio",
      options: [
        { value: "naturale", label: "Acqua naturale" },
        { value: "gassata", label: "Acqua gassata" },
        { value: "indifferente", label: "Indifferente" },
      ],
    },
  ];

  const handleNext = () => {
    // Check if current step has content before allowing to proceed
    const currentStepData = steps[currentStep - 1];
    if (!currentStepData.value.trim()) {
      setError(
        `Devi inserire le ${currentStepData.title.toLowerCase()} per procedere`
      );
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setError(""); // Clear any previous errors
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(""); // Clear any previous errors
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Only submit if we're on the final step
    if (currentStep !== steps.length) {
      return;
    }

    // Check if all steps have content
    if (
      !foodPreferences.trim() ||
      !alcoholPreferences.trim() ||
      !waterPreference.trim()
    ) {
      setError("Devi completare tutti gli step per procedere");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Submit food preferences
      if (foodPreferences.trim()) {
        const foodResponse = await fetch(
          `/api/groups/${groupId}/set-preferences`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preference: foodPreferences }),
          }
        );
        if (!foodResponse.ok) {
          const errorData = await foodResponse.json();
          throw new Error(
            errorData.error ||
              "Errore durante il salvataggio delle preferenze alimentari"
          );
        }
      }

      // Submit alcohol preferences
      if (alcoholPreferences.trim()) {
        const alcoholResponse = await fetch(
          `/api/groups/${groupId}/set-alcohol-preferences`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preference: alcoholPreferences }),
          }
        );
        if (!alcoholResponse.ok) {
          const errorData = await alcoholResponse.json();
          throw new Error(
            errorData.error ||
              "Errore durante il salvataggio delle preferenze sugli alcolici"
          );
        }
      }

      // Submit water preferences
      if (waterPreference.trim()) {
        const waterResponse = await fetch(
          `/api/groups/${groupId}/set-water-preferences`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preference: waterPreference }),
          }
        );
        if (!waterResponse.ok) {
          const errorData = await waterResponse.json();
          throw new Error(
            errorData.error ||
              "Errore durante il salvataggio delle preferenze sull'acqua"
          );
        }
      }

      setShowToastSuccess(true);
      setArePreferencesSaved(true);
    } catch (error) {
      console.error("Errore:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep - 1];

  if (!user) return null;

  // If user has already submitted preferences, show a message instead of the form
  if (hasExistingPreferences) {
    return (
      <>
        {/* Group Owner Section - Only show if user is the group owner */}
        {isTheGroupOwner && groupLink && (
          <div className="border rounded-lg p-8 mb-8 bg-white">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Gruppo creato con successo!
              </h2>
            </div>
            <ShareSection
              groupName={group.groupName}
              shareUrl={shareUrl}
              copyLinkUrl={groupLink}
            />

            {/* CTA per visitare la pagina del menu */}
            <div className="mt-8 p-6 bg-primary/5 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Monitora le preferenze del gruppo
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Dalla pagina del gruppo potrai vedere in tempo reale le
                  preferenze che gli altri utenti aggiungeranno e generare il
                  menu in qualsiasi momento.
                </p>
                <div className="flex justify-center">
                  <Link href={`${groupId}/menu`}>
                    <Button className="px-6 py-3 text-base">
                      Vai alla pagina del gruppo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? "bg-primary border-primary text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step.id ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mt-2">
            Step {currentStep} di {steps.length}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            * Tutti gli step sono obbligatori per procedere
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {currentStepData.type === "text" ? (
              <TextArea
                rows={4}
                value={currentStepData.value}
                onChange={(e) => currentStepData.setValue(e.target.value)}
                placeholder={currentStepData.placeholder || ""}
                id={`step-${currentStepData.id}`}
                label={currentStepData.description}
              />
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {currentStepData.description}
                </label>
                <div className="space-y-3">
                  {currentStepData.options?.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`step-${currentStepData.id}`}
                        value={option.value}
                        checked={currentStepData.value === option.value}
                        onChange={(e) =>
                          currentStepData.setValue(e.target.value)
                        }
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-3 text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Precedente
            </Button>

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Successivo
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e as any);
                }}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? "Salvataggio..." : "Salva tutte le preferenze"}
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Success Messages */}
      <div className="mt-8 space-y-4">
        {showToastSuccess && (
          <Toast
            message={"Tutte le preferenze salvate con successo!"}
            type="success"
            showToast={showToastSuccess}
            onClose={() => setShowToastSuccess(false)}
          />
        )}

        {error && (
          <Toast
            message={error}
            type="error"
            showToast={!!error}
            onClose={() => setError("")}
          />
        )}
      </div>

      {/* Navigation Section */}
      {(arePreferencesSaved || isTheGroupOwner) && (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="text-center">
            <p className="text-lg text-gray-800 mb-6 font-medium">
              {!isTheGroupOwner
                ? "Perfetto! Ora puoi monitorare le preferenze aggiunte dai tuoi compagni di viaggio"
                : "Ora puoi monitorare le preferenze aggiunte dai tuoi compagni di viaggio e quando tutti saranno pronti potrai generare il menu per il gruppo"}
            </p>
            <div className="flex justify-center">
              <Link href={`${groupId}/menu`}>
                <Button className="px-8 py-3 text-lg">
                  Vai alla pagina del gruppo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
