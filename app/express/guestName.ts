/** Nome dell'ospite, salvato solo nel browser (non serve un account). */
const KEY = "cambusa_guest_name";

export function readGuestName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveGuestName(name: string) {
  try {
    window.localStorage.setItem(KEY, name.trim().slice(0, 30));
  } catch {
    // storage non disponibile (es. navigazione privata): il nome si richiede di nuovo
  }
}
