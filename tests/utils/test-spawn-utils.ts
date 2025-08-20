import { expect, vi } from "vitest";

import { ioc } from "../../src/ioc";
import type { LooseArgv } from "../../src/run/loose-argv";
import { run } from "../../src/run/run";
import type { SpawnStdOption } from "../../src/spawn/spawn-std-option";
import type { SpawnTarget } from "../../src/spawn/spawn-target";

export async function expectRunSpawnTarget(
  looseArgv: LooseArgv,
  spawnTarget: SpawnTarget,
  stdOption: SpawnStdOption,
) {
  const spy = vi.spyOn(ioc.spawn, "target").mockResolvedValueOnce({
    __objectType__: "spawn-result",
    failed: false,
    exitCode: 0,
    rawAll: "",
    rawStderr: "",
    rawStdout: "",
  });

  await run(looseArgv);

  expect(spy).toHaveBeenCalledExactlyOnceWith(spawnTarget, stdOption);
}
