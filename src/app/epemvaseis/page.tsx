import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { Reveal } from "@/components/sections/Reveal";
import { Epemvaseis } from "@/content/epemvaseis";
import { getEpemvaseisCategorySlugByLabel } from "@/content/epemvaseisCategories";
import { buildEpemvaseisHref, buildEpemvaseisQuery } from "@/content/breadcrumbs";
import { getMetadataContent } from "@/content/localized";
import { procedureImages } from "@/content/procedureImages";
import { toAbsoluteSiteUrl } from "@/lib/siteUrl";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const categories = [
  { title: "Αισθητική Χειρουργική", image: "/img/categories/AisthitikiXeirourgiki.webp", description: "Επεμβάσεις για ανανέωση και αρμονία." },
  { title: "Επανορθωτική Χειρουργική", image: "/img/categories/EpanorthotikiXeirourgiki.webp", description: "Αποκατάσταση μορφής και λειτουργίας." },
  { title: "Μή Επεμβατικές Θεραπείες", image: "/img/categories/MiEpemvatikesTherapies.webp", description: "Στοχευμένες θεραπείες χωρίς χειρουργείο." },
];

const subcategoryImages: Record<string, string> = {
  prosopo: "/img/subCategories/prosopo.webp",
  soma: "/img/subCategories/soma.webp",
  stithos: "/img/subCategories/stithos.webp",
};

export function generateMetadata(): Metadata {
  return {
    ...getMetadataContent().services,
    alternates: { canonical: toAbsoluteSiteUrl("/epemvaseis") },
  };
}

export default async function TreatmentsPage({ searchParams }: PageProps) {
  const query = await searchParams;

  const category = categories.find(({ title }) => title === query.cat);
  const procedures = Epemvaseis.filter((item) => item.category === category?.title);
  const subcategories = [...new Set(procedures.flatMap((item) => item.subcategory ? [item.subcategory] : []))]
    .map((label) => ({ label, slug: getEpemvaseisCategorySlugByLabel(label) ?? label }));
  const subcategory = subcategories.find(({ slug, label }) => slug === query.sub || label === query.sub);
  const showSubcategories = subcategories.length > 1 && !subcategory;
  const treatmentQuery = buildEpemvaseisQuery({ category: category?.title, subcategory: subcategory?.slug, step: 3 });

  const cards = !category
    ? categories.map((item) => ({
      ...item, href: buildEpemvaseisHref({ category: item.title, step: 2 }),
    }))
    : showSubcategories
      ? subcategories.map(({ label, slug }) => ({
        title: label,
        description: "",
        image: subcategoryImages[slug] ?? category.image,
        href: buildEpemvaseisHref({ category: category.title, subcategory: slug, step: 3 }),
      }))
      : procedures.filter((item) => !subcategory || item.subcategory === subcategory.label).map((item) => ({
        title: item.title,
        description: item.shortDesc,
        image: procedureImages[item.slug] ?? category.image,
        href: `/epemvaseis/${item.slug}?${treatmentQuery}`,
      }));

  return (
    <div className="reference-page -mt-[68px] page-top-gradient pt-[68px]">
      <section className="site-container py-14 sm:py-20">
        <Reveal variant="stagger" className="mb-10 max-w-3xl space-y-4">
          {category && (
            <nav aria-label="Διαδρομή πλοήγησης" className="flex flex-wrap gap-2 text-sm">
              <Link href="/epemvaseis" className="underline underline-offset-4">Όλες οι επεμβάσεις</Link>
              {subcategory && (
                <>
                  <span aria-hidden="true">/</span>
                  <Link href={buildEpemvaseisHref({ category: category.title, step: 2 })} className="underline underline-offset-4">
                    {category.title}
                  </Link>
                </>
              )}
            </nav>
          )}
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {subcategory?.label ?? category?.title ?? "Επεμβάσεις"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {category?.description ?? "Επιλέξτε κατηγορία για να δείτε τις διαθέσιμες επεμβάσεις και θεραπείες."}
          </p>
        </Reveal>
        <Reveal variant="stagger" childVariant="card" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Reveal as="article" key={card.href} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <Link href={card.href} className="block h-full focus-visible:outline-2 focus-visible:outline-offset-[-3px]">
                <AnimatedImageReveal className="aspect-[5/3] bg-[#efe7d8]" variant="subtle">
                  <Image src={card.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform group-hover:scale-105" />
                </AnimatedImageReveal>
                <div className="space-y-3 p-5 sm:p-6">
                  <h2 className="flex items-start justify-between gap-3 text-xl font-semibold">
                    {card.title}
                    <ArrowRight className="mt-1 size-5 shrink-0 text-[#7a571f]" aria-hidden="true" />
                  </h2>
                  {card.description && <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>}
                </div>
              </Link>
            </Reveal>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
