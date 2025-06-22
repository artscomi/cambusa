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
  Cerca di accontentare tutti, senza proporre piatti diversi per ognuno, tranne a Colazione.  Per le colazioni, ${
    sameBreakfast
      ? "usa lo stesso menu per tutti i giorni ma crea un pasto per ogni giorno anche se è lo stesso"
      : "usa un menu diverso per ogni giorno"
  }. Non includere nel menu integratori alimentari. Proponi sempre sia carboidrati che proteine a pranzo e cena.
  Il menu deve essere italiano e deve prevedere degli ingredienti estivi e che possono conservarsi nel frigo di una barca che di norma non è molto potente. Non proporre piatti invernali come il risotto. I piatti devono essere adatti alla preparazione in barca, quindi privilegia preparazioni semplici, veloci ed evita l'uso del forno. Proponi piatti che possono essere preparati in pochi minuti ma che siano gustosi e nutritivi.

 Genera un oggetto JSON che rappresenti un piano alimentare. L'oggetto deve avere tre categorie principali: "colazioni", "pranzi" e "cene".
Per ogni categoria, includi il numero di pasti indicato.
Ogni pasto deve avere almeno un piatto, e ogni piatto deve contenere 4-6 ingredienti.
Ogni ingrediente deve avere un ID, nome (emoji + nome dell'ingrediente), una quantità e un'unità di misura (ad es. g, pezzi, tazze). Converti in kg se la quantità è superiore a 1000g.
Gli ID per ogni categoria, pasto, piatto e ingrediente devono essere unici.
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
 Genera un oggetto JSON che rappresenti un pasto.
`;
