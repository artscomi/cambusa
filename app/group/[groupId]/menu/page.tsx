import { PageContent } from "./PageContent";

interface PageContentProps {
  groupId: string;
}

const GroupMenu = ({ params }: { params: { groupId: string } }) => {
  const { groupId } = params;
  return (
    <>
      {/* <MainForm groupData={groupData} /> */}
      <PageContent groupId={groupId} />
    </>
  );
};

export default GroupMenu;
