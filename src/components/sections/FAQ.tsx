"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Phone, Plus } from "lucide-react";
import { type FAQ as FAQType } from "@/types/content";
import { Reveal } from "./Reveal";
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { easeSoft, faqContentVariants, motionDurations } from "@/lib/animations";

type FAQProps = {
  id?: string;
  title?: string;
  description?: string;
  faqs: FAQType[];
  labels: {
    kicker: string;
    title: string;
    description: string;
    cardTitle: string;
    cardDescription: string;
    cardCta: string;
  };
};

export function FAQ({
  id,
  title,
  description,
  faqs,
  labels,
}: FAQProps) {
  const reducedMotion = useReducedMotion();
  const [openId, setOpenId] = useState(faqs[0]?.id ?? "");

  return (
    <section id={id} className="cream-band py-14 sm:py-20 lg:py-28">
      <div className="site-container grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-14">
        <Reveal variant="stagger">
          <Reveal as="p" className="section-kicker">{labels.kicker}</Reveal>
          <Reveal as="h2" className="mt-4 max-w-xl text-[2.35rem] font-semibold leading-[1.04] tracking-[-0.04em] text-[#201b17] sm:text-5xl md:text-6xl">
            <span className="gradient-word">
              {(title ?? labels.title).split(" ")[0]}
            </span>{" "}
            {(title ?? labels.title).split(" ").slice(1).join(" ")}
          </Reveal>
          <Reveal as="p" className="mt-5 max-w-md text-base leading-7 text-[#6d6156] sm:mt-6 sm:text-lg">
            {description ?? labels.description}
          </Reveal>

          <Reveal className="mt-8 max-w-md rounded-[0.8rem] bg-white p-5 shadow-[0_20px_60px_rgba(40,32,24,0.06)] sm:mt-12">
            <span className="grid size-12 place-items-center rounded-full bg-[#fbf1e6] text-[#282018]">
              <Phone className="size-5" />
            </span>
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#201b17]">
                  {labels.cardTitle}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6d6156]">
                  {labels.cardDescription}
                </p>
              </div>
              <ContactChoiceButton className="h-11 px-5">
                {labels.cardCta}
              </ContactChoiceButton>
            </div>
          </Reveal>
        </Reveal>

        <Reveal variant="stagger" className="w-full" childVariant="panel">
            {faqs.slice(0, 5).map((faq) => (
              <Reveal
                as="div"
                key={faq.id}
                className="border-b border-[#cfc8c0] py-4"
              >
                <button
                  type="button"
                  id={`${faq.id}-trigger`}
                  className="flex min-h-11 w-full items-start justify-between gap-4 py-3 text-left text-xl font-semibold tracking-[-0.03em] text-foreground outline-none transition-colors hover:text-[#282018] focus-visible:ring-2 focus-visible:ring-ring/40 sm:gap-5 sm:py-4 sm:text-2xl"
                  aria-expanded={openId === faq.id}
                  aria-controls={`${faq.id}-answer`}
                  onClick={() => setOpenId((current) => current === faq.id ? "" : faq.id)}
                >
                  {faq.question}
                  <motion.span
                    animate={{ rotate: openId === faq.id ? 45 : 0 }}
                    transition={{ duration: reducedMotion ? 0 : motionDurations.faq, ease: easeSoft }}
                    className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-champagne text-[#201b17]"
                    aria-hidden="true"
                  >
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openId === faq.id ? (
                    <motion.div
                      id={`${faq.id}-answer`}
                      role="region"
                      aria-labelledby={`${faq.id}-trigger`}
                      variants={reducedMotion ? undefined : faqContentVariants}
                      initial={reducedMotion ? false : "hidden"}
                      animate="show"
                      exit="hidden"
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-base leading-7 text-[#6d6156]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Reveal>
            ))}
        </Reveal>
      </div>
    </section>
  );
}
