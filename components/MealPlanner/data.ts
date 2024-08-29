import { Dispatch, SetStateAction } from "react";

type InputConfig = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const getInputConfig = ({
  days,
  setDays,
  people,
  setPeople,
  dietaryPreferences,
  setDietaryPreferences,
}: {
  days: string;
  setDays: Dispatch<SetStateAction<string>>;
  people: string;
  setPeople: Dispatch<SetStateAction<string>>;
  dietaryPreferences: string;
  setDietaryPreferences: Dispatch<SetStateAction<string>>;
}): InputConfig[] => [
  {
    id: "days",
    label: "Per quanti giorni?",
    value: days,
    placeholder: "7",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setDays(e.target.value),
  },
  {
    id: "people",
    label: "Per quante persone?",
    value: people,
    placeholder: "5",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setPeople(e.target.value),
  },
  {
    id: "dietary-preferences",
    label: "Aggiungi le tue preferenze alimentari",
    value: dietaryPreferences,
    placeholder: "vegan, gluten-free",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setDietaryPreferences(e.target.value),
  },
];

export const mockShoppingList = [
  {
    Colazione: [
      {
        item: "cereali",
        quantity: "1 confezione",
      },
      {
        item: "latte",
        quantity: "2 litri",
      },
      {
        item: "banane",
        quantity: "4",
      },
    ],
    Pranzo: [
      {
        item: "pane integrale",
        quantity: "1 kg",
      },
      {
        item: "mozzarella",
        quantity: "500g",
      },
      {
        item: "pomodori",
        quantity: "1 kg",
      },
      {
        item: "insalata",
        quantity: "1 capo",
      },
    ],
    Cena: [
      {
        item: "pasta",
        quantity: "1 kg",
      },
      {
        item: "olio d'oliva",
        quantity: "500 ml",
      },
      {
        item: "spaghetti",
        quantity: "500g",
      },
      {
        item: "parmigiano",
        quantity: "200g",
      },
    ],
  },
  {
    Colazione: [
      {
        item: "cereali",
        quantity: "1 confezione",
      },
      {
        item: "latte",
        quantity: "2 litri",
      },
      {
        item: "banane",
        quantity: "4",
      },
    ],
    Pranzo: [
      {
        item: "pane integrale",
        quantity: "1 kg",
      },
      {
        item: "mozzarella",
        quantity: "500g",
      },
      {
        item: "pomodori",
        quantity: "1 kg",
      },
      {
        item: "insalata",
        quantity: "1 capo",
      },
    ],
    Cena: [
      {
        item: "pasta",
        quantity: "1 kg",
      },
      {
        item: "olio d'oliva",
        quantity: "500 ml",
      },
      {
        item: "spaghetti",
        quantity: "500g",
      },
      {
        item: "parmigiano",
        quantity: "200g",
      },
    ],
  },
  {
    Colazione: [
      {
        item: "cereali",
        quantity: "1 confezione",
      },
      {
        item: "latte",
        quantity: "2 litri",
      },
      {
        item: "banane",
        quantity: "4",
      },
    ],
    Pranzo: [
      {
        item: "pane integrale",
        quantity: "1 kg",
      },
      {
        item: "mozzarella",
        quantity: "500g",
      },
      {
        item: "pomodori",
        quantity: "1 kg",
      },
      {
        item: "insalata",
        quantity: "1 capo",
      },
    ],
    Cena: [
      {
        item: "pasta",
        quantity: "1 kg",
      },
      {
        item: "olio d'oliva",
        quantity: "500 ml",
      },
      {
        item: "spaghetti",
        quantity: "500g",
      },
      {
        item: "parmigiano",
        quantity: "200g",
      },
    ],
  },
  {
    Colazione: [
      {
        item: "cereali",
        quantity: "1 confezione",
      },
      {
        item: "latte",
        quantity: "2 litri",
      },
      {
        item: "banane",
        quantity: "4",
      },
    ],
    Pranzo: [
      {
        item: "pane integrale",
        quantity: "1 kg",
      },
      {
        item: "mozzarella",
        quantity: "500g",
      },
      {
        item: "pomodori",
        quantity: "1 kg",
      },
      {
        item: "insalata",
        quantity: "1 capo",
      },
    ],
    Cena: [
      {
        item: "pasta",
        quantity: "1 kg",
      },
      {
        item: "olio d'oliva",
        quantity: "500 ml",
      },
      {
        item: "spaghetti",
        quantity: "500g",
      },
      {
        item: "parmigiano",
        quantity: "200g",
      },
    ],
  },
  {
    Colazione: [
      {
        item: "cereali",
        quantity: "1 confezione",
      },
      {
        item: "latte",
        quantity: "2 litri",
      },
      {
        item: "banane",
        quantity: "4",
      },
    ],
    Pranzo: [
      {
        item: "pane integrale",
        quantity: "1 kg",
      },
      {
        item: "mozzarella",
        quantity: "500g",
      },
      {
        item: "pomodori",
        quantity: "1 kg",
      },
      {
        item: "insalata",
        quantity: "1 capo",
      },
    ],
    Cena: [
      {
        item: "pasta",
        quantity: "1 kg",
      },
      {
        item: "olio d'oliva",
        quantity: "500 ml",
      },
      {
        item: "spaghetti",
        quantity: "500g",
      },
      {
        item: "parmigiano",
        quantity: "200g",
      },
    ],
  },
  {
    Colazione: [
      {
        item: "succo d'arancia",
        quantity: "1 litro",
      },
      {
        item: "pane tostato",
        quantity: "1 pacchetto",
      },
      {
        item: "burro",
        quantity: "200g",
      },
    ],
    Pranzo: [
      {
        item: "riso",
        quantity: "1 kg",
      },
      {
        item: "verdure miste",
        quantity: "1 kg",
      },
      {
        item: "olio d'oliva",
        quantity: "500 ml",
      },
    ],
    Cena: [
      {
        item: "pollo",
        quantity: "1 kg",
      },
      {
        item: "patate",
        quantity: "1 kg",
      },
      {
        item: "insalata",
        quantity: "1 capo",
      },
      {
        item: "vino",
        quantity: "1 bottiglia",
      },
    ],
  },
  {
    Colazione: [
      {
        item: "succo d'arancia",
        quantity: "1 litro",
      },
      {
        item: "pane tostato",
        quantity: "1 pacchetto",
      },
      {
        item: "burro",
        quantity: "200g",
      },
    ],
    Pranzo: [
      {
        item: "riso",
        quantity: "1 kg",
      },
      {
        item: "verdure miste",
        quantity: "1 kg",
      },
      {
        item: "olio d'oliva",
        quantity: "500 ml",
      },
    ],
    Cena: [
      {
        item: "pollo",
        quantity: "1 kg",
      },
      {
        item: "patate",
        quantity: "1 kg",
      },
      {
        item: "insalata",
        quantity: "1 capo",
      },
      {
        item: "vino",
        quantity: "1 bottiglia",
      },
    ],
  },
];
