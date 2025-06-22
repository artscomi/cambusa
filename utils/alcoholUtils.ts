import { Ingredient } from "@/types/types";

// Helper function to get the correct unit form
const getBottleUnit = (quantity: number): string => {
  return quantity > 1 ? "bottiglie" : "bottiglia";
};

export const generateAlcoholIngredients = (
  alcoholPreferences: string,
  people: number = 1,
  days: number = 1
): Ingredient[] => {
  const ingredients: Ingredient[] = [];

  console.log(
    "generateAlcoholIngredients called with:",
    alcoholPreferences,
    "people:",
    people,
    "days:",
    days
  );

  if (!alcoholPreferences || alcoholPreferences.trim() === "") {
    console.log("No alcohol preferences provided, returning empty array");
    return ingredients;
  }

  const preferences = alcoholPreferences.toLowerCase();
  console.log("Processing preferences:", preferences);

  // Calculate wine bottles: 1 bottle per person every 7 days
  const wineBottles = people * Math.ceil(days / 7);

  // Vino bianco
  if (preferences.includes("vino bianco") || preferences.includes("bianco")) {
    console.log("Adding white wine");
    ingredients.push({
      id: "alcohol_white_wine",
      item: "🍷 Vino bianco",
      quantity: wineBottles,
      unit: getBottleUnit(wineBottles),
    });
  }

  // Vino rosso
  if (preferences.includes("vino rosso") || preferences.includes("rosso")) {
    console.log("Adding red wine");
    ingredients.push({
      id: "alcohol_red_wine",
      item: "🍷 Vino rosso",
      quantity: wineBottles,
      unit: getBottleUnit(wineBottles),
    });
  }

  // Prosecco/Spumante
  if (
    preferences.includes("prosecco") ||
    preferences.includes("spumante") ||
    preferences.includes("champagne")
  ) {
    console.log("Adding prosecco");
    ingredients.push({
      id: "alcohol_prosecco",
      item: "🥂 Prosecco",
      quantity: wineBottles,
      unit: getBottleUnit(wineBottles),
    });
  }

  // Birra - 2 birre per persona per giorno
  if (preferences.includes("birra") || preferences.includes("beer")) {
    console.log("Adding beer");
    const beerBottles = people * days * 2;
    ingredients.push({
      id: "alcohol_beer",
      item: "🍺 Birra",
      quantity: beerBottles,
      unit: getBottleUnit(beerBottles),
    });
  }

  // Aperitivi - 1 bottiglia per gruppo ogni 7 giorni
  if (
    preferences.includes("aperitivo") ||
    preferences.includes("aperol") ||
    preferences.includes("campari")
  ) {
    console.log("Adding aperitif");
    const aperitifBottles = Math.ceil(days / 7);
    ingredients.push({
      id: "alcohol_aperitif",
      item: "🍹 Aperol",
      quantity: aperitifBottles,
      unit: getBottleUnit(aperitifBottles),
    });
  }

  // Limoncello - 1 bottiglia per gruppo ogni 3 giorni
  if (preferences.includes("limoncello") || preferences.includes("digestivo")) {
    console.log("Adding limoncello");
    const limoncelloBottles = Math.ceil(days / 3);
    ingredients.push({
      id: "alcohol_limoncello",
      item: "🍋 Limoncello",
      quantity: limoncelloBottles,
      unit: getBottleUnit(limoncelloBottles),
    });
  }

  // Gin - 1 bottiglia per gruppo ogni 7 giorni
  if (preferences.includes("gin") || preferences.includes("tonic")) {
    console.log("Adding gin and tonic");
    const ginBottles = Math.ceil(days / 7);
    ingredients.push({
      id: "alcohol_gin",
      item: "🥃 Gin",
      quantity: ginBottles,
      unit: getBottleUnit(ginBottles),
    });
    ingredients.push({
      id: "alcohol_tonic",
      item: "🥤 Acqua tonica",
      quantity: ginBottles * 6, // 6 lattine per bottiglia di gin
      unit: "lattine",
    });
  }

  // Vodka - 1 bottiglia per gruppo ogni 7 giorni
  if (preferences.includes("vodka")) {
    console.log("Adding vodka");
    const vodkaBottles = Math.ceil(days / 7);
    ingredients.push({
      id: "alcohol_vodka",
      item: "🥃 Vodka",
      quantity: vodkaBottles,
      unit: getBottleUnit(vodkaBottles),
    });
  }

  // Rum - 1 bottiglia per gruppo ogni 7 giorni
  if (preferences.includes("rum")) {
    console.log("Adding rum");
    const rumBottles = Math.ceil(days / 7);
    ingredients.push({
      id: "alcohol_rum",
      item: "🥃 Rum",
      quantity: rumBottles,
      unit: getBottleUnit(rumBottles),
    });
  }

  // Whisky - 1 bottiglia per gruppo ogni 7 giorni
  if (preferences.includes("whisky") || preferences.includes("whiskey")) {
    console.log("Adding whisky");
    const whiskyBottles = Math.ceil(days / 7);
    ingredients.push({
      id: "alcohol_whisky",
      item: "🥃 Whisky",
      quantity: whiskyBottles,
      unit: getBottleUnit(whiskyBottles),
    });
  }

  // Se non ci sono preferenze specifiche ma non si esclude l'alcol, aggiungi vino bianco e rosso
  if (
    ingredients.length === 0 &&
    !preferences.includes("non bevo") &&
    !preferences.includes("niente alcolici")
  ) {
    console.log("No specific preferences found, adding default wines");
    ingredients.push({
      id: "alcohol_white_wine_default",
      item: "🍷 Vino bianco",
      quantity: wineBottles,
      unit: getBottleUnit(wineBottles),
    });
    ingredients.push({
      id: "alcohol_red_wine_default",
      item: "🍷 Vino rosso",
      quantity: Math.ceil(wineBottles / 2),
      unit: getBottleUnit(Math.ceil(wineBottles / 2)),
    });
  }

  console.log("Final alcohol ingredients:", ingredients);
  return ingredients;
};

export const generateWaterIngredients = (
  waterPreference: string,
  people: number = 1,
  days: number = 1
): Ingredient[] => {
  const ingredients: Ingredient[] = [];

  console.log(
    "generateWaterIngredients called with:",
    waterPreference,
    "people:",
    people,
    "days:",
    days
  );

  // Calculate total bottles needed: 2 bottles per person per day
  const totalBottles = people * days * 2;

  if (!waterPreference || waterPreference.trim() === "") {
    console.log("No water preference provided, adding default water");
    ingredients.push({
      id: "water_natural_default",
      item: "💧 Acqua naturale",
      quantity: totalBottles,
      unit: getBottleUnit(totalBottles),
    });
    return ingredients;
  }

  const preferences = waterPreference.toLowerCase();
  console.log("Processing water preferences:", preferences);

  // Acqua naturale
  if (preferences === "naturale") {
    console.log("Adding natural water");
    ingredients.push({
      id: "water_natural",
      item: "💧 Acqua naturale",
      quantity: totalBottles,
      unit: getBottleUnit(totalBottles),
    });
  }

  // Acqua gassata
  if (preferences === "gassata") {
    console.log("Adding sparkling water");
    ingredients.push({
      id: "water_sparkling",
      item: "💧 Acqua gassata",
      quantity: totalBottles,
      unit: getBottleUnit(totalBottles),
    });
  }

  // Indifferente - aggiungi entrambe (metà per tipo)
  if (preferences === "indifferente") {
    console.log("Adding both types of water");
    const bottlesPerType = Math.ceil(totalBottles / 2);
    ingredients.push({
      id: "water_natural_indifferent",
      item: "💧 Acqua naturale",
      quantity: bottlesPerType,
      unit: getBottleUnit(bottlesPerType),
    });
    ingredients.push({
      id: "water_sparkling_indifferent",
      item: "💧 Acqua gassata",
      quantity: bottlesPerType,
      unit: getBottleUnit(bottlesPerType),
    });
  }

  // Se non ci sono preferenze specifiche, aggiungi acqua naturale di default
  if (ingredients.length === 0) {
    console.log(
      "No specific water preferences found, adding default natural water"
    );
    ingredients.push({
      id: "water_natural_default",
      item: "💧 Acqua naturale",
      quantity: totalBottles,
      unit: getBottleUnit(totalBottles),
    });
  }

  console.log("Final water ingredients:", ingredients);
  return ingredients;
};

// Function to generate alcohol ingredients based on individual group preferences
export const generateGroupAlcoholIngredients = (
  alcoholPreferences: Array<{
    userId: string;
    preference: string;
    user: { name: string };
  }>,
  people: number = 1,
  days: number = 1
): Ingredient[] => {
  const ingredients: Ingredient[] = [];

  console.log(
    "generateGroupAlcoholIngredients called with:",
    alcoholPreferences,
    "people:",
    people,
    "days:",
    days
  );

  if (!alcoholPreferences || alcoholPreferences.length === 0) {
    console.log("No alcohol preferences provided, returning empty array");
    return ingredients;
  }

  // Calculate wine bottles: 1 bottle per person every 7 days
  const wineBottles = people * Math.ceil(days / 7);

  // Count preferences for each type of alcohol
  const preferenceCounts = {
    whiteWine: 0,
    redWine: 0,
    prosecco: 0,
    beer: 0,
    aperitif: 0,
    limoncello: 0,
    gin: 0,
    vodka: 0,
    rum: 0,
    whisky: 0,
    noAlcohol: 0,
  };

  // Analyze each user's preferences
  alcoholPreferences.forEach(({ preference }) => {
    const pref = preference.toLowerCase();

    if (pref.includes("non bevo") || pref.includes("niente alcolici")) {
      preferenceCounts.noAlcohol++;
    } else {
      if (pref.includes("vino bianco") || pref.includes("bianco"))
        preferenceCounts.whiteWine++;
      if (pref.includes("vino rosso") || pref.includes("rosso"))
        preferenceCounts.redWine++;
      if (
        pref.includes("prosecco") ||
        pref.includes("spumante") ||
        pref.includes("champagne")
      )
        preferenceCounts.prosecco++;
      if (pref.includes("birra") || pref.includes("beer"))
        preferenceCounts.beer++;
      if (
        pref.includes("aperitivo") ||
        pref.includes("aperol") ||
        pref.includes("campari")
      )
        preferenceCounts.aperitif++;
      if (pref.includes("limoncello") || pref.includes("digestivo"))
        preferenceCounts.limoncello++;
      if (pref.includes("gin") || pref.includes("tonic"))
        preferenceCounts.gin++;
      if (pref.includes("vodka")) preferenceCounts.vodka++;
      if (pref.includes("rum")) preferenceCounts.rum++;
      if (pref.includes("whisky") || pref.includes("whiskey"))
        preferenceCounts.whisky++;
    }
  });

  const totalUsers = alcoholPreferences.length;
  const drinkersCount = totalUsers - preferenceCounts.noAlcohol;

  // Only add alcohol if there are drinkers
  if (drinkersCount > 0) {
    // Calculate quantities based on preference percentages
    const wineBottlesPerDrinker = wineBottles / drinkersCount;

    // Vino bianco - proportional to preferences
    if (preferenceCounts.whiteWine > 0) {
      const whiteWineBottles = Math.ceil(
        wineBottlesPerDrinker * preferenceCounts.whiteWine
      );
      ingredients.push({
        id: "alcohol_white_wine_group",
        item: "🍷 Vino bianco",
        quantity: whiteWineBottles,
        unit: getBottleUnit(whiteWineBottles),
      });
    }

    // Vino rosso - proportional to preferences
    if (preferenceCounts.redWine > 0) {
      const redWineBottles = Math.ceil(
        wineBottlesPerDrinker * preferenceCounts.redWine
      );
      ingredients.push({
        id: "alcohol_red_wine_group",
        item: "🍷 Vino rosso",
        quantity: redWineBottles,
        unit: getBottleUnit(redWineBottles),
      });
    }

    // Prosecco - proportional to preferences
    if (preferenceCounts.prosecco > 0) {
      const proseccoBottles = Math.ceil(
        wineBottlesPerDrinker * preferenceCounts.prosecco
      );
      ingredients.push({
        id: "alcohol_prosecco_group",
        item: "🥂 Prosecco",
        quantity: proseccoBottles,
        unit: getBottleUnit(proseccoBottles),
      });
    }

    // Birra - 2 birre per bevitore per giorno
    if (preferenceCounts.beer > 0) {
      const beerBottles = drinkersCount * days * 2;
      ingredients.push({
        id: "alcohol_beer_group",
        item: "🍺 Birra",
        quantity: beerBottles,
        unit: getBottleUnit(beerBottles),
      });
    }

    // Aperitivi - 1 bottiglia per gruppo ogni 2 giorni
    if (preferenceCounts.aperitif > 0) {
      const aperitifBottles = Math.ceil(days / 2);
      ingredients.push({
        id: "alcohol_aperitif_group",
        item: "🍹 Aperol",
        quantity: aperitifBottles,
        unit: getBottleUnit(aperitifBottles),
      });
    }

    // Limoncello - 1 bottiglia per gruppo ogni 3 giorni
    if (preferenceCounts.limoncello > 0) {
      const limoncelloBottles = Math.ceil(days / 3);
      ingredients.push({
        id: "alcohol_limoncello_group",
        item: "🍋 Limoncello",
        quantity: limoncelloBottles,
        unit: getBottleUnit(limoncelloBottles),
      });
    }

    // Gin - 1 bottiglia per gruppo ogni 4 giorni
    if (preferenceCounts.gin > 0) {
      const ginBottles = Math.ceil(days / 4);
      ingredients.push({
        id: "alcohol_gin_group",
        item: "🥃 Gin",
        quantity: ginBottles,
        unit: getBottleUnit(ginBottles),
      });
      ingredients.push({
        id: "alcohol_tonic_group",
        item: "🥤 Acqua tonica",
        quantity: ginBottles * 6,
        unit: "lattine",
      });
    }

    // Vodka - 1 bottiglia per gruppo ogni 4 giorni
    if (preferenceCounts.vodka > 0) {
      const vodkaBottles = Math.ceil(days / 4);
      ingredients.push({
        id: "alcohol_vodka_group",
        item: "🥃 Vodka",
        quantity: vodkaBottles,
        unit: getBottleUnit(vodkaBottles),
      });
    }

    // Rum - 1 bottiglia per gruppo ogni 4 giorni
    if (preferenceCounts.rum > 0) {
      const rumBottles = Math.ceil(days / 4);
      ingredients.push({
        id: "alcohol_rum_group",
        item: "🥃 Rum",
        quantity: rumBottles,
        unit: getBottleUnit(rumBottles),
      });
    }

    // Whisky - 1 bottiglia per gruppo ogni 4 giorni
    if (preferenceCounts.whisky > 0) {
      const whiskyBottles = Math.ceil(days / 4);
      ingredients.push({
        id: "alcohol_whisky_group",
        item: "🥃 Whisky",
        quantity: whiskyBottles,
        unit: getBottleUnit(whiskyBottles),
      });
    }

    // If no specific preferences but people drink, add default wines
    if (ingredients.length === 0) {
      console.log("No specific preferences found, adding default wines");
      ingredients.push({
        id: "alcohol_white_wine_default_group",
        item: "🍷 Vino bianco",
        quantity: wineBottles,
        unit: getBottleUnit(wineBottles),
      });
      ingredients.push({
        id: "alcohol_red_wine_default_group",
        item: "🍷 Vino rosso",
        quantity: Math.ceil(wineBottles / 2),
        unit: getBottleUnit(Math.ceil(wineBottles / 2)),
      });
    }
  }

  console.log("Final group alcohol ingredients:", ingredients);
  return ingredients;
};
