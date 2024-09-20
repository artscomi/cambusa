import { NextPage } from "next";
import React from "react";
import { PageContent } from "./pageContent";

const GroupPage: NextPage<{
  params: { groupId: string; groupName: string };
}> = ({ params }) => {
  const { groupId, groupName } = params;
  const displayedGroupName = groupName.replace(/-/g, " ");
  return <PageContent groupId={groupId} groupName={displayedGroupName} />;
};

export default GroupPage;
