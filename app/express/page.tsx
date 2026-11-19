import { Metadata } from "next";
import { Check, Share2, ThumbsUp, Zap } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { CreateExpressForm } from "./CreateExpressForm";

export const metadata: Metadata = {
  title: "Cambusa Express: lista della spesa condivisa per la barca | Cambusa Online",
  description:
    "Crea in 30 secondi una lista della cambusa condivisa con il tuo equipaggio. Ognuno aggiunge e vota i prodotti, senza registrazione.",
};

const steps = [
  { icon: Zap, title: "Crea la lista", text: "Un nome e sei pronto, senza registrazione." },
  { icon: Share2, title: "Condividi il link", text: "Mandalo nel gruppo WhatsApp della crew." },
  { icon: ThumbsUp, title: "Aggiungete e votate", text: "Ognuno propone prodotti e vota quelli degli altri." },
  { icon: Check, title: "Spunta al supermercato", text: "La lista è già divisa per reparto." },
];

export default function ExpressPage() {
  return (
    <PageContainer narrow className="pt-2 sm:pt-10 md:pt-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.07] px-3.5 py-1.5 font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          <Zap className="h-3.5 w-3.5" aria-hidden />
          Cambusa Express
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">
          La lista della cambusa, decisa da tutta la crew
        </h1>
      </div>

      <div className="mx-auto mt-6 max-w-xl sm:mt-8">
        <CreateExpressForm />
      </div>

      <ol className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li
            key={title}
            className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-gray-900">
                {i + 1}. {title}
              </p>
              <p className="mt-1 text-sm text-gray-600">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </PageContainer>
  );
}
