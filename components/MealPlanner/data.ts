import { MenuData } from "@/types/types";

export const mockShoppingList: MenuData = {
  Colazioni: {
    "Colazione vegetariana": {
      "Fruit Salad": [
        { item: "🍎 Mela", quantity: "2" },
        { item: "🍊 Arancia", quantity: "1" },
        { item: "🍌 Banana", quantity: "1" },
      ],
      "Smoothie verde": [
        { item: "🥦 Cavolo", quantity: "1 pezzo" },
        { item: "🥒 Cetriolo", quantity: "1" },
        { item: "🍏 Mela verde", quantity: "1" },
      ],
    },
    "Colazione tradizionale": {
      "Pane e Nutella": [
        { item: "🍞 Pane", quantity: "4 fette" },
        { item: "🍫 Nutella", quantity: "4 cucchiai" },
      ],
      "Yogurt e miele": [
        { item: "🍯 Miele", quantity: "4 cucchiai" },
        { item: "🥛 Yogurt", quantity: "2 vaschette" },
      ],
    },
  },
  Pranzi: {
    "Pranzo pasta": {
      "Spaghetti al Pomodoro": [
        { item: "🍝 Spaghetti", quantity: "200 grammi" },
        { item: "🍅 Pomodori", quantity: "400 grammi" },
      ],
      "Insalata verde": [
        { item: "🥬 Lattuga", quantity: "1 mazzo" },
        { item: "🥒 Cetriolo", quantity: "1" },
        { item: "🍅 Pomodori", quantity: "2" },
      ],
    },
    "Pranzo riso": {
      "Riso con verdure": [
        { item: "🍚 Riso", quantity: "200 grammi" },
        { item: "🌽 Mais", quantity: "1 lattina" },
        { item: "🥦 Broccoli", quantity: "200 grammi" },
      ],
    },
    "Pranzo panini": {
      "Panino con hamburger": [
        { item: "🥖 Pane hamburger", quantity: "2" },
        { item: "🍔 Carne", quantity: "2 hamburger" },
        { item: "🧀 Formaggio", quantity: "2 fette" },
        { item: "🍅 Pomodoro", quantity: "2 fette" },
      ],
    },
  },
  Cene: {
    "Cena mare": {
      "Gamberi alla griglia": [
        { item: "🍤 Gamberi", quantity: "1kg" },
        { item: "🍋 Limone", quantity: "1" },
        { item: "🍃 Prezzemolo", quantity: "1 mazzo" },
      ],
    },
    "Cena campagna": {
      "Bistecca alla griglia": [
        { item: "🥩 Bistecca", quantity: "2" },
        { item: "🥔 Patate", quantity: "4" },
        { item: "🥕 Carote", quantity: "2" },
      ],
    },
    "Cena vegetariana": {
      "Insalata di legumi": [
        { item: "🌽 Mais", quantity: "1 lattina" },
        { item: "🧄 Aglio", quantity: "1 spicchio" },
        { item: "🥬 Lattuga", quantity: "1 mazzo" },
      ],
      "Tofu alla griglia": [
        { item: "🍲 Tofu", quantity: "200 grammi" },
        { item: "🍋 Limone", quantity: "1" },
        { item: "🍊 Arancia", quantity: "1" },
      ],
    },
  },
};
