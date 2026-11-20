import { HighlightedText } from "@/components/common/HighlightedText";
import type { SiteConfig } from "@/types/content";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { Reveal } from "./Reveal";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";

type AboutPreviewProps = {
  id?: string;
  content: {
    kicker: string;
    title: string;
    highlight: string;
    description: string;
  };
  site: SiteConfig;
};

export function AboutPreview({
  id,
  content,
  site,
}: AboutPreviewProps) {
  return (
    <section id={id} className="bg-[#fffdf8] py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1500px] overflow-hidden px-4 sm:px-5">
        <Reveal variant="stagger" className="mx-auto mb-10 max-w-5xl text-center sm:mb-14">
          <Reveal as="p" className="section-kicker">{content.kicker}</Reveal>
          <Reveal as="h2" className="mt-4 text-balance text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#201b17] sm:text-5xl md:text-6xl">
            <HighlightedText text={content.title} highlight={content.highlight} />
          </Reveal>
          <Reveal as="p" className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#6d6156]">
            {content.description}
          </Reveal>
        </Reveal>

        <Reveal
          variant="stagger"
          className="grid gap-4 sm:grid-cols-2 lg:min-w-[980px] lg:grid-cols-4 lg:gap-5 xl:min-w-0"
          childVariant="card"
        >
          {site.proofCards.map((card, index) => (
            <AnimatedImageReveal
              as="article"
              key={card.id}
              className="premium-hover-surface aspect-[5/4] min-h-[260px] rounded-[0.85rem] sm:aspect-auto sm:min-h-[340px] lg:h-[430px] lg:rounded-[1rem]"
              imageClassName={`stock-proof-${card.id} stock-image`}
              delay={index * 0.1}
              variant="card"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#061d20] via-[#061d20]/42 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-6 sm:bottom-6">
                  <div className="mb-4 flex items-center gap-3 border-b border-white/14 pb-4 sm:mb-5 sm:gap-4 sm:pb-5">
                    <AnimatedCounter
                      value={card.value}
                      className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl"
                    />
                    <p className="max-w-[150px] text-base font-semibold leading-tight sm:text-lg">
                      {card.label}
                    </p>
                    <span className="ml-auto hidden h-1.5 w-20 rounded-full border-y-2 border-dashed border-[#20a8b4] sm:block" />
                  </div>
                  <p className="text-lg font-semibold leading-7 sm:text-xl sm:leading-8">{card.description}</p>
                </div>
            </AnimatedImageReveal>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
