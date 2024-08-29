import { MealPlanner } from "@/components/MealPlanner";

export default function Home() {
  return (
    <main className="p-6 lg:p-24 h-full overflow-auto">
      <div className="w-full items-end">
        <MealPlanner />
      </div>
    </main>
  );
}
