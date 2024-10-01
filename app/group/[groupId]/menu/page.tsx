import { PageContent } from "./PageContent";

const GroupMenu = ({ params }: { params: { groupId: string } }) => {
  const { groupId } = params;
  return (
    <>
      <PageContent groupId={groupId} />
    </>
  );
};

export default GroupMenu;
