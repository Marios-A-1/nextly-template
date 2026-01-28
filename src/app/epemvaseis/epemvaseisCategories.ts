export type EpemvaseisCategorySlug = "prosopo" | "soma" | "stithos";

type EpemvaseisCategoryConfig = {
  slug: EpemvaseisCategorySlug;
  title: string;
  label: string;
  description: string;
};

export const EP_EMVASEIS_DEFAULT_HEADER = {
  title: "Επεμβάσεις",
  description: "Επιλέξτε κατηγορία και δείτε την επέμβαση που σας ταιριάζει."
};

export const EP_EMVASEIS_CATEGORY_CONFIG: Record<
  EpemvaseisCategorySlug,
  EpemvaseisCategoryConfig
> = {
  prosopo: {
    slug: "prosopo",
    title: "Πρόσωπο",
    label: "Πρόσωπο",
    description: "Εστίαση στην ισορροπία των χαρακτηριστικών."
  },
  soma: {
    slug: "soma",
    title: "Σώμα",
    label: "Σώμα",
    description: "Βελτίωση περιγράμματος και αναλογιών."
  },
  stithos: {
    slug: "stithos",
    title: "Στήθος",
    label: "Στήθος",
    description: "Αρμονία, συμμετρία και φυσικό αποτέλεσμα."
  }
};

const slugEntries = Object.values(EP_EMVASEIS_CATEGORY_CONFIG);

export const EP_EMVASEIS_CATEGORY_LABEL_TO_SLUG = slugEntries.reduce<
  Record<string, EpemvaseisCategorySlug | undefined>
>((acc, entry) => {
  acc[entry.label] = entry.slug;
  return acc;
}, {});

export const getEpemvaseisCategoryBySlug = (slug?: string | null) => {
  if (!slug) return undefined;
  return EP_EMVASEIS_CATEGORY_CONFIG[slug as EpemvaseisCategorySlug];
};

export const getEpemvaseisCategorySlugByLabel = (label?: string | null) => {
  if (!label) return undefined;
  return EP_EMVASEIS_CATEGORY_LABEL_TO_SLUG[label];
};

export const getEpemvaseisCategoryLabelBySlug = (slug?: string | null) => {
  if (!slug) return undefined;
  return EP_EMVASEIS_CATEGORY_CONFIG[slug as EpemvaseisCategorySlug]?.label;
};

const CATEGORY_HEADER_SLUG_MAP: Record<string, EpemvaseisCategorySlug> = {
  "Αισθητική Χειρουργική": "prosopo",
  "Επανορθωτική Χειρουργική": "soma",
  "Μή Επεμβατικές Θεραπείες": "stithos"
};

export const getEpemvaseisHeaderForCategory = (
  category?: string | null
) => {
  if (!category) return undefined;
  const slug = CATEGORY_HEADER_SLUG_MAP[category];
  if (!slug) return undefined;
  return getEpemvaseisCategoryBySlug(slug);
};
