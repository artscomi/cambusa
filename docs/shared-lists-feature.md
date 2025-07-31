# Liste Condivise di Ingredienti

## Panoramica

La funzionalità delle **Liste Condivise di Ingredienti** permette agli utenti di creare e gestire liste di ingredienti collaborative all'interno dei loro gruppi. Questa funzionalità si basa sui componenti esistenti come `CheckList` e la gestione dei gruppi.

## Caratteristiche

### 🎯 Funzionalità Principali

- **Creazione di liste condivise**: Gli utenti possono creare liste di ingredienti associate a un gruppo specifico
- **Gestione collaborativa**: Tutti i membri del gruppo possono visualizzare e completare gli elementi della lista
- **Controllo degli accessi**: Solo il creatore della lista può aggiungere o rimuovere elementi
- **Tracciamento del progresso**: Visualizzazione del progresso di completamento della lista
- **Notifiche di completamento**: Tracciamento di chi ha completato ogni elemento

### 🔧 Componenti Tecnici

#### Database Schema

```prisma
model SharedIngredientList {
  id          String                @id @default(cuid())
  name        String
  description String?
  groupId     String
  group       Group                 @relation(fields: [groupId], references: [id], onDelete: Cascade)
  createdBy   String
  creator     User                  @relation(fields: [createdBy], references: [clerkUserId])
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt
  items       SharedIngredientItem[]
  isActive    Boolean               @default(true)
}

model SharedIngredientItem {
  id                    String               @id @default(cuid())
  item                  String
  quantity              Int
  unit                  String
  isCompleted           Boolean              @default(false)
  completedBy           String?
  completedAt           DateTime?
  listId                String
  list                  SharedIngredientList @relation(fields: [listId], references: [id], onDelete: Cascade)
  createdAt             DateTime             @default(now())
  updatedAt             DateTime             @updatedAt
}
```

#### Context Provider

Il `SharedListProvider` gestisce lo stato globale delle liste condivise:

```typescript
interface SharedListContextProps {
  sharedLists: SharedIngredientList[];
  setSharedLists: (lists: SharedIngredientList[]) => void;
  currentList: SharedIngredientList | null;
  setCurrentList: (list: SharedIngredientList | null) => void;
  addItemToList: (listId: string, item: Omit<SharedIngredientItem, "id" | "listId" | "createdAt" | "updatedAt">) => void;
  removeItemFromList: (listId: string, itemId: string) => void;
  toggleItemCompletion: (listId: string, itemId: string, completedBy: string) => void;
  updateItemQuantity: (listId: string, itemId: string, quantity: number) => void;
  updateItemUnit: (listId: string, itemId: string, unit: string) => void;
}
```

#### Componenti Principali

1. **CreateSharedListBox**: Componente per creare nuove liste condivise
2. **SharedList**: Componente principale per visualizzare e gestire una lista
3. **SharedListsPage**: Pagina per visualizzare tutte le liste dell'utente

## Struttura delle Pagine

### `/shared-lists`
- **Descrizione**: Pagina principale che mostra tutte le liste condivise dell'utente
- **Funzionalità**: 
  - Dashboard con statistiche (liste totali, da completare, completati, percentuale completamento)
  - Griglia delle liste con preview degli elementi
  - Pulsante per creare nuove liste

### `/shared-lists/create`
- **Descrizione**: Form per creare una nuova lista condivisa
- **Funzionalità**:
  - Nome e descrizione della lista
  - Selezione del gruppo
  - Informazioni sui permessi

### `/shared-lists/[listId]`
- **Descrizione**: Pagina per visualizzare e gestire una lista specifica
- **Funzionalità**:
  - Visualizzazione degli elementi da completare e completati
  - Aggiunta di nuovi elementi (solo per il creatore)
  - Completamento degli elementi
  - Condivisione della lista

## Integrazione con l'Esistente

### Basato su CheckList
La funzionalità si basa sul componente `CheckList` esistente, riutilizzando:
- Animazioni e varianti Framer Motion
- Gestione delle unità di misura
- Funzionalità di condivisione e copia negli appunti
- Modal per aggiungere/modificare elementi

### Integrazione con i Gruppi
- Utilizza il sistema di gruppi esistente
- Relazioni database con `Group` e `User`
- Permessi basati sulla membership del gruppo

### UI/UX Coerente
- Utilizza i colori `secondary` per differenziarsi dalle altre funzionalità
- Mantiene la stessa struttura visiva del resto dell'app
- Animazioni e transizioni coerenti

## Utilizzo

### Per gli Utenti

1. **Creare una lista**:
   - Vai alla home page
   - Clicca su "Crea una lista condivisa"
   - Compila il form con nome, descrizione e gruppo
   - Clicca su "Crea lista"

2. **Gestire una lista**:
   - Accedi a "Liste condivise" dal menu utente
   - Clicca su una lista per aprirla
   - Aggiungi elementi (se sei il creatore)
   - Completa gli elementi cliccando sui checkbox

3. **Collaborare**:
   - Tutti i membri del gruppo possono vedere la lista
   - Possono completare gli elementi
   - Vedono chi ha completato cosa

### Per gli Sviluppatori

1. **Aggiungere il provider**:
   ```typescript
   import { SharedListProvider } from "@/context/useSharedListContext";
   
   // Nel layout
   <SharedListProvider>
     {children}
   </SharedListProvider>
   ```

2. **Utilizzare il context**:
   ```typescript
   import { useSharedListContext } from "@/context/useSharedListContext";
   
   const { sharedLists, addItemToList } = useSharedListContext();
   ```

3. **Creare nuove liste**:
   ```typescript
   const newList = {
     id: `list_${Date.now()}_${Math.random()}`,
     name: "Lista spesa weekend",
     description: "Ingredienti per il weekend",
     groupId: "group-id",
     createdBy: "user-id",
     createdAt: new Date(),
     updatedAt: new Date(),
     isActive: true,
     items: [],
   };
   ```

## Prossimi Sviluppi

- [ ] Integrazione con il database reale (attualmente usa localStorage)
- [ ] Notifiche in tempo reale per aggiornamenti
- [ ] Storico delle modifiche
- [ ] Template di liste predefinite
- [ ] Esportazione in PDF
- [ ] Integrazione con app di terze parti

## Note Tecniche

- **Stato temporaneo**: Attualmente usa localStorage per la persistenza
- **Permessi**: Basati su `createdBy` vs `completedBy`
- **Performance**: Ottimizzato con React.memo e useMemo dove necessario
- **Accessibilità**: Supporta navigazione da tastiera e screen reader 