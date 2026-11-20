import type { Metadata } from "next";
import Image from "next/image";
import { CTA } from "@/components/sections/CTA";
import { AboutHeroSection } from "@/components/sections/ReferenceSections";
import { Reveal } from "@/components/sections/Reveal";
import {
  getMetadataContent,
  getPageContent,
  getSectionContent,
  getSiteContent,
} from "@/content/localized";
import { biography, clinicValues } from "@/content/clinic";
import { toAbsoluteSiteUrl } from "@/lib/siteUrl";

export function generateMetadata(): Metadata {
  return {
    ...getMetadataContent().about,
    alternates: { canonical: toAbsoluteSiteUrl("/about") },
  };
}

export default function AboutPage() {
  const site = getSiteContent();
  const pages = getPageContent();
  const sections = getSectionContent();

  return (
    <div className="reference-page">
      <AboutHeroSection labels={sections.aboutHero} site={site} />
      <section className="site-container py-14 sm:py-20">
        <Reveal variant="stagger" className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
          <h2 className="text-3xl font-semibold text-foreground">Ο ιατρός</h2>
          {biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </Reveal>
      </section>
      <section className="site-container grid gap-6 pb-14 sm:grid-cols-2 sm:pb-20">
        {clinicValues.map((value) => (
          <Reveal as="article" variant="card" key={value.title} className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <Image src={value.image} alt="" width={120} height={100} className="mb-6 h-24 w-auto object-contain" />
            <h2 className="text-2xl font-semibold">{value.title}</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{value.description}</p>
          </Reveal>
        ))}
      </section>
      <CTA ctaButtons={site.ctas} labels={sections.cta} title={pages.about.ctaTitle} />
    </div>
  );
}
