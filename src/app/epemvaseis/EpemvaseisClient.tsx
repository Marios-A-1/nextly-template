"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Breadcrumb } from "antd";

import { MainContainer, PageRoot } from "@/src/components/PageLayout";
import AnimatedContent from "@/src/components/AnimatedContent";
import BlurText from "@/src/components/BlurText";
import { Epemvaseis } from "@/src/data/epemvaseis";

const unique = (items: string[]) => Array.from(new Set(items));

const BASE_CATEGORIES = [
  "Αισθητική Χειρουργική",
  "Επανορθωτική Χειρουργική",
  "Μή Επεμβατικές Θεραπείες"
];

const getCategories = () =>
  BASE_CATEGORIES.filter((category) =>
    Epemvaseis.some((procedure) => procedure.category === category)
  );

const getSubcategories = (category: string) =>
  unique(
    Epemvaseis.filter((item) => item.category === category)
      .map((item) => item.subcategory)
      .filter((value): value is string => Boolean(value))
  );

const categoryDescriptions: Record<string, string> = {
  "Αισθητική Χειρουργική": "Επεμβάσεις για ανανέωση και αρμονία.",
  "Επανορθωτική Χειρουργική": "Αποκατάσταση μορφής και λειτουργίας.",
  "Μή Επεμβατικές Θεραπείες": "Στοχευμένες θεραπείες χωρίς χειρουργείο."
};

const subcategoryDescriptions: Record<string, string> = {
  Πρόσωπο: "Εστίαση στην ισορροπία των χαρακτηριστικών.",
  Σώμα: "Βελτίωση περιγράμματος και αναλογιών.",
  Στήθος: "Αρμονία, συμμετρία και φυσικό αποτέλεσμα."
};

const getStepFromState = (
  category: string | null,
  subcategory: string | null,
  needsSubcategory: boolean
) => {
  if (!category) return 1;
  if (needsSubcategory && !subcategory) return 2;
  return 3;
};

const buildQueryString = (values: {
  category?: string | null;
  subcategory?: string | null;
  step?: number;
}) => {
  const params = new URLSearchParams();
  if (values.category) params.set("cat", values.category);
  if (values.subcategory) params.set("sub", values.subcategory);
  if (values.step) params.set("step", String(values.step));
  return params.toString();
};

export function EpemvaseisClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = useMemo(() => getCategories(), []);

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("cat")
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    searchParams.get("sub")
  );

  const subcategories = useMemo(
    () => (selectedCategory ? getSubcategories(selectedCategory) : []),
    [selectedCategory]
  );

  const needsSubcategory = subcategories.length > 1;

  const step = getStepFromState(
    selectedCategory,
    needsSubcategory ? selectedSubcategory : null,
    needsSubcategory
  );

  const updateUrl = useCallback(
    (values: { category?: string | null; subcategory?: string | null }) => {
      const nextCategory = values.category ?? null;
      const nextSub = values.subcategory ?? null;
      const nextSubcategories = nextCategory ? getSubcategories(nextCategory) : [];
      const nextNeedsSub = nextSubcategories.length > 1;
      const nextStep = getStepFromState(
        nextCategory,
        nextNeedsSub ? nextSub : null,
        nextNeedsSub
      );

      const search = buildQueryString({
        category: nextCategory,
        subcategory: nextNeedsSub ? nextSub : null,
        step: nextStep
      });
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false
      });
    },
    [router, pathname]
  );

  useEffect(() => {
    const nextCategory = searchParams.get("cat");
    const nextSubcategory = searchParams.get("sub");

    setSelectedCategory(nextCategory);
    setSelectedSubcategory(nextSubcategory);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedCategory) return;

    const availableSubcategories = getSubcategories(selectedCategory);
    if (availableSubcategories.length === 1) {
      const onlySub = availableSubcategories[0];
      if (selectedSubcategory !== onlySub) {
        setSelectedSubcategory(onlySub);
        updateUrl({
          category: selectedCategory,
          subcategory: onlySub
        });
      }
    }

    if (availableSubcategories.length === 0 && selectedSubcategory) {
      setSelectedSubcategory(null);
      updateUrl({ category: selectedCategory, subcategory: null });
    }
  }, [selectedCategory, selectedSubcategory, updateUrl]);

  const procedures = useMemo(() => {
    if (!selectedCategory) return [];

    return Epemvaseis.filter((procedure) => {
      if (procedure.category !== selectedCategory) return false;
      if (selectedSubcategory && procedure.subcategory !== selectedSubcategory) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedSubcategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    updateUrl({ category, subcategory: null });
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    updateUrl({ category: selectedCategory, subcategory });
  };

  const handleBack = () => {
    if (!selectedCategory) return;

    if (step === 3 && needsSubcategory) {
      setSelectedSubcategory(null);
      updateUrl({ category: selectedCategory, subcategory: null });
      return;
    }

    setSelectedCategory(null);
    setSelectedSubcategory(null);
    updateUrl({ category: null, subcategory: null });
  };

  const handleBreadcrumbClick = (targetStep: number) => {
    if (targetStep === 1) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      updateUrl({ category: null, subcategory: null });
      return;
    }

    if (targetStep === 2) {
      setSelectedSubcategory(null);
      updateUrl({ category: selectedCategory, subcategory: null });
    }
  };

  const stepLabels = ["Κατηγορία", "Υποκατηγορία", "Επέμβαση"];
  const stepBreadcrumbItems = stepLabels.map((label, index) => {
    const stepNumber = index + 1;
    const isActive = step === stepNumber;
    const isClickable = stepNumber < step;
    const baseClass = isActive ? "text-text font-semibold" : "text-muted";

    return {
      title: isClickable ? (
        <button
          type="button"
          onClick={() => handleBreadcrumbClick(stepNumber)}
          className={`text-xs font-semibold uppercase tracking-wide transition hover:text-text ${baseClass}`}
        >
          {label}
        </button>
      ) : (
        <span className={`text-xs uppercase tracking-wide ${baseClass}`}>
          {label}
        </span>
      )
    };
  });

  const breadcrumbItems = [
    {
      title: (
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Αρχική
        </Link>
      )
    },
    {
      title: (
        <span className="text-xs uppercase tracking-wide font-semibold text-text">
          Επεμβάσεις
        </span>
      )
    },
    ...stepBreadcrumbItems
  ];

  return (
    <PageRoot>
      <MainContainer className="py-12 lg:py-16">
        <div className="space-y-3 text-center">
          <BlurText
            text="Επεμβάσεις"
            as="h1"
            delay={0.4}
            animateBy="letters"
            className="text-4xl font-semibold text-text justify-center"
          />
          <AnimatedContent delay={0.2} className="flex justify-center">
            <p className="max-w-2xl text-base text-muted">
              Επιλέξτε κατηγορία και δείτε την επέμβαση που σας ταιριάζει.
            </p>
          </AnimatedContent>
        </div>

        {/* <AnimatedContent delay={0.3}>
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb separator="→" items={breadcrumbItems} />
            {selectedCategory ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-semibold text-text transition hover:border-primary"
              >
                Πίσω
              </button>
            ) : null}
          </div>
        </AnimatedContent> */}

        {step === 1 ? (
          <AnimatedContent delay={0.35}>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <div>
                    <div className="mb-4 flex h-28 w-full items-center justify-center rounded-xl border border-border bg-muted/10 text-xs font-semibold uppercase tracking-wide text-muted">
                      Placeholder
                    </div>
                    <h3 className="text-lg font-semibold text-text text-center">
                      {category}
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      {categoryDescriptions[category] ??
                        "Επιλέξτε για να δείτε διαθέσιμες επεμβάσεις."}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-primary">
                    Επιλογή
                  </span>
                </button>
              ))}
            </div>
          </AnimatedContent>
        ) : null}

        {step === 2 ? (
          <AnimatedContent delay={0.35}>
            <div className="mt-8">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {subcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    type="button"
                    onClick={() => handleSubcategorySelect(subcategory)}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                  >
                    <div>
                      <div className="mb-4 flex h-28 w-full items-center justify-center rounded-xl border border-border bg-muted/10 text-xs font-semibold uppercase tracking-wide text-muted">
                        Placeholder
                      </div>
                      <h3 className="text-lg font-semibold text-text text-center">
                        {subcategory}
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        {subcategoryDescriptions[subcategory] ??
                          "Επιλέξτε για να δείτε τις διαθέσιμες επεμβάσεις."}
                      </p>
                    </div>
                    <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-primary">
                      Επιλογή
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedContent>
        ) : null}

        {step === 3 ? (
          <AnimatedContent delay={0.35}>
            <div className="mt-8">
              {procedures.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
                  <p className="text-lg font-semibold text-text">
                    Δεν βρέθηκαν επεμβάσεις
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Δοκιμάστε διαφορετική επιλογή ή επιστρέψτε πίσω.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {procedures.map((procedure) => {
                    const query = buildQueryString({
                      category: selectedCategory,
                      subcategory: selectedSubcategory,
                      step: 3
                    });
                    return (
                      <Link
                        key={procedure.id}
                        href={`/epemvaseis/${procedure.slug}${query ? `?${query}` : ""}`}
                        className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                      >
                        <div>
                          <div className="mb-4 flex h-28 w-full items-center justify-center rounded-xl border border-border bg-muted/10 text-xs font-semibold uppercase tracking-wide text-muted">
                            Placeholder
                          </div>
                          <h3 className="text-lg font-semibold text-text text-center">
                            {procedure.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-muted">
                            {procedure.shortDesc}
                          </p>
                        </div>
                        <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-primary">
                          Δείτε λεπτομέρειες
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </AnimatedContent>
        ) : null}
      </MainContainer>
    </PageRoot>
  );
}
