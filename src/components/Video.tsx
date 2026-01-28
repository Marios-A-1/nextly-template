"use client";
import { useState } from "react";

interface VideoProps {
  videoId: string;
}

export function Video({ videoId }: Readonly<VideoProps>) {
  const [playVideo, setPlayVideo] = useState(false);

  if (!videoId) return null;

  return (
    <div className="relative w-full h-[500px] max-w-4xl justify-self-center overflow-hidden rounded-2xl bg-primary cursor-pointer bg-gradient-to-tr from-accent to-primary">
      {!playVideo && (
        <button
          onClick={() => setPlayVideo(!playVideo)}
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card text-text shadow-2xl transition hover:bg-accent lg:h-28 lg:w-28"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 lg:h-28 lg:w-28"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Play Video</span>
        </button>
      )}
      {playVideo && (
        <iframe
          src={``}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full aspect-video"
        />
      )}
    </div>
  );
}
