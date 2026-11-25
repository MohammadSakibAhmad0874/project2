import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Pause, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Product } from '@/src/data/products';
import { ResilientImage } from '@/src/components/ResilientImage';
import { EDITORIAL_EASE } from '@/src/components/Reveal';

export type AngleKey = 'front' | 'side' | 'back' | 'sleeve';

interface AngleConfig {
  key: AngleKey;
  label: string;
  degree: number;
  src: string;
  /** Subtle framing differentiation when secondary shots share the primary studio photo */
  styleTransform: string;
  objectPosition: string;
}

interface Photo360ViewerProps {
  product: Product;
  activeAngle: AngleKey;
  onSelectAngle: (angle: AngleKey) => void;
  onFocusMacro: () => void;
}

const ANGLE_ORDER: AngleKey[] = ['front', 'side', 'back', 'sleeve'];
const MAX_INDEX = ANGLE_ORDER.length - 1;
const PX_PER_STEP = 105;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function applyRubberBand(rawPos: number): number {
  if (rawPos < 0) {
    const excess = -rawPos;
    return -((excess * 0.34) / (1 + excess * 0.65));
  }
  if (rawPos > MAX_INDEX) {
    const excess = rawPos - MAX_INDEX;
    return MAX_INDEX + (excess * 0.34) / (1 + excess * 0.65);
  }
  return rawPos;
}

export function Photo360Viewer({
  product,
  activeAngle,
  onSelectAngle,
  onFocusMacro,
}: Photo360ViewerProps) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  // Continuous turntable coordinate & kinetic stage offsets driven by drag + momentum + rebound
  const [virtualPos, setVirtualPos] = useState<number>(() =>
    Math.max(0, ANGLE_ORDER.indexOf(activeAngle))
  );
  const [isCoasting, setIsCoasting] = useState(false);

  const dragStartXRef = useRef<number | null>(null);
  const dragStartPosRef = useRef<number>(0);
  const dragDistanceRef = useRef<number>(0);
  const virtualPosRef = useRef<number>(Math.max(0, ANGLE_ORDER.indexOf(activeAngle)));
  const velocityRef = useRef<number>(0); // steps per second
  const pointerSamplesRef = useRef<{ x: number; t: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const lastEmittedAngleRef = useRef<AngleKey>(activeAngle);
  const onSelectAngleRef = useRef(onSelectAngle);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onSelectAngleRef.current = onSelectAngle;
  }, [onSelectAngle]);

  const hasDistinctBack = product.media.back !== product.media.front;

  const angles: AngleConfig[] = [
    {
      key: 'front',
      label: 'Front',
      degree: 0,
      src: product.media.front,
      styleTransform: 'scale(1)',
      objectPosition: 'center center',
    },
    {
      key: 'side',
      label: 'Side',
      degree: 90,
      src: product.media.side || product.media.front,
      styleTransform:
        product.media.side !== product.media.front
          ? 'scale(1)'
          : 'perspective(900px) rotateY(-14deg) scale(1.06)',
      objectPosition: '70% 35%',
    },
    {
      key: 'back',
      label: 'Back',
      degree: 180,
      src: product.media.back || product.media.front,
      styleTransform: hasDistinctBack ? 'scale(1)' : 'scaleX(-1) scale(1.03)',
      objectPosition: 'center center',
    },
    {
      key: 'sleeve',
      label: 'Sleeve',
      degree: 270,
      src: product.media.sleeve || product.media.front,
      styleTransform:
        product.media.sleeve !== product.media.front ? 'scale(1)' : 'scale(1.42)',
      objectPosition: '78% 72%',
    },
  ];

  const stopPhysicsLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsCoasting(false);
  }, []);

  const syncAngleFromVirtualPos = useCallback((pos: number) => {
    const clampedIndex = Math.max(0, Math.min(MAX_INDEX, Math.round(pos)));
    const nextAngle = ANGLE_ORDER[clampedIndex];
    if (nextAngle !== lastEmittedAngleRef.current) {
      lastEmittedAngleRef.current = nextAngle;
      onSelectAngleRef.current(nextAngle);
    }
  }, []);

  /**
   * Velocity-based momentum glide + spring-based sequence boundary rebound loop.
   * Inside [0, MAX_INDEX]: smoothly coasts with fluid inertia before springing onto nearest frame.
   * Past bounds (< 0 or > MAX_INDEX): underdamped spring rebounds smoothly back to 0 or MAX_INDEX.
   */
  const startMomentumAndRebound = useCallback(() => {
    stopPhysicsLoop();
    setIsCoasting(true);
    lastFrameTimeRef.current = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.032, Math.max(0.004, (now - lastFrameTimeRef.current) / 1000));
      lastFrameTimeRef.current = now;

      let pos = virtualPosRef.current;
      let vel = velocityRef.current;

      if (pos < 0 || pos > MAX_INDEX) {
        // Past rotation sequence bounds: tactile spring-based rebound toward valid boundary
        const boundary = pos < 0 ? 0 : MAX_INDEX;
        const displacement = pos - boundary;
        const springAccel = -270 * displacement - 21 * vel;
        vel += springAccel * dt;
        pos += vel * dt;

        // Soft barrier limit so extreme flicks never escape viewport geometry
        pos = clamp(pos, -0.58, MAX_INDEX + 0.58);

        if (Math.abs(pos - boundary) < 0.0025 && Math.abs(vel) < 0.015) {
          pos = boundary;
          vel = 0;
          virtualPosRef.current = pos;
          velocityRef.current = 0;
          setVirtualPos(pos);
          syncAngleFromVirtualPos(pos);
          rafRef.current = null;
          setIsCoasting(false);
          return;
        }
      } else if (Math.abs(vel) > 0.38) {
        // Active momentum coast inside sequence bounds
        pos += vel * dt;
        vel *= Math.exp(-4.1 * dt);
      } else {
        // Low velocity: spring smoothly onto nearest discrete angle frame
        const detent = clamp(Math.round(pos), 0, MAX_INDEX);
        const displacement = pos - detent;
        const springAccel = -210 * displacement - 24 * vel;
        vel += springAccel * dt;
        pos += vel * dt;

        if (Math.abs(displacement) < 0.0025 && Math.abs(vel) < 0.015) {
          pos = detent;
          vel = 0;
          virtualPosRef.current = pos;
          velocityRef.current = 0;
          setVirtualPos(pos);
          syncAngleFromVirtualPos(pos);
          rafRef.current = null;
          setIsCoasting(false);
          return;
        }
      }

      virtualPosRef.current = pos;
      velocityRef.current = vel;
      setVirtualPos(pos);
      syncAngleFromVirtualPos(pos);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [stopPhysicsLoop, syncAngleFromVirtualPos]);

  // Sync external angle selections (thumbnails, arrow keys, auto-rotate, reset)
  useEffect(() => {
    if (activeAngle === lastEmittedAngleRef.current) return;
    lastEmittedAngleRef.current = activeAngle;
    const targetIdx = Math.max(0, ANGLE_ORDER.indexOf(activeAngle));
    stopPhysicsLoop();
    velocityRef.current = 0;
    virtualPosRef.current = targetIdx;
    setVirtualPos(targetIdx);
  }, [activeAngle, stopPhysicsLoop]);

  useEffect(() => {
    return () => stopPhysicsLoop();
  }, [stopPhysicsLoop]);

  const activeIndex = Math.max(0, ANGLE_ORDER.indexOf(activeAngle));
  const currentConfig = angles[activeIndex];

  // Smooth continuous progress & degree indicators during momentum & drag
  const clampedContinuous = clamp(virtualPos, 0, MAX_INDEX);
  const progressPercent = ((clampedContinuous + 1) / ANGLE_ORDER.length) * 100;
  const continuousDegree = Math.round(clampedContinuous * 90);

  // Kinetic stage shift & subtle perspective lean during drag, coast, and bound overscroll
  const overscroll =
    virtualPos < 0 ? virtualPos : virtualPos > MAX_INDEX ? virtualPos - MAX_INDEX : 0;
  const fractionalOffset =
    virtualPos >= 0 && virtualPos <= MAX_INDEX ? virtualPos - Math.round(virtualPos) : 0;
  const kineticTranslateX = overscroll * 34 + fractionalOffset * 10;
  const kineticRotateY = clamp(overscroll * 14 + fractionalOffset * 8, -11, 11);
  const boundHit: 'start' | 'end' | null =
    virtualPos < -0.025 ? 'start' : virtualPos > MAX_INDEX + 0.025 ? 'end' : null;

  // Auto-rotate plays every 2.5s when enabled and not dragging or coasting
  useEffect(() => {
    if (!autoRotate || isDragging || isCoasting) return;
    const timer = window.setInterval(() => {
      const nextIdx = (ANGLE_ORDER.indexOf(activeAngle) + 1) % ANGLE_ORDER.length;
      const nextAngle = ANGLE_ORDER[nextIdx];
      lastEmittedAngleRef.current = nextAngle;
      virtualPosRef.current = nextIdx;
      setVirtualPos(nextIdx);
      onSelectAngle(nextAngle);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [autoRotate, isDragging, isCoasting, activeAngle, onSelectAngle]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom > 1) return; // When zoomed in, allow cursor pan instead of rotation
    stopPhysicsLoop();
    setAutoRotate(false);
    velocityRef.current = 0;

    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = virtualPosRef.current;
    dragDistanceRef.current = 0;
    pointerSamplesRef.current = [{ x: e.clientX, t: performance.now() }];

    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setOrigin({ x: xPct, y: yPct });
    }

    if (!isDragging || dragStartXRef.current === null) return;

    const now = performance.now();
    const deltaX = e.clientX - dragStartXRef.current;
    dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(deltaX));

    // Record sliding window of recent samples (~95ms) for accurate release velocity
    const samples = pointerSamplesRef.current;
    samples.push({ x: e.clientX, t: now });
    while (samples.length > 2 && now - samples[0].t > 95) {
      samples.shift();
    }

    const rawPos = dragStartPosRef.current + deltaX / PX_PER_STEP;
    const resistedPos = applyRubberBand(rawPos);

    virtualPosRef.current = resistedPos;
    setVirtualPos(resistedPos);
    syncAngleFromVirtualPos(resistedPos);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const samples = pointerSamplesRef.current;
    const now = performance.now();
    const recent = samples.filter((s) => now - s.t <= 105);

    let releaseVelStepsPerSec = 0;
    if (recent.length >= 2) {
      const first = recent[0];
      const last = recent[recent.length - 1];
      const dtSec = Math.max(0.012, (last.t - first.t) / 1000);
      const pxPerSec = (last.x - first.x) / dtSec;
      releaseVelStepsPerSec = clamp(pxPerSec / PX_PER_STEP, -10.5, 10.5);
    }

    dragStartXRef.current = null;
    pointerSamplesRef.current = [];

    // Zero velocity on stationary click still triggers detent / bound spring cleanly
    velocityRef.current = releaseVelStepsPerSec;
    startMomentumAndRebound();
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Only capture wheel zoom when ctrlKey or when user explicitly zoomed > 1
    if (e.ctrlKey || zoom > 1) {
      e.preventDefault();
      const nextZoom = Math.max(1, Math.min(2.5, Number((zoom - e.deltaY * 0.002).toFixed(2))));
      setZoom(nextZoom);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stopPhysicsLoop();
      const nextIdx = (activeIndex + 1) % ANGLE_ORDER.length;
      const nextAngle = ANGLE_ORDER[nextIdx];
      lastEmittedAngleRef.current = nextAngle;
      virtualPosRef.current = nextIdx;
      setVirtualPos(nextIdx);
      onSelectAngle(nextAngle);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stopPhysicsLoop();
      const nextIdx = (activeIndex - 1 + ANGLE_ORDER.length) % ANGLE_ORDER.length;
      const nextAngle = ANGLE_ORDER[nextIdx];
      lastEmittedAngleRef.current = nextAngle;
      virtualPosRef.current = nextIdx;
      setVirtualPos(nextIdx);
      onSelectAngle(nextAngle);
    }
  };

  const handleReset = () => {
    stopPhysicsLoop();
    velocityRef.current = 0;
    setAutoRotate(false);
    setZoom(1);
    setOrigin({ x: 50, y: 50 });
    lastEmittedAngleRef.current = 'front';
    virtualPosRef.current = 0;
    setVirtualPos(0);
    onSelectAngle('front');
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Photo-Based 360° Viewport with Shared-Element Layout Transition */}
      <motion.div
        ref={containerRef}
        layoutId={`product-media-${product.id}`}
        transition={{ layout: { duration: 0.55, ease: EDITORIAL_EASE } }}
        tabIndex={0}
        role="region"
        aria-label={`360-degree photo viewer for ${product.name}. Use left or right arrow keys or drag with momentum to rotate.`}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className={`relative aspect-[3/4] bg-[#EAE7E0] border border-[#C8BFA8] overflow-hidden select-none touch-pan-y focus-visible:outline-2 focus-visible:outline-[#1D2025] ${
          zoom > 1 ? 'cursor-zoom-out' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onClick={() => {
          if (dragDistanceRef.current < 4 && zoom > 1) {
            setZoom(1);
          }
        }}
      >
        {/* Crossfading stack of all 4 real angle photos with kinetic momentum & spring rebound lean */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform:
              zoom > 1
                ? 'none'
                : `perspective(1100px) translate3d(${kineticTranslateX.toFixed(2)}px, 0, 0) rotateY(${kineticRotateY.toFixed(2)}deg)`,
            transition: isDragging || isCoasting ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {angles.map((angle) => {
            const isActive = angle.key === activeAngle;
            return (
              <div
                key={angle.key}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-200 ease-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div
                  className="w-full h-full transition-transform duration-200 ease-out"
                  style={{
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                    transform: `scale(${zoom}) ${angle.styleTransform}`,
                  }}
                >
                  <ResilientImage
                    src={angle.src}
                    alt={`${product.name} — ${angle.label} view`}
                    fallbackTitle={`${product.name} (${angle.label})`}
                    draggable={false}
                    style={{ objectPosition: angle.objectPosition }}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtle Sequence Boundary Rebound Edge Cues */}
        {boundHit === 'start' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-10 z-20 bg-gradient-to-r from-[#9A8357]/30 to-transparent border-l-2 border-[#9A8357]"
          />
        )}
        {boundHit === 'end' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 z-20 bg-gradient-to-l from-[#9A8357]/30 to-transparent border-r-2 border-[#9A8357]"
          />
        )}

        {/* Top-left Angle & Degree Readout */}
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-[#FAF9F6]/92 border border-[#E4E0D8] text-[11px] font-medium text-[#1C1E22] tabular-nums inline-flex items-center gap-2">
          <span>
            {currentConfig.label} View · {continuousDegree}°
          </span>
          {boundHit && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A8357]">
              · Rebound
            </span>
          )}
        </div>

        {/* Top-right Controls: Auto-Rotate, Zoom In/Out, Reset */}
        <div
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              stopPhysicsLoop();
              setAutoRotate((prev) => !prev);
            }}
            aria-label={autoRotate ? 'Pause 360 auto-rotate' : 'Start 360 auto-rotate'}
            title={autoRotate ? 'Pause Auto-Rotate' : 'Auto-Rotate (2.5s)'}
            className={`px-2.5 py-1.5 border text-[11px] font-medium inline-flex items-center gap-1 transition-colors cursor-pointer ${
              autoRotate
                ? 'bg-[#1D2025] text-white border-[#1D2025]'
                : 'bg-[#FAF9F6]/92 text-[#1C1E22] border-[#E4E0D8] hover:border-[#1D2025]'
            }`}
          >
            {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>Rotate</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setZoom((z) => (z >= 2.2 ? 1 : Number((z + 0.5).toFixed(1))))
            }
            aria-label={zoom > 1 ? 'Zoom out' : 'Zoom in'}
            title="Zoom (1x to 2.5x)"
            className="p-1.5 bg-[#FAF9F6]/92 border border-[#E4E0D8] text-[#1C1E22] hover:border-[#1D2025] transition-colors cursor-pointer"
          >
            {zoom > 1.8 ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset 360 viewer"
            title="Reset View"
            className="p-1.5 bg-[#FAF9F6]/92 border border-[#E4E0D8] text-[#1C1E22] hover:border-[#1D2025] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Rotation Progress Bar & Momentum Status */}
        <div className="absolute inset-x-3 bottom-3 z-20 bg-[#FAF9F6]/94 border border-[#E4E0D8] px-3 py-2 pointer-events-none">
          <div className="flex items-center justify-between text-[11px] text-[#1C1E22]/75 mb-1.5">
            <span>
              {boundHit === 'start'
                ? 'Sequence start (0°) · Spring rebound'
                : boundHit === 'end'
                  ? 'Sequence end (270°) · Spring rebound'
                  : isCoasting
                    ? 'Momentum glide settling…'
                    : 'Drag to rotate 360° - Real Photos'}
            </span>
            <span className="font-mono tabular-nums text-[#1D2025] font-medium">
              {zoom > 1 ? `${zoom.toFixed(1)}x` : `${continuousDegree}°`}
            </span>
          </div>
          <div className="w-full h-1 bg-[#E4E0D8] overflow-hidden">
            <div
              className="h-full bg-[#1D2025]"
              style={{
                width: `${progressPercent}%`,
                transition: isDragging || isCoasting ? 'none' : 'width 260ms ease-out',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Synced Thumbnail Strip: Front / Side / Back / Sleeve / Fabric Zoom */}
      <div className="grid grid-cols-5 gap-2.5" role="tablist" aria-label="Product angle thumbnails">
        {angles.map((angle, idx) => {
          const isSelected = activeAngle === angle.key;
          return (
            <button
              key={angle.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                stopPhysicsLoop();
                velocityRef.current = 0;
                setAutoRotate(false);
                lastEmittedAngleRef.current = angle.key;
                virtualPosRef.current = idx;
                setVirtualPos(idx);
                onSelectAngle(angle.key);
              }}
              className={`relative flex flex-col items-center gap-1 p-1 border transition-colors cursor-pointer ${
                isSelected
                  ? 'border-transparent bg-white'
                  : 'border-[#E4E0D8] bg-[#FAF9F6] hover:border-[#C8BFA8]'
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId={`pdp-thumb-active-${product.id}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border border-[#1D2025] ring-1 ring-[#1D2025] z-10"
                />
              )}
              <div className="w-full aspect-square overflow-hidden bg-[#EAE7E0]">
                <ResilientImage
                  src={angle.src}
                  alt={`${angle.label} thumbnail`}
                  style={{
                    transform: angle.styleTransform,
                    objectPosition: angle.objectPosition,
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-medium text-[#1C1E22] whitespace-nowrap">
                {angle.label}
              </span>
            </button>
          );
        })}

        {/* 5th Thumbnail: Fabric Zoom trigger */}
        <button
          type="button"
          onClick={onFocusMacro}
          className="flex flex-col items-center gap-1 p-1 border border-[#E4E0D8] bg-[#FAF9F6] hover:border-[#1D2025] transition-all cursor-pointer"
        >
          <div className="w-full aspect-square overflow-hidden bg-[#EAE7E0] relative">
            <ResilientImage
              src={product.macroTexture || product.media.front}
              alt="Fabric weave macro thumbnail"
              className="w-full h-full object-cover scale-150"
            />
          </div>
          <span className="text-[11px] font-medium text-[#7D6B48] whitespace-nowrap">
            10x Macro
          </span>
        </button>
      </div>
    </div>
  );
}

export const Product360Viewer = Photo360Viewer;
