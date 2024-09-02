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
 Genera un file JSON che rappresenta proposte di colazione, pranzo e cena. Il JSON deve essere strutturato come segue:
  Genera un emoji accanto a ogni ingrediente.
1. **Colazioni**: 
   - Ogni colazione deve essere un oggetto con il nome della colazione come chiave.
   - Ogni colazione deve contenere vari piatti, e ogni piatto deve avere una lista di ingredienti.
   - Gli ingredienti devono essere oggetti con due proprietà: "item" e "quantity".

2. **Pranzi**:
   - Ogni pranzo deve essere un oggetto con il nome del pranzo come chiave.
   - Ogni pranzo deve contenere vari piatti, e ogni piatto deve avere una lista di ingredienti.
   - Gli ingredienti devono essere oggetti con due proprietà: "item" e "quantity".

3. **Cene**:
   - Ogni cena deve essere un oggetto con il nome della cena come chiave.
   - Ogni cena deve contenere vari piatti, e ogni piatto deve avere una lista di ingredienti.
   - Gli ingredienti devono essere oggetti con due proprietà: "item" e "quantity".

Esempio di struttura JSON:
{
  "Colazioni": {
    "Colazione 1": {
      "Nome del piatto 1": [
        {"item": "Nome ingrediente 1", "quantity": "Quantità ingrediente 1"},
        {"item": "Nome ingrediente 2", "quantity": "Quantità ingrediente 2"}
      ],
      "Nome del piatto 2": [
        {"item": "Nome ingrediente 1", "quantity": "Quantità ingrediente 1"}
      ]
    },
    "Colazione 2": {
      "Nome del piatto 1": [
        {"item": "Nome ingrediente 1", "quantity": "Quantità ingrediente 1"}
      ]
    }
  },
  "Pranzi": {
    "Pranzo 1": {
      "Nome del piatto 1": [
        {"item": "Nome ingrediente 1", "quantity": "Quantità ingrediente 1"},
        {"item": "Nome ingrediente 2", "quantity": "Quantità ingrediente 2"}
      ],
      "Nome del piatto 2": [
        {"item": "Nome ingrediente 1", "quantity": "Quantità ingrediente 1"}
      ]
    },
    "Pranzo 2": {
      "Nome del piatto 1": [
        {"item": "Nome ingrediente 1", "quantity": "Quantità ingrediente 1"}
      ]
    }
  },
  "Cene": {
    "Cena 1": {
      "Nome del piatto 1": [
        {"item": "Nome ingrediente 1", "quantity": "Quantità ingrediente 1"},
        {"item": "Nome ingrediente 2", "quantity": "Quantità ingrediente 2"}
      ],
      "Nome del piatto 2": [
        {"item": "Nome ingrediente 1", "quantity": "Quantità ingrediente 1"}
      ]
    },
    "Cena 2": {
      "Nome del piatto 1": [
        {"item": "Nome ingrediente 1", "quantity": "Quantità ingrediente 1"}
      ]
    }
  }
}
Ritorna solo un JSON che posso parsare in un oggetto JavaScript con JSON.parse. Non includere codice commentato o descrizioni dell'output. Ritorna solo un file JSON che posso parsare.
`;
