"use server";

import { cookies } from "next/headers";
import db from "@/utils/db";
import {
  createSplitwiseExpense,
  getSplitwiseGroups,
  readSplitwiseToken,
  SplitwiseAuthError,
  splitwiseEnabled,
  SPLITWISE_TOKEN_COOKIE,
  type SplitwiseGroup,
} from "@/lib/splitwise";

type Result<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; needsLogin?: boolean };

const authFailed = (): Result<never> => {
  // Permesso revocato o scaduto: si ricollega
  cookies().delete(SPLITWISE_TOKEN_COOKIE);
  return {
    ok: false,
    needsLogin: true,
    error: "Collega di nuovo il tuo account Splitwise",
  };
};

export async function getSplitwiseState(): Promise<
  Result<{ connected: false } | { connected: true; groups: SplitwiseGroup[] }>
> {
  if (!splitwiseEnabled()) return { ok: false, error: "Splitwise non disponibile" };
  if (!readSplitwiseToken()) return { ok: true, data: { connected: false } };
  try {
    return { ok: true, data: { connected: true, groups: await getSplitwiseGroups() } };
  } catch (e) {
    if (e instanceof SplitwiseAuthError) return authFailed();
    console.error("Splitwise gruppi:", e);
    return { ok: false, error: "Splitwise non risponde, riprova tra poco" };
  }
}

export async function sendExpenseToSplitwise(input: {
  listId: string;
  groupId: number;
  amount: number;
}): Promise<Result<{ groupId: number }>> {
  if (!splitwiseEnabled()) return { ok: false, error: "Splitwise non disponibile" };
  const amount = Math.round(Number(input.amount) * 100) / 100;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
    return { ok: false, error: "Scrivi il totale dello scontrino" };
  }
  if (!Number.isInteger(input.groupId) || input.groupId <= 0) {
    return { ok: false, error: "Scegli il gruppo Splitwise" };
  }

  const list = await db.expressList.findUnique({
    where: { id: input.listId },
    select: {
      name: true,
      items: { select: { text: true, checked: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!list) return { ok: false, error: "Lista non trovata" };

  // Nelle note: i prodotti presi (o tutta la lista, se non è stato spuntato niente)
  const bought = list.items.filter((i) => i.checked);
  const items = (bought.length > 0 ? bought : list.items).map((i) => i.text);
  const details = [
    `Lista Cambusa Express: ${list.name}`,
    items.length ? `Prodotti: ${items.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 1500);

  try {
    await createSplitwiseExpense({
      groupId: input.groupId,
      cost: amount.toFixed(2),
      description: `Cambusa: ${list.name}`.slice(0, 100),
      details,
    });
    return { ok: true, data: { groupId: input.groupId } };
  } catch (e) {
    if (e instanceof SplitwiseAuthError) return authFailed();
    console.error("Splitwise spesa:", e);
    return {
      ok: false,
      error:
        e instanceof Error && e.message && !e.message.startsWith("Splitwise: HTTP")
          ? `Splitwise: ${e.message}`
          : "Splitwise non risponde, riprova tra poco",
    };
  }
}

export async function disconnectSplitwise() {
  cookies().delete(SPLITWISE_TOKEN_COOKIE);
}
