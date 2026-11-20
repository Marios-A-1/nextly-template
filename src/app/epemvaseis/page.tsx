import type { Metadata } from "next";
import Link from "next/link";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/sections/FAQ";
import { SecondaryPageHero } from "@/components/sections/ReferenceSections";
import { Reveal } from "@/components/sections/Reveal";
import { ServicesAccordion } from "@/components/sections/ServicesAccordion";
import { Epemvaseis } from "@/content/epemvaseis";
import { getEpemvaseisCategorySlugByLabel } from "@/content/epemvaseisCategories";
import { buildEpemvaseisHref, buildEpemvaseisQuery } from "@/content/breadcrumbs";
import { getFaqs, getMetadataContent, getSectionContent, getServices, getSiteContent } from "@/content/localized";
import { toAbsoluteSiteUrl } from "@/lib/siteUrl";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const categories = [
  { title: "Αισθητική Χειρουργική", description: "Επεμβάσεις για ανανέωση και αρμονία." },
  { title: "Επανορθωτική Χειρουργική", description: "Αποκατάσταση μορφής και λειτουργίας." },
  { title: "Μή Επεμβατικές Θεραπείες", description: "Στοχευμένες θεραπείες χωρίς χειρουργείο." },
];

function FilterLink({ href, selected, children }: { href: string; selected: boolean; children: string }) {
  return (
    <Link
      aria-current={selected ? "page" : undefined}
      className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${selected ? "border-gold bg-gold text-espresso" : "border-white/35 text-white hover:bg-white/15"}`}
      href={href}
      scroll={false}
    >
      {children}
    </Link>
  );
}

export function generateMetadata(): Metadata {
  return {
    ...getMetadataContent().services,
    alternates: { canonical: toAbsoluteSiteUrl("/epemvaseis") },
  };
}

export default async function TreatmentsPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const category = categories.find(({ title }) => title === query.cat);
  const procedures = category ? Epemvaseis.filter((item) => item.category === category.title) : Epemvaseis;
  const subcategories = category
    ? [...new Set(procedures.flatMap((item) => item.subcategory ? [item.subcategory] : []))]
      .map((label) => ({ label, slug: getEpemvaseisCategorySlugByLabel(label) ?? label }))
    : [];
  const subcategory = subcategories.find(({ slug, label }) => slug === query.sub || label === query.sub);
  const visibleSlugs = new Set(procedures.filter((item) => !subcategory || item.subcategory === subcategory.label).map((item) => item.slug));
  const detailQuery = buildEpemvaseisQuery({
    category: category?.title, subcategory: subcategory?.slug, step: 3,
  });
  const services = getServices().filter(({ slug }) => visibleSlugs.has(slug)).map((service) => ({
    ...service,
    cta: { ...service.cta, href: `${service.cta.href}?${detailQuery}` },
  }));
  const labels = getSectionContent();

  return (
    <div className="reference-page">
      <SecondaryPageHero
        title={subcategory?.label ?? category?.title ?? "Επεμβάσεις"}
        description={category?.description ?? "Επιλέξτε κατηγορία για να δείτε τις διαθέσιμες επεμβάσεις και θεραπείες."}
        appointment
      />
      <section className="dark-gold-slab py-14 sm:py-20 lg:py-28" aria-labelledby="treatment-list-title">
        <div className="site-container">
          <Reveal variant="stagger" className="mb-9 space-y-5 sm:mb-12">
            {category && (
              <nav aria-label="Διαδρομή πλοήγησης" className="flex flex-wrap gap-2 text-sm text-white/85">
                <Link href="/epemvaseis" className="underline underline-offset-4">Όλες οι επεμβάσεις</Link>
                <span aria-hidden="true">/</span>
                {subcategory ? (
                  <>
                    <Link href={buildEpemvaseisHref({ category: category.title, step: 2 })} className="underline underline-offset-4">
                      {category.title}
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">{subcategory.label}</span>
                  </>
                ) : <span aria-current="page">{category.title}</span>}
              </nav>
            )}
            <h2 id="treatment-list-title" className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Επεμβάσεις και θεραπείες</h2>
            <nav aria-label="Κατηγορίες επεμβάσεων" className="flex flex-wrap gap-2">
              <FilterLink href="/epemvaseis" selected={!category}>Όλες</FilterLink>
              {categories.map(({ title }) => (
                <FilterLink key={title} href={buildEpemvaseisHref({ category: title, step: 2 })} selected={category?.title === title}>{title}</FilterLink>
              ))}
            </nav>
            {category && subcategories.length > 1 && (
              <nav aria-label="Περιοχές επέμβασης" className="flex flex-wrap gap-2">
                <FilterLink href={buildEpemvaseisHref({ category: category.title, step: 2 })} selected={!subcategory}>Όλες οι περιοχές</FilterLink>
                {subcategories.map(({ label, slug }) => (
                  <FilterLink key={slug} href={buildEpemvaseisHref({ category: category.title, subcategory: slug, step: 3 })} selected={subcategory?.slug === slug}>{label}</FilterLink>
                ))}
              </nav>
            )}
          </Reveal>
          <ServicesAccordion key={`${category?.title ?? ""}/${subcategory?.slug ?? ""}`} services={services} />
        </div>
      </section>
      <FAQ faqs={getFaqs()} labels={labels.faq} />
      <CTA ctaButtons={getSiteContent().ctas} labels={labels.cta} title="Συζητήστε τις επιλογές σας" />
    </div>
  );
}
