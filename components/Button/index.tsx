import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ctaVariants } from "@/components/CTA";

type ButtonVariant = "primary" | "outline";

/**
 * @deprecated Usa {@link CTA} da `@/components/CTA` con `variant="form"` o `variant="formOutline"`.
 * Il componente resta per compatibilità e condivide gli stili con `CTA`.
 */
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    full?: boolean;
    center?: boolean;
    variant?: ButtonVariant;
  } & MotionProps
> = ({ children, className, full, center, variant = "primary", ...props }) => {
  const { whileTap, ...buttonProps } = props;

  const ctaVariant = variant === "outline" ? "formOutline" : "form";

  return (
    <motion.button
      whileTap={whileTap || { scale: 0.97 }}
      className={cn(
        ctaVariants({ variant: ctaVariant }),
        full && "w-full",
        center && "mx-auto",
        className
      )}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
};
