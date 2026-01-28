"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { MainContainer, PageRoot } from "@/src/components/PageLayout";
import AnimatedContent from "@/src/components/AnimatedContent";
import BlurText from "@/src/components/BlurText";
import { Epemvaseis } from "@/src/data/epemvaseis";
import {
  EP_EMVASEIS_DEFAULT_HEADER,
  getEpemvaseisCategoryBySlug,
  getEpemvaseisCategoryLabelBySlug,
  getEpemvaseisCategorySlugByLabel,
  getEpemvaseisHeaderForCategory
} from "./epemvaseisCategories";
import { buildEpemvaseisQuery, buildEpemvaseisHref } from "./breadcrumbs";
import EpemvaseisBreadcrumb from "./components/EpemvaseisBreadcrumb";

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

const categoryImages: Record<string, string> = {
  "Αισθητική Χειρουργική": "/img/categories/AisthitikiXeirourgiki.webp",
  "Επανορθωτική Χειρουργική": "/img/categories/EpanorthotikiXeirourgiki.webp",
  "Μή Επεμβατικές Θεραπείες": "/img/categories/MiEpemvatikesTherapies.webp"
};

const subcategoryImages: Record<string, string> = {
  prosopo: "/img/subcategories/Prosopo.webp",
  soma: "/img/subcategories/soma.webp",
  stithos: "/img/subcategories/stithos.webp",
};

const procedureImages: Record<string, string> = {
  "face-lift": "/img/epemvasis/facelift.webp",
  "blefaroplastiki": "/img/epemvasis/blepharoplastiki.webp",
  "vrachioplastiki": "/img/epemvasis/Brachioplasty.webp",
  "otoplastiki": "/img/epemvasis/otoplastiki.webp",
  "kilioplastiki": "/img/epemvasis/Abdominoplasty.webp",
  "lipoanarr-ofisi": "/img/epemvasis/Liposuction.webp",
  "anorthosi-glouton": "/img/epemvasis/ButtockLift.webp",
  "anorthosi-miron": "/img/epemvasis/ThighLift.webp",
  "crisalix-4d": "/img/epemvasis/BreastAugmentation.webp",
  "anorthosi-stithous": "/img/epemvasis/BreastLift.webp",
  "meiwtiki-stithous": "/img/epemvasis/BreastReduction.webp",
  "gynaikomastia": "/img/epemvasis/Gynecomastia.webp",
  "melanoma": "/img/epemvasis/Melanoma.webp",
  "kakoitheies-dermatos": "/img/epemvasis/SkinMalignancies.webp",
  "antigiransi-xerion": "/img/epemvasis/Anti-Aging-Hands.webp",
  "botox-dysport": "/img/epemvasis/Botox.webp",
  "egkavmata": "/img/epemvasis/Burns.webp",
  "antimetopisi-kyttaritidas": "/img/epemvasis/Cellulite.webp",
  "antimetopisi-evryaggeion": "/img/epemvasis/varicoseVeins.webp",
  "antimetopisi-kilidon": "/img/epemvasis/StainTreatment.webp",
  "afairesi-tatouaz": "/img/epemvasis/TatooRemoval.webp",
  "mesotherapeia-prosopou": "/img/epemvasis/FacialMesotherapy.webp",
  "enesimi-lipodialysi": "/img/epemvasis/Injectable-Lipolysis.webp",
  "laser-apotrichosi": "/img/epemvasis/LaserHairRemoval.webp",
  "lifting-me-nimata": "/img/epemvasis/ThreadLifting.webp",
  "yalouroniko-oxy": "/img/epemvasis/Hyaluronic.webp"
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

export function EpemvaseisClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasMountedRef = useRef(false);

  const categories = useMemo(() => getCategories(), []);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("cat")
  );
  const [selectedSubcategorySlug, setSelectedSubcategorySlug] = useState<string | null>(
    searchParams.get("sub")
  );

  const subcategoryOptions = useMemo(() => {
    if (!selectedCategory) return [];
    return getSubcategories(selectedCategory).map((label) => {
      const slug = getEpemvaseisCategorySlugByLabel(label) ?? label;
      const category = getEpemvaseisCategoryBySlug(slug);
      return {
        label,
        slug,
        description:
          category?.description ??
          "Επιλέξτε για να δείτε τις διαθέσιμες επεμβάσεις."
      };
    });
  }, [selectedCategory]);

  const needsSubcategory = subcategoryOptions.length > 1;

  const selectedSubcategoryLabel = selectedSubcategorySlug
    ? getEpemvaseisCategoryLabelBySlug(selectedSubcategorySlug) ?? selectedSubcategorySlug
    : null;

  const step = getStepFromState(
    selectedCategory,
    needsSubcategory ? selectedSubcategorySlug : null,
    needsSubcategory
  );

  const hasCategoryBreadcrumb = Boolean(selectedCategory);
  const categoryBreadcrumbHref = hasCategoryBreadcrumb
    ? buildEpemvaseisHref({
        category: selectedCategory ?? undefined,
        step: 1
      })
    : "/epemvaseis";
  const subcategoryBreadcrumbHref =
    hasCategoryBreadcrumb && selectedSubcategorySlug
      ? buildEpemvaseisHref({
          category: selectedCategory ?? undefined,
          subcategory: selectedSubcategorySlug,
          step: 2
        })
      : undefined;

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

      const search = buildEpemvaseisQuery({
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
    setSelectedSubcategorySlug(nextSubcategory);
  }, [searchParams]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, selectedCategory, selectedSubcategorySlug]);

  useEffect(() => {
    if (!selectedCategory) return;

    if (subcategoryOptions.length === 1) {
      const onlySub = subcategoryOptions[0].slug;
      if (selectedSubcategorySlug !== onlySub) {
        setSelectedSubcategorySlug(onlySub);
        updateUrl({
          category: selectedCategory,
          subcategory: onlySub
        });
      }
      return;
    }

    if (subcategoryOptions.length === 0 && selectedSubcategorySlug) {
      setSelectedSubcategorySlug(null);
      updateUrl({ category: selectedCategory, subcategory: null });
    }
  }, [selectedCategory, selectedSubcategorySlug, subcategoryOptions, updateUrl]);

  const procedures = useMemo(() => {
    if (!selectedCategory) return [];

    return Epemvaseis.filter((procedure) => {
      if (procedure.category !== selectedCategory) return false;
      if (
        selectedSubcategoryLabel &&
        procedure.subcategory !== selectedSubcategoryLabel
      ) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedSubcategoryLabel]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategorySlug(null);
    updateUrl({ category, subcategory: null });
  };

  const handleSubcategorySelect = (subcategorySlug: string) => {
    setSelectedSubcategorySlug(subcategorySlug);
    updateUrl({ category: selectedCategory, subcategory: subcategorySlug });
  };

  const handleBack = () => {
    if (!selectedCategory) return;

    if (step === 3 && needsSubcategory) {
      setSelectedSubcategorySlug(null);
      updateUrl({ category: selectedCategory, subcategory: null });
      return;
    }

    setSelectedCategory(null);
    setSelectedSubcategorySlug(null);
    updateUrl({ category: null, subcategory: null });
  };

  const categoryHeader = getEpemvaseisHeaderForCategory(selectedCategory);
  const subcategoryHeader = getEpemvaseisCategoryBySlug(selectedSubcategorySlug);
  const activeHeader = subcategoryHeader ?? categoryHeader;
  const headerTitle =
    selectedSubcategorySlug && activeHeader
      ? activeHeader.title ?? EP_EMVASEIS_DEFAULT_HEADER.title
      : selectedCategory ?? EP_EMVASEIS_DEFAULT_HEADER.title;
  const headerDescription =
    activeHeader?.description ?? EP_EMVASEIS_DEFAULT_HEADER.description;

  return (
    <PageRoot>
      <MainContainer className="py-12 lg:py-16">
        {hasCategoryBreadcrumb ? (
          <div className="mb-4 flex w-full justify-start">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-semibold text-text transition hover:border-primary"
            >
              Πίσω
            </button>
          </div>
        ) : null}

        <div
          key={`${selectedCategory ?? "base"}-${selectedSubcategorySlug ?? "all"}`}
          className="space-y-3 text-center"
        >
          <BlurText
            text={headerTitle}
            as="h1"
            delay={0.4}
            animateBy="letters"
            className="text-4xl font-semibold text-text justify-center"
          />
          <AnimatedContent delay={0.1} duration={1} distance={50}  className="flex justify-center">
            <p className="max-w-2xl text-base text-muted">{headerDescription}</p>
          </AnimatedContent>
        </div>

        {hasCategoryBreadcrumb ? (
          <AnimatedContent
            key={`${selectedCategory ?? "base"}-${selectedSubcategorySlug ?? "all"}-crumb`}
            delay={0.6}
            direction="horizontal"
            reverse
          >
            <div className="mt-4 flex rounded-2xl px-4 py-4">
              <EpemvaseisBreadcrumb
                categoryLabel={selectedSubcategoryLabel ? selectedCategory : null}
                categoryHref={selectedSubcategoryLabel ? categoryBreadcrumbHref : undefined}
                subcategoryLabel={null}
                subcategoryHref={undefined}
                highlightLabel={
                  selectedSubcategoryLabel
                    ? selectedCategory ?? undefined
                    : "Επεμβάσεις"
                }
              />
            </div>
          </AnimatedContent>
        ) : null}

        {step === 1 ? (
          <AnimatedContent delay={0.45}>
            <div className="mx-auto mt-8 grid max-w-6xl place-content-center justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className="group flex h-full w-full max-w-sm flex-col justify-between rounded-2xl border border-border bg-surface pb-10 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <div>
                    <div className="mb-5 h-64 w-full overflow-hidden rounded-2xl rounded-b-none border border-border bg-muted/10">
                      <Image
                        src={categoryImages[category] ?? "/img/stock-blast.webp"}
                        alt={category}
                        width={600}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-text text-center">
                      {category}
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      {categoryDescriptions[category] ??
                        "Επιλέξτε για να δείτε διαθέσιμες επεμβάσεις."}
                    </p>
                  </div>
                  <span className="mt-10 inline-flex items-center justify-center text-sm font-semibold uppercase tracking-wide text-primary">
                    Επιλογη
                  </span>
                </button>
              ))}
            </div>
          </AnimatedContent>
        ) : null}

        {step === 2 ? (
          <AnimatedContent delay={0.45}>
            <div className="mt-8">
              <div className="mx-auto grid max-w-6xl place-content-center justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {subcategoryOptions.map((subcategory) => (
                <button
                  key={subcategory.slug}
                  type="button"
                  onClick={() => handleSubcategorySelect(subcategory.slug)}
                  className="group flex h-full w-full max-w-sm flex-col justify-between rounded-2xl border border-border bg-surface pb-10 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                    <div>
                      <div className="mb-5 h-64 w-full overflow-hidden rounded-2xl rounded-b-none border border-border bg-muted/10">
                        {subcategoryImages[subcategory.slug] ? (
                          <Image
                            src={subcategoryImages[subcategory.slug]}
                            alt={subcategory.label}
                            width={600}
                            height={300}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-muted">
                            Placeholder
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-text text-center">
                        {subcategory.label}
                      </h3>
                    <p className="mt-2 text-sm text-muted">
                      {subcategory.description}
                    </p>
                  </div>
                  <span className="mt-10 inline-flex items-center justify-center text-sm font-semibold uppercase tracking-wide text-primary">
                    Επιλογη
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
                <div className="mx-auto grid max-w-6xl place-content-center justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {procedures.map((procedure) => {
                  const query = buildEpemvaseisQuery({
                    category: selectedCategory,
                    subcategory: selectedSubcategorySlug,
                    step: 3
                  });
                    return (
                      <Link
                        key={procedure.id}
                        href={`/epemvaseis/${procedure.slug}${query ? `?${query}` : ""}`}
                        className="group flex h-full w-full max-w-sm flex-col justify-between rounded-2xl border border-border bg-surface pb-10 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                      >
                        <div>
                          <div className="mb-5 h-64 w-full overflow-hidden rounded-2xl rounded-b-none border border-border bg-muted/10">
                            {procedureImages[procedure.slug] ? (
                              <Image
                                src={procedureImages[procedure.slug]}
                                alt={procedure.title}
                                width={600}
                                height={300}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-muted">
                                Placeholder
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-text text-center">
                            {procedure.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 px-8 text-sm text-muted">
                            {procedure.shortDesc}
                          </p>
                        </div>
                        <span className="mt-10 inline-flex items-center justify-center text-sm font-semibold uppercase tracking-wide text-primary">
                          Δειτε λεπτομερειες
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
