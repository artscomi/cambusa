"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import {
  categorizeExpressItem,
  EXPRESS_CATEGORIES,
} from "@/lib/express/categorize";
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
import { trackEvent } from "@/lib/gtag";

// Aggiornamento automatico della lista: frequente mentre la usi, più lento quando è ferma,
// sospeso dopo un po' di inattività (riparte appena tocchi lo schermo o torni sulla scheda)
const REFRESH_ACTIVE_MS = 5000; // primo minuto dall'ultima interazione
const REFRESH_IDLE_MS = 30000; // fino a 5 minuti dall'ultima interazione
const ACTIVE_WINDOW_MS = 60 * 1000;
const STOP_AFTER_MS = 5 * 60 * 1000;
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
  const [inviteOpen, setInviteOpen] = useState(false);
  const inviteRef = useRef<HTMLDivElement>(null);
  // Su desktop l'invito sta nel pannello di sinistra invece che nel pulsante flottante
  const inviteCardRef = useRef<HTMLDivElement>(null);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const busy = useRef(0);
  const seenIds = useRef(new Set(initialList.items.map((i) => i.id)));
  const inputRef = useRef<HTMLInputElement>(null);
  // Telefono, lista non vuota: pulsante "+" che apre un pannello dal basso per aggiungere
  const sheetInputRef = useRef<HTMLInputElement>(null);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [sessionAdded, setSessionAdded] = useState<string[]>([]);
  // Prodotti da evidenziare in lista quando la modale si chiude (la pagina non scorre)
  const [highlightTexts, setHighlightTexts] = useState<string[]>([]);
  const [nameSheetOpen, setNameSheetOpen] = useState(false);
  // Azione da riprendere dopo che l'ospite ha scritto il nome (aggiungere o votare)
  const afterNameRef = useRef<((name: string) => void) | null>(null);

  useEffect(() => {
    const saved = readGuestName();
    setGuestName(saved);
    setNameDraft(saved);
    setNameReady(true);
    // Invitato che apre il link per la prima volta: gli chiediamo subito come si chiama
    if (!saved) setNameSheetOpen(true);
    setShareUrl(`${window.location.origin}/express/${initialList.id}`);
    setCanNativeShare(typeof navigator.share === "function");
  }, [initialList.id]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  /** Applica una versione aggiornata della lista (dal polling o dalla risposta di un'azione). */
  const applyFresh = useCallback((fresh: ListData | null) => {
    // Non sovrascrivere mentre un'azione è in corso (aggiornamento ottimistico)
    if (!fresh || busy.current !== 0) return;
    // Evidenzia per qualche secondo i prodotti appena aggiunti dagli altri
    const arrived = fresh.items.filter(
      (i) => !seenIds.current.has(i.id) && !i.mine,
    );
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
  }, []);

  const refresh = useCallback(async () => {
    applyFresh(await getExpressList(initialList.id));
  }, [initialList.id, applyFresh]);

  // Aggiornamento periodico: così si vedono i prodotti e i voti degli altri
  useEffect(() => {
    let lastActivity = Date.now();
    let timer: number | undefined;
    let stopped = false;

    const schedule = () => {
      window.clearTimeout(timer);
      const idle = Date.now() - lastActivity;
      if (idle >= STOP_AFTER_MS || document.visibilityState !== "visible") {
        stopped = true; // fermo finché non torni a usare la pagina
        return;
      }
      stopped = false;
      timer = window.setTimeout(
        async () => {
          await refresh();
          schedule();
        },
        idle < ACTIVE_WINDOW_MS ? REFRESH_ACTIVE_MS : REFRESH_IDLE_MS,
      );
    };

    const onActivity = () => {
      const wasStopped = stopped;
      lastActivity = Date.now();
      if (wasStopped) {
        void refresh(); // dopo una pausa, mostra subito le novità
        schedule();
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        lastActivity = Date.now();
        void refresh();
        schedule();
      } else {
        window.clearTimeout(timer);
        stopped = true;
      }
    };

    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    // In cattura: lo scorrimento avviene in un contenitore interno e non arriverebbe alla finestra
    events.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true, capture: true }),
    );
    document.addEventListener("visibilitychange", onVisible);
    schedule();
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) =>
        window.removeEventListener(e, onActivity, { capture: true }),
      );
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  /** Esegue un'azione con aggiornamento ottimistico, poi riallinea con il server. */
  const run = async <T,>(
    optimistic: (items: ExpressItemView[]) => ExpressItemView[],
    action: () => Promise<
      { ok: true; data?: T } | { ok: false; error: string }
    >,
  ): Promise<T | undefined> => {
    busy.current += 1;
    setError(null);
    setList((l) => ({ ...l, items: optimistic(l.items) }));
    let data: T | undefined;
    let freshFromAction: ListData | null = null;
    try {
      const result = await action();
      if (result.ok) {
        data = result.data;
        // Alcune azioni restituiscono già la lista aggiornata: niente seconda richiesta
        const maybe = (data as { list?: ListData | null } | undefined)?.list;
        if (maybe) freshFromAction = maybe;
      } else setError(result.error);
    } catch {
      setError("Connessione assente, riprova");
    } finally {
      busy.current -= 1;
      if (freshFromAction) applyFresh(freshFromAction);
      else await refresh();
    }
    return data;
  };

  const vote = (
    item: ExpressItemView,
    value: 1 | -1,
    nameNow: string = guestName,
  ) => {
    if (!nameNow) {
      afterNameRef.current = (name) => void vote(item, value, name);
      setNameSheetOpen(true);
      return;
    }
    trackEvent("express_vote", { value: value === 1 ? "up" : "down" });
    return run(
      (items) =>
        items.map((i) => {
          if (i.id !== item.id) return i;
          const next = i.myVote === value ? 0 : value;
          const up = i.up - (i.myVote === 1 ? 1 : 0) + (next === 1 ? 1 : 0);
          const down =
            i.down - (i.myVote === -1 ? 1 : 0) + (next === -1 ? 1 : 0);
          return { ...i, myVote: next, up, down, score: up - down };
        }),
      () => voteExpressItem({ itemId: item.id, value, guestName: nameNow }),
    );
  };

  const toggleChecked = (item: ExpressItemView) => {
    if (!item.checked) trackEvent("express_item_checked");
    return run(
      (items) =>
        items.map((i) =>
          i.id === item.id ? { ...i, checked: !i.checked } : i,
        ),
      () =>
        toggleExpressItemChecked({ itemId: item.id, checked: !item.checked }),
    );
  };

  // Conferma di rimozione: modale come quella della lista della spesa del menu
  const [itemToRemove, setItemToRemove] = useState<ExpressItemView | null>(
    null,
  );
  const remove = (item: ExpressItemView) => setItemToRemove(item);
  const cancelRemove = () => setItemToRemove(null);
  const confirmRemove = () => {
    const item = itemToRemove;
    setItemToRemove(null);
    if (!item) return;
    void run(
      (items) => items.filter((i) => i.id !== item.id),
      () => deleteExpressItem({ itemId: item.id }),
    );
  };

  // Esc chiude la modale
  useEffect(() => {
    if (!itemToRemove) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setItemToRemove(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [itemToRemove]);

  const confirmName = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameDraft.trim();
    if (!name) return setError("Scrivi il tuo nome");
    saveGuestName(name);
    setGuestName(name);
    setError(null);
    setNameSheetOpen(false);
    // Riprende l'azione che aveva chiesto il nome (aggiungere o votare), se c'era
    const next = afterNameRef.current;
    afterNameRef.current = null;
    if (next) setTimeout(() => next(name), 0);
  };

  /** Aggiunge uno o più prodotti; compaiono subito, poi si riallinea col server. */
  const addProducts = async (raw: string) => {
    const texts = raw
      .split(/[,;\n]+/)
      .map((t) => t.replace(/\s+/g, " ").trim().slice(0, 60))
      .filter(Boolean);
    if (texts.length === 0) return;
    if (addSheetOpen) {
      setSessionAdded((prev) => [...prev, ...texts]);
    }
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
        downVoters: [],
        canDelete: true, // chi aggiunge può eliminarlo: il cestino c'è già, attivo dopo la conferma
        mine: true,
      }));
    setItemText("");
    const data = await run(
      (items) => [...items, ...temp],
      () =>
        addExpressItem({ listId: list.id, text: texts.join(", "), guestName }),
    );
    if (data) {
      trackEvent("express_item_added", {
        added: data.added.length,
        merged: data.merged.length,
      });
    }
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

  const submitSheet = (e: React.FormEvent) => {
    e.preventDefault();
    void addProducts(itemText);
    sheetInputRef.current?.focus();
  };

  /** Prodotto in cima allo schermo: serve a tenere ferma la vista mentre la lista cambia. */
  const anchorRef = useRef<{ id: string; top: number } | null>(null);
  const captureAnchor = () => {
    const first = [
      ...document.querySelectorAll<HTMLElement>("li[data-item-id]"),
    ].find((li) => li.getBoundingClientRect().top >= 80);
    anchorRef.current = first
      ? { id: first.dataset.itemId!, top: first.getBoundingClientRect().top }
      : null;
  };

  const openAddSheet = () => {
    captureAnchor();
    setError(null);
    setSessionAdded([]);
    if (guestName) setAddSheetOpen(true);
    else {
      afterNameRef.current = () => setAddSheetOpen(true);
      setNameSheetOpen(true);
    }
  };

  const closeAddSheet = () => {
    // Tiene ferma la vista ancora un attimo, finché il server conferma gli ultimi prodotti
    setTimeout(() => (anchorRef.current = null), 2500);
    setAddSheetOpen(false);
    setHighlightTexts(sessionAdded);
    setSessionAdded([]);
  };

  // Mentre un pannello è aperto la pagina sotto non scorre
  useEffect(() => {
    if (!addSheetOpen && !nameSheetOpen) return;
    const targets = [
      document.body,
      document.getElementById("app-main-scroll"),
    ].filter((el): el is HTMLElement => !!el);
    const previous = targets.map((el) => el.style.overflow);
    targets.forEach((el) => (el.style.overflow = "hidden"));
    return () => targets.forEach((el, i) => (el.style.overflow = previous[i]));
  }, [addSheetOpen, nameSheetOpen]);

  // Mentre si aggiunge, i prodotti nuovi possono entrare sopra lo schermo e spostare la lista:
  // riporta la vista esattamente dov'era (con la modale aperta il browser non lo fa da solo)
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const el = document.querySelector<HTMLElement>(
      `[data-item-id="${anchor.id}"]`,
    );
    if (!el) return;
    const delta = el.getBoundingClientRect().top - anchor.top;
    if (Math.abs(delta) < 1) return;
    const main = document.getElementById("app-main-scroll");
    if (main && main.scrollHeight > main.clientHeight) main.scrollTop += delta;
    else window.scrollBy(0, delta);
  }, [list.items]);

  // Chiusa la modale, evidenzia per qualche secondo i prodotti appena aggiunti
  useEffect(() => {
    if (addSheetOpen || highlightTexts.length === 0) return;
    const wanted = new Set(highlightTexts.map(normalize));
    const found = list.items.filter(
      (i) => wanted.has(normalize(i.text)) && !i.id.startsWith("tmp-"),
    );
    if (found.length === 0) return; // ancora in salvataggio: riprova al prossimo aggiornamento
    setHighlightTexts([]);
    const ids = found.map((i) => i.id);
    setFreshIds((prev) => new Set([...prev, ...ids]));
    setTimeout(() => {
      setFreshIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }, NEW_HIGHLIGHT_MS);
  }, [addSheetOpen, highlightTexts, list.items]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      trackEvent("express_invite", { method: "copy_link" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        "Non riesco a copiare il link: copialo dalla barra degli indirizzi",
      );
    }
  };

  const shareText = `Aiutami a fare la cambusa per "${list.name}": aggiungi quello che vuoi a bordo e vota le proposte!`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const invite = () => {
    if (canNativeShare) return void shareLink();
    setInviteOpen((v) => !v);
  };

  // Chiude il menu "Invita" toccando fuori
  useEffect(() => {
    if (!inviteOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !inviteRef.current?.contains(t) &&
        !inviteCardRef.current?.contains(t)
      )
        setInviteOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [inviteOpen]);

  const shareLink = async () => {
    if (!canNativeShare) return copyLink();
    try {
      // Testo e link in un unico messaggio: così il testo viene prima e il link dopo
      // (passandoli separati, app come WhatsApp mettono il link in testa)
      await navigator.share({
        title: list.name,
        text: `${shareText}\n${shareUrl}`,
      });
      trackEvent("express_invite", { method: "native_share" });
    } catch {
      // condivisione annullata
    }
  };

  const toBuy = useMemo(
    () => list.items.filter((i) => !i.checked),
    [list.items],
  );
  const bought = useMemo(
    () => list.items.filter((i) => i.checked),
    [list.items],
  );
  /** Prodotti che chi guarda non ha ancora votato. */
  const toVote = useMemo(
    () =>
      toBuy.filter((i) => i.myVote === 0 && !i.id.startsWith("tmp-")).length,
    [toBuy],
  );
  const byCategory = useMemo(
    () =>
      EXPRESS_CATEGORIES.map((category) => {
        const items = toBuy.filter((i) => i.category === category);
        const all = items;
        // "Il più votato" del reparto: solo se ha almeno 2 punti ed è l'unico in testa
        const best = Math.max(...all.map((i) => i.score));
        const leaders = all.filter((i) => i.score === best);
        const topId =
          all.length > 1 && best >= 2 && leaders.length === 1
            ? leaders[0].id
            : null;
        return { category, items, topId };
      }).filter((g) => g.items.length > 0),
    [toBuy],
  );
  const suggestions = useMemo(() => {
    if (list.items.length >= 10) return [];
    const present = new Set(list.items.map((i) => normalize(i.text)));
    return SUGGESTIONS.filter((s) => !present.has(normalize(s))).slice(0, 6);
  }, [list.items]);

  // Una lista vuota non si condivide: il pulsante "Invita" compare dopo il primo prodotto
  const hasItems = list.items.length > 0;

  /** Menu "Invita la crew" (WhatsApp / Copia link) quando il telefono non ha la condivisione nativa. */
  const inviteMenu = (position: string) =>
    inviteOpen && !canNativeShare ? (
      <div
        className={cn(
          "absolute z-30 w-56",
          position,
          " overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-[0_16px_40px_rgba(13,32,49,0.14)]",
        )}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackEvent("express_invite", { method: "whatsapp" });
            setInviteOpen(false);
          }}
          className="flex items-center gap-2.5 px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50"
        >
          <Share2 className="h-4 w-4 text-[#25D366]" aria-hidden />
          Invia su WhatsApp
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="flex w-full items-center gap-2.5 border-t border-gray-100 px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-600" aria-hidden />
          ) : (
            <Copy className="h-4 w-4 text-primary" aria-hidden />
          )}
          {copied ? "Link copiato!" : "Copia link"}
        </button>
      </div>
    ) : null;

  return (
    <div
      className={cn(
        "space-y-6 sm:pb-0",
        // Desktop: pannello fisso a sinistra, reparti a destra
        "lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start lg:gap-8 lg:space-y-0 lg:pb-0",
        hasItems ? "pb-24" : "pb-6",
      )}
    >
      <aside data-express-layout className="space-y-6 lg:sticky lg:top-24 lg:space-y-4">
        {/* Intestazione */}
        <header className="text-center lg:text-left">
          <p className="font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
            Cambusa Express
          </p>
          <h1 className="mt-2 break-words font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">
            {list.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-600 lg:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" aria-hidden />
              {list.contributors === 1
                ? "1 partecipante"
                : `${list.contributors} partecipanti`}
              {list.people ? ` su ${list.people}` : ""}
            </span>
            <span aria-hidden>·</span>
            <span>
              {toBuy.length === 1
                ? "1 da comprare"
                : `${toBuy.length} da comprare`}
              {bought.length > 0 ? `, ${bought.length} presi` : ""}
            </span>
          </div>
        </header>

        {/* Nome ospite oppure campo per aggiungere prodotti */}
        <section
          aria-label="Aggiungi prodotti"
          className={cn(
            "scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5",
            // Con la lista piena si aggiunge dalla modale ("+ Aggiungi"); su desktop resta nel pannello
            hasItems && "hidden lg:block",
          )}
        >
          {!nameReady ? (
            <div className="h-[4.5rem]" aria-hidden />
          ) : guestName ? (
            <form onSubmit={submitAdd} className="space-y-2">
              <label
                htmlFor="express-item"
                className="block text-sm font-semibold text-gray-800"
              >
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
                  <span className="hidden sm:inline lg:hidden">Aggiungi</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-gray-500">
                <span>
                  Puoi aggiungerne più di uno separandoli con una virgola.
                </span>
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
                  <p className="mb-2 text-xs font-semibold text-gray-600">
                    Aggiungi al volo:
                  </p>
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
              <label
                htmlFor="express-guest"
                className="block text-sm font-semibold text-gray-800"
              >
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
              <p className="text-xs text-gray-500">
                Puoi già votare i prodotti qui sotto anche senza nome.
              </p>
            </form>
          )}
          {error && (
            <p role="alert" className="mt-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="mt-2 text-sm font-medium text-emerald-700"
            >
              {notice}
            </p>
          )}
        </section>

        {guestName && toVote > 0 && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {toVote === 1
              ? "1 prodotto da votare per te"
              : `${toVote} prodotti da votare per te`}
          </p>
        )}

        {/* Desktop: invito nel pannello */}
        {hasItems && (
          <div ref={inviteCardRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={invite}
              aria-expanded={canNativeShare ? undefined : inviteOpen}
              className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left transition hover:border-accent-40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <Share2 className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold text-gray-900">
                  Invita la crew
                </span>
                <span className="block text-xs text-gray-500">
                  WhatsApp o link da copiare
                </span>
              </span>
            </button>
            {inviteMenu("left-0 top-full mt-2")}
          </div>
        )}

        {/* Desktop: invito al menu con l'AI, compatto nel pannello */}
        <Link
          href="/"
          className="hidden items-center gap-3 rounded-2xl border border-primary/20 bg-primary/[0.05] px-4 py-3 lg:flex"
        >
          <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1 text-sm text-gray-700">
            Volete anche il <strong>menu della settimana</strong>?
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        </Link>
      </aside>

      <div className="space-y-6">
        {/* Lista per reparto */}
        {list.items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-8 text-center text-gray-500">
            La lista è vuota: aggiungi il primo prodotto!
          </p>
        ) : (
          <div className="space-y-5">
            {/* Desktop: reparti su due colonne */}
            <div className="space-y-5 lg:columns-2 lg:gap-5 lg:space-y-0">
              {byCategory.map(({ category, items, topId }) => (
                <section
                  key={category}
                  aria-label={category}
                  className="lg:break-inside-avoid lg:pb-7"
                >
                  <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                    {category}
                  </h2>
                  <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    {items.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        isNew={freshIds.has(item.id)}
                        isTop={item.id === topId}
                        onVote={vote}
                        onToggle={toggleChecked}
                        onDelete={remove}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>

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
                    className={cn(
                      "h-4 w-4 transition-transform",
                      showChecked && "rotate-180",
                    )}
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
                        isTop={false}
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

        {/* Passaggio al menu completo: una riga compatta su telefono */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/[0.05] px-4 py-3 sm:hidden"
        >
          <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1 text-sm text-gray-700">
            Volete anche il <strong>menu della settimana</strong>?
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
            Crea con l&apos;AI
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </Link>
        <section className="hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-transparent p-5 text-center sm:block sm:p-6 lg:hidden">
          <Sparkles className="mx-auto h-6 w-6 text-primary" aria-hidden />
          <p className="mt-2 font-semibold text-gray-900">
            Volete anche il menu della settimana?
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
            Cambusa crea con l&apos;AI colazioni, pranzi e cene per tutta la
            crew, con la lista della spesa già pronta.
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

      {/* Invita la crew: pulsante tondo flottante in basso a sinistra, solo icona */}
      {hasItems && !addSheetOpen && !nameSheetOpen && (
        <div
          ref={inviteRef}
          className="fixed bottom-5 left-5 z-30 lg:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            type="button"
            onClick={invite}
            aria-label="Invita la crew"
            title="Invita la crew"
            aria-expanded={canNativeShare ? undefined : inviteOpen}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_30px_rgb(var(--accent-rgb),0.4)] transition hover:bg-accent-light active:scale-95"
          >
            <Share2 className="h-6 w-6" aria-hidden />
          </button>
          {inviteMenu("bottom-full left-0 mb-3")}
        </div>
      )}

      {/* Lista non vuota: pulsante "+" che apre la modale per aggiungere */}
      {hasItems && nameReady && !addSheetOpen && !nameSheetOpen && (
        <button
          type="button"
          onClick={openAddSheet}
          className="fixed bottom-5 right-5 z-30 inline-flex min-h-[56px] items-center gap-2 rounded-full bg-accent px-6 text-base font-semibold text-white shadow-[0_10px_30px_rgb(var(--accent-rgb),0.4)] transition hover:bg-accent-light active:scale-95 lg:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <Plus className="h-6 w-6" aria-hidden />
          Aggiungi
        </button>
      )}

      {/* Modale per aggiungere prodotti: la pagina sotto resta ferma dov'era */}
      {addSheetOpen && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 px-4 pt-20 sm:items-center sm:pt-4"
          onClick={closeAddSheet}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="express-add-sheet-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(13,32,49,0.25)]"
          >
            <div className="flex items-center justify-between">
              <p
                id="express-add-sheet-title"
                className="font-semibold text-gray-900"
              >
                Cosa vuoi a bordo, {guestName}?
              </p>
              <button
                type="button"
                onClick={closeAddSheet}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-primary"
              >
                Fatto
              </button>
            </div>
            <form onSubmit={submitSheet} className="flex gap-2">
              <input
                ref={sheetInputRef}
                aria-label="Aggiungi un prodotto"
                className={inputClass}
                placeholder="Es. pomodori, birra x24, Nutella"
                value={itemText}
                maxLength={300}
                onChange={(e) => setItemText(e.target.value)}
                enterKeyHint="send"
                autoComplete="off"
                autoFocus
              />
              <button
                type="submit"
                disabled={!itemText.trim()}
                aria-label="Aggiungi"
                className="inline-flex w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition disabled:opacity-50"
              >
                <Plus className="h-5 w-5" aria-hidden />
              </button>
            </form>
            {(error || notice) && (
              <p
                role={error ? "alert" : "status"}
                className={cn(
                  "text-sm font-medium",
                  error ? "text-red-600" : "text-emerald-700",
                )}
              >
                {error ?? notice}
              </p>
            )}
            {sessionAdded.length > 0 && (
              <div className="flex flex-wrap gap-1.5" aria-live="polite">
                {sessionAdded.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    {t}
                  </span>
                ))}
              </div>
            )}
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    // Non togliere il focus al campo, così la tastiera resta aperta
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => void addProducts(sug)}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/40 bg-primary/[0.04] px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modale per scrivere il nome */}
      {nameSheetOpen && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 px-4 pt-20 backdrop-blur-sm sm:items-center sm:pt-4"
          onClick={() => {
            afterNameRef.current = null;
            setNameSheetOpen(false);
          }}
        >
          <form
            onSubmit={confirmName}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-3 rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(13,32,49,0.25)]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary/80">
              Sei a bordo di «{list.name}»
            </p>
            <label
              htmlFor="express-guest-sheet"
              className="block text-lg font-semibold text-gray-900"
            >
              Come ti chiami?
            </label>
            <p className="-mt-2 text-sm text-gray-500">
              Così la crew sa chi propone cosa e chi ha votato.
            </p>
            <input
              id="express-guest-sheet"
              className={inputClass}
              placeholder="Il tuo nome"
              value={nameDraft}
              maxLength={30}
              onChange={(e) => setNameDraft(e.target.value)}
              autoComplete="given-name"
              autoFocus
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 font-semibold text-white"
            >
              Entra nella lista
            </button>
          </form>
        </div>
      )}

      {/* Modale di conferma rimozione */}
      {itemToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={cancelRemove}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="express-remove-title"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-4 max-w-md rounded-lg bg-white p-6"
          >
            <h3
              id="express-remove-title"
              className="mb-4 text-lg font-semibold"
            >
              Conferma rimozione
            </h3>
            <p className="mb-6 text-gray-600">
              Sei sicuro di voler rimuovere{" "}
              <strong>&quot;{itemToRemove.text}&quot;</strong> dalla lista?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelRemove}
                autoFocus
                className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                Rimuovi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  isNew,
  isTop,
  onVote,
  onToggle,
  onDelete,
}: {
  item: ExpressItemView;
  isNew: boolean;
  isTop: boolean;
  onVote: (item: ExpressItemView, value: 1 | -1) => void;
  onToggle: (item: ExpressItemView) => void;
  onDelete: (item: ExpressItemView) => void;
}) {
  const pending = item.id.startsWith("tmp-");
  // Chi non lo vuole: "Marco non lo vuole", "Marco e Anna non lo vogliono"...
  const notWanted = describeDownVoters(item.downVoters);

  // In attesa del server la riga è già quella definitiva, solo non cliccabile;
  // se la conferma tarda (connessione lenta) compare "salvataggio…"
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setSlow(true), 1000);
    return () => clearTimeout(t);
  }, [pending]);

  return (
    <li
      data-item-id={item.id}
      data-pending={pending || undefined}
      aria-busy={pending || undefined}
      className={cn(
        "flex scroll-mt-24 items-center gap-2.5 px-3 py-2.5 transition-colors duration-700 sm:gap-3 sm:px-4 sm:py-3",
        item.checked && "bg-gray-50",
        isNew && "bg-amber-50",
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={item.checked}
        aria-label={
          item.checked
            ? `Togli la spunta a ${item.text}`
            : `Spunta ${item.text}`
        }
        onClick={() => onToggle(item)}
        disabled={pending}
        className="-m-2 flex shrink-0 items-center justify-center p-2"
      >
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md border-2 transition",
            item.checked
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-gray-300 hover:border-primary",
          )}
        >
          {item.checked && (
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "break-words font-medium leading-snug text-gray-900",
            item.checked && "text-gray-400 line-through",
          )}
        >
          {item.text}
        </p>
        <p className="truncate text-xs text-gray-500">
          {isNew ? (
            <span className="font-semibold text-amber-700">Nuovo · </span>
          ) : null}
          {isTop ? (
            <span className="font-semibold text-amber-600">
              ⭐ Il più votato ·{" "}
            </span>
          ) : null}
          {item.mine ? "proposto da te" : `proposto da ${item.addedByName}`}
          {pending && slow ? <span className="text-gray-400"> · salvataggio…</span> : null}
        </p>
        {notWanted && !item.checked && (
          <p className="text-xs font-medium text-red-600">👎 {notWanted}</p>
        )}
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
            disabled={pending}
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

/** "Marco non lo vuole" · "Marco e Anna non lo vogliono" · "Marco, Anna e altri 2 non lo vogliono" */
function describeDownVoters(names: string[]): string | null {
  if (names.length === 0) return null;
  if (names.length === 1) return `${names[0]} non lo vuole`;
  if (names.length === 2) return `${names[0]} e ${names[1]} non lo vogliono`;
  const others = names.length - 2;
  return `${names[0]}, ${names[1]} e ${others === 1 ? "un altro" : `altri ${others}`} non lo vogliono`;
}
