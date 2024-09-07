import { NextPage } from "next";
import React from "react";
import { PageContent } from "@/app/group/[groupId]/[groupName]/pageContent";

const GroupPage: NextPage<{
  params: { groupId: string; groupName: string };
}> = ({ params }) => {
  const { groupId, groupName } = params;
  const displayedGroupName = groupName.replace(/-/g, " ");
  return (
    <div className="h-lvh flex justify-center items-center">
      <PageContent groupId={groupId} groupName={displayedGroupName} />
    </div>
  );
};

export default GroupPage;
