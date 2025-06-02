/**
 * Special Accounts
 * Lista degli account che hanno accesso illimitato alle chiamate API
 */
export const UNLIMITED_USERS = [
  process.env.NEXT_PUBLIC_SPECIAL_USER_1,
  process.env.NEXT_PUBLIC_SPECIAL_USER_2,
];

// Esporto le costanti individuali per retrocompatibilità
export const FREE_TIER_API_CALLS = 3;
export const PAID_TIER_API_CALLS = 5;
export const UNLIMITED_API_CALLS = Infinity;
