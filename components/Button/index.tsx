import { motion, MotionProps } from "framer-motion";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    full?: boolean;
    center?: boolean;
  } & MotionProps
> = ({ children, className, full, center, ...props }) => {
  const { whileTap, ...buttonProps } = props;

  return (
    <motion.button
      whileTap={whileTap || { scale: 0.97 }}
      className={`bg-white hover:bg-secondary-light rounded text-primary p-4 block transition-colors border-b-primary border-b-4 font-cta text-xl tracking-wide ${
        full ? "w-full" : ""
      } ${center ? "mx-auto" : ""} ${className}`}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
};
