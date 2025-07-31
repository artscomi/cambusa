import { FormState } from "@/hooks/useFormConfig";
import { Meal } from "@/types/types";

export const getMainPrompt = ({
  breakfast,
  lunch,
  dinner,
  dietaryPreferences,
  people,
  sameBreakfast,
}: FormState): string => `Crea una proposta di menu in italiano con ${
  breakfast || 0
} colazioni, ${lunch} pranzi, ${dinner} cene per ${people} persone.
  Preferenze alimentari includono: pasta circa 100 grammi a testa, riso 70 grammi a testa, ${dietaryPreferences}. 
  Cerca di accontentare tutti, senza proporre piatti diversi per ognuno. Soloer per le colazioni, ${
    sameBreakfast
      ? "usa lo stesso menu per tutti i giorni ma crea un pasto per ogni giorno anche se è lo stesso"
      : "usa un menu diverso per ogni giorno"
  }. Gli altri pasti devono avere sempre menu diversi. Non includere nel menu integratori alimentari. Proponi sempre sia carboidrati che proteine a pranzo e cena. Ma privilegia i carboidrati a pranzo e le proteine a cena.
  Il menu deve essere italiano e deve prevedere degli ingredienti estivi e che possono conservarsi nel frigo di una barca che di norma non è molto potente. Non proporre piatti invernali come il risotto. I piatti devono essere adatti alla preparazione in barca, quindi privilegia preparazioni semplici, veloci ed evita l'uso del forno. Proponi piatti che possono essere preparati in pochi minuti ma che siano gustosi e nutritivi. Non proporre i tacos o le tortillas ma preferisci i piatti tipici italiani come le piadine o i panini ad esempio.
IMPORTANTE: Genera SOLO un oggetto JSON valido con questa struttura esatta:
{
  "menu": [
    {
      "id": "colazioni",
      "mealTypeName": "Colazioni",
      "meals": [
        {
          "id": "colazione1",
          "mealName": "Nome Colazione",
          "dishes": [
            {
              "id": "piatto1",
              "dishName": "Nome Piatto",
              "ingredients": [
                {
                  "id": "ingrediente1",
                  "item": "🍓 Nome Ingrediente",
                  "quantity": 100,
                  "unit": "g"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "pranzi",
      "mealTypeName": "Pranzi",
      "meals": [...]
    },
    {
      "id": "cene",
      "mealTypeName": "Cene",
      "meals": [...]
    }
  ]
}

REGOLE STRETTE:
- L'oggetto deve avere ESATTAMENTE 3 categorie: colazioni, pranzi, cene
- Ogni categoria deve avere il numero di pasti richiesto
- Ogni pasto deve avere almeno un piatto
- Ogni pasto deve aver al massimo 1 piatto
- Ogni piatto deve contenere 4-6 ingredienti
- Ogni piatto deve essere unico e non ripetitivo
- Ogni ingrediente deve avere ID, nome (emoji + nome), quantità e unità
- Gli ID devono essere unici
- Usa SOLO virgolette doppie per le stringhe JSON
- Assicurati che tutte le parentesi siano chiuse correttamente
- Non includere testo extra prima o dopo il JSON
`;

export const getRegenerateMealPrompt = ({
  dietaryPreferences,
  meal,
}: {
  dietaryPreferences: string;
  meal: Meal;
}): string => `Crea un altro piatto diverso da questo: ${JSON.stringify(
  meal
)}, in italiano. Preferenze alimentari includono: ${dietaryPreferences}. Mantieni gli stessi id del piatto originale. Cerca di accontentare tutti, senza proporre piatti diversi per ognuno, tranne a Colazione. Non includere nel menu integratori alimentari. Cerca di proporre carboidrati a pranzo e proteine a cena.
    Il menu deve essere italiano e deve prevedere degli ingredienti estivi. Non proporre piatti invernali come il risotto. I piatti devono essere adatti alla preparazione in barca, quindi privilegia preparazioni semplici ed evita l'uso del forno.

IMPORTANTE: Genera SOLO un oggetto JSON valido che rappresenti un pasto con questa struttura:
{
  "id": "mealId",
  "mealName": "Nome Pasto",
  "dishes": [
    {
      "id": "piattoId",
      "dishName": "Nome Piatto",
      "ingredients": [
        {
          "id": "ingredienteId",
          "item": "🍓 Nome Ingrediente",
          "quantity": 100,
          "unit": "g"
        }
      ]
    }
  ]
}

Usa SOLO virgolette doppie e assicurati che il JSON sia valido.`;
