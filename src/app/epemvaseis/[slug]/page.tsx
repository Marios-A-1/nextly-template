import Link from "next/link";
import { notFound } from "next/navigation";

import { MainContainer, PageRoot } from "@/src/components/PageLayout";
import { Epemvaseis } from "@/src/data/epemvaseis";

type ProcedurePageProps = {
  params: { slug: string };
  searchParams?: { cat?: string; sub?: string; q?: string };
};

type DoctorContentBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "spacer"; size?: "sm" | "md" | "lg" };

type DoctorContentSection = {
  id: string;
  title?: string | null;
  blocks: DoctorContentBlock[];
};

type LegacyCard = {
  title?: string | null;
  content: string[];
};

type LegacyContentChunk =
  | { type: "text"; title?: string | null; content: string[] }
  | { type: "list"; title?: string | null; items: string[] }
  | { type: "cardGroup"; groupTitle?: string | null; cards: LegacyCard[] }
  | { type: "infoBox"; title?: string | null; items: string[] };

type DoctorContentGroup = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  heading?: string | null;
  sections?: DoctorContentSection[];
  blocks?: LegacyContentChunk[];
};

const spacerSizes: Record<string, string> = {
  sm: "h-4",
  md: "h-6",
  lg: "h-10"
};

const ProcedureSectionCard = ({
  section,
  parentTitle
}: {
  section: DoctorContentSection;
  parentTitle?: string | null;
}) => (
  <article className="space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm">
    {section.title && section.title !== parentTitle ? (
      <h3 className="text-lg font-semibold text-text">{section.title}</h3>
    ) : null}
    <div className="space-y-4 text-sm leading-relaxed text-muted">
      {section.blocks.map((block, index) => {
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
              className={`${listClass} space-y-2 pl-5 text-sm leading-relaxed text-muted`}
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Tag>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={`${section.id}-quote-${index}`}
              className="rounded border-l-4 border-primary pl-4 italic text-sm text-muted"
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
  </article>
);

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

const buildBackQuery = (searchParams?: { cat?: string; sub?: string; q?: string }) => {
  const params = new URLSearchParams();
  if (searchParams?.cat) params.set("cat", searchParams.cat);
  if (searchParams?.sub) params.set("sub", searchParams.sub);
  if (searchParams?.q) params.set("q", searchParams.q);
  if (params.toString()) params.set("step", "3");
  return params.toString();
};

export default function ProcedurePage({ params, searchParams }: ProcedurePageProps) {
  const procedure = Epemvaseis.find((item) => item.slug === params.slug);

  if (!procedure) {
    notFound();
  }

  const backQuery = buildBackQuery(searchParams);
  const backHref = backQuery ? `/epemvaseis?${backQuery}` : "/epemvaseis";
  const docContent = procedure.doctorContent;
  const groups = docContent?.groups as DoctorContentGroup[] | undefined;

  const isLegacyChunks = (value?: unknown): value is LegacyContentChunk[] =>
    Array.isArray(value) && value.length > 0 && value.every((item) => !!item && typeof (item as LegacyContentChunk).type === "string");

  const docSectionsCandidate = docContent?.sections;
  const doctorSections =
    !groups?.length && docSectionsCandidate
      ? isLegacyChunks(docSectionsCandidate)
        ? convertLegacyChunksToSections(
            docSectionsCandidate,
            procedure.title ?? procedure.id ?? procedure.slug,
            `${procedure.id ?? procedure.slug}-doctor`
          )
        : (docSectionsCandidate as DoctorContentSection[])
      : undefined;

  const rootSections =
    !groups?.length && !doctorSections?.length && isLegacyChunks(procedure.sections)
      ? convertLegacyChunksToSections(
          procedure.sections,
          procedure.title ?? procedure.id ?? procedure.slug,
          `${procedure.id ?? procedure.slug}-root`
        )
      : undefined;

  const fallbackSections =
    doctorSections?.length ? doctorSections : rootSections?.length ? rootSections : undefined;

  return (
    <PageRoot>
      <MainContainer className="py-12 lg:py-16">
        <Link href={backHref} className="text-sm font-semibold text-primary">
          ← Πίσω στις επεμβάσεις
        </Link>

        <div className="mt-6 flex h-60 w-full items-center justify-center rounded-2xl border border-border bg-muted/10 text-xs font-semibold uppercase tracking-wide text-muted">
          Placeholder
        </div>

        <div className="mt-6 space-y-4">
          <h1 className="text-4xl font-semibold text-text">{procedure.title}</h1>
          <p className="max-w-2xl text-base text-muted">{procedure.shortDesc}</p>
        </div>

        {procedure.overviewBullets?.length ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-text">Γρήγορη επισκόπηση</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {procedure.overviewBullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-10 space-y-6">
          {groups
            ? groups.map((group, groupIndex) => {
                const groupTitle = group.title ?? group.heading ?? null;
                const sections = getGroupSections(group, groupIndex);
                if (!sections.length) return null;
                return (
                  <section
                    key={group.id ?? `${groupTitle ?? "group"}-${groupIndex}`}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      {groupTitle ? (
                        <h2 className="text-2xl font-semibold text-text">{groupTitle}</h2>
                      ) : null}
                      {group.subtitle ? (
                        <p className="text-sm leading-relaxed text-muted">{group.subtitle}</p>
                      ) : null}
                    </div>
                    <div className="space-y-6">
                      {sections.map((section) => (
                        <ProcedureSectionCard
                          key={section.id}
                          section={section}
                          parentTitle={groupTitle}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            : fallbackSections?.map((section) => (
                <ProcedureSectionCard key={section.id} section={section} />
              ))}
          <article className="space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-text">Θέλετε να το συζητήσουμε;</h3>
            <p className="text-sm leading-relaxed text-muted">
              Συμπληρώστε τα στοιχεία σας και η ομάδα μας θα επικοινωνήσει μαζί σας.
            </p>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-text transition hover:brightness-95"
            >
              Επικοινωνία
            </Link>
          </article>
        </div>
      </MainContainer>
    </PageRoot>
  );
}
