import { NextResponse } from "next/server";
import { getPrompt } from "@/utils/getPrompt";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { mealMenuSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await streamObject({
      model: openai("gpt-4o-mini"),
      schema: mealMenuSchema,
      prompt: getPrompt(body),
    });

    return response.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating shopping list:", error);
    return NextResponse.json(
      { error: "Failed to generate shopping list" },
      { status: 500 }
    );
  }
}
