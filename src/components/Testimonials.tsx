"use client";

import { useEffect, useRef, useState, type TouchEvent, type ReactNode } from "react";
import LazyVimeo from "./LazyVimeo";

/* =======================
   Types
======================= */

type VideoTestimonial = {
  id: number;
  type: "video";
  vimeo: string;
};

type GoogleTestimonial = {
  id: number;
  type: "google";
  author: string;
  rating: number;
  text: string;
};

type Testimonial = VideoTestimonial | GoogleTestimonial;

type TestimonialsContent = {
  eyebrow?: ReactNode;
  heading?: ReactNode;
  description?: ReactNode;
  items?: Testimonial[];
};

type TestimonialsProps = {
  content?: TestimonialsContent;
};

/* =======================
   Static fallback (optional)
======================= */

const TESTIMONIALS: Testimonial[] = [
  // example google review
  {
    id: 1,
    type: "google",
    author: "Γιώργος Π.",
    rating: 5,
    text: "Απίστευτη συνεργασία. Results από τον πρώτο μήνα.",
  },
];

/* =======================
   Component
======================= */

export default function TestimonialsCarousel({ content }: TestimonialsProps) {
  const [focus, setFocus] = useState(0);
  const [playRequests, setPlayRequests] = useState<Record<number, boolean>>({});
  const [playStates, setPlayStates] = useState<Record<number, boolean>>({});
  const [videoCommands, setVideoCommands] = useState<
    Record<number, { command: "play" | "pause"; token: number }>
  >({});
  const testimonials = content?.items ?? TESTIMONIALS;
  const total = testimonials.length;
  const prevFocusRef = useRef(focus);

  const requestPause = (id: number) => {
    setPlayStates((current) => {
      setVideoCommands((prev) => {
        const nextToken = (prev[id]?.token ?? 0) + 1;
        return { ...prev, [id]: { command: "pause", token: nextToken } };
      });
      return current[id] ? { ...current, [id]: false } : current;
    });
  };

  const prev = () =>
    setFocus((current) => {
      const currentItem = testimonials[current];
      if (currentItem?.type === "video") requestPause(currentItem.id);
      return (current - 1 + total) % total;
    });

  const next = () =>
    setFocus((current) => {
      const currentItem = testimonials[current];
      if (currentItem?.type === "video") requestPause(currentItem.id);
      return (current + 1) % total;
    });

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    if (startX === null) return;

    const touchEndX = event.changedTouches[0]?.clientX;
    if (typeof touchEndX !== "number") return;

    const deltaX = touchEndX - startX;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) < swipeThreshold) return;

    deltaX > 0 ? prev() : next();
    touchStartX.current = null;
  };

  const handleVideoActivate = (id: number) => {
    setPlayRequests((current) => (current[id] ? current : { ...current, [id]: true }));

    setPlayStates((current) => {
      const nextIsPlaying = !current[id];
      setVideoCommands((prev) => {
        const nextToken = (prev[id]?.token ?? 0) + 1;
        return { ...prev, [id]: { command: nextIsPlaying ? "play" : "pause", token: nextToken } };
      });
      return { ...current, [id]: nextIsPlaying };
    });
  };

  useEffect(() => {
    const previousFocus = prevFocusRef.current;
    if (previousFocus === focus) return;
    const previousItem = testimonials[previousFocus];
    if (previousItem?.type === "video") {
      requestPause(previousItem.id);
    }
    prevFocusRef.current = focus;
  }, [focus, testimonials]);

  return (
    <section
      id="results"
      className="flex w-full scroll-mt-[80px] flex-col items-center justify-center space-y-6 py-12 md:py-24"
    >
      <div className="w-full px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-items-center justify-center items space-y-10 pb-10 -mt-[35%] lg:-mt-60">
          {/* Heading */}
          {/* Carousel */}
          <div className="relative mx-auto mt-6 md:mt-12 flex w-full items-center justify-center gap-4 px-2 touch-pan-y">
            <button
              onClick={prev}
              className="hidden h-10 w-10 items-center justify-center rounded-full border-3 border-primary bg-primary/30 text-primary transition hover:border-primary/70 hover:text-primary/70 hover:bg-gold-200 md:flex mt-[10%]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft />
            </button>

            <div
              className="relative mt-10 -mb-20 h-[420px] w-full max-w-[360px] overflow-hidden md:h-[520px] md:max-w-[460px]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {testimonials.map((testimonial, index) => {
                const offset = calculateOffset(index, focus, total);
                const hidden = Math.abs(offset) > 1;
                const clampedOffset = Math.max(Math.min(offset, 1), -1);
                const isActive = offset === 0;
                const isGoogle = testimonial.type === "google";
                const inactiveOpacity = isGoogle ? 0 : 0.0;
                const playRequested = testimonial.type === "video" && Boolean(playRequests[testimonial.id]);
                const videoCommand = testimonial.type === "video" ? videoCommands[testimonial.id] : undefined;

                return (
                  <div
                    key={testimonial.id}
                     className={`absolute left-1/2 flex -translate-x-1/2 items-center justify-center transition-all duration-500 ease-out 
                      ${
                        testimonial.type === "google"
                          ? "top-1/2"
                          : "-translate-y-1/2 top-4/10 lg:top-8/10 mt-10 lg:-mt-20"
                      }
                    `}
                    style={{
                      transform: `translate(-50%, -50%) translateX(${clampedOffset * 90}%) scale(${
                        isActive ? 1 : 0.85
                      })`,
                      opacity: hidden ? 0 : isActive ? 1 : inactiveOpacity,
                      filter: isActive ? "none" : "blur(1px)",
                      zIndex: isActive ? 3 : 1,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                    onClick={
                      testimonial.type === "video"
                        ? () => handleVideoActivate(testimonial.id)
                        : undefined
                    }
                  >
                    <div className="relative">
                      <div className="relative overflow-hidden rounded-[28px] border border-gold-500 bg-card/90">
                        {testimonial.type === "video" ? (
                          <LazyVimeo
                            videoId={testimonial.vimeo}
                            title={`Testimonial video ${testimonial.id}`}
                            className="aspect-[9/16] w-[200px] md:w-[320px]"
                            iframeClassName="pointer-events-none md:pointer-events-auto"
                            forceLoad={playRequested}
                            playOnLoad={playRequested}
                            command={videoCommand?.command}
                            commandToken={videoCommand?.token}
                          />
                        ) : (
                          <GoogleReviewCard review={testimonial} />
                        )}
                      </div>
                      {isActive ? (
                        <div className="absolute left-1/2 top-full mt-4 -translate-x-1/2 text-xs font-semibold uppercase tracking-wide text-muted">
                          {(() => {
                            const typeItems = testimonials.filter(
                              (item) => item.type === testimonial.type
                            );
                            const typeIndex =
                              typeItems.findIndex((item) => item.id === testimonial.id) + 1;
                            const typeTotal = typeItems.length;
                            return `${typeIndex}/${typeTotal}`;
                          })()}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={next}
              className="hidden h-10 w-10 items-center justify-center rounded-full border-3 border-primary bg-primary/30 text-primary transition hover:border-primary/60 hover:text-primary/70 hover:bg-gold-200 md:flex mt-[10%]"
              aria-label="Next testimonial"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =======================
   Helpers
======================= */

function calculateOffset(index: number, focus: number, total: number) {
  let offset = index - focus;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

/* =======================
   Google Review Card
======================= */

function GoogleReviewCard({ review }: { review: GoogleTestimonial }) {
  return (
    <div className="flex w-[300px] md:w-[420px]   flex-col rounded-[1.7rem] border-2 border-primary justify-between p-6">
      <div>
        <div className="flex items-center gap-2 pb-3 ">
          <GoogleIcon />
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} filled={i < review.rating} />
            ))}
          </div>
        </div>
        <p className="text-sm md:text-base text-muted leading-relaxed">
          “{review.text}”
        </p>
      </div>
      <div className="pt-4 text-sm font-medium text-text">
        {review.author}
      </div>
    </div>
  );
}

/* =======================
   Icons
======================= */

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.6 20.1H42V20H24v8h11.3C33.6 32.1 29.2 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1 7.3 2.7l5.7-5.7C33.5 6.5 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-8 19-20 0-1.3-.1-2.6-.4-3.9z"
    />
  </svg>
);

const Star = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#facc15" : "none"} stroke="#facc15">
    <path
      strokeWidth="1.5"
      d="M12 17.3l-6.2 3.7 1.7-7.1L2 8.9l7.2-.6L12 1.7l2.8 6.6 7.2.6-5.5 5 1.7 7.1z"
    />
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 14 4 8l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="m6 14 6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
