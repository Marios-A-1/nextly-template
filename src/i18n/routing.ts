import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["el"],
  defaultLocale: "el",
  localePrefix: "never",
  localeDetection: false,
});
