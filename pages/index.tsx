import { AddMenu } from "@/components/AddMenuForm";
import { MainForm } from "@/components/MainForm";
import { useMealContext } from "@/context/useMealContext";

export default function Home() {
  const {mealList}= useMealContext()

  return (
    <main className="m-4 md:py-32 md:mx-20 lg:mx-30 xl:mx-60 2xl:mx-96 h-full overflow-auto">
      <div className="w-full items-end">
        <MainForm  />
        {mealList && <AddMenu />}
      </div>
    </main>
  );
}
