import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const componentSource = readFileSync(
  "src/components/sections/Testimonials.tsx",
  "utf8",
);
test("testimonials section shows one review at a time with full-list navigation", () => {
  assert.ok(
    !componentSource.includes("slice(0, 4)"),
    "Testimonials should not cap the review list to four items.",
  );
  assert.match(componentSource, /items\.length/);
  assert.match(componentSource, /goToPreviousReview/);
  assert.match(componentSource, /goToNextReview/);
  assert.match(componentSource, /review\.quote \?/);
  assert.match(componentSource, /mode="wait"/);
  assert.ok(!componentSource.includes("min-h-[36rem]"));
  assert.ok(!componentSource.includes("min-h-[11rem]"));
  assert.ok(
    !componentSource.includes("items.map((item) =>"),
    "Testimonials should not render all review cards at once.",
  );
});

test("testimonials section keeps the background crop stable while review height animates", () => {
  assert.match(componentSource, /<section/);
  assert.doesNotMatch(componentSource, /<motion\.section/);
  assert.match(componentSource, /reviewSizerRef/);
  assert.match(componentSource, /ResizeObserver/);
  assert.match(componentSource, /reviewCardHeight/);
  assert.match(componentSource, /stock-testimonial-bg stock-image absolute -inset-8/);
  assert.match(componentSource, /animate=\{\{ scale: backgroundScale \}\}/);
  assert.doesNotMatch(componentSource, /min-h-\[36rem\]/);
  assert.doesNotMatch(componentSource, /sm:min-h-\[38rem\]/);
  assert.doesNotMatch(componentSource, /min-h-\[11rem\]/);
  assert.doesNotMatch(componentSource, /sm:min-h-\[12rem\]/);
});
