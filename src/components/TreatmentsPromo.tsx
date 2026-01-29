import Link from "next/link";
import AnimatedContent from "./AnimatedContent";
import BlurText from "./BlurText";

const categories = [
  {
    title: "Αισθητική Χειρουργική",
    description: "Επεμβάσεις για ανανέωση και αρμονία.",
    image: "/img/categories/AisthitikiXeirourgiki.webp"
  },
  {
    title: "Επανορθωτική Χειρουργική",
    description: "Αποκατάσταση μορφής και λειτουργίας.",
    image: "/img/categories/EpanorthotikiXeirourgiki.webp"
  },
  {
    title: "Μή Επεμβατικές Θεραπείες",
    description: "Στοχευμένες θεραπείες χωρίς χειρουργείο.",
    image: "/img/categories/MiEpemvatikesTherapies.webp"
  }
];

const buildCategoryHref = (category: string) =>
  `/epemvaseis?${new URLSearchParams({ cat: category }).toString()}`;

export const TreatmentsPromo = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl px-6 py-10  lg:px-12 lg:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full"
      />
      <div className="space-y-3 text-center">
        <BlurText
          as="span"
          text="ΘΕΡΑΠΕΙΕΣ & ΕΠΕΜΒΑΣΕΙΣ"
          delay={30}
          animateBy="words"
          direction="top"
          className="text-sm font-bold uppercase tracking-wider text-primary justify-center text-center"
        />
        <BlurText
          as="h2"
          text="Εξερευνήστε τις θεραπείες"
          delay={20}
          animateBy="letters"
          direction="top"
          className="text-3xl font-semibold leading-tight text-text justify-center lg:text-4xl"
        />
        <AnimatedContent
          delay={0.1}
          duration={1}
          distance={50}
          className="flex justify-center"
        >
          <p className="max-w-2xl text-lg text-muted">
            Βρείτε την κατάλληλη λύση για εσάς.
          </p>
        </AnimatedContent>
      </div>

      <AnimatedContent delay={0.45}>
        <div className="mx-auto mt-8 grid max-w-6xl place-content-center justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={buildCategoryHref(category.title)}
              className="group flex h-full w-full max-w-sm flex-col justify-between rounded-2xl border border-border bg-surface pb-10 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <div>
                <div className="mb-5 w-full overflow-hidden rounded-2xl rounded-b-none bg-muted/10">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-auto w-full"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-semibold text-text text-center">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {category.description}
                </p>
              </div>
              <span className="mt-10 inline-flex items-center justify-center text-sm font-semibold uppercase tracking-wide text-primary">
                Επιλογη
              </span>
            </Link>
          ))}
        </div>
      </AnimatedContent>

      <AnimatedContent delay={0.6}>
        <div className="mt-8 flex justify-center">
          <Link
            href="/epemvaseis"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-card transition hover:bg-primary/90"
          >
            Δείτε όλες τις θεραπείες
          </Link>
        </div>
      </AnimatedContent>
    </section>
  );
};
