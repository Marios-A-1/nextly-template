"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { HighlightedText } from "@/components/common/HighlightedText";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { Reveal } from "./Reveal";
import { easeSoft, faqContentVariants, motionDurations } from "@/lib/animations";

type BenefitItem = {
  id: string;
  title: string;
  description: string;
};

type BenefitsProps = {
  id?: string;
  title?: string;
  description?: string;
  items: BenefitItem[];
  tag?: string;
  highlight?: string;
};

export function Benefits({
  id,
  title,
  description,
  items,
  tag,
  highlight,
}: BenefitsProps) {
  const [activeId, setActiveId] = useState(items[1]?.id ?? items[0]?.id ?? "");

  return (
    <section id={id} className="bg-[#fffdf8] py-14 sm:py-20 lg:py-28">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_0.85fr] lg:items-end lg:gap-14">
          <Reveal variant="stagger">
            <Reveal as="p" className="section-kicker">{tag}</Reveal>
            <Reveal as="h2" className="mt-4 max-w-3xl text-balance text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#201b17] sm:text-5xl md:text-6xl">
              <HighlightedText text={title ?? ""} highlight={highlight} />
            </Reveal>
            <Reveal as="p" className="mt-5 max-w-xl text-base leading-7 text-[#6d6156]">
              {description}
            </Reveal>

            <Reveal variant="stagger" className="mt-10 max-w-2xl sm:mt-14 lg:mt-20" childVariant="panel">
              {items.map((item) => (
                <Reveal as="div" className="border-b border-[#e5dbce] py-6" key={item.id}>
                  <button
                    type="button"
                    id={`${item.id}-trigger`}
                    aria-expanded={activeId === item.id}
                    aria-controls={`${item.id}-panel`}
                    className="flex min-h-11 w-full items-center gap-3 text-left text-xl font-semibold tracking-[-0.03em] text-foreground outline-none transition-colors hover:text-[#282018] focus-visible:ring-2 focus-visible:ring-ring/40 sm:gap-4 sm:text-2xl"
                    onClick={() => setActiveId((current) => current === item.id ? "" : item.id)}
                  >
                    <motion.span
                      animate={{ rotate: activeId === item.id ? 45 : 0, scale: activeId === item.id ? 1.08 : 1 }}
                      transition={{ duration: motionDurations.faq, ease: easeSoft }}
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-champagne text-[#201b17]"
                      aria-hidden="true"
                    >
                      <Plus  className="size-5" />
                    </motion.span>
                    {item.title}
                  </button>
                  <AnimatePresence initial={false}>
                    {activeId === item.id ? (
                      <motion.div
                        id={`${item.id}-panel`}
                        role="region"
                        aria-labelledby={`${item.id}-trigger`}
                        variants={faqContentVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="overflow-hidden"
                      >
                        <p className="mt-5 max-w-xl text-base leading-7 text-[#6d6156]">
                          {item.description}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </Reveal>
              ))}
            </Reveal>
          </Reveal>

          <AnimatedImageReveal
            className="premium-hover-surface aspect-[4/5] min-h-[340px] rounded-[0.85rem] sm:min-h-[460px] sm:rounded-[1rem] lg:min-h-[540px]"
            imageClassName="stock-benefits-care stock-image"
            variant="subtle"
          >
              <div className="absolute inset-0 bg-gradient-to-t from-[#201b17]/20 via-transparent to-white/10" />
          </AnimatedImageReveal>
        </div>
      </div>
    </section>
  );
}
