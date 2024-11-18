import { MenuData } from "@/types/types";

export const fakeOpenAiCall = (): Promise<{ object: MenuData }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        object: mockMealList,
      });
    }, 100); // Simulate network delay
  });
};

export const mockMealList = {
  menu: [
    {
      id: "colazioni",
      mealTypeName: "Colazioni",
      meals: [
        {
          id: "colazione1",
          mealName: "Colazione all'italiana",
          dishes: [
            {
              id: "piatto1",
              dishName: "Caffè e cornetti",
              ingredients: [
                {
                  id: "ingrediente1",
                  item: "☕ Caffè",
                  quantity: 5,
                  unit: "tazze",
                },
                {
                  id: "ingrediente2",
                  item: "🥐 Cornetti",
                  quantity: 5,
                  unit: "pezzi",
                },
              ],
            },
            {
              id: "piatto2",
              dishName: "Yogurt con frutta",
              ingredients: [
                {
                  id: "ingrediente3",
                  item: "🍓 Yogurt",
                  quantity: 5,
                  unit: "vasetti",
                },
                {
                  id: "ingrediente4",
                  item: "🍌 Frutta mista",
                  quantity: 1,
                  unit: "kg",
                },
              ],
            },
          ],
        },
        {
          id: "colazione2",
          mealName: "Colazione energetica",
          dishes: [
            {
              id: "piatto3",
              dishName: "Pancake con sciroppo",
              ingredients: [
                {
                  id: "ingrediente5",
                  item: "🥞 Pancake",
                  quantity: 10,
                  unit: "pezzi",
                },
                {
                  id: "ingrediente6",
                  item: "🍯 Sciroppo d'acero",
                  quantity: 1,
                  unit: "bottiglia",
                },
              ],
            },
            {
              id: "piatto4",
              dishName: "Frutta secca",
              ingredients: [
                {
                  id: "ingrediente7",
                  item: "🌰 Frutta secca",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "colazione3",
          mealName: "Colazione dolce",
          dishes: [
            {
              id: "piatto5",
              dishName: "Toast con marmellata",
              ingredients: [
                {
                  id: "ingrediente8",
                  item: "🍞 Pane",
                  quantity: 10,
                  unit: "fette",
                },
                {
                  id: "ingrediente9",
                  item: "🍇 Marmellata",
                  quantity: 1,
                  unit: "vasetto",
                },
              ],
            },
            {
              id: "piatto6",
              dishName: "Cappuccino",
              ingredients: [
                {
                  id: "ingrediente10",
                  item: "☕ Cappuccino",
                  quantity: 5,
                  unit: "tazze",
                },
              ],
            },
          ],
        },
        {
          id: "colazione4",
          mealName: "Colazione salata",
          dishes: [
            {
              id: "piatto7",
              dishName: "Frittata di verdure",
              ingredients: [
                {
                  id: "ingrediente11",
                  item: "🥚 Uova",
                  quantity: 10,
                  unit: "pezzi",
                },
                {
                  id: "ingrediente12",
                  item: "🥬 Verdure miste",
                  quantity: 300,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto8",
              dishName: "Pane tostato",
              ingredients: [
                {
                  id: "ingrediente13",
                  item: "🍞 Pane",
                  quantity: 5,
                  unit: "fette",
                },
              ],
            },
          ],
        },
        {
          id: "colazione5",
          mealName: "Colazione fresca",
          dishes: [
            {
              id: "piatto9",
              dishName: "Smoothie di frutta",
              ingredients: [
                {
                  id: "ingrediente14",
                  item: "🍌 Banana",
                  quantity: 5,
                  unit: "pezzi",
                },
                {
                  id: "ingrediente15",
                  item: "🍓 Fragole",
                  quantity: 300,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto10",
              dishName: "Granola",
              ingredients: [
                {
                  id: "ingrediente16",
                  item: "🥣 Granola",
                  quantity: 500,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "colazione6",
          mealName: "Colazione con cereali",
          dishes: [
            {
              id: "piatto11",
              dishName: "Cereali con latte",
              ingredients: [
                {
                  id: "ingrediente17",
                  item: "🥛 Latte",
                  quantity: 1,
                  unit: "litro",
                },
                {
                  id: "ingrediente18",
                  item: "🥣 Cereali",
                  quantity: 500,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto12",
              dishName: "Frutta fresca",
              ingredients: [
                {
                  id: "ingrediente19",
                  item: "🍏 Mela",
                  quantity: 5,
                  unit: "pezzi",
                },
              ],
            },
          ],
        },
        {
          id: "colazione7",
          mealName: "Colazione internazionale",
          dishes: [
            {
              id: "piatto13",
              dishName: "Bagel con cream cheese",
              ingredients: [
                {
                  id: "ingrediente20",
                  item: "🥯 Bagel",
                  quantity: 5,
                  unit: "pezzi",
                },
                {
                  id: "ingrediente21",
                  item: "🧀 Cream cheese",
                  quantity: 250,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto14",
              dishName: "Succo d'arancia",
              ingredients: [
                {
                  id: "ingrediente22",
                  item: "🍊 Succo d'arancia",
                  quantity: 1,
                  unit: "litro",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pranzi",
      mealTypeName: "Pranzi",
      meals: [
        {
          id: "pranzo1",
          mealName: "Pranzo di pasta",
          dishes: [
            {
              id: "piatto15",
              dishName: "Pasta al pomodoro",
              ingredients: [
                {
                  id: "ingrediente23",
                  item: "🍝 Pasta",
                  quantity: 500,
                  unit: "g",
                },
                {
                  id: "ingrediente24",
                  item: "🍅 Pomodori",
                  quantity: 400,
                  unit: "g",
                },
                {
                  id: "ingrediente25",
                  item: "🧄 Aglio",
                  quantity: 2,
                  unit: "spicchi",
                },
              ],
            },
            {
              id: "piatto16",
              dishName: "Insalata verde",
              ingredients: [
                {
                  id: "ingrediente26",
                  item: "🥗 Lattuga",
                  quantity: 200,
                  unit: "g",
                },
                {
                  id: "ingrediente27",
                  item: "🥒 Cetriolo",
                  quantity: 1,
                  unit: "pezzi",
                },
              ],
            },
          ],
        },
        {
          id: "pranzo2",
          mealName: "Pranzo mediterraneo",
          dishes: [
            {
              id: "piatto17",
              dishName: "Pasta alla pesto",
              ingredients: [
                {
                  id: "ingrediente28",
                  item: "🍝 Pasta",
                  quantity: 500,
                  unit: "g",
                },
                {
                  id: "ingrediente29",
                  item: "🌿 Basilico",
                  quantity: 100,
                  unit: "g",
                },
                {
                  id: "ingrediente30",
                  item: "🧄 Aglio",
                  quantity: 2,
                  unit: "spicchi",
                },
              ],
            },
            {
              id: "piatto18",
              dishName: "Caprese",
              ingredients: [
                {
                  id: "ingrediente31",
                  item: "🍅 Pomodori",
                  quantity: 400,
                  unit: "g",
                },
                {
                  id: "ingrediente32",
                  item: "🧀 Mozzarella",
                  quantity: 250,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "pranzo3",
          mealName: "Pranzo ricco",
          dishes: [
            {
              id: "piatto19",
              dishName: "Pasta alla carbonara",
              ingredients: [
                {
                  id: "ingrediente33",
                  item: "🍝 Pasta",
                  quantity: 500,
                  unit: "g",
                },
                {
                  id: "ingrediente34",
                  item: "🥓 Guanciale",
                  quantity: 200,
                  unit: "g",
                },
                {
                  id: "ingrediente35",
                  item: "🥚 Uova",
                  quantity: 4,
                  unit: "pezzi",
                },
              ],
            },
            {
              id: "piatto20",
              dishName: "Insalata di riso",
              ingredients: [
                {
                  id: "ingrediente36",
                  item: "🍚 Riso",
                  quantity: 300,
                  unit: "g",
                },
                {
                  id: "ingrediente37",
                  item: "🥕 Carote",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "pranzo4",
          mealName: "Pranzo estivo",
          dishes: [
            {
              id: "piatto21",
              dishName: "Pasta fredda",
              ingredients: [
                {
                  id: "ingrediente38",
                  item: "🍝 Pasta",
                  quantity: 500,
                  unit: "g",
                },
                {
                  id: "ingrediente39",
                  item: "🍅 Pomodori",
                  quantity: 300,
                  unit: "g",
                },
                {
                  id: "ingrediente40",
                  item: "🥒 Cetriolo",
                  quantity: 1,
                  unit: "pezzi",
                },
              ],
            },
            {
              id: "piatto22",
              dishName: "Insalata di tonno",
              ingredients: [
                {
                  id: "ingrediente41",
                  item: "🐟 Tonno in scatola",
                  quantity: 300,
                  unit: "g",
                },
                {
                  id: "ingrediente42",
                  item: "🥗 Lattuga",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "pranzo5",
          mealName: "Pranzo veloce",
          dishes: [
            {
              id: "piatto23",
              dishName: "Pasta al pesto",
              ingredients: [
                {
                  id: "ingrediente43",
                  item: "🍝 Pasta",
                  quantity: 500,
                  unit: "g",
                },
                {
                  id: "ingrediente44",
                  item: "🌿 Basilico",
                  quantity: 100,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto24",
              dishName: "Insalata di pomodori",
              ingredients: [
                {
                  id: "ingrediente45",
                  item: "🍅 Pomodori",
                  quantity: 400,
                  unit: "g",
                },
                {
                  id: "ingrediente46",
                  item: "🧄 Aglio",
                  quantity: 2,
                  unit: "spicchi",
                },
              ],
            },
          ],
        },
        {
          id: "pranzo6",
          mealName: "Pranzo rustico",
          dishes: [
            {
              id: "piatto25",
              dishName: "Pasta al tonno",
              ingredients: [
                {
                  id: "ingrediente47",
                  item: "🍝 Pasta",
                  quantity: 500,
                  unit: "g",
                },
                {
                  id: "ingrediente48",
                  item: "🐟 Tonno in scatola",
                  quantity: 300,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto26",
              dishName: "Insalata di fagioli",
              ingredients: [
                {
                  id: "ingrediente49",
                  item: "🥗 Fagioli",
                  quantity: 300,
                  unit: "g",
                },
                {
                  id: "ingrediente50",
                  item: "🥒 Cetriolo",
                  quantity: 1,
                  unit: "pezzi",
                },
              ],
            },
          ],
        },
        {
          id: "pranzo7",
          mealName: "Pranzo classico",
          dishes: [
            {
              id: "piatto27",
              dishName: "Pasta al ragù",
              ingredients: [
                {
                  id: "ingrediente51",
                  item: "🍝 Pasta",
                  quantity: 500,
                  unit: "g",
                },
                {
                  id: "ingrediente52",
                  item: "🍖 Carne macinata",
                  quantity: 300,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto28",
              dishName: "Insalata mista",
              ingredients: [
                {
                  id: "ingrediente53",
                  item: "🥗 Lattuga",
                  quantity: 200,
                  unit: "g",
                },
                {
                  id: "ingrediente54",
                  item: "🥕 Carote",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "cene",
      mealTypeName: "Cene",
      meals: [
        {
          id: "cena1",
          mealName: "Cena di pesce",
          dishes: [
            {
              id: "piatto29",
              dishName: "Filetti di pesce alla griglia",
              ingredients: [
                {
                  id: "ingrediente55",
                  item: "🐟 Filetti di pesce",
                  quantity: 500,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto30",
              dishName: "Verdure grigliate",
              ingredients: [
                {
                  id: "ingrediente56",
                  item: "🥦 Broccoli",
                  quantity: 300,
                  unit: "g",
                },
                {
                  id: "ingrediente57",
                  item: "🥕 Carote",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "cena2",
          mealName: "Cena di carne",
          dishes: [
            {
              id: "piatto31",
              dishName: "Pollo alla griglia",
              ingredients: [
                {
                  id: "ingrediente58",
                  item: "🍗 Pollo",
                  quantity: 500,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto32",
              dishName: "Insalata di spinaci",
              ingredients: [
                {
                  id: "ingrediente59",
                  item: "🥗 Spinaci",
                  quantity: 200,
                  unit: "g",
                },
                {
                  id: "ingrediente60",
                  item: "🍅 Pomodori",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "cena3",
          mealName: "Cena vegetariana",
          dishes: [
            {
              id: "piatto33",
              dishName: "Burger di lenticchie",
              ingredients: [
                {
                  id: "ingrediente61",
                  item: "🍔 Lenticchie",
                  quantity: 300,
                  unit: "g",
                },
                {
                  id: "ingrediente62",
                  item: "🥬 Insalata",
                  quantity: 100,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto34",
              dishName: "Verdure al vapore",
              ingredients: [
                {
                  id: "ingrediente63",
                  item: "🥦 Broccoli",
                  quantity: 300,
                  unit: "g",
                },
                {
                  id: "ingrediente64",
                  item: "🥕 Carote",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "cena4",
          mealName: "Cena rustica",
          dishes: [
            {
              id: "piatto35",
              dishName: "Salsiccia alla griglia",
              ingredients: [
                {
                  id: "ingrediente65",
                  item: "🌭 Salsiccia",
                  quantity: 500,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto36",
              dishName: "Patate al rosmarino",
              ingredients: [
                {
                  id: "ingrediente67",
                  item: "🥔 Patate",
                  quantity: 500,
                  unit: "g",
                },
                {
                  id: "ingrediente68",
                  item: "🌿 Rosmarino",
                  quantity: 50,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "cena5",
          mealName: "Cena leggera",
          dishes: [
            {
              id: "piatto37",
              dishName: "Insalata di pollo",
              ingredients: [
                {
                  id: "ingrediente69",
                  item: "🍗 Pollo",
                  quantity: 300,
                  unit: "g",
                },
                {
                  id: "ingrediente70",
                  item: "🥗 Lattuga",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto38",
              dishName: "Verdure miste",
              ingredients: [
                {
                  id: "ingrediente71",
                  item: "🥦 Broccoli",
                  quantity: 200,
                  unit: "g",
                },
                {
                  id: "ingrediente72",
                  item: "🥕 Carote",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
          ],
        },
        {
          id: "cena6",
          mealName: "Cena con pasta",
          dishes: [
            {
              id: "piatto39",
              dishName: "Pasta al pomodoro",
              ingredients: [
                {
                  id: "ingrediente73",
                  item: "🍝 Pasta",
                  quantity: 500,
                  unit: "g",
                },
                {
                  id: "ingrediente74",
                  item: "🍅 Pomodori",
                  quantity: 400,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto40",
              dishName: "Insalata verde",
              ingredients: [
                {
                  id: "ingrediente75",
                  item: "🥗 Lattuga",
                  quantity: 200,
                  unit: "g",
                },
                {
                  id: "ingrediente76",
                  item: "🥒 Cetriolo",
                  quantity: 1,
                  unit: "pezzi",
                },
              ],
            },
          ],
        },
        {
          id: "cena7",
          mealName: "Cena di pesce e verdure",
          dishes: [
            {
              id: "piatto41",
              dishName: "Gamberetti in padella",
              ingredients: [
                {
                  id: "ingrediente77",
                  item: "🍤 Gamberetti",
                  quantity: 500,
                  unit: "g",
                },
              ],
            },
            {
              id: "piatto42",
              dishName: "Verdure miste al vapore",
              ingredients: [
                {
                  id: "ingrediente78",
                  item: "🥦 Broccoli",
                  quantity: 300,
                  unit: "g",
                },
                {
                  id: "ingrediente79",
                  item: "🥕 Carote",
                  quantity: 200,
                  unit: "g",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
