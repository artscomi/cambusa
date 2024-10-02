import Link from "next/link";
import { getUserGroups } from "../api/actions";

const Gruppi = async () => {
  const userGroups = await getUserGroups();
  if (!userGroups) return null;

  const handleGroupClick = () => {};

  return (
    <>
      <h1>I tuoi gruppi</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
        {userGroups.group?.filter(group => group.group.name).map((group) => {
          const { group: groupItem } = group;
          return (
            <Link
              key={groupItem.id}
              href={`/group/${group.groupId}/menu`}
              className="rounded shadow-sm bg-white border inline-block p-4"
            >
              <p className="font-bold text-primary">{groupItem.name}</p>
              <ul>
                <li>Persone:{groupItem.people}</li>
                <li>Pranzi:{groupItem.lunch}</li>
                <li>Cene:{groupItem.dinner}</li>
              </ul>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Gruppi;
