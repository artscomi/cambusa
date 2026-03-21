"use client";

import type { FormEvent } from "react";
import { TextArea } from "@/components/TextArea";
import { CTA } from "@/components/CTA";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PreferenceStepOption = { value: string; label: string };

export type PreferenceStep = {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  type: "text" | "radio";
  options?: PreferenceStepOption[];
};

const surfaceCard = "rounded-2xl border border-gray-200 bg-white p-6 sm:p-8";

export function GroupPreferencesWizard({
  currentStep,
  steps,
  stepShortLabels,
  onSubmit,
  onNext,
  onPrevious,
  isLoading,
}: {
  currentStep: number;
  steps: PreferenceStep[];
  stepShortLabels: readonly string[];
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
}) {
  const currentStepData = steps[currentStep - 1];
  const stepProgressPct = (currentStep / steps.length) * 100;

  return (
    <div className={surfaceCard}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Le tue preferenze
        </p>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold tabular-nums text-gray-700">
          {currentStep} / {steps.length}
        </span>
      </div>
      <div
        className="mb-8 h-1.5 overflow-hidden rounded-full bg-gray-100"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${stepProgressPct}%` }}
        />
      </div>

      <div className="flex justify-center gap-0 sm:gap-1">
        {steps.map((step, index) => (
          <div key={step.id} className="flex min-w-0 items-center">
            <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-2 sm:w-28">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all duration-300 sm:h-12 sm:w-12 ${
                  currentStep === step.id
                    ? "border-primary bg-primary text-white"
                    : currentStep > step.id
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                <step.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
              </div>
              <span
                className={`max-w-full truncate text-center text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${
                  currentStep >= step.id ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {stepShortLabels[index]}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-0.5 mt-[-1.25rem] hidden h-0.5 w-6 shrink-0 sm:mx-1 sm:mt-[-1.5rem] sm:block sm:w-10 md:w-16 ${
                  currentStep > step.id ? "bg-primary" : "bg-gray-200"
                }`}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-100 pt-8 text-center sm:text-left">
        <h2 className="font-display text-xl font-bold text-primary sm:text-2xl">
          {currentStepData.title}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {currentStepData.description.replace(
            /\s*\(obbligatorio\)\s*$/i,
            "",
          )}
        </p>
        <p className="mt-3 text-xs text-gray-500">
          I tre passaggi sono obbligatori per salvare.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-6 border-t border-gray-100 pt-6 sm:mt-8 sm:pt-8"
      >
          <div>
            {currentStepData.type === "text" ? (
              <TextArea
                rows={5}
                value={currentStepData.value}
                onChange={(e) => currentStepData.setValue(e.target.value)}
                placeholder={currentStepData.placeholder || ""}
                id={`step-${currentStepData.id}`}
                label={currentStepData.description}
              />
            ) : (
              <div>
                <span className="sr-only">{currentStepData.description}</span>
                <div
                  className="space-y-3"
                  role="radiogroup"
                  aria-label={currentStepData.description}
                >
                  {currentStepData.options?.map((option) => {
                    const checked = currentStepData.value === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all sm:p-4 ${
                          checked
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`step-${currentStepData.id}`}
                          value={option.value}
                          checked={checked}
                          onChange={(e) =>
                            currentStepData.setValue(e.target.value)
                          }
                          className="mt-1 h-4 w-4 shrink-0 border-gray-300 text-primary focus:ring-primary"
                        />
                        <span
                          className={`text-sm font-medium sm:text-base ${
                            checked ? "text-primary" : "text-gray-800"
                          }`}
                        >
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <CTA
              type="button"
              onClick={onPrevious}
              disabled={currentStep === 1}
              variant="formOutline"
              className="flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              Indietro
            </CTA>

            {currentStep < steps.length ? (
              <CTA
                type="button"
                onClick={onNext}
                variant="form"
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                Continua
                <ChevronRight className="h-4 w-4" />
              </CTA>
            ) : (
              <CTA
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(e as unknown as FormEvent<HTMLFormElement>);
                }}
                disabled={isLoading}
                variant="form"
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                {isLoading ? "Salvataggio in corso…" : "Salva le preferenze"}
              </CTA>
            )}
          </div>
      </form>
    </div>
  );
}
