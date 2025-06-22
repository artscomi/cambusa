import {
  containerVariantsShoppingList,
  itemVariantsShoppingList,
} from "@/animations/framer-variants";
import { Ingredient } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Toast from "../Toast";
import { Clipboard, Share2, Wine, Utensils, Droplets } from "lucide-react";

const Checklist: React.FC<{ items: Ingredient[] }> = ({ items }) => {
  const [showToast, setShowToast] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Separate water ingredients from other ingredients
  const waterIngredients = items.filter(
    (item) => item.id.startsWith("water_") || item.item.includes("💧")
  );

  // Separate alcohol ingredients from food ingredients
  const alcoholIngredients = items.filter(
    (item) =>
      (item.id.startsWith("alcohol_") ||
        item.item.includes("🍷") ||
        item.item.includes("🥂") ||
        item.item.includes("🍺") ||
        item.item.includes("🍹") ||
        item.item.includes("🥃") ||
        item.item.includes("🥤")) &&
      !item.id.startsWith("water_") &&
      !item.item.includes("💧")
  );

  const foodIngredients = items.filter(
    (item) =>
      !item.id.startsWith("alcohol_") &&
      !item.id.startsWith("water_") &&
      !item.item.includes("🍷") &&
      !item.item.includes("🥂") &&
      !item.item.includes("🍺") &&
      !item.item.includes("🍹") &&
      !item.item.includes("🥃") &&
      !item.item.includes("🥤") &&
      !item.item.includes("💧")
  );

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleCopyToClipboard = () => {
    const listText = items
      .map((item) => `${item.item} - ${item.quantity} ${item.unit}`)
      .join("\n");

    navigator.clipboard.writeText(listText).then(() => setShowToast(true));
  };

  const handleShare = async () => {
    const listText = items
      .map((item) => `${item.item} - ${item.quantity} ${item.unit}`)
      .join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "La mia lista della spesa",
          text: listText,
        });
      } else {
        // Fallback to clipboard if Web Share API is not supported
        handleCopyToClipboard();
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCheckboxChange(id);
    }
  };

  const renderIngredientList = (
    ingredients: Ingredient[],
    title: string,
    icon: React.ReactNode
  ) => {
    if (ingredients.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <motion.ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariantsShoppingList}
        >
          {ingredients.map((item) => (
            <motion.li
              whileHover={{ scale: 0.98 }}
              role="listitem"
              tabIndex={0}
              variants={itemVariantsShoppingList}
              onClick={() => handleCheckboxChange(item.id)}
              key={item.id}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className="cursor-pointer flex items-center justify-between bg-white rounded-lg px-5 py-4 shadow-md transition-all duration-300"
            >
              <label className="flex items-center cursor-pointer ">
                <input
                  tabIndex={-1}
                  onChange={() => handleCheckboxChange(item.id)}
                  type="checkbox"
                  style={{
                    accentColor: "var(--accent-light)",
                    width: "1.5rem",
                    height: "1.5rem",
                    marginRight: "0.75rem",
                    cursor: "pointer",
                    pointerEvents: "none",
                  }}
                  className="rounded"
                  checked={!!checkedItems[item.id]}
                />
                {`${item.item} - ${item.quantity} ${item.unit}`}
              </label>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="flex flex-col lg:flex-row justify-between pb-8 items-center">
        <div className="text-center lg:text-left">
          <h1>La tua lista della spesa</h1>
          <p className="text-l">
            Condividi la lista con il resto della ciurma o copiala nei tuoi
            appunti!
          </p>
        </div>
        <div className="flex gap-2 fixed max-sm:bottom-10 bottom-auto sm:top-32 right-10 sm:right-[135px] z-10">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="p-4 rounded bg-primary text-white shadow-md"
          >
            <Share2
              role="img"
              aria-label="condividi lista"
              height={25}
              width={25}
            />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCopyToClipboard}
            className="p-4 rounded bg-primary text-white shadow-md"
          >
            <Clipboard
              role="img"
              aria-label="copia negli appunti"
              height={25}
              width={25}
            />
          </motion.button>
        </div>
      </div>

      {/* Food Ingredients Section */}
      {renderIngredientList(
        foodIngredients,
        "Ingredienti per i pasti",
        <Utensils className="w-6 h-6" />
      )}

      {/* Water Ingredients Section */}
      {renderIngredientList(
        waterIngredients,
        "Acqua",
        <Droplets className="w-6 h-6" />
      )}

      {/* Alcohol Ingredients Section */}
      {renderIngredientList(
        alcoholIngredients,
        "Bevande alcoliche",
        <Wine className="w-6 h-6" />
      )}

      <Toast
        message={"Lista della spesa copiata nei tuoi appunti!"}
        type="info"
        onClose={() => setShowToast(false)}
        showToast={showToast}
      />
    </AnimatePresence>
  );
};

export default Checklist;
