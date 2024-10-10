import { motion } from "framer-motion";
import dynamic from "next/dynamic";

export const EmptyMealList = () => {
  const LottieAnimation = dynamic(
    () => import("@/components/LottieAnimation"),
    {
      ssr: false,
    }
  );

  return (
    <motion.div
      animate={{ opacity: 1, y: 10 }}
      initial={{ opacity: 0, y: 0 }}
      key="empty-meal-list"
    >
      <p className="text-xl text-center m-20">
        Ehi, sembra che tu abbia rimosso tutti i pasti!
        <br /> Vi siete messi a dieta?
      </p>
      <LottieAnimation name="emptyMealList" />
    </motion.div>
  );
};
