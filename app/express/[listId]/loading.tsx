import { PageContainer } from "@/components/PageContainer";
import { ExpressListSkeleton } from "../ExpressListSkeleton";

/** Mostrato mentre la lista si carica (per esempio aprendo il link d'invito). */
export default function Loading() {
  return (
    <PageContainer narrow className="pt-2 sm:pt-10 md:pt-12 lg:max-w-6xl">
      <ExpressListSkeleton />
    </PageContainer>
  );
}
