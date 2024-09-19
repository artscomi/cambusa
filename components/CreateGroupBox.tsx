"use client";

import Link from "next/link";

export const CreateGroupBox = () => {
  return (
    <form className="p-8 mb-5">
      <span role="img" className="text-center block mb-2 text-2xl">
        👫👬👭
      </span>
      <p className="mb-8 text-center text-balance">
        Crea il tuo gruppo per raccogliere
        <br />
        <span className="text-white highlight">
          le preferenze alimentari
        </span>
        <br />
        di tutta la ciurma!
      </p>

      <Link href="/group/create-group">
        <button className="h-15 p-2 underline underline-offset-8 block m-auto font-cta text-primary text-lg">
          Crea un gruppo
        </button>
      </Link>
    </form>
  );
};
