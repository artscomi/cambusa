"use server";

import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { openai } from "@ai-sdk/openai";
import { getRegenerateMealPrompt } from "@/utils/getPrompt";
import { Meal } from "@/types/types";
import db from "@/utils/db";
import { revalidatePath } from "next/cache";
import { mealSchema } from "../generate-meal-menu/schema";

export async function regenerateSingleMeal({
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
      prompt: getRegenerateMealPrompt({dietaryPreferences, meal}),
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
    console.log("prompt", getRegenerateMealPrompt({dietaryPreferences, meal}));
    console.log("result", result.object);
    console.log("api call", user.apiCallCount);

    revalidatePath("/meal-menu", "layout");

    // Return success response
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
}