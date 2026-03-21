import { NextPage } from "next";
import React from "react";
import { PageContent } from "./pageContent";
import { currentUser } from "@clerk/nextjs/server";
import { getGroupInfo } from "@/app/api/actions";
import { Anchor, UserRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getGroupPreferenceProgress } from "@/lib/getGroupPreferenceProgress";
import { PageContainer } from "@/components/PageContainer";
import { GroupPreferenceCounter } from "@/components/GroupPreferenceCounter";
import { GroupNameHeading } from "./GroupNameHeading";

const GroupPage: NextPage<{
  params: { groupId: string };
}> = async ({ params }) => {
  const { groupId } = params;
  const user = await currentUser();
  const group = await getGroupInfo(groupId);
  const isTheGroupOwner = group?.isTheGroupOwner;
  if (!user || !group) return null;

  // Fetch existing user preferences for this group + stats for whole equipaggio
  const [
    existingFoodPreferences,
    existingAlcoholPreferences,
    existingWaterPreferences,
    groupMenu,
    preferenceProgress,
  ] = await Promise.all([
    prisma.foodPreference.findMany({
      where: {
        groupId: groupId,
        userId: user.id,
      },
    }),
    prisma.alcoholPreference.findMany({
      where: {
        groupId: groupId,
        userId: user.id,
      },
    }),
    prisma.waterPreference.findMany({
      where: {
        groupId: groupId,
        userId: user.id,
      },
    }),
    prisma.group.findUnique({
      where: { id: groupId },
      select: { mealList: true },
    }),
    getGroupPreferenceProgress(groupId, group.people),
  ]);

  const hasExistingPreferences =
    existingFoodPreferences.length > 0 ||
    existingAlcoholPreferences.length > 0 ||
    existingWaterPreferences.length > 0;

  const invitedGuestHiName =
    user.firstName?.trim() ||
    user.fullName?.trim().split(/\s+/)[0] ||
    null;

  const crewPreferencesComplete =
    preferenceProgress.expectedCrew > 0 &&
    preferenceProgress.completedCount >= preferenceProgress.expectedCrew;

  let hasGeneratedMenu = false;
  try {
    const raw = groupMenu?.mealList;
    if (raw && raw !== "[]" && raw !== "null") {
      const parsed = JSON.parse(raw);
      hasGeneratedMenu = Array.isArray(parsed) ? parsed.length > 0 : !!parsed;
    }
  } catch {
    // ignore parse errors; treat as not generated
  }

  return (
    <PageContainer narrow className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 -top-8 h-72 rounded-[40%] bg-primary/[0.08] blur-3xl"
        aria-hidden
      />

      <div className="relative w-full space-y-8 sm:space-y-10">
        <header className="w-full text-center">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-b from-white via-white to-gray-50/60">
            <div
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/60"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/[0.06] blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/[0.05] blur-2xl"
              aria-hidden
            />

            <div className="relative px-5 pb-8 pt-9 sm:px-10 sm:pb-10 sm:pt-11">
              <GroupNameHeading
                groupId={groupId}
                initialName={group.groupName}
                ownerClerkId={group.ownerId}
                layout="preferences"
                titleClassName="text-center font-display text-[1.65rem] font-bold leading-[1.12] tracking-tight text-primary sm:text-4xl md:text-[2.35rem]"
              />

              {isTheGroupOwner ? (
                <>
                  <p className="mt-3 text-center text-sm font-medium text-gray-600 sm:text-base">
                    Hai creato questo gruppo
                  </p>

                  <div className="mb-6 mt-6 flex flex-col items-center gap-4 sm:mb-7 sm:mt-7">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/[0.07] px-3.5 py-1.5 font-subtitle text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
                      <Anchor
                        className="h-3.5 w-3.5 opacity-80"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      Il tuo gruppo
                    </span>

                    <div className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-4 py-2.5">
                      <UserRound
                        className="h-4 w-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <p className="text-sm font-semibold text-gray-800">
                        Ciao, {user.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col gap-4 sm:mt-8 lg:flex-row lg:items-stretch lg:gap-5">
                    <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left sm:px-5 sm:py-5">
                      {!hasExistingPreferences && (
                        <p className="text-sm leading-relaxed text-gray-600 sm:text-[0.95rem]">
                          Compila i tre passaggi qui sotto, poi condividi il link
                          con l&apos;equipaggio: così ognuno aggiunge le sue
                          preferenze.
                        </p>
                      )}

                      {hasExistingPreferences && (
                        <p className="text-sm leading-relaxed text-gray-600 sm:text-[0.95rem]">
                          Le tue preferenze sono già salvate. Accanto vedi quante
                          persone hanno finito; dalla pagina gruppo puoi generare
                          il menu quando sei pronto/a.
                        </p>
                      )}
                    </div>
                    <div className="w-full shrink-0 lg:w-[min(100%,17.5rem)] xl:w-[19rem]">
                      <GroupPreferenceCounter
                        {...preferenceProgress}
                        accentHighlight={crewPreferencesComplete}
                        viewerIsOwner={isTheGroupOwner}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 flex flex-col gap-4 sm:mt-7 lg:flex-row lg:items-stretch lg:gap-5">
                  <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left sm:px-5 sm:py-5">
                    <p className="text-sm leading-relaxed text-gray-700 sm:text-[0.95rem]">
                      {invitedGuestHiName ? (
                        <>
                          Ciao {invitedGuestHiName}
                          {". "}
                        </>
                      ) : null}
                      <span className="font-semibold text-primary">
                        {group.ownerName}
                      </span>
                      {" ti ha invitato al gruppo: "}
                      <span className="font-semibold text-gray-900">
                        {group.groupName}
                      </span>
                      {". Compila le tue preferenze alimentari per generare un menu condiviso che possa accontentare tutta la ciurma!"}
                    </p>
                  </div>
                  <div className="w-full shrink-0 lg:w-[min(100%,17.5rem)] xl:w-[19rem]">
                    <GroupPreferenceCounter
                      {...preferenceProgress}
                      accentHighlight={crewPreferencesComplete}
                      viewerIsOwner={isTheGroupOwner}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <PageContent
          groupId={groupId}
          group={group}
          hasExistingPreferences={hasExistingPreferences}
          hasGeneratedMenu={hasGeneratedMenu}
          existingPreferences={{
            food: existingFoodPreferences,
            alcohol: existingAlcoholPreferences,
            water: existingWaterPreferences,
          }}
        />
      </div>
    </PageContainer>
  );
};

export default GroupPage;
