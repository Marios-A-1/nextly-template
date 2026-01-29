import Link from "next/link";

export const TreatmentsPromo = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-[#f7f3ee] via-white to-[#eef6f3] px-6 py-10 shadow-sm lg:px-12 lg:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Θεραπείες &amp; Επεμβάσεις
          </p>
          <h2 className="text-3xl font-semibold leading-tight text-text lg:text-4xl">
            Εξερευνήστε τις θεραπείες που προσφέρουμε
          </h2>
          <p className="max-w-2xl text-lg text-muted">
            Βρείτε την κατάλληλη λύση για εσάς, από μη επεμβατικές θεραπείες έως
            εξειδικευμένες επεμβάσεις, με αναλυτικές πληροφορίες και καθοδήγηση.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Αισθητικές επεμβάσεις", "Μη επεμβατικές", "Θεραπείες προσώπου & σώματος"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm font-medium text-text shadow-sm"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-2xl bg-white/80 p-6 shadow-md">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Προτεινόμενο
          </p>
          <p className="text-lg font-medium text-text">
            Δείτε όλες τις διαθέσιμες θεραπείες και λεπτομέρειες.
          </p>
          <Link
            href="/epemvaseis"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-card transition hover:bg-primary/90"
          >
            Δείτε τις επεμβάσεις
          </Link>
        </div>
      </div>
    </section>
  );
};
