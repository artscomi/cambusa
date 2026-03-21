import Link from "next/link";
import { getUserGroups } from "../api/actions";
import { ArrowRight, CookingPot, Sandwich, Users } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { PageContainer } from "@/components/PageContainer";
import { CTA } from "@/components/CTA";

const Gruppi = async () => {
  const { userId } = await auth();
  const userGroups = await getUserGroups(userId || "");
  const groups = userGroups.group?.filter((g) => g.group.name) ?? [];

  return (
    <PageContainer narrow>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-8 sm:mb-12">
        I miei gruppi
      </h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
        {groups.map((group) => {
          const { group: groupItem } = group;
          return (
            <Link
              key={groupItem.id}
              href={`/group/${group.groupId}/menu`}
              className="rounded-lg bg-white border border-gray-200 hover:scale-[1.02] transition-scale duration-200 p-5 flex flex-col justify-between"
            >
              <div>
                <p className="font-bold text-lg mb-2">{groupItem.name}</p>
                <ul className="space-y-1">
                  <li className="flex items-center text-gray-600">
                    <Users className="mr-2 text-gray-500" /> Persone: {groupItem.people}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Sandwich className="mr-2 text-gray-500" /> Pranzi: {groupItem.lunch}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CookingPot className="mr-2 text-gray-500" /> Cene: {groupItem.dinner}
                  </li>
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-8 sm:mt-10">
        <CTA href="/group/create-group" variant="textIconEnd">
          Crea nuovo gruppo
          <ArrowRight aria-hidden />
        </CTA>
      </div>
    </PageContainer>
  );
};

export default Gruppi;
