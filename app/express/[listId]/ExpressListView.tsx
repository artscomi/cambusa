"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { categorizeExpressItem, EXPRESS_CATEGORIES } from "@/lib/express/categorize";
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
const NEW_HIGHLIGHT_MS = 4000;

/** Proposte rapide per iniziare: si nascondono quelle già in lista. */
const SUGGESTIONS = [
  "Acqua",
  "Pane",
  "Pasta",
  "Pomodori",
  "Caffè",
  "Uova",
  "Frutta",
  "Birra",
  "Biscotti",
  "Crema solare",
  "Carta da cucina",
];

const normalize = (t: string) => t.toLowerCase().replace(/\s+/g, " ").trim();

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
  const [nameReady, setNameReady] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [itemText, setItemText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showChecked, setShowChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const [addFormVisible, setAddFormVisible] = useState(true);
  const busy = useRef(0);
  const seenIds = useRef(new Set(initialList.items.map((i) => i.id)));
  const inputRef = useRef<HTMLInputElement>(null);
  const addSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = readGuestName();
    setGuestName(saved);
    setNameDraft(saved);
    setNameReady(true);
    setShareUrl(`${window.location.origin}/express/${initialList.id}`);
    setCanNativeShare(typeof navigator.share === "function");
  }, [initialList.id]);

  // Mostra il pulsante "+ Aggiungi" solo quando il campo è fuori dallo schermo
  useEffect(() => {
    const el = addSectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([entry]) => setAddFormVisible(entry.isIntersecting));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const refresh = useCallback(async () => {
    const fresh = await getExpressList(initialList.id);
    // Non sovrascrivere mentre un'azione è in corso (aggiornamento ottimistico)
    if (!fresh || busy.current !== 0) return;
    // Evidenzia per qualche secondo i prodotti appena aggiunti dagli altri
    const arrived = fresh.items.filter((i) => !seenIds.current.has(i.id) && !i.mine);
    fresh.items.forEach((i) => seenIds.current.add(i.id));
    if (arrived.length > 0) {
      setFreshIds((s) => new Set([...s, ...arrived.map((i) => i.id)]));
      setTimeout(() => {
        setFreshIds((s) => {
          const next = new Set(s);
          arrived.forEach((i) => next.delete(i.id));
          return next;
        });
      }, NEW_HIGHLIGHT_MS);
    }
    setList(fresh);
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
  const run = async <T,>(
    optimistic: (items: ExpressItemView[]) => ExpressItemView[],
    action: () => Promise<{ ok: true; data?: T } | { ok: false; error: string }>,
  ): Promise<T | undefined> => {
    busy.current += 1;
    setError(null);
    setList((l) => ({ ...l, items: optimistic(l.items) }));
    let data: T | undefined;
    try {
      const result = await action();
      if (result.ok) data = result.data;
      else setError(result.error);
    } catch {
      setError("Connessione assente, riprova");
    } finally {
      busy.current -= 1;
      await refresh();
    }
    return data;
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
    void run(
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

  /** Aggiunge uno o più prodotti; compaiono subito, poi si riallinea col server. */
  const addProducts = async (raw: string) => {
    const texts = raw
      .split(/[,;\n]+/)
      .map((t) => t.replace(/\s+/g, " ").trim().slice(0, 60))
      .filter(Boolean);
    if (texts.length === 0) return;
    const present = new Set(list.items.map((i) => normalize(i.text)));
    const temp: ExpressItemView[] = texts
      .filter((t) => !present.has(normalize(t)))
      .map((text, n) => ({
        id: `tmp-${Date.now()}-${n}`,
        text,
        category: categorizeExpressItem(text),
        addedByName: guestName,
        checked: false,
        up: 1,
        down: 0,
        score: 1,
        myVote: 1,
        canDelete: false,
        mine: true,
      }));
    setItemText("");
    const data = await run(
      (items) => [...items, ...temp],
      () => addExpressItem({ listId: list.id, text: texts.join(", "), guestName }),
    );
    if (data?.merged.length) {
      const names = data.merged.map((t) => `"${t}"`).join(", ");
      setNotice(
        data.merged.length === 1
          ? `${names} c'era già: ho aggiunto il tuo 👍`
          : `${names} c'erano già: ho aggiunto i tuoi 👍`,
      );
    }
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    void addProducts(itemText);
    inputRef.current?.focus();
  };

  const focusAdd = () => {
    addSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300);
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
  const shareLink = async () => {
    if (!canNativeShare) return copyLink();
    try {
      await navigator.share({ title: list.name, text: shareText, url: shareUrl });
    } catch {
      // condivisione annullata
    }
  };

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
  const suggestions = useMemo(() => {
    if (list.items.length >= 10) return [];
    const present = new Set(list.items.map((i) => normalize(i.text)));
    return SUGGESTIONS.filter((s) => !present.has(normalize(s))).slice(0, 6);
  }, [list.items]);

  const lonely = list.contributors <= 1;
  // Riquadro grande finché chi ha creato la lista è ancora da solo/a
  const showBigShare = lonely && (justCreated || list.isCreator);

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      {/* Intestazione */}
      <header className="text-center">
        <p className="font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
          Cambusa Express
        </p>
        <h1 className="mt-2 break-words font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">
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
            {toBuy.length === 1 ? "1 da comprare" : `${toBuy.length} da comprare`}
            {bought.length > 0 ? `, ${bought.length} presi` : ""}
          </span>
        </p>
      </header>

      {/* Condivisione: grande all'inizio, compatta quando la crew è già dentro */}
      {showBigShare ? (
        <section
          aria-label="Condividi la lista"
          className="rounded-2xl border border-accent-40 bg-gradient-to-br from-accent/15 via-white to-accent-light/20 p-4 sm:p-5"
        >
          <p className="font-semibold text-gray-900">
            {justCreated ? "Lista creata! Ora mandala alla crew 👇" : "Sei ancora da solo/a: invita la crew 👇"}
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
              onClick={shareLink}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 font-semibold text-primary transition hover:bg-secondary"
            >
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copied ? "Link copiato!" : canNativeShare ? "Condividi link" : "Copia link"}
            </button>
          </div>
        </section>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#25D366] hover:text-[#128C7E]"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            Invita su WhatsApp
          </a>
          <button
            type="button"
            onClick={shareLink}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Copiato!" : canNativeShare ? "Condividi" : "Copia link"}
          </button>
        </div>
      )}

      {/* Nome ospite oppure campo per aggiungere prodotti */}
      <section
        ref={addSectionRef}
        aria-label="Aggiungi prodotti"
        className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
      >
        {!nameReady ? (
          <div className="h-[4.5rem]" aria-hidden />
        ) : guestName ? (
          <form onSubmit={submitAdd} className="space-y-2">
            <label htmlFor="express-item" className="block text-sm font-semibold text-gray-800">
              Cosa vuoi a bordo, {guestName}?
            </label>
            <div className="flex gap-2">
              <input
                id="express-item"
                ref={inputRef}
                className={inputClass}
                placeholder="Es. pomodori, birra x24, Nutella"
                value={itemText}
                maxLength={300}
                onChange={(e) => setItemText(e.target.value)}
                enterKeyHint="send"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!itemText.trim()}
                aria-label="Aggiungi"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-accent px-4 font-semibold text-white transition hover:bg-accent-light disabled:opacity-50"
              >
                <Plus className="h-5 w-5" aria-hidden />
                <span className="hidden sm:inline">Aggiungi</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>Puoi aggiungerne più di uno separandoli con una virgola.</span>
              <button
                type="button"
                onClick={() => {
                  setNameDraft(guestName);
                  setGuestName("");
                }}
                className="underline-offset-2 hover:underline"
              >
                Non sei {guestName}?
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="pt-2">
                <p className="mb-2 text-xs font-semibold text-gray-600">Aggiungi al volo:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void addProducts(s)}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/40 bg-primary/[0.04] px-3 py-1.5 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/10"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                autoComplete="given-name"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-white transition hover:bg-primary-light"
              >
                Entra
              </button>
            </div>
            <p className="text-xs text-gray-500">Puoi già votare i prodotti qui sotto anche senza nome.</p>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-2 text-sm font-medium text-emerald-700">
            {notice}
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
              <h2 className="mb-2 flex items-baseline justify-between px-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                {category}
                <span className="font-semibold normal-case tracking-normal text-gray-400">{items.length}</span>
              </h2>
              <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    isNew={freshIds.has(item.id)}
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
                      isNew={false}
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
        <p className="mt-2 font-semibold text-gray-900">Volete anche il menu della settimana?</p>
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

      {/* Pulsante sempre a portata quando il campo per aggiungere non si vede */}
      {guestName && !addFormVisible && (
        <button
          type="button"
          onClick={focusAdd}
          className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgb(var(--accent-rgb),0.35)] transition hover:bg-accent-light"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Aggiungi
        </button>
      )}
    </div>
  );
}

function ItemRow({
  item,
  isNew,
  onVote,
  onToggle,
  onDelete,
}: {
  item: ExpressItemView;
  isNew: boolean;
  onVote: (item: ExpressItemView, value: 1 | -1) => void;
  onToggle: (item: ExpressItemView) => void;
  onDelete: (item: ExpressItemView) => void;
}) {
  const pending = item.id.startsWith("tmp-");
  return (
    <li
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 transition-colors duration-700 sm:gap-3 sm:px-4 sm:py-3",
        item.checked && "bg-gray-50",
        isNew && "bg-amber-50",
        pending && "opacity-60",
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={item.checked}
        aria-label={item.checked ? `Togli la spunta a ${item.text}` : `Spunta ${item.text}`}
        onClick={() => onToggle(item)}
        disabled={pending}
        className="-m-2 flex shrink-0 items-center justify-center p-2"
      >
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md border-2 transition",
            item.checked ? "border-emerald-500 bg-emerald-500 text-white" : "border-gray-300 hover:border-primary",
          )}
        >
          {item.checked && <Check className="h-4 w-4" strokeWidth={3} aria-hidden />}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("break-words font-medium leading-snug text-gray-900", item.checked && "text-gray-400 line-through")}>
          {item.text}
        </p>
        <p className="truncate text-xs text-gray-500">
          {isNew ? <span className="font-semibold text-amber-700">Nuovo · </span> : null}
          {item.mine ? "proposto da te" : `proposto da ${item.addedByName}`}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <VoteButton
          active={item.myVote === 1}
          count={item.up}
          label={`Mi piace: ${item.text}`}
          onClick={() => onVote(item, 1)}
          tone="up"
          disabled={pending}
        />
        <VoteButton
          active={item.myVote === -1}
          count={item.down}
          label={`Non mi piace: ${item.text}`}
          onClick={() => onVote(item, -1)}
          tone="down"
          disabled={pending}
        />
        {item.canDelete && (
          <button
            type="button"
            onClick={() => onDelete(item)}
            aria-label={`Elimina ${item.text}`}
            className="flex h-8 w-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-600"
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
  disabled,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
  tone: "up" | "down";
  disabled?: boolean;
}) {
  const Icon = tone === "up" ? ThumbsUp : ThumbsDown;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        "flex h-8 min-w-[2.6rem] items-center justify-center gap-1 rounded-lg border px-1.5 text-sm font-semibold tabular-nums transition active:scale-95",
        active
          ? tone === "up"
            ? "border-primary bg-primary text-white"
            : "border-red-500 bg-red-500 text-white"
          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {count}
    </button>
  );
}
