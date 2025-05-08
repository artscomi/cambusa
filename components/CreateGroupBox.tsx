"use client";

import Link from "next/link";

export const CreateGroupBox = () => {
  return (
    <form className="p-8 mb-5">
      <p className="text-center text-primary mb-3 font-semibold max-sm:pt-10 text-lg">
        Oppure
      </p>
      <span role="img" className="text-center block mb-2 text-2xl">
        👫👬👭
      </span>
      <h2 className="mb-8 text-center text-balance text-xl text-gray-500">
        Crea il tuo gruppo per raccogliere
        <br />
        <span className="text-white highlight">le preferenze alimentari</span>
        <br />
        di tutta la ciurma!
      </h2>

      <Link href="/group/create-group">
        <button className="h-15 p-2 underline leading-32 block m-auto font-cta text-primary text-lg">
          Crea un gruppo
        </button>
      </Link>
    </form>
  );
};
