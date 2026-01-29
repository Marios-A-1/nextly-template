import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MainContainer, PageRoot } from "@/src/components/PageLayout";
import { Epemvaseis } from "@/src/data/epemvaseis";
import type {
  Procedure,
  DoctorContentBlock,
  DoctorContentSection,
  DoctorContentGroup,
  LegacyContentChunk
} from "@/src/data/epemvaseis";
import { getEpemvaseisCategoryLabelBySlug } from "../epemvaseisCategories";
import { buildEpemvaseisHref } from "../breadcrumbs";
import EpemvaseisBreadcrumb from "../components/EpemvaseisBreadcrumb";
import { ContactModalTrigger } from "@/src/components/ContactModalTrigger";

type ProcedurePageProps = {
  params: { slug: string };
  searchParams?: { cat?: string; sub?: string; q?: string };
};

type LegacyCard = {
  title?: string | null;
  content: string[];
};

type DoctorContentData = {
  groups?: DoctorContentGroup[];
  sections?: LegacyContentChunk[];
};

const spacerSizes: Record<string, string> = {
  sm: "h-4",
  md: "h-6",
  lg: "h-10"
};

const procedureImages: Record<string, string> = {
  "face-lift": "/img/epemvasis/facelift.webp",
  "blefaroplastiki": "/img/epemvasis/blepharoplastiki.webp",
  "vrachioplastiki": "/img/epemvasis/Brachioplasty.webp",
  "otoplastiki": "/img/epemvasis/otoplastiki.webp",
  "kilioplastiki": "/img/epemvasis/Abdominoplasty.webp",
  "lipoanarr-ofisi": "/img/epemvasis/Liposuction.webp",
  "anorthosi-glouton": "/img/epemvasis/ButtockLift.webp",
  "anorthosi-miron": "/img/epemvasis/ThighLift.webp",
  "crisalix-4d": "/img/epemvasis/BreastAugmentation.webp",
  "anorthosi-stithous": "/img/epemvasis/BreastLift.webp",
  "meiwtiki-stithous": "/img/epemvasis/BreastReduction.webp",
  "gynaikomastia": "/img/epemvasis/Gynecomastia.webp",
  "melanoma": "/img/epemvasis/Melanoma.webp",
  "kakoitheies-dermatos": "/img/epemvasis/SkinMalignancies.webp",
  "antigiransi-xerion": "/img/epemvasis/Anti-Aging-Hands.webp",
  "botox-dysport": "/img/epemvasis/Botox.webp",
  "egkavmata": "/img/epemvasis/Burns.webp",
  "antimetopisi-kyttaritidas": "/img/epemvasis/Cellulite.webp",
  "antimetopisi-evryaggeion": "/img/epemvasis/varicoseVeins.webp",
  "antimetopisi-kilidon": "/img/epemvasis/StainTreatment.webp",
  "afairesi-tatouaz": "/img/epemvasis/TatooRemoval.webp",
  "mesotherapeia-prosopou": "/img/epemvasis/FacialMesotherapy.webp",
  "enesimi-lipodialysi": "/img/epemvasis/Injectable-Lipolysis.webp",
  "laser-apotrichosi": "/img/epemvasis/LaserHairRemoval.webp",
  "lifting-me-nimata": "/img/epemvasis/ThreadLifting.webp",
  "yalouroniko-oxy": "/img/epemvasis/Hyaluronic.webp"
};

const ProcedureSectionCard = ({
  section,
  parentTitle,
  headerTitle,
  headerSubtitle
}: {
  section: DoctorContentSection;
  parentTitle?: string | null;
  headerTitle?: string | null;
  headerSubtitle?: string | null;
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

  const displayTitle =
    headerTitle ?? (section.title && section.title !== parentTitle ? section.title : null);
  const displaySubtitle = headerSubtitle ?? null;

  return (
    <article className="w-full rounded-xl border border-border bg-card p-6 text-center shadow-sm lg:w-[60%] lg:mx-auto">
      {displayTitle ? (
        <div className="space-y-2">
          <h3 className="text-center px-8 mb-4 text-lg font-semibold text-text">
            {displayTitle}
          </h3>
          {displaySubtitle ? (
            <p className="text-sm leading-relaxed text-muted text-center">
              {displaySubtitle}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="space-y-4 px-8 text-sm leading-relaxed text-muted text-center md:px-8">
        {renderableBlocks.map((block, index) => {
          if (block.type === "p") {
            return (
              <p key={`${section.id}-p-${index}`} className="leading-relaxed text-center">
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
                className={`${listClass} list-inside space-y-2 text-sm leading-relaxed text-muted text-center`}
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
                className="italic text-sm text-muted"
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
};

const ProcedureSectionMasonry = ({
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
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <ProcedureSectionCard
          key={section.id}
          section={section}
          parentTitle={parentTitle}
          headerTitle={sectionIndex === 0 ? headerTitle : null}
          headerSubtitle={sectionIndex === 0 ? headerSubtitle : null}
        />
      ))}
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

const buildBackQuery = (searchParams?: { cat?: string; sub?: string; q?: string }) => {
  const params = new URLSearchParams();
  if (searchParams?.cat) params.set("cat", searchParams.cat);
  if (searchParams?.sub) params.set("sub", searchParams.sub);
  if (searchParams?.q) params.set("q", searchParams.q);
  if (params.toString()) params.set("step", "3");
  return params.toString();
};

type ProcedureHeaderTextProps = {
  title?: string | null;
  shortDesc?: string | null;
  className?: string;
  mobile?: boolean;
};

const ProcedureHeaderText = ({
  title,
  shortDesc,
  className,
  mobile
}: ProcedureHeaderTextProps) => {
  if (!title && !shortDesc) {
    return null;
  }

  const containerClass = ["space-y-3", className].filter(Boolean).join(" ");
  const alignClass = "text-center";
  const headingClass = [
    `${alignClass} text-4xl font-semibold`,
    mobile ? "text-white" : "text-text"
  ].join(" ");
  const descriptionClass = [
    `${alignClass} text-base leading-relaxed`,
    mobile ? "text-white/90" : "text-muted"
  ].join(" ");

  return (
    <div className={containerClass}>
      {title ? <h1 className={headingClass}>{title}</h1> : null}
      {/* {shortDesc ? <p className={descriptionClass}>{shortDesc}</p> : null} */}
    </div>
  );
};

export default function ProcedurePage({ params, searchParams }: ProcedurePageProps) {
  const procedure = Epemvaseis.find((item) => item.slug === params.slug);

  if (!procedure) {
    notFound();
  }

  const backQuery = buildBackQuery(searchParams);
  const backHref = backQuery ? `/epemvaseis?${backQuery}` : "/epemvaseis";
  const categoryQueryLabel = searchParams?.cat ?? null;
  const subcategorySlug = searchParams?.sub ?? null;
  const hasCategoryBreadcrumb = Boolean(categoryQueryLabel);

  const breadcrumbCategoryLabel = hasCategoryBreadcrumb
    ? procedure.category ?? categoryQueryLabel
    : null;
  const breadcrumbSubcategoryLabel = hasCategoryBreadcrumb
    ? procedure.subcategory ??
      (subcategorySlug
        ? getEpemvaseisCategoryLabelBySlug(subcategorySlug) ?? subcategorySlug
        : null)
    : null;
  const breadcrumbCategoryHref = breadcrumbCategoryLabel
    ? buildEpemvaseisHref({
        category: breadcrumbCategoryLabel,
        step: breadcrumbSubcategoryLabel ? 2 : 1
      })
    : "/epemvaseis";
  const breadcrumbSubcategoryHref =
    breadcrumbSubcategoryLabel && subcategorySlug
      ? buildEpemvaseisHref({
          category: breadcrumbCategoryLabel ?? undefined,
          subcategory: subcategorySlug,
          step: 2
        })
      : undefined;
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
    !groups?.length &&
    !doctorSections?.length &&
    isLegacyChunks(procedure.sections)
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
        <div className="flex w-full justify-start text-sm">
          <Link
            href={backHref}
            className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-semibold text-text transition hover:border-primary"
          >
            Πίσω
          </Link>
        </div>

        {hasCategoryBreadcrumb ? (
          <div className="mt-3 rounded-2xl px-4 py-4">
            <EpemvaseisBreadcrumb
              categoryLabel={breadcrumbCategoryLabel ?? ""}
              categoryHref={breadcrumbCategoryHref}
              subcategoryLabel={breadcrumbSubcategoryLabel}
              subcategoryHref={breadcrumbSubcategoryHref}
              highlightLabel={breadcrumbSubcategoryLabel ?? breadcrumbCategoryLabel ?? undefined}
            />
          </div>
        ) : null}

        <div className="mt-6">
          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-border bg-muted/10 lg:mx-auto lg:w-[60%]">
            {procedureImages[procedure.slug] ? (
              <Image
                src={procedureImages[procedure.slug]}
                alt={procedure.title ?? procedure.slug}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full min-h-[260px] w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-muted">
                Placeholder
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center px-6 py-6">
              <div className="w-full">
                <ProcedureHeaderText
                  title={procedure.title}
                  shortDesc={procedure.shortDesc}
                  mobile
                />
              </div>
            </div>
          </div>
        </div>

        {procedure.overviewBullets?.length ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-center text-lg font-semibold text-text">
              Γρήγορη επισκόπηση
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {procedure.overviewBullets.map((bullet: string) => (
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
                    <ProcedureSectionMasonry
                      sections={sections}
                      parentTitle={groupTitle}
                      headerTitle={groupTitle}
                      headerSubtitle={group.subtitle}
                    />
                  </section>
                );
              })
            : fallbackSections ? (
                <ProcedureSectionMasonry sections={fallbackSections} />
              ) : null}
          <article className="w-full space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm lg:w-[60%] lg:mx-auto">
            <h3 className="text-center text-lg font-semibold text-text">
              Θέλετε να το συζητήσουμε;
            </h3>
            <p className="text-sm leading-relaxed text-center text-muted">
              Συμπληρώστε τα στοιχεία σας και η ομάδα μας θα επικοινωνήσει μαζί σας.
            </p>
            <ContactModalTrigger className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-text transition hover:brightness-95">
              Επικοινωνία
            </ContactModalTrigger>
          </article>
        </div>
      </MainContainer>
    </PageRoot>
  );
}
