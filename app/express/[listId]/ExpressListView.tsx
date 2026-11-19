"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Plus,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EXPRESS_CATEGORIES } from "@/lib/express/categorize";
import {
  addExpressItem,
  deleteExpressItem,
  getExpressList,
  toggleExpressItemChecked,
  voteExpressItem,
  type ExpressItemView,
  type ExpressListView as ListData,
} from "../actions";
import { readGuestName, saveGuestName } from "../guestName";

const REFRESH_MS = 5000;

const inputClass =
  "block w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function ExpressListView({
  initialList,
  justCreated,
}: {
  initialList: ListData;
  justCreated: boolean;
}) {
  const [list, setList] = useState(initialList);
  const [guestName, setGuestName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [itemText, setItemText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showChecked, setShowChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isAdding, startAdding] = useTransition();
  const busy = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGuestName(readGuestName());
    setShareUrl(`${window.location.origin}/express/${initialList.id}`);
  }, [initialList.id]);

  const refresh = useCallback(async () => {
    const fresh = await getExpressList(initialList.id);
    // Non sovrascrivere mentre un'azione è in corso (aggiornamento ottimistico)
    if (fresh && busy.current === 0) setList(fresh);
  }, [initialList.id]);

  // Aggiornamento periodico: così si vedono i prodotti e i voti degli altri
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, REFRESH_MS);
    const onVisible = () => document.visibilityState === "visible" && void refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  /** Esegue un'azione con aggiornamento ottimistico, poi riallinea con il server. */
  const run = async (
    optimistic: (items: ExpressItemView[]) => ExpressItemView[],
    action: () => Promise<{ ok: boolean; error?: string }>,
  ) => {
    busy.current += 1;
    setError(null);
    setList((l) => ({ ...l, items: optimistic(l.items) }));
    try {
      const result = await action();
      if (!result.ok) setError(result.error ?? "Qualcosa è andato storto, riprova");
    } catch {
      setError("Connessione assente, riprova");
    } finally {
      busy.current -= 1;
      await refresh();
    }
  };

  const vote = (item: ExpressItemView, value: 1 | -1) =>
    run(
      (items) =>
        items.map((i) => {
          if (i.id !== item.id) return i;
          const next = i.myVote === value ? 0 : value;
          const up = i.up - (i.myVote === 1 ? 1 : 0) + (next === 1 ? 1 : 0);
          const down = i.down - (i.myVote === -1 ? 1 : 0) + (next === -1 ? 1 : 0);
          return { ...i, myVote: next, up, down, score: up - down };
        }),
      () => voteExpressItem({ itemId: item.id, value }),
    );

  const toggleChecked = (item: ExpressItemView) =>
    run(
      (items) => items.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)),
      () => toggleExpressItemChecked({ itemId: item.id, checked: !item.checked }),
    );

  const remove = (item: ExpressItemView) => {
    if (!window.confirm(`Eliminare "${item.text}" dalla lista?`)) return;
    run(
      (items) => items.filter((i) => i.id !== item.id),
      () => deleteExpressItem({ itemId: item.id }),
    );
  };

  const confirmName = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameDraft.trim();
    if (!name) return setError("Scrivi il tuo nome");
    saveGuestName(name);
    setGuestName(name);
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const text = itemText.trim();
    if (!text) return;
    startAdding(async () => {
      busy.current += 1;
      setError(null);
      try {
        const result = await addExpressItem({ listId: list.id, text, guestName });
        if (!result.ok) setError(result.error);
        else setItemText("");
      } catch {
        setError("Connessione assente, riprova");
      } finally {
        busy.current -= 1;
        await refresh();
        inputRef.current?.focus();
      }
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Non riesco a copiare il link: copialo dalla barra degli indirizzi");
    }
  };

  const shareText = `Aiutami a fare la cambusa per "${list.name}": aggiungi quello che vuoi a bordo e vota le proposte!`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const nativeShare = async () => {
    try {
      await navigator.share({ title: list.name, text: shareText, url: shareUrl });
    } catch {
      // condivisione annullata
    }
  };
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => setCanNativeShare(typeof navigator.share === "function"), []);

  const toBuy = useMemo(() => list.items.filter((i) => !i.checked), [list.items]);
  const bought = useMemo(() => list.items.filter((i) => i.checked), [list.items]);
  const byCategory = useMemo(
    () =>
      EXPRESS_CATEGORIES.map((category) => ({
        category,
        items: toBuy.filter((i) => i.category === category),
      })).filter((g) => g.items.length > 0),
    [toBuy],
  );

  return (
    <div className="space-y-6">
      {/* Intestazione */}
      <header className="text-center">
        <p className="font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
          Cambusa Express
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">
          {list.name}
        </h1>
        <p className="mt-3 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-primary" aria-hidden />
            {list.contributors === 1 ? "1 partecipante" : `${list.contributors} partecipanti`}
            {list.people ? ` su ${list.people}` : ""}
          </span>
          <span aria-hidden>·</span>
          <span>
            {list.items.length === 1 ? "1 prodotto" : `${list.items.length} prodotti`}
          </span>
        </p>
      </header>

      {/* Condivisione */}
      <section
        aria-label="Condividi la lista"
        className={cn(
          "rounded-2xl border p-4 sm:p-5",
          justCreated
            ? "border-accent-40 bg-gradient-to-br from-accent/15 via-white to-accent-light/20"
            : "border-gray-200 bg-white",
        )}
      >
        <p className="font-semibold text-gray-900">
          {justCreated ? "Lista creata! Ora mandala alla crew 👇" : "Invita la crew"}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Chi apre il link può aggiungere e votare prodotti, senza registrarsi.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white transition hover:brightness-95"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            Invia su WhatsApp
          </a>
          <button
            type="button"
            onClick={canNativeShare ? nativeShare : copyLink}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 font-semibold text-primary transition hover:bg-secondary"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Link copiato!" : canNativeShare ? "Condividi link" : "Copia link"}
          </button>
        </div>
      </section>

      {/* Nome ospite oppure campo per aggiungere prodotti */}
      <section aria-label="Aggiungi un prodotto" className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        {guestName ? (
          <form onSubmit={addItem} className="space-y-2">
            <label htmlFor="express-item" className="block text-sm font-semibold text-gray-800">
              Cosa vuoi a bordo, {guestName}?
            </label>
            <div className="flex gap-2">
              <input
                id="express-item"
                ref={inputRef}
                className={inputClass}
                placeholder="Es. 2 kg di pomodori, birra x24, Nutella…"
                value={itemText}
                maxLength={60}
                onChange={(e) => setItemText(e.target.value)}
                enterKeyHint="send"
              />
              <button
                type="submit"
                disabled={isAdding || !itemText.trim()}
                aria-label="Aggiungi"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-accent px-4 font-semibold text-white transition hover:bg-accent-light disabled:opacity-50"
              >
                <Plus className="h-5 w-5" aria-hidden />
                <span className="hidden sm:inline">Aggiungi</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setNameDraft(guestName);
                setGuestName("");
              }}
              className="text-xs text-gray-500 underline-offset-2 hover:underline"
            >
              Non sei {guestName}?
            </button>
          </form>
        ) : (
          <form onSubmit={confirmName} className="space-y-2">
            <label htmlFor="express-guest" className="block text-sm font-semibold text-gray-800">
              Come ti chiami? Così la crew sa chi ha proposto cosa
            </label>
            <div className="flex gap-2">
              <input
                id="express-guest"
                className={inputClass}
                placeholder="Il tuo nome"
                value={nameDraft}
                maxLength={30}
                onChange={(e) => setNameDraft(e.target.value)}
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-white transition hover:bg-primary-light"
              >
                Entra
              </button>
            </div>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </section>

      {/* Lista per reparto */}
      {list.items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-8 text-center text-gray-500">
          La lista è vuota: aggiungi il primo prodotto!
        </p>
      ) : (
        <div className="space-y-5">
          {byCategory.map(({ category, items }) => (
            <section key={category} aria-label={category}>
              <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                {category}
              </h2>
              <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onVote={vote}
                    onToggle={toggleChecked}
                    onDelete={remove}
                  />
                ))}
              </ul>
            </section>
          ))}

          {toBuy.length === 0 && (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center font-medium text-emerald-800">
              Hai preso tutto! Buona navigazione ⛵
            </p>
          )}

          {bought.length > 0 && (
            <section aria-label="Già presi">
              <button
                type="button"
                onClick={() => setShowChecked((v) => !v)}
                aria-expanded={showChecked}
                className="mb-2 flex w-full items-center gap-1 px-1 text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Già presi ({bought.length})
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", showChecked && "rotate-180")}
                  aria-hidden
                />
              </button>
              {showChecked && (
                <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  {bought.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onVote={vote}
                      onToggle={toggleChecked}
                      onDelete={remove}
                    />
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      )}

      {/* Passaggio al menu completo */}
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-transparent p-5 text-center sm:p-6">
        <Sparkles className="mx-auto h-6 w-6 text-primary" aria-hidden />
        <p className="mt-2 font-semibold text-gray-900">
          Volete anche il menu della settimana?
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
          Cambusa crea con l&apos;AI colazioni, pranzi e cene per tutta la crew,
          con la lista della spesa già pronta.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-light"
        >
          Genera il menu con l&apos;AI
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    </div>
  );
}

function ItemRow({
  item,
  onVote,
  onToggle,
  onDelete,
}: {
  item: ExpressItemView;
  onVote: (item: ExpressItemView, value: 1 | -1) => void;
  onToggle: (item: ExpressItemView) => void;
  onDelete: (item: ExpressItemView) => void;
}) {
  return (
    <li className={cn("flex items-center gap-3 px-3 py-3 sm:px-4", item.checked && "bg-gray-50")}>
      <button
        type="button"
        role="checkbox"
        aria-checked={item.checked}
        aria-label={item.checked ? `Togli la spunta a ${item.text}` : `Spunta ${item.text}`}
        onClick={() => onToggle(item)}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition",
          item.checked ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-300 hover:border-primary",
        )}
      >
        {item.checked && <Check className="h-4 w-4" strokeWidth={3} aria-hidden />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("break-words font-medium text-gray-900", item.checked && "text-gray-400 line-through")}>
          {item.text}
        </p>
        <p className="text-xs text-gray-500">proposto da {item.addedByName}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <VoteButton
          active={item.myVote === 1}
          count={item.up}
          label={`Mi piace: ${item.text}`}
          onClick={() => onVote(item, 1)}
          tone="up"
        />
        <VoteButton
          active={item.myVote === -1}
          count={item.down}
          label={`Non mi piace: ${item.text}`}
          onClick={() => onVote(item, -1)}
          tone="down"
        />
        {item.canDelete && (
          <button
            type="button"
            onClick={() => onDelete(item)}
            aria-label={`Elimina ${item.text}`}
            className="ml-0.5 flex h-9 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </li>
  );
}

function VoteButton({
  active,
  count,
  label,
  onClick,
  tone,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
  tone: "up" | "down";
}) {
  const Icon = tone === "up" ? ThumbsUp : ThumbsDown;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-9 min-w-[2.75rem] items-center justify-center gap-1 rounded-lg border px-2 text-sm font-semibold tabular-nums transition",
        active
          ? tone === "up"
            ? "border-primary bg-primary text-white"
            : "border-red-500 bg-red-500 text-white"
          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {count}
    </button>
  );
}
