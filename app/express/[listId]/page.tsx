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
    openGraph: { title, description, type: "website" },
  };
}

export default async function ExpressListPage({ params, searchParams }: Props) {
  const list = await getExpressList(params.listId);
  if (!list) notFound();

  return (
    <PageContainer narrow>
      <ExpressListView initialList={list} justCreated={searchParams.nuova === "1"} />
    </PageContainer>
  );
}
