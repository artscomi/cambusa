# Componente Comune IngredientList

## Panoramica

Il componente comune `IngredientList` è stato creato per evitare duplicazione di codice tra `CheckList` e `SharedList`. Fornisce una soluzione modulare e riutilizzabile per gestire liste di ingredienti.

## Struttura dei Componenti

### 🎯 **Hook: `useIngredientList`**
Gestisce tutta la logica di stato e le funzioni comuni:

```typescript
const {
  // State
  showToast,
  showConfirmModal,
  itemToRemove,
  showAddModal,
  newItem,
  showQuantityModal,
  editingQuantity,
  
  // Functions
  getCorrectUnit,
  handleCheckboxChange,
  confirmRemoveItem,
  handleQuantityChange,
  openQuantityModal,
  handleAddItem,
  openAddModal,
  closeAddModal,
  handleCopyToClipboard,
  handleShare,
  handleUnitChange,
} = useIngredientList({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onToggleCompletion,
  canEdit,
  canRemove,
  completedBy,
});
```

### 🎨 **Componente: `IngredientList`**
Visualizza la lista di ingredienti con layout a griglia:

```typescript
<IngredientList
  items={items}
  title="Lista ingredienti"
  icon={<Utensils className="w-6 h-6" />}
  onCheckboxChange={handleCheckboxChange}
  onQuantityEdit={openQuantityModal}
  onRemoveItem={onRemoveItem}
  canEdit={true}
  canRemove={true}
  getCorrectUnit={getCorrectUnit}
/>
```

### 📱 **Modali: `Modals.tsx`**
Contiene tutti i componenti modali:

- **`AddItemModal`**: Per aggiungere nuovi ingredienti
- **`QuantityEditModal`**: Per modificare quantità e unità
- **`ConfirmRemoveModal`**: Per confermare la rimozione

### 🔧 **Wrapper: `IngredientListWrapper`**
Componente completo che combina tutto:

```typescript
<IngredientListWrapper
  items={items}
  title="La tua lista della spesa"
  description="Descrizione opzionale"
  onAddItem={handleAddItem}
  onRemoveItem={handleRemoveItem}
  onUpdateQuantity={handleUpdateQuantity}
  onToggleCompletion={handleToggleCompletion}
  canEdit={true}
  canRemove={true}
  canAdd={true}
  completedBy="user-id"
  showShareButtons={true}
  listName="Lista spesa"
  showSections={true} // Per replicare CheckList
/>
```

## Utilizzo

### Per CheckList (Shopping List) - Replica Esatta

```typescript
import IngredientListWrapper from "@/components/IngredientList/IngredientListWrapper";
import { useShoppingContext } from "@/context/useShoppingListContext";

const CheckListWithCommon = ({ items }: { items: Ingredient[] }) => {
  const { shoppingList, setShoppingList } = useShoppingContext();

  const handleAddItem = (item: Omit<Ingredient, "id">) => {
    const newIngredient: Ingredient = {
      id: `manual_${Date.now()}`,
      ...item,
    };
    setShoppingList([...shoppingList, newIngredient]);
  };

  const handleRemoveItem = (itemId: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number, unit?: string) => {
    setShoppingList(shoppingList.map(item => 
      item.id === itemId 
        ? { ...item, quantity, ...(unit && { unit }) }
        : item
    ));
  };

  const handleToggleCompletion = (itemId: string) => {
    // In CheckList, clicking checkbox removes the item
    handleRemoveItem(itemId);
  };

  return (
    <IngredientListWrapper
      items={items}
      title="La tua lista della spesa"
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onUpdateQuantity={handleUpdateQuantity}
      onToggleCompletion={handleToggleCompletion}
      canEdit={true}
      canRemove={false} // No remove button in CheckList
      canAdd={true}
      showShareButtons={true}
      showSections={true} // Show separate sections like CheckList
    />
  );
};
```

### Per SharedList (Liste Condivise)

```typescript
import IngredientListWrapper from "@/components/IngredientList/IngredientListWrapper";
import { useSharedListContext } from "@/context/useSharedListContext";

const SharedList = ({ listId, items, isOwner, completedBy }) => {
  const { addItemToList, removeItemFromList, updateItemQuantity, toggleItemCompletion } = useSharedListContext();

  const handleAddItem = (item) => {
    addItemToList(listId, item);
  };

  const handleRemoveItem = (itemId) => {
    removeItemFromList(listId, itemId);
  };

  const handleUpdateQuantity = (itemId, quantity, unit) => {
    updateItemQuantity(listId, itemId, quantity);
    if (unit) {
      updateItemUnit(listId, itemId, unit);
    }
  };

  const handleToggleCompletion = (itemId) => {
    toggleItemCompletion(listId, itemId, completedBy);
  };

  return (
    <IngredientListWrapper
      items={items}
      title="Lista condivisa"
      onAddItem={isOwner ? handleAddItem : undefined}
      onRemoveItem={isOwner ? handleRemoveItem : undefined}
      onUpdateQuantity={handleUpdateQuantity}
      onToggleCompletion={handleToggleCompletion}
      canEdit={!!completedBy}
      canRemove={isOwner}
      canAdd={isOwner}
      completedBy={completedBy}
      showShareButtons={true}
      showSections={false} // Single list for shared lists
    />
  );
};
```

## Caratteristiche del CheckList Replicato

### 🎯 **Sezioni Separate**
- **Ingredienti per i pasti**: Icona `Utensils`
- **Acqua**: Icona `Droplets` 
- **Bevande alcoliche**: Icona `Wine`

### 🎨 **Stile Identico**
- **Layout a griglia**: 1/2/3 colonne responsive
- **Checkbox nativi**: Stesso stile e comportamento
- **Pulsante modifica**: Solo matita, no cestino
- **Animazioni**: Stesse transizioni Framer Motion

### 📱 **Modali Identiche**
- **AddItemModal**: Stesso header con X, stessi placeholder
- **QuantityEditModal**: Stessa struttura e validazione
- **ConfirmRemoveModal**: Stesso testo e stile

### 🔧 **Comportamento**
- **Checkbox**: Rimuove elemento dalla lista
- **Modifica**: Cambia quantità e unità
- **Aggiunta**: Nuovo ingrediente con ID manuale
- **Condivisione**: Web Share API + fallback clipboard

## Vantaggi

### 🔄 **Riutilizzo del Codice**
- **Logica comune**: Hook `useIngredientList` gestisce tutto
- **UI consistente**: Stesso layout e animazioni
- **Modali riutilizzabili**: Stesse modali per entrambi i casi d'uso

### 🎯 **Flessibilità**
- **Props configurabili**: `canEdit`, `canRemove`, `canAdd`, `showSections`
- **Callbacks personalizzabili**: Ogni azione può essere customizzata
- **UI adattabile**: Mostra/nasconde pulsanti in base ai permessi

### 🧹 **Manutenibilità**
- **Codice centralizzato**: Modifiche in un solo posto
- **Testing semplificato**: Un solo componente da testare
- **Bug fixes**: Risolti una volta, applicati ovunque

### 📱 **Performance**
- **Bundle size ridotto**: Meno codice duplicato
- **Re-render ottimizzati**: Hook con memoization
- **Lazy loading**: Componenti caricati solo quando necessario

## Migrazione

### Da CheckList esistente:
1. **Sostituisci** il componente con `IngredientListWrapper`
2. **Configura** `showSections={true}` e `canRemove={false}`
3. **Adatta** i callbacks per la logica di business

### Da SharedList esistente:
1. **Sostituisci** il componente con `IngredientListWrapper`
2. **Configura** i permessi con le props appropriate
3. **Usa** i callbacks del context condiviso

## Prossimi Sviluppi

- [ ] **Animazioni avanzate**: Transizioni più fluide
- [ ] **Drag & Drop**: Riordinamento elementi
- [ ] **Filtri**: Cerca e filtra ingredienti
- [ ] **Categorie**: Raggruppa per tipo di ingrediente
- [ ] **Template**: Liste predefinite
- [ ] **Export**: PDF, CSV, JSON 