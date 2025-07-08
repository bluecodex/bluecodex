import { spawn } from "node:child_process";

import { runCommand } from "../command/run-command";

/**
 * Runs a command asynchronously and returns the exit code
 */
export function run(cmd: string): Promise<number> {
  const [command, ...args] = cmd.split(" ");

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

run.command = async (cmd: string): Promise<number> => {
  const [name, ...remainingArgv] = cmd.split(" ");

  await runCommand(name, remainingArgv);
  return 0;
};
