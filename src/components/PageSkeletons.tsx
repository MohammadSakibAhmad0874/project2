import React from 'react';

interface ShimmerBlockProps {
  className?: string;
  tone?: 'light' | 'dark';
}

export function ShimmerBlock({ className = '', tone = 'light' }: ShimmerBlockProps) {
  return (
    <div
      aria-hidden="true"
      className={`${tone === 'dark' ? 'skeleton-shimmer-dark' : 'skeleton-shimmer'} ${className}`}
    />
  );
}

/**
 * Mirrors HomePage layout proportions (Hero, Trending Categories, Story Spread,
 * and Curated Signatures 4-card grid) so initial data fetch has zero layout shift.
 */
export function HomePageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading Local Threads editorial showcase"
      className="bg-[#F7F4EE] text-[#16171A] pb-14 lg:pb-0"
    >
      {/* Hero Skeleton */}
      <section className="relative bg-[#121316] border-b border-[#2A2C32]">
        <div className="max-w-[1440px] mx-auto min-h-[580px] lg:min-h-[630px] grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 px-6 sm:px-12 lg:px-16 py-16 lg:py-20 space-y-6">
            <ShimmerBlock tone="dark" className="h-3 w-64" />
            <div className="space-y-3">
              <ShimmerBlock tone="dark" className="h-12 sm:h-14 w-11/12 max-w-lg" />
              <ShimmerBlock tone="dark" className="h-12 sm:h-14 w-9/12 max-w-md" />
            </div>
            <div className="space-y-2 max-w-md">
              <ShimmerBlock tone="dark" className="h-3.5 w-full" />
              <ShimmerBlock tone="dark" className="h-3.5 w-10/12" />
              <ShimmerBlock tone="dark" className="h-3.5 w-7/12" />
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <ShimmerBlock tone="dark" className="h-11 w-48" />
              <ShimmerBlock tone="dark" className="h-11 w-36 border border-[#2A2C32]" />
            </div>
          </div>

          <div className="lg:col-span-6 px-6 sm:px-12 lg:px-14 pb-14 lg:py-12 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px] flex justify-end">
              <div className="hidden sm:block absolute left-0 -bottom-4 w-[180px] lg:w-[200px] bg-[#191A1F] border border-[#2A2C32] p-2">
                <ShimmerBlock tone="dark" className="aspect-[3/4] w-full" />
                <div className="pt-2 px-1 flex items-center justify-between">
                  <ShimmerBlock tone="dark" className="h-3 w-24" />
                  <ShimmerBlock tone="dark" className="h-3 w-6" />
                </div>
              </div>

              <div className="relative z-10 w-full max-w-[325px] xl:max-w-[345px] bg-[#191A1F] border border-[#2A2C32] p-2.5">
                <ShimmerBlock tone="dark" className="aspect-[3/4] w-full" />
                <div className="pt-2.5 px-1 flex items-center justify-between">
                  <ShimmerBlock tone="dark" className="h-4 w-40" />
                  <ShimmerBlock tone="dark" className="h-3.5 w-14" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Categories Skeleton */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-20 pb-8 space-y-8">
        <div className="flex items-end justify-between gap-4 border-b border-[#E4DED2] pb-5">
          <div className="space-y-2">
            <ShimmerBlock className="h-3 w-40" />
            <ShimmerBlock className="h-8 w-56" />
          </div>
          <ShimmerBlock className="h-3.5 w-28" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="bg-white border border-[#E4DED2] overflow-hidden">
              <ShimmerBlock className="aspect-[4/3] w-full" />
              <div className="p-4 flex items-center justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <ShimmerBlock className="h-6 w-24" />
                  <ShimmerBlock className="h-3 w-36" />
                </div>
                <ShimmerBlock className="h-4 w-4 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Signatures Product Grid Skeleton */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-20 space-y-10">
        <div className="flex items-end justify-between gap-4 border-b border-[#E4DED2] pb-5">
          <div className="space-y-2">
            <ShimmerBlock className="h-3 w-28" />
            <ShimmerBlock className="h-8 w-52" />
          </div>
          <ShimmerBlock className="h-3.5 w-24" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="flex flex-col">
              <ShimmerBlock className="aspect-[3/4] w-full border border-[#E4DED2]" />
              <div className="pt-3.5 flex items-baseline justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <ShimmerBlock className="h-3.5 w-4/5" />
                  <ShimmerBlock className="h-3 w-1/2" />
                </div>
                <ShimmerBlock className="h-3.5 w-12 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Mirrors ProductDetailPage structure (breadcrumb, 6-col 360° studio stage +
 * 5 thumbnail strip, and 6-col editorial header, specs, swatches, sizes & CTAs).
 */
export function ProductDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading garment studio specifications"
      className="bg-[#F7F4EE] text-[#16171A] pb-14 lg:pb-0"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12">
        {/* Top Breadcrumb Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4DED2] pb-4">
          <ShimmerBlock className="h-3.5 w-36" />
          <ShimmerBlock className="h-3.5 w-56" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Mode toggle + 360° Studio Viewport + 5 Thumbnails */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <ShimmerBlock className="h-8 w-56 border border-[#DED7C8]" />
              <ShimmerBlock className="h-3.5 w-32" />
            </div>

            <div className="space-y-3">
              <ShimmerBlock className="aspect-[3/4] w-full border border-[#C8BFA8]" />
              <div className="grid grid-cols-5 gap-2.5">
                {[0, 1, 2, 3, 4].map((thumb) => (
                  <div
                    key={thumb}
                    className="flex flex-col items-center gap-1 p-1 border border-[#E4E0D8] bg-[#FAF9F6]"
                  >
                    <ShimmerBlock className="w-full aspect-square" />
                    <ShimmerBlock className="h-3 w-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Header, Price, Fabric Specs, Color Swatches, Sizes & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3 border-b border-[#DED7C8] pb-5">
              <ShimmerBlock className="h-3 w-36" />
              <div className="flex items-start justify-between gap-4">
                <ShimmerBlock className="h-9 sm:h-10 w-3/4" />
                <ShimmerBlock className="h-9 w-9 shrink-0" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-3">
                  <ShimmerBlock className="h-6 w-24" />
                  <ShimmerBlock className="h-4 w-16" />
                </div>
                <ShimmerBlock className="h-4 w-20" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <ShimmerBlock className="h-3.5 w-16" />
                <ShimmerBlock className="col-span-2 h-4 w-4/5" />
              </div>
              <div className="grid grid-cols-3 gap-4 items-start">
                <ShimmerBlock className="h-3.5 w-16" />
                <div className="col-span-2 space-y-2">
                  <ShimmerBlock className="h-4 w-28" />
                  <div className="flex gap-2.5">
                    <ShimmerBlock className="w-6 h-6 rounded-full" />
                    <ShimmerBlock className="w-6 h-6 rounded-full" />
                    <ShimmerBlock className="w-6 h-6 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-start">
                <ShimmerBlock className="h-3.5 w-20" />
                <div className="col-span-2 space-y-2">
                  <ShimmerBlock className="h-3.5 w-full" />
                  <ShimmerBlock className="h-3.5 w-5/6" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-start">
                <ShimmerBlock className="h-3.5 w-14" />
                <div className="col-span-2 space-y-2">
                  <ShimmerBlock className="h-3.5 w-full" />
                  <ShimmerBlock className="h-3.5 w-11/12" />
                  <ShimmerBlock className="h-3.5 w-2/3" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#DED7C8]">
                <div className="space-y-2">
                  <ShimmerBlock className="h-3.5 w-24" />
                  <ShimmerBlock className="h-3 w-16" />
                </div>
                <div className="col-span-2 space-y-2">
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((sz) => (
                      <ShimmerBlock key={sz} className="h-9 w-full" />
                    ))}
                  </div>
                  <ShimmerBlock className="h-3 w-44" />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <ShimmerBlock className="h-12 w-full" />
              <ShimmerBlock className="h-11 w-full border border-[#DED7C8]" />
            </div>

            <div className="pt-4 border-t border-[#DED7C8] space-y-3">
              <ShimmerBlock className="h-3.5 w-36" />
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((c) => (
                  <div key={c} className="bg-[#EBE5D9] border border-[#DED7C8] p-1.5 space-y-2">
                    <ShimmerBlock className="aspect-[4/3] w-full" />
                    <ShimmerBlock className="h-3 w-4/5" />
                    <ShimmerBlock className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
