 "use client";
import NextImage from "next/image";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const mediaQueries = [
  '(min-width:1500px)',
  '(min-width:1000px)',
  '(min-width:600px)',
  '(min-width:400px)'
];
const mediaValues = [5, 4, 3, 2];

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = useCallback(() => {
    if (typeof window === 'undefined') return defaultValue;
    return values[queries.findIndex(q => window.matchMedia(q).matches)] ?? defaultValue;
  }, [defaultValue, queries, values]);

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setValue(get);
    queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
  }, [get, queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (items: Item[]): Promise<Record<string, number>> => {
  const entries = await Promise.all(
    items.map(
      item =>
        new Promise<{ id: string; ratio: number }>(resolve => {
          if (typeof window === "undefined") {
            const ratio =
              item.aspectRatio ??
              (item.width && item.height ? item.height / item.width : 1);
            resolve({ id: item.id, ratio });
            return;
          }
          const img = new window.Image();
          img.src = item.img;
          img.onload = () => {
            const ratio = img.naturalWidth ? img.naturalHeight / img.naturalWidth : 1;
            resolve({ id: item.id, ratio });
          };
          img.onerror = () => {
            const ratio =
              item.aspectRatio ??
              (item.width && item.height ? item.height / item.width : 1);
            resolve({ id: item.id, ratio });
          };
        })
    )
  );

  return entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.id] = entry.ratio;
    return acc;
  }, {});
};

interface Item {
  id: string;
  img: string;
  url: string;
  alt?: string;
  height?: number;
  width?: number;
  aspectRatio?: number;
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  imageFit?: 'cover' | 'contain';
  preload?: boolean;
  lazyLoad?: boolean;
  lazyLoadRootMargin?: string;
  initialAnimationKey?: string;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.15,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  imageFit = 'cover',
  preload = true,
  lazyLoad = false,
  lazyLoadRootMargin = '200px',
  initialAnimationKey
}) => {
  const columns = useMedia(
    mediaQueries,
    mediaValues,
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(() => new Set());
  const animatedIdsRef = useRef<Set<string>>(new Set());

  const getInitialPosition = useCallback((item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };
    const offset = 200;

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: item.y - offset };
      case 'bottom':
        return { x: item.x, y: item.y + offset };
      case 'left':
        return { x: item.x - offset, y: item.y };
      case 'right':
        return { x: item.x + offset, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  }, [animateFrom, containerRef]);

  useEffect(() => {
    let isMounted = true;
    if (!preload) {
      setImageRatios({});
      setImagesReady(true);
      return () => {
        isMounted = false;
      };
    }
    setImagesReady(false);
    const itemsToPreload = items.filter(
      item => !item.aspectRatio && !(item.width && item.height)
    );
    if (!itemsToPreload.length) {
      setImageRatios({});
      setImagesReady(true);
      return () => {
        isMounted = false;
      };
    }
    preloadImages(itemsToPreload).then(ratios => {
      if (!isMounted) return;
      setImageRatios(ratios);
      setImagesReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, [items, preload]);

  useEffect(() => {
    if (!activeItem) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveItem(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeItem]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const ratio =
        imageRatios[child.id] ??
        child.aspectRatio ??
        (child.width && child.height ? child.height / child.width : undefined);
      const fallbackHeight = child.height ?? 360;
      const height = ratio ? columnWidth * ratio : fallbackHeight / 2;
      const y = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, imageRatios, items, width]);

  const gridHeight = useMemo(() => {
    return grid.reduce((max, item) => Math.max(max, item.y + item.h), 0);
  }, [grid]);

  const hasMounted = useRef(false);
  const previousGridRef = useRef<Map<string, GridItem>>(new Map());
  const didInitialAnimationRef = useRef(false);
  const initialAnimationAllowedRef = useRef<boolean | null>(null);

  const shouldRunInitialAnimation = useCallback(() => {
    if (initialAnimationAllowedRef.current !== null) {
      return initialAnimationAllowedRef.current;
    }
    if (typeof window === 'undefined' || !initialAnimationKey) {
      initialAnimationAllowedRef.current = true;
      return true;
    }
    const win = window as unknown as { __masonryInitialAnimations?: Set<string> };
    if (!win.__masonryInitialAnimations) {
      win.__masonryInitialAnimations = new Set();
    }
    if (win.__masonryInitialAnimations.has(initialAnimationKey)) {
      initialAnimationAllowedRef.current = false;
      return false;
    }
    win.__masonryInitialAnimations.add(initialAnimationKey);
    initialAnimationAllowedRef.current = true;
    return true;
  }, [initialAnimationKey]);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    const previousGrid = previousGridRef.current;
    const nextGrid = new Map<string, GridItem>();

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };
      const prev = previousGrid.get(item.id);
      const alreadyAnimated = animatedIdsRef.current.has(item.id);

      if (!hasMounted.current && !didInitialAnimationRef.current && shouldRunInitialAnimation()) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' })
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger
          }
        );
        animatedIdsRef.current.add(item.id);
      } else if (!hasMounted.current) {
        gsap.set(selector, animProps);
        animatedIdsRef.current.add(item.id);
      } else if (!prev && !alreadyAnimated) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' })
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.6,
            ease: 'power3.out'
          }
        );
        animatedIdsRef.current.add(item.id);
      } else if (!prev && alreadyAnimated) {
        gsap.set(selector, animProps);
      } else if (
        prev &&
        (prev.x !== item.x ||
          prev.y !== item.y ||
          prev.w !== item.w ||
          prev.h !== item.h)
      ) {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: 'auto'
        });
      }

      nextGrid.set(item.id, item);
    });

    if (!hasMounted.current) {
      didInitialAnimationRef.current = true;
    }
    previousGridRef.current = nextGrid;
    hasMounted.current = true;
  }, [
    grid,
    imagesReady,
    stagger,
    animateFrom,
    blurToFocus,
    duration,
    ease,
    getInitialPosition,
    shouldRunInitialAnimation
  ]);

  useEffect(() => {
    if (!lazyLoad) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      entries => {
        setVisibleItems(prev => {
          let changed = false;
          const next = new Set(prev);
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const key = (entry.target as HTMLElement).dataset.key;
            if (key && !next.has(key)) {
              next.add(key);
              changed = true;
            }
            observer.unobserve(entry.target);
          });
          return changed ? next : prev;
        });
      },
      { root: null, rootMargin: lazyLoadRootMargin }
    );

    const nodes = Array.from(container.querySelectorAll<HTMLElement>('[data-key]'));
    nodes.forEach(node => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [lazyLoad, lazyLoadRootMargin, grid, imagesReady, containerRef]);

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  const resolveImageUrl = (src: string) => encodeURI(src);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{ height: gridHeight ? `${gridHeight}px` : undefined }}
    >
      {grid.map(item => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content cursor-pointer"
          style={{ willChange: 'transform, width, height, opacity' }}
          onClick={() => setActiveItem(item)}
          onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
        >
          <div
            className="relative w-full h-full bg-center bg-no-repeat rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] uppercase text-[10px] leading-[10px]"
            style={{
              backgroundImage:
                !lazyLoad || visibleItems.has(item.id)
                  ? `url("${resolveImageUrl(item.img)}")`
                  : 'none',
              backgroundSize: imageFit
            }}
          >
            {colorShiftOnHover && (
              <div className="color-overlay absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
            )}
          </div>
        </div>
      ))}
      {activeItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.alt || 'Image preview'}
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -top-10 right-0 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/20"
              onClick={() => setActiveItem(null)}
            >
              Close
            </button>
            <div className="relative h-[90vh] w-full max-h-[90vh]">
              <NextImage
                src={activeItem.img}
                alt={activeItem.alt || 'Selected image'}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="rounded-2xl object-contain "
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Masonry;
