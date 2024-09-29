import { NextPage } from "next";
import React from "react";
import { PageContent } from "./pageContent";

const GroupPage: NextPage<{
  params: { groupId: string };
}> = ({ params }) => {
  const { groupId } = params;
  return <PageContent groupId={groupId} />;
};

export default GroupPage;
