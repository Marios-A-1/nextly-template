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
