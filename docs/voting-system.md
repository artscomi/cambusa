# Sistema di Voto per Liste Condivise

## 🎯 **Come Funziona Attualmente**

### ✅ **Funzionalità Implementate:**
1. **Pulsanti di Voto**: 👍 (mi piace) e 👎 (non mi piace)
2. **Contatore Voti**: Mostra il totale (+3, -2, 0)
3. **Voto Utente**: Ogni utente può votare una volta per elemento
4. **Persistenza Locale**: I voti sono salvati nel `localStorage`

### ❌ **Limitazioni Attuali:**
1. **Solo Locale**: I voti sono visibili solo nel browser dell'utente
2. **Non Condivisi**: Se condividi il link, l'altro utente non vede i tuoi voti
3. **No Database**: I voti non sono salvati nel database

## 🔧 **Come Funziona Ora:**

```typescript
// Struttura voti nel localStorage
votes: {
  "user_123": true,   // 👍
  "user_456": false,  // 👎
  "user_789": true,   // 👍
}

// Calcolo totale
totalVotes: 1 // (2 positivi - 1 negativo = 1)
```

## 🚀 **Piano per la Versione Completa:**

### 1. **Database Schema** ✅
```prisma
model SharedIngredientItemVote {
  id        String   @id @default(cuid())
  userId    String
  itemId    String
  vote      Boolean  // true = positivo, false = negativo
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  item      SharedIngredientItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@unique([userId, itemId])
}
```

### 2. **API Endpoints** ✅
- `POST /api/shared-lists/vote` - Salva un voto
- `GET /api/shared-lists/vote?itemId=xxx` - Recupera voti

### 3. **Autenticazione** ✅
- Usa Clerk per identificare gli utenti
- `user.id` come identificatore univoco

### 4. **Sincronizzazione** ❌
- **Problema**: Le funzioni async causano errori di tipo
- **Soluzione**: Implementare con React Query o SWR

## 📋 **Flusso Utente:**

### **Scenario 1: Voto Locale (Attuale)**
1. Utente A vota 👍 su "Pomodori"
2. Voto salvato nel localStorage del browser A
3. Utente B apre lo stesso link
4. Utente B non vede il voto di A
5. Utente B vota 👎 su "Pomodori"
6. Ogni utente vede solo i propri voti

### **Scenario 2: Voto Condiviso (Futuro)**
1. Utente A vota 👍 su "Pomodori"
2. Voto salvato nel database
3. Utente B apre lo stesso link
4. Utente B vede il voto di A (+1)
5. Utente B vota 👎 su "Pomodori"
6. Totale: 0 (1 positivo - 1 negativo)
7. Entrambi vedono i voti di tutti

## 🛠 **Implementazione Completa:**

### **Step 1: Aggiornare Context**
```typescript
// Usare React Query per gestire le chiamate API
const { data: votes } = useQuery(['votes', itemId], () => 
  fetch(`/api/shared-lists/vote?itemId=${itemId}`).then(res => res.json())
);
```

### **Step 2: Aggiornare Componenti**
```typescript
// Gestire loading states
{isLoading ? <Spinner /> : <VoteButtons />}
```

### **Step 3: Real-time Updates**
```typescript
// WebSocket o polling per aggiornamenti in tempo reale
useEffect(() => {
  const interval = setInterval(refetchVotes, 5000);
  return () => clearInterval(interval);
}, []);
```

## 🎯 **Prossimi Passi:**

1. **Implementare React Query** per gestire le chiamate API
2. **Aggiungere loading states** nei componenti
3. **Testare con utenti reali** per verificare la funzionalità
4. **Aggiungere real-time updates** per sincronizzazione
5. **Implementare notifiche** quando qualcuno vota

## 💡 **Vantaggi del Sistema Completo:**

- ✅ **Collaborazione Reale**: Tutti vedono i voti di tutti
- ✅ **Decisioni Condivise**: Basate sui voti della comunità
- ✅ **Persistenza**: I voti rimangono anche dopo il refresh
- ✅ **Scalabilità**: Supporta molti utenti contemporaneamente
- ✅ **Analytics**: Possibilità di tracciare le preferenze

---

**Nota**: Il sistema attuale funziona perfettamente per test locali. Per la produzione, implementare la versione completa con database e API. 