import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync("src/components/layout/MobileMenu.tsx", "utf8");

test("mobile menu header uses the configured logo without descriptive text", () => {
  assert.match(source, /import Image from "next\/image"/);
  assert.match(source, /site\.logoImage \?/);
  assert.match(source, /src=\{site\.logoImage\.src\}/);
  assert.match(source, /alt=\{site\.logoImage\.alt\}/);
  assert.doesNotMatch(source, /\{site\.siteName\}/);
  assert.doesNotMatch(source, /\{site\.siteTagline\}/);
});

test("mobile menu appointment CTA keeps icon, label, and arrow on one stable row", () => {
  assert.match(source, /data-mobile-menu-cta/);
  assert.match(source, /flex-nowrap/);
  assert.match(source, /justify-between/);
  assert.match(source, /flex-1/);
  assert.match(source, /text-nowrap/);
  assert.doesNotMatch(source, /text-ellipsis/);
  assert.doesNotMatch(source, /overflow-hidden text-ellipsis text-nowrap/);
});

test("mobile menu navigation uses open divided rows instead of one framed card", () => {
  assert.match(source, /data-mobile-menu-nav/);
  assert.match(source, /divide-y divide-primary\/10/);
  assert.match(source, /border-y border-primary\/10/);
  assert.match(source, /min-h-\[60px\]/);
  assert.doesNotMatch(source, /rounded-\[1\.25rem\] border border-primary\/10 bg-white\/72 p-1/);
  assert.doesNotMatch(source, /shadow-\[0_14px_40px_rgba\(8,48,51,0\.07\)\]/);
});
