import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'motion/react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glareOpacity?: number;
  hoverScale?: number;
}

const SPRING_CONFIG = { stiffness: 240, damping: 24, mass: 0.65 };

export function TiltCard3D({
  children,
  className = '',
  intensity = 5.5,
  glareOpacity = 0.12,
  hoverScale = 1.015,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawScale = useMotionValue(1);
  const rawGlareX = useMotionValue(50);
  const rawGlareY = useMotionValue(50);
  const rawGlareAlpha = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, SPRING_CONFIG);
  const rotateY = useSpring(rawRotateY, SPRING_CONFIG);
  const scale = useSpring(rawScale, { stiffness: 280, damping: 26 });
  const glareX = useSpring(rawGlareX, SPRING_CONFIG);
  const glareY = useSpring(rawGlareY, SPRING_CONFIG);
  const glareAlpha = useSpring(rawGlareAlpha, { stiffness: 200, damping: 24 });

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 251, 242, 0.72), transparent 62%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

    rawRotateY.set((px - 0.5) * 2 * intensity);
    rawRotateX.set(-(py - 0.5) * 2 * intensity);
    rawScale.set(hoverScale);
    rawGlareX.set(px * 100);
    rawGlareY.set(py * 100);
    rawGlareAlpha.set(glareOpacity);
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawScale.set(1);
    rawGlareAlpha.set(0);
  };

  return (
    <div className={`perspective-stage ${className}`}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClickCapture={handleMouseLeave}
        style={{
          transformPerspective: 1100,
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full will-change-transform"
      >
        {children}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: glareAlpha,
            background: glareBackground,
          }}
        />
      </motion.div>
    </div>
  );
}
