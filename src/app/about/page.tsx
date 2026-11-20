import type { Metadata } from "next";
import Image from "next/image";
import { CTA } from "@/components/sections/CTA";
import { AboutHeroSection } from "@/components/sections/ReferenceSections";
import { AnimatedImageReveal } from "@/components/animations/AnimatedImageReveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
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
      <section id="doctor-story" className="bg-background py-14 sm:py-20">
        <div className="site-container">
          <Reveal variant="stagger" className="mx-auto max-w-3xl space-y-5 text-center">
            <Reveal as="p" className="section-kicker">Ο ιατρός</Reveal>
            <Reveal as="h2" className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Η διαδρομή του ιατρού</Reveal>
            {biography.map((paragraph) => (
              <Reveal as="p" key={paragraph} className="text-left text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </Reveal>
            ))}
            <Reveal>
              <AnimatedButton href="/epemvaseis">Δείτε τις επεμβάσεις</AnimatedButton>
            </Reveal>
          </Reveal>
          <Reveal variant="stagger" childVariant="card" className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            <Reveal as="article" className="dark-gold-slab rounded-xl p-6">
              <h3 className="text-xl font-semibold">Ιατρική εκπαίδευση</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">Ιατρική Σχολή του Πανεπιστημίου της Μάλτας, 2001.</p>
            </Reveal>
            <Reveal as="article" className="rounded-xl bg-champagne p-6">
              <h3 className="text-xl font-semibold">Ειδίκευση</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Ειδίκευση σε νοσοκομεία της Μεγάλης Βρετανίας και της Ελλάδας.</p>
            </Reveal>
            <Reveal as="article" className="rounded-xl border border-border bg-white p-6">
              <h3 className="text-xl font-semibold">Επιστημονική συμμετοχή</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Μέλος της Ελληνικής Εταιρίας Πλαστικής, Επανορθωτικής και Αισθητικής Χειρουργικής.</p>
            </Reveal>
          </Reveal>
        </div>
      </section>
      <section id="clinic-values" className="cream-band py-14 sm:py-20 lg:py-28">
        <div className="site-container">
          <Reveal variant="stagger" className="mx-auto mb-10 max-w-3xl space-y-4 text-center sm:mb-14">
            <Reveal as="p" className="section-kicker">Η κλινική</Reveal>
            <Reveal as="h2" className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Αποστολή και όραμα</Reveal>
          </Reveal>
          <Reveal variant="stagger" childVariant="card" className="grid gap-5 sm:grid-cols-2">
            {clinicValues.map((value) => (
              <Reveal as="article" variant="card" key={value.title} className="rounded-xl border border-border bg-white p-6 sm:p-8">
                <AnimatedImageReveal className="mb-6 h-24 w-28" variant="subtle">
                  <Image src={value.image} alt="" fill sizes="112px" className="object-contain" />
                </AnimatedImageReveal>
                <h3 className="text-2xl font-semibold">{value.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{value.description}</p>
              </Reveal>
            ))}
          </Reveal>
          <Reveal variant="panel" className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-white p-5">
            <h3 className="font-semibold">Επικοινωνία με την κλινική</h3>
            <a href={site.phoneHref} className="text-bronze underline underline-offset-4">{site.contact.phone}</a>
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="break-all text-bronze underline underline-offset-4">{site.contact.email}</a>
            )}
          </Reveal>
        </div>
      </section>
      <CTA ctaButtons={site.ctas} labels={sections.cta} title={pages.about.ctaTitle} />
    </div>
  );
}
