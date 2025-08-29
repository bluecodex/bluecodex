#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function findTsxPath() {
  for (let i = 0; i < 5; i++) {
    const binPath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../".repeat(i),
      "node_modules/.bin/tsx",
    );

    try {
      await fs.access(binPath, fs.constants.F_OK);
      return binPath;
    } catch {}
  }

  console.error("Unable to find tsx to initialize bluecodex");
  process.exit(1);
}

const tsxPath = await findTsxPath();

const bootFilePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../boot/boot.ts",
);

const cmdArgv = process.argv.slice(2);

const child = spawn(tsxPath, [bootFilePath, ...cmdArgv], { stdio: "inherit" });

child.on("close", () => {
  const exitCode = child.exitCode;
  if (typeof exitCode == "number") process.exitCode = exitCode;
});
