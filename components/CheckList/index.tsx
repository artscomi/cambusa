import {
  containerVariantsShoppingList,
  itemVariantsShoppingList,
} from "@/animations/framer-variants";
import { Ingredient } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Icon } from "../Icons";
import Toast from "../Toast";

const Checklist: React.FC<{ items: Ingredient[] }> = ({ items }) => {
  const [showToast, setShowToast] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCheckboxChange(id);
    }
  };

  return (
    <AnimatePresence>
      <div className="flex flex-col lg:flex-row justify-between pb-20 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            La tua Lista della Spesa
          </h1>
          <p className="text-lg text-gray-600">
            Copia e incollala dove vuoi per utilizzarla o condividerla con il
            resto della ciurma!
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCopyToClipboard}
          className="p-4  rounded bg-white hover:bg-gray-100 shadow-sm"
        >
          <Icon.Copy
            role="img"
            aria-label="copy to clipboard"
            height={25}
            width={25}
          />
        </motion.button>
      </div>

      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariantsShoppingList}
      >
        {items?.map((item) => (
          <motion.li
            role="listitem"
            tabIndex={0}
            variants={itemVariantsShoppingList}
            onClick={() => handleCheckboxChange(item.id)}
            key={item.id}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            className="cursor-pointer flex items-center justify-between bg-white rounded-lg px-5 py-4 shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            <label className="flex items-center">
              <input
                tabIndex={-1}
                onChange={() => handleCheckboxChange(item.id)}
                type="checkbox"
                className="mr-3 h-6 w-6 text-blue-600 rounded focus:ring-blue-500 focus:ring-opacity-50"
                checked={!!checkedItems[item.id]}
              />
              {`${item.item} - ${item.quantity} ${item.unit}`}
            </label>
          </motion.li>
        ))}
      </motion.ul>

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
