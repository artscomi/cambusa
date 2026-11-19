"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Euro, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/gtag";
import {
  disconnectSplitwise,
  getSplitwiseState,
  sendExpenseToSplitwise,
} from "../splitwise-actions";
import type { SplitwiseGroup } from "@/lib/splitwise";

const amountKey = (listId: string) => `cambusa_splitwise_amount_${listId}`;
const DESKTOP = "(min-width: 1024px)";

const inputClass =
  "block w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

/** "12,50" o "12.50" → 12.5 */
const parseAmount = (raw: string) => Number(raw.replace(/\s|€/g, "").replace(",", "."));

/**
 * "Dividi la spesa su Splitwise": chi ha pagato scrive il totale dello scontrino e lo
 * registra in un gruppo Splitwise, diviso in parti uguali tra tutta la crew.
 * Compare in due posti (pannello su desktop, sotto la lista su telefono):
 * `place` dice quale delle due istanze riapre la finestra al ritorno da Splitwise.
 */
export function SplitwiseShare({
  listId,
  place,
  className,
}: {
  listId: string;
  place: "desktop" | "mobile";
  className?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [groups, setGroups] = useState<SplitwiseGroup[]>([]);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ groupId: number; amount: number } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSplitwiseState();
      if (!res.ok) {
        setConnected(false);
        if (!res.needsLogin) setError(res.error);
        return;
      }
      const state = res.data;
      setConnected(state.connected);
      if (state.connected) {
        setGroups(state.groups);
        setGroupId((g) => g ?? state.groups[0]?.id ?? null);
      }
    } catch {
      setError("Connessione assente, riprova");
    } finally {
      setLoading(false);
    }
  }, []);

  const openModal = useCallback(() => {
    setDone(null);
    setOpen(true);
    void load();
  }, [load]);

  // Ritorno da Splitwise (?splitwise=ok|errore): riapre la finestra con il totale già scritto
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("splitwise");
    if (!status) return;
    const isDesktop = window.matchMedia(DESKTOP).matches;
    if ((place === "desktop") !== isDesktop) return;
    params.delete("splitwise");
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    try {
      setAmount(sessionStorage.getItem(amountKey(listId)) ?? "");
    } catch {
      // storage non disponibile: il totale si riscrive
    }
    openModal();
    if (status === "ok") trackEvent("express_splitwise_connected");
    else setError("Collegamento a Splitwise non riuscito, riprova");
  }, [listId, place, openModal]);

  // Esc chiude
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const value = parseAmount(amount);
  const validAmount = Number.isFinite(value) && value > 0;

  const connect = () => {
    if (!validAmount) return setError("Scrivi prima il totale dello scontrino");
    try {
      sessionStorage.setItem(amountKey(listId), amount);
    } catch {
      // pazienza: al ritorno il totale si riscrive
    }
    trackEvent("express_splitwise_connect_click");
    window.location.href = `/api/splitwise/connect?return=${encodeURIComponent(pathname)}`;
  };

  const send = async () => {
    if (!validAmount) return setError("Scrivi il totale dello scontrino");
    if (!groupId) return setError("Scegli il gruppo Splitwise");
    setLoading(true);
    setError(null);
    try {
      const res = await sendExpenseToSplitwise({ listId, groupId, amount: value });
      if (res.ok) {
        setDone({ groupId: res.data.groupId, amount: value });
        trackEvent("express_splitwise_expense", { value });
        try {
          sessionStorage.removeItem(amountKey(listId));
        } catch {}
      } else if (res.needsLogin) {
        setConnected(false);
        setError(res.error);
      } else setError(res.error);
    } catch {
      setError("Connessione assente, riprova");
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    await disconnectSplitwise();
    setConnected(false);
    setGroups([]);
    setGroupId(null);
  };

  const group = groups.find((g) => g.id === groupId);
  const perHead =
    group && group.members > 0 && validAmount ? value / group.members : null;
  const euro = (n: number) =>
    n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left transition hover:border-emerald-300",
          className,
        )}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Euro className="h-5 w-5" aria-hidden />
        </span>
        <span>
          <span className="block font-semibold text-gray-900">
            Dividi la spesa su Splitwise
          </span>
          <span className="block text-xs text-gray-500">
            Il totale dello scontrino, diviso tra la crew
          </span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-20 sm:items-center sm:pt-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`splitwise-title-${place}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(13,32,49,0.25)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  id={`splitwise-title-${place}`}
                  className="text-lg font-semibold text-gray-900"
                >
                  {done ? "Spesa registrata!" : "Dividi la spesa su Splitwise"}
                </p>
                {!done && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    Hai pagato tu? Registra il totale nel gruppo Splitwise
                    della crew: lo divide in parti uguali.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-primary"
              >
                {done ? "Chiudi" : "Annulla"}
              </button>
            </div>

            {done ? (
              <div className="space-y-4">
                <p className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {euro(done.amount)} registrati nel gruppo
                  {group ? ` «${group.name}»` : ""}, divisi in parti uguali.
                </p>
                <a
                  href={`https://secure.splitwise.com/#/groups/${done.groupId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600"
                >
                  Apri il gruppo su Splitwise
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>
            ) : (
              <>
                <div>
                  <label
                    htmlFor={`splitwise-amount-${place}`}
                    className="mb-1.5 block text-sm font-semibold text-gray-800"
                  >
                    Totale dello scontrino
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      €
                    </span>
                    <input
                      id={`splitwise-amount-${place}`}
                      className={cn(inputClass, "pl-9")}
                      inputMode="decimal"
                      placeholder="0,00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      autoFocus
                      autoComplete="off"
                    />
                  </div>
                </div>

                {connected === null || (loading && connected === null) ? (
                  <div className="flex justify-center py-2 text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin" aria-label="Caricamento" />
                  </div>
                ) : connected ? (
                  <>
                    {groups.length === 0 ? (
                      <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                        Non hai ancora gruppi su Splitwise. Creane uno per la
                        crociera con i membri della crew, poi torna qui.
                      </p>
                    ) : (
                      <div>
                        <label
                          htmlFor={`splitwise-group-${place}`}
                          className="mb-1.5 block text-sm font-semibold text-gray-800"
                        >
                          Gruppo Splitwise
                        </label>
                        <select
                          id={`splitwise-group-${place}`}
                          className={inputClass}
                          value={groupId ?? ""}
                          onChange={(e) => setGroupId(Number(e.target.value))}
                        >
                          {groups.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} ({g.members}{" "}
                              {g.members === 1 ? "persona" : "persone"})
                            </option>
                          ))}
                        </select>
                        {perHead !== null && (
                          <p className="mt-1.5 text-xs text-gray-500">
                            Circa {euro(perHead)} a testa
                          </p>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={send}
                      disabled={loading || groups.length === 0}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                      Registra la spesa su Splitwise
                    </button>
                    <button
                      type="button"
                      onClick={disconnect}
                      className="block w-full text-center text-xs text-gray-500 underline-offset-2 hover:underline"
                    >
                      Scollega Splitwise da questo telefono
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={connect}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Collega Splitwise e continua
                    </button>
                    <p className="text-xs text-gray-500">
                      Il permesso si dà una volta sola. Cambusa lo usa solo per
                      leggere i nomi dei tuoi gruppi e registrare questa spesa.
                    </p>
                  </>
                )}

                {error && (
                  <p role="alert" className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
