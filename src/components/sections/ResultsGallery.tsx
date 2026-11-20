"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type ResultImage = { name: string; src: string };
type ResultsPage = { items: ResultImage[]; nextOffset: number | null };

export function ResultsGallery({ initialPage }: { initialPage: ResultsPage }) {
  const [items, setItems] = useState(initialPage.items);
  const [offset, setOffset] = useState(initialPage.nextOffset);
  const [selected, setSelected] = useState<ResultImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);
  const thumbnail = useRef<HTMLButtonElement | null>(null);

  async function loadMore() {
    if (offset === null || inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setFailed(false);

    try {
      const response = await fetch(`/api/results-images?limit=24&offset=${offset}`);
      if (!response.ok) throw new Error("Gallery page unavailable");
      const page: ResultsPage = await response.json();
      setItems((previous) => [...previous, ...page.items]);
      setOffset(page.nextOffset);
    } catch {
      setFailed(true);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => (
          <button
            type="button"
            aria-label={`Μεγέθυνση φωτογραφίας ${index + 1}`}
            key={item.name}
            onClick={(event) => {
              thumbnail.current = event.currentTarget;
              setSelected(item);
            }}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-xl border border-border bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Image
              src={encodeURI(item.src)}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 260px"
              className="object-contain motion-safe:transition-transform motion-safe:group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      {offset !== null && (
        <div className="flex flex-col items-center gap-2">
          <AnimatedButton onClick={loadMore} disabled={loading}>
            {loading ? "Φόρτωση…" : "Δείτε περισσότερα"}
          </AnimatedButton>
          {failed && <p role="alert" className="text-sm text-red-800">Οι φωτογραφίες δεν φορτώθηκαν. Δοκιμάστε ξανά.</p>}
        </div>
      )}
      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent
          className="w-[calc(100%-1.5rem)] max-w-[920px] p-3 pt-10 sm:max-w-[920px]"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            thumbnail.current?.focus();
          }}
        >
          <DialogTitle className="sr-only">Φωτογραφία αποτελέσματος</DialogTitle>
          <DialogDescription className="sr-only">Μεγέθυνση φωτογραφίας από τη συλλογή αποτελεσμάτων.</DialogDescription>
          {selected && (
            <div className="relative h-[min(73svh,690px)]">
              <Image src={encodeURI(selected.src)} alt="Φωτογραφία αποτελέσματος" fill sizes="(max-width: 920px) 100vw, 920px" className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
