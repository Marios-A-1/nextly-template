"use client";

import Image from "next/image";

export default function DoctorSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

        {/* LEFT — TEXT */}
        <div>
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wide text-primary text-center lg:text-left">
            Ο Ιατρoς
          </span>

          <h2 className="text-center text-3xl font-semibold leading-tight text-text sm:text-4xl lg:text-left">
            Dr. Βλασταράκος 
          </h2>

          {/* Mobile-only doctor image placed between the heading and description */}
          <div className="mt-6 block overflow-hidden rounded-2xl bg-card shadow-lg lg:hidden">
            <Image
              src="/img/vlast-pic.webp"
              alt="Ο πλαστικός χειρουργός"
              width={500}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <p className="mt-2 text-lg font-medium text-muted">
            Πλαστικός Χειρουργός
          </p>

          <div className="mt-6 space-y-5 text-muted">
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
          <blockquote className="mt-8 border-l-4 border-amber-400 pl-5 italic text-text">
            «Η επιτυχία μιας επέμβασης δεν μετριέται μόνο στο αποτέλεσμα,
            αλλά στο πόσο ασφαλής ένιωσε ο ασθενής σε όλη τη διαδρομή.»
          </blockquote>
        </div>

        {/* RIGHT — IMAGE */}
        <div className="hidden lg:block relative mx-auto w-full max-w-md">
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
        </div>

      </div>
    </section>
  );
}
