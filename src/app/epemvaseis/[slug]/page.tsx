import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { ContactChoiceButton } from "@/components/common/ContactChoiceModal";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/sections/FAQ";
import { Reveal } from "@/components/sections/Reveal";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { buildEpemvaseisHref } from "@/content/breadcrumbs";
import { Epemvaseis } from "@/content/epemvaseis";
import { getEpemvaseisCategorySlugByLabel } from "@/content/epemvaseisCategories";
import { getFaqs, getServices, getSectionContent, getSiteContent } from "@/content/localized";
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

  const fromTreatmentList = query.step === "3" || typeof query.cat === "string";
  const category = fromTreatmentList ? query.cat : procedure.category;
  const subcategory = fromTreatmentList
    ? query.sub
    : procedure.subcategory && getEpemvaseisCategorySlugByLabel(procedure.subcategory);
  const backHref = typeof category === "string"
    ? buildEpemvaseisHref({ category, subcategory: typeof subcategory === "string" ? subcategory : undefined, step: 3 })
    : "/epemvaseis";
  const image = procedureImages[slug] ?? "/img/categories/AisthitikiXeirourgiki.webp";
  const relatedSlugs = Epemvaseis
    .filter((item) => item.category === procedure.category && item.slug !== slug)
    .slice(0, 2).map((item) => item.slug);
  const sections = getSectionContent();
  const highlights = procedure.overviewBullets ?? [];

  return (
    <div className="reference-page">
      <section className="-mt-[64px] bg-espresso pt-[64px] text-white sm:-mt-[68px] sm:pt-[68px]">
        <div className="site-container py-14 sm:py-16 lg:py-24">
          <Reveal variant="panel">
            <Link data-treatment-back="true" href={backHref} className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/85 hover:text-white">
              <ArrowLeft className="size-4" aria-hidden="true" /> Επιστροφή στις επεμβάσεις
            </Link>
          </Reveal>
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1fr] lg:items-end">
            <Reveal variant="stagger" className="space-y-5">
              <Reveal as="p" className="section-kicker border border-white/20 bg-white/8 text-gold">{procedure.category}</Reveal>
              <Reveal as="h1" className="text-balance text-[2.65rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">{procedure.title}</Reveal>
              <Reveal as="p" className="text-base font-semibold leading-7 text-white/85">{procedure.shortDesc}</Reveal>
              <ContactChoiceButton variant="light">Κλείστε ραντεβού</ContactChoiceButton>
            </Reveal>
            <AnimatedImageReveal className="aspect-[4/3] rounded-xl bg-[#efe7d8]" variant="subtle">
              <Image src={image} alt={procedure.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </AnimatedImageReveal>
          </div>
        </div>
      </section>
      <section id="treatment-information" className="bg-background py-14 sm:py-20" aria-labelledby="treatment-information-heading">
        <div className="site-container space-y-8">
          <Reveal variant="panel">
            <h2 id="treatment-information-heading" className="text-balance text-[2.35rem] font-semibold tracking-tight sm:text-5xl">
              Πληροφορίες για την επέμβαση
            </h2>
          </Reveal>
          {highlights.length > 0 && (
            <Reveal as="ul" variant="stagger" childVariant="card" className="grid gap-4 md:grid-cols-2">
              {highlights.map((item) => (
                <Reveal as="li" key={item} className="premium-hover-surface rounded-xl border border-border bg-white p-5 sm:p-6">
                  <CheckCircle2 className="size-5 text-bronze" aria-hidden="true" />
                  <p className="mt-3 font-semibold leading-7">{item}</p>
                </Reveal>
              ))}
            </Reveal>
          )}
          <ProcedureContent procedure={procedure} />
        </div>
      </section>
      <FAQ id="treatment-faq" faqs={getFaqs()} labels={sections.faq} />
      {relatedSlugs.length > 0 && (
        <ServicesGrid labels={sections.servicesGrid} services={getServices().filter((item) => relatedSlugs.includes(item.slug))} title="Σχετικές επεμβάσεις" />
      )}
      <CTA ctaButtons={getSiteContent().ctas} labels={sections.cta} title="Έχετε ερωτήσεις;" />
    </div>
  );
}
