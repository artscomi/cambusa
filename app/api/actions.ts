"use server";

import db from "@/utils/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { Meal, MenuData } from "@/types/types";
import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { openai } from "@ai-sdk/openai";
import { getMainPrompt, getRegenerateMealPrompt } from "@/utils/getPrompt";
import { mealMenuSchema, mealSchema } from "./schemas/meal-menu";
import { FormState } from "@/hooks/useFormConfig";

export const getUserInfo = async () => {
  "use server";
  const { userId } = auth();

  if (!userId) {
    console.error("userId not found in getUserInfo");
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

export async function getMealListFromAi({
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
> {
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
}
