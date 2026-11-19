/**
 * Skeleton della lista Express: si vede mentre la lista viene creata o caricata.
 * Se il nome della lista è già noto (appena scritto nel form) lo mostra subito.
 */
const bar = "animate-pulse rounded-full bg-gray-200";
const block = "animate-pulse rounded-xl bg-gray-200";

export function ExpressListSkeleton({
  name,
  empty = false,
}: {
  name?: string;
  /** Lista appena creata: niente righe di prodotti, solo il riquadro vuoto. */
  empty?: boolean;
}) {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Caricamento della lista"
    >
      {/* Intestazione */}
      <div className="flex flex-col items-center text-center">
        <p className="font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
          Cambusa Express
        </p>
        {name ? (
          <h1 className="mt-2 break-words font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">
            {name}
          </h1>
        ) : (
          <span className={`mt-3 h-8 w-56 ${bar}`} />
        )}
        <span className={`mt-4 h-4 w-60 ${bar}`} />
      </div>

      {/* Campo per aggiungere prodotti */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <span className={`block h-4 w-44 ${bar}`} />
        <div className="mt-3 flex gap-2">
          <span className={`h-12 flex-1 ${block}`} />
          <span className={`h-12 w-14 ${block}`} />
        </div>
        <span className={`mt-3 block h-3 w-64 max-w-full ${bar}`} />
        <div className="mt-5 flex flex-wrap gap-2">
          {[18, 16, 18, 22, 17, 16].map((w, i) => (
            <span
              key={i}
              className={`h-8 ${bar}`}
              style={{ width: `${w * 4}px` }}
            />
          ))}
        </div>
      </div>

      {/* Righe della lista */}
      {empty ? (
        <div className="h-[5.5rem] rounded-2xl border border-dashed border-gray-300 bg-white/60" />
      ) : (
        <div>
          <span className={`mb-2 ml-1 block h-3 w-28 ${bar}`} />
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {[60, 45, 70].map((w, i) => (
              <li key={i} className="flex items-center gap-3 px-3 py-3 sm:px-4">
                <span className="h-6 w-6 shrink-0 animate-pulse rounded-md bg-gray-200" />
                <div className="min-w-0 flex-1">
                  <span
                    className={`block h-4 ${bar}`}
                    style={{ width: `${w}%` }}
                  />
                  <span className={`mt-2 block h-2.5 w-24 ${bar}`} />
                </div>
                <span className="h-8 w-[2.6rem] animate-pulse rounded-lg bg-gray-200" />
                <span className="h-8 w-[2.6rem] animate-pulse rounded-lg bg-gray-200" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
