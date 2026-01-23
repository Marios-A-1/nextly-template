import Image from "next/image";

export function VisionSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 items-center text-left  gap-12 lg:grid-cols-2">

        

        {/* LEFT — TEXT */}
        <div>
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wide text-primary text-center lg:text-left">
            Το οραμα μας
          </span>

          <h2 className="text-center text-3xl font-semibold text-text sm:text-4xl lg:text-left">
            Εμπιστοσύνη που διαρκεί
          </h2>

          {/* Mobile-only vision image below heading */}
          <div className="mt-6 block overflow-hidden rounded-2xl bg-card shadow-lg lg:hidden">
            <Image
              src="/img/our-vision-image.webp"
              alt="Το όραμά μας"
              width={500}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>

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
        <div className="hidden lg:block mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-lg">
          <Image
            src="/img/our-vision-image.webp"
            alt="Το όραμά μας"
            width={500}
            height={600}
            className="h-full w-full object-cover"
          />
        </div> 
      </div>
    </section>
  );
}
