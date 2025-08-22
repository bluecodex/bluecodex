#!/usr/bin/env node
import { spawn } from "node:child_process";

import { findProjectRoot } from "../boot/find-project-root";
import { file } from "../file/file";
import { getLinks } from "../link/get-links";

// This files resolves between the multiple ways in which bluecodex can be used.
//
// Bluecodex may be used in one of these ways (in order of priority):
// 1. Installed in this project
// 2. Linked through another project
//
// Before being copied this, this file is compiled transpiled file with no external deps

async function findBluecodexBin() {
  // Check 1. Installed in this project
  const projectRoot = await findProjectRoot();
  if (projectRoot) {
    const bin = file(projectRoot, "node_modules/.bin/bluecodex");
    if (await bin.exists()) return bin.path;
  }

  // Check 2. Linked through another project
  const linkedProjectPaths = await getLinks();

  for (const linkedProjectPath of linkedProjectPaths) {
    const bin = file(linkedProjectPath, "node_modules/.bin/bluecodex");
    if (await bin.exists()) return bin.path;
  }

  throw new Error("Unable to find bluecodex");
}

const bluecodexBin = await findBluecodexBin();

const child = spawn(bluecodexBin, process.argv.slice(2), { stdio: "inherit" });

child.on("close", () => {
  const exitCode = child.exitCode;
  if (typeof exitCode == "number") process.exitCode = exitCode;
});
