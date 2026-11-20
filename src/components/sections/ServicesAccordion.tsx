"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { easeSoft, motionDurations } from "@/lib/animations";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Service } from "@/types/content";

export function ServicesAccordion({ services }: { services: Service[] }) {
  const [expandedSlug, setExpandedSlug] = useState(services[1]?.slug ?? services[0]?.slug ?? "");
  const reducedMotion = useReducedMotion();

  return (
    <div className="space-y-4">
      {services.map((service) => {
        const expanded = service.slug === expandedSlug;
        const triggerId = `treatment-${service.slug}`;
        const panelId = `${triggerId}-panel`;
        return (
          <article key={service.slug} className="premium-hover-surface rounded-[0.7rem] bg-[#191511] p-5 text-white sm:p-6">
            <h3>
              <button
                type="button"
                id={triggerId}
                data-treatment-trigger={service.slug}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="grid min-h-11 w-full items-start gap-4 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto] sm:gap-5"
                onClick={() => setExpandedSlug((current) => current === service.slug ? "" : service.slug)}
              >
                <span className="break-words text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{service.title}</span>
                <span className="max-w-xl text-sm font-semibold leading-6 text-white/85">{service.summary}</span>
                <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-white text-espresso lg:size-10">
                  <motion.span
                    animate={{ rotate: expanded ? -90 : -45 }}
                    transition={{ duration: reducedMotion ? 0 : motionDurations.faq, ease: easeSoft }}
                  >
                    <ArrowRight className="size-4" />
                  </motion.span>
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!expanded}>
              {expanded && (
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[0.75fr_1fr]"
                >
                  <p className="text-sm font-semibold text-white/80">Τι περιλαμβάνει</p>
                  <div>
                    <AnimatedImageReveal className="aspect-[5/4] max-h-96 rounded-[0.7rem] bg-champagne" variant="subtle">
                      <Image src={service.image.src} alt={service.image.alt} fill sizes="(max-width: 1024px) 90vw, 50vw" className="object-cover" />
                    </AnimatedImageReveal>
                    {service.highlights.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {service.highlights.slice(0, 4).map((highlight) => (
                          <li key={highlight} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-2 text-xs">
                            <CheckCircle2 className="size-4 shrink-0 text-gold" aria-hidden="true" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                    <AnimatedButton className="mt-7" href={service.cta.href} variant="light">Μάθετε περισσότερα</AnimatedButton>
                  </div>
                </motion.div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
