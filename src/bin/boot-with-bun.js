#!/usr/bin/env node
import { execa } from "execa";
import path from "node:path";
import { fileURLToPath } from "node:url";

const srcDirPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../",
);

const cmdArgv = process.argv.slice(2);

const { exitCode } = await execa(
  `node_modules/.bin/bun`,
  [path.join(srcDirPath, "boot/boot.ts"), ...cmdArgv],
  { stdio: "inherit", reject: false },
);

process.exitCode = exitCode ?? 1;
