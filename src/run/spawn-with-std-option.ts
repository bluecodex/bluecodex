import { execa } from "execa";
import stripAnsi from "strip-ansi";

import type { RunResult } from "./run-result";
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
}: Args): Promise<RunResult> {
  const { stdout, stderr, all, exitCode, failed } = await execa(name, argv, {
    all: true,
    ...(stdOption === "tty"
      ? { stdio: "inherit" }
      : {
          stdin: "inherit",
          stdout: ["pipe", "inherit"],
          stderr: ["pipe", "inherit"],
        }),
    reject: false,
    env: { FORCE_COLOR: "1" },
  });

  return {
    output: stripAnsi(all ?? ""),
    stdout: stripAnsi(stdout ?? ""),
    stderr: stripAnsi(stderr ?? ""),
    exitCode: exitCode ?? null,
    failed,
  };
}
