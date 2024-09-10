"use client";

import Link from "next/link";

export const CreateGroupBox = () => {
  return (
    <form className="p-8 md:rounded-lg flex-1 flex flex-col onSubmit={handleSubmit} justify-center">
      <div className="mb-5">
        <span role="img" className="text-center block mb-2 text-2xl">
          👫👬👭
        </span>
        <p className="mb-8 text-center text-pretty">
          Crea il tuo gruppo per raccogliere le preferenze alimentari di tutta
          la ciurma!
        </p>

        <Link href="/group/create-group">
          <button className="h-15 p-2 underline underline-offset-8 block m-auto">
            Crea un gruppo
          </button>
        </Link>
      </div>
    </form>
  );
};
