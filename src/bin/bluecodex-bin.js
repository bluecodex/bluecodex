#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

async function findTsxPath() {
  for (let i = 0; i < 5; i++) {
    const binFilename = path.join(
      import.meta.dirname,
      "../".repeat(i),
      "node_modules/.bin/tsx",
    );

    try {
      await fs.access(binFilename, fs.constants.F_OK);
      return binFilename;
    } catch {}
  }

  console.error("Unable to find tsx to initialize bluecodex");
  process.exit(1);
}

const tsxFilename = await findTsxPath();

const bootFilename = path.join(import.meta.dirname, "../boot/boot.ts");

const cmdArgv = process.argv.slice(2);

const child = spawn(tsxFilename, [bootFilename, ...cmdArgv], {
  stdio: "inherit",
});

child.on("close", () => {
  const exitCode = child.exitCode;
  if (typeof exitCode == "number") process.exitCode = exitCode;
});
