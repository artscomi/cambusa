import { ReactNode } from "react";
import { PageContainer } from "@/components/PageContainer";

/** Impaginazione comune delle pagine legali (privacy, termini, cookie). */
export function LegalDoc({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageContainer narrow className="pt-6 sm:pt-12">
      <header className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">{title}</h1>
        <p className="mt-3 text-gray-500">Ultimo aggiornamento: {updated}</p>
        {intro && <div className="mx-auto mt-6 max-w-2xl text-left text-gray-700">{intro}</div>}
      </header>
      <div className="space-y-10 text-gray-700 [&_a]:text-primary [&_a]:underline [&_li]:leading-relaxed [&_p]:leading-relaxed">
        {children}
      </div>
    </PageContainer>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-3 text-xl font-semibold text-gray-900 sm:text-2xl">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function List({ children }: { children: ReactNode }) {
  return <ul className="ml-5 list-disc space-y-1.5">{children}</ul>;
}

/** Dato ancora da compilare: evidenziato finché non viene sostituito. */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-yellow-200 px-1 font-semibold text-yellow-900">[{children}]</mark>
  );
}

/** Tabella semplice e leggibile anche su telefono (si scorre in orizzontale). */
export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-gray-50 text-gray-900">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2 align-top">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Titolare del trattamento e gestore del servizio. Usato in privacy, termini e cookie. */
export const TITOLARE = {
  nome: "Cristina Luerti",
  email: "artscomi.web@gmail.com",
};
