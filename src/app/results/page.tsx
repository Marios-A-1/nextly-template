import { SectionTitle } from "../../components/SectionTitle";
import Masonry from "../../components/Masonry";
import DomeGallery from "../../components/DomeGallery";
import { MainContainer, PageRoot } from "../../components/PageLayout";

// Replace with real results photos and keep height close to the original pixel height.
const resultsItems = [
  {
    id: "result-01",
    img: "/img/results/1.webp",
    url: "/img/results/1.webp",
    height: 820
  },
  {
    id: "result-02",
    img: "/img/results/2.webp",
    url: "/img/results/2.webp",
    height: 760
  },
  {
    id: "result-03",
    img: "/img/results/3.webp",
    url: "/img/results/3.webp",
    height: 880
  },
  {
    id: "result-04",
    img: "/img/results/4.webp",
    url: "/img/results/4.webp",
    height: 700
  },
  {
    id: "result-05",
    img: "/img/results/5.webp",
    url: "/img/results/5.webp",
    height: 520
  },
  {
    id: "result-06",
    img: "/img/results/6.webp",
    url: "/img/results/6.webp",
    height: 560
  }
];

export default function ResultsPage() {
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
          <Masonry items={resultsItems} animateFrom="bottom" />
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
