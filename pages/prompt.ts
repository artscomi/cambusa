export const getPrompt = ({
  days,
  dietaryPreferences,
  people,
}: {
  days: string;
  dietaryPreferences: string;
  people: string;
}): string => `Crea una proposta di menu per 3 pasti al giorno per ${days} giorni per ${people} persone.
Preferenze alimentari includono: pasta circa 100 grammi a testa, ${dietaryPreferences}. Non includere nel menu integratori alimentari. Cerca di proporre carboidrati a pranzo e proteine a cena.
I piatti devono essere adatti alla preparazione in barca, quindi privilegia preparazioni semplici ed evita l'uso del forno.
Ritorna solo la lista in formato JSON, dove ogni giorno rappresenta un elemento di un'array e per ogni giorno il pasto ("Colazione", "Pranzo", "Cena") è una chiave che contiene un array di oggetti. 
Ogni oggetto deve avere le chiavi "item" e "quantity".
Esempio:
[
    {
        "Colazione": [
            {
                "item": "uova",
                "quantity": "12"
            },
            {
                "item": "latte",
                "quantity": "1 litro"
            }
        ],
        "Pranzo": [
            {
                "item": "pane",
                "quantity": "2 kg"
            },
            {
                "item": "pomodori",
                "quantity": "1 kg"
            }
        ],
        "Cena": [
            {
                "item": "pasta",
                "quantity": "500g"
            },
            {
                "item": "olio",
                "quantity": "1 litro"
            }
        ]
    },
    {
        "Colazione": [
            {
                "item": "uova",
                "quantity": "12"
            },
            {
                "item": "latte",
                "quantity": "1 litro"
            }
        ],
        "Pranzo": [
            {
                "item": "pane",
                "quantity": "2 kg"
            },
            {
                "item": "pomodori",
                "quantity": "1 kg"
            }
        ],
        "Cena": [
            {
                "item": "pasta",
                "quantity": "500g"
            },
            {
                "item": "olio",
                "quantity": "1 litro"
            }
        ]
    }
]
Ritorna solo un JSON che posso parsare in un oggetto JavaScript con JSON.parse. Non includere codice commentato.
`;
