"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/animations/framer-variants";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Come funziona l'AI di Cambusaai?",
    answer:
      "La nostra AI analizza le tue preferenze alimentari, la durata del viaggio e le esigenze dell'equipaggio per creare menu bilanciati e gustosi. Considera anche la conservabilità degli alimenti in barca e la facilità di preparazione.",
  },
  {
    question: "Posso personalizzare i menu generati?",
    answer:
      "Assolutamente! Dopo la generazione, puoi modificare qualsiasi piatto, aggiungere o rimuovere ingredienti, e salvare le tue modifiche. L'AI si adatterà alle tue preferenze per i menu futuri.",
  },
  {
    question: "La lista della spesa è accurata?",
    answer:
      "Sì, la lista della spesa viene calcolata automaticamente in base ai menu generati, considerando le porzioni per il numero di persone e la durata del viaggio. Include anche suggerimenti per la conservazione.",
  },
  {
    question: "Posso gestire allergie e intolleranze?",
    answer:
      "Certamente! Puoi specificare allergie, intolleranze e preferenze alimentari per ogni membro dell'equipaggio. L'AI eviterà automaticamente gli ingredienti problematici.",
  },
  {
    question: "I menu sono adatti per la conservazione in barca?",
    answer:
      "Sì, tutti i menu sono progettati considerando le limitazioni di spazio e conservazione in barca. Privilegiamo ingredienti che si conservano bene e ricette che non richiedono attrezzature complesse.",
  },
  {
    question: "Quanto costa utilizzare Cambusaai?",
    answer:
      "Offriamo un piano gratuito con limiti di utilizzo e piani premium per uso intensivo. Controlla la sezione prezzi per tutti i dettagli sui nostri piani.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className="border border-gray-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
        )}
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4 bg-gray-50">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section
      variants={itemVariants}
      className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          variants={itemVariants}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Domande Frequenti
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Tutto quello che devi sapere su Cambusaai
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* <motion.div variants={itemVariants} className="text-center mt-12">
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            Non hai trovato la risposta che cercavi?
          </p>
          <a
            href="mailto:artscomi.web@gmail.com"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-semibold transition-colors duration-200"
          >
            Contattaci
          </a>
        </motion.div> */}
      </div>
    </motion.section>
  );
};
