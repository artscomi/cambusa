import { FormState } from "@/hooks/useFormConfig";
import { Meal } from "@/types/types";

export const getMainPrompt = ({
  breakfast,
  lunch,
  dinner,
  dietaryPreferences,
  people,
}: FormState): string => `Crea una proposta di menu in italiano per un viaggio in barca con ${
  breakfast || 0
} colazioni, ${lunch} pranzi, ${dinner} cene per ${people} persone.

REQUISITI SPECIFICI:
1. Colazioni: usa lo stesso menu per tutti i giorni, con opzioni semplici e veloci da preparare
2. Pranzi: privilegia piatti con carboidrati (pasta, riso, couscous) con circa 100g a testa
3. Cene: privilegia piatti proteici (pesce, legumi, uova)
4. Preferenze alimentari: ${dietaryPreferences}

VINCOLI:
- I piatti devono essere adatti alla preparazione in barca (spazi limitati, poco tempo)
- Evita l'uso del forno
- Non includere integratori alimentari
- Usa ingredienti facilmente reperibili
- Limita il numero di ingredienti per piatto (2-4)
- Considera la conservazione degli alimenti (evita cibi facilmente deperibili)

FORMATO OUTPUT:
Genera un oggetto JSON con tre categorie: "colazioni", "pranzi" e "cene".
Per ogni categoria, includi il numero di pasti indicato.
Ogni pasto deve avere:
- Un ID univoco
- Almeno un piatto
- Ogni piatto deve contenere 2-4 ingredienti
- Ogni ingrediente deve avere:
  * ID univoco
  * Nome (con emoji)
  * Quantità
  * Unità di misura (grammi, pezzi, tazze)
`;

export const getRegenerateMealPrompt = ({
  dietaryPreferences,
  meal,
}: {
  dietaryPreferences: string;
  meal: Meal;
}): string => `Crea un altro piatto diverso da questo: ${JSON.stringify(
  meal
)}, in italiano.

REQUISITI:
- Preferenze alimentari: ${dietaryPreferences}
- Mantieni gli stessi ID del piatto originale
- Il piatto deve essere adatto alla preparazione in barca
- Evita l'uso del forno
- Non includere integratori alimentari
- Usa ingredienti facilmente reperibili
- Limita il numero di ingredienti (2-4)
- Considera la conservazione degli alimenti

FORMATO OUTPUT:
Genera un oggetto JSON che rappresenti un pasto con:
- ID univoco
- Almeno un piatto
- Ogni piatto deve contenere 2-4 ingredienti
- Ogni ingrediente deve avere:
  * ID univoco
  * Nome (con emoji)
  * Quantità
  * Unità di misura (grammi, pezzi, tazze)
`;
