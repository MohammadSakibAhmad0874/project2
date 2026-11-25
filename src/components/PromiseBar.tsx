import React from 'react';
import { Scissors, Sparkles, Truck } from 'lucide-react';
import { Reveal } from '@/src/components/Reveal';

export function PromiseBar() {
  return (
    <section className="bg-[#EFEAE0] text-[#16171A] border-t border-[#E4DED2]">
      <Reveal className="max-w-[1280px] mx-auto px-4 sm:px-8 py-12" y={20}>
        <p className="text-center font-display text-sm sm:text-base uppercase tracking-[0.26em] text-[#16171A]/80 mb-7">
          The Local Threads Standard
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Scissors className="w-4 h-4 text-[#9A8357] stroke-[1.5] shrink-0" />
            <span className="text-xs sm:text-[13px] font-normal text-[#16171A]">
              Complimentary Alterations
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Truck className="w-4 h-4 text-[#9A8357] stroke-[1.5] shrink-0" />
            <span className="text-xs sm:text-[13px] font-normal text-[#16171A]">
              Same-Day Jalandhar Dispatch
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-4 h-4 text-[#9A8357] stroke-[1.5] shrink-0" />
            <span className="text-xs sm:text-[13px] font-normal text-[#16171A]">
              Personal Styling Available
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
