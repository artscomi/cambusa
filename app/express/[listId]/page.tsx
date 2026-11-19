import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { getExpressList } from "../actions";
import { ExpressListView } from "./ExpressListView";

export const dynamic = "force-dynamic";

type Props = {
  params: { listId: string };
  searchParams: { nuova?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const list = await getExpressList(params.listId);
  const title = list
    ? `${list.name}: la lista della cambusa | Cambusa Express`
    : "Cambusa Express";
  const description =
    "Aggiungi quello che vuoi a bordo e vota le proposte della crew. Nessuna registrazione.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    // L'immagine va ripetuta qui: definendo openGraph la pagina sostituisce quella di /express
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/express/opengraph-image.jpg", width: 1200, height: 630, alt: "Cambusa Express" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/express/opengraph-image.jpg"] },
  };
}

export default async function ExpressListPage({ params, searchParams }: Props) {
  const list = await getExpressList(params.listId);
  if (!list) notFound();

  return (
    <PageContainer narrow className="pt-2 sm:pt-10 md:pt-12 lg:max-w-6xl">
      <ExpressListView initialList={list} justCreated={searchParams.nuova === "1"} />
    </PageContainer>
  );
}
