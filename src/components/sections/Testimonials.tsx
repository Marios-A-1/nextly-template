"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type Testimonial } from "@/types/content";
import { HighlightedText } from "@/components/common/HighlightedText";
import { Reveal } from "./Reveal";

const reviewCardResizeTransition = {
  duration: 0.74,
  ease: [0.2, 0.84, 0.22, 1],
} as const;

const reviewContentTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1],
} as const;

const testimonialBackgroundTransition = {
  duration: 0.92,
  ease: [0.22, 1, 0.36, 1],
} as const;

type TestimonialsProps = {
  id?: string;
  title?: string;
  description?: string;
  items: Testimonial[];
  googleReviewsUrl?: string;
  reviewSummary?: {
    rating: string;
    count: string;
    sourceLabel: string;
  };
  labels: {
    kicker: string;
    title: string;
    highlight: string;
    showLabel: string;
  };
};

function getReviewInitial(name: string) {
  return name.trim().charAt(0).toLocaleUpperCase("el-GR");
}

function ReviewStars({
  rating,
  sourceLabel,
}: {
  rating: number;
  sourceLabel: string;
}) {
  const filledStars = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      aria-label={`${rating}/5 ${sourceLabel}`}
      className="flex items-center justify-center gap-1"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          aria-hidden="true"
          className={`size-4 ${
            index < filledStars
              ? "fill-gold text-bronze"
              : "text-border"
          }`}
          key={index}
          strokeWidth={2.3}
        />
      ))}
    </div>
  );
}

function ReviewCardContent({ review }: { review: Testimonial }) {
  return (
    <>
      <div className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-gradient-to-br from-champagne to-gold text-3xl font-semibold text-[#282018] shadow-[inset_0_0_0_1px_rgba(40,32,24,0.08),0_16px_36px_rgba(40,32,24,0.16)] sm:size-28 sm:text-5xl">
        {getReviewInitial(review.name)}
      </div>
      <p className="text-lg font-semibold">{review.name}</p>
      <p className="mt-1 text-sm text-[#6d6156]">{review.title}</p>
      <div className="mt-4">
        <ReviewStars rating={review.rating} sourceLabel={review.location} />
      </div>
      {review.quote ? (
        <p className="mx-auto mt-6 max-w-md text-balance text-xl font-semibold leading-[1.32] tracking-[-0.025em] sm:mt-8 sm:text-2xl sm:leading-[1.28]">
          &ldquo;{review.quote}&rdquo;
        </p>
      ) : null}
    </>
  );
}

export function Testimonials({
  id,
  title,
  items,
  googleReviewsUrl,
  reviewSummary,
  labels,
}: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reviewCount = items.length;
  const featured = reviewCount > 0 ? items[activeIndex % reviewCount] : undefined;
  const summaryRating = reviewSummary
    ? Number.parseFloat(reviewSummary.rating)
    : undefined;
  const reviewSizerRef = useRef<HTMLDivElement>(null);
  const [reviewCardHeight, setReviewCardHeight] = useState<number>();
  const quoteLength = featured?.quote.length ?? 0;
  const backgroundScale = 1.045 + Math.min(quoteLength / 7200, 0.075);

  useLayoutEffect(() => {
    const sizer = reviewSizerRef.current;
    if (!sizer) return;

    const syncHeight = () => {
      setReviewCardHeight(Math.ceil(sizer.getBoundingClientRect().height));
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(sizer);

    return () => observer.disconnect();
  }, [featured?.id]);

  function goToPreviousReview() {
    setActiveIndex((current) => (current - 1 + reviewCount) % reviewCount);
  }

  function goToNextReview() {
    setActiveIndex((current) => (current + 1) % reviewCount);
  }

  return (
    <section
      id={id}
      className="relative overflow-hidden py-14 sm:py-20 lg:py-28"
    >
      <motion.div
        aria-hidden="true"
        animate={{ scale: backgroundScale }}
        className="stock-testimonial-bg stock-image absolute -inset-8"
        initial={false}
        transition={testimonialBackgroundTransition}
      />
      <div className="absolute inset-0 bg-champagne/78 backdrop-blur-[2px]" />
      <Reveal
        variant="stagger"
        className="dark-gold-slab relative mx-4 max-w-[600px] rounded-[1rem] px-5 py-8 text-center shadow-[0_24px_70px_rgba(40,32,24,0.2)] sm:mx-auto sm:px-8 sm:py-12 md:px-10"
        childVariant="heroSupport"
      >
        <Reveal as="p" className="section-kicker border border-white/18 bg-white/5 text-white">
          {labels.kicker}
        </Reveal>
        <Reveal as="h2" className="mx-auto mt-4 max-w-md text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl">
          <HighlightedText
            text={title ?? labels.title}
            highlight={labels.highlight}
            highlightClassName="text-gold"
          />
        </Reveal>

        {reviewCount > 1 ? (
          <Reveal className="mt-7 flex items-center justify-center gap-4 sm:mt-9">
            <button
              type="button"
              aria-label="Previous review"
              className="grid size-11 place-items-center rounded-full border border-white/18 bg-white/8 text-white transition hover:-translate-y-0.5 hover:bg-white/16"
              onClick={goToPreviousReview}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <p className="min-w-20 text-sm font-semibold text-white/78">
              {activeIndex + 1} / {reviewCount}
            </p>
            <button
              type="button"
              aria-label="Next review"
              className="grid size-11 place-items-center rounded-full border border-white/18 bg-white/8 text-white transition hover:-translate-y-0.5 hover:bg-white/16"
              onClick={goToNextReview}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </Reveal>
        ) : null}

        {featured ? (
          <Reveal className="mt-6 sm:mt-8">
            <motion.div
              animate={reviewCardHeight ? { height: reviewCardHeight } : undefined}
              className="relative overflow-hidden rounded-[0.7rem] bg-white text-[#201b17] premium-hover-surface"
              initial={false}
              transition={reviewCardResizeTransition}
            >
              <div
                aria-hidden="true"
                className="invisible px-5 py-6 sm:px-8 sm:py-8"
                ref={reviewSizerRef}
              >
                <ReviewCardContent review={featured} />
              </div>
              <div className="absolute inset-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    className="px-5 py-6 sm:px-8 sm:py-8"
                    key={featured.id}
                    initial={{
                      opacity: 0,
                      y: 14,
                      scale: 0.992,
                      filter: "blur(3px)",
                    }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.992,
                      filter: "blur(3px)",
                    }}
                    transition={reviewContentTransition}
                  >
                    <ReviewCardContent review={featured} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </Reveal>
        ) : null}

        {reviewSummary && googleReviewsUrl && summaryRating ? (
          <Reveal className="mt-7 sm:mt-8">
            <a
              className="mx-auto flex w-full max-w-xl items-center justify-center gap-3 rounded-[0.7rem] border border-white/14 bg-white px-4 py-3 text-[#201b17] shadow-[0_16px_36px_rgba(40,32,24,0.16)] transition hover:-translate-y-0.5 hover:bg-ivory sm:w-fit sm:px-5"
              href={googleReviewsUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ReviewStars
                rating={summaryRating}
                sourceLabel={reviewSummary.sourceLabel}
              />
              <span className="text-sm font-semibold">
                {reviewSummary.rating}
              </span>
              <span className="text-sm text-muted-foreground">
                {reviewSummary.count} {labels.kicker}
              </span>
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </Reveal>
        ) : null}
      </Reveal>
    </section>
  );
}
