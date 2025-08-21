import stripAnsi from "strip-ansi";

import { SpawnStdOption } from "../spawn/spawn-std-option";
import { spawnTarget } from "../spawn/spawn-target";
import type { LooseArgv } from "./loose-argv";
import { runArgvToSpawnTarget } from "./run-argv-to-spawn-target";
import type { RunResult, RunResultWithOutput } from "./run-result";
import { tightenLooseArgv } from "./tighten-loose-argv";

/**
 * Calls an executable or bluecodex command asynchronously with `stdio: 'inherit'`
 * and returns its exit code.
 *
 * This method enables TTY support by forwarding stdio directly to the terminal,
 * so command output is displayed live and not captured programmatically.
 *
 * If you need the output use `run.withOutput` instead
 */
export async function run(looseArgv: LooseArgv): Promise<RunResult> {
  const target = await runArgvToSpawnTarget(looseArgv);
  const result = await spawnTarget(target, SpawnStdOption.tty);

  return {
    __objectType__: "run-result",
    exitCode: result.exitCode,
    failed: result.failed,
  };
}

/**
 * Calls an executable or bluecodex command asynchronously and returns its result.
 *
 * Note: Commands run with this function do **not** have TTY enabled.
 * If TTY behavior is required (e.g. for interactive prompts), use `run` instead.
 */
run.withOutput = async (looseArgv: LooseArgv): Promise<RunResultWithOutput> => {
  const target = await runArgvToSpawnTarget(tightenLooseArgv(looseArgv));
  const spawnResult = await spawnTarget(target, SpawnStdOption.pipeAndInherit);

  return {
    __objectType__: "run-result-with-output",
    all: stripAnsi(spawnResult.rawAll ?? ""),
    stdout: stripAnsi(spawnResult.rawStdout ?? ""),
    stderr: stripAnsi(spawnResult.rawStderr ?? ""),
    failed: spawnResult.failed,
    exitCode: spawnResult.exitCode,
  };
};
