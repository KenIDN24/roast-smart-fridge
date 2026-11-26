// Roast the Smart Fridge: One Line, Best Laugh Wins
// Entry: one line roasting a smart home gadget (the smart doorbell).
// Writes the line + trailing newline to /output/entry.txt, deterministically.
//
// Sealed gate (RULES.txt): entry.txt must be UTF-8 text of 1-160 characters,
// not only whitespace. The guard below enforces that range and refuses to
// write anything invalid (non-zero exit, no file written).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My smart doorbell filmed a guy stealing my Amazon package in 4K and sent me the clip so I could grieve in high definition.";

const MIN_CHARS = 1;
const MAX_CHARS = 160;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Guard: length range, in characters (code points).
const length = [...LINE].length;
if (length < MIN_CHARS || length > MAX_CHARS) {
  fail(`entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only whitespace");
}
// Reject control characters (except none are expected in a one-line roast)
// and any leading/trailing whitespace — the entry must be exactly the line.
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (LINE !== LINE.trim()) {
  fail("entry must not have leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");
// Read-back check: the file on disk must be exactly the line + newline.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk !== LINE + "\n") {
  fail("read-back mismatch: entry.txt does not match the line");
}
console.log(`wrote entry.txt (${length} chars)`);
