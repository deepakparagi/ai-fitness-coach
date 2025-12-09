"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

// Shape morphing transition
export const ShapeMorph = ({ children, className }: Props) => (
  <motion.div
    initial={{ 
      clipPath: "circle(0% at 50% 50%)",
      opacity: 0 
    }}
    animate={{ 
      clipPath: "circle(100% at 50% 50%)",
      opacity: 1 
    }}
    exit={{ 
      clipPath: "circle(0% at 50% 50%)",
      opacity: 0 
    }}
    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Swipe transition
export const SwipeIn = ({ children, className, direction = "left" }: Props & { direction?: "left" | "right" | "up" | "down" }) => {
  const variants = {
    left: { x: "-100%", opacity: 0 },
    right: { x: "100%", opacity: 0 },
    up: { y: "-100%", opacity: 0 },
    down: { y: "100%", opacity: 0 },
  };

  return (
    <motion.div
      initial={variants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={variants[direction]}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Zoom match cut transition
export const ZoomMatchCut = ({ children, className }: Props) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
    exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Morphing card animation
export const MorphCard = ({ children, className }: Props) => (
  <motion.div
    initial={{ 
      borderRadius: "100%",
      scale: 0,
      opacity: 0 
    }}
    animate={{ 
      borderRadius: "1rem",
      scale: 1,
      opacity: 1 
    }}
    exit={{ 
      borderRadius: "100%",
      scale: 0,
      opacity: 0 
    }}
    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger children animation
export const StaggerContainer = ({ children, className }: Props) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={{
      visible: { transition: { staggerChildren: 0.1 } },
      hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className }: Props) => (
  <motion.div
    variants={{
      hidden: { y: 20, opacity: 0, scale: 0.9 },
      visible: { y: 0, opacity: 1, scale: 1 },
    }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Page transition wrapper
export const PageTransition = ({ children }: Props) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
