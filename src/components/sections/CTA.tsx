import { type CTAButton } from "@/types/content";
import { HighlightedText } from "@/components/common/HighlightedText";
import { Reveal } from "./Reveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal";

type CTAProps = {
  id?: string;
  title?: string;
  description?: string;
  ctaButtons: CTAButton[];
  labels: {
    kicker: string;
    title: string;
    highlight: string;
    description: string;
    button: string;
  };
};

export function CTA({
  id,
  title,
  description,
  ctaButtons,
  labels,
}: CTAProps) {
  const primary = ctaButtons[0]!;

  return (
    <section id={id} className="bg-[#fbf1e6] pt-0">
      <Reveal
        variant="stagger"
        className="dark-gold-slab rounded-t-[1rem] px-4 py-14 text-center sm:px-5 sm:py-20 lg:py-28"
        childVariant="heroSupport"
      >
        <Reveal as="p" className="section-kicker border border-white/18 bg-white/5 text-white">
          {labels.kicker}
        </Reveal>
        <Reveal as="h2" className="mx-auto mt-5 max-w-3xl text-balance text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:mt-6 sm:text-5xl md:text-6xl">
          <HighlightedText
            text={title ?? labels.title}
            highlight={labels.highlight}
            highlightClassName="text-gold"
          />
        </Reveal>
        <Reveal as="p" className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-7 text-white/88 sm:mt-6">
          {description ?? labels.description}
        </Reveal>
        <Reveal>
          {primary.href === "/contact" ? (
            <ContactChoiceButton className="mt-8" variant="light">
              {labels.button}
            </ContactChoiceButton>
          ) : (
            <AnimatedButton className="mt-8" href={primary.href} variant="light">
              {labels.button}
            </AnimatedButton>
          )}
        </Reveal>
      </Reveal>
    </section>
  );
}
