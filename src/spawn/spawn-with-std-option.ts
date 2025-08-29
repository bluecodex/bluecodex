import { spawn } from "node:child_process";

import type { SpawnResult } from "./spawn-result";
import type { SpawnStdOption } from "./spawn-std-option";

type Args = {
  name: string;
  argv: string[];
  stdOption: SpawnStdOption;
};

export async function spawnWithStdOption({
  name,
  argv,
  stdOption,
}: Args): Promise<SpawnResult> {
  const { stdout, stderr, all, exitCode } = await new Promise<{
    all: string;
    stdout: string;
    stderr: string;
    exitCode: number | null;
  }>((resolve) => {
    const child =
      stdOption === "tty"
        ? spawn(name, argv, {
            stdio: "inherit",
          })
        : spawn(name, argv, {
            stdio: "pipe",
            env: { ...process.env, FORCE_COLOR: "1" },
          });

    let allAccumulator = "";
    let stdoutAccumulator = "";
    let stdErrAccumulator = "";

    child.stdout?.on("data", (data) => {
      allAccumulator += data;
      stdoutAccumulator += data;

      process.stdout.write(data);
    });

    child.stderr?.on("data", (data) => {
      allAccumulator += data;
      stdErrAccumulator += data;

      process.stderr.write(data);
    });

    child.on("exit", (exitCode) => {
      resolve({
        all: allAccumulator,
        stdout: stdoutAccumulator,
        stderr: stdErrAccumulator,
        exitCode,
      });
    });
  });

  return {
    __objectType__: "spawn-result",
    rawAll: all ?? null,
    rawStdout: stdout ?? null,
    rawStderr: stderr ?? null,
    exitCode: exitCode ?? null,
    failed: exitCode === 0 ? false : stderr !== "",
  };
}
