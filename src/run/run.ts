import type { LooseArgv } from "./loose-argv";
import { resolveRunTarget } from "./resolve-run-target";
import type { RunResult } from "./run-result";
import { spawnRunTarget } from "./spawn-run-target";
import { SpawnStdOption } from "./spawn-std-option";
import { tightenLooseArgv } from "./tighten-loose-argv";

/**
 * Calls an executable or bluecodex command asynchronously with `stdio: 'inherit'`
 * and returns its exit code.
 *
 * This method enables TTY support by forwarding stdio directly to the terminal,
 * so command output is displayed live and not captured programmatically.
 *
 * If you need the output use `run.withResult` instead
 */
export async function run(
  looseArgv: LooseArgv,
): Promise<Pick<RunResult, "exitCode" | "failed">> {
  const runTarget = await resolveRunTarget(tightenLooseArgv(looseArgv));
  const result = await spawnRunTarget({
    runTarget,
    stdOption: SpawnStdOption.tty,
  });

  return { exitCode: result.exitCode, failed: result.failed };
}

/**
 * Calls an executable or bluebodex command asynchronously and returns its result.
 *
 * Note: Commands run with this function do **not** have TTY enabled.
 * If TTY behavior is required (e.g. for interactive prompts), use `run` instead.
 */
run.withResult = async (looseArgv: LooseArgv): Promise<RunResult> => {
  const runTarget = await resolveRunTarget(tightenLooseArgv(looseArgv));
  const result = await spawnRunTarget({
    runTarget,
    stdOption: SpawnStdOption.pipeAndInherit,
  });

  return result;
};
