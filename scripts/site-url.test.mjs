import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);

function loadSiteUrlModule(env = {}) {
  const source = readFileSync("src/lib/siteUrl.ts", "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });

  const sandboxModule = { exports: {} };
  vm.runInNewContext(outputText, {
    exports: sandboxModule.exports,
    module: sandboxModule,
    process: { env },
    require,
    URL,
  });

  return sandboxModule.exports;
}

test("site URL defaults to the current Vercel production URL", () => {
  const { siteUrl, toAbsoluteSiteUrl } = loadSiteUrlModule();

  assert.equal(siteUrl, "https://artofthepossible.vercel.app");
  assert.equal(
    toAbsoluteSiteUrl("/epemvaseis/face-lift"),
    "https://artofthepossible.vercel.app/epemvaseis/face-lift",
  );
});

test("site URL can be overridden cleanly for the future client domain", () => {
  const { siteUrl, toAbsoluteSiteUrl } = loadSiteUrlModule({
    NEXT_PUBLIC_SITE_URL: "https://example-clinic.gr/",
  });

  assert.equal(siteUrl, "https://example-clinic.gr");
  assert.equal(toAbsoluteSiteUrl("about"), "https://example-clinic.gr/about");
});
