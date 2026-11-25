import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

interface MagneticScrollSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  snap?: boolean;
}

const HEAVY_EDITORIAL_SPRING = {
  stiffness: 115,
  damping: 24,
  mass: 1.15,
};

/**
 * Heavyweight editorial scroll-dwell container driven by Framer Motion useScroll + useTransform.
 * Creates a magnetic plateau ([0.22 -> 0.78]) where the section locks cleanly into focus at scale 1, y 0.
 */
export function MagneticScrollSection({
  children,
  id,
  className = '',
  snap = true,
}: MagneticScrollSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const targetY = useTransform(scrollYProgress, [0, 0.24, 0.76, 1], [44, 0, 0, -24]);
  const targetScale = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.978, 1, 1, 0.988]);
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.86, 1], [0.55, 1, 1, 0.72]);

  const y = useSpring(targetY, HEAVY_EDITORIAL_SPRING);
  const scale = useSpring(targetScale, HEAVY_EDITORIAL_SPRING);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${snap ? 'snap-start scroll-mt-16' : ''} ${className}`}
    >
      <motion.div
        style={{ y, scale, opacity }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </section>
  );
}
