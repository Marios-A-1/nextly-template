import { createRequire } from "node:module";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

function loadPlaywright() {
  try {
    return createRequire(import.meta.url)("playwright");
  } catch {
    const localAppData = process.env.LOCALAPPDATA;

    if (!localAppData) {
      throw new Error("Playwright is not installed and LOCALAPPDATA is unavailable.");
    }

    const npxCache = join(localAppData, "npm-cache", "_npx");
    const cacheEntries = existsSync(npxCache) ? readdirSync(npxCache) : [];

    for (const entry of cacheEntries) {
      const playwrightPackage = join(npxCache, entry, "node_modules", "playwright", "package.json");

      if (existsSync(playwrightPackage)) {
        return createRequire(playwrightPackage)("playwright");
      }
    }

    throw new Error("Playwright is not installed. Run `npm install -D playwright` or `npx playwright install` before this audit.");
  }
}

const { chromium } = loadPlaywright();

const baseUrl = process.env.MOBILE_AUDIT_BASE_URL ?? "http://127.0.0.1:3000";
const routes = ["/", "/about", "/epemvaseis", "/epemvaseis/face-lift", "/results"];
const widths = [375, 390, 430, 768];

const chromeExecutable = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({
  executablePath: existsSync(chromeExecutable) ? chromeExecutable : undefined,
});
const failures = [];

for (const width of widths) {
  const page = await browser.newPage({
    viewport: { width, height: width === 768 ? 1024 : 844 },
    reducedMotion: "reduce",
  });

  for (const route of routes) {
    const url = new URL(route, baseUrl).toString();

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});

    const result = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      offenders: [...document.querySelectorAll("body *")]
        .map((element) => {
          const rect = element.getBoundingClientRect();

          return {
            tag: element.tagName.toLowerCase(),
            className: String(element.className ?? "").slice(0, 120),
            text: String(element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 80),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            scrollWidth: element.scrollWidth,
          };
        })
        .filter((element) => element.right > window.innerWidth + 2 || element.left < -2 || element.scrollWidth > element.width + 2)
        .slice(0, 8),
    }));

    if (result.scrollWidth > result.innerWidth || result.bodyScrollWidth > result.innerWidth) {
      failures.push({
        route,
        width,
        innerWidth: result.innerWidth,
        scrollWidth: result.scrollWidth,
        bodyScrollWidth: result.bodyScrollWidth,
        offenders: result.offenders,
      });
    }
  }

  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error("Mobile overflow failures:");
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log("No horizontal overflow detected at 375, 390, 430, or 768 widths.");
