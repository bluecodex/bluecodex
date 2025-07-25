import type { RawCmd } from "./raw-cmd";
import { resolveRunTargetFromRawCmd } from "./resolve-run-target-from-raw-cmd";
import type { RunResult } from "./run-result";
import { spawnRunTarget } from "./spawn-run-target";
import { SpawnStdOption } from "./spawn-std-option";

/**
 * Executes a binary or BlueCodex command asynchronously and returns its result.
 *
 * Note: Commands run with this function do **not** have TTY enabled.
 * If TTY behavior is required (e.g. for interactive prompts), use `run.tty` instead.
 */
export async function run(rawCmd: RawCmd): Promise<RunResult> {
  const runTarget = await resolveRunTargetFromRawCmd(rawCmd);
  const result = await spawnRunTarget({
    runTarget,
    stdOption: SpawnStdOption.pipeAndInherit,
  });

  return result;
}

/**
 * Executes a binary or BlueCodex command asynchronously with `stdio: 'inherit'`
 * and returns its exit code.
 *
 * This method enables TTY support by forwarding stdio directly to the terminal,
 * so command output is displayed live and not captured programmatically.
 */
run.tty = async (
  rawCmd: RawCmd,
): Promise<Pick<RunResult, "exitCode" | "failed">> => {
  const runTarget = await resolveRunTargetFromRawCmd(rawCmd);
  const result = await spawnRunTarget({
    runTarget,
    stdOption: SpawnStdOption.tty,
  });

  return { exitCode: result.exitCode, failed: result.failed };
};
