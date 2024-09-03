import { NextPage } from "next";
import React from "react";
import { PageContent } from "@/app/group/[groupId]/[groupName]/pageContent";

const GroupPage: NextPage<{
  params: { groupId: string; groupName: string };
}> = ({ params }) => {
  const { groupId, groupName } = params;
  const displayedGroupName = groupName.replace(/-/g, " ");
  return (
    <div>
      <h1>Group {displayedGroupName}</h1>
      <PageContent groupId={groupId} />
    </div>
  );
};

export default GroupPage;
