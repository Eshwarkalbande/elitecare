// Reads the three dictionaries and reports key counts + duplicates.
// Run from frontend/:  node scripts/check-i18n.js
// Pass --fix to drop duplicate keys, keeping the LAST value written.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(here, "..", "src", "i18n");

function keysOf(file) {
  const source = fs.readFileSync(path.join(dir, file), "utf8");
  return [...source.matchAll(/"([a-zA-Z0-9_.]+)"\s*:/g)].map((m) => m[1]);
}

const files = { en: "en.js", hi: "hi.js", mr: "mr.js" };
const fix = process.argv.includes("--fix");
const all = {};
let problems = 0;

for (const [code, file] of Object.entries(files)) {
  const full = path.join(dir, file);
  const source = fs.readFileSync(full, "utf8");
  const keys = keysOf(file);
  const dupes = [...new Set(keys.filter((k, i) => keys.indexOf(k) !== i))];
  all[code] = new Set(keys);
  console.log(`${code}: ${keys.length} keys`);

  if (dupes.length) {
    problems += 1;
    console.log(`   duplicate keys: ${dupes.join(", ")}`);
    if (fix) {
      // Keeps the FIRST occurrence of each key, so an accidental re-paste at the
      // bottom of the file does not shadow the original wording.
      const seen = new Set();
      const kept = [];
      for (const line of source.split("\n")) {
        const match = line.match(/^\s*"([a-zA-Z0-9_.]+)"\s*:/);
        if (match) {
          if (seen.has(match[1])) continue;
          seen.add(match[1]);
        }
        kept.push(line);
      }
      fs.writeFileSync(full, kept.join("\n"));
      console.log(`   --fix: removed ${keys.length - seen.size} duplicate line(s) from ${file}`);
    }
  }
}

// Every non-English key must exist in en.js, or it can never be shown.
for (const code of ["hi", "mr"]) {
  const orphans = [...all[code]].filter((k) => !all.en.has(k));
  if (orphans.length) {
    problems += 1;
    console.log(`${code}: keys missing from en.js: ${orphans.join(", ")}`);
  }
}

const missing = [...all.en].filter((k) => !all.hi.has(k) || !all.mr.has(k));
if (missing.length) {
  console.log(`\n${missing.length} key(s) untranslated (English fallback is used):`);
  console.log(`   ${missing.join(", ")}`);
}

console.log(problems ? "\nPROBLEMS FOUND" : "\nNo duplicate or orphan keys.");
