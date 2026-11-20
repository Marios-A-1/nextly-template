import type { Metadata } from "next";
import { toAbsoluteSiteUrl } from "@/lib/siteUrl";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { Benefits } from "@/components/sections/Benefits";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { DoctorShowcase } from "@/components/sections/ReferenceSections";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import {
  getFaqs,
  getMetadataContent,
  getPageContent,
  getSectionContent,
  getServices,
  getSiteContent,
  getTestimonials,
} from "@/content/localized";

export function generateMetadata(): Metadata {
  const { home } = getMetadataContent();
  return {
    title: { absolute: home.title },
    description: home.description,
    alternates: { canonical: toAbsoluteSiteUrl("/") },
  };
}

export default function Home() {
  const site = getSiteContent();
  const pages = getPageContent();
  const sections = getSectionContent();
  const services = getServices();
  const testimonials = getTestimonials();
  const faqs = getFaqs();

  return (
    <div className="reference-page">
      <Hero
        description={pages.home.heroDescription}
        site={site}
        title={pages.home.heroTitle}
        titleHighlight={pages.home.heroTitleHighlight}
      />
      <AboutPreview content={sections.aboutPreview} site={site} />
      <ServicesGrid
        id="services"
        labels={sections.servicesGrid}
        services={services.slice(0, 4)}
        title={pages.home.servicesTitle}
      />
      <DoctorShowcase />
      <Benefits
        description={sections.benefits.description}
        highlight={sections.benefits.highlight}
        items={sections.benefits.items}
        tag={sections.benefits.tag}
        title={sections.benefits.title}
      />
      <Testimonials
        items={testimonials}
        labels={sections.testimonials}
      />
      <FAQ faqs={faqs} labels={sections.faq} />
      <CTA
        ctaButtons={site.ctas}
        description={pages.home.ctaDescription}
        labels={sections.cta}
        title={pages.home.ctaTitle}
      />
    </div>
  );
}
