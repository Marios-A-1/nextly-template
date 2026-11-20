import { readdir } from "node:fs/promises";
import path from "node:path";

const resultsDirectory = path.join(process.cwd(), "public", "img", "results");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export async function getResultsPage(offset = 0, limit = 24) {
  const files = (await readdir(resultsDirectory))
    .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
    .sort((left, right) => {
      const leftNumber = Number.parseInt(left, 10);
      const rightNumber = Number.parseInt(right, 10);
      if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber !== rightNumber) {
        return leftNumber - rightNumber;
      }
      return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
    });
  const page = files.slice(offset, offset + limit);
  const nextOffset = offset + page.length;

  return {
    items: page.map((name) => ({ name, src: `/img/results/${name}` })),
    nextOffset: nextOffset < files.length ? nextOffset : null,
    total: files.length,
  };
}
