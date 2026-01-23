"use client"
import Image from "next/image";
import AnimatedContent from "../AnimatedContent";
import BlurText from "../BlurText";

export function MissionSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 items-center text-left  gap-12 lg:grid-cols-2">
        {/* LEFT — IMAGE */}
        <AnimatedContent className="hidden lg:block mx-auto w-full max-w-md overflow-hidden rounded-2xl">
          <Image
            src="/img/our-mission-image.webp"
            alt="Η αποστολή μας"
            width={500}
            height={600}
            className="h-full w-full object-cover"
          />
        </AnimatedContent>
        {/*  RIGHT— TEXT */}
        <div>
          <div className="flex justify-center lg:justify-start">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wide text-primary text-center">
              Η αποστολη μας
            </span>
          </div>

          <BlurText
            as="h2"
            text="Ιατρική φροντίδα με ανθρώπινο πρόσωπο"
            delay={20}
            animateBy="letters"
            direction="top"
            className="justify-center lg:justify-start text-center text-3xl font-semibold text-text sm:text-4xl lg:text-left"
          />

          {/* Mobile-only mission image below heading */}
          <AnimatedContent className="mt-6 block overflow-hidden rounded-2xl lg:hidden">
            <Image
              src="/img/our-mission-image.webp"
              alt="Η αποστολή μας"
              width={500}
              height={600}
              className="h-full w-full object-cover"
            />
          </AnimatedContent>

          <p className="mt-6 text-muted">
            Προσφέρουμε υψηλού επιπέδου πλαστική χειρουργική με απόλυτη
            διαφάνεια, σεβασμό και εξατομικευμένη προσέγγιση.
          </p>

          <p className="mt-4 text-muted">
            Στόχος μας είναι κάθε ασθενής να αισθάνεται ασφαλής, πλήρως
            ενημερωμένος και υποστηριζόμενος — όχι μόνο για το αποτέλεσμα,
            αλλά και για ολόκληρη τη διαδικασία.
          </p>

          <blockquote className="mt-8 border-l-4 border-amber-400 pl-5 italic text-text">
            «Η σωστή χειρουργική ξεκινά με σωστή επικοινωνία και τελειώνει
            με μακροχρόνια φροντίδα.»
          </blockquote>
        </div>

        
      </div>
    </section>
  );
}
