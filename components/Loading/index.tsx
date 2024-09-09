import { motion } from "framer-motion";
import LottieAnimation from "../LottieAnimation";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-[700px] m-auto px-8">
      <p className="text-3xl mb-6">Stiamo generando la tua proposta di menu</p>
      <LottieAnimation />
      <motion.p
        animate={{ opacity: 1, transition: { delay: 2, duration: 2 } }}
        initial={{ opacity: 0 }}
        className="text-xl mt-8 mb-8"
      >
        🗑️ Dai un’occhiata: se un pasto non ti convince, puoi rimuoverlo
        dalla lista
      </motion.p>
      <motion.p
        animate={{ opacity: 1, transition: { delay: 5, duration: 2 } }}
        initial={{ opacity: 0 }}
        className="text-xl mb-10"
      >
        🛒 Quando è tutto pronto,  clicca su &quot;Genera lista&quot;
        per creare una lista della spesa da portare con te per andare a <i>fare Cambusa!</i>
      </motion.p>

      <motion.p
        animate={{ opacity: 1, transition: { delay: 10, duration: 2 } }}
        initial={{ opacity: 0 }}
        className="text-xl"
      >
        🧘‍♀️ Ancora un attimo di pazienza, l&apos;AI sta ancora meditando per creare il menu perfetto per te...
      </motion.p>
    </div>
  );
};
