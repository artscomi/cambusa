"use server";

import db from "@/utils/db";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GroupInfo, Meal, MealList } from "@/types/types";
import { generateObject, JSONParseError, TypeValidationError } from "ai";
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

export const getUserInfo = async () => {
  const { userId } = await auth();

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

  return {
    apiCallCount: user.apiCallCount,
    hasPaidForIncrease: user.hasPaidForIncrease,
    name: user.name,
  };
};

export const getUserGroups = async () => {
  const { userId } = await auth();

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
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    throw new Error("Missing clerkUserId");
  }

  try {
    await db.user.update({
      where: { clerkUserId },
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
  "use server";
  // log the prompt
  console.log("prompt", getMainPrompt(formValues));

  try {
    const result =
      process.env.NODE_ENV === "development"
        ? await fakeOpenAiCall()
        : await generateObject({
            model: openai("gpt-4o-mini"),
            prompt: getMainPrompt(formValues),
            schema: mealMenuSchema,
          });

    revalidatePath("/meal-menu", "layout");

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

    // Log result
    console.log("result", JSON.stringify(result.object, null, 2));

    // Return success response
    return { type: "success", menu: result.object.menu };
  } catch (e) {
    if (TypeValidationError.isInstance(e)) {
      console.log(JSON.stringify(e.value, null, 2));
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
        mealList: "",
      },
    });
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
    groupBreakfast: formData.get("breakfast") as string,
    groupLunch: formData.get("lunch") as string,
    groupDinner: formData.get("dinner") as string,
    dietaryPreferences: formData.get("dietaryPreferences") as string,
    alcoholPreferences: formData.get("alcoholPreferences") as string,
    waterPreference: formData.get("waterPreference") as string,
    sameBreakfast: formData.get("sameBreakfast") === "on",
  };

  try {
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
  groupId: string
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
  };
};

export const addFoodPreferenceAction = async (
  preference: string,
  groupId: string
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

export const saveMealList = async (mealList: string) => {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("Missing clerkUserId");
    }

    await db.user.update({
      where: { clerkUserId },
      data: { mealList },
    });
  } catch (error) {
    console.error("Error saving meal list:", error);
  }
};
export const getMealListFromDB = async () => {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("Missing clerkUserId");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId },
      select: { mealList: true },
    });
    return user?.mealList;
  } catch (error) {
    console.error("Error getting meal list from DB:", error);
  }
};

export const checkSpecialAccount = async () => {
  const { userId } = await auth();
  return userId && UNLIMITED_USERS.includes(userId);
};

export const getMaxAiCall = async (hasPaidForIncrease: boolean) => {
  const isSpecialAccount = await checkSpecialAccount();

  if (isSpecialAccount) {
    return UNLIMITED_API_CALLS;
  }

  return hasPaidForIncrease ? PAID_TIER_API_CALLS : FREE_TIER_API_CALLS;
};
