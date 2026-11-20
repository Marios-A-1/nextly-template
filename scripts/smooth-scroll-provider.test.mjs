import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const smoothScrollSource = readFileSync(
  "src/components/layout/SmoothScrollProvider.tsx",
  "utf8",
);
const globalCssSource = readFileSync("src/app/globals.css", "utf8");

test("Lenis reads live dimensions and resizes after route content changes", () => {
  assert.match(smoothScrollSource, /import \{ usePathname \} from "next\/navigation"/);
  assert.match(smoothScrollSource, /const pathname = usePathname\(\)/);
  assert.match(smoothScrollSource, /const lenisRef = useRef<Lenis \| null>\(null\)/);
  assert.match(smoothScrollSource, /autoToggle:\s*true/);
  assert.match(smoothScrollSource, /naiveDimensions:\s*true/);
  assert.match(smoothScrollSource, /lenisRef\.current\?\.resize\(\)/);
  assert.match(smoothScrollSource, /\}, \[pathname\]\)/);
});

test("Lenis autoToggle has the required overflow transition CSS", () => {
  assert.match(
    globalCssSource,
    /\.lenis\.lenis-autoToggle\s*{[\s\S]*transition-property:\s*overflow;[\s\S]*transition-duration:\s*1ms;[\s\S]*transition-behavior:\s*allow-discrete;[\s\S]*}/,
  );
});
