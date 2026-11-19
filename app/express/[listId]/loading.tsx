import { PageContainer } from "@/components/PageContainer";
import { ExpressListSkeleton } from "../ExpressListSkeleton";

/** Mostrato mentre la lista si carica (per esempio aprendo il link d'invito). */
export default function Loading() {
  return (
    <PageContainer narrow>
      <ExpressListSkeleton />
    </PageContainer>
  );
}
