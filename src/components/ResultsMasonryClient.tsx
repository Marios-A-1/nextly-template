"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Masonry from "./Masonry";

type MasonryItem = {
  id: string;
  img: string;
  url: string;
  height?: number;
  width?: number;
  alt?: string;
};

type ResultsImage = {
  src: string;
  name: string;
};

type ResultsPage = {
  items: ResultsImage[];
  nextOffset: number | null;
};

const mapResultsItems = (items: ResultsImage[]): MasonryItem[] =>
  items.map((file, index) => ({
    id: `result-${file.name || index}`,
    img: file.src,
    url: file.src,
    alt: file.name || "Result image"
  }));

const ResultsMasonryClient = ({
  baseItems,
  initialPage
}: {
  baseItems: MasonryItem[];
  initialPage: ResultsPage;
}) => {
  const initialItems = useMemo(
    () => (baseItems.length ? baseItems : mapResultsItems(initialPage.items)),
    [baseItems, initialPage.items]
  );
  const [displayItems, setDisplayItems] = useState<MasonryItem[]>(initialItems);
  const [nextOffset, setNextOffset] = useState<number | null>(initialPage.nextOffset);
  const [isPending, startTransition] = useTransition();
  const queueRef = useRef<MasonryItem[]>([]);
  const processingRef = useRef(false);

  const allItems = useMemo(() => displayItems, [displayItems]);

  const preloadImage = (item: MasonryItem) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.src = item.img;
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

  const processQueue = async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    while (queueRef.current.length) {
      const next = queueRef.current.shift();
      if (!next) break;
      await preloadImage(next);
      setDisplayItems((prev) => [...prev, next]);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }

    processingRef.current = false;
  };

  const enqueueItems = (items: MasonryItem[]) => {
    if (!items.length) return;
    queueRef.current.push(...items);
    processQueue();
  };

  const handleLoadMore = () => {
    if (nextOffset === null || isPending) return;

    startTransition(async () => {
      const response = await fetch(
        `/api/results-images?limit=24&offset=${encodeURIComponent(nextOffset)}`
      );
      if (!response.ok) return;
      const data = (await response.json()) as ResultsPage;
      enqueueItems(mapResultsItems(data.items));
      setNextOffset(data.nextOffset);
    });
  };

  return (
    <div className="space-y-6">
      <Masonry
        items={allItems}
        animateFrom="bottom"
        preload
        initialAnimationKey="results-masonry"
      />
      {nextOffset !== null ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-full border border-border bg-white px-6 py-2 text-sm font-semibold text-text shadow-sm transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleLoadMore}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Δείτε Περισσότερα"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ResultsMasonryClient;
