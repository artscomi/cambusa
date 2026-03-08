"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useHeaderScroll } from "./HeaderBar";

export const Logo = () => {
  const pathname = usePathname();
  const { isTransparent } = useHeaderScroll();

  if (pathname === "/") {
    return <div className="flex-1" aria-hidden />;
  }

  const isWhite = isTransparent;
  const linkClass = isWhite
    ? "text-white hover:text-white/80 transition-colors"
    : "text-primary hover:text-primary-light transition-colors";
  const accentClass = isWhite ? "text-white/90" : "text-primary-light";

  return (
    <Link
      href="/"
      className={linkClass}
      aria-label="Torna alla home di Cambusaai"
    >
      <p className="text-2xl sm:text-3xl font-display font-bold relative py-2">
        Cambusa<span className={accentClass}>ai</span>
      </p>
    </Link>
  );
};
