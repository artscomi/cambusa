import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PageContainer } from "@/components/PageContainer";

/**
 * Dashboard privata con i numeri chiave per capire se Cambusa risponde a un
 * bisogno reale. Visibile solo agli indirizzi email elencati nella variabile
 * d'ambiente ADMIN_EMAILS (separati da virgola); per tutti gli altri è una 404.
 */
export const metadata: Metadata = {
  title: "Metriche | Cambusa",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const PERIODS = [
  { key: "7", label: "7 giorni", days: 7 },
  { key: "30", label: "30 giorni", days: 30 },
  { key: "90", label: "90 giorni", days: 90 },
  { key: "tutto", label: "Tutto", days: null },
] as const;

type ListStats = {
  lists: number;
  with_items: number;
  with_crew: number;
  with_checked: number;
  avg_people: number | null;
  avg_items: number | null;
};

const n = (v: unknown) => Number(v ?? 0);
const pct = (part: number, total: number) =>
  total ? Math.round((part / total) * 100) : 0;

async function isAdmin() {
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!allowed.length) return false;
  const user = await currentUser();
  return !!user?.emailAddresses.some((e) =>
    allowed.includes(e.emailAddress.toLowerCase()),
  );
}

async function getListStats(days: number | null): Promise<ListStats> {
  const since = days
    ? Prisma.sql`WHERE l."createdAt" >= now() - (${days} * interval '1 day')`
    : Prisma.empty;
  const rows = await prisma.$queryRaw<Record<string, unknown>[]>`
    WITH per_list AS (
      SELECT
        l.id,
        (SELECT count(*) FROM "ExpressItem" i WHERE i."listId" = l.id) AS items,
        (SELECT count(*) FROM "ExpressItem" i WHERE i."listId" = l.id AND i.checked) AS checked,
        (SELECT count(DISTINCT t) FROM (
            SELECT l."creatorToken" AS t
            UNION SELECT i."addedBy" FROM "ExpressItem" i WHERE i."listId" = l.id
            UNION SELECT v.voter FROM "ExpressVote" v
              JOIN "ExpressItem" i ON i.id = v."itemId" WHERE i."listId" = l.id
        ) x) AS people
      FROM "ExpressList" l
      ${since}
    )
    SELECT
      count(*) AS lists,
      count(*) FILTER (WHERE items > 0) AS with_items,
      count(*) FILTER (WHERE people >= 2) AS with_crew,
      count(*) FILTER (WHERE checked > 0) AS with_checked,
      avg(people) AS avg_people,
      avg(items) FILTER (WHERE items > 0) AS avg_items
    FROM per_list`;
  const r = rows[0] ?? {};
  return {
    lists: n(r.lists),
    with_items: n(r.with_items),
    with_crew: n(r.with_crew),
    with_checked: n(r.with_checked),
    avg_people: r.avg_people == null ? null : Number(r.avg_people),
    avg_items: r.avg_items == null ? null : Number(r.avg_items),
  };
}

async function getReturningCreators() {
  // Chi ha creato almeno due liste a più di 7 giorni di distanza
  const rows = await prisma.$queryRaw<Record<string, unknown>[]>`
    SELECT
      count(*) AS creators,
      count(*) FILTER (WHERE last - first > interval '7 days') AS returning
    FROM (
      SELECT "creatorToken", min("createdAt") AS first, max("createdAt") AS last
      FROM "ExpressList" GROUP BY "creatorToken"
    ) c`;
  return { creators: n(rows[0]?.creators), returning: n(rows[0]?.returning) };
}

async function getWeekly() {
  const rows = await prisma.$queryRaw<{ week: Date; lists: unknown }[]>`
    SELECT w.week, count(l.id) AS lists
    FROM generate_series(
      date_trunc('week', now()) - interval '11 weeks',
      date_trunc('week', now()),
      interval '1 week'
    ) AS w(week)
    LEFT JOIN "ExpressList" l ON date_trunc('week', l."createdAt") = w.week
    GROUP BY w.week ORDER BY w.week`;
  return rows.map((r) => ({ week: new Date(r.week), lists: n(r.lists) }));
}

async function getAccountStats() {
  const [users, withMenu, paid, groups] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { apiCallCount: { gt: 0 } } }),
    prisma.user.count({ where: { hasPaidForIncrease: true } }),
    prisma.group.count(),
  ]);
  return { users, withMenu, paid, groups };
}

export default async function MetrichePage({
  searchParams,
}: {
  searchParams: { periodo?: string };
}) {
  if (!(await isAdmin())) notFound();

  const period =
    PERIODS.find((p) => p.key === searchParams.periodo) ?? PERIODS[1];
  const [stats, returning, weekly, accounts] = await Promise.all([
    getListStats(period.days),
    getReturningCreators(),
    getWeekly(),
    getAccountStats(),
  ]);

  const funnel = [
    { label: "Liste create", value: stats.lists, hint: "Lo provano" },
    { label: "Con almeno un prodotto", value: stats.with_items, hint: "Lo usano" },
    { label: "Con 2 o più persone", value: stats.with_crew, hint: "Coinvolgono la crew" },
    { label: "Con prodotti spuntati", value: stats.with_checked, hint: "Usate al supermercato" },
  ];
  const maxWeek = Math.max(1, ...weekly.map((w) => w.lists));
  const fmtWeek = (d: Date) =>
    d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });

  return (
    <PageContainer className="pt-4 sm:pt-10">
      <div className="mx-auto max-w-5xl space-y-8 pb-12">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
              Solo per te
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-primary">
              Metriche
            </h1>
          </div>
          <nav
            aria-label="Periodo"
            className="flex rounded-xl border border-gray-200 bg-white p-1 text-sm"
          >
            {PERIODS.map((p) => (
              <Link
                key={p.key}
                href={`?periodo=${p.key}`}
                aria-current={p.key === period.key ? "page" : undefined}
                className={
                  p.key === period.key
                    ? "rounded-lg bg-primary px-3 py-1.5 font-semibold text-white"
                    : "rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                }
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* Numeri principali */}
        <section aria-label="Cambusa Express" className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Cambusa Express · liste create{" "}
            {period.days ? `negli ultimi ${period.days} giorni` : "da sempre"}
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Tile label="Liste create" value={stats.lists} />
            <Tile
              label="Con la crew (2+ persone)"
              value={`${pct(stats.with_crew, stats.lists)}%`}
              note="obiettivo: almeno 50%"
              good={stats.lists > 0 && pct(stats.with_crew, stats.lists) >= 50}
            />
            <Tile
              label="Usate al supermercato"
              value={`${pct(stats.with_checked, stats.lists)}%`}
              note="liste con prodotti spuntati"
            />
            <Tile
              label="Persone medie per lista"
              value={stats.avg_people ? stats.avg_people.toFixed(1) : "–"}
              note={
                stats.avg_items
                  ? `${Math.round(stats.avg_items)} prodotti in media`
                  : undefined
              }
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Imbuto */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="font-sans text-lg font-semibold text-gray-900">
              Dalla curiosità all&apos;uso
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Quante liste arrivano a ogni passo.
            </p>
            <ol className="mt-5 space-y-4">
              {funnel.map((f) => {
                const share = pct(f.value, stats.lists);
                return (
                  <li key={f.label} title={`${f.label}: ${f.value} (${share}%)`}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-gray-800">
                        {f.label}{" "}
                        <span className="text-gray-500">· {f.hint}</span>
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                        {f.value}
                        <span className="ml-1.5 font-normal text-gray-500">
                          {share}%
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.max(share, f.value ? 2 : 0)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Liste per settimana */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="font-sans text-lg font-semibold text-gray-900">Liste create per settimana</h2>
            <p className="mt-1 text-sm text-gray-500">Ultime 12 settimane.</p>
            <div className="mt-5 flex h-40 items-end gap-0.5 border-b border-gray-200">
              {weekly.map((w) => (
                <div
                  key={w.week.toISOString()}
                  className="group relative flex h-full flex-1 items-end justify-center"
                >
                  <div
                    className="w-full max-w-[28px] rounded-t bg-primary group-hover:bg-primary/80"
                    style={{
                      height: `${(w.lists / maxWeek) * 100}%`,
                      minHeight: w.lists ? 3 : 0,
                    }}
                  />
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full mb-1 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white group-hover:block"
                  >
                    Settimana del {fmtWeek(w.week)}: {w.lists}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-gray-500">
              <span>{fmtWeek(weekly[0].week)}</span>
              <span>max {maxWeek}</span>
              <span>questa settimana</span>
            </div>
          </section>
        </div>

        {/* Ritorno e account */}
        <section aria-label="Ritorno e account" className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Da sempre
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Tile
              label="Organizzatori che tornano"
              value={returning.returning}
              note={`su ${returning.creators} (nuova lista dopo 7+ giorni)`}
            />
            <Tile
              label="Account"
              value={accounts.users}
              note={`${accounts.withMenu} hanno generato un menu`}
            />
            <Tile label="Gruppi creati" value={accounts.groups} />
            <Tile
              label="Hanno pagato"
              value={accounts.paid}
              note={`${pct(accounts.paid, accounts.users)}% degli account`}
            />
          </div>
          <p className="text-xs text-gray-500">
            Le liste ferme da 3 mesi vengono cancellate, quindi i numeri
            &quot;da sempre&quot; contano solo le liste ancora attive.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}

function Tile({
  label,
  value,
  note,
  good,
}: {
  label: string;
  value: number | string;
  note?: string;
  good?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold tabular-nums text-gray-900">
        {value}
      </p>
      {note && (
        <p className="mt-0.5 text-xs text-gray-500">
          {good ? "✓ " : ""}
          {note}
        </p>
      )}
    </div>
  );
}
