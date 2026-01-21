"use client"
import Image from "next/image";

export function MissionSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 items-center text-left  gap-12 lg:grid-cols-2">
        {/* LEFT — IMAGE */}
        <div className="hidden lg:block mx-auto w-full max-w-md overflow-hidden rounded-2xl">
          <Image
            src="/img/our-mission-image.webp"
            alt="Η αποστολή μας"
            width={500}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
        {/*  RIGHT— TEXT */}
        <div>
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wide text-primary text-center lg:text-left">
            Η αποστολη μας
          </span>

          <h2 className="text-center text-3xl font-semibold text-neutral-900 sm:text-4xl lg:text-left">
            Ιατρική φροντίδα με ανθρώπινο πρόσωπο
          </h2>

          {/* Mobile-only mission image below heading */}
          <div className="mt-6 block overflow-hidden rounded-2xl bg-neutral-100 shadow-lg lg:hidden">
            <Image
              src="/img/our-mission-image.webp"
              alt="Η αποστολή μας"
              width={500}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>

          <p className="mt-6 text-neutral-700">
            Να προσφέρουμε υψηλού επιπέδου πλαστική χειρουργική με απόλυτη
            διαφάνεια, σεβασμό και εξατομικευμένη προσέγγιση.
          </p>

          <p className="mt-4 text-neutral-700">
            Στόχος μας είναι κάθε ασθενής να αισθάνεται ασφαλής, πλήρως
            ενημερωμένος και υποστηριζόμενος — όχι μόνο για το αποτέλεσμα,
            αλλά και για ολόκληρη τη διαδικασία.
          </p>

          <blockquote className="mt-8 border-l-4 border-amber-400 pl-5 italic text-neutral-800">
            «Η σωστή χειρουργική ξεκινά με σωστή επικοινωνία και τελειώνει
            με μακροχρόνια φροντίδα.»
          </blockquote>
        </div>

        
      </div>
    </section>
  );
}
