import React, { useState } from "react";

// Definisci il tipo per gli elementi della lista
interface Item {
  id: string;
  item: string;
  quantity: string;
}

const Checklist: React.FC<{ items: Item[] | undefined }> = ({ items }) => {
  // Definisci il tipo di stato come un oggetto con chiavi stringhe e valori booleani
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div>
      <h1>Lista della Spesa</h1>
      <ul>
        {items?.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={!!checkedItems[item.id]}
                onChange={() => handleCheckboxChange(item.id)}
              />
              {`${item.item} - ${item.quantity}`}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checklist;
