import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { mealsPerDay, days, dietaryPreferences, people } = req.body;

  // Genera il prompt per l'AI
  const prompt = `Crea una list della spesa per ${mealsPerDay} pasti al giorno per ${days} giorni per ${people} persone. 
    Preferenze alimentari include: ${dietaryPreferences}. Fornisci una lista in un elenco puntato con ogni alimento e le quantità su ogni riga. Attenzione: se è un pasto questa è la cena, se sono due pasti è pranzo e cena, se sono tre pasti allora colazione, pranzo e cena.`;

  // Chiamata all'API di OpenAI (o altro servizio AI)
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 500, // Puoi regolare il numero di token in base alla risposta desiderata
    }),
  });

  const data = await response.json();
  const shoppingList = data.choices[0].text.trim();

  console.log(data, prompt);

  res.status(200).json({ shoppingList });
}
