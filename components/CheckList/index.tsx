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
      <div className="bg-white p-5 rounded-lg shadow-md mt-8">
        <div className="flex justify-between p-10 items-center">
          <h1 className="text-3xl text-gray-800 text-center m-auto">
            Lista della Spesa
          </h1>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCopyToClipboard}
            className="p-1"
          >
            <Icon.Copy
              role="img"
              aria-label="copy to clipboard"
              height={30}
              width={30}
            />
          </motion.button>
        </div>
        <motion.ul
          className="space-y-4"
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
              className="cursor-pointer flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3 shadow-sm hover:bg-gray-200 transition-all duration-300"
            >
              <label className="flex items-center text-lg font-medium">
                <input
                  tabIndex={-1}
                  onChange={() => handleCheckboxChange(item.id)}
                  type="checkbox"
                  className="mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-500 focus:ring-opacity-50 "
                  checked={!!checkedItems[item.id]}
                />
                {`${item.item} - ${item.quantity} ${item.unit}`}
              </label>
            </motion.li>
          ))}
        </motion.ul>
      </div>
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
