import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "src");
const output = path.join(root, "dist");

await fs.rm(output, { recursive: true, force: true });
await fs.cp(source, output, { recursive: true });

console.log(`Built PUMANext into ${path.relative(root, output)}/`);
