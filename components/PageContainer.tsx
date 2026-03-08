import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  /** Se true, usa max-w-4xl (per pagine legal/testo). Default: false (max-w-7xl) */
  narrow?: boolean;
  /** Classi aggiuntive per il wrapper */
  className?: string;
};

/**
 * Contenitore standard per le pagine interne, allineato al layout della home.
 * max-w-7xl mx-auto px-6 md:px-10 py-12 sm:py-16 md:py-20
 */
export function PageContainer({
  children,
  narrow = false,
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto px-6 md:px-10 py-12 sm:py-16 md:py-20 ${
        narrow ? "max-w-4xl" : "max-w-7xl"
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
