import type { Metadata } from "next";
import { ResultsGallery } from "@/components/sections/ResultsGallery";
import { SecondaryPageHero } from "@/components/sections/ReferenceSections";
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
    <div className="reference-page">
      <SecondaryPageHero
        title="Αποτελέσματα πριν και μετά"
        description="Φωτογραφίες από επεμβάσεις και θεραπείες της κλινικής."
      />
      <section className="bg-background py-14 sm:py-20 lg:py-28" aria-label="Συλλογή αποτελεσμάτων">
        <Reveal className="site-container" variant="panel">
          <ResultsGallery initialPage={page} />
        </Reveal>
      </section>
    </div>
  );
}
