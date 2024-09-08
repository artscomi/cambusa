import { motion } from "framer-motion";
import LottieAnimation from "../LottieAnimation";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center  max-w-[700px] m-auto">
      <p className="text-3xl mb-6">Stiamo generando la tua proposta di menu</p>
      <LottieAnimation />
      <motion.p
        animate={{ opacity: 1, transition: { delay: 2, duration: 2 } }}
        initial={{ opacity: 0 }}
        className="text-xl mt-8 mb-8"
      >
        🗑️ Dacci un occhio, se qualche pasto non ti convince potrai rimuoverlo
        dalla lista
      </motion.p>
      <motion.p
        animate={{ opacity: 1, transition: { delay: 5, duration: 2 } }}
        initial={{ opacity: 0 }}
        className="text-xl mb-10"
      >
        🛒 Quando tutto è pronto, premi sul pulsante `&quot;Genera lista&quot;
        per creare una lista della spesa pronta per andare a <i>fare Cambusa</i>
        !
      </motion.p>

      <motion.p
        animate={{ opacity: 1, transition: { delay: 10, duration: 2 } }}
        initial={{ opacity: 0 }}
        className="text-xl"
      >
        🧘‍♀️ Ancora un attimo di pazienza, l&apos;AI è un po&apos; lenta a rimuginare...
      </motion.p>
    </div>
  );
};
