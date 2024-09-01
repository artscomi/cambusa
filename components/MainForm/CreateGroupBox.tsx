import { CtaCreateGroup } from "../CTA/CtaCreateGroup";

export const CreateGroupBox = () => (
  <div className="p-8 rounded-lg flex-1 flex flex-col">
    <div>
      <span role="img" className="text-center block mb-3 text-2xl">
        👫👬👭
      </span>
      <p className="mb-5 text-center">
        Crea il tuo gruppo per raccogliere le preferenze alimentari di tutta la
        ciurma!
      </p>
    </div>
    <CtaCreateGroup />
  </div>
);
