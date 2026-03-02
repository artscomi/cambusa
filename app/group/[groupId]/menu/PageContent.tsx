"use client";
import { ButtonGenerateMealList } from "./ButtonGenerateMealList";
import { useState, useTransition } from "react";
import { Loading } from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import { GroupInfo } from "@/types/types";
import { ToastError } from "@/components/ToastError";
import { ShareSection } from "@/components/ShareSection";
import { CookingPot, Heart, Sandwich, Users } from "lucide-react";
import React from "react";
import { MealList } from "@/types/types";
import { MealVoteStars } from "./MealVoteStars";

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
  votes,
}: {
  group: GroupInfo;
  preferences: GroupedPreference[];
  alcoholPreferences: GroupedPreference[];
  waterPreferences: GroupedPreference[];
  groupMealList?: MealList;
  votes?: { byKey: Record<string, { average: number; count: number; userVote?: number }> };
}) => {
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);

  const shareUrl = `${window.location.origin}/group/${group.groupId}/menu`;
  const copyLinkUrl = buildUrl(
    process.env.NEXT_PUBLIC_BASE_URL,
    `group/${group.groupId}/menu`
  );

  if (!user) return;
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
    {}
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
    {}
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
    {}
  );

  const userPreferences = groupedData[user.id] || {
    name: "Le tue preferenze",
    preferences: [],
  };
  const otherPreferences = Object.entries(groupedData).filter(
    ([userId]) => userId !== user.id
  );
  const userAlcoholPreferences = groupedAlcoholData[user.id] || {
    name: "Le tue preferenze sugli alcolici",
    preferences: [],
  };
  const otherAlcoholPreferences = Object.entries(groupedAlcoholData).filter(
    ([userId]) => userId !== user.id
  );
  const userWaterPreferences = groupedWaterData[user.id] || {
    name: "Le tue preferenze sugli acqua",
    preferences: [],
  };
  const otherWaterPreferences = Object.entries(groupedWaterData).filter(
    ([userId]) => userId !== user.id
  );

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

  return isPending ? (
    <Loading />
  ) : (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        Gruppo {group.groupName}
      </h1>

      <div className="bg-accent p-6 rounded-lg text-white mb-8 shadow-lg inline-block w-64">
        <h2 className="text-xl font-semibold mb-4 text-white">Info gruppo</h2>
        <ul className="flex flex-col gap-3 pl-2">
          <li className="flex items-center">
            <Users className="w-5 h-5 mr-3" />
            <span className="font-medium">{group.people} Persone</span>
          </li>
          <li className="flex items-center">
            <Sandwich className="w-5 h-5 mr-3" />
            <span className="font-medium">{group.lunch} Pranzi</span>
          </li>
          <li className="flex items-center">
            <CookingPot className="w-5 h-5 mr-3" />
            <span className="font-medium">{group.dinner} Cene</span>
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-primary">
        Preferenze alimentari del gruppo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="border-2 border-accent p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg mb-4 text-accent flex items-center">
            <Heart className="w-5 h-5 mr-2" strokeWidth={3} />
            Le tue preferenze
          </h3>
          <ul className="pl-5 space-y-2">
            {userPreferences.preferences.map((preference, index) => (
              <li key={index} className="text-gray-700 list-disc">
                {preference}
              </li>
            ))}
          </ul>
        </div>

        {otherPreferences.map(([userId, { name, preferences }]) => (
          <div
            key={userId}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
              {name}
              {userId === group.ownerId && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Group Owner
                </span>
              )}
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {preferences.map((preference, index) => (
                <li key={index} className="text-gray-700">
                  {preference}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Box preferenze alcoliche */}
      <h2 className="text-2xl font-bold mb-6 text-primary">
        Preferenze sugli alcolici del gruppo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="border-2 border-blue-400 p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg mb-4 text-blue-500 flex items-center">
            🍷 Le tue preferenze sugli alcolici
          </h3>
          <ul className="pl-5 space-y-2">
            {userAlcoholPreferences.preferences.map((preference, index) => (
              <li key={index} className="text-gray-700 list-disc">
                {preference}
              </li>
            ))}
          </ul>
        </div>
        {otherAlcoholPreferences.map(([userId, { name, preferences }]) => (
          <div
            key={userId}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg mb-4 text-blue-500 flex items-center gap-2">
              {name}
              {userId === group.ownerId && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Group Owner
                </span>
              )}
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {preferences.map((preference, index) => (
                <li key={index} className="text-gray-700">
                  {preference}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Box preferenze acqua */}
      <h2 className="text-2xl font-bold mb-6 text-primary">
        Preferenze sugli acqua del gruppo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="border-2 border-green-400 p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg mb-4 text-green-500 flex items-center">
            💧 Le tue preferenze sugli acqua
          </h3>
          <ul className="pl-5 space-y-2">
            {userWaterPreferences.preferences.map((preference, index) => (
              <li key={index} className="text-gray-700 list-disc">
                {preference}
              </li>
            ))}
          </ul>
        </div>
        {otherWaterPreferences.map(([userId, { name, preferences }]) => (
          <div
            key={userId}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg mb-4 text-green-500 flex items-center gap-2">
              {name}
              {userId === group.ownerId && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Group Owner
                </span>
              )}
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {preferences.map((preference, index) => (
                <li key={index} className="text-gray-700">
                  {preference}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Menu del gruppo con votazione */}
      {groupMealList && groupMealList.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-primary">
            Menu del gruppo
          </h2>
          <p className="text-gray-600 mb-6">
            Vota i pasti da 1 a 5 stelle. Ogni membro può dare un voto per pasto.
          </p>
          <div className="space-y-8 mb-10">
            {groupMealList.map((mealType) => (
              <div key={mealType.id}>
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  {mealType.mealTypeName}
                </h3>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {mealType.meals?.map((meal) => {
                    const voteKey = `${mealType.id}-${meal.id}`;
                    const voteData = votes?.byKey[voteKey];
                    return (
                      <div
                        key={meal.id}
                        className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                      >
                        <p className="font-medium text-lg text-primary mb-2">
                          {meal.mealName}
                        </p>
                        <ul className="space-y-2 mb-3">
                          {meal.dishes?.map((dish) => (
                            <li key={dish.id} className="text-gray-700 text-sm">
                              {dish.dishName}
                            </li>
                          ))}
                        </ul>
                        <MealVoteStars
                          groupId={group.groupId}
                          mealTypeId={mealType.id}
                          mealId={meal.id}
                          voteData={voteData}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Group Owner / Non Group Owner Section */}
      {group.isTheGroupOwner ? (
        <>
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <div className="flex flex-col justify-between items-center gap-4">
              <p className="text-lg text-center sm:text-left">
                Solo tu in quanto{" "}
                <strong className="text-primary">group owner</strong> puoi
                generare il menu 👨‍🍳
              </p>
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
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <ShareSection
              groupName={group.groupName}
              shareUrl={shareUrl}
              copyLinkUrl={copyLinkUrl}
              title="Condividi il link del gruppo"
            />
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-lg mb-2">
                Solo <strong className="text-primary">{group.ownerName}</strong>{" "}
                può generare la lista dei pasti.
              </p>
              <p className="text-gray-600 text-sm">
                Aspetta che il group owner generi il menu per vedere i pasti del
                gruppo 🍽️
              </p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
              <CookingPot className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      <ToastError error={error} setError={setError} />
    </div>
  );
};
