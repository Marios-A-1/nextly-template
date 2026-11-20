import type { ReactNode } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal";
import { Reveal } from "./Reveal";
import type { AppMessages } from "@/content/localized";
import type { SiteConfig } from "@/types/content";

export function AboutHeroSection({
  site,
  labels,
}: {
  site: SiteConfig;
  labels: AppMessages["sections"]["aboutHero"];
}) {
  return (
    <section className="-mt-[68px] page-top-gradient pt-[68px]">
      <div className="site-container py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.75fr)] lg:items-center xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)]">
          <Reveal variant="stagger" className="space-y-5">
            <SplitTextReveal
              as="h1"
              text={labels.title}
              className="max-w-3xl text-balance text-[2.65rem] font-semibold leading-[1.03] tracking-[-0.04em] text-[#201b17] sm:text-5xl md:text-6xl"
            />
            <Reveal as="p" className="max-w-2xl text-sm leading-6 text-[#5f5346]">
              {labels.description}
            </Reveal>
            <Reveal>
              <ContactChoiceButton className="mt-2">
                {labels.cta}
              </ContactChoiceButton>
            </Reveal>
            <Reveal variant="stagger" className="grid gap-5 pt-4 text-[#795321] sm:grid-cols-2 sm:pt-6" childVariant="panel">
              {site.aboutMetrics.slice(0, 2).map((metric) => (
                <Reveal as="div" key={metric.id}>
                  <AnimatedCounter value={metric.value} className="text-3xl font-semibold" />
                  <p className="text-xs font-semibold text-[#5f5346]">{metric.label}</p>
                </Reveal>
              ))}
            </Reveal>
          </Reveal>
          <AnimatedImageReveal
            className="premium-hover-surface aspect-[4/5] min-h-[360px] rounded-[0.8rem] sm:min-h-[480px] lg:min-h-[560px]"
            imageClassName="clinic-doctor-portrait stock-image"
            variant="default"
          />
        </div>
      </div>
    </section>
  );
}

export function SecondaryPageHero({
  title,
  description,
  appointment,
  children,
}: {
  title: string;
  description: string;
  appointment?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate -mt-[64px] overflow-hidden bg-espresso pt-[64px] text-white sm:-mt-[68px] sm:pt-[68px]">
      <div aria-hidden="true" className="dark-gold-slab pointer-events-none absolute inset-0 -z-10" />
      <Reveal variant="stagger" className="site-container space-y-6 py-16 text-center sm:py-24 lg:py-32">
        <SplitTextReveal
          as="h1"
          text={title}
          className="mx-auto max-w-4xl text-balance text-[2.65rem] font-semibold leading-[1.04] tracking-[-0.045em] sm:text-5xl md:text-7xl"
        />
        <Reveal as="p" className="mx-auto max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
          {description}
        </Reveal>
        {appointment && (
          <Reveal>
            <ContactChoiceButton variant="light">Κλείστε ραντεβού</ContactChoiceButton>
          </Reveal>
        )}
        {children}
      </Reveal>
    </section>
  );
}

export function DoctorShowcase() {
  return (
    <section id="doctor-showcase" className="cream-band py-14 sm:py-20 lg:py-28">
      <div className="site-container">
        <Reveal variant="stagger" className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <Reveal as="p" className="section-kicker">Ο ιατρός</Reveal>
          <Reveal as="h2" className="mt-4 text-balance text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Γνωρίστε τον ιατρό
          </Reveal>
        </Reveal>
        <Reveal variant="card" className="mx-auto max-w-[380px]">
          <AnimatedImageReveal
            as="article"
            className="premium-hover-surface aspect-[4/5] min-h-[330px] rounded-[0.8rem] sm:min-h-[420px]"
            imageClassName="clinic-doctor-portrait stock-image"
            variant="card"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-espresso/55 via-transparent to-white/8" />
            <div className="absolute inset-x-4 bottom-4 space-y-1 rounded-[0.7rem] bg-white px-4 py-4 shadow-lg sm:inset-x-5 sm:bottom-5">
              <h3 className="text-xl font-semibold tracking-tight">Δρ. Πέτρος Θ. Βλασταράκος</h3>
              <p className="text-sm text-muted-foreground">Πλαστικός χειρουργός</p>
            </div>
          </AnimatedImageReveal>
          <div className="mt-5 flex justify-center">
            <AnimatedButton href="/about" variant="outline">Βιογραφικό ιατρού</AnimatedButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
