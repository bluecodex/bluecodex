#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const srcDirPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../",
);

const cmdArgv = process.argv.slice(2);

await spawn(
  `node_modules/.bin/bun`,
  [path.join(srcDirPath, "boot.ts"), ...cmdArgv],
  { stdio: "inherit" },
);
