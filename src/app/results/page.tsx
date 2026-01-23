import { SectionTitle } from "../../components/SectionTitle";
import Masonry from "../../components/Masonry";
import { MainContainer, PageRoot } from "../../components/PageLayout";

// Replace with real results photos and keep height close to the original pixel height.
const resultsItems = [
  {
    id: "result-01",
    img: "/img/stock-blast.webp",
    url: "/img/stock-blast.webp",
    height: 820
  },
  {
    id: "result-02",
    img: "/img/stock-blast-2.webp",
    url: "/img/stock-blast-2.webp",
    height: 760
  },
  {
    id: "result-03",
    img: "/img/our-mission-image.webp",
    url: "/img/our-mission-image.webp",
    height: 880
  },
  {
    id: "result-04",
    img: "/img/our-vision-image.webp",
    url: "/img/our-vision-image.webp",
    height: 700
  },
  {
    id: "result-05",
    img: "/img/benefit-one.webp",
    url: "/img/benefit-one.webp",
    height: 520
  },
  {
    id: "result-06",
    img: "/img/benefit-two.webp",
    url: "/img/benefit-two.webp",
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
      </MainContainer>
    </PageRoot>
  );
}
