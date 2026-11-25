import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
  strength?: number;
  maxOffset?: number;
}

const MAGNETIC_SPRING = { stiffness: 320, damping: 22, mass: 0.45 };

/**
 * Tactile spring-based cursor-follow button wrapper for primary navigation links and CTAs.
 * Gently attracts toward the pointer within a restrained luxury radius without layout shift.
 */
export function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ariaLabel,
  title,
  strength = 0.24,
  maxOffset = 6,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawInnerX = useMotionValue(0);
  const rawInnerY = useMotionValue(0);

  const x = useSpring(rawX, MAGNETIC_SPRING);
  const y = useSpring(rawY, MAGNETIC_SPRING);
  const innerX = useSpring(rawInnerX, MAGNETIC_SPRING);
  const innerY = useSpring(rawInnerY, MAGNETIC_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;

    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, dx));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, dy));

    rawX.set(clampedX);
    rawY.set(clampedY);
    rawInnerX.set(clampedX * 0.42);
    rawInnerY.set(clampedY * 0.42);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
    rawInnerX.set(0);
    rawInnerY.set(0);
  };

  return (
    <motion.button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={(e) => {
        reset();
        onClick?.(e);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onBlur={reset}
      aria-label={ariaLabel}
      title={title}
      style={{ x, y }}
      whileTap={disabled ? undefined : { scale: 0.975 }}
      className={`will-change-transform ${className}`}
    >
      <motion.span
        style={{ x: innerX, y: innerY }}
        className="inline-flex items-center justify-center [gap:inherit] w-full h-full pointer-events-none"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
