#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

async function fsExists(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveProjectBluecodexBin() {
  const cwd = process.cwd();

  for (let i = 0; i < 5; i++) {
    const binPath = path.join(
      cwd,
      "../".repeat(i),
      "node_modules/.bin/bluecodex",
    );

    if (await fsExists(binPath)) return binPath;
  }

  return null;
}

async function findBluecodexBin() {
  // Check 1. Installed in this project
  const projectBluecodexBinPath = await resolveProjectBluecodexBin();
  if (projectBluecodexBinPath) return projectBluecodexBinPath;

  // Check 2. Linked through another project
  const linksFilePath = path.join(os.homedir(), ".config/bluecodex/links.txt");

  let foundMissingProject = false;
  let hasLinks = false;
  if (await fsExists(linksFilePath)) {
    const linksContents = await fs.readFile(linksFilePath, {
      encoding: "utf-8",
    });

    const links = linksContents.split(/\r?\n/);
    if (links.length > 0) hasLinks = true;
    for (const link of links) {
      if (!(await fsExists(link))) {
        foundMissingProject = true;
        console.log(`[warning] The linked project ${link} no longer exists`);
        continue;
      }

      const binPath = path.join(link, "node_modules/.bin/bluecodex");
      if (await fsExists(binPath)) return binPath;
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
