"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export const Logo = () => {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }
  return (
    <Link href="/">
      <p className="text-primary text-2xl font-display font-bold relative py-2">
        Cambusa<span className="text-secondary">Ai</span>
      </p>
    </Link>
  );
};
