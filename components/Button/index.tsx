import { motion, MotionProps } from "framer-motion";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps
> = ({ children, className, ...props }) => {
  const { whileTap, ...buttonProps } = props;

  return (
    <motion.button
      whileTap={whileTap || { scale: 0.97 }}
      className={`bg-primary rounded text-white p-4 hover:bg-gray-800 w-full ${className}`}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
};
