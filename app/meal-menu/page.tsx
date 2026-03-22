import { PageContainer } from "@/components/PageContainer";
import { CTA } from "@/components/CTA";
import { ChefHat, ListChecks, ShoppingCart, Star } from "lucide-react";

const MealMenuPage = () => {
  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
        <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">
          Il menu non si apre più qui
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-[1.05rem]">
          Le proposte, i voti del gruppo e la lista della spesa sono tutti in un
          unico posto: la pagina{" "}
          <span className="font-semibold text-gray-900">Il mio menu</span>.
        </p>

        <ul className="mt-8 space-y-4 text-sm leading-relaxed text-gray-700 sm:text-base">
          <li className="flex gap-3">
            <ChefHat
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <span>
              <strong className="text-gray-900">Vedi i pasti</strong> del menu
              personale o, se fai parte di un gruppo, scegli quale menu del
              gruppo aprire dal menu a tendina in alto.
            </span>
          </li>
          <li className="flex gap-3">
            <Star
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <span>
              <strong className="text-gray-900">Vota da 1 a 5 stelle</strong>{" "}
              ogni proposta del menu condiviso: così l&apos;organizzatore capisce
              cosa piace di più a tutta la ciurma.
            </span>
          </li>
          <li className="flex gap-3">
            <ShoppingCart
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <span>
              <strong className="text-gray-900">Genera la lista della spesa</strong>{" "}
              quando tutti i membri del gruppo avranno votato ogni pasto (su Il
              mio menu o dalla pagina menu del gruppo).
            </span>
          </li>
          <li className="flex gap-3">
            <ListChecks
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <span>
              <strong className="text-gray-900">Spunta e modifica la lista</strong>{" "}
              nella pagina Lista della spesa; se la lista è legata a un gruppo,
              solo il proprietario del gruppo può modificarla in app.
            </span>
          </li>
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CTA href="/my-menu" variant="accent" className="sm:w-auto">
            Vai a Il mio menu
          </CTA>
        </div>
      </div>
    </PageContainer>
  );
};

export default MealMenuPage;
