import { cva, type VariantProps } from "class-variance-authority";

/** Link testuale primary (come “Torna alla home”): icona lucide come `<svg>` in children. */
const textIconShared =
  "group inline-flex items-center gap-2 text-primary font-medium text-base hover:text-primary-light transition-colors [&_svg]:shrink-0 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:transition-transform motion-reduce:[&_svg]:transition-none";

export const ctaVariants = cva(
  "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        solid:
          "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-light sm:px-8 sm:py-4",
        accent:
          "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-light sm:px-8 sm:py-4",
        outline:
          "inline-flex items-center justify-center gap-2 bg-transparent hover:bg-secondary text-primary border-2 border-primary font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full",
        inverse:
          "inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-primary hover:bg-gray-100",
        ghost:
          "inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-white/60 backdrop-blur-sm",
        outlineLight:
          "inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary rounded-full px-8 py-4 text-lg font-semibold",
        form: "inline-flex items-center justify-center gap-2 bg-white hover:bg-secondary-light text-primary border-b-4 border-b-primary rounded p-4 font-cta text-xl tracking-wide transition-colors",
        formOutline:
          "inline-flex items-center justify-center gap-2 bg-transparent hover:bg-secondary text-primary border-2 border-primary rounded p-4 font-cta text-xl tracking-wide transition-colors",
        /** Icona a sinistra, poi testo (es. `<ArrowLeft aria-hidden />` + “Torna alla home”). */
        textIconStart: `${textIconShared} [&_svg]:group-hover:-translate-x-0.5`,
        /** Testo poi icona a destra (es. “Crea nuovo gruppo” + `<ChevronRight aria-hidden />`). */
        textIconEnd: `${textIconShared} [&_svg]:group-hover:translate-x-0.5`,
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  }
);

export type CTAVariant = NonNullable<VariantProps<typeof ctaVariants>["variant"]>;
