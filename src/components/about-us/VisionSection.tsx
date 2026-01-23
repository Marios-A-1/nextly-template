import Image from "next/image";
import AnimatedContent from "../AnimatedContent";
import BlurText from "../BlurText";

export function VisionSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 items-center lg:text-left  gap-12 lg:grid-cols-2">

        

        {/* LEFT — TEXT */}
        <div>
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wide text-primary text-center justify-center lg:text-left">
            Το οραμα μας
          </span>

          <BlurText
            as="h2"
            text="Εμπιστοσύνη που διαρκεί"
            delay={20}
            animateBy="letters"
            direction="top"
            className="justify-center lg:justify-start text-center text-3xl font-semibold text-text sm:text-4xl lg:text-left"
          />

          {/* Mobile-only vision image below heading */}
          <AnimatedContent className="mt-6 block overflow-hidden rounded-2xl lg:hidden">
            <Image
              src="/img/our-vision-image.webp"
              alt="Το όραμά μας"
              width={500}
              height={600}
              className="h-full w-full object-cover"
            />
          </AnimatedContent>

          <p className="mt-6 text-muted">
            Δημιουργούμε εμπειρίες φροντίδας όπου η ιατρική αρτιότητα
            συναντά την προσωπική προσοχή.
          </p>

          <p className="mt-4 text-muted">
            Θέλουμε οι ασθενείς μας να φεύγουν όχι απλώς ικανοποιημένοι,
            αλλά ήρεμοι, ενημερωμένοι και σίγουροι για τις επιλογές τους.
          </p>

          <blockquote className="mt-8 border-l-4 border-amber-400 pl-5 italic text-text">
            «Το πραγματικό αποτέλεσμα φαίνεται στον τρόπο που νιώθεις
            μετά — όχι μόνο στον καθρέφτη.»
          </blockquote>
        </div>
      {/* RIGHT — IMAGE */}
        <AnimatedContent className="hidden lg:block mx-auto w-full max-w-md overflow-hidden rounded-2xl ">
          <Image
            src="/img/our-vision-image.webp"
            alt="Το όραμά μας"
            width={500}
            height={600}
            className="h-full w-full object-cover"
          />
        </AnimatedContent> 
      </div>
    </section>
  );
}
