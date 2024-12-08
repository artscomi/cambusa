import { NextPage } from "next";
import React from "react";
import { PageContent } from "./pageContent";
import { currentUser } from "@clerk/nextjs/server";
import { getGroupInfo } from "@/app/api/actions";

const GroupPage: NextPage<{
  params: { groupId: string };
}> = async ({ params }) => {
  const { groupId } = params;
  const user = await currentUser();
  const group = await getGroupInfo(groupId);
  const isTheGroupOwner = group?.isTheGroupOwner;
  if (!user || !group) return null;

  return (
    <div className="mx-4 max-w-2xl lg:mx-auto">
      <h1 className="text-3xl mb-4 font-display">
        <p>{isTheGroupOwner ? "Top!" : `Ciao ${user.fullName}!`}</p>
        <p>
          {isTheGroupOwner
            ? "Hai creato il gruppo"
            : "Hai ricevuto un invito al gruppo"}{" "}
          <span className="text-accent capitalize">{group?.groupName}</span>
        </p>
      </h1>
      <p className="text-md text-gray-700 mb-4">
        Aggiungi le tue preferenze alimentari per creare una cambusa per il
        viaggio.
      </p>
      <PageContent groupId={groupId} group={group} />
    </div>
  );
};

export default GroupPage;
