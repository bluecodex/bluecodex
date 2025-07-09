import chalk from "chalk";
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";

import { runCommand } from "../command/run-command";

type RawCmd = string | (null | 0 | false | string | RawCmd)[];

function rawCmdToStringSplit(rawCmd: RawCmd): string[] {
  // each part may be a string with argv separated by space
  if (Array.isArray(rawCmd)) {
    return rawCmd.flat().filter(Boolean).join(" ").split(" ");
  }

  return rawCmd.split(" ");
}

function logRun(name: string, argv: string[]) {
  console.log(chalk.dim(`> ${chalk.yellowBright(name)} ${argv.join(" ")}`));
}

function commandOrLocalBin(bin: string) {
  try {
    return execSync(`which ${bin}`, { encoding: "utf-8" }).trim();
  } catch (error) {
    const binPath = `node_modules/.bin/${bin}`;
    if (fs.existsSync(binPath)) return binPath;
  }
}

/**
 * Runs a command asynchronously and returns the exit code
 */
export function run(cmd: RawCmd): Promise<number> {
  const [bin, ...argv] = rawCmdToStringSplit(cmd);
  logRun(bin, argv);

  return new Promise<number>((resolve) => {
    const resolvedCommand = commandOrLocalBin(bin);
    if (!resolvedCommand) {
      console.log(`Binary ${chalk.yellowBright(bin)} not found`);
      resolve(1);
      return;
    }

    const child = spawn(resolvedCommand, argv, { stdio: "inherit" });

    child.on("close", (code) => {
      resolve(code ?? 1);
    });

    child.on("error", () => {
      resolve(1);
    });
  });
}

run.command = async (cmd: RawCmd): Promise<number> => {
  const [name, ...argv] = rawCmdToStringSplit(cmd);

  logRun(name, argv);
  await runCommand(name, argv);
  return 0;
};
