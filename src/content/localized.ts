import messages from "../../messages/el.json";
import { clinicFaqs } from "@/content/faqs";
import { googleReviews } from "@/content/googleReviews";
import { Epemvaseis } from "@/content/epemvaseis";
import { procedureImages } from "@/content/procedureImages";
import type { FAQ, NavItem, Service, SiteConfig } from "@/types/content";

export type AppMessages = typeof messages;

const services: Service[] = Epemvaseis.map((procedure) => ({
  id: procedure.id,
  slug: procedure.slug,
  title: procedure.title,
  summary: procedure.shortDesc,
  highlights: procedure.overviewBullets ?? [],
  image: {
    id: procedure.slug,
    src: procedureImages[procedure.slug] ?? "/img/categories/AisthitikiXeirourgiki.webp",
    alt: procedure.title,
    width: 800,
    height: 640,
  },
  cta: {
    id: procedure.slug,
    label: "Περισσότερα",
    href: `/epemvaseis/${procedure.slug}`,
  },
}));

export const getMetadataContent = () => messages.metadata;
export const getLayoutContent = () => messages.layout;
export const getPageContent = () => messages.pages;
export const getSectionContent = () => messages.sections;
export const getSiteContent = (): SiteConfig => messages.site as SiteConfig;
export const getNavigationContent = (): NavItem[] => messages.navigation.main;
export const getServices = () => services;
export const getServiceSlugs = () => services.map((service) => service.slug);
export const getTestimonials = () => googleReviews;
export const getFaqs = (): FAQ[] => clinicFaqs.map((faq, index) => ({
  ...faq,
  id: `clinic-faq-${index + 1}`,
}));
