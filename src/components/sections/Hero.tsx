import { type CTAButton, type SiteConfig } from "@/types/content";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { Reveal } from "./Reveal";
import { SplitTextReveal } from "@/components/animations/SplitTextReveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal";
import { HeroInfoCarousel } from "./HeroInfoCarousel";

type HeroProps = {
  title: string;
  titleHighlight?: string;
  tagline?: string;
  description: string;
  highlights?: string[];
  primaryCta?: CTAButton;
  site: SiteConfig;
};

export function Hero({
  title,
  titleHighlight,
  description,
  primaryCta,
  site,
}: HeroProps) {
  const heroCta = primaryCta ?? site.ctas[0]!;

  return (
    <section className="relative -mt-[64px] min-h-[100svh] overflow-hidden bg-[#161411] pt-[64px] text-white sm:-mt-[68px] sm:pt-[68px]">
      <AnimatedImageReveal
        className="absolute inset-0"
        frameMotion={false}
        imageClassName="hero-clinic-photo"
        amount={0.05}
        variant="default"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(180deg,rgba(22,20,17,0.04)_0%,rgba(22,20,17,0.28)_42%,rgba(22,20,17,0.78)_100%)] motion-safe:animate-[heroAmbientIn_1.55s_cubic-bezier(0.16,1,0.3,1)_both] md:bg-gradient-to-b md:from-transparent md:via-transparent md:to-[#161411]/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#161411] via-[#161411]/58 to-transparent md:hidden" />
      <div className="site-container relative z-10 flex min-h-[calc(100svh-64px)] items-center pb-[13.25rem] pt-14 sm:min-h-[calc(100svh-68px)] sm:pb-[13.75rem] sm:pt-16 md:pb-[12.75rem] md:pt-20 lg:pb-[13.5rem]">
        <div className="max-w-4xl space-y-4 sm:space-y-6 md:space-y-7">
          <SplitTextReveal
            as="h1"
            text={title}
            delay={0.06}
            duration={1.42}
            highlight={titleHighlight}
            highlightClassName="text-gold"
            mode="words"
            stagger={0.085}
            className="max-w-3xl text-balance text-[clamp(3rem,14vw,4.35rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white drop-shadow-[0_16px_46px_rgba(0,0,0,0.22)] md:text-7xl md:leading-[1.08] md:tracking-[-0.02em]"
          />
          <Reveal variant="heroSupport" delay={0.28} className="max-w-[34rem] text-base font-semibold leading-7 text-white/90 drop-shadow-[0_10px_34px_rgba(0,0,0,0.18)] sm:text-lg md:max-w-3xl md:text-xl md:leading-8">
            {description}
          </Reveal>
          <Reveal variant="heroSupport" delay={0.44} className="flex flex-wrap items-center gap-3">
            {heroCta.href === "/contact" ? (
              <ContactChoiceButton variant="light">
                {heroCta.label}
              </ContactChoiceButton>
            ) : (
              <AnimatedButton variant="light" href={heroCta.href}>
                {heroCta.label}
              </AnimatedButton>
            )}
            <AnimatedButton variant="outline" href="/results" className="border-white/60 bg-transparent text-white hover:bg-white hover:text-foreground">
              Δείτε αποτελέσματα
            </AnimatedButton>
          </Reveal>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-20 sm:bottom-6 lg:bottom-8" data-hero-info>
        <HeroInfoCarousel items={site.heroInfoItems} />
      </div>
    </section>
  );
}
