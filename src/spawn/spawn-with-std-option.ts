import { execa } from "execa";

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
    __objectType__: "spawn-result",
    rawAll: all ?? null,
    rawStdout: stdout ?? null,
    rawStderr: stderr ?? null,
    exitCode: exitCode ?? null,
    failed,
  };
}
