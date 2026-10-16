import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "src/index.html",
  "src/assets/js/app.js",
  "src/assets/css/styles.css",
  "src/assets/css/wizard.css",
  "src/assets/css/brand.css",
  "src/assets/css/accessibility.css",
  "vercel.json",
];

const failures = [];
for (const relativePath of required) {
  try {
    const stat = await fs.stat(path.join(root, relativePath));
    if (!stat.isFile() || stat.size === 0) failures.push(`${relativePath} is empty`);
  } catch {
    failures.push(`${relativePath} is missing`);
  }
}

const html = await fs.readFile(path.join(root, "src/index.html"), "utf8");
const app = await fs.readFile(path.join(root, "src/assets/js/app.js"), "utf8");
for (const asset of [
  "assets/css/styles.css",
  "assets/css/wizard.css",
  "assets/css/brand.css",
  "assets/css/accessibility.css",
  "assets/js/app.js",
]) {
  if (!html.includes(asset)) failures.push(`index.html does not reference ${asset}`);
}
for (const route of ["home", "create", "monthly", "review", "portfolio", "library"]) {
  if (!app.includes(`${route}:`)) failures.push(`app.js is missing the ${route} route`);
}
if (!html.includes("<title>PUMANext</title>")) failures.push("PUMANext page title is missing");

if (failures.length) {
  console.error(failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Checks passed (${required.length} required files, 6 application routes).`);
