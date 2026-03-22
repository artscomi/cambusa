"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Toast from "@/components/Toast";
import { CTA } from "@/components/CTA";
import { Heart, Wine, Droplets, CheckCircle } from "lucide-react";
import { ShareSection } from "@/components/ShareSection";
import { useRouter } from "next/navigation";
import { useMealContext } from "@/context/useMealContext";
import {
  GroupPreferencesWizard,
  type PreferenceStep,
} from "./GroupPreferencesWizard";

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
  hasGeneratedMenu: boolean;
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
}> = ({
  groupId,
  group,
  hasExistingPreferences,
  hasGeneratedMenu,
  existingPreferences,
}) => {
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
  const router = useRouter();
  const { setCurrentGroupId } = useMealContext();
  const isTheGroupOwner = group?.isTheGroupOwner;
  const groupLink = isTheGroupOwner && buildUrl(baseUrl, `group/${groupId}/`);

  const shareUrl = `${window.location.origin}/group/${groupId}`;

  const steps: PreferenceStep[] = [
    {
      id: 1,
      title: "Preferenze alimentari",
      icon: Heart,
      description:
        "Cosa mangi, cosa eviti, allergie o intolleranze (obbligatorio)",
      placeholder:
        "Es.: colazione leggera, niente latticini, allergia alle noci, preferisco il pesce alla carne…",
      value: foodPreferences,
      setValue: setFoodPreferences,
      type: "text",
    },
    {
      id: 2,
      title: "Alcolici",
      icon: Wine,
      description:
        "Cosa ti piace bere in barca, anche se è solo analcolico (obbligatorio)",
      placeholder:
        "Es.: vino bianco a cena, birra di tanto in tanto, oppure non bevo alcolici…",
      value: alcoholPreferences,
      setValue: setAlcoholPreferences,
      type: "text",
    },
    {
      id: 3,
      title: "Acqua",
      icon: Droplets,
      description: "Che acqua preferisci in cambusa? (obbligatorio)",
      value: waterPreference,
      setValue: setWaterPreference,
      type: "radio",
      options: [
        { value: "naturale", label: "Naturale" },
        { value: "gassata", label: "Gassata" },
        { value: "indifferente", label: "Indifferente" },
      ],
    },
  ];

  const handleNext = () => {
    // Check if current step has content before allowing to proceed
    const currentStepData = steps[currentStep - 1];
    if (!currentStepData.value.trim()) {
      const byStep: Record<number, string> = {
        1: "Scrivi qualcosa sulle tue abitudini a tavola per andare avanti.",
        2: "Aggiungi una riga su come ti orienti con alcolici o analcolici.",
      };
      setError(
        byStep[currentStep] ?? "Completa questo passaggio prima di continuare.",
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
      setError(
        "Completa tutti e tre i passaggi (cibo, alcolici e acqua) prima di salvare.",
      );
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
          },
        );
        if (!foodResponse.ok) {
          const errorData = await foodResponse.json();
          throw new Error(
            errorData.error ||
              "Non siamo riusciti a salvare le preferenze alimentari. Riprova.",
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
          },
        );
        if (!alcoholResponse.ok) {
          const errorData = await alcoholResponse.json();
          throw new Error(
            errorData.error ||
              "Non siamo riusciti a salvare le preferenze sugli alcolici. Riprova.",
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
          },
        );
        if (!waterResponse.ok) {
          const errorData = await waterResponse.json();
          throw new Error(
            errorData.error ||
              "Non siamo riusciti a salvare la preferenza sull'acqua. Riprova.",
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

  const stepShortLabels = ["Cibo", "Alcolici", "Acqua"] as const;

  const surfaceCard = "rounded-2xl border border-gray-200 bg-white p-6 sm:p-8";
  const insetPanel =
    "rounded-xl border border-primary/15 bg-gradient-to-br from-primary/[0.06] to-transparent p-5 sm:p-6";

  if (!user) return null;

  // If user has already submitted preferences OR just saved preferences, show a message instead of the form
  if (hasExistingPreferences || arePreferencesSaved) {
    return (
      <div className="w-full space-y-6 overflow-x-hidden sm:space-y-8">
        {group.isTheGroupOwner && groupLink && (
          <div className={surfaceCard}>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
              <div className="flex shrink-0 flex-col items-center text-center sm:items-start sm:text-left">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50">
                  <Heart
                    className="h-10 w-10 text-emerald-600"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-primary sm:text-2xl">
                  Ottimo, gruppo avviato
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-600">
                  Condividi il link con l&apos;equipaggio e tieni d&apos;occhio
                  chi ha inviato tutte le preferenze.
                </p>
              </div>
              <div className="min-w-0 flex-1 space-y-6">
                <ShareSection
                  groupName={group.groupName}
                  shareUrl={shareUrl}
                  copyLinkUrl={groupLink}
                />
                <div className={insetPanel}>
                  <h3 className="font-display text-lg font-bold text-primary">
                    Pagina gruppo
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    Da lì vedi tutte le preferenze raccolte e, quando sei
                    pronto/a, generi il menu per farlo votare.
                  </p>
                  <div className="mt-5">
                    <CTA href={`${groupId}/menu`} variant="outline">
                      Vai alla pagina gruppo
                    </CTA>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!group.isTheGroupOwner && (
          <div className={surfaceCard}>
            <div className="flex flex-col items-center gap-6 pb-2 text-center sm:flex-row sm:items-start sm:text-left">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50">
                <CheckCircle
                  className="h-10 w-10 text-emerald-600"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <h2 className="font-display text-xl font-bold text-primary sm:text-2xl">
                  Preferenze ricevute
                </h2>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  Grazie! Quando l&apos;organizzatore avrà pubblicato il menu,
                  potrai vederlo e votarlo da &quot;Il mio menu&quot;.
                </p>
              </div>
            </div>

            {hasGeneratedMenu && (
              <div className="mt-8 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-50/40 p-5 sm:p-6">
                <h3 className="font-display text-lg font-bold text-amber-950">
                  Il menu è pronto per te
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-950/85 sm:text-base">
                  Apri &quot;Il mio menu&quot; e dai da 1 a 5 stelle ai pasti:
                  il tuo voto aiuta l&apos;organizzatore a capire cosa piace di
                  più.
                </p>
                <div className="mt-5">
                  <CTA
                    variant="solid"
                    onClick={() => {
                      setCurrentGroupId(groupId);
                      router.push("/my-menu");
                    }}
                  >
                    Apri e vota
                  </CTA>
                </div>
              </div>
            )}

            <div className={`mt-8 ${insetPanel}`}>
              <h3 className="font-display text-lg font-bold text-primary">
                Tutto il gruppo in un colpo d&apos;occhio
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Nella pagina gruppo vedi le preferenze di tutti; il menu e i
                voti sono in «Il mio menu» quando il menu è pubblicato.
              </p>
              <div className="mt-5">
                <CTA href={`${groupId}/menu`} variant="outline">
                  Vai alla pagina gruppo
                </CTA>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 overflow-x-hidden sm:space-y-8">
      <GroupPreferencesWizard
        currentStep={currentStep}
        steps={steps}
        stepShortLabels={stepShortLabels}
        onSubmit={handleSubmit}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLoading={isLoading}
      />

      <div className="space-y-4">
        {showToastSuccess && (
          <Toast
            message="Preferenze salvate."
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
    </div>
  );
};
