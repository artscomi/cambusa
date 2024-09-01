import { MenuData } from "@/types/types";

export const mockShoppingList: MenuData = {
  Colazioni: {
    "Colazione 1": {
      "Nome del piatto 1": [
        { item: "Nome ingrediente 1", quantity: "Quantità ingrediente 1" },
        { item: "Nome ingrediente 2", quantity: "Quantità ingrediente 2" },
      ],
      "Nome del piatto 2": [
        { item: "Nome ingrediente 1", quantity: "Quantità ingrediente 1" },
      ],
    },
    "Colazione 2": {
      "Nome del piatto 1": [
        { item: "Nome ingrediente 1", quantity: "Quantità ingrediente 1" },
      ],
    },
  },
  Pranzi: {
    "Pranzo 1": {
      "Nome del piatto 1": [
        { item: "Nome ingrediente 1", quantity: "Quantità ingrediente 1" },
        { item: "Nome ingrediente 2", quantity: "Quantità ingrediente 2" },
      ],
      "Nome del piatto 2": [
        { item: "Nome ingrediente 1", quantity: "Quantità ingrediente 1" },
      ],
    },
    "Pranzo 2": {
      "Nome del piatto 1": [
        { item: "Nome ingrediente 1", quantity: "Quantità ingrediente 1" },
      ],
    },
  },
  Cene: {
    "Cena 1": {
      "Nome del piatto 1": [
        { item: "Nome ingrediente 1", quantity: "Quantità ingrediente 1" },
        { item: "Nome ingrediente 2", quantity: "Quantità ingrediente 2" },
      ],
      "Nome del piatto 2": [
        { item: "Nome ingrediente 1", quantity: "Quantità ingrediente 1" },
      ],
    },
    "Cena 2": {
      "Nome del piatto 1": [
        { item: "Nome ingrediente 1", quantity: "Quantità ingrediente 1" },
      ],
    },
  },
};
