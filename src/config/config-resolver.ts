#!/usr/bin/env node
import which from "which";

import { findProjectRoot } from "../boot/find-project-root";
import { file } from "../file/file";
import { getLinks } from "../link/get-links";

// This file sits at `~/.config/bluecodex/resolver.js`
// and has the role of reconciling the multiple ways in which
// bluecodex is used.
//
// Bluecodex may be used in one of these ways (in order of priority):
// 1. Installed in this project
// 2. Installed globally
// 3. Linked through another project
//
// Before being copied this, this file is compiled transpiled file with no external deps

async function findBluecodexBin() {
  // Check 1. Installed in this project
  const projectRoot = await findProjectRoot();
  if (projectRoot) {
    const bin = file(projectRoot, "node_modules/.bin/bluecodex");
    if (await bin.exists()) return bin.path;
  }

  // Check 2. Installed globally
  if (await which("bluecodex", { nothrow: true })) return "bluecodex";

  // Check 3. Linked through another project
  const linkedProjectPaths = await getLinks();

  for (const linkedProjectPath of linkedProjectPaths) {
    const bin = file(linkedProjectPath, "node_modules/.bin/bluecodex");
    if (bin) return bin.path;
  }
}

try {
  const bluecodexBin = await findBluecodexBin();
  console.log(bluecodexBin);
  process.exitCode = 0;
} catch {
  process.exitCode = 1;
}
