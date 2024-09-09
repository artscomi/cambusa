"use server";

import { generateObject, JSONParseError, TypeValidationError } from "ai";
import { openai } from "@ai-sdk/openai";
import { getPrompt } from "@/utils/getPrompt";
import { FormState } from "@/hooks/useFormConfig";
import { MenuData } from "@/types/types";
import { mealMenuSchema } from "./schema";

export async function getMealListFromAi(
  input: FormState
): Promise<
  | { type: "success"; menu: MenuData }
  | { type: "parse-error"; text: string }
  | { type: "validation-error"; value: unknown }
  | { type: "unknown-error"; error: unknown }
> {
  "use server";

  try {
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt: getPrompt(input),
      schema: mealMenuSchema,
    });

    console.log('prompt', getPrompt(input))
    console.log('result', result)
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
