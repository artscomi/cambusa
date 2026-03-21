"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SCROLL_THRESHOLD = 20;

type HeaderScrollContextType = { isTransparent: boolean };
const HeaderScrollContext = createContext<HeaderScrollContextType>({ isTransparent: true });

export function useHeaderScroll() {
  return useContext(HeaderScrollContext);
}

export function HeaderBar({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // init
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = !scrolled;

  return (
    <HeaderScrollContext.Provider value={{ isTransparent }}>
      <header
        className={`fixed w-full z-40 transition-[background-color,border-color] duration-300 ${
          scrolled
            ? "bg-secondary-light/90 backdrop-blur-sm border-b border-primary/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {children}
      </header>
    </HeaderScrollContext.Provider>
  );
}
