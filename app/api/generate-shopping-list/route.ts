import { NextResponse } from "next/server";
import { getPrompt } from "@/utils/getPrompt";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { shoppingListSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await streamObject({
      model: openai("gpt-4o-mini"),
      schema: shoppingListSchema,
      prompt: "Genera una lista della spesa in italiano con tutti gli ingredienti di questo menu:" + body,
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
