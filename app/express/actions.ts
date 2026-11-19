"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import db from "@/utils/db";
import {
  categorizeExpressItem,
  EXPRESS_CATEGORIES,
  type ExpressCategory,
} from "@/lib/express/categorize";

const GUEST_COOKIE = "cambusa_guest";
const MAX_ITEMS_PER_LIST = 150;
const MAX_ITEM_LENGTH = 60;
const MAX_NAME_LENGTH = 30;
const MAX_LIST_NAME_LENGTH = 60;

export type ExpressItemView = {
  id: string;
  text: string;
  category: ExpressCategory;
  addedByName: string;
  checked: boolean;
  up: number;
  down: number;
  score: number;
  myVote: 1 | -1 | 0;
  /** Nomi di chi ha votato 👎 ("Qualcuno" per i voti senza nome). Esclude chi sta guardando. */
  downVoters: string[];
  canDelete: boolean;
  /** Aggiunto da chi sta guardando la lista. */
  mine: boolean;
};

export type ExpressListView = {
  id: string;
  name: string;
  people: number | null;
  isCreator: boolean;
  contributors: number;
  items: ExpressItemView[];
};

type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

/** Token dell'ospite letto dal cookie, senza crearlo. */
function readGuestToken(): string | null {
  return cookies().get(GUEST_COOKIE)?.value ?? null;
}

/** Token dell'ospite; se manca lo crea (solo dentro una server action). */
function ensureGuestToken(): string {
  const existing = readGuestToken();
  if (existing) return existing;
  const token = randomUUID();
  cookies().set(GUEST_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return token;
}

const clean = (value: unknown, max: number) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

export async function createExpressList(input: {
  name: string;
  people?: number | null;
}): Promise<Result<{ id: string }>> {
  const name = clean(input.name, MAX_LIST_NAME_LENGTH);
  if (!name) return { ok: false, error: "Dai un nome alla lista" };
  const people =
    input.people && Number.isFinite(input.people)
      ? Math.min(Math.max(Math.round(input.people), 1), 50)
      : null;

  const token = ensureGuestToken();
  const list = await db.expressList.create({
    data: { name, people, creatorToken: token },
    select: { id: true },
  });
  return { ok: true, data: { id: list.id } };
}

export async function getExpressList(
  listId: string,
): Promise<ExpressListView | null> {
  const token = readGuestToken();
  const list = await db.expressList.findUnique({
    where: { id: listId },
    include: { items: { include: { votes: true } } },
  });
  if (!list) return null;

  // Chi ha creato la lista conta come partecipante anche prima di aggiungere prodotti
  const contributors = new Set<string>([list.creatorToken]);
  const items: ExpressItemView[] = list.items.map((item) => {
    contributors.add(item.addedBy);
    let up = 0;
    let down = 0;
    let myVote: 1 | -1 | 0 = 0;
    const downVoters: string[] = [];
    for (const v of item.votes) {
      contributors.add(v.voter);
      if (v.value > 0) up += 1;
      else down += 1;
      const isMe = !!token && v.voter === token;
      if (isMe) myVote = v.value > 0 ? 1 : -1;
      else if (v.value < 0) downVoters.push(v.voterName.trim() || "Qualcuno");
    }
    const category = (EXPRESS_CATEGORIES as readonly string[]).includes(
      item.category,
    )
      ? (item.category as ExpressCategory)
      : "Altro";
    return {
      id: item.id,
      text: item.text,
      category,
      addedByName: item.addedByName,
      checked: item.checked,
      up,
      down,
      score: up - down,
      myVote,
      downVoters,
      canDelete:
        !!token && (token === item.addedBy || token === list.creatorToken),
      mine: !!token && token === item.addedBy,
    };
  });

  items.sort(
    (a, b) =>
      b.score - a.score || b.up - a.up || a.text.localeCompare(b.text, "it"),
  );

  return {
    id: list.id,
    name: list.name,
    people: list.people,
    isCreator: !!token && token === list.creatorToken,
    contributors: contributors.size,
    items,
  };
}

/** Chiave per riconoscere i doppioni: "  Nutella " e "nutella" sono lo stesso prodotto. */
const sameProductKey = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Divide "pomodori, birra x24\nNutella" in più prodotti. */
const splitProducts = (raw: string) =>
  String(raw ?? "")
    .split(/[,;\n]+/)
    .map((t) => clean(t, MAX_ITEM_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_ITEMS_PER_ADD);

const MAX_ITEMS_PER_ADD = 20;

/**
 * Aggiunge uno o più prodotti (separati da virgola o a capo).
 * Se un prodotto c'è già, non lo duplica: aggiunge il voto di chi l'ha proposto.
 */
export async function addExpressItem(input: {
  listId: string;
  text: string;
  guestName: string;
}): Promise<Result<{ added: string[]; merged: string[] }>> {
  const texts = splitProducts(input.text);
  const guestName = clean(input.guestName, MAX_NAME_LENGTH);
  if (texts.length === 0) return { ok: false, error: "Scrivi un prodotto" };
  if (!guestName) return { ok: false, error: "Scrivi il tuo nome" };

  const list = await db.expressList.findUnique({
    where: { id: input.listId },
    select: { id: true, items: { select: { id: true, text: true } } },
  });
  if (!list) return { ok: false, error: "Lista non trovata" };

  const token = ensureGuestToken();
  const existing = new Map(list.items.map((i) => [sameProductKey(i.text), i]));
  const added: string[] = [];
  const merged: string[] = [];
  let room = MAX_ITEMS_PER_LIST - list.items.length;

  for (const text of texts) {
    const key = sameProductKey(text);
    const duplicate = existing.get(key);
    if (duplicate) {
      await db.expressVote.upsert({
        where: { itemId_voter: { itemId: duplicate.id, voter: token } },
        update: { value: 1, voterName: guestName },
        create: { itemId: duplicate.id, voter: token, voterName: guestName, value: 1 },
      });
      merged.push(duplicate.text);
      continue;
    }
    if (room <= 0) break;
    // Chi aggiunge un prodotto lo vota anche: così parte da +1
    const item = await db.expressItem.create({
      data: {
        listId: list.id,
        text,
        category: categorizeExpressItem(text),
        addedByName: guestName,
        addedBy: token,
        votes: { create: { voter: token, voterName: guestName, value: 1 } },
      },
      select: { id: true, text: true },
    });
    existing.set(key, item);
    added.push(text);
    room -= 1;
  }

  revalidatePath(`/express/${list.id}`);
  if (added.length === 0 && merged.length === 0) {
    return { ok: false, error: "La lista è piena (massimo 150 prodotti)" };
  }
  return { ok: true, data: { added, merged } };
}

/** Vota +1 o -1. Rivotare lo stesso valore toglie il voto. */
export async function voteExpressItem(input: {
  itemId: string;
  value: 1 | -1;
  guestName: string;
}): Promise<Result> {
  const guestName = clean(input.guestName, MAX_NAME_LENGTH);
  if (!guestName) return { ok: false, error: "Scrivi il tuo nome per votare" };
  if (input.value !== 1 && input.value !== -1) {
    return { ok: false, error: "Voto non valido" };
  }
  const item = await db.expressItem.findUnique({
    where: { id: input.itemId },
    select: { id: true, listId: true },
  });
  if (!item) return { ok: false, error: "Prodotto non trovato" };

  const token = ensureGuestToken();
  const key = { itemId_voter: { itemId: item.id, voter: token } };
  const existing = await db.expressVote.findUnique({ where: key });
  if (existing?.value === input.value) {
    await db.expressVote.delete({ where: key });
  } else {
    await db.expressVote.upsert({
      where: key,
      update: { value: input.value, voterName: guestName },
      create: { itemId: item.id, voter: token, voterName: guestName, value: input.value },
    });
  }
  revalidatePath(`/express/${item.listId}`);
  return { ok: true };
}

/** Spunta / togli la spunta (chiunque abbia il link, mentre fa la spesa). */
export async function toggleExpressItemChecked(input: {
  itemId: string;
  checked: boolean;
}): Promise<Result> {
  const item = await db.expressItem.update({
    where: { id: input.itemId },
    data: { checked: !!input.checked },
    select: { listId: true },
  }).catch(() => null);
  if (!item) return { ok: false, error: "Prodotto non trovato" };
  revalidatePath(`/express/${item.listId}`);
  return { ok: true };
}

/** Elimina un prodotto: solo chi l'ha aggiunto o chi ha creato la lista. */
export async function deleteExpressItem(input: {
  itemId: string;
}): Promise<Result> {
  const token = readGuestToken();
  if (!token) return { ok: false, error: "Non puoi eliminare questo prodotto" };
  const item = await db.expressItem.findUnique({
    where: { id: input.itemId },
    select: {
      id: true,
      listId: true,
      addedBy: true,
      list: { select: { creatorToken: true } },
    },
  });
  if (!item) return { ok: false, error: "Prodotto non trovato" };
  if (item.addedBy !== token && item.list.creatorToken !== token) {
    return { ok: false, error: "Non puoi eliminare questo prodotto" };
  }
  await db.expressItem.delete({ where: { id: item.id } });
  revalidatePath(`/express/${item.listId}`);
  return { ok: true };
}
