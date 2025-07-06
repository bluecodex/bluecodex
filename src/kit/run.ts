import { spawn } from "node:child_process";

/**
 * Runs a command asynchronously and returns the exit code
 */
export function run(cmd: string) {
  const [command, ...args] = cmd.split(" ");

  return new Promise<number>((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Script exited with code ${code}.`));
      }
    });

    child.on("error", (code) => {
      reject(code);
    });
  });
}
