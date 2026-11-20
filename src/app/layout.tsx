import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ContactChoiceProvider } from "@/components/common/ContactChoiceModal";
import {
  getLayoutContent,
  getMetadataContent,
  getNavigationContent,
  getServices,
  getSiteContent,
} from "@/content/localized";
import { siteUrl, toAbsoluteSiteUrl } from "@/lib/siteUrl";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "greek"],
  variable: "--font-sans",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const metadata = getMetadataContent();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: metadata.siteName,
      template: `%s | ${metadata.siteName}`,
    },
    description: metadata.siteDescription,
    openGraph: {
      title: metadata.siteName,
      description: metadata.siteDescription,
      url: toAbsoluteSiteUrl("/"),
      siteName: metadata.siteName,
      type: "website",
      locale: "el_GR",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSiteContent();
  const navigation = getNavigationContent();
  const services = getServices();
  const layout = getLayoutContent();

  return (
    <html
      lang={routing.defaultLocale}
      data-scroll-behavior="smooth"
      className={cn("h-full antialiased", manrope.variable)}
    >
      <body className="min-h-full">
        <SmoothScrollProvider>
          <NextIntlClientProvider>
            <ContactChoiceProvider labels={layout.contactChoice} site={site}>
              <Header
                labels={layout.header}
                mobileLabels={layout.mobile}
                navigation={navigation}
                services={services}
                site={site}
              />
              <main>{children}</main>
              <Footer labels={layout.footer} navigation={navigation} site={site} />
            </ContactChoiceProvider>
          </NextIntlClientProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
