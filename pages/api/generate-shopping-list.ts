import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { days, dietaryPreferences, people } = req.body;

  // Generate the prompt for the AI
  const prompt = `Crea una lista della spesa per 3 pasti al giorno per ${days} giorni per ${people} persone.
Preferenze alimentari includono: ${dietaryPreferences}.
Ritorna solo la lista in formato JSON, dove ogni giorno rappresenta un elemento di un'array e per ogni giorno il pasto ("Colazione", "Pranzo", "Cena") è una chiave che contiene un array di oggetti. 
Ogni oggetto deve avere le chiavi "item" e "quantity".
Esempio:
[
  {
    "Colazione": [
      { "item": "uova", "quantity": "12" },
      { "item": "latte", "quantity": "1 litro" }
    ],
    "Pranzo": [
      { "item": "pane", "quantity": "2 kg" },
      { "item": "pomodori", "quantity": "1 kg" }
    ],
    "Cena": [
      { "item": "pasta", "quantity": "500g" },
      { "item": "olio", "quantity": "1 litro" }
    ]
  }, 
  {
    "Colazione": [
      { "item": "uova", "quantity": "12" },
      { "item": "latte", "quantity": "1 litro" }
    ],
    "Pranzo": [
      { "item": "pane", "quantity": "2 kg" },
      { "item": "pomodori", "quantity": "1 kg" }
    ],
    "Cena": [
      { "item": "pasta", "quantity": "500g" },
      { "item": "olio", "quantity": "1 litro" }
    ]
  }, 
].
Ritorna solo un JSON che posso parsare in un oggetto JavaScript con JSON.parse. Non includere codice commentato.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const shoppingList = data.choices[0].message.content.trim();


    console.log({prompt})

    // Send the generated shopping list back to the client
    res.status(200).json({ shoppingList });
  } catch (error) {
    console.error("Error generating shopping list:", error);
    res.status(500).json({ error: "Failed to generate shopping list" });
  }
}
