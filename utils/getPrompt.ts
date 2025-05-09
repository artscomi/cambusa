import { FormState } from "@/hooks/useFormConfig";
import { Meal } from "@/types/types";

export const getMainPrompt = ({
  breakfast,
  lunch,
  dinner,
  dietaryPreferences,
  people,
}: FormState): string => {
  return `Crea una proposta di menu in italiano con ${
    breakfast || 0
  } colazioni, ${lunch} pranzi e ${dinner} cene per ${people} persone.

Preferenze alimentari:
- Pasta: circa 100g a testa
- Altre: ${dietaryPreferences}

Linee guida:
- Cerca di accontentare tutti senza piatti diversi (tranne a colazione).
- Nessun integratore alimentare.
- Prediligi carboidrati a pranzo e proteine a cena.
- Tutti i piatti devono essere adatti alla preparazione in barca (evita l'uso del forno, ricette semplici).

Formato richiesto:
Genera un oggetto JSON con al massimo tre categorie: "colazioni", "pranzi", "cene".
Per ogni categoria:
- Se il numero richiesto di pasti è 0, includi comunque la categoria ma con un array vuoto (\`[]\`).
- Altrimenti, includi esattamente quel numero di pasti.
- Ogni pasto deve contenere almeno 1 piatto.
- Ogni piatto deve avere da 2 a 4 ingredienti.
- Ogni ingrediente deve avere: \`id\`, \`item\` (con emoji all'inizio, es: "🍅 Pomodori", "🥕 Carote", "🥩 Carne"), \`quantità\`, \`unità\`.

Tutti gli ID devono essere **univoci** per categoria, pasto, piatto e ingrediente.`;
};

export const getRegenerateMealPrompt = ({
  dietaryPreferences,
  meal,
}: {
  dietaryPreferences: string;
  meal: Meal;
}): string => `Crea un altro piatto diverso da questo: ${JSON.stringify(
  meal
)}, in italiano. Preferenze alimentari includono: ${dietaryPreferences}. Mantieni gli stessi id del piatto originale. Cerca di accontentare tutti, senza proporre piatti diversi per ognuno, tranne a Colazione. Non includere nel menu integratori alimentari. Cerca di proporre carboidrati a pranzo e proteine a cena.
  I piatti devono essere adatti alla preparazione in barca, quindi privilegia preparazioni semplici ed evita l'uso del forno.
  Per ogni ingrediente, aggiungi un'emoji appropriata all'inizio del nome (es: "🍅 Pomodori", "🥕 Carote", "🥩 Carne").
 Genera un oggetto JSON che rappresenti un pasto.`;
