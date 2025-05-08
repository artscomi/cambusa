import { motion, MotionProps } from "framer-motion";

type ButtonVariant = "primary" | "outline";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    full?: boolean;
    center?: boolean;
    variant?: ButtonVariant;
  } & MotionProps
> = ({ children, className, full, center, variant = "primary", ...props }) => {
  const { whileTap, ...buttonProps } = props;

  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "bg-transparent hover:bg-secondary text-primary border-2 border-primary";
      case "primary":
      default:
        return "bg-white hover:bg-secondary-light text-primary border-b-primary border-b-4";
    }
  };

  return (
    <motion.button
      whileTap={whileTap || { scale: 0.97 }}
      className={`${getVariantClasses()} rounded p-4 block transition-colors font-cta text-xl tracking-wide ${
        full ? "w-full" : ""
      } ${center ? "mx-auto" : ""} ${className}`}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
};
