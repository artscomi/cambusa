"use server";

import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { openai } from "@ai-sdk/openai";
import { getMainPrompt } from "@/utils/getPrompt";
import { FormState } from "@/hooks/useFormConfig";
import { MenuData } from "@/types/types";
import { mealMenuSchema } from "./schema";
import db from "@/utils/db";
import { revalidatePath } from "next/cache";

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

    revalidatePath('/meal-menu', 'layout')

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
