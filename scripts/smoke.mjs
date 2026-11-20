import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const baseUrl = process.env.CLINIC_BASE_URL ?? "http://127.0.0.1:3270";
const source = readFileSync(new URL("../src/content/epemvaseis.js", import.meta.url), "utf8");
const slugs = Array.from(source.matchAll(/^\s*slug:\s*"([^"]+)"/gm), ([, slug]) => slug);
assert.equal(slugs.length, 26);

async function get(path, status = 200) {
  const response = await fetch(new URL(path, baseUrl), { redirect: "manual" });
  assert.equal(response.status, status, path);
  return response;
}

for (const path of ["/", "/about", "/results", "/epemvaseis", ...slugs.map((slug) => `/epemvaseis/${slug}`)]) {
  const html = await (await get(path)).text();
  assert.match(html, /<html lang="el"/, path);
  assert.ok(html.includes(`href="https://artofthepossible.vercel.app${path === "/" ? "" : path}"`), `canonical ${path}`);
}

const home = await (await get("/")).text();
assert.ok(home.indexOf('id="services"') < home.indexOf('id="doctor-showcase"') && home.includes('id="doctor-showcase"'));
assert.match(home, /id="doctor-showcase"[\s\S]*?href="\/about"/);
const about = await (await get("/about")).text();
assert.match(about, /id="doctor-story".*id="clinic-values"/s);
assert.match(about, /Πανεπιστημίου της Μάλτας/);
assert.match(about, /Εμπιστοσύνη που διαρκεί/);
const treatments = await (await get("/epemvaseis")).text();
assert.equal((treatments.match(/data-treatment-trigger="/g) ?? []).length, 26);
const listSection = treatments.match(/<section[^>]*aria-labelledby="treatment-list-title"[^>]*>(.*?)<\/section>/s)?.[1];
assert.ok(listSection?.includes("Οι υπηρεσίες μας"), "Melina section kicker directly below the hero");
assert.ok(!listSection?.includes('aria-label="Κατηγορίες επεμβάσεων"'), "filters sit outside the accordion section");
assert.match(listSection ?? "", /data-treatment-trigger="blefaroplastiki" aria-expanded="true"/);


await get("/epemvaseis/unknown-smoke-test", 404);
const filter = new URLSearchParams({ cat: "Αισθητική Χειρουργική", sub: "prosopo", step: "3" });
const filtered = await (await get(`/epemvaseis?${filter}`)).text();
assert.equal(filtered.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1].replace(/<[^>]+>/g, ""), "Πρόσωπο");
assert.ok(filtered.includes('data-treatment-trigger="face-lift"'));
assert.ok(!filtered.includes('data-treatment-trigger="egkavmata"'));
function treatmentBackHref(html) {
  const backLink = html.match(/<a[^>]*data-treatment-back="true"[^>]*>/)?.[0];
  return backLink?.match(/href="([^"]+)"/)?.[1].replaceAll("&amp;", "&");
}

const detail = await (await get(`/epemvaseis/face-lift?${filter}`)).text();
assert.equal(treatmentBackHref(detail), `/epemvaseis?${filter}`);
assert.match(detail, /id="treatment-information".*id="treatment-faq"/s);
assert.match(detail, /data-treatment-card-grid="true"/);


const categoryOnly = new URLSearchParams({ cat: filter.get("cat"), step: "3" });
const categoryDetail = await (await get(`/epemvaseis/face-lift?${categoryOnly}`)).text();
assert.equal(treatmentBackHref(categoryDetail), `/epemvaseis?${categoryOnly}`);
const rootDetail = await (await get("/epemvaseis/face-lift?step=3")).text();
assert.equal(treatmentBackHref(rootDetail), "/epemvaseis");

const invalid = await (await get("/epemvaseis?cat=unknown&sub=unknown&step=3")).text();
assert.equal((invalid.match(/data-treatment-trigger="/g) ?? []).length, 26);


const sitemap = await (await get("/sitemap.xml")).text();
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 30);
assert.doesNotMatch(sitemap, /dentist-site|\/el\//);

const firstPage = await (await get("/api/results-images")).json();
const secondPage = await (await get("/api/results-images?offset=24")).json();
const lastPage = await (await get("/api/results-images?offset=336")).json();
assert.equal(firstPage.items.length, 24);
assert.equal(firstPage.nextOffset, 24);
assert.equal(firstPage.total, 337);
assert.equal(secondPage.nextOffset, 48);
assert.equal(new Set([...firstPage.items, ...secondPage.items].map(({ name }) => name)).size, 48);
assert.equal(lastPage.items.length, 1);
assert.equal(lastPage.nextOffset, null);
await get(encodeURI(lastPage.items[0].src));

console.log("Verified the Melina treatment layouts, all public routes, filter navigation, the sitemap, and gallery pagination.");
