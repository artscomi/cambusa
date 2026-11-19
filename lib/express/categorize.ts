/**
 * Categorie della lista Express, nell'ordine in cui compaiono
 * (più o meno l'ordine di un giro al supermercato).
 */
export const EXPRESS_CATEGORIES = [
  "Frutta e verdura",
  "Pane e colazione",
  "Pasta, riso e dispensa",
  "Carne e pesce",
  "Latticini e uova",
  "Snack e dolci",
  "Bevande",
  "Casa e bagno",
  "Altro",
] as const;

export type ExpressCategory = (typeof EXPRESS_CATEGORIES)[number];

const KEYWORDS: Record<Exclude<ExpressCategory, "Altro">, string[]> = {
  "Frutta e verdura": [
    "mel", "pera", "pere", "banan", "aranc", "mandarin", "limon", "pesc",
    "albicocc", "fragol", "anguri", "melon", "uva", "kiwi", "ananas", "frutta",
    "pomodor", "zucchin", "melanzan", "peperon", "cipoll", "aglio", "patat",
    "carot", "insalat", "lattug", "rucola", "cetriol", "cavol", "verza",
    "zucca", "finocch", "sedano", "basilic", "prezzemol", "verdur", "avocado",
    "olive",
  ],
  "Pane e colazione": [
    "pane", "pancarr", "piadin", "fette biscottate", "gallett", "cracker",
    "grissin", "taralli", "cornett", "brioche", "cereali", "muesli",
    "marmellat", "confettur", "miele", "nutella", "crema spalmabile",
  ],
  "Pasta, riso e dispensa": [
    "pasta", "spaghett", "penne", "fusill", "riso", "cous", "farro", "orzo",
    "farina", "legum", "ceci", "lenticch", "fagiol", "tonno", "sgombr",
    "pelati", "passata", "sugo", "pesto", "olio", "aceto", "sale", "pepe",
    "zucchero", "spezie", "dado", "brodo", "scatolett", "mais", "capperi",
    "maionese", "ketchup", "senape",
  ],
  "Carne e pesce": [
    "carne", "pollo", "tacchino", "manzo", "maiale", "salsicc", "hamburger",
    "wurstel", "prosciutt", "salame", "speck", "bresaola", "mortadell",
    "pancett", "affettat", "pesce", "salmone", "gamber", "cozze", "vongole",
    "calamar", "polpo",
  ],
  "Latticini e uova": [
    "latte", "yogurt", "burro", "formagg", "parmigian", "grana", "pecorin",
    "mozzarell", "stracchin", "ricott", "feta", "philadelphia", "panna",
    "uova", "uovo",
  ],
  "Snack e dolci": [
    "biscott", "patatin", "chips", "snack", "barrett", "cioccolat",
    "caramell", "gelat", "dolc", "torta", "frutta secca", "mandorl", "noci",
    "arachid", "pistacch", "popcorn",
  ],
  Bevande: [
    "acqua", "birra", "vino", "prosecco", "spritz", "aperol", "gin", "rum",
    "vodka", "liquor", "amaro", "succo", "coca", "cola", "aranciata", "tè",
    "the ", "tisan", "caffè", "caffe", "bibit", "tonica", "ghiaccio",
  ],
  "Casa e bagno": [
    "carta", "scottex", "tovagliol", "piatti", "bicchier", "posate",
    "sacchett", "spazzatura", "detersiv", "sapone", "shampoo", "dentifric",
    "spugn", "crema solare", "solare", "pellicol", "alluminio", "accendin",
    "fiammifer", "pile", "batteri",
  ],
};

/** Assegna una categoria a un prodotto scritto a mano ("2 kg di pomodori" → Frutta e verdura). */
export function categorizeExpressItem(text: string): ExpressCategory {
  const normalized = ` ${text.toLowerCase().trim()} `;
  // Le frasi più lunghe vincono ("frutta secca" prima di "frutta", "crema solare" prima di "crema")
  let best: { category: ExpressCategory; length: number } | null = null;
  for (const [category, words] of Object.entries(KEYWORDS)) {
    for (const word of words) {
      if (normalized.includes(word) && (!best || word.length > best.length)) {
        best = { category: category as ExpressCategory, length: word.length };
      }
    }
  }
  return best?.category ?? "Altro";
}
