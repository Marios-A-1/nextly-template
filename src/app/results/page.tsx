import { SectionTitle } from "../../components/SectionTitle";
import { MainContainer, PageRoot } from "../../components/PageLayout";
import ResultsMasonryClient from "../../components/ResultsMasonryClient";
import { readdir } from "fs/promises";
import path from "path";

const RESULTS_DIR = path.join(process.cwd(), "public", "img", "results");
const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const sortFiles = (a: string, b: string) => {
  const aNum = Number.parseInt(a, 10);
  const bNum = Number.parseInt(b, 10);
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum !== bNum) {
    return aNum - bNum;
  }
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
};

export const revalidate = 300;

export default async function ResultsPage() {
  const files = (await readdir(RESULTS_DIR)).filter((file) =>
    VALID_EXT.has(path.extname(file).toLowerCase())
  );
  const sorted = files.sort(sortFiles);
  const page = sorted.slice(0, 24);
  const initialPage = {
    items: page.map((file) => ({ src: `/img/results/${file}`, name: file })),
    nextOffset: sorted.length > page.length ? page.length : null
  };
  return (
    <PageRoot>
      <MainContainer className="space-y-12 py-12">
        <section className="grid grid-cols-1">
          <SectionTitle
            preTitle="Αποτελέσματα"
            title="Πριν & Μετά από πραγματικές επεμβάσεις"
          >
            Μια επιμελημένη συλλογή πραγματικών περιστατικών. Αντικατάστησε τις
            φωτογραφίες με τα δικά σου results για να αναδείξεις τη φυσικότητα
            και τη λεπτομέρεια της δουλειάς σου.
          </SectionTitle>
        </section>

        <section className="w-full">
          <ResultsMasonryClient
            baseItems={[]}
            initialPage={initialPage}
          />
        </section>

        {/* <section className="w-full">
          <div className="w-full h-[600px]">
            <DomeGallery
              fit={1}
              minRadius={600}
              maxVerticalRotationDeg={0}
              segments={26}
              dragDampening={2}
              grayscale={false}
              showBackgroundOverlay={false} showVignette={false}
            />
          </div>
        </section> */}
      </MainContainer>
    </PageRoot>
  );
}
