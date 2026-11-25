import { PRODUCTS, SIZE_ORDER, SizeKey, SizeMeasurement } from '@/src/data/products';

export type FitLabel = 'Tight' | 'Perfect' | 'Loose';

export interface SizeRecommendation {
  size: SizeKey;
  fit: FitLabel;
  confidence: number;
  garmentChest: number;
  idealChest: number;
  note: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Computes the best garment size (S–XXL) against a product's sizeRun matrix
 * using body chest (inches), height (cm), and weight (kg).
 * Combines weighted chest ease, BMI-derived frame adjustment, shoulder width,
 * and stature length/sleeve alignment for calibrated boutique sizing.
 */
export function suggestSize(
  chestIn: number,
  heightCm: number,
  weightKg: number,
  sizeRun: Record<SizeKey, SizeMeasurement> = PRODUCTS[0].sizeRun
): SizeRecommendation {
  const safeChest = clamp(Number(chestIn) || 38, 30, 54);
  const safeHeight = clamp(Number(heightCm) || 172, 140, 210);
  const safeWeight = clamp(Number(weightKg) || 70, 40, 140);

  const heightMeters = safeHeight / 100;
  const bmi = safeWeight / (heightMeters * heightMeters);

  // Detect whether sizeRun stores waist inches (trouser matrix: XXL <= 39.5) or garment chest
  const isBottomwearScale = sizeRun.XXL.chest <= 39.5;

  // Continuous frame compensation from BMI so broader/leaner builds adjust ease smoothly
  const frameEase = clamp((bmi - 22.5) * 0.18, -0.65, 1.15);

  // Standard Indian boutique wearing ease is +2.5 in for tops/outerwear;
  // bottomwear maps proportional waist from chest + BMI + 0.5 in comfort allowance.
  const targetGarmentChest = isBottomwearScale
    ? clamp(safeChest * 0.8 + (bmi - 22) * 0.45 + 0.5, 29, 39)
    : safeChest + 2.5 + frameEase;

  // Estimated shoulder width & stature index to resolve between adjacent sizes cleanly
  const idealShoulder = isBottomwearScale
    ? 15.8 + frameEase * 0.5
    : clamp(safeChest * 0.425 + (bmi > 25 ? 0.35 : 0), 14, 21);

  const heightOffsetNorm = clamp((safeHeight - 174) / 14, -1.2, 1.4);
  const minLen = sizeRun.S.length;
  const maxLen = sizeRun.XXL.length;
  const idealLength = minLen + ((clamp(heightOffsetNorm + 1.1, 0, 2.2) / 2.2) * (maxLen - minLen));

  let bestSize: SizeKey = 'M';
  let bestScore = Number.POSITIVE_INFINITY;
  let signedChestDelta = 0;

  for (const key of SIZE_ORDER) {
    const spec = sizeRun[key];
    const chestDiff = spec.chest - targetGarmentChest;
    const shoulderDiff = spec.shoulder - idealShoulder;
    const lengthDiff = spec.length - idealLength;

    // Weighted multi-metric fit distance (chest primary, shoulder secondary, height length tie-break)
    const compositeDistance =
      Math.abs(chestDiff) * 1.0 +
      Math.abs(shoulderDiff) * 0.28 +
      Math.abs(lengthDiff) * 0.12;

    if (compositeDistance < bestScore) {
      bestScore = compositeDistance;
      signedChestDelta = chestDiff;
      bestSize = key;
    }
  }

  const chosenSpec = sizeRun[bestSize];
  const rawChestDelta = chosenSpec.chest - targetGarmentChest;
  const absChestDelta = Math.abs(rawChestDelta);

  // Fit label evaluation within ±0.75 in tolerance window
  let fit: FitLabel = 'Perfect';
  if (signedChestDelta < -0.75) {
    fit = 'Tight';
  } else if (signedChestDelta > 0.75) {
    fit = 'Loose';
  }

  // Calibrated confidence percentage incorporating primary chest delta + shoulder alignment
  const shoulderResidual = Math.abs(chosenSpec.shoulder - idealShoulder);
  const rawConfidence = 98.5 - absChestDelta * 8.5 - shoulderResidual * 1.6;
  const confidence = Math.round(clamp(rawConfidence, 72, 99));

  const actualEase = isBottomwearScale
    ? chosenSpec.chest - (safeChest * 0.8)
    : chosenSpec.chest - safeChest;

  const statureTag =
    safeHeight >= 182
      ? `balanced length (${chosenSpec.length.toFixed(1)}") for your ${Math.round(safeHeight)} cm frame`
      : safeHeight <= 165
        ? `clean proportion (${chosenSpec.length.toFixed(1)}" length) for ${Math.round(safeHeight)} cm height`
        : `shoulder ${chosenSpec.shoulder.toFixed(1)}" & ${chosenSpec.sleeve.toFixed(1)}" sleeve`;

  const note =
    fit === 'Perfect'
      ? `Allows ~${actualEase.toFixed(1)}" breathing ease with ${statureTag} for all-day comfort.`
      : fit === 'Tight'
        ? `Tailored close fit (${actualEase.toFixed(1)}" ease, ${statureTag}). Size up one notch if layering.`
        : `Relaxed boutique drape (${actualEase.toFixed(1)}" ease, ${statureTag}) with generous shoulder movement.`;

  return {
    size: bestSize,
    fit,
    confidence,
    garmentChest: chosenSpec.chest,
    idealChest: Number(targetGarmentChest.toFixed(1)),
    note,
  };
}
