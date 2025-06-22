"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Users, ChefHat, Sparkles } from "lucide-react";
import {
  carouselVariants,
  swipeConfidenceThreshold,
  swipePower,
} from "@/animations/framer-variants";

const features = [
  {
    icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    title: "Equipaggio",
    description: "Gestisci le preferenze di tutta la ciurma",
  },
  {
    icon: <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    title: "Menu Intelligente",
    description: "AI che crea pasti equilibrati e gustosi",
  },
  {
    icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    title: "Lista Spesa",
    description: "Genera automaticamente la lista della spesa",
  },
];

export const FeaturesCarousel: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setPage(([currentPage]) => {
        const nextPage = (currentPage + 1) % features.length;
        return [nextPage, 1];
      });
    }, 4000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const paginate = (newDirection: number) => {
    setPage(([currentPage]) => {
      const nextPage =
        (currentPage + newDirection + features.length) % features.length;
      return [nextPage, newDirection];
    });
  };

  const handleDragEnd = (event: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div className="relative">
      {/* Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 sm:p-6"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4">
              {feature.icon}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div
        className="sm:hidden relative h-56 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 40, duration: 0.8 },
              opacity: { duration: 0.6 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full flex items-center justify-center"
          >
            <div className="text-center p-4 w-full pb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                {features[page].icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {features[page].title}
              </h3>
              <p className="text-base text-gray-700">
                {features[page].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setPage([index, index > page ? 1 : -1]);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === page ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
