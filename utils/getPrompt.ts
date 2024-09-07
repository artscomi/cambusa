import { FormState } from "@/hooks/useInputConfig";

export const getPrompt = ({
  breakfast,
  lunch,
  dinner,
  dietaryPreferences,
  people,
}: FormState): string => `Crea una proposta di menu in italiano con ${breakfast} colazioni, ${lunch} pranzi, ${dinner} cene per ${people} persone.
  Preferenze alimentari includono: pasta circa 100 grammi a testa, ${dietaryPreferences}. Non includere nel menu integratori alimentari. Cerca di proporre carboidrati a pranzo e proteine a cena.
  I piatti devono essere adatti alla preparazione in barca, quindi privilegia preparazioni semplici ed evita l'uso del forno.
  Genera un emoji prima di ogni ingrediente.
`;
