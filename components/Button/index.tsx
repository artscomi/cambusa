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
      className={`bg-primary rounded text-white p-4 hover:bg-gray-800 block ${
        full ? "w-full" : ""
      } ${center ? "mx-auto" : ""} ${className}`}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
};
