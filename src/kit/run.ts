import { spawn } from "node:child_process";

import { runCommand } from "../command/run-command";

type RawCmd = string | (null | 0 | false | string)[];

function rawCmdToStringSplit(rawCmd: RawCmd): string[] {
  return (Array.isArray(rawCmd) ? rawCmd.join(" ") : rawCmd).split(" ");
}

/**
 * Runs a command asynchronously and returns the exit code
 */
export function run(cmd: RawCmd): Promise<number> {
  const [command, ...args] = rawCmdToStringSplit(cmd);

  return new Promise<number>((resolve) => {
    const child = spawn(command, args, { stdio: "inherit" });

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

  await runCommand(name, argv);
  return 0;
};
