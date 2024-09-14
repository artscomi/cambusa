"use client";

import { motion } from "framer-motion";

export const Waves = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 140"
      className="w-[110%]"
    >
      <motion.path
        d="M1920 0l-107 28c-106 29-320 85-533 93-213 7-427-36-640-50s-427 0-533 7L0 85v171h1920z"
        animate={{ y: [0, 3, 0], x: [-10, 0, -10] }}
        transition={{ duration: 3, repeat: Infinity }}
        fill="0d2031"
      />
      <motion.path
        d="M0 129l64-26c64-27 192-81 320-75 128 5 256 69 384 64 128-6 256-80 384-91s256 43 384 70c128 26 256 26 320 26h64v96H0z"
        fill="#0094c6"
        animate={{ y: [3, 0, 3], x: [-10, 0, -10] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  );
};
