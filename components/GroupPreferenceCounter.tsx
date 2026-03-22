"use client";

import type { GroupPreferenceProgressStats } from "@/lib/getGroupPreferenceProgress";
import { cn } from "@/lib/utils";
import { Info, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CTA } from "@/components/CTA";
import { useMealContext } from "@/context/useMealContext";

function CounterInfoTooltip({
  text,
  narrow,
}: {
  text: string;
  /** Tooltip a tutta larghezza della card (colonne strette). */
  narrow?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="absolute right-3 top-3 z-20 sm:right-4 sm:top-4"
    >
      <button
        type="button"
        className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-white/80 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-expanded={open}
        {...(open ? { "aria-controls": tooltipId } : {})}
        aria-label="Informazioni su menu e votazione"
        onClick={() => setOpen((o) => !o)}
      >
        <Info className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
      </button>
      {open ? (
        <div
          id={tooltipId}
          role="tooltip"
          className={
            narrow
              ? "absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-gray-200 bg-white p-3 text-left text-xs leading-relaxed text-gray-700"
              : "absolute right-0 top-full z-30 mt-2 w-[min(calc(100vw-2rem),18.5rem)] rounded-xl border border-gray-200 bg-white p-3.5 text-left text-sm leading-relaxed text-gray-700"
          }
        >
          {text}
        </div>
      ) : null}
    </div>
  );
}

/** Per copy leggibile: 2→«due» … 10→«dieci»; altrimenti cifra. */
function numeroInLettere(n: number): string {
  const da2a10 = [
    "due",
    "tre",
    "quattro",
    "cinque",
    "sei",
    "sette",
    "otto",
    "nove",
    "dieci",
  ] as const;
  if (n >= 2 && n <= 10) return da2a10[n - 2];
  return String(n);
}

export type GroupPreferenceCounterProps = GroupPreferenceProgressStats & {
  /** Senza bordo “seconda card”: per header unificati (es. pagina menu gruppo). */
  embedded?: boolean;
  /** Numeri e barra più grandi (es. hero pagina menu). */
  prominent?: boolean;
  /** Testo nel tooltip (pulsante info in alto a destra). */
  infoTooltip?: string;
  /** Layout impilato per colonne strette (es. sidebar). */
  narrowColumn?: boolean;
  /** Chi sta guardando: se true, copy al 100% per chi può generare il menu. */
  viewerIsOwner?: boolean;
  /** Contenuto sotto il messaggio di avanzamento, dentro lo stesso box. */
  footer?: ReactNode;
  /** Stile accent (come box inviti) quando equipaggio al completo. */
  accentHighlight?: boolean;
  /** Menu del gruppo già salvato: copy e CTA verso «Il mio menu». */
  hasPublishedGroupMenu?: boolean;
  /** Per aprire «Il mio menu» con il gruppo già selezionato nel contesto. */
  groupId?: string;
};

export function GroupPreferenceCounter({
  completedCount,
  expectedCrew,
  missingCount,
  embedded = false,
  prominent = false,
  infoTooltip,
  narrowColumn = false,
  viewerIsOwner,
  footer,
  accentHighlight = false,
  hasPublishedGroupMenu = false,
  groupId,
}: GroupPreferenceCounterProps) {
  const router = useRouter();
  const { setCurrentGroupId } = useMealContext();

  const pct =
    expectedCrew > 0
      ? Math.min(100, Math.round((completedCount / expectedCrew) * 100))
      : 0;

  const showAccentShell =
    accentHighlight && pct >= 100 && expectedCrew > 0;

  const shellClass =
    embedded && prominent
      ? "rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/[0.2] via-primary/[0.09] to-white p-6 sm:p-8"
      : embedded
        ? narrowColumn
          ? showAccentShell
            ? "rounded-2xl border-2 border-accent-40 bg-gradient-to-br from-accent/18 via-white to-accent-light/25 p-4 shadow-[0_12px_40px_rgb(var(--accent-rgb),0.14)] sm:p-5"
            : "rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-gray-50/90 p-4"
          : "rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-gray-50/90 p-5 sm:p-6"
        : showAccentShell
          ? "rounded-2xl border-2 border-accent-40 bg-gradient-to-br from-accent/18 via-white to-accent-light/25 px-4 py-4 shadow-[0_12px_40px_rgb(var(--accent-rgb),0.14)] sm:px-5 sm:py-5"
          : "rounded-2xl border border-gray-200 bg-white px-4 py-4 sm:px-5 sm:py-4";

  const iconWrap =
    embedded && prominent
      ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-white text-primary"
      : embedded
        ? showAccentShell
          ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/35 bg-white/95 text-accent"
          : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-white/90 text-primary"
        : "";

  const fractionClass = prominent
    ? "tabular-nums text-4xl font-extrabold tracking-tight sm:text-5xl"
    : "tabular-nums text-2xl font-bold tracking-tight sm:text-[1.75rem]";

  const slashClass = prominent ? "mx-1 text-gray-300" : "mx-0.5 text-gray-300";

  const barHeight = prominent ? "h-4 sm:h-5" : "h-2.5";
  const barTrack =
    showAccentShell
      ? "border border-accent/25 bg-white/90"
      : embedded || prominent
        ? "border border-primary/15 bg-white/80"
        : "bg-gray-100";
  const barFillClass = showAccentShell
    ? "bg-accent"
    : "bg-primary";

  const isOrganizerContext = Boolean(infoTooltip);
  const showOwnerCompletionCopy = viewerIsOwner ?? isOrganizerContext;
  const suWord = numeroInLettere(expectedCrew);
  const showOrganizerNudge =
    isOrganizerContext &&
    expectedCrew > 0 &&
    pct < 100 &&
    completedCount > 0;
  const organizerNudgeFull =
    " Invitali a completare le preferenze, così potrai generare il menu per tutta la ciurma.";
  const organizerNudgeNarrow =
    " Invita chi manca a completarle: così generi il menu per tutta la ciurma.";
  const nudge =
    showOrganizerNudge && !narrowColumn
      ? organizerNudgeFull
      : showOrganizerNudge && narrowColumn
        ? organizerNudgeNarrow
        : "";

  let progressMessage = "";
  if (expectedCrew === 0) {
    progressMessage = narrowColumn
      ? "Imposta quante siete nel gruppo per vedere l’avanzamento."
      : "Imposta il numero di persone nel gruppo per vedere l’avanzamento.";
  } else if (pct >= 100) {
    if (hasPublishedGroupMenu) {
      progressMessage = showOwnerCompletionCopy
        ? "Il menu condiviso è stato generato. Su «Il mio menu» puoi rivedere le proposte, far votare la ciurma pasto per pasto e creare la lista della spesa quando tutti avranno votato."
        : "Il menu è stato pubblicato dall’organizzatore. Su «Il mio menu» (scegli il menu di questo gruppo) trovi le proposte, i voti e la lista della spesa.";
    } else {
      progressMessage = showOwnerCompletionCopy
        ? "Tutta la ciurma ha registrato le proprie preferenze alimentari! Da questo momento puoi generare il menu."
        : "Tutta la ciurma ha registrato le proprie preferenze alimentari! Da questo momento è possibile generare il menu: chiedi al referente del gruppo di generarlo.";
    }
  } else if (completedCount === 0) {
    if (isOrganizerContext) {
      progressMessage = narrowColumn
        ? "Nessuno ha ancora registrato preferenze. Condividi il link con la ciurma."
        : "Nessuno ha ancora registrato le proprie preferenze. Condividi il link con la ciurma.";
    } else {
      progressMessage = narrowColumn
        ? "Nessuna preferenza ricevuta finora."
        : "Ancora nessuno ha inviato le proprie preferenze alimentari.";
    }
  } else if (completedCount === 1) {
    if (isOrganizerContext) {
      progressMessage = narrowColumn
        ? `Una persona su ${suWord} ha registrato le preferenze.${nudge}`
        : `Una persona su ${suWord} ha registrato le proprie preferenze.${nudge}`;
    } else {
      progressMessage = narrowColumn
        ? `Una persona su ${suWord} ha finito.`
        : `Una persona su ${suWord} ha inviato le proprie preferenze alimentari.`;
    }
  } else {
    const n = completedCount;
    const chi =
      n >= 2 && n <= 10 ? `${numeroInLettere(n)} persone` : `${n} persone`;
    if (isOrganizerContext) {
      progressMessage = narrowColumn
        ? `${chi} su ${suWord} hanno registrato le preferenze.${nudge}`
        : `${chi} su ${suWord} hanno registrato le proprie preferenze.${nudge}`;
    } else {
      progressMessage = narrowColumn
        ? `${chi} su ${suWord} hanno finito.`
        : `${chi} su ${suWord} hanno inviato le proprie preferenze alimentari.`;
    }
  }

  return (
    <div
      className={cn(
        "relative",
        showAccentShell && "overflow-hidden",
        shellClass,
        infoTooltip && "pr-11 sm:pr-12",
      )}
      role="region"
      aria-label={`Preferenze completate da ${completedCount} persone su ${expectedCrew} previste`}
    >
      {showAccentShell ? (
        <>
          <div
            className="absolute inset-x-0 top-0 z-0 h-1.5 bg-gradient-to-r from-accent-light via-accent to-accent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-6 -top-6 z-0 h-24 w-24 rounded-full bg-accent/20 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 z-0 h-16 w-16 rounded-full bg-accent-light/30 blur-xl"
            aria-hidden
          />
        </>
      ) : null}
      {infoTooltip ? (
        <CounterInfoTooltip text={infoTooltip} narrow={narrowColumn} />
      ) : null}
      <div
        className={cn(showAccentShell && "relative z-10 min-w-0")}
      >
        <div
          className={
            narrowColumn
              ? "flex flex-col gap-3"
              : prominent
                ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                : "flex items-start justify-between gap-3"
          }
        >
        <div
          className={
            narrowColumn
              ? "flex min-w-0 items-start gap-3"
              : `flex min-w-0 items-start ${embedded ? "gap-3 sm:gap-4" : "gap-0"} ${prominent ? "w-full justify-center sm:w-auto sm:justify-start" : ""}`
          }
        >
          {embedded && (
            <span className={iconWrap}>
              <Users
                className={prominent ? "h-6 w-6" : "h-5 w-5"}
                strokeWidth={2}
                aria-hidden
              />
            </span>
          )}
          <div
            className={`min-w-0 flex-1 ${prominent ? "text-center sm:text-left" : ""}`}
          >
            {!narrowColumn ? (
              <p
                className={`font-semibold uppercase tracking-[0.18em] text-gray-600 ${prominent ? "text-xs sm:text-[0.7rem]" : "text-[11px]"}`}
              >
                Equipaggio
              </p>
            ) : null}
            <p
              className={`font-semibold text-gray-900 ${prominent ? "mt-1 text-base sm:mt-1 sm:text-lg" : narrowColumn ? "text-sm leading-snug" : "mt-1 text-sm"}`}
            >
              {narrowColumn ? "Preferenze raccolte" : "Preferenze completate"}
            </p>
            {embedded && missingCount > 0 && expectedCrew > 0 && (
              <p
                className={`mt-2 font-medium text-primary ${prominent ? "text-sm" : "text-xs"}`}
              >
                {missingCount === 1
                  ? "Manca ancora una persona"
                  : missingCount === 2
                    ? "Mancano ancora due persone"
                    : `Mancano ancora ${missingCount} persone`}
              </p>
            )}
          </div>
        </div>
        <p
          className={`tabular-nums ${fractionClass} ${prominent ? "w-full text-center sm:w-auto sm:text-right" : ""} ${narrowColumn ? "shrink-0 text-left" : "shrink-0"}`}
        >
          <span
            className={showAccentShell ? "text-accent" : "text-primary"}
          >
            {completedCount}
          </span>
          <span className={slashClass}>/</span>
          <span className="text-gray-800">{expectedCrew}</span>
        </p>
        </div>
        <div
          className={`mt-5 overflow-hidden rounded-full ${barHeight} ${barTrack}`}
          aria-hidden
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-500 ease-out",
              barFillClass,
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p
          className={`mt-4 font-medium text-gray-600 ${prominent ? "text-center text-sm sm:text-left sm:text-base" : narrowColumn ? "text-[11px] leading-relaxed" : "text-xs leading-relaxed sm:text-[0.8125rem]"}`}
        >
          {progressMessage}
        </p>
        {hasPublishedGroupMenu && pct >= 100 && groupId ? (
          <div
            className={`mt-4 min-w-0 ${narrowColumn ? "" : prominent ? "flex justify-center sm:justify-start" : ""}`}
          >
            <CTA
              variant="accent"
              type="button"
              className={narrowColumn ? "w-full" : "w-full sm:w-auto"}
              onClick={() => {
                setCurrentGroupId(groupId);
                router.push("/my-menu");
              }}
            >
              Vai a Il mio menu
            </CTA>
          </div>
        ) : null}
        {footer ? <div className="mt-4 min-w-0">{footer}</div> : null}
        {infoTooltip && !narrowColumn && pct >= 100 && !hasPublishedGroupMenu ? (
          <p
            className={`mt-4 border-t border-primary/20 pt-4 text-sm font-semibold leading-relaxed text-primary sm:text-base ${prominent ? "text-center sm:text-left" : ""}`}
          >
            Puoi generare il menu dalla sezione dedicata e far votare
            l&apos;equipaggio pasto per pasto.
          </p>
        ) : null}
      </div>
    </div>
  );
}
