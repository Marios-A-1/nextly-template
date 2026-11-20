import { CheckCircle2 } from "lucide-react";
import { Reveal } from "./Reveal";
import type {
  DoctorContentBlock,
  DoctorContentGroup,
  DoctorContentSection,
  LegacyContentChunk,
  Procedure,
} from "@/content/epemvaseis";

const spacerSizes: Record<string, string> = {
  sm: "h-4",
  md: "h-6",
  lg: "h-10"
};

const ProcedureSectionCard = ({
  section,
  parentTitle,
}: {
  section: DoctorContentSection;
  parentTitle?: string | null;
}) => {
  const renderableBlocks = section.blocks.filter(
    (block) =>
      block.type === "p" ||
      block.type === "ul" ||
      block.type === "ol" ||
      block.type === "quote" ||
      block.type === "spacer" ||
      block.type === "video"
  );

  if (!renderableBlocks.length) {
    return null;
  }

  const displayTitle = section.title === parentTitle ? null : section.title;
  const hasVideo = renderableBlocks.some((block) => block.type === "video");

  return (
    <Reveal
      as="article"
      variant="card"
      className={`premium-hover-surface min-w-0 rounded-[0.8rem] border border-border bg-white p-5 shadow-sm sm:p-7 ${hasVideo ? "md:col-span-2" : ""}`}
    >
      <CheckCircle2 className="mb-4 size-5 text-bronze" aria-hidden="true" />
      {displayTitle && <h3 className="mb-3 text-lg font-semibold text-foreground">{displayTitle}</h3>}
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        {renderableBlocks.map((block, index) => {
          if (block.type === "p") {
            return (
              <p key={`${section.id}-p-${index}`} className="leading-relaxed">
                {block.text}
              </p>
            );
          }
          if (block.type === "ul" || block.type === "ol") {
            const Tag = block.type === "ul" ? "ul" : "ol";
            const listClass = block.type === "ul" ? "list-disc" : "list-decimal";
            return (
              <Tag
                key={`${section.id}-${block.type}-${index}`}
                className={`${listClass} list-inside space-y-2 text-sm leading-relaxed text-muted-foreground`}
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </Tag>
            );
          }
          if (block.type === "video") {
            const title = block.title ?? "Video";
            return (
              <div key={`${section.id}-video-${index}`} className="mx-auto w-full max-w-2xl space-y-2">
                <div className="aspect-video w-full overflow-hidden rounded-lg border-0 bg-transparent">
                  <iframe
                    title={title}
                    loading="lazy"
                    src={block.url}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          }
          if (block.type === "quote") {
            return (
              <blockquote
                key={`${section.id}-quote-${index}`}
                className="italic text-sm text-muted-foreground"
              >
                {block.text}
              </blockquote>
            );
          }
          if (block.type === "spacer") {
            const size = block.size ?? "md";
            return <div key={`${section.id}-spacer-${index}`} className={spacerSizes[size]} />;
          }
          return null;
        })}
      </div>
    </Reveal>
  );
};

const ProcedureSectionGrid = ({
  sections,
  parentTitle,
  headerTitle,
  headerSubtitle
}: {
  sections: DoctorContentSection[];
  parentTitle?: string | null;
  headerTitle?: string | null;
  headerSubtitle?: string | null;
}) => {
  return (
    <div className="space-y-5">
      {headerTitle && (
        <Reveal as="h3" variant="panel" className="text-balance text-2xl font-semibold tracking-tight">
          {headerTitle}
        </Reveal>
      )}
      {headerSubtitle && <p className="text-muted-foreground">{headerSubtitle}</p>}
      <div data-treatment-card-grid="true">
        <Reveal variant="stagger" childVariant="card" className="grid items-start gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <ProcedureSectionCard key={section.id} section={section} parentTitle={parentTitle} />
          ))}
        </Reveal>
      </div>
    </div>
  );
};

const convertLegacyChunkToSections = (
  chunk: LegacyContentChunk,
  fallbackTitle: string | null | undefined,
  baseId: string
): DoctorContentSection[] => {
  const fallback =
    chunk.type === "cardGroup"
      ? chunk.groupTitle ?? fallbackTitle
      : chunk.title ?? fallbackTitle;

  const createParagraph = (text: string): DoctorContentBlock => ({
    type: "p",
    text
  });

  switch (chunk.type) {
    case "text": {
      const blocks = chunk.content.map(createParagraph);
      return blocks.length
        ? [{ id: `${baseId}-text`, title: fallback, blocks }]
        : [];
    }
    case "list": {
      if (!chunk.items.length) return [];
      return [
        {
          id: `${baseId}-list`,
          title: fallback,
          blocks: [{ type: "ul", items: chunk.items }]
        }
      ];
    }
    case "cardGroup": {
      return chunk.cards.map((card, cardIndex) => ({
        id: `${baseId}-card-${cardIndex}`,
        title: card.title ?? chunk.groupTitle ?? fallback,
        blocks: card.content.map(createParagraph)
      }));
    }
    case "infoBox": {
      if (!chunk.items.length) return [];
      return [
        {
          id: `${baseId}-info`,
          title: chunk.title ?? fallback,
          blocks: [{ type: "ul", items: chunk.items }]
        }
      ];
    }
    default:
      return [];
  }
};

const convertLegacyChunksToSections = (
  chunks: LegacyContentChunk[] | undefined,
  fallbackTitle: string | null | undefined,
  baseId: string
): DoctorContentSection[] => {
  if (!chunks?.length) return [];
  return chunks.flatMap((chunk, index) =>
    convertLegacyChunkToSections(chunk, fallbackTitle, `${baseId}-chunk-${index}`)
  );
};

const getGroupSections = (group: DoctorContentGroup, index: number): DoctorContentSection[] => {
  if (group.sections?.length) return group.sections;
  const fallbackTitle = group.title ?? group.heading ?? null;
  const baseId = group.id ?? `group-${index}`;
  return convertLegacyChunksToSections(group.blocks, fallbackTitle, baseId);
};

export function ProcedureContent({ procedure }: { procedure: Procedure }) {
  const doctorSections = convertLegacyChunksToSections(
    procedure.doctorContent?.sections, procedure.title, `${procedure.id}-doctor`,
  );
  const rootSections = convertLegacyChunksToSections(
    procedure.sections, procedure.title, `${procedure.id}-root`,
  );
  const groups = procedure.doctorContent?.groups ?? [];

  return (
    <div className="space-y-8">
      {groups.map((group, index) => {
        const title = group.title ?? group.heading ?? null;
        return (
          <ProcedureSectionGrid
            key={group.id ?? index}
            sections={getGroupSections(group, index)}
            parentTitle={title}
            headerTitle={title === procedure.title ? null : title}
            headerSubtitle={group.subtitle}
          />
        );
      })}
      {groups.length === 0 && (
        <ProcedureSectionGrid sections={doctorSections.length ? doctorSections : rootSections} parentTitle={procedure.title} />
      )}
    </div>
  );
}
