import db from "@/utils/db";

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

  // Group preferences by userId
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

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <pre>{JSON.stringify(groupedData, null, 2)}</pre>
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
  );
};
