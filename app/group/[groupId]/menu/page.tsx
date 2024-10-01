import { PageContent } from "./PageContent";

interface PageContentProps {
  groupId: string;
}

const GroupMenu = ({ params }: { params: { groupId: string } }) => {
  const { groupId } = params;
  return (
    <>
      <PageContent groupId={groupId} />
    </>
  );
};

export default GroupMenu;
