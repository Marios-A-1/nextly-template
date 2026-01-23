"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type LazyVimeoProps = {
  videoId: string;
  title: string;
  className?: string;
  iframeClassName?: string;
  params?: string;
  forceLoad?: boolean;
  playOnLoad?: boolean;
  command?: "play" | "pause";
  commandToken?: number;
  thumbnailAlt?: string;
  thumbnailUrl?: string;
  rootMargin?: string;
  allow?: string;
};

const DEFAULT_ALLOW = "autoplay; fullscreen; picture-in-picture";

const buildVimeoSrc = (videoId: string, params?: string) => {
  if (!params) return `https://player.vimeo.com/video/${videoId}`;
  return `https://player.vimeo.com/video/${videoId}?${params}`;
};

const mergeVimeoParams = (params?: string, overrides?: Record<string, string>) => {
  if (!overrides || Object.keys(overrides).length === 0) return params;
  const search = new URLSearchParams(params ?? "");
  Object.entries(overrides).forEach(([key, value]) => {
    search.set(key, value);
  });
  const merged = search.toString();
  return merged.length ? merged : undefined;
};

export default function LazyVimeo({
  videoId,
  title,
  className,
  iframeClassName,
  params,
  forceLoad = false,
  playOnLoad = false,
  command,
  commandToken,
  thumbnailAlt,
  thumbnailUrl,
  rootMargin = "200px 0px",
  allow = DEFAULT_ALLOW,
}: LazyVimeoProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const pendingCommandRef = useRef<"play" | "pause" | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (forceLoad) {
      setShouldLoad(true);
    }
  }, [forceLoad]);

  useEffect(() => {
    if (shouldLoad) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  const postCommand = (nextCommand: "play" | "pause") => {
    const targetWindow = iframeRef.current?.contentWindow;
    if (!targetWindow) return false;
    targetWindow.postMessage({ method: nextCommand }, "*");
    return true;
  };

  useEffect(() => {
    if (!shouldLoad || !command) return;
    if (!isIframeReady) {
      pendingCommandRef.current = command;
      return;
    }
    postCommand(command);
  }, [command, commandToken, isIframeReady, shouldLoad]);

  const shouldAutoplay = playOnLoad && !isIframeReady;
  const resolvedParams = shouldAutoplay
    ? mergeVimeoParams(params, { autoplay: "1", muted: "1", playsinline: "1" })
    : params;
  const iframeSrc = buildVimeoSrc(videoId, resolvedParams);
  const posterSrc = thumbnailUrl ?? "/images/hero-image-01.jpg";
  const posterAlt = thumbnailAlt ?? title;

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad ? (
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          title={title}
          className={`h-full w-full border-0 ${iframeClassName ?? ""}`}
          allow={allow}
          allowFullScreen
          loading="lazy"
          frameBorder={0}
          onLoad={() => {
            setIsIframeReady(true);
            const pending = pendingCommandRef.current;
            if (pending) {
              postCommand(pending);
              pendingCommandRef.current = null;
            }
          }}
        />
      ) : (
        <button
          type="button"
          className="relative block h-full w-full border-0 bg-transparent p-0"
          onClick={() => setShouldLoad(true)}
          aria-label={`Load video: ${title}`}
        >
          <Image
            src={posterSrc}
            alt={posterAlt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </button>
      )}
    </div>
  );
}
