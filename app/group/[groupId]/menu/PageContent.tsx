import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { ButtonGenerateMealList } from "./ButtonGenerateMealList";

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

  const PreferencesInfo: React.FC = () => {
    return (
      <div>
        {Object.entries(groupedData).map(([userId, user]) => {
          const preferences = user.preferences.join(", ");
          return (
            <p key={userId} className="mb-5">
              {`L'utente di nome ${user.name} ha le seguenti preferenze: ${preferences}.`}
            </p>
          );
        })}
      </div>
    );
  };

  const preferenceString = () => {
    return Object.entries(groupedData)
      .map(([userId, user]) => {
        const preferences = user.preferences.join(", ");
        return `L'utente di nome ${user.name} ha le seguenti preferenze: ${preferences}.`;
      })
      .join(" ");
  };

  return (
    <>
      {/* <PreferencesInfo /> */}
      <div className="flex gap-5">
        {Object.entries(groupedData).map(([userId, { name, preferences }]) => (
          <div
            key={userId}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              borderRadius: "8px",
              width: "200px",
            }}
          >
            <h3>{name}</h3>
            <ul>
              {preferences.map((preference, index) => (
                <li key={index}>{preference}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ButtonGenerateMealList
        userId={user.id}
        dietaryPreferences={preferenceString()}
      />
    </>
  );
};
