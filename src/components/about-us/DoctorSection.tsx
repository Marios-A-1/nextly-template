"use client";

import Image from "next/image";
import SplitText from "../SplitText";
import AnimatedContent from "../AnimatedContent";
import BlurText from "../BlurText";

export default function DoctorSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2  lg:items-center">

        {/* LEFT — TEXT */}
        <div>
          <div className="flex justify-center lg:justify-start">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wide text-primary text-center">
              Ο Ιατρoς
            </span>
          </div>

          <BlurText
            as="h2"
            text="Dr. Βλασταράκος"
            delay={20}
            animateBy="letters"
            direction="top"
            className="justify-center lg:justify-start text-center text-3xl font-semibold leading-tight text-text sm:text-4xl lg:text-left"
          />

          {/* Mobile-only doctor image placed between the heading and description */}
          <AnimatedContent className="mt-6 block overflow-hidden rounded-2xl bg-card shadow-lg lg:hidden">
            <Image
              src="/img/vlast-pic.webp"
              alt="Ο πλαστικός χειρουργός"
              width={500}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </AnimatedContent>

          <SplitText
            text="Πλαστικός Χειρουργός"
            className="mt-2 text-lg font-medium text-muted"
            delay={150}
            duration={1.85}
            ease="power3.out"
            splitType="lines"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="inherit"
            tag="p"
          />

          <AnimatedContent className="mt-6 space-y-5 text-muted">
            <div>
            <p>
             Ο Πλαστικός Χειρουργός Πέτρος Θ. Βλασταράκος είναι μέλος της Ελληνικής Εταιρίας Πλαστικής, Επανορθωτικής και Αισθητικής Χειρουργικής,  έχει την έδρα του στην Αθήνα και δραστηριοποιείται στον ιδιωτικό τομέα.

             Έλαβε το πτυχίο της Ιατρικής από την Ιατρική Σχολή του Πανεπιστημίου της Μάλτας το 2001 και μετά από μακρά ειδίκευση σε Νοσοκομεία της Μεγάλης Βρετανίας και της Ελλάδος έλαβε τον τίτλο του Πλαστικού, Επανορθωτικού και Αισθητικού Χειρουργού.
             
             Κατά τη διάρκεια της Ιατρικής του καριέρας έχει λάβει μέρος σε πολλά Ελληνικά και Διεθνή συνέδρια, συμμετέχοντας με εργασίες και ομιλίες.
             
             Έχει διατελέσει Demonstrator στο τμήμα Ανατομίας της  Ιατρικής Σχολής του Πανεπιστημίου της Μάλτας καθώς και καθηγητής στο τμήμα Νοσηλευτικής του ίδιου Πανεπιστημίου.
            </p>

            <p>
             Επίσης έχει λάβει πτυχία Basic Life Support, Advanced Life Support, Advanced Trauma Life Support, σεμινάριο βασικής μικροχειρουργικής και Acute Burn Treatment Course καθώς και εξειδίκευση στο Facelift από το Clinique des Champs-Elysées στο Παρίσι.
            </p>
            </div>

            {/* QUOTE */}
            <blockquote className="border-l-4 border-amber-400 pl-5 italic text-text">
            «Η επιτυχία μιας επέμβασης δεν μετριέται μόνο στο αποτέλεσμα,
            αλλά στο πόσο ασφαλής ένιωσε ο ασθενής σε όλη τη διαδρομή.»
            </blockquote>
          </AnimatedContent>
        </div>

        {/* RIGHT — IMAGE */}
        <AnimatedContent className="hidden lg:block relative mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
            <Image
              src="/img/vlast-pic.webp" // άλλαξε path
              alt="Ο πλαστικός χειρουργός"
              width={500}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </AnimatedContent>

      </div>
    </section>
  );
}
