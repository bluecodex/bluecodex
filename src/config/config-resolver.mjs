#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

async function fsExists(filename) {
  try {
    await fs.access(filename, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveProjectBluecodexBinFilename() {
  const cwd = process.cwd();

  for (let i = 0; i < 5; i++) {
    const binFilename = path.join(
      cwd,
      "../".repeat(i),
      "node_modules/.bin/bluecodex",
    );

    if (await fsExists(binFilename)) return binFilename;
  }

  return null;
}

async function findBluecodexBin() {
  // Check 1. Installed in this project
  const projectBluecodexBinFilename =
    await resolveProjectBluecodexBinFilename();
  if (projectBluecodexBinFilename) return projectBluecodexBinFilename;

  // Check 2. Linked through another project
  const linksFilename = path.join(os.homedir(), ".config/bluecodex/links.txt");

  let hasLinks = false;
  if (await fsExists(linksFilename)) {
    const linksContents = await fs.readFile(linksFilename, {
      encoding: "utf-8",
    });

    const links = linksContents.split(/\r?\n/);
    if (links.length > 0) hasLinks = true;
    for (const link of links) {
      if (!(await fsExists(link))) {
        console.log(`[warning] The linked project ${link} no longer exists`);
        continue;
      }

      const binFilename = path.join(link, "node_modules/.bin/bluecodex");
      if (await fsExists(binFilename)) return binFilename;
    }
  }

  console.log("Unable to find bluecodex binary");
  if (hasLinks) {
    console.log(
      "Please check if you've installed dependencies on your linked projects",
    );
  } else {
    console.log(
      "Please add it as a dependency to this project or link another project",
    );
  }

  process.exit(1);
}

const bluecodexBin = await findBluecodexBin();

const child = spawn(bluecodexBin, process.argv.slice(2), { stdio: "inherit" });

child.on("close", () => {
  const exitCode = child.exitCode;
  if (typeof exitCode == "number") process.exitCode = exitCode;
});
