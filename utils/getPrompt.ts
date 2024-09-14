import { FormState } from "@/hooks/useFormConfig";

export const getPrompt = ({
  breakfast,
  lunch,
  dinner,
  dietaryPreferences,
  people,
}: FormState): string => `Crea una proposta di menu in italiano con ${breakfast} colazioni, ${lunch} pranzi, ${dinner} cene per ${people} persone.
  Preferenze alimentari includono: pasta circa 100 grammi a testa, ${dietaryPreferences}. Cerca di accontentare tutti, senza proporre piatti diversi per ognuno, tranne a Colazione. Non includere nel menu integratori alimentari. Cerca di proporre carboidrati a pranzo e proteine a cena.
  I piatti devono essere adatti alla preparazione in barca, quindi privilegia preparazioni semplici ed evita l'uso del forno.
 Genera un oggetto JSON che rappresenti un piano alimentare. L'oggetto deve avere tre categorie principali: "colazioni", "pranzi" e "cene".
Per ogni categoria, includi il numero di pasti indicato.
Ogni pasto deve avere almeno un piatto, e ogni piatto deve contenere 2-4 ingredienti.
Ogni ingrediente deve avere un ID, nome dell'elemento (usando le emoji per gli alimenti), una quantità e un'unità di misura (ad es. grammi, pezzi, tazze).
Gli ID per ogni categoria, pasto, piatto e ingrediente devono essere unici.
`;
