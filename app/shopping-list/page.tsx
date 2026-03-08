"use client";
import Checklist from "@/components/CheckList";
import { useShoppingContext } from "@/context/useShoppingListContext";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";

const ShoppingListPage = () => {
  const { shoppingList } = useShoppingContext();

  if (shoppingList.length === 0) {
    return (
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <ChefHat className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            Lista della spesa vuota
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md">
            Per generare la tua lista della spesa, devi prima creare un menu.
            Cambusaai ti aiuterà a creare pasti equilibrati e gustosi.
          </p>
          <Link
            href="/menu/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-light transition-colors"
          >
            <ChefHat className="w-5 h-5" />
            Crea il tuo menu
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Checklist items={shoppingList} />
    </PageContainer>
  );
};

export default ShoppingListPage;
