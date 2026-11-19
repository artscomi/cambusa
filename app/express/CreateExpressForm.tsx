"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/components/CTA";
import { PageContainer } from "@/components/PageContainer";
import { createExpressList } from "./actions";
import { saveGuestName, readGuestName } from "./guestName";
import { ExpressListSkeleton } from "./ExpressListSkeleton";
import { trackEvent } from "@/lib/gtag";

const inputClass =
  "block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function CreateExpressForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [people, setPeople] = useState("");
  const [yourName, setYourName] = useState("");
  useEffect(() => setYourName(readGuestName()), []);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Dai un nome alla lista");
    if (!yourName.trim()) return setError("Scrivi il tuo nome");
    startTransition(async () => {
      saveGuestName(yourName);
      const result = await createExpressList({
        name,
        people: people ? Number(people) : null,
      });
      if (!result.ok || !result.data) {
        setError(
          result.ok ? "Qualcosa è andato storto, riprova" : result.error,
        );
        return;
      }
      trackEvent("express_list_created", { people: people ? Number(people) : 0 });
      router.push(`/express/${result.data.id}?nuova=1`);
    });
  };

  return (
    <>
      {/* Mentre la lista viene creata, la pagina diventa subito la lista (skeleton) */}
      {isPending && (
        <div className="fixed inset-0 z-30 overflow-y-auto bg-white pt-[75px] md:pt-20">
          <PageContainer narrow className="pt-2 sm:pt-10 md:pt-12 lg:max-w-6xl">
            <ExpressListSkeleton name={name.trim()} empty />
          </PageContainer>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-8"
      >
        <div>
          <label
            htmlFor="express-name"
            className="mb-1.5 block text-sm font-semibold text-gray-800"
          >
            Nome della lista
          </label>
          <input
            id="express-name"
            className={inputClass}
            placeholder="Es. Crociera Eolie agosto"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_9rem]">
          <div>
            <label
              htmlFor="express-you"
              className="mb-1.5 block text-sm font-semibold text-gray-800"
            >
              Il tuo nome
            </label>
            <input
              id="express-you"
              className={inputClass}
              placeholder="Es. Cristina"
              value={yourName}
              maxLength={30}
              onChange={(e) => setYourName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="express-people"
              className="mb-1.5 block text-sm font-semibold text-gray-800"
            >
              Persone{" "}
              <span className="font-normal text-gray-500">(facolt.)</span>
            </label>
            <input
              id="express-people"
              className={inputClass}
              type="number"
              inputMode="numeric"
              min={1}
              max={50}
              placeholder="6"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <CTA type="submit" variant="accent" full disabled={isPending}>
          {isPending ? "Creo la lista…" : "Crea la lista condivisa"}
          {!isPending && <ArrowRight className="h-5 w-5" aria-hidden />}
        </CTA>
        <p className="text-center text-xs text-gray-500">
          Gratis e senza registrazione, per te e per la tua crew.
        </p>
      </form>
    </>
  );
}
