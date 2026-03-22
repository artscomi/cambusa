"use client";
import { ButtonGenerateMealList } from "./ButtonGenerateMealList";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loading } from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import { GroupInfo } from "@/types/types";
import { ToastError } from "@/components/ToastError";
import { ShareSection } from "@/components/ShareSection";
import { GroupPreferenceCounter } from "@/components/GroupPreferenceCounter";
import type { GroupPreferenceProgressStats } from "@/lib/getGroupPreferenceProgress";
import {
  CookingPot,
  Heart,
  Sandwich,
  Sunrise,
  Users,
  Wine,
  Droplets,
} from "lucide-react";
import { MealList } from "@/types/types";
import { GroupNameHeading } from "../GroupNameHeading";
import { cn } from "@/lib/utils";
import { CTA } from "@/components/CTA";
import { useMealContext } from "@/context/useMealContext";

interface UserPreference {
  name: string;
  preferences: string[];
}

interface GroupedPreference {
  user: {
    name: string;
  };
  id: string;
  userId: string;
  groupId: string;
  preference: string;
}

// Helper function to build URLs without double slashes
const buildUrl = (baseUrl: string | undefined, path: string): string => {
  if (!baseUrl) return `https://www.cambusa-online.com/${path}`;
  const cleanBaseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  const cleanPath = path.replace(/^\//, ""); // Remove leading slash
  return `${cleanBaseUrl}/${cleanPath}`;
};

export const PageContent = ({
  group,
  preferences,
  alcoholPreferences,
  waterPreferences,
  groupMealList,
  preferenceProgress,
}: {
  group: GroupInfo;
  preferences: GroupedPreference[];
  alcoholPreferences: GroupedPreference[];
  waterPreferences: GroupedPreference[];
  groupMealList?: MealList;
  preferenceProgress: GroupPreferenceProgressStats;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setCurrentGroupId } = useMealContext();
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);

  const shareUrl = `${window.location.origin}/group/${group.groupId}/menu`;
  const copyLinkUrl = buildUrl(
    process.env.NEXT_PUBLIC_BASE_URL,
    `group/${group.groupId}/menu`,
  );

  const { completedCount, expectedCrew } = preferenceProgress;
  const allPreferencesComplete =
    expectedCrew > 0 && completedCount >= expectedCrew;
  const hasMenu = Boolean(groupMealList && groupMealList.length > 0);

  const sectionAnchor = "scroll-mt-28";

  if (!user) return null;
  const {
    breakfast = "0",
    lunch = "0",
    dinner = "0",
    people = "0",
    sameBreakfast = false,
  } = group;

  const groupedData = preferences.reduce(
    (acc: Record<string, UserPreference>, item: GroupedPreference) => {
      const { userId, preference, user } = item;

      if (!acc[userId]) {
        acc[userId] = {
          name: user.name,
          preferences: [],
        };
      }

      acc[userId].preferences.push(preference);
      return acc;
    },
    {},
  );

  const groupedAlcoholData = alcoholPreferences.reduce(
    (acc: Record<string, UserPreference>, item: GroupedPreference) => {
      const { userId, preference, user } = item;

      if (!acc[userId]) {
        acc[userId] = {
          name: user.name,
          preferences: [],
        };
      }

      acc[userId].preferences.push(preference);
      return acc;
    },
    {},
  );

  const groupedWaterData = waterPreferences.reduce(
    (acc: Record<string, UserPreference>, item: GroupedPreference) => {
      const { userId, preference, user } = item;

      if (!acc[userId]) {
        acc[userId] = {
          name: user.name,
          preferences: [],
        };
      }

      acc[userId].preferences.push(preference);
      return acc;
    },
    {},
  );

  const crewMemberIds = (() => {
    const ids = new Set<string>([
      user.id,
      ...Object.keys(groupedData),
      ...Object.keys(groupedAlcoholData),
      ...Object.keys(groupedWaterData),
    ]);
    return Array.from(ids).sort((a, b) => {
      if (a === user.id) return -1;
      if (b === user.id) return 1;
      const nameA =
        groupedData[a]?.name ??
        groupedAlcoholData[a]?.name ??
        groupedWaterData[a]?.name ??
        "";
      const nameB =
        groupedData[b]?.name ??
        groupedAlcoholData[b]?.name ??
        groupedWaterData[b]?.name ??
        "";
      return nameA.localeCompare(nameB, "it", { sensitivity: "base" });
    });
  })();

  const preferenceString = () => {
    return Object.entries(groupedData)
      .map(([userId, user]) => {
        const preferences = user.preferences.join(", ");
        return `L'utente di nome ${user.name} ha le seguenti preferenze: ${preferences}.`;
      })
      .join(" ");
  };

  const alcoholPreferenceString = () => {
    return Object.entries(groupedAlcoholData)
      .map(([userId, user]) => {
        const preferences = user.preferences.join(", ");
        return `L'utente di nome ${user.name} ha le seguenti preferenze sugli alcolici: ${preferences}.`;
      })
      .join(" ");
  };

  const waterPreferenceString = () => {
    return Object.entries(groupedWaterData)
      .map(([userId, user]) => {
        const preferences = user.preferences.join(", ");
        return `L'utente di nome ${user.name} ha le seguenti preferenze sugli acqua: ${preferences}.`;
      })
      .join(" ");
  };

  const sectionShell = "space-y-6 sm:space-y-7";
  const sectionOverline =
    "font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-primary/75";
  const sectionTitleClass =
    "font-display text-xl font-bold text-primary sm:text-2xl";
  const sectionLead =
    "mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-[0.95rem]";
  const cardClass = "rounded-2xl border border-gray-200 bg-white p-5 sm:p-6";
  const PrefList = ({
    items,
    emptyLabel,
  }: {
    items: string[];
    emptyLabel: string;
  }) =>
    items.length > 0 ? (
      <ul className="space-y-2.5 border-l-2 border-primary/20 pl-4">
        {items.map((preference, index) => (
          <li
            key={index}
            className="text-sm leading-relaxed text-gray-700 sm:text-[0.95rem]"
          >
            {preference}
          </li>
        ))}
      </ul>
    ) : (
      <p className="rounded-xl border border-dashed border-gray-200/90 bg-gray-50/90 px-3 py-3.5 text-sm text-gray-500">
        {emptyLabel}
      </p>
    );

  const CrewPrefColumn = ({
    icon: Icon,
    title,
    items,
    emptyLabel,
  }: {
    icon: typeof Heart;
    title: string;
    items: string[];
    emptyLabel: string;
  }) => (
    <div className="min-w-0">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
          <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
          {title}
        </span>
      </div>
      <PrefList items={items} emptyLabel={emptyLabel} />
    </div>
  );

  return isPending ? (
    <Loading />
  ) : (
    <div className="w-full overflow-x-hidden">
      <header className="border-b border-gray-100 pb-3 mb-4 sm:pb-4 sm:mb-5">
        <div className="text-center sm:text-left">
          {!group.isTheGroupOwner ? (
            <p className="font-subtitle text-[10px] font-bold uppercase tracking-[0.22em] text-primary/70">
              Pagina gruppo
            </p>
          ) : null}
          <GroupNameHeading
            groupId={group.groupId}
            initialName={group.groupName}
            ownerClerkId={group.ownerId}
            layout="menu"
            titleClassName={cn(
              "font-display text-2xl font-bold leading-tight text-primary sm:text-3xl md:text-4xl",
              !group.isTheGroupOwner && "mt-2",
            )}
          />
        </div>

        <div className="mt-8 flex min-w-0 flex-col gap-8 lg:mt-10 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
          <div className="flex min-w-0 flex-1 flex-col gap-6 sm:gap-8">
            <p className={`${sectionLead} mx-auto sm:mx-0`}>
              {group.isTheGroupOwner
                ? allPreferencesComplete
                  ? "Tutto l’equipaggio ha completato le preferenze: da qui generi il menu; pasti e voti si gestiscono da «Il mio menu»."
                  : "Controlli chi ha già inviato le preferenze, condividi il link con chi manca e, quando siete al completo, generi il menu da qui. Poi tutti aprono «Il mio menu» per vedere le proposte e votare."
                : `Organizzazione a cura di ${group.ownerName}. Le preferenze restano in questa pagina; menu e voti sono in «Il mio menu».`}
            </p>

            <section
              aria-labelledby="group-info-heading"
              className={`space-y-6 sm:space-y-7 ${sectionAnchor}`}
            >
              <p id="group-info-heading" className={sectionOverline}>
                Panoramica
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                  {
                    icon: Users,
                    label: "Persone",
                    value: String(group.people),
                  },
                  {
                    icon: Sunrise,
                    label: "Colazioni",
                    value: String(group.breakfast ?? "0"),
                  },
                  {
                    icon: Sandwich,
                    label: "Pranzi",
                    value: String(group.lunch),
                  },
                  {
                    icon: CookingPot,
                    label: "Cene",
                    value: String(group.dinner),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
                  >
                    <Icon
                      className="h-5 w-5 text-primary"
                      aria-hidden
                      strokeWidth={2}
                    />
                    <p className="mt-3 text-2xl font-bold tabular-nums text-gray-900">
                      {value}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <div
            className={`flex w-full min-w-0 shrink-0 flex-col gap-6 lg:max-w-[min(100%,380px)] lg:self-stretch xl:max-w-[420px] ${sectionAnchor}`}
          >
            {group.isTheGroupOwner && !allPreferencesComplete ? (
              <section
                id="invita-equipaggio"
                aria-labelledby="invita-equipaggio-heading"
                className="w-full min-w-0"
              >
                <div className="relative min-w-0 overflow-hidden rounded-2xl border-2 border-accent-40 bg-gradient-to-br from-accent/18 via-white to-accent-light/25 p-4 shadow-[0_12px_40px_rgb(var(--accent-rgb),0.14)] sm:p-5 lg:p-5">
                  <div
                    className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent-light via-accent to-accent"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/20 blur-2xl"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute bottom-0 left-0 h-16 w-16 rounded-full bg-accent-light/30 blur-xl"
                    aria-hidden
                  />
                  <div className="relative min-w-0">
                    <ShareSection
                      headingId="invita-equipaggio-heading"
                      variant="dashboard"
                      groupName={group.groupName}
                      shareUrl={shareUrl}
                      copyLinkUrl={copyLinkUrl}
                      title="Porta tutti a bordo"
                      description="Invita i tuoi compagni di viaggio a completare le proprie preferenze alimentari: così potrai generare il menu per tutto l'equipaggio!"
                    />
                  </div>
                </div>
              </section>
            ) : null}
            <GroupPreferenceCounter
              {...preferenceProgress}
              embedded
              narrowColumn
              accentHighlight={allPreferencesComplete}
              viewerIsOwner={group.isTheGroupOwner}
              hasPublishedGroupMenu={hasMenu}
              groupId={group.groupId}
              infoTooltip={
                group.isTheGroupOwner
                  ? hasMenu
                    ? "Puoi rigenerare il menu con il pulsante qui sotto (i voti esistenti potrebbero non corrispondere più ai nuovi pasti). Poi tutti usano «Il mio menu» per votare."
                    : "Quando il contatore indica che tutti hanno inviato le preferenze, usa il pulsante Genera il menu qui sotto. Dopo la pubblicazione, ogni membro apre «Il mio menu» per vedere i pasti e votare."
                  : undefined
              }
              footer={
                group.isTheGroupOwner && allPreferencesComplete ? (
                  <div className="flex justify-center lg:justify-start">
                    <ButtonGenerateMealList
                      setError={setError}
                      startTransition={startTransition}
                      userId={user.id}
                      dietaryPreferences={preferenceString()}
                      alcoholPreferences={alcoholPreferenceString()}
                      waterPreference={waterPreferenceString()}
                      groupMeals={{
                        breakfast,
                        lunch,
                        dinner,
                        people,
                        sameBreakfast,
                      }}
                      groupAlcoholPreferences={alcoholPreferences}
                      groupId={group.groupId}
                      regenerate={hasMenu}
                    />
                  </div>
                ) : undefined
              }
            />
          </div>
        </div>

        <div
          className={`mt-8 min-w-0 border-t border-gray-100 pt-8 text-center sm:mt-10 sm:pt-10 sm:text-left ${sectionAnchor}`}
        >
          <h2
            id="crew-preferences-heading"
            className="font-display text-xl font-bold leading-tight text-primary sm:text-2xl md:text-3xl"
          >
            Preferenze dell&apos;equipaggio
          </h2>
          <span
            className="mx-auto mt-3 block h-1.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary/55 sm:mx-0 sm:mt-3.5 sm:w-20"
            aria-hidden
          />
        </div>
      </header>

      <div className="flex flex-col gap-8 lg:gap-10">
        <main className="min-w-0 space-y-14 sm:space-y-16 lg:space-y-20">
          <section
            aria-labelledby="crew-preferences-heading"
            className={sectionShell}
          >
            <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {crewMemberIds.map((memberId) => {
                const isYou = memberId === user.id;
                const displayName =
                  groupedData[memberId]?.name ??
                  groupedAlcoholData[memberId]?.name ??
                  groupedWaterData[memberId]?.name ??
                  "Membro";
                const foodPrefs = groupedData[memberId]?.preferences ?? [];
                const alcoholPrefs =
                  groupedAlcoholData[memberId]?.preferences ?? [];
                const waterPrefs =
                  groupedWaterData[memberId]?.preferences ?? [];
                return (
                  <article
                    key={memberId}
                    className={`px-5 py-6 sm:px-7 sm:py-7 ${isYou ? "bg-primary/[0.04]" : ""}`}
                  >
                    <h3 className="mb-5 text-lg font-bold text-gray-900">
                      {isYou ? (
                        <span className="text-primary">Tu</span>
                      ) : (
                        displayName
                      )}
                    </h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6">
                      <CrewPrefColumn
                        icon={Heart}
                        title="Cibo"
                        items={foodPrefs}
                        emptyLabel={
                          isYou
                            ? "Non hai ancora indicato nulla sul cibo."
                            : "Nessuna nota sul cibo."
                        }
                      />
                      <CrewPrefColumn
                        icon={Wine}
                        title="Alcolici"
                        items={alcoholPrefs}
                        emptyLabel={
                          isYou
                            ? "Non hai ancora indicato nulla sugli alcolici."
                            : "Nessuna nota sugli alcolici."
                        }
                      />
                      <CrewPrefColumn
                        icon={Droplets}
                        title="Acqua"
                        items={waterPrefs}
                        emptyLabel={
                          isYou
                            ? "Non hai ancora indicato nulla sull&apos;acqua."
                            : "Nessuna nota sull&apos;acqua."
                        }
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {(hasMenu || !group.isTheGroupOwner) && (
            <div
              className={`space-y-12 border-t border-gray-200/90 pt-12 sm:space-y-14 sm:pt-14 lg:space-y-16 lg:pt-16 ${sectionAnchor}`}
            >
              <div className="max-w-2xl">
                {hasMenu ? (
                  <p className={sectionOverline}>Dalle preferenze al menu</p>
                ) : null}
                <h2
                  className={`${sectionTitleClass} ${hasMenu ? "mt-2" : ""}`}
                >
                  {hasMenu ? "Menu e voti su «Il mio menu»" : "Menu in arrivo"}
                </h2>
                <p className={sectionLead}>
                  {hasMenu
                    ? "Qui restano preferenze e organizzazione del gruppo. Per vedere colazioni, pranzi e cene e dare da 1 a 5 stelle a ogni pasto, apri «Il mio menu» e seleziona questo gruppo se ti viene chiesto."
                    : `Quando ${group.ownerName} pubblicherà la lista pasti, la troverai in «Il mio menu» (scegli il menu del gruppo) e potrai votare ogni proposta.`}
                </p>
              </div>

              {hasMenu ? (
                <section
                  id="group-menu-my-menu"
                  aria-labelledby="group-menu-my-menu-heading"
                  className={sectionShell}
                >
                  <h3 id="group-menu-my-menu-heading" className="sr-only">
                    Apri Il mio menu per il menu del gruppo
                  </h3>
                  <div
                    className={`${cardClass} flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8`}
                  >
                    <div className="min-w-0 sm:flex-1">
                      <p className="text-base font-semibold text-gray-900 sm:text-lg">
                        Il menu non è più elencato in questa pagina
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[0.95rem]">
                        Su «Il mio menu» vedi le proposte, voti quando vuoi (un
                        voto a persona per pasto) e, quando tutta la ciurma ha
                        finito, puoi generare la lista della spesa da lì.
                      </p>
                    </div>
                    <CTA
                      variant="accent"
                      type="button"
                      className="w-full shrink-0 sm:w-auto"
                      onClick={() => {
                        setCurrentGroupId(group.groupId);
                        router.push("/my-menu");
                      }}
                    >
                      Vai a Il mio menu
                    </CTA>
                  </div>
                </section>
              ) : (
                <section
                  id="member-menu-waiting"
                  aria-labelledby="member-menu-waiting-heading"
                  className={sectionShell}
                >
                  <h3 id="member-menu-waiting-heading" className="sr-only">
                    Stato menu e referente gruppo
                  </h3>
                  <div
                    className={`${cardClass} flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8`}
                  >
                    <div className="text-center sm:min-w-0 sm:flex-1 sm:text-left">
                      <p className="text-base font-semibold text-gray-900 sm:text-lg">
                        Referente:{" "}
                        <span className="text-primary">{group.ownerName}</span>
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        Non serve fare altro qui finché il menu non è
                        pubblicato. Quando sarà pronto, apri «Il mio menu» e
                        scegli il menu di questo gruppo per vedere i pasti e
                        votare.
                      </p>
                    </div>
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100">
                      <CookingPot
                        className="h-8 w-8 text-gray-400"
                        aria-hidden
                      />
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      <ToastError error={error} setError={setError} />
    </div>
  );
};
