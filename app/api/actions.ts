"use server";

import db from "@/utils/db";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Meal, MenuData } from "@/types/types";
import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { openai } from "@ai-sdk/openai";
import { getMainPrompt, getRegenerateMealPrompt } from "@/utils/getPrompt";
import { mealMenuSchema, mealSchema } from "./schemas/meal-menu";
import { FormState } from "@/hooks/useFormConfig";

export const getUserInfo = async () => {
  const { userId } = auth();

  if (!userId) {
    return {
      apiCallCount: 0,
      hasPaidForIncrease: false,
      name: "",
    };
  }

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
    console.error("user not found in getUserInfo");
    return {
      apiCallCount: 0,
      hasPaidForIncrease: false,
      name: "",
    };
  }

  revalidatePath("/", "layout");

  return {
    apiCallCount: user.apiCallCount,
    hasPaidForIncrease: user.hasPaidForIncrease,
    name: user.name,
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
  | { type: "user-limit-error"; error: string }
  | { type: "user-not-found"; error: string }
> => {
  "use server";

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
      model: openai("gpt-4o-mini"),
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
      getRegenerateMealPrompt({ dietaryPreferences, meal })
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

export const resetApiCallCount = async () => {
  "use server";
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    throw new Error("Missing clerkUserId");
  }

  try {
    await db.user.update({
      where: { clerkUserId },
      data: { apiCallCount: 0, hasPaidForIncrease: true },
    });

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error resetting API call count:", error);
    throw new Error("Failed to reset API call count");
  }
};

export const getMealListFromAi = async ({
  formValues,
  userId,
}: {
  formValues: FormState;
  userId: string;
}): Promise<
  | { type: "success"; menu: MenuData }
  | { type: "parse-error"; text: string }
  | { type: "validation-error"; value: unknown }
  | { type: "unknown-error"; error: unknown }
  | { type: "user-limit-error"; error: string }
  | { type: "user-not-found"; error: string }
> => {
  "use server";

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
      model: openai("gpt-4o-mini"),
      prompt: getMainPrompt(formValues),
      schema: mealMenuSchema,
    });

    await db.user.update({
      where: { id: user.id },
      data: {
        apiCallCount: user.apiCallCount + 1,
        lastApiCall: new Date(),
      },
    });

    // Log prompts and result
    console.log("prompt", getMainPrompt(formValues));
    console.log("result", result.object);
    console.log("api call", user.apiCallCount);

    revalidatePath("/meal-menu", "layout");

    // Return success response
    return { type: "success", menu: result.object };
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

export const saveUser = async () => {
  const user = await currentUser();
  if (!user) {
    console.error("user not found in SaveUser");
    return;
  }
  const { firstName, primaryEmailAddress, id } = user;

  try {
    await db.user.upsert({
      where: { clerkUserId: id },
      update: {
        name: firstName ?? "",
        email: primaryEmailAddress?.emailAddress ?? "",
      },
      create: {
        name: firstName ?? "",
        email: primaryEmailAddress?.emailAddress ?? "",
        clerkUserId: id,
      },
    });
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error saving/updating user in database:", error);
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
    groupLunch: formData.get("lunch") as string,
    groupDinner: formData.get("dinner") as string,
  };

  try {
    const group = await db.group.create({
      data: {
        name: rawFormdata.groupName,
        ownerId: user.id, // Set the current user as the owner
        lunch: rawFormdata.groupLunch || "0",
        dinner: rawFormdata.groupDinner || "0",
        people: rawFormdata.groupPeople || "0",
        members: {
          create: {
            userId: user.id, // Add the owner to the members list as well
          },
        },
      },
    });
    return group.id;
  } catch (error) {
    console.error("Error creating new group:", error);
  }
};

export const getGroupInfo = async (groupId: string) => {
  const { userId } = auth();

  if (!userId) {
    return {
      groupId: "",
      groupName: "group.name",
      isTheGroupOwner: false,
    };
  }

  const group = await db.group.findUnique({
    where: { id: groupId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      lunch: true,
      dinner: true,
      people: true,
    },
  });

  if (!group) {
    console.error("Error getting group info");
    return;
  }
  revalidatePath("/", "layout");

  const isTheGroupOwner = userId === group.ownerId;

  console.log({ userId });
  console.log(group.ownerId);

  return {
    groupId: group.id,
    groupName: group.name,
    isTheGroupOwner,
    lunch: group.lunch,
    dinner: group.dinner,
    people: group.people,
  };
};

export const addFoodPreferenceAction = async (
  preference: string,
  groupId: string
) => {
  try {
    const { userId } = auth();

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