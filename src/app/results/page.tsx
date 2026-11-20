import type { Metadata } from "next";
import { ResultsGallery } from "@/components/sections/ResultsGallery";
import { Reveal } from "@/components/sections/Reveal";
import { getMetadataContent } from "@/content/localized";
import { getResultsPage } from "@/lib/results";
import { toAbsoluteSiteUrl } from "@/lib/siteUrl";

export function generateMetadata(): Metadata {
  return {
    ...getMetadataContent().results,
    alternates: { canonical: toAbsoluteSiteUrl("/results") },
  };
}

export default async function ResultsPage() {
  const page = await getResultsPage();

  return (
    <div className="reference-page -mt-[68px] page-top-gradient pt-[68px]">
      <section className="site-container py-14 sm:py-20">
        <Reveal variant="stagger" className="mb-10 max-w-3xl space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">Αποτελέσματα πριν και μετά</h1>
          <p className="text-lg text-muted-foreground">Φωτογραφίες από επεμβάσεις και θεραπείες της κλινικής.</p>
        </Reveal>
        <ResultsGallery initialPage={page} />
      </section>
    </div>
  );
}
