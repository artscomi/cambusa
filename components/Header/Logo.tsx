"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export const Logo = () => {
  const pathname = usePathname();

  if (pathname === "/") {
    return <div className="flex-1" aria-hidden />;
  }

  return (
    <Link
      href="/"
      className="text-primary hover:text-primary-light transition-colors"
      aria-label="Torna alla home di Cambusaai"
    >
      <p className="text-2xl sm:text-3xl font-display font-bold relative py-2">
        Cambusa<span className="text-primary-light">ai</span>
      </p>
    </Link>
  );
};
