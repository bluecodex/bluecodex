#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const srcDirPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../",
);

async function fileExists(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function findBunPath() {
  // When bluecodex is installed as a package
  const cwdPackageBin = "node_modules/.bin/bun";
  if (await fileExists(cwdPackageBin)) return cwdPackageBin;

  // When bluecodex is installed in another folder as a package
  const relativePackageBin = path.join(srcDirPath, "../node_modules/.bin/bun");
  if (await fileExists(relativePackageBin)) return relativePackageBin;
}

const bunPath = await findBunPath();

if (!bunPath) {
  console.error("Unable bluecodex package deps");
  process.exit(1);
}

const cmdArgv = process.argv.slice(2);

const child = spawn(
  bunPath,
  [path.join(srcDirPath, "boot/boot.ts"), ...cmdArgv],
  { stdio: "inherit" },
);

child.on("close", () => {
  const exitCode = child.exitCode;
  if (typeof exitCode == "number") process.exitCode = exitCode;
});
