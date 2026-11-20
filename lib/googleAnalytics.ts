import { createSign } from "crypto";

/**
 * Lettura dei dati di Google Analytics 4 (Data API) per la pagina /admin/metriche.
 *
 * Variabili d'ambiente richieste:
 * - GA_PROPERTY_ID: ID numerico della proprietà GA4 (Amministrazione → Dettagli proprietà),
 *   non l'ID di misurazione "G-...".
 * - GA_SERVICE_ACCOUNT_JSON: contenuto completo del file JSON della chiave del service account,
 *   che deve essere aggiunto alla proprietà GA4 con ruolo "Visualizzatore".
 *
 * Senza queste variabili la pagina mostra solo un avviso.
 */

/** Eventi personalizzati inviati dal sito (lib/gtag.ts → trackEvent) con le etichette per la pagina. */
export const GA_EVENTS: Record<string, string> = {
  sign_up: "Registrazioni",
  express_list_created: "Liste Express create",
  express_invite: "Inviti alla crew",
  express_item_added: "Prodotti aggiunti",
  express_item_checked: "Prodotti spuntati",
  express_vote: "Voti",
  express_menu_click: "Clic sul menu",
  group_created: "Gruppi creati",
};

export type GaStats = {
  totals: {
    users: number;
    newUsers: number;
    sessions: number;
    engagementRate: number;
    keyEvents: number;
  };
  events: { name: string; count: number }[];
  sources: { source: string; sessions: number }[];
  pages: { path: string; views: number }[];
};

export type GaResult =
  | { status: "ok"; data: GaStats }
  | { status: "not_configured" }
  | { status: "error"; message: string };

type Credentials = { client_email: string; private_key: string };

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken({ client_email, private_key }: Credentials) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256")
    .update(unsigned)
    .sign(private_key)
    .toString("base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Accesso a Google non riuscito (${res.status})`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return json.access_token;
}

type ReportRow = {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
};

async function runReport(
  propertyId: string,
  token: string,
  body: Record<string, unknown>,
): Promise<ReportRow[]> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(err?.error?.message ?? `Errore Google Analytics (${res.status})`);
  }
  const json = (await res.json()) as { rows?: ReportRow[] };
  return json.rows ?? [];
}

const num = (v?: { value: string }) => Number(v?.value ?? 0);

/** days = null → da sempre (GA4 accetta date dal 14/08/2015). */
export async function getGaStats(days: number | null): Promise<GaResult> {
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  const rawCreds = process.env.GA_SERVICE_ACCOUNT_JSON;
  if (!propertyId || !rawCreds) return { status: "not_configured" };

  try {
    const creds = JSON.parse(rawCreds) as Credentials;
    const token = await getAccessToken(creds);
    const dateRanges = [
      { startDate: days ? `${days}daysAgo` : "2015-08-14", endDate: "today" },
    ];

    const [totals, events, sources, pages] = await Promise.all([
      runReport(propertyId, token, {
        dateRanges,
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "engagementRate" },
          { name: "keyEvents" },
        ],
      }),
      runReport(propertyId, token, {
        dateRanges,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: { values: Object.keys(GA_EVENTS) },
          },
        },
      }),
      runReport(propertyId, token, {
        dateRanges,
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 6,
      }),
      runReport(propertyId, token, {
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 6,
      }),
    ]);

    const t = totals[0]?.metricValues ?? [];
    return {
      status: "ok",
      data: {
        totals: {
          users: num(t[0]),
          newUsers: num(t[1]),
          sessions: num(t[2]),
          engagementRate: num(t[3]),
          keyEvents: num(t[4]),
        },
        events: events
          .map((r) => ({
            name: r.dimensionValues?.[0]?.value ?? "",
            count: num(r.metricValues?.[0]),
          }))
          .sort((a, b) => b.count - a.count),
        sources: sources.map((r) => ({
          source: r.dimensionValues?.[0]?.value ?? "",
          sessions: num(r.metricValues?.[0]),
        })),
        pages: pages.map((r) => ({
          path: r.dimensionValues?.[0]?.value ?? "",
          views: num(r.metricValues?.[0]),
        })),
      },
    };
  } catch (e) {
    console.error("[metriche] Google Analytics:", e);
    return {
      status: "error",
      message: e instanceof Error ? e.message : "Errore sconosciuto",
    };
  }
}
