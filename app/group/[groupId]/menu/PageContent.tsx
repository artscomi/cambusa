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
  const { breakfast = "0", lunch = "0", dinner = "0", people = "0" } = group;

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
      <div className="flex flex-wrap gap-6 mb-10">
        <div className="border-2 border-accent p-6 rounded-lg shadow-md w-72 bg-white hover:shadow-lg transition-shadow">
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
            className="bg-white p-6 rounded-lg shadow-md w-72 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg mb-4 text-primary">{name}</h3>
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

      {group.isTheGroupOwner ? (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
              groupMeals={{ breakfast, lunch, dinner, people }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg text-center sm:text-left">
            Solo {group.ownerName} può generare la lista dei pasti.
          </p>
        </div>
      )}

      <ToastError error={error} setError={setError} />
    </div>
  );
};
