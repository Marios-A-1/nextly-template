import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/api/leads/route.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

const lead = {
  name: "Preview Test",
  email: "preview@example.com",
  phone: "2100000000",
  message: "Synthetic appointment request",
  pageUrl: "https://example.com/epemvaseis",
};

function route(fetch, env = { LEADS_API_URL: "https://example.com/hook", LEADS_API_KEY: "test-key" }) {
  const exports = {};
  vm.runInNewContext(outputText, { exports, fetch, Response, AbortSignal, process: { env } });
  return exports.POST;
}

function request(payload) {
  return new Request("https://example.com/api/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

test("forwards the original webhook contract plus phone", async () => {
  let calls = 0;
  const post = route(async (url, options) => {
    calls++;
    assert.equal(url, "https://example.com/hook");
    assert.equal(options.headers.Authorization, "Bearer test-key");
    assert.equal(options.method, "POST");
    const { createdAt, ...payload } = JSON.parse(options.body);
    assert.equal(new Date(createdAt).toISOString(), createdAt);
    assert.deepEqual(payload, { ...lead, source: "popup-widget", secret: "test-key" });
    return Response.json({ success: true });
  });
  const response = await post(request(lead));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(calls, 1);
});

test("rejects invalid submissions and discards the honeypot without calling the webhook", async () => {
  let calls = 0;
  const post = route(async () => { calls++; });
  assert.equal((await post(request({ ...lead, phone: "invalid" }))).status, 400);
  assert.equal((await post(request({ ...lead, email: "no-at" }))).status, 400);
  assert.equal((await post(request({ ...lead, message: " " }))).status, 400);
  assert.equal((await post(request({ ...lead, botcheck: "spam" }))).status, 200);
  assert.equal(calls, 0);
});

test("reports upstream errors without retrying the submission", async () => {
  for (const reject of [
    () => new Response(null, { status: 503 }),
    () => Response.json({ success: false }),
    () => { throw new Error("network unavailable"); },
  ]) {
    let calls = 0;
    const response = await route(async () => { calls++; return reject(); })(request(lead));
    assert.equal(response.status, 502);
    assert.equal((await response.json()).success, false);
    assert.equal(calls, 1);
  }
  assert.equal((await route(async () => assert.fail("called without config"), {})(request(lead))).status, 500);
});
