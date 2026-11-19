import { cookies } from "next/headers";

/**
 * Integrazione con Splitwise (OAuth 2): chi ha pagato la spesa collega il suo account
 * e Cambusa crea la spesa in un suo gruppo, divisa in parti uguali.
 * Il permesso (access token) resta solo in un cookie httpOnly nel browser di chi l'ha dato.
 */
// Sovrascrivibile solo per i test in locale con un server finto
const SPLITWISE = process.env.SPLITWISE_BASE_URL ?? "https://secure.splitwise.com";
const API = `${SPLITWISE}/api/v3.0`;

export const SPLITWISE_TOKEN_COOKIE = "splitwise_token";
export const SPLITWISE_STATE_COOKIE = "splitwise_state";

/** Solo pagine di Cambusa Express: evita redirect verso siti esterni. */
export const safeReturnPath = (value: string | null | undefined) =>
  value && /^\/(en\/)?express\/[A-Za-z0-9_-]+$/.test(value) ? value : "/express";

export function splitwiseConfig() {
  const clientId = process.env.SPLITWISE_CLIENT_ID;
  const clientSecret = process.env.SPLITWISE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export const splitwiseEnabled = () => splitwiseConfig() !== null;

/** Deve coincidere con la Callback URL registrata su Splitwise. */
export function splitwiseRedirectUri(origin: string) {
  return process.env.SPLITWISE_REDIRECT_URI ?? `${origin}/api/splitwise/callback`;
}

export function splitwiseAuthorizeUrl(origin: string, state: string) {
  const config = splitwiseConfig();
  if (!config) return null;
  const url = new URL(`${SPLITWISE}/oauth/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", splitwiseRedirectUri(origin));
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeSplitwiseCode(origin: string, code: string) {
  const config = splitwiseConfig();
  if (!config) throw new Error("Splitwise non configurato");
  const res = await fetch(`${SPLITWISE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: splitwiseRedirectUri(origin),
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Token Splitwise: HTTP ${res.status}`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Token Splitwise mancante");
  return data.access_token;
}

export const readSplitwiseToken = () =>
  cookies().get(SPLITWISE_TOKEN_COOKIE)?.value ?? null;

export class SplitwiseAuthError extends Error {}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = readSplitwiseToken();
  if (!token) throw new SplitwiseAuthError("Non collegato");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (res.status === 401) throw new SplitwiseAuthError("Permesso scaduto");
  if (!res.ok) throw new Error(`Splitwise: HTTP ${res.status}`);
  return (await res.json()) as T;
}

export type SplitwiseGroup = { id: number; name: string; members: number };

export async function getSplitwiseGroups(): Promise<SplitwiseGroup[]> {
  const data = await call<{
    groups?: { id: number; name: string; members?: unknown[] }[];
  }>("/get_groups");
  return (data.groups ?? [])
    .filter((g) => g.id !== 0) // il gruppo 0 sono le spese fuori da un gruppo
    .map((g) => ({ id: g.id, name: g.name, members: g.members?.length ?? 0 }));
}

/** Crea una spesa nel gruppo, divisa in parti uguali tra tutti i membri. */
export async function createSplitwiseExpense(input: {
  groupId: number;
  cost: string;
  description: string;
  details: string;
}) {
  const data = await call<{
    expenses?: { id: number }[];
    errors?: Record<string, string[] | string> | string[];
  }>("/create_expense", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      group_id: input.groupId,
      cost: input.cost,
      description: input.description,
      details: input.details,
      currency_code: "EUR",
      split_equally: true,
    }),
  });
  const errors = data.errors
    ? Object.values(data.errors).flat().filter(Boolean)
    : [];
  if (errors.length > 0 || !data.expenses?.length) {
    throw new Error(errors.join(" ") || "Spesa non creata");
  }
  return data.expenses[0].id;
}
