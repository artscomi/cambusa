"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";

const SCROLL_THRESHOLD = 20;
const MAIN_SCROLL_ID = "app-main-scroll";

function scrollTopCombined() {
  const main = document.getElementById(MAIN_SCROLL_ID);
  return Math.max(
    main?.scrollTop ?? 0,
    window.scrollY,
    document.documentElement.scrollTop
  );
}

type HeaderScrollContextType = { isTransparent: boolean };
const HeaderScrollContext = createContext<HeaderScrollContextType>({ isTransparent: true });

export function useHeaderScroll() {
  return useContext(HeaderScrollContext);
}

export function HeaderBar({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useLayoutEffect(() => {
    const sync = () => setScrolled(scrollTopCombined() > SCROLL_THRESHOLD);
    sync();

    const main = document.getElementById(MAIN_SCROLL_ID);
    main?.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("scroll", sync, { passive: true });

    return () => {
      main?.removeEventListener("scroll", sync);
      window.removeEventListener("scroll", sync);
    };
  }, []);

  const isTransparent = !scrolled;

  return (
    <HeaderScrollContext.Provider value={{ isTransparent }}>
      <header
        className={`fixed z-40 w-full transition-[background-color,border-color] duration-300 ${
          scrolled
            ? "border-b border-primary/20"
            : "border-b border-transparent bg-transparent"
        }`}
        style={{ backgroundColor: scrolled ? "#ffffff" : "transparent" }}
      >
        {children}
      </header>
    </HeaderScrollContext.Provider>
  );
}
