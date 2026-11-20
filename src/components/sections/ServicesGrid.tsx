import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { type CTAButton, type Service } from "@/types/content";
import { HighlightedText } from "@/components/common/HighlightedText";
import { ScrollLinkedTrack } from "@/components/animations/ScrollLinkedTrack";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Reveal } from "./Reveal";

type ServicesGridProps = {
  id?: string;
  title?: string;
  description?: string;
  services: Service[];
  cta?: CTAButton;
  labels: {
    kicker: string;
    defaultTitle: string;
    highlight: string;
    description: string;
    allServices: string;
    viewDetails: string;
  };
};

const PANEL_TONES = [
  "bg-[#f0f4ff]",
  "bg-[#fff3e7]",
  "bg-[#eefdf5]",
  "bg-[#f5edff]",
  "bg-[#eef6f7]",
  "bg-[#fff7ed]",
];

export function ServicesGrid({
  id,
  title,
  description,
  services,
  cta,
  labels,
}: ServicesGridProps) {
  const gridCta = cta ?? {
    id: "services-all",
    label: labels.allServices,
    href: "/epemvaseis",
    variant: "primary",
  };
  const heading = title ?? labels.defaultTitle;

  return (
    <section id={id} className="bg-[#fffdf8] py-14 sm:py-20 lg:py-28">
      <div className="site-container">
        <div className="mb-10 grid gap-6 sm:mb-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal variant="stagger" className="max-w-2xl">
            <Reveal as="p" className="section-kicker">{labels.kicker}</Reveal>
            <Reveal as="h2" className="mt-4 text-balance text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.03em] text-[#201b17] sm:text-5xl md:text-6xl">
              <HighlightedText text={heading} highlight={labels.highlight} />
            </Reveal>
            <Reveal as="p" className="mt-6 max-w-xl text-base leading-7 text-[#6d6156]">
              {description ?? labels.description}
            </Reveal>
          </Reveal>
          <Reveal variant="panel" delay={0.12}>
            <AnimatedButton href={gridCta.href}>
              {gridCta.label}
            </AnimatedButton>
          </Reveal>
        </div>

        <ScrollLinkedTrack className="motion-safe:will-change-transform">
          <Reveal variant="stagger" className="grid gap-7 lg:grid-cols-2" childVariant="card">
            {services.map((service, index) => (
              <Reveal
                as="article"
                key={service.id}
                className={`${PANEL_TONES[index % PANEL_TONES.length]} premium-hover-surface grid gap-6 overflow-hidden rounded-[1rem] p-5 sm:min-h-[320px] sm:gap-8 sm:rounded-[1.25rem] sm:p-7 md:grid-cols-[0.65fr_1fr] md:p-9`}
              >
                <div className="flex flex-col justify-between gap-8">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#201b17] sm:text-2xl">
                      {service.shortTitle ?? service.title}
                    </h3>
                    <p className="mt-4 text-sm font-medium leading-6 text-[#6d6156]">
                      {service.summary}
                    </p>
                    <AnimatedButton
                      href={service.cta.href}
                      variant="outline"
                      className="mt-7 h-11 px-5"
                    >
                      {labels.viewDetails}
                    </AnimatedButton>
                  </div>
                </div>

                <AnimatedImageReveal
                  className="aspect-[5/4] min-h-[210px] rounded-[0.85rem] sm:min-h-[250px] sm:rounded-[1rem]"

                  delay={index * 0.1}
                  variant="subtle"
                >
                  <Image src={service.image.src} alt={service.image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 320px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#201b17]/52 via-[#201b17]/8 to-white/12" />
                  <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 sm:inset-x-5 sm:bottom-5 sm:gap-3">
                    {service.highlights.slice(0, 4).map((highlight) => (
                      <span
                        className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#201b17] backdrop-blur"
                        key={highlight}
                      >
                        <CheckCircle2 className="size-4 fill-[#282018] text-white" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </AnimatedImageReveal>
              </Reveal>
            ))}
          </Reveal>
        </ScrollLinkedTrack>
      </div>
    </section>
  );
}
