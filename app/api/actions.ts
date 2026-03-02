"use server";

import db from "@/utils/db";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GroupInfo, Meal, MealList } from "@/types/types";
import {
  generateObject,
  streamObject,
  JSONParseError,
  TypeValidationError,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { getMainPrompt, getRegenerateMealPrompt } from "@/utils/getPrompt";
import { mealMenuSchema, mealSchema } from "./schemas/meal-menu";
import { FormState } from "@/hooks/useFormConfig";
import { fakeOpenAiCall } from "@/utils/mockMealList";
import {
  UNLIMITED_API_CALLS,
  PAID_TIER_API_CALLS,
  FREE_TIER_API_CALLS,
  UNLIMITED_USERS,
} from "@/utils/constants";

export const getUserInfo = async (userId: string) => {
  if (!userId) {
    return {
      apiCallCount: 0,
      hasPaidForIncrease: false,
      name: "",
    };
  }

  console.log("🔍 Looking up user in database with clerkUserId:", userId);
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      apiCallCount: true,
      hasPaidForIncrease: true,
      name: true,
    },
  });

  if (!user) {
    return {
      apiCallCount: 0,
      hasPaidForIncrease: false,
      name: "",
    };
  }

  console.log("✅ User found:", {
    apiCallCount: user.apiCallCount,
    hasPaidForIncrease: user.hasPaidForIncrease,
    name: user.name,
  });
  return {
    apiCallCount: user.apiCallCount,
    hasPaidForIncrease: user.hasPaidForIncrease,
    name: user.name,
  };
};

export const getUserGroups = async (userId: string) => {
  if (!userId) {
    return {};
  }
  const groupMembership = await db.groupMembership.findMany({
    where: {
      userId: userId,
    },
    include: {
      group: true,
    },
  });

  return {
    group: groupMembership,
  };
};

export const regenerateSingleMeal = async ({
  dietaryPreferences,
  userId,
  meal,
}: {
  dietaryPreferences: string;
  userId: string;
  meal: Meal;
}): Promise<
  | { type: "success"; meal: Meal }
  | { type: "parse-error"; text: string }
  | { type: "validation-error"; value: unknown }
  | { type: "unknown-error"; error: unknown }
  | { type: "user-not-found"; error: string }
> => {
  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        apiCallCount: true,
      },
    });

    if (!user) {
      return {
        type: "user-not-found",
        error: "User not found",
      };
    }

    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      prompt: getRegenerateMealPrompt({ dietaryPreferences, meal }),
      schema: mealSchema,
    });

    await db.user.update({
      where: { id: user.id },
      data: {
        apiCallCount: user.apiCallCount + 1,
        lastApiCall: new Date(),
      },
    });

    // Log prompts and result
    console.log(
      "prompt",
      getRegenerateMealPrompt({ dietaryPreferences, meal }),
    );
    console.log("result", result.object);
    console.log("api call", user.apiCallCount);

    revalidatePath("/meal-menu", "layout");
    return { type: "success", meal: result.object };
  } catch (e) {
    if (TypeValidationError.isInstance(e)) {
      return { type: "validation-error", value: e.value };
    } else if (JSONParseError.isInstance(e)) {
      return { type: "parse-error", text: e.text };
    } else {
      return { type: "unknown-error", error: e };
    }
  }
};

export const resetApiCallCount = async (userId: string) => {
  if (!userId) {
    throw new Error("Missing userId");
  }

  try {
    await db.user.update({
      where: { clerkUserId: userId },
      data: { apiCallCount: 0, hasPaidForIncrease: true },
    });
  } catch (error) {
    console.error("Error resetting API call count:", error);
    throw new Error("Failed to reset API call count");
  }
  revalidatePath("/meal-menu", "layout");
};

export const getMealListFromAi = async ({
  formValues,
  userId,
}: {
  formValues: FormState;
  userId: string;
}): Promise<
  | { type: "success"; menu: MealList }
  | { type: "parse-error"; text: string }
  | { type: "validation-error"; value: unknown }
  | { type: "unknown-error"; error: unknown }
  | { type: "user-not-found"; error: string }
> => {
  try {
    const result =
      process.env.NODE_ENV === "development"
        ? await fakeOpenAiCall()
        : await generateObject({
            model: openai("gpt-4o"),
            prompt: getMainPrompt(formValues),
            schema: mealMenuSchema,
          });

    revalidatePath("/meal-menu", "layout");

    console.log("👤 Looking up user with clerkUserId:", userId);
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        apiCallCount: true,
      },
    });

    if (!user) {
      return {
        type: "user-not-found",
        error: "User not found",
      };
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        apiCallCount: user.apiCallCount + 1,
        lastApiCall: new Date(),
      },
    });

    // Return success response
    return {
      type: "success",
      menu: JSON.parse(JSON.stringify(result.object.menu)),
    };
  } catch (e) {
    if (TypeValidationError.isInstance(e)) {
      console.error(JSON.stringify(e.value, null, 2));
      return { type: "validation-error", value: e.value };
    } else if (JSONParseError.isInstance(e)) {
      return { type: "parse-error", text: e.text };
    } else {
      return { type: "unknown-error", error: e };
    }
  } finally {
    console.log("end");
  }
};

export const saveUser = async () => {
  console.log("💾 saveUser function called");
  const user = await currentUser();
  if (!user) {
    console.error("❌ user not found in SaveUser");
    return;
  }
  const { firstName, primaryEmailAddress, id } = user;
  console.log("👤 User data:", {
    firstName,
    email: primaryEmailAddress?.emailAddress,
    id,
  });

  try {
    console.log("💾 Attempting to upsert user with clerkUserId:", id);
    const result = await db.user.upsert({
      where: { clerkUserId: id },
      update: {
        name: firstName ?? "",
        email: primaryEmailAddress?.emailAddress ?? "",
      },
      create: {
        name: firstName ?? "",
        email: primaryEmailAddress?.emailAddress ?? "",
        clerkUserId: id,
        mealList: "",
      },
    });
    console.log("✅ User saved/updated successfully:", result);
  } catch (error) {
    console.error("❌ Error saving/updating user in database:", error);
  }
};

export const createGroupAction = async (formData: FormData) => {
  const user = await currentUser();
  if (!user) {
    console.error("user not found in CreateGroup");
    return null;
  }

  const rawFormdata = {
    groupPeople: formData.get("people") as string,
    groupName: formData.get("groupName") as string,
    groupBreakfast: formData.get("breakfast") as string,
    groupLunch: formData.get("lunch") as string,
    groupDinner: formData.get("dinner") as string,
    dietaryPreferences: formData.get("dietaryPreferences") as string,
    alcoholPreferences: formData.get("alcoholPreferences") as string,
    waterPreference: formData.get("waterPreference") as string,
    sameBreakfast: formData.get("sameBreakfast") === "on",
  };

  try {
    // Assicurati che l'utente esista nel DB (Group.ownerId referenzia User.clerkUserId)
    await db.user.upsert({
      where: { clerkUserId: user.id },
      update: {
        name: user.firstName ?? "",
        email: user.primaryEmailAddress?.emailAddress ?? "",
      },
      create: {
        clerkUserId: user.id,
        name: user.firstName ?? "",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        mealList: "[]",
      },
    });

    const group = await db.group.create({
      data: {
        name: rawFormdata.groupName,
        ownerId: user.id, // Set the current user as the owner
        breakfast: rawFormdata.groupBreakfast || "0",
        lunch: rawFormdata.groupLunch || "0",
        dinner: rawFormdata.groupDinner || "0",
        people: rawFormdata.groupPeople || "0",
        sameBreakfast: rawFormdata.sameBreakfast,
        members: {
          create: {
            userId: user.id, // Add the owner to the members list as well
          },
        },
      },
    });

    // Create the initial food preference for the group owner
    if (rawFormdata.dietaryPreferences) {
      await db.foodPreference.create({
        data: {
          userId: user.id,
          groupId: group.id,
          preference: rawFormdata.dietaryPreferences,
        },
      });
    }

    // Create the initial alcohol preference for the group owner
    if (rawFormdata.alcoholPreferences) {
      await db.alcoholPreference.create({
        data: {
          userId: user.id,
          groupId: group.id,
          preference: rawFormdata.alcoholPreferences,
        },
      });
    }

    // Create the initial water preference for the group owner
    if (rawFormdata.waterPreference) {
      await db.waterPreference.create({
        data: {
          userId: user.id,
          groupId: group.id,
          preference: rawFormdata.waterPreference,
        },
      });
    }

    return group.id;
  } catch (error) {
    console.error("Error creating new group:", error);
  }
};

export const getGroupInfo = async (
  groupId: string,
): Promise<GroupInfo | null> => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      breakfast: true,
      lunch: true,
      dinner: true,
      people: true,
      sameBreakfast: true,
      owner: {
        select: {
          name: true,
          clerkUserId: true,
        },
      },
    },
  });

  if (!group) {
    console.error("Error getting group info");
    return null;
  }

  const isTheGroupOwner = userId === group.ownerId;

  // Get the owner's gender from Clerk's public metadata
  const ownerUser = await currentUser();
  const ownerGender = (ownerUser?.publicMetadata?.gender as string) || "";

  return {
    groupId: group.id,
    groupName: group.name,
    isTheGroupOwner,
    breakfast: group.breakfast,
    lunch: group.lunch,
    dinner: group.dinner,
    people: group.people,
    ownerName: group.owner.name,
    ownerGender,
    sameBreakfast: group.sameBreakfast,
    ownerId: group.ownerId,
  };
};

export const addFoodPreferenceAction = async (
  preference: string,
  groupId: string,
) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Unauthorized", status: 401 };
    }

    // Upsert membership
    await db.groupMembership.upsert({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
      update: {}, // No update action needed if they are already a member
      create: { userId, groupId }, // Create new membership if not
    });

    // Create the food preference record
    const foodPreference = await db.foodPreference.create({
      data: {
        userId,
        groupId,
        preference,
      },
    });

    // Revalidate the path to refresh the group's food preferences
    revalidatePath(`/groups/${groupId}/menu`);

    return { foodPreference, status: 201 };
  } catch (error) {
    console.error("Error adding food preference:", error);
    return { error: "Internal Server Error", status: 500 };
  }
};

/** Salva il menu generato sul gruppo. Solo il group owner può salvare. */
export const saveGroupMealList = async (
  groupId: string,
  mealList: MealList,
): Promise<{ error?: string }> => {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Non autenticato" };

    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { ownerId: true },
    });
    if (!group) return { error: "Gruppo non trovato" };
    if (group.ownerId !== userId) {
      return { error: "Solo il proprietario del gruppo può salvare il menu" };
    }

    await db.group.update({
      where: { id: groupId },
      data: { mealList: JSON.stringify(mealList) },
    });
    revalidatePath(`/group/${groupId}/menu`);
    return {};
  } catch (error) {
    console.error("Error saving group meal list:", error);
    return { error: "Errore nel salvataggio del menu" };
  }
};

/** Restituisce il menu salvato del gruppo, o null se non presente. */
export const getGroupMealList = async (
  groupId: string,
): Promise<MealList | null> => {
  try {
    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { mealList: true },
    });
    if (!group?.mealList) return null;
    return JSON.parse(group.mealList) as MealList;
  } catch (error) {
    console.error("Error getting group meal list:", error);
    return null;
  }
};

/** Vota un pasto del menu (1-5). Un utente può dare un solo voto per pasto. */
export const voteMenuItem = async (
  groupId: string,
  mealTypeId: string,
  mealId: string,
  value: number,
): Promise<{ error?: string }> => {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Non autenticato" };
    if (value < 1 || value > 5)
      return { error: "Il voto deve essere tra 1 e 5" };

    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { id: true },
    });
    if (!group) return { error: "Gruppo non trovato" };

    let membership = await db.groupMembership.findUnique({
      where: {
        userId_groupId: { userId, groupId },
      },
    });

    // Se l'utente invitato non è ancora membro (es. è arrivato solo al link del menu),
    // aggiungilo al gruppo così può votare
    if (!membership) {
      const clerkUser = await currentUser();
      if (!clerkUser) return { error: "Non autenticato" };
      await db.user.upsert({
        where: { clerkUserId: userId },
        update: {},
        create: {
          clerkUserId: userId,
          name: clerkUser.firstName ?? "",
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
          mealList: "[]",
        },
      });
      await db.groupMembership.upsert({
        where: {
          userId_groupId: { userId, groupId },
        },
        update: {},
        create: { userId, groupId },
      });
    }

    await db.menuItemVote.upsert({
      where: {
        groupId_userId_mealTypeId_mealId: {
          groupId,
          userId,
          mealTypeId,
          mealId,
        },
      },
      update: { value },
      create: {
        groupId,
        userId,
        mealTypeId,
        mealId,
        value,
      },
    });
    revalidatePath(`/group/${groupId}/menu`);
    return {};
  } catch (error) {
    console.error("Error voting menu item:", error);
    return { error: "Errore durante il voto" };
  }
};

/** Restituisce per ogni pasto: media voti, numero voti, e il voto dell'utente corrente (se presente). */
export const getGroupMenuVotes = async (
  groupId: string,
): Promise<{
  byKey: Record<string, { average: number; count: number; userVote?: number }>;
} | null> => {
  try {
    const { userId } = await auth();
    const votes = await db.menuItemVote.findMany({
      where: { groupId },
    });
    const byKey: Record<
      string,
      { sum: number; count: number; userVote?: number }
    > = {};
    for (const v of votes) {
      const key = `${v.mealTypeId}-${v.mealId}`;
      if (!byKey[key]) byKey[key] = { sum: 0, count: 0 };
      byKey[key].sum += v.value;
      byKey[key].count += 1;
      if (userId && v.userId === userId) byKey[key].userVote = v.value;
    }
    const result: Record<
      string,
      { average: number; count: number; userVote?: number }
    > = {};
    for (const [key, data] of Object.entries(byKey)) {
      result[key] = {
        average:
          data.count > 0 ? Math.round((data.sum / data.count) * 10) / 10 : 0,
        count: data.count,
        userVote: data.userVote,
      };
    }
    return { byKey: result };
  } catch (error) {
    console.error("Error getting group menu votes:", error);
    return null;
  }
};

export const saveMealList = async (mealList: string, userId: string) => {
  try {
    if (!userId) {
      throw new Error("Missing userId");
    }

    await db.user.update({
      where: { clerkUserId: userId },
      data: { mealList },
    });
  } catch (error) {
    console.error("Error saving meal list:", error);
  }
};
export const getMealListFromDB = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("Missing userId");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { mealList: true },
    });
    return user?.mealList;
  } catch (error) {
    console.error("Error getting meal list from DB:", error);
  }
};

export const checkSpecialAccount = async (userId: string) => {
  return userId && UNLIMITED_USERS.includes(userId);
};

export const getMaxAiCall = async (
  hasPaidForIncrease: boolean,
  userId: string,
) => {
  const isSpecialAccount = await checkSpecialAccount(userId);

  if (isSpecialAccount) {
    return UNLIMITED_API_CALLS;
  }

  return hasPaidForIncrease ? PAID_TIER_API_CALLS : FREE_TIER_API_CALLS;
};

export const regenerateSingleMealStream = async ({
  dietaryPreferences,
  userId,
  meal,
}: {
  dietaryPreferences: string;
  userId: string;
  meal: Meal;
}) => {
  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        apiCallCount: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Update API call count
    await db.user.update({
      where: { id: user.id },
      data: {
        apiCallCount: user.apiCallCount + 1,
        lastApiCall: new Date(),
      },
    });

    // Create streaming result
    const result = await streamObject({
      model: openai("gpt-3.5-turbo"),
      prompt: getRegenerateMealPrompt({ dietaryPreferences, meal }),
      schema: mealSchema,
    });

    console.log("🔄 regenerateSingleMealStream result:", result);

    revalidatePath("/meal-menu", "layout");

    // Wait for the final object and return only serializable data
    const finalObject = await result.object;
    return {
      type: "success" as const,
      meal: finalObject,
    };
  } catch (error) {
    console.error("Error in streaming meal regeneration:", error);
    throw error;
  }
};

export const getMealListFromAiStreamObject = async ({
  formValues,
  userId,
}: {
  formValues: FormState;
  userId: string;
}) => {
  console.log("🚀 STREAMOBJECT FUNCTION CALLED");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        apiCallCount: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Update API call count
    await db.user.update({
      where: { id: user.id },
      data: {
        apiCallCount: user.apiCallCount + 1,
        lastApiCall: new Date(),
      },
    });

    // Use streamObject for structured streaming
    const result = await streamObject({
      model: openai("gpt-3.5-turbo"),
      schema: mealMenuSchema,
      prompt: getMainPrompt(formValues),
      maxTokens: 2000,
    });

    console.log("🍽️ getMealListFromAiStreamObject result:", result);

    // Log the final menu generated
    const finalObject = await result.object;
    console.log("🍽️ MENU GENERATO:", JSON.stringify(finalObject, null, 2));

    // Create a readable stream for the partial objects
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const partial of result.partialObjectStream) {
            const chunk = JSON.stringify(partial) + "\n";
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in streamObject meal generation:", error);
    throw error;
  }
};
