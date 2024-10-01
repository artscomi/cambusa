import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { ButtonGenerateMealList } from "./ButtonGenerateMealList";
import { getGroupInfo } from "@/app/api/actions";

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

export const PageContent = async ({ groupId }: { groupId: string }) => {
  const user = await currentUser();
  if (!user) return;

  const group = await getGroupInfo(groupId);
  if (!group) {
    console.error(`Group not found for groupId: ${groupId} on Group page.`);
    return;
  }
  const { lunch = "0", dinner = "0" } = group;

  const getPreferences = async () => {
    const data = await db.foodPreference.findMany({
      where: {
        groupId: groupId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return data;
  };

  const preferences = await getPreferences();

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8">
        Gruppo {group.groupName}
      </h1>

      <div className="bg-accent p-6 rounded-lg text-white mb-8 shadow-lg inline-block">
        <h2 className="text-xl font-semibold mb-2">Info gruppo</h2>
        <ul className="list-disc pl-5">
          <li>
            Numero di persone:{" "}
            <span className="font-medium">{group.people}</span>
          </li>
          <li>
            Numero di cene: <span className="font-medium">{group.dinner}</span>
          </li>
          <li>
            Numero di pranzi: <span className="font-medium">{group.lunch}</span>
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
          <ul className="list-disc pl-5">
            {userPreferences.preferences.map((preference, index) => (
              <li key={index} className="text-gray-700">
                {preference}
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
            userId={user.id}
            dietaryPreferences={preferenceString()}
            groupMeals={{ lunch, dinner }}
          />
        </div>
      )}
    </div>
  );
};
