import type { SpawnStdOption } from "./spawn-std-option";
import { spawnTarget } from "./spawn-target";
import type { SpawnTarget } from "./spawn-target";

export class Spawn {
  target(target: SpawnTarget, stdOption: SpawnStdOption) {
    return spawnTarget(target, stdOption);
  }
}
