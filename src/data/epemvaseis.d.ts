export type DoctorContentBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "spacer"; size?: "sm" | "md" | "lg" }
  | { type: "image"; meta: Record<string, unknown> };

export type DoctorContentSection = {
  id: string;
  title?: string | null;
  blocks: DoctorContentBlock[];
};

export type LegacyContentChunk =
  | { type: "text"; title?: string | null; content: string[] }
  | { type: "list"; title?: string | null; items: string[] }
  | { type: "cardGroup"; groupTitle?: string | null; cards: { title?: string | null; content: string[] }[] }
  | { type: "infoBox"; title?: string | null; items: string[] };

export type DoctorContentGroup = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  heading?: string | null;
  sections?: DoctorContentSection[];
  blocks?: LegacyContentChunk[];
};

export interface Procedure {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  type?: string;
  shortDesc: string;
  overviewBullets?: string[];
  keywords?: string[];
  doctorContent?: {
    groups?: DoctorContentGroup[];
    sections?: LegacyContentChunk[];
  };
  sections?: LegacyContentChunk[];
}

export const Epemvaseis: Procedure[];
