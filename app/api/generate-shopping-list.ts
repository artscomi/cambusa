import { getPrompt } from "@/utils/getPrompt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
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
            content: getPrompt(req.body),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const shoppingList = data.choices[0].message.content.trim();

    console.log(getPrompt(req.body),)
    console.log(shoppingList)

    // Send the generated shopping list back to the client
    res.status(200).json({ shoppingList });
  } catch (error) {
    console.error("Error generating shopping list:", error);
    res.status(500).json({ error: "Failed to generate shopping list" });
  }
}
