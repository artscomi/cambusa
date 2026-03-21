import { cva, type VariantProps } from "class-variance-authority";

export const ctaVariants = cva(
  "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        solid:
          "inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl",
        outline:
          "inline-flex items-center justify-center gap-2 bg-transparent hover:bg-secondary text-primary border-2 border-primary font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full",
        inverse:
          "inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-gray-100 rounded-full shadow-lg hover:shadow-xl px-8 py-4 text-lg font-semibold",
        ghost:
          "inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-white/60 backdrop-blur-sm",
        outlineLight:
          "inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary rounded-full px-8 py-4 text-lg font-semibold",
        form: "inline-flex items-center justify-center gap-2 bg-white hover:bg-secondary-light text-primary border-b-4 border-b-primary rounded p-4 font-cta text-xl tracking-wide transition-colors",
        formOutline:
          "inline-flex items-center justify-center gap-2 bg-transparent hover:bg-secondary text-primary border-2 border-primary rounded p-4 font-cta text-xl tracking-wide transition-colors",
        /** Testo + chevron a destra (children: testo poi es. `<ChevronRight className="w-4 h-4" aria-hidden />`). */
        textChevron:
          "group inline-flex items-center gap-1.5 text-primary font-medium text-base hover:text-primary-light [&_svg]:shrink-0 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform motion-reduce:[&_svg]:transition-none [&_svg]:group-hover:translate-x-0.5",
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  }
);

export type CTAVariant = NonNullable<VariantProps<typeof ctaVariants>["variant"]>;
