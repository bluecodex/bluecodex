import { spawn } from "node:child_process";

import { runCommand } from "../command/run-command";

type RunFn = {
  (cmd: string): Promise<number>;
  command(cmd: string): Promise<number>;
};

/**
 * Runs a command asynchronously and returns the exit code
 */
export const run: RunFn = (cmd) => {
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
};

run.command = async (cmd) => {
  const [name, ...remainingArgv] = cmd.split(" ");

  await runCommand(name, remainingArgv);
  return 0;
};
