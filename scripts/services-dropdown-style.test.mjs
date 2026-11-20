import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync("src/components/layout/ServicesDropdown.tsx", "utf8");

test("services dropdown uses dark row navigation instead of pale card grid", () => {
  assert.match(source, /bg-\[#161411\]/);
  assert.match(source, /data-services-dropdown-panel/);
  assert.match(source, /data-services-dropdown-row/);
  assert.match(source, /divide-y divide-white\/10/);
  assert.doesNotMatch(source, /grid grid-cols-2 gap-2/);
  assert.doesNotMatch(source, /bg-\[#fbfdf9\]\/96/);
  assert.doesNotMatch(source, /rounded-\[1\.35rem\]/);
});

test("services dropdown row hover motion is subtle and integrated with icon motion", () => {
  assert.match(source, /transition-\[background-color,color,translate\]/);
  assert.match(source, /transition-\[background-color,color,rotate,scale\]/);
  assert.match(source, /hover:translate-x-0\.5/);
  assert.match(source, /group-hover\/dropdown-row:rotate-\[-45deg\]/);
  assert.match(source, /group-hover\/dropdown-row:scale-105/);
  assert.doesNotMatch(source, /transition-\[background-color,color,transform\]/);
  assert.doesNotMatch(source, /premium-hover-surface group\/dropdown-row/);
});
