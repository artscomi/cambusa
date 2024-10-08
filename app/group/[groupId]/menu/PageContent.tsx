"use client";
import { ButtonGenerateMealList } from "./ButtonGenerateMealList";
import { useState, useTransition } from "react";
import { Loading } from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import { GroupInfo } from "@/types/types";
import { ToastError } from "@/components/ToastError";
import { CookingPot, Heart, Sandwich, Users } from "lucide-react";

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

export const PageContent = ({
  group,
  preferences,
}: {
  group: GroupInfo;
  preferences: GroupedPreference[];
}) => {
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);
  if (!user) return;
  const { lunch = "0", dinner = "0", people = "0" } = group;

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

  const userPreferences = groupedData[user.id] || {
    name: "Le tue preferenze",
    preferences: [],
  };
  const otherPreferences = Object.entries(groupedData).filter(
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

  return isPending ? (
    <Loading />
  ) : (
    <div className="container mx-auto p-4">
      <h1 className="mb-8">Gruppo {group.groupName}</h1>

      <div className="bg-accent p-6 rounded-lg text-white mb-8 shadow-lg inline-block w-60">
        <h2 className="text-l font-semibold mb-4">Info gruppo</h2>
        <ul className="flex flex-col gap-1 pl-2">
          <li>
            <Users className="inline-block mr-2 align-sub" />
            <span className="font-medium">{group.people} Persone</span>
          </li>
          <li>
            <Sandwich className="inline-block mr-2 align-sub" />
            <span className="font-medium">{group.lunch} Pranzi</span>
          </li>
          <li>
            <CookingPot className="inline-block mr-2 align-sub" />
            <span className="font-medium">{group.dinner} Cene</span>
          </li>
        </ul>
      </div>

      <h2 className="mb-4 text-primary text-xl font-bold">
        Preferenze alimentari del gruppo
      </h2>
      <div className="flex flex-wrap gap-5 mb-8">
        <div className="border-2 border-accent p-6 rounded-lg shadow-md w-64 bg-white">
          <h3 className="font-bold text-lg mb-2 text-accent">
            Le tue preferenze
          </h3>
          <ul className="pl-2">
            {userPreferences.preferences.map((preference, index) => (
              <li key={index} className="text-gray-700">
                <Heart className="inline-block mr-2 align-sub text-accent" strokeWidth={3}/> {preference}
              </li>
            ))}
          </ul>
        </div>

        {otherPreferences.map(([userId, { name, preferences }]) => (
          <div key={userId} className="bg-white p-6 rounded-lg shadow-md w-64">
            <h3 className="font-bold text-lg mb-2">{name}</h3>
            <ul className="list-disc pl-5">
              {preferences.map((preference, index) => (
                <li key={index} className="text-gray-700">
                  {preference}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {group.isTheGroupOwner && (
        <div className="text-center">
          <ButtonGenerateMealList
            setError={setError}
            startTransition={startTransition}
            userId={user.id}
            dietaryPreferences={preferenceString()}
            groupMeals={{ lunch, dinner, people }}
          />
        </div>
      )}

      <ToastError error={error} setError={setError} />
    </div>
  );
};
