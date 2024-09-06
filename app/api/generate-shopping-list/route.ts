import { NextResponse } from 'next/server';
import { getPrompt } from '@/utils/getPrompt';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: getPrompt(body),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`OpenAI API error: ${errorMessage}`);
    }

    const data = await response.json();
    const shoppingList = data.choices[0].message.content.trim();

    console.log(getPrompt(body));
    console.log(shoppingList);

    return NextResponse.json({ shoppingList });
  } catch (error) {
    console.error("Error generating shopping list:", error);
    return NextResponse.json({ error: "Failed to generate shopping list" }, { status: 500 });
  }
}
