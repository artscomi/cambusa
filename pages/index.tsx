import { MainPage } from "@/components/MainPage";

export default function Home() {
  return (
    <main className="m-4 md:mt-32 md:mx-20 lg:mx-30 xl:mx-60 2xl:mx-96 h-full overflow-auto">
      <div className="w-full items-end">
        <MainPage />
      </div>
    </main>
  );
}
