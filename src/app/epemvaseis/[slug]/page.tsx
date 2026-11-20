import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal";
import { CTA } from "@/components/sections/CTA";
import { Reveal } from "@/components/sections/Reveal";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { buildEpemvaseisHref } from "@/content/breadcrumbs";
import { Epemvaseis } from "@/content/epemvaseis";
import { getEpemvaseisCategorySlugByLabel } from "@/content/epemvaseisCategories";
import { getServices, getSectionContent, getSiteContent } from "@/content/localized";
import { procedureImages } from "@/content/procedureImages";
import { toAbsoluteSiteUrl } from "@/lib/siteUrl";
import { ProcedureContent } from "@/components/sections/ProcedureContent";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Epemvaseis.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const procedure = Epemvaseis.find((item) => item.slug === slug);
  if (!procedure) notFound();

  return {
    title: procedure.title,
    description: procedure.shortDesc,
    alternates: { canonical: toAbsoluteSiteUrl(`/epemvaseis/${slug}`) },
  };
}

export default async function TreatmentPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const procedure = Epemvaseis.find((item) => item.slug === slug);
  if (!procedure) notFound();

  const category = typeof query.cat === "string" ? query.cat : procedure.category;
  const subcategory = typeof query.sub === "string"
    ? query.sub
    : procedure.subcategory && getEpemvaseisCategorySlugByLabel(procedure.subcategory);
  const backHref = buildEpemvaseisHref({ category, subcategory, step: 3 });
  const image = procedureImages[slug] ?? "/img/categories/AisthitikiXeirourgiki.webp";
  const relatedSlugs = Epemvaseis
    .filter((item) => item.category === procedure.category && item.slug !== slug)
    .slice(0, 2).map((item) => item.slug);
  const sections = getSectionContent();

  return (
    <div className="reference-page">
      <section className="-mt-[68px] bg-[#282018] pt-[68px] text-white">
        <div className="site-container py-14 sm:py-20">
          <Link href={backHref} className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/85 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden="true" /> Επιστροφή στις επεμβάσεις
          </Link>
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
            <Reveal variant="stagger" className="space-y-5">
              <p className="text-sm font-semibold text-[#f2ce68]">{procedure.category}</p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">{procedure.title}</h1>
              <p className="text-lg leading-relaxed text-white/85">{procedure.shortDesc}</p>
              <ContactChoiceButton variant="light">Κλείστε ραντεβού</ContactChoiceButton>
            </Reveal>
            <AnimatedImageReveal className="aspect-[4/3] rounded-xl bg-[#efe7d8]" variant="subtle">
              <Image src={image} alt={procedure.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </AnimatedImageReveal>
          </div>
        </div>
      </section>
      <section className="site-container space-y-8 py-14 sm:py-20">
        {Boolean(procedure.overviewBullets?.length) && (
          <ul className="mx-auto max-w-3xl list-disc space-y-2 pl-6 text-muted-foreground">
            {procedure.overviewBullets?.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}
        <ProcedureContent procedure={procedure} />
      </section>
      {relatedSlugs.length > 0 && (
        <ServicesGrid labels={sections.servicesGrid} services={getServices().filter((item) => relatedSlugs.includes(item.slug))} title="Σχετικές επεμβάσεις" />
      )}
      <CTA ctaButtons={getSiteContent().ctas} labels={sections.cta} title="Έχετε ερωτήσεις;" />
    </div>
  );
}
