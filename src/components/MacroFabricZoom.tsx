import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Product } from '@/src/data/products';

interface MacroFabricZoomProps {
  product: Product;
  selectedColorHex?: string;
  highlighted?: boolean;
}

type WeavePatternKind = 'twill' | 'jute' | 'knit' | 'basket';

interface LensLut {
  size: number;
  srcX: Float32Array;
  srcY: Float32Array;
  caShift: Float32Array;
  shade: Float32Array;
  inside: Uint8Array;
}

function classifyWeave(fabric: string, weave: string): WeavePatternKind {
  const combined = `${fabric} ${weave}`.toLowerCase();
  if (
    combined.includes('jute') ||
    combined.includes('herringbone') ||
    combined.includes('leather')
  ) {
    return 'jute';
  }
  if (combined.includes('knit') || combined.includes('jersey') || combined.includes('rib')) {
    return 'knit';
  }
  if (
    combined.includes('twill') ||
    combined.includes('hopsack') ||
    combined.includes('denim') ||
    combined.includes('chino')
  ) {
    return 'twill';
  }
  return 'basket';
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return [r, g, b];
    }
  }
  return [232, 224, 210];
}

/**
 * Generates a high-resolution (256x256 seamless) procedural micro-fiber weave
 * canvas tailored to the garment's textile class so 10x optical magnification
 * resolves individual spun threads rather than upscaled pixel blocks.
 */
function buildHighResFiberTile(kind: WeavePatternKind): HTMLCanvasElement {
  const size = 256;
  const tile = document.createElement('canvas');
  tile.width = size;
  tile.height = size;
  const ctx = tile.getContext('2d');
  if (!ctx) return tile;

  const img = ctx.createImageData(size, size);
  const data = img.data;

  // Deterministic pseudo-random helper for crisp yarn slub & micro-fibrils
  const hash = (x: number, y: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      let lum = 128;

      if (kind === 'twill') {
        // 3x1 diagonal twill ribs with crisp spun fiber striations
        const pitch = 16;
        const diag = ((x + y) % pitch) / pitch;
        const ridge = Math.sin(diag * Math.PI * 2);
        const cross = Math.cos(((x - y + size) % 8) * (Math.PI / 4));
        const fibril = (hash(x * 0.65, y * 0.65) - 0.5) * 18;
        lum = 128 + ridge * 34 + cross * 10 + fibril;
      } else if (kind === 'jute') {
        // Coarse braided herringbone husk fibers with organic cross-strands
        const cell = 24;
        const gx = Math.floor(x / cell);
        const lx = (x % cell) / cell;
        const ly = (y % cell) / cell;
        const dir = gx % 2 === 0 ? 1 : -1;
        const strand = Math.sin((lx * 2.5 + dir * ly * 2.5) * Math.PI * 2);
        const fiberGrain = (hash(x, y * 0.4) - 0.5) * 26;
        lum = 126 + strand * 38 + fiberGrain;
      } else if (kind === 'knit') {
        // Combed interlock jersey V-stitch loops
        const col = 14;
        const row = 18;
        const u = ((x % col) / col) * 2 - 1;
        const v = (y % row) / row;
        const loop = Math.sin((Math.abs(u) * 1.4 - v) * Math.PI * 2);
        const rib = Math.cos(u * Math.PI);
        const cottonSoft = (hash(x * 0.5, y * 0.5) - 0.5) * 14;
        lum = 128 + loop * 26 + rib * 16 + cottonSoft;
      } else {
        // Fine Oxford basketweave & Belgian flax slub warp/weft yarns
        const warpPitch = 14;
        const weftPitch = 14;
        const wx = Math.floor(x / warpPitch);
        const wy = Math.floor(y / weftPitch);
        const ux = (x % warpPitch) / warpPitch;
        const uy = (y % weftPitch) / weftPitch;

        const warpOver = (wx + wy) % 2 === 0;
        const warpProfile = Math.sin(ux * Math.PI);
        const weftProfile = Math.sin(uy * Math.PI);
        const slubBias = (hash(wx, wy * 0.25) - 0.5) * 14;
        const fineThread = warpOver
          ? warpProfile * 38 + Math.sin(y * 1.1) * 7
          : weftProfile * 36 + Math.sin(x * 1.1) * 7;
        const interstitialShadow = -((1 - warpProfile) * (1 - weftProfile)) * 34;
        const fibril = (hash(x * 0.8, y * 0.8) - 0.5) * 14;
        lum = 124 + fineThread + interstitialShadow + slubBias + fibril;
      }

      const clamped = Math.max(0, Math.min(255, Math.round(lum)));
      data[idx] = clamped;
      data[idx + 1] = clamped;
      data[idx + 2] = clamped;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return tile;
}

/**
 * Precomputes radial barrel refraction + optical edge chromatic shift + Fresnel rim
 * shading LUT for a square lens buffer so per-frame distortion runs in < 0.6ms.
 */
function buildLensLut(size: number): LensLut {
  const total = size * size;
  const srcX = new Float32Array(total);
  const srcY = new Float32Array(total);
  const caShift = new Float32Array(total);
  const shade = new Float32Array(total);
  const inside = new Uint8Array(total);

  const half = size * 0.5;
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const idx = py * size + px;
      const nx = (px + 0.5 - half) / half;
      const ny = (py + 0.5 - half) / half;
      const r = Math.hypot(nx, ny);

      if (r > 1) {
        inside[idx] = 0;
        continue;
      }
      inside[idx] = 1;

      // Optical bi-convex barrel warp near outer glass rim (center stays rectilinear & crisp)
      const edgeT = Math.max(0, (r - 0.52) / 0.48);
      const barrel = 1 - 0.16 * edgeT * edgeT;
      const sampleNx = nx * barrel;
      const sampleNy = ny * barrel;

      srcX[idx] = Math.max(0, Math.min(size - 1.001, (sampleNx + 1) * half - 0.5));
      srcY[idx] = Math.max(0, Math.min(size - 1.001, (sampleNy + 1) * half - 0.5));

      // Subtle optical chromatic dispersion near outer 22% of lens glass
      const caEdge = Math.max(0, (r - 0.72) / 0.28);
      caShift[idx] = caEdge * caEdge * 2.2;

      // Subtle glass meniscus shading (gentle dome highlight center + cool rim refraction shadow)
      const rimShadow = 1 - 0.18 * Math.pow(Math.max(0, (r - 0.78) / 0.22), 1.6);
      const domeLift = 1 + 0.04 * (1 - r * r);
      shade[idx] = rimShadow * domeLift;
    }
  }

  return { size, srcX, srcY, caShift, shade, inside };
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
) {
  const iw = img.naturalWidth || width;
  const ih = img.naturalHeight || height;
  const scale = Math.max(width / iw, height / ih);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (iw - sw) * 0.5;
  const sy = (ih - sh) * 0.5;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
}

function sampleBilinear(
  src: Uint8ClampedArray,
  size: number,
  fx: number,
  fy: number,
  channelOffset: number
): number {
  const x0 = Math.max(0, Math.min(size - 2, Math.floor(fx)));
  const y0 = Math.max(0, Math.min(size - 2, Math.floor(fy)));
  const tx = fx - x0;
  const ty = fy - y0;

  const i00 = (y0 * size + x0) * 4 + channelOffset;
  const i10 = i00 + 4;
  const i01 = i00 + size * 4;
  const i11 = i01 + 4;

  const top = src[i00] + (src[i10] - src[i00]) * tx;
  const bot = src[i01] + (src[i11] - src[i01]) * tx;
  return top + (bot - top) * ty;
}

export function MacroFabricZoom({
  product,
  selectedColorHex,
  highlighted = false,
}: MacroFabricZoomProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgReadyRef = useRef<boolean>(false);
  const fiberTileRef = useRef<HTMLCanvasElement | null>(null);
  const patchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const refractCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lutRef = useRef<LensLut | null>(null);

  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({
    w: 420,
    h: 560,
    dpr: 1,
  });

  // Smooth spring-interpolated lens coordinates (in stage CSS pixels)
  const targetCursorRef = useRef<{ x: number; y: number }>({ x: 210, y: 245 });
  const currentCursorRef = useRef<{ x: number; y: number }>({ x: 210, y: 245 });
  const isHoveredRef = useRef<boolean>(false);
  const isLockedRef = useRef<boolean>(true);
  const rafRef = useRef<number | null>(null);

  const [isLensLocked, setIsLensLocked] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [textureReady, setTextureReady] = useState(false);

  const textureSrc = product.macroTexture || product.media.front;
  const tintHex = selectedColorHex || product.macroTintHex || '#FFFFFF';
  const weaveKind = classifyWeave(product.fabric, product.weave);

  useEffect(() => {
    isLockedRef.current = isLensLocked;
  }, [isLensLocked]);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Build reusable offscreen buffers & refraction LUT once on mount
  useEffect(() => {
    const bufSize = 188;
    const patch = document.createElement('canvas');
    patch.width = bufSize;
    patch.height = bufSize;
    patchCanvasRef.current = patch;

    const refract = document.createElement('canvas');
    refract.width = bufSize;
    refract.height = bufSize;
    refractCanvasRef.current = refract;

    lutRef.current = buildLensLut(bufSize);
  }, []);

  // Generate high-res weave fiber sub-texture whenever weave class changes
  useEffect(() => {
    fiberTileRef.current = buildHighResFiberTile(weaveKind);
  }, [weaveKind]);

  // Load garment macro photography cleanly
  useEffect(() => {
    imgReadyRef.current = false;
    setTextureReady(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      imgRef.current = img;
      imgReadyRef.current = true;
      setTextureReady(true);
    };
    img.onerror = () => {
      imgReadyRef.current = false;
    };
    img.src = textureSrc;
  }, [textureSrc]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h, dpr } = sizeRef.current;
    if (w <= 0 || h <= 0) return;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 1. Base macro cloth surface
    ctx.fillStyle = '#EAE7E0';
    ctx.fillRect(0, 0, w, h);

    const img = imgRef.current;
    if (imgReadyRef.current && img) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      drawCoverImage(ctx, img, w, h);

      // Subtle multiply garment color wash
      if (tintHex && tintHex.toUpperCase() !== '#FFFFFF') {
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = tintHex;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
    }

    // Soft studio vignette around edges
    const vignette = ctx.createRadialGradient(
      w * 0.5,
      h * 0.45,
      w * 0.2,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.72
    );
    vignette.addColorStop(0, 'rgba(18, 19, 22, 0)');
    vignette.addColorStop(1, 'rgba(18, 19, 22, 0.22)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // 2. Render 10x Optical Circular Loupe with High-Res Fiber Sub-Texture & Edge Glass Distortion
    const showLens = isHoveredRef.current || isLockedRef.current;
    if (showLens && imgReadyRef.current && img && patchCanvasRef.current && refractCanvasRef.current && lutRef.current) {
      const cx = currentCursorRef.current.x;
      const cy = currentCursorRef.current.y;
      const lensRadius = Math.min(96, Math.max(76, Math.round(w * 0.225)));
      const lensDiameter = lensRadius * 2;

      const patch = patchCanvasRef.current;
      const patchCtx = patch.getContext('2d', { willReadFrequently: true });
      const refract = refractCanvasRef.current;
      const refractCtx = refract.getContext('2d');
      const lut = lutRef.current;

      if (patchCtx && refractCtx) {
        const bufSize = lut.size;
        const mag = 10; // 10x optical magnification

        // Map stage coordinates to natural image coordinates (cover crop)
        const iw = img.naturalWidth || w;
        const ih = img.naturalHeight || h;
        const coverScale = Math.max(w / iw, h / ih);
        const visibleW = w / coverScale;
        const visibleH = h / coverScale;
        const offsetX = (iw - visibleW) * 0.5;
        const offsetY = (ih - visibleH) * 0.5;

        const imgCenterX = offsetX + (cx / w) * visibleW;
        const imgCenterY = offsetY + (cy / h) * visibleH;

        // 10x magnified source window in natural pixels
        const sampleW = (lensDiameter / mag) / coverScale;
        const sampleH = (lensDiameter / mag) / coverScale;

        patchCtx.clearRect(0, 0, bufSize, bufSize);
        patchCtx.imageSmoothingEnabled = true;
        patchCtx.imageSmoothingQuality = 'high';
        patchCtx.drawImage(
          img,
          imgCenterX - sampleW * 0.5,
          imgCenterY - sampleH * 0.5,
          sampleW,
          sampleH,
          0,
          0,
          bufSize,
          bufSize
        );

        // Apply subtle dye wash inside magnified patch
        if (tintHex && tintHex.toUpperCase() !== '#FFFFFF') {
          patchCtx.save();
          patchCtx.globalCompositeOperation = 'multiply';
          patchCtx.globalAlpha = 0.2;
          patchCtx.fillStyle = tintHex;
          patchCtx.fillRect(0, 0, bufSize, bufSize);
          patchCtx.restore();
        }

        // Anchor crisp procedural high-resolution fiber sub-texture to cloth coordinates
        // so threads stay world-locked as you sweep the glass lens over the swatch
        const tile = fiberTileRef.current;
        if (tile) {
          const pattern = patchCtx.createPattern(tile, 'repeat');
          if (pattern) {
            const tileScale = 0.52;
            const shiftX = -((cx * mag) % (tile.width * tileScale));
            const shiftY = -((cy * mag) % (tile.height * tileScale));

            patchCtx.save();
            patchCtx.translate(shiftX, shiftY);
            patchCtx.scale(tileScale, tileScale);
            patchCtx.globalCompositeOperation = 'overlay';
            patchCtx.globalAlpha = 0.58;
            patchCtx.fillStyle = pattern;
            patchCtx.fillRect(
              -shiftX / tileScale,
              -shiftY / tileScale,
              bufSize / tileScale + tile.width,
              bufSize / tileScale + tile.height
            );
            patchCtx.restore();

            // Micro specular thread highlights (soft-light pass)
            patchCtx.save();
            patchCtx.translate(shiftX, shiftY);
            patchCtx.scale(tileScale, tileScale);
            patchCtx.globalCompositeOperation = 'soft-light';
            patchCtx.globalAlpha = 0.45;
            patchCtx.fillStyle = pattern;
            patchCtx.fillRect(
              -shiftX / tileScale,
              -shiftY / tileScale,
              bufSize / tileScale + tile.width,
              bufSize / tileScale + tile.height
            );
            patchCtx.restore();
          }
        }

        // Apply real optical barrel glass edge distortion + subtle chromatic dispersion
        const srcImg = patchCtx.getImageData(0, 0, bufSize, bufSize);
        const dstImg = patchCtx.createImageData(bufSize, bufSize);
        const src = srcImg.data;
        const dst = dstImg.data;
        const half = bufSize * 0.5;
        const [tr, tg, tb] = hexToRgb(tintHex);
        const tintBiasR = (tr - 128) * 0.04;
        const tintBiasG = (tg - 128) * 0.04;
        const tintBiasB = (tb - 128) * 0.04;

        for (let py = 0; py < bufSize; py++) {
          for (let px = 0; px < bufSize; px++) {
            const idx = py * bufSize + px;
            if (!lut.inside[idx]) continue;

            const pOut = idx * 4;
            const sx = lut.srcX[idx];
            const sy = lut.srcY[idx];
            const ca = lut.caShift[idx];
            const shade = lut.shade[idx];

            if (ca > 0.05) {
              const rx = (px + 0.5 - half) / half;
              const ry = (py + 0.5 - half) / half;
              const rChannel = sampleBilinear(src, bufSize, sx + rx * ca, sy + ry * ca, 0);
              const gChannel = sampleBilinear(src, bufSize, sx, sy, 1);
              const bChannel = sampleBilinear(src, bufSize, sx - rx * ca, sy - ry * ca, 2);

              dst[pOut] = Math.max(0, Math.min(255, rChannel * shade + tintBiasR));
              dst[pOut + 1] = Math.max(0, Math.min(255, gChannel * shade + tintBiasG));
              dst[pOut + 2] = Math.max(0, Math.min(255, bChannel * shade + tintBiasB));
            } else {
              const rChannel = sampleBilinear(src, bufSize, sx, sy, 0);
              const gChannel = sampleBilinear(src, bufSize, sx, sy, 1);
              const bChannel = sampleBilinear(src, bufSize, sx, sy, 2);

              dst[pOut] = Math.max(0, Math.min(255, rChannel * shade));
              dst[pOut + 1] = Math.max(0, Math.min(255, gChannel * shade));
              dst[pOut + 2] = Math.max(0, Math.min(255, bChannel * shade));
            }
            dst[pOut + 3] = 255;
          }
        }

        refractCtx.putImageData(dstImg, 0, 0);

        // Drop shadow beneath glass loupe
        ctx.save();
        ctx.shadowColor = 'rgba(12, 13, 16, 0.42)';
        ctx.shadowBlur = 26;
        ctx.shadowOffsetY = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, lensRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#191A1F';
        ctx.fill();
        ctx.restore();

        // Draw clipped distorted 10x lens content
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, lensRadius, 0, Math.PI * 2);
        ctx.clip();

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(refract, cx - lensRadius, cy - lensRadius, lensDiameter, lensDiameter);

        // Subtle curved studio glass glare reflection arc (top-left)
        const glare = ctx.createLinearGradient(
          cx - lensRadius,
          cy - lensRadius,
          cx + lensRadius * 0.4,
          cy + lensRadius * 0.4
        );
        glare.addColorStop(0, 'rgba(255, 255, 255, 0.30)');
        glare.addColorStop(0.28, 'rgba(255, 255, 255, 0.08)');
        glare.addColorStop(0.65, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glare;
        ctx.fillRect(cx - lensRadius, cy - lensRadius, lensDiameter, lensDiameter);

        // Inner bevel refraction halo
        const innerRim = ctx.createRadialGradient(
          cx,
          cy,
          lensRadius * 0.72,
          cx,
          cy,
          lensRadius
        );
        innerRim.addColorStop(0, 'rgba(255, 255, 255, 0)');
        innerRim.addColorStop(0.84, 'rgba(255, 255, 255, 0.08)');
        innerRim.addColorStop(0.96, 'rgba(255, 255, 255, 0.34)');
        innerRim.addColorStop(1, 'rgba(20, 22, 26, 0.35)');
        ctx.fillStyle = innerRim;
        ctx.beginPath();
        ctx.arc(cx, cy, lensRadius, 0, Math.PI * 2);
        ctx.fill();

        // Fine optical loupe ticks (12, 3, 6, 9 o'clock)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        const ticks = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];
        for (const a of ticks) {
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * (lensRadius - 9), cy + Math.sin(a) * (lensRadius - 9));
          ctx.lineTo(cx + Math.cos(a) * (lensRadius - 2), cy + Math.sin(a) * (lensRadius - 2));
          ctx.stroke();
        }
        ctx.restore();

        // Outer machined antique brass + ivory optical bezel rings
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, lensRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, lensRadius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = '#9A8357';
        ctx.lineWidth = 1.25;
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }, [tintHex]);

  // Keep canvas resolution synced to container dimensions & devicePixelRatio
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const syncSize = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const prevW = sizeRef.current.w;

      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      if (prevW === 420) {
        targetCursorRef.current = { x: rect.width * 0.5, y: rect.height * 0.44 };
        currentCursorRef.current = { x: rect.width * 0.5, y: rect.height * 0.44 };
      }
      drawFrame();
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [drawFrame]);

  // Re-render smoothly when image completes loading or tint/lock toggles
  useEffect(() => {
    drawFrame();
  }, [textureReady, tintHex, isLensLocked, isHovered, drawFrame]);

  // Smooth spring-damped rAF cursor tracking loop
  const ensureLoop = useCallback(() => {
    if (rafRef.current !== null) return;

    const tick = () => {
      const cur = currentCursorRef.current;
      const tgt = targetCursorRef.current;
      const dx = tgt.x - cur.x;
      const dy = tgt.y - cur.y;

      if (Math.hypot(dx, dy) < 0.2) {
        currentCursorRef.current = { x: tgt.x, y: tgt.y };
        drawFrame();
        rafRef.current = null;
        return;
      }

      cur.x += dx * 0.28;
      cur.y += dy * 0.28;
      drawFrame();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updateTargetFromClient = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(24, Math.min(rect.width - 24, clientX - rect.left));
    const y = Math.max(24, Math.min(rect.height - 24, clientY - rect.top));
    targetCursorRef.current = { x, y };
    ensureLoop();
  };

  return (
    <div
      className={`flex flex-col gap-3 transition-all ${
        highlighted ? 'ring-2 ring-[#C8BFA8] ring-offset-4 ring-offset-[#FAF9F6]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1C1E22]">
            Macro Fabric Texture
          </h2>
          <p className="text-xs text-[#1C1E22]/60 mt-0.5">
            Sweep optical loupe across weave to inspect 10x fibers
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLensLocked((prev) => !prev)}
          className={`px-2.5 py-1 border text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer transition-colors ${
            isLensLocked || isHovered
              ? 'bg-[#1D2025] text-white border-[#1D2025]'
              : 'bg-white text-[#1C1E22] border-[#E4E0D8] hover:border-[#1D2025]'
          }`}
        >
          <Search className="w-3 h-3" />
          <span>{isLensLocked ? '10x Lens Active' : 'Show 10x Lens'}</span>
        </button>
      </div>

      {/* High-Performance Canvas Macro Texture Stage */}
      <div
        ref={stageRef}
        onMouseEnter={(e) => {
          setIsHovered(true);
          updateTargetFromClient(e.clientX, e.clientY);
        }}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={(e) => {
          if (!isHovered) setIsHovered(true);
          updateTargetFromClient(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          setIsHovered(true);
          setIsLensLocked(true);
          const t = e.touches[0];
          if (t) updateTargetFromClient(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          const t = e.touches[0];
          if (t) updateTargetFromClient(t.clientX, t.clientY);
        }}
        className="relative aspect-[3/4] border border-[#C8BFA8] overflow-hidden cursor-crosshair select-none bg-[#EAE7E0] touch-none"
        role="img"
        aria-label={`10x Optical macro weave texture of ${product.fabric}`}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />

        {!textureReady && (
          <div
            aria-hidden="true"
            className="absolute inset-0 skeleton-shimmer pointer-events-none"
          />
        )}

        <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#FAF9F6]/92 border border-[#E4E0D8] text-[10px] uppercase tracking-[0.14em] font-mono text-[#1C1E22] pointer-events-none">
          10.0× Optical Loupe · Canvas
        </div>

        <div className="absolute inset-x-3 bottom-3 bg-[#FAF9F6]/95 border border-[#E4E0D8] px-3 py-2 pointer-events-none">
          <p className="text-xs font-semibold text-[#1C1E22]">
            Zoom 10x - {product.fabric}
          </p>
          <p className="text-[11px] text-[#1C1E22]/65 mt-0.5">
            {product.weave} · {product.sustainable ? 'Low-Impact Loom' : 'Atelier Finish'}
          </p>
        </div>
      </div>

      <div className="p-3.5 bg-[#EFECE6] border border-[#E4E0D8]">
        <p className="text-[11px] uppercase tracking-wider text-[#7D6B48] font-semibold">
          Atelier Fabric Note
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[#1C1E22]/80">
          “{product.shopkeeperNote}”
        </p>
      </div>
    </div>
  );
}

export const MacroTextureViewer = MacroFabricZoom;
