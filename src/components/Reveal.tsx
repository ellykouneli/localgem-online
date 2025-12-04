"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

/**
 * 🪄 Reveal
 * A reusable wrapper for scroll-based fade & rise animations.
 * - Automatically triggers when in view
 * - Customizable delay, duration, and vertical offset
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  yOffset = 30,
  className,
}: RevealProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const variants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
