import React from 'react';
import { ArrowRight } from 'lucide-react';
import { EVENT_BOARDS, STYLIST_AVATAR_IMAGE } from '@/src/data/products';
import { ResilientImage } from '@/src/components/ResilientImage';
import { TiltCard3D } from '@/src/components/TiltCard3D';
import { Reveal } from '@/src/components/Reveal';
import { MagneticButton } from '@/src/components/MagneticButton';
import { PromiseBar } from '@/src/components/PromiseBar';

interface EventsPageProps {
  onSelectEvent: (queryTrigger: string) => void;
  onOpenStylist: () => void;
}

export function EventsPage({ onSelectEvent, onOpenStylist }: EventsPageProps) {
  return (
    <div className="bg-[#F7F4EE] text-[#16171A] pb-14 lg:pb-0">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-10">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4DED2] pb-6" y={18}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#9A8357] font-medium">
              Occasion Lookbooks · Jalandhar & Beyond
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-normal tracking-wide text-[#16171A] mt-1">
              Events & Dress Chapters
            </h1>
          </div>

          <MagneticButton
            strength={0.2}
            maxOffset={6}
            onClick={onOpenStylist}
            className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#121316] text-white text-xs cursor-pointer hover:bg-[#23252C] transition-colors"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#C4B494]/60">
              <ResilientImage
                src={STYLIST_AVATAR_IMAGE}
                alt="Personal Stylist"
                className="w-full h-full object-cover"
              />
            </div>
            <span>Ask AI Guide for Custom Event</span>
          </MagneticButton>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENT_BOARDS.map((ev, idx) => (
            <Reveal key={ev.id} delay={idx * 0.08} y={24} className="h-full">
              <TiltCard3D intensity={5} glareOpacity={0.11} className="h-full">
                <button
                  type="button"
                  onClick={() => onSelectEvent(ev.queryTrigger)}
                  className="w-full h-full group text-left bg-white text-[#16171A] overflow-hidden border border-[#E4DED2] hover:border-[#C4B494] transition-colors shadow-editorial cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#EFEAE0]">
                    <ResilientImage
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#9A8357]">
                        {ev.dressCode}
                      </p>
                      <h2 className="font-display text-2xl font-normal text-[#16171A]">
                        {ev.title}
                      </h2>
                      <p className="text-xs leading-relaxed text-[#16171A]/65">
                        {ev.subtitle}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-medium text-[#16171A] group-hover:text-[#9A8357] group-hover:translate-x-1 transition-all">
                      <span>Style This Event</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              </TiltCard3D>
            </Reveal>
          ))}
        </div>
      </div>

      <PromiseBar />
    </div>
  );
}
