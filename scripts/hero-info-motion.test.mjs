import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const heroSource = readFileSync("src/components/sections/Hero.tsx", "utf8");
const globalCssSource = readFileSync("src/app/globals.css", "utf8");

test("hero info glass surface animates before the staggered content", () => {
  const carouselSource = readFileSync("src/components/sections/HeroInfoCarousel.tsx", "utf8");
  const heroInfoSource = `${heroSource}\n${carouselSource}`;

  assert.match(heroInfoSource, /data-hero-info-surface/);
  assert.match(heroInfoSource, /motion-safe:animate-\[heroInfoSurfaceIn_/);
  assert.doesNotMatch(heroInfoSource, /variant="panel"[\s\S]*data-hero-info-surface/);
  assert.match(heroInfoSource, /data-hero-info-list/);
  assert.match(heroInfoSource, /motion-safe:animate-\[heroInfoItemIn_/);
  assert.match(heroInfoSource, /animationDelay: `\$\{0\.72 \+ index \* 0\.12\}s`/);
  assert.match(globalCssSource, /@keyframes heroInfoSurfaceIn/);
  assert.match(globalCssSource, /@keyframes heroInfoItemIn/);
});

test("hero background uses the clinic’s existing media", () => {
  assert.match(heroSource, /hero-clinic-photo/);
  assert.match(globalCssSource, /background-image: url\("\/img\/stock-blast-2\.webp"\)/);
});

test("mobile hero info cards render three static cards without infinite cycling", () => {
  const carouselSource = readFileSync("src/components/sections/HeroInfoCarousel.tsx", "utf8");

  assert.match(heroSource, /<HeroInfoCarousel items=\{site\.heroInfoItems\} \/>/);
  assert.match(carouselSource, /const staticItems = items\.slice\(0, 3\);/);
  assert.match(carouselSource, /data-hero-info-cards/);
  assert.doesNotMatch(carouselSource, /"use client";/);
  assert.doesNotMatch(carouselSource, /AUTO_SLIDE_MS/);
  assert.doesNotMatch(carouselSource, /useEffect|useMemo|useRef|useCallback/);
  assert.doesNotMatch(carouselSource, /loopingItems|mobileItems/);
  assert.doesNotMatch(carouselSource, /data-hero-info-carousel/);
  assert.doesNotMatch(carouselSource, /aria-roledescription="carousel"/);
  assert.doesNotMatch(carouselSource, /scrollToIndex|resetLoopEdge/);
  assert.doesNotMatch(carouselSource, /window\.setInterval|setTimeout/);
});
