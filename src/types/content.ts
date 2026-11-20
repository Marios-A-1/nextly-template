export type LinkTarget = "_self" | "_blank";

export interface LinkPlaceholder {
  id: string;
  label: string;
  href: string;
  target?: LinkTarget;
  ariaLabel?: string;
  isExternal?: boolean;
}

export interface CTAButton {
  id: string;
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  icon?: string;
  target?: LinkTarget;
}

export interface ImagePlaceholder {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataUrl?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  isExternal?: boolean;
  isCallToAction?: boolean;
  children?: NavItem[];
}

export interface SiteStat {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface VisualProofCard {
  id: string;
  value: string;
  label: string;
  description: string;
  tone: "teal" | "blue" | "cream" | "mint" | "lavender";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tone: "teal" | "light" | "clinic" | "warm";
}

export interface AwardItem {
  id: string;
  label: string;
  description: string;
  tone: "gold" | "blue" | "purple" | "mint";
}

export interface AboutMetric {
  id: string;
  value: string;
  label: string;
  description: string;
  tone: "dark" | "cream" | "photo";
}

export interface LocationCard {
  id: string;
  city: string;
  address: string;
  tone: "clinic-a" | "clinic-b" | "clinic-c";
}

export interface HeroInfoItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ContactAddress {
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface ContactHours {
  dayGroup: string;
  hours: string;
  isOpen: boolean;
}

export interface ContactInfo {
  phone: string;
  email?: string;
  alternateEmail?: string;
  fax?: string;
  address: ContactAddress;
  hours: ContactHours[];
  emergencyContactLine?: string;
  emergencyEmail?: string;
}

export interface SocialProfile {
  id: string;
  platform: "instagram" | "facebook" | "linkedin" | "youtube" | "tiktok" | "x" | "other";
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface SiteConfig {
  id: string;
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoText: string;
  logoByline: string;
  logoImage?: ImagePlaceholder;
  homeUrl: string;
  legalName: string;
  shortIntro: string;
  phoneHref?: string;
  doctorAnytimeUrl?: string;
  doctorAnytimeReviews?: {
    rating: string;
    count: string;
    label: string;
    countLabel: string;
  };
  contact: ContactInfo;
  mapUrl?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
  reviewSummary?: {
    rating: string;
    count: string;
    sourceLabel: string;
  };
  social: SocialProfile[];
  stats: SiteStat[];
  heroInfoItems: HeroInfoItem[];
  proofCards: VisualProofCard[];
  teamMembers: TeamMember[];
  awards: AwardItem[];
  aboutMetrics: AboutMetric[];
  locations: LocationCard[];
  ctas: CTAButton[];
  heroImage: ImagePlaceholder;
  processImage: ImagePlaceholder;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  iconName?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  summary: string;
  highlights: string[];
  image: ImagePlaceholder;
  cta: CTAButton;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: "prevention" | "treatment" | "finance" | "general";
  relatedServiceSlug?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  age?: string;
  quote: string;
  treatment: string;
  rating: 1 | 2 | 3 | 4 | 5;
  location: string;
  beforeAfterSummary?: string;
  image?: ImagePlaceholder;
  publishedAt: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  credentials?: string;
  avatar?: ImagePlaceholder;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodySummary: string;
  body: string[];
  publishedAt: string;
  readingTimeMinutes: number;
  author: BlogAuthor;
  category: string;
  tags: string[];
  featuredImage: ImagePlaceholder;
  cta: CTAButton;
  isFeatured: boolean;
  relatedServiceSlugs: string[];
}
