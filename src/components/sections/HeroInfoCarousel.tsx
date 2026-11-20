import {
  CalendarDays,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { type HeroInfoItem } from "@/types/content";

type HeroInfoCarouselProps = {
  items: HeroInfoItem[];
};

function InfoIcon({
  className,
  iconName,
}: {
  className: string;
  iconName: HeroInfoItem["iconName"];
}) {
  const normalizedIconName = iconName.toLowerCase();

  switch (normalizedIconName) {
    case "shield":
      return <ShieldCheck className={className} />;
    case "calendar":
      return <CalendarDays className={className} />;
    case "heart":
      return <HeartHandshake className={className} />;
    default:
      return <Stethoscope className={className} />;
  }
}

function HeroInfoCard({
  item,
  index,
  mode,
}: {
  item: HeroInfoItem;
  index: number;
  mode: "mobile" | "desktop";
}) {
  const isMobile = mode === "mobile";

  return (
    <div
      aria-roledescription={isMobile ? "slide" : undefined}
      className={
        isMobile
          ? "min-w-[min(82vw,19rem)] snap-center rounded-[1.1rem] border border-white/18 bg-white/14 p-4 shadow-[0_22px_70px_rgba(40,32,24,0.24)] backdrop-blur-xl motion-safe:animate-[heroInfoItemIn_0.82s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none sm:min-w-[18rem]"
          : "min-w-0 border-white/18 bg-transparent px-6 py-5 motion-safe:animate-[heroInfoItemIn_0.82s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none md:first:border-l md:last:border-r lg:px-7 lg:py-6"
      }
      data-hero-info-card={item.id}
      style={{ animationDelay: `${0.72 + index * 0.12}s` }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <InfoIcon
          className="mt-1 size-6 shrink-0 text-white sm:size-8 md:size-9"
          iconName={item.iconName}
        />
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl md:text-2xl">
            {item.title}
          </h2>
          <p className="mt-2 max-w-xs text-sm font-medium leading-6 text-white/84 md:mt-3 md:text-base md:leading-7">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HeroInfoCarousel({ items }: HeroInfoCarouselProps) {
  const staticItems = items.slice(0, 3);

  return (
    <div
      className="site-container -mb-4 pb-1 motion-safe:animate-[heroInfoSurfaceIn_0.74s_cubic-bezier(0.22,1,0.36,1)_0.48s_both] motion-reduce:animate-none md:border-y md:border-white/22 md:bg-white/12 md:pb-0 md:backdrop-blur-md"
      data-hero-info-surface
    >
      <div data-hero-info-list>
        <div
          aria-label="Πληροφορίες κλινικής"
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden"
          data-hero-info-cards
        >
          {staticItems.map((item, index) => (
            <HeroInfoCard
              index={index}
              item={item}
              key={item.id}
              mode="mobile"
            />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/18 md:overflow-visible">
          {staticItems.map((item, index) => (
            <HeroInfoCard
              index={index}
              item={item}
              key={item.id}
              mode="desktop"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
