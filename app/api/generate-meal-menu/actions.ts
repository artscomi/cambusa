"use server";

import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { openai } from "@ai-sdk/openai";
import { getPrompt } from "@/utils/getPrompt";
import { FormState } from "@/hooks/useFormConfig";
import { MenuData } from "@/types/types";
import { mealMenuSchema } from "./schema";
import db from "@/utils/db";

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

    // Check if the API call count is below 3
    if (user.apiCallCount >= 0) {
      return {
        type: "user-limit-error",
        error: "API call limit reached for the user.",
      };
    }

    // Generate result using AI (only if apiCallCount < 3)
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt: getPrompt(formValues),
      schema: mealMenuSchema,
    });

    // Update API call count after a successful AI generation
    await db.user.update({
      where: { id: user.id },
      data: {
        apiCallCount: user.apiCallCount + 1, // Increment API call count
        lastApiCall: new Date(), // Optionally update the last call time
      },
    });

    // Log prompts and result
    console.log("prompt", getPrompt(formValues));
    console.log("result", result.object);
    console.log("api call", user.apiCallCount);

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
